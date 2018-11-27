function loadFont(t, e, n, a) {
    function o() {
        if (!window.FontFace) return !1;
        let t = new FontFace("t", 'url("data:application/font-woff2,") format("woff2")', {}),
            e = t.load();
        try {
            e.then(null, function() {});
        } catch (n) {}
        return "loading" === t.status;
    }
    let s = navigator.userAgent,
        r = !window.addEventListener || s.match(/(Android (2|3|4.0|4.1|4.2|4.3))|(Opera (Mini|Mobi))/) && !s.match(/Chrome/);
    if (!r) {
        let d = {};
        try {
            d = localStorage || {};
        } catch (l) {}
        let c = "x-font-" + t,
            i = c + "url",
            u = c + "css",
            f = d[i],
            p = d[u],
            h = document.createElement("style");
        if (h.rel = "stylesheet", document.head.appendChild(h), !p || f !== e && f !== n) {
            let g = n && o() ? n : e,
                w = new XMLHttpRequest();
            w.open("GET", g), w.onload = function() {
                w.status >= 200 && w.status < 400 && (d[i] = g, d[u] = w.responseText, a || (h.textContent = w.responseText));
            }, w.send();
        } else h.textContent = p;
    }
}

loadFont("RobotoCondensed-Regular", "assets/fonts/RobotoCondensed-Regular.css");