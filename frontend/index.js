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
constinsertimg = document.getElementById("insertimg");
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
    }--+\;

    image.src = URL.createObjectURL(file);
});