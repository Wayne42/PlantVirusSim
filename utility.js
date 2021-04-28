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