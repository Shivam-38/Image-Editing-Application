"""
EDOS backend - Flask + OpenCV image processing server.

Run with:
    pip install flask flask-cors opencv-python numpy
    python app.py

Server runs on http://127.0.0.1:5000
"""

import base64
import cv2
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # allow requests from the HTML/JS frontend (different origin/file)


# ---------- helpers: base64 <-> OpenCV image ----------

def b64_to_cv2(b64_string):
    """Decode a 'data:image/...;base64,....' string into an OpenCV (BGR) image."""
    if "," in b64_string:
        b64_string = b64_string.split(",", 1)[1]
    img_bytes = base64.b64decode(b64_string)
    np_arr = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("Could not decode image")
    return img


def cv2_to_b64(img):
    """Encode an OpenCV image back into a 'data:image/png;base64,....' string."""
    success, buffer = cv2.imencode(".png", img)
    if not success:
        raise ValueError("Could not encode image")
    b64_string = base64.b64encode(buffer).decode("utf-8")
    return f"data:image/png;base64,{b64_string}"


# ---------- image operations ----------

def op_grayscale(img, params):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    return cv2.cvtColor(gray, cv2.COLOR_GRAY2BGR)  # keep 3 channels for consistency


def op_blur(img, params):
    ksize = int(params.get("strength", 7))
    if ksize % 2 == 0:
        ksize += 1  # kernel size must be odd
    ksize = max(1, ksize)
    return cv2.GaussianBlur(img, (ksize, ksize), 0)


def op_sharpen(img, params):
    kernel = np.array([[0, -1, 0],
                        [-1, 5, -1],
                        [0, -1, 0]])
    return cv2.filter2D(img, -1, kernel)


def op_edge(img, params):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    low = int(params.get("low", 100))
    high = int(params.get("high", 200))
    edges = cv2.Canny(gray, low, high)
    return cv2.cvtColor(edges, cv2.COLOR_GRAY2BGR)


def op_rotate(img, params):
    angle = float(params.get("angle", 90))
    (h, w) = img.shape[:2]
    center = (w // 2, h // 2)
    matrix = cv2.getRotationMatrix2D(center, angle, 1.0)

    # compute new bounding dimensions so the rotated image isn't cropped
    cos = np.abs(matrix[0, 0])
    sin = np.abs(matrix[0, 1])
    new_w = int((h * sin) + (w * cos))
    new_h = int((h * cos) + (w * sin))
    matrix[0, 2] += (new_w / 2) - center[0]
    matrix[1, 2] += (new_h / 2) - center[1]

    return cv2.warpAffine(img, matrix, (new_w, new_h))


def op_resize(img, params):
    width = params.get("width")
    height = params.get("height")
    scale = params.get("scale")

    if scale:
        scale = float(scale)
        width = int(img.shape[1] * scale)
        height = int(img.shape[0] * scale)
    else:
        width = int(width) if width else img.shape[1]
        height = int(height) if height else img.shape[0]

    return cv2.resize(img, (max(1, width), max(1, height)), interpolation=cv2.INTER_AREA)


def op_crop(img, params):
    h, w = img.shape[:2]
    x = int(params.get("x", 0))
    y = int(params.get("y", 0))
    crop_w = int(params.get("width", w))
    crop_h = int(params.get("height", h))

    x2 = min(w, x + crop_w)
    y2 = min(h, y + crop_h)
    x = max(0, min(x, w - 1))
    y = max(0, min(y, h - 1))

    cropped = img[y:y2, x:x2]
    if cropped.size == 0:
        raise ValueError("Crop region is empty")
    return cropped


OPERATIONS = {
    "grayscale": op_grayscale,
    "blur": op_blur,
    "sharpen": op_sharpen,
    "edge": op_edge,
    "rotate": op_rotate,
    "resize": op_resize,
    "crop": op_crop,
}


# ---------- routes ----------

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


@app.route("/process", methods=["POST"])
def process_image():
    """
    Expects JSON body:
    {
        "image": "data:image/png;base64,....",
        "operation": "grayscale" | "blur" | "sharpen" | "edge" | "rotate" | "resize" | "crop",
        "params": { ... operation-specific options ... }
    }
    Returns JSON: { "image": "data:image/png;base64,...." }
    """
    data = request.get_json(silent=True)
    if not data or "image" not in data or "operation" not in data:
        return jsonify({"error": "Missing 'image' or 'operation' in request body"}), 400

    operation = data["operation"]
    params = data.get("params", {}) or {}

    if operation not in OPERATIONS:
        return jsonify({"error": f"Unknown operation '{operation}'"}), 400

    try:
        img = b64_to_cv2(data["image"])
        result_img = OPERATIONS[operation](img, params)
        result_b64 = cv2_to_b64(result_img)
        return jsonify({"image": result_b64})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)