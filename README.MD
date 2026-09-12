# 🖼️ Image Editing App

A web-based image editing application that allows users to **upload, preview, crop, apply filters, and download images**.

This project is being built to learn how a **frontend application communicates with a Python backend** and how **OpenCV and NumPy** can be used for image processing.

---

## 🚀 Features

### 📤 Image Upload

* Upload an image directly from your computer.
* Preview the selected image in the browser.
* Basic image validation.

### ✂️ Image Cropping

* Select an area of the image using the mouse.
* Display a crop-selection rectangle.
* Send crop coordinates to the Python backend.
* Crop the image using OpenCV.

### 🎨 Image Filters

Planned filters include:

* Original
* Grayscale
* Blur
* Brightness
* Contrast
* Sharpen
* Edge Detection
* Sepia-style filter

### 🔄 Image Controls

Planned controls include:

* Reset
* Undo
* Redo
* Rotate
* Resize

### 💾 Download

* Download the final edited image to your computer.

### 📱 Responsive Interface

The application will be designed to work on:

* 💻 Desktop / Windows
* 📱 Mobile phones
* 📟 Different screen sizes

---

# 🛠️ Technologies Used

## Frontend

* HTML5
* CSS3
* JavaScript
* Canvas API
* Fetch API

## Backend

* Python
* Flask

## Image Processing

* OpenCV
* NumPy

---

# 🏗️ Project Architecture

```text
                    IMAGE EDITING APP
                           │
                           ▼
                    ┌─────────────┐
                    │  FRONTEND   │
                    │ HTML/CSS/JS │
                    └──────┬──────┘
                           │
                     Fetch API
                           │
                           ▼
                    ┌─────────────┐
                    │    FLASK    │
                    │  REST API   │
                    └──────┬──────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │ Python + OpenCV │
                  │    + NumPy      │
                  └────────┬────────┘
                           │
                           ▼
                    Processed Image
                           │
                           ▼
                       Frontend
```

---

# 📁 Project Structure

```text
image-editor/
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── backend/
│   ├── app.py
│   ├── image_processor.py
│   └── processed/
│
├── README.md
└── requirements.txt
```

---

# ⚙️ How It Works

### 1. User uploads an image

```text
User
 ↓
Select Image
 ↓
JavaScript
 ↓
Image Preview
```

### 2. User edits the image

For example, the user selects a crop area.

```text
Mouse Selection
       ↓
JavaScript
       ↓
Crop Coordinates
```

### 3. Frontend sends data to backend

JavaScript uses the **Fetch API**:

```text
JavaScript
     │
     │ HTTP Request
     ▼
   Flask
```

### 4. Flask sends the image to OpenCV

```text
Flask
 ↓
Python
 ↓
OpenCV
 ↓
Image Processing
```

### 5. Processed image is returned

```text
OpenCV
   ↓
Flask
   ↓
JavaScript
   ↓
Updated Image
```

---

# 🔌 Planned API Endpoints

| Method | Endpoint     | Purpose                 |
| ------ | ------------ | ----------------------- |
| `POST` | `/upload`    | Upload an image         |
| `POST` | `/crop`      | Crop an image           |
| `POST` | `/filter`    | Apply a filter          |
| `POST` | `/transform` | Rotate/resize image     |
| `POST` | `/reset`     | Reset image             |
| `GET`  | `/image`     | Get the processed image |

---

# 🧠 Image Processing

OpenCV will be responsible for the main image-processing operations.

### Grayscale

```python
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
```

### Blur

```python
blur = cv2.GaussianBlur(image, (15, 15), 0)
```

### Resize

```python
resized = cv2.resize(image, (800, 800))
```

### Edge Detection

```python
edges = cv2.Canny(image, 100, 200)
```

NumPy will be used for operations such as image slicing and pixel manipulation.

---

# 📚 Learning Goals

This project is also a learning project.

Through it, I am learning:

### Frontend

* HTML
* CSS
* JavaScript
* DOM manipulation
* JavaScript events
* Canvas
* File handling
* Fetch API
* HTTP requests

### Backend

* Python
* Flask
* REST APIs
* GET and POST requests
* JSON
* File uploads
* Frontend/backend communication

### Computer Vision

* OpenCV
* NumPy
* Image arrays
* Image channels
* Image cropping
* Image filtering
* Pixel manipulation

---

# 🗺️ Development Roadmap

## Phase 1 — Frontend

* [x] Create project structure
* [ ] Create HTML interface
* [ ] Style the application
* [ ] Add image upload
* [ ] Display image preview

## Phase 2 — Canvas Editor

* [ ] Add canvas
* [ ] Display image on canvas
* [ ] Detect mouse events
* [ ] Create crop selection
* [ ] Fix coordinate mapping
* [ ] Preview cropped image

## Phase 3 — Flask Backend

* [ ] Create Flask application
* [ ] Create basic routes
* [ ] Learn GET and POST
* [ ] Create API endpoints
* [ ] Connect JavaScript with Flask

## Phase 4 — OpenCV

* [ ] Receive image from frontend
* [ ] Read image using OpenCV
* [ ] Crop image
* [ ] Resize image
* [ ] Apply filters
* [ ] Return processed image

## Phase 5 — Editing Features

* [ ] Grayscale
* [ ] Blur
* [ ] Brightness
* [ ] Contrast
* [ ] Sharpen
* [ ] Edge detection
* [ ] Rotate
* [ ] Reset
* [ ] Undo/Redo

## Phase 6 — Final UI

* [ ] Responsive design
* [ ] Loading indicator
* [ ] Error handling
* [ ] Better buttons and controls
* [ ] Download button
* [ ] Mobile support

## Phase 7 — Deployment

* [ ] Prepare production backend
* [ ] Deploy frontend
* [ ] Deploy Flask backend
* [ ] Connect production frontend and backend
* [ ] Test on different devices

---

# 🔧 Installation

Clone the project:

```bash
git clone <your-repository-url>
```

Go into the backend directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install flask opencv-python numpy
```

Or install everything from:

```bash
pip install -r requirements.txt
```

Start the Flask server:

```bash
python app.py
```

---

# 📦 Requirements

The project will use:

```text
Flask
opencv-python
numpy
```

A `requirements.txt` file can contain:

```text
Flask
opencv-python
numpy
```

---

# 🔐 Important Design Considerations

The application should:

* Validate uploaded files.
* Limit extremely large images.
* Avoid overwriting the original image.
* Keep the original image available for reset.
* Handle invalid crop coordinates.
* Handle unsupported image formats.
* Return useful error messages.
* Avoid unnecessary image processing requests.

---

# 🎯 Future Improvements

Possible future features:

* Multiple filters
* Filter intensity sliders
* Brightness/contrast sliders
* Rotation controls
* Image compression
* Multiple image formats
* Undo/redo history
* Drag-and-drop upload
* Dark mode
* Image comparison before/after
* User accounts
* Saved projects
* Cloud storage
* AI-powered editing features

---

# 👨‍💻 Project Status

🚧 **Currently in development**

This project is being developed step-by-step while learning:

**JavaScript → Fetch API → Flask → OpenCV → Full-stack integration**

---

# 📄 License

