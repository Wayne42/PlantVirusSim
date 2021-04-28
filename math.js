// math functions

// pythagoras
function calculateDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

// random number function
function randomNumber(start, end) {
    // both including;
    return Math.floor(Math.random() * end) + start;
}