from flask import Flask, request, send_file
from flask_cors import CORS
import cv2
import numpy as np
import io

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return "Flask server is running!"


@app.route("/grayscale", methods=["POST"])
def grayscale():

    print("Grayscale request received")

    file = request.files["image"]

    file_bytes = np.frombuffer(file.read(), np.uint8)

    image = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    success, encoded_image = cv2.imencode(".png", gray)

    if not success:
        return "Image processing failed", 500

    return send_file(
        io.BytesIO(encoded_image.tobytes()),
        mimetype="image/png"
    )


if __name__ == "__main__":
    app.run(debug=True)

# BLUR BOTTON
@app.route("/blur", methods=["POST"])
def blur():

    print("Blur request received")

    # Get image from frontend
    file = request.files["image"]

    # Convert file to NumPy array
    file_bytes = np.frombuffer(file.read(), np.uint8)

    # Convert NumPy array to OpenCV image
    image = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

    # Apply blur
    blurred = cv2.GaussianBlur(image, (15, 15), 0)

    # Convert back to PNG
    success, encoded_image = cv2.imencode(".png", blurred)

    if not success:
        return "Image processing failed", 500

    # Send image back to frontend
    return send_file(
        io.BytesIO(encoded_image.tobytes()),
        mimetype="image/png"
    )
if __name__ == "__main__":
    app.run(debug=True)