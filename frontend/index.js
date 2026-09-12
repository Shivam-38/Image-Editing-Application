const toggleBtn = document.querySelector('.card button'); // target your dark mode button specifically, give it an id ideally

document.getElementById('darkModeToggle').addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
});

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const fileInput = document.getElementById('insertimg');
const placeholder = document.querySelector('.canvas-placeholder');

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = new Image();
    const reader = new FileReader();

    reader.onload = (event) => {
        img.src = event.target.result;
    };

    img.onload = () => {
        // Resize canvas to match image (capped to container width)
        const containerWidth = canvas.parentElement.clientWidth;
        let drawWidth = img.width;
        let drawHeight = img.height;

        if (drawWidth > containerWidth) {
            const scale = containerWidth / drawWidth;
            drawWidth = containerWidth;
            drawHeight = img.height * scale;
        }

        canvas.width = drawWidth;
        canvas.height = drawHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, drawWidth, drawHeight);

        // hide placeholder once image is drawn
        if (placeholder) placeholder.style.display = 'none';
    };

    reader.readAsDataURL(file);
});