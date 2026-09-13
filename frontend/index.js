//THEME BOTTON WORK 
const themebtn = document.getElementById("themebtn");
themebtn.addEventListener("click", function(){

    const isdark = document.documentElement.getAttribute(

        "data-theme") === "dark";

        if(isdark)
            { document.documentElement.removeAttribute(
            "data-theme");
            themebtn.textContent = "Dark mode";
        } else {
            document.documentElement.setAttribute(
                "data-theme", "dark");
                themebtn.textContent = "Light mode";
            
        }
});

//ADDING IMAGE WORK
const insertimg = document.getElementById("insertimg");
const imgcanvas = document.getElementById("imgcanvas");
const cxt = imgcanvas.getContext("2d");
const placeholder = document.getElementById("placeholder");

insertimg.addEventListener("change", function(){
    const file = insertimg.files[0];

    if(!file) return;

    const image = new Image();
    image.onload = function (){
        imgcanvas.width = image.width;
        imgcanvas.height = image.height;

        cxt.drawImage(image, 0, 0);

        placeholder.style.display = "none";
    };

    image.src = URL.createObjectURL(file);
});

// GRAYSCALE BUTTON
const grayscaleBtn = document.getElementById("grayscaleBtn");

grayscaleBtn.addEventListener("click", async function () {

    imgcanvas.toBlob(async function(blob) {

        const formData = new FormData();

        formData.append("image", blob, "image.png");

        const response = await fetch(
            "http://127.0.0.1:5000/grayscale",
            {
                method: "POST",
                body: formData
            }
        );

        const resultBlob = await response.blob();

        const imageURL = URL.createObjectURL(resultBlob);

        const grayImage = new Image();

        grayImage.onload = function() {

            cxt.clearRect(
                0,
                0,
                imgcanvas.width,
                imgcanvas.height
            );

            cxt.drawImage(grayImage, 0, 0);

            URL.revokeObjectURL(imageURL);
        };

        grayImage.src = imageURL;

    }, "image/png");

});

//BLUR BOTTON
const blurBtn = document.getElementById("blurBtn");

blurBtn.addEventListener("click", async function () {

    console.log("Blur button clicked");

    imgcanvas.toBlob(async function(blob) {

        const formData = new FormData();

        formData.append("image", blob, "image.png");

        const response = await fetch(
            "http://127.0.0.1:5000/blur",
            {
                method: "POST",
                body: formData
            }
        );

        const resultBlob = await response.blob();

        const imageURL = URL.createObjectURL(resultBlob);

        const blurredImage = new Image();

        blurredImage.onload = function() {

            cxt.clearRect(
                0,
                0,
                imgcanvas.width,
                imgcanvas.height
            );

            cxt.drawImage(
                blurredImage,
                0,
                0,
                imgcanvas.width,
                imgcanvas.height
            );

            URL.revokeObjectURL(imageURL);
        };

        blurredImage.src = imageURL;

    }, "image/png");

});