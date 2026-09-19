const imgcanvas = document.getElementById("imgcanvas")
imgcanvas.addEventListener("mousemove",function(event){
    document.getElementById("location").innerHTML = 
    "X:" + event.clientX + "Y:" + event.clientY;
});