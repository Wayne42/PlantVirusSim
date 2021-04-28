// throttle function to prevent functions spamming too much and killing performance
// (function, ms, null)
function throttle(t, u, a) {
    var e, i, r, o = null,
        c = 0;
    a = a || {};

    function p() {
        c = !1 === a.leading ? 0 : Date.now(), o = null, r = t.apply(e, i), o || (e = i = null)
    }
    return function () {
        var n = Date.now();
        c || !1 !== a.leading || (c = n);
        var l = u - (n - c);
        return e = this, i = arguments, l <= 0 || u < l ? (o && (clearTimeout(o), o = null), c = n, r = t.apply(e, i), o || (e = i = null)) : o || !1 === a.trailing || (o = setTimeout(p, l)), r
    }
}


// scroll functions
let Body = document.body;
let lastScrollTop = 0;
function scrollFunc() {
    var e = window.pageYOffset || document.documentElement.scrollTop,
        t = Body.offsetHeight;
    Body.classList.remove("scrolling-none"), 0 === e ? (Body.classList.remove("scroll-foot"), Body.classList.add("scroll-head")) : window.innerHeight + window.scrollY >= t && (Body.classList.remove("scroll-head"), Body.classList.add("scroll-foot")), 0 < e && e <= t && (Body.classList.remove("scroll-head"), Body.classList.remove("scroll-foot")), 300 < e ? (Body.classList.remove("scroll-lt-300"), Body.classList.add("scroll-gt-300")) : (Body.classList.remove("scroll-gt-300"), Body.classList.add("scroll-lt-300")), 1200 < e ? (Body.classList.remove("scroll-lt-1200"), Body.classList.add("scroll-gt-1200")) : (Body.classList.remove("scroll-gt-1200"), Body.classList.add("scroll-lt-1200")), 1500 < e ? (Body.classList.remove("scroll-lt-1500"), Body.classList.add("scroll-gt-1500")) : (Body.classList.remove("scroll-gt-1500"), Body.classList.add("scroll-lt-1500")), e > lastScrollTop ? (Body.classList.remove("scrolling-up"), Body.classList.add("scrolling-down"), 50 < e && Body.classList.remove("menu-open")) : e < lastScrollTop ? (Body.classList.remove("scrolling-down"), Body.classList.add("scrolling-up"), Body.classList.remove("menu-open")) : e === lastScrollTop && Body.classList.add("scrolling-none"), lastScrollTop = e <= 0 ? 0 : e, e > screen.height ? (Body.classList.remove("scroll-lt-screenheight"), Body.classList.add("scroll-gt-screenheight")) : (Body.classList.remove("scroll-gt-screenheight"), Body.classList.add("scroll-lt-screenheight"))
}

window.addEventListener("scroll", throttle(scrollFunc, 150, null), {
    passive: !0
}), window.addEventListener("resize", throttle(scrollFunc, 80, null));

document.addEventListener("DOMContentLoaded", function () {
    scrollFunc();
});


// draw functions
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

function writeMessage(message, x, y) {
    context.font = "18pt Calibri";
    context.fillStyle = "black";
    context.fillText(message, x, y);
}

function drawCircle(
    centerX,
    centerY,
    radius,
    fillC = "white",
    strokeC = "black"
) {
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    context.fillStyle = fillC;
    context.fill();
    context.lineWidth = 5;
    context.strokeStyle = strokeC || "#003300";
    context.stroke();
}

function drawRect(
    centerX,
    centerY,
    width,
    height,
    fillC = "white",
    strokeC = "black"
) {
    context.beginPath();
    context.lineWidth = 2;
    context.fillStyle = fillC || "white";
    context.strokeStyle = strokeC;
    context.rect(centerX, centerY, width, height);
    context.stroke();
    context.fill();
}



// html listener and functions
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top,
    };
}
let info = document.getElementById("INFO");
canvas.addEventListener(
    "mousemove",
    function (evt) {
        var mousePos = getMousePos(canvas, evt);
        let clientWidth = document.body.clientWidth;
        let canvasWidth = canvas.width;

        let factor = (clientWidth / canvasWidth) * _scale;
        //console.log(message);
        for (let i = 0; i < PlantsArray.length; i++) {
            if (
                mousePos.x <=
                (PlantsArray[i].XPos + PlantsArray[i].radius + netPanningX) * factor
            ) {
                if (
                    mousePos.y <=
                    (PlantsArray[i].YPos + PlantsArray[i].radius + netPanningY) * factor
                ) {
                    // console.log(PlantsArray[i]);
                    var message =
                        PlantsArray[i].id +
                        " is alive: " +
                        PlantsArray[i].alive +
                        "<br>" +
                        " waterlevel: " +
                        PlantsArray[i].wasserStand;
                    info.style.transform =
                        "translate(" + evt.clientX + "px," + evt.clientY + "px)";
                    info.innerHTML = message;
                    // PlantsArray[i].virusinfection = true;
                    break;
                }
            }
        }
    },
    false
);


// start and stop
let x;
let running = false;
let startstopbtn = document.getElementById("startstopbtn");
function startInterval() {
    if (running) return;
    x = setInterval(() => {
        renderNextTick();
    }, _speed);
    running = true;
}

function stopInterval() {
    clearInterval(x);
    running = false;
}

function startStop() {
    if (running) {
        startstopbtn.innerHTML = "Start";
        stopInterval();
    } else {
        startstopbtn.innerHTML = "Stop";
        startInterval();
    }
}

// parameter handling

  // set scale
  let zoominput = document.getElementById("zoom");
  let zoomvaluedis = document.getElementById("zoomvalue")
  function setScale(e = 1){
    if(e != 1 && e.value){
      _scale = e.value;
    }
    else{_scale = e;}
    zoominput.value = _scale;
    zoomvaluedis.innerHTML = _scale;
    render();
  }

  // set speed
  let speedinput = document.getElementById("speed");
  let speedvaluedis = document.getElementById("speedvalue")
  function setSpeed(e = 1){
    if(e != 1 && e.value){
      _speed = e.value;
    }
    else{_scale = e;}
    speedinput.value = _speed;
    speedvaluedis.innerHTML = _speed;
    if(running){
      stopInterval();
      startInterval();
    }
  }


// panning
let isDragging = false;
let startX = 0;
let startY = 0;

// account for scrolling
function reOffset() {
    var BB = canvas.getBoundingClientRect();
    offsetX = BB.left;
    offsetY = BB.top;
}
var offsetX, offsetY;
reOffset();
window.onscroll = function (e) { reOffset(); }
window.onresize = function (e) { reOffset(); }

canvas.addEventListener("mousedown", (e) => handleMouseDown(e));
canvas.addEventListener("mouseup", (e) => handleMouseUp(e));
canvas.addEventListener("mousemove", (e) => { handleMouseMove(e) });
canvas.addEventListener("mouseout", (e) => handleMouseOut(e));

function handleMouseDown(e) {
    e.preventDefault();
    e.stopPropagation();

    // calc the starting mouse X,Y for the drag
    startX = parseInt(e.clientX - offsetX);
    startY = parseInt(e.clientY - offsetY);

    // set the isDragging flag
    isDragging = true;
}

function handleMouseUp(e) {
    e.preventDefault();
    e.stopPropagation();

    // clear the isDragging flag
    isDragging = false;
}
function handleMouseOut(e) {
    e.preventDefault();
    e.stopPropagation();

    // clear the isDragging flag
    isDragging = false;
}


function handleMouseMove(e) {

    // only do this code if the mouse is being dragged
    if (!isDragging) { return; }

    // tell the browser we're handling this event
    e.preventDefault();
    e.stopPropagation();

    // get the current mouse position
    mouseX = parseInt(e.clientX - offsetX);
    mouseY = parseInt(e.clientY - offsetY);

    // dx & dy are the distance the mouse has moved since
    // the last mousemove event
    let dx = mouseX - startX;
    let dy = mouseY - startY;

    // reset the vars for next mousemove
    startX = mouseX;
    startY = mouseY;

    // accumulate the net panning done
    netPanningX += dx;
    netPanningY += dy;
    //context.clearRect(0,0,canvas.width,canvas.height);
    render();
}

