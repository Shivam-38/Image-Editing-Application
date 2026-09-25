// ===== EDOS frontend: talks to the Flask + OpenCV backend on http://127.0.0.1:5000 =====

const API_URL = "http://127.0.0.1:5000/process";

const canvas = document.getElementById("imgcanvas");
const ctx = canvas.getContext("2d");
const fileInput = document.getElementById("insertimg");
const locationText = document.getElementById("location");

// keep the current image as a base64 data URL — this is what we send to the backend
let currentImageData = null;

// history stack so "Save" / undo-style flows have something to work from later
const history = [];

// ---------- canvas <-> image helpers ----------

function drawImageOnCanvas(dataUrl) {
  const img = new Image();
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    currentImageData = dataUrl;
  };
  img.src = dataUrl;
}

function getCanvasAsDataUrl() {
  return canvas.toDataURL("image/png");
}

// ---------- talking to the backend ----------

async function sendToBackend(operation, params = {}) {
  if (!currentImageData) {
    alert("Please open an image first.");
    return;
  }

  setLoading(true);
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image: currentImageData,
        operation,
        params,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Server error");
    }

    history.push(currentImageData); // remember previous state
    drawImageOnCanvas(data.image);
  } catch (err) {
    console.error(err);
    alert(`Something went wrong: ${err.message}\n\nIs the Flask server running on port 5000?`);
  } finally {
    setLoading(false);
  }
}

function setLoading(isLoading) {
  document.body.style.cursor = isLoading ? "wait" : "default";
  if (locationText) {
    locationText.textContent = isLoading ? "Processing..." : "";
  }
}

// ---------- file open (New button) ----------

fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (evt) => {
    drawImageOnCanvas(evt.target.result);
    history.length = 0; // reset history on new image
  };
  reader.readAsDataURL(file);
});

// ---------- toolbar buttons ----------

// Grab all buttons up front so we can wire them by their visible text
// (works even without needing to add id="" to every single one in the HTML)
function getButtonByText(text) {
  return Array.from(document.querySelectorAll("button")).find((btn) =>
    btn.textContent.trim().toLowerCase().includes(text.toLowerCase())
  );
}

// --- TOOLS ---
const cropBtn = getButtonByText("crop");
const rotateBtn = getButtonByText("rotate");
const resizeBtn = getButtonByText("resize");

cropBtn?.addEventListener("click", () => {
  if (!currentImageData) return alert("Open an image first.");
  const x = parseInt(prompt("Crop X (from left, px):", "0"), 10) || 0;
  const y = parseInt(prompt("Crop Y (from top, px):", "0"), 10) || 0;
  const width = parseInt(prompt("Crop width (px):", canvas.width), 10) || canvas.width;
  const height = parseInt(prompt("Crop height (px):", canvas.height), 10) || canvas.height;
  sendToBackend("crop", { x, y, width, height });
});

rotateBtn?.addEventListener("click", () => {
  const angle = parseFloat(prompt("Rotate angle (degrees):", "90")) || 90;
  sendToBackend("rotate", { angle });
});

resizeBtn?.addEventListener("click", () => {
  const width = parseInt(prompt("New width (px):", canvas.width), 10) || canvas.width;
  const height = parseInt(prompt("New height (px):", canvas.height), 10) || canvas.height;
  sendToBackend("resize", { width, height });
});

// --- FILTERS ---
const originalBtn = getButtonByText("original");
const grayscaleBtn = document.getElementById("grayscaleBtn") || getButtonByText("grayscale");
const blurBtn = document.getElementById("blurBtn") || getButtonByText("blur");
const sharpenBtn = getButtonByText("sharpen");
const edgeBtn = getButtonByText("edge");

originalBtn?.addEventListener("click", () => {
  if (history.length > 0) {
    drawImageOnCanvas(history[0]); // go back to the very first loaded image
  }
});

grayscaleBtn?.addEventListener("click", () => sendToBackend("grayscale"));

blurBtn?.addEventListener("click", () => {
  const strength = parseInt(prompt("Blur strength (odd number, e.g. 7):", "7"), 10) || 7;
  sendToBackend("blur", { strength });
});

sharpenBtn?.addEventListener("click", () => sendToBackend("sharpen"));

edgeBtn?.addEventListener("click", () => {
  const low = parseInt(prompt("Canny low threshold:", "100"), 10) || 100;
  const high = parseInt(prompt("Canny high threshold:", "200"), 10) || 200;
  sendToBackend("edge", { low, high });
});

// --- Header buttons: Open / Save / Download ---
const openBtn = getButtonByText("open");
const saveBtn = getButtonByText("save");
const downloadBtn = getButtonByText("download");

openBtn?.addEventListener("click", () => fileInput.click());

saveBtn?.addEventListener("click", () => {
  if (!currentImageData) return alert("Nothing to save yet.");
  localStorage.setItem("edos_saved_image", currentImageData);
  alert("Image saved in browser storage.");
});

downloadBtn?.addEventListener("click", () => {
  if (!currentImageData) return alert("Open an image first.");
  const link = document.createElement("a");
  link.download = "edited-image.png";
  link.href = getCanvasAsDataUrl();
  link.click();
});

// --- SETTINGS: theme toggle ---
const themeBtn = document.getElementById("themebtn");
themeBtn?.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  themeBtn.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
});

// --- About buttons (both the settings card one and the footer one) ---
document.querySelectorAll("button, p").forEach((el) => {
  if (el.textContent.trim().toLowerCase().includes("about")) {
    el.addEventListener("click", () => {
      alert("EDOS — Simple tools for smarter image processing.\nBuilt with JavaScript (Canvas) + Python (Flask/OpenCV).");
    });
  }
});