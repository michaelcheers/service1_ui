// Shared inline-SVG icon builder. Replaces emoji-as-icon in JS-built DOM.
// Builds real <svg> nodes via createElementNS + setAttribute (CLAUDE.md rule 2:
// no innerHTML / no template-literal HTML). Mirrors Helpers/Icons.cs.
//
// Usage:  el.appendChild(S1Icons.svg("phone"));   el.appendChild(S1Icons.svg("x", 14));
// Unknown names throw (fail loud, closed dictionary).
(function () {
    var NS = "http://www.w3.org/2000/svg";

    // Each icon is an array of child element descriptors: { t: tagName, ...attributes }.
    var PATHS = {
        "phone": [{ t: "path", d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" }],
        "smartphone": [{ t: "rect", x: "5", y: "2", width: "14", height: "20", rx: "2" }, { t: "line", x1: "12", y1: "18", x2: "12", y2: "18" }],
        "mail": [{ t: "rect", x: "2", y: "4", width: "20", height: "16", rx: "2" }, { t: "path", d: "m22 6-10 7L2 6" }],
        "bell": [{ t: "path", d: "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" }, { t: "path", d: "M10.3 21a1.94 1.94 0 0 0 3.4 0" }],
        "message-circle": [{ t: "path", d: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z" }],
        "globe": [{ t: "circle", cx: "12", cy: "12", r: "10" }, { t: "path", d: "M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20" }],
        "volume-x": [{ t: "polygon", points: "11 5 6 9 2 9 2 15 6 15 11 19 11 5" }, { t: "line", x1: "23", y1: "9", x2: "17", y2: "15" }, { t: "line", x1: "17", y1: "9", x2: "23", y2: "15" }],
        "volume-2": [{ t: "polygon", points: "11 5 6 9 2 9 2 15 6 15 11 19 11 5" }, { t: "path", d: "M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" }],
        "medal": [{ t: "circle", cx: "12", cy: "15", r: "6" }, { t: "path", d: "M9 9 6 3M15 9l3-6" }],
        "x": [{ t: "line", x1: "18", y1: "6", x2: "6", y2: "18" }, { t: "line", x1: "6", y1: "6", x2: "18", y2: "18" }],
        "check": [{ t: "polyline", points: "20 6 9 17 4 12" }],
        "truck": [{ t: "rect", x: "1", y: "3", width: "15", height: "13" }, { t: "polygon", points: "16 8 20 8 23 11 23 16 16 16 16 8" }, { t: "circle", cx: "5.5", cy: "18.5", r: "2.5" }, { t: "circle", cx: "18.5", cy: "18.5", r: "2.5" }],
        "sun": [{ t: "circle", cx: "12", cy: "12", r: "5" }, { t: "line", x1: "12", y1: "1", x2: "12", y2: "3" }, { t: "line", x1: "12", y1: "21", x2: "12", y2: "23" }, { t: "line", x1: "4.2", y1: "4.2", x2: "5.6", y2: "5.6" }, { t: "line", x1: "18.4", y1: "18.4", x2: "19.8", y2: "19.8" }, { t: "line", x1: "1", y1: "12", x2: "3", y2: "12" }, { t: "line", x1: "21", y1: "12", x2: "23", y2: "12" }, { t: "line", x1: "4.2", y1: "19.8", x2: "5.6", y2: "18.4" }, { t: "line", x1: "18.4", y1: "5.6", x2: "19.8", y2: "4.2" }],
        "moon": [{ t: "path", d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" }],
        "file-text": [{ t: "path", d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }, { t: "polyline", points: "14 2 14 8 20 8" }, { t: "line", x1: "16", y1: "13", x2: "8", y2: "13" }, { t: "line", x1: "16", y1: "17", x2: "8", y2: "17" }, { t: "line", x1: "10", y1: "9", x2: "8", y2: "9" }],
        "clipboard-list": [{ t: "rect", x: "8", y: "2", width: "8", height: "4", rx: "1" }, { t: "path", d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" }, { t: "path", d: "M12 11h4M12 16h4M8 11h.01M8 16h.01" }],
        "bar-chart": [{ t: "line", x1: "12", y1: "20", x2: "12", y2: "10" }, { t: "line", x1: "18", y1: "20", x2: "18", y2: "4" }, { t: "line", x1: "6", y1: "20", x2: "6", y2: "16" }],
        "edit": [{ t: "path", d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }, { t: "path", d: "M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z" }],
        "file": [{ t: "path", d: "M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" }, { t: "polyline", points: "13 2 13 9 20 9" }],
        "target": [{ t: "circle", cx: "12", cy: "12", r: "10" }, { t: "circle", cx: "12", cy: "12", r: "6" }, { t: "circle", cx: "12", cy: "12", r: "2" }],
        "lightbulb": [{ t: "path", d: "M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0 0 12 2z" }],
        "wrench": [{ t: "path", d: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" }],
        "dollar": [{ t: "line", x1: "12", y1: "1", x2: "12", y2: "23" }, { t: "path", d: "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" }],
        "banknote": [{ t: "rect", x: "2", y: "6", width: "20", height: "12", rx: "2" }, { t: "circle", cx: "12", cy: "12", r: "2" }, { t: "path", d: "M6 12h.01M18 12h.01" }],
        "refresh-cw": [{ t: "polyline", points: "23 4 23 10 17 10" }, { t: "polyline", points: "1 20 1 14 7 14" }, { t: "path", d: "M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" }],
        "rocket": [{ t: "path", d: "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" }, { t: "path", d: "M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" }, { t: "path", d: "M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" }],
        "package": [{ t: "path", d: "M16.5 9.4 7.5 4.21M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" }, { t: "polyline", points: "3.27 6.96 12 12.01 20.73 6.96" }, { t: "line", x1: "12", y1: "22.08", x2: "12", y2: "12" }],
        "boxes": [{ t: "path", d: "M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42zM7 16.5l-4.74-2.85M7 16.5l5-3M7 16.5v5.17M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3zM17 16.5l-5-3M17 16.5l4.74-2.85M17 16.5v5.17M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8zM12 8 7.26 5.15M12 8l4.74-2.85M12 13.5V8" }],
        "zap": [{ t: "polygon", points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2" }],
        "hard-hat": [{ t: "path", d: "M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a8 8 0 0 0-16 0z" }, { t: "path", d: "M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5M4 15v-3a6 6 0 0 1 6-6M14 6a6 6 0 0 1 6 6v3" }],
        "sparkles": [{ t: "path", d: "M12 3l1.9 5.8L19.7 10l-5.8 1.9L12 17.7l-1.9-5.8L4.3 10l5.8-1.9z" }, { t: "path", d: "M19 3v4M21 5h-4M5 17v2M6 18H4" }],
        "lock": [{ t: "rect", x: "3", y: "11", width: "18", height: "11", rx: "2" }, { t: "path", d: "M7 11V7a5 5 0 0 1 10 0v4" }],
        "users": [{ t: "path", d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" }, { t: "circle", cx: "9", cy: "7", r: "4" }, { t: "path", d: "M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" }],
        "user": [{ t: "path", d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" }, { t: "circle", cx: "12", cy: "7", r: "4" }],
        "inbox": [{ t: "polyline", points: "22 12 16 12 14 15 10 15 8 12 2 12" }, { t: "path", d: "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" }],
        "send": [{ t: "line", x1: "22", y1: "2", x2: "11", y2: "13" }, { t: "polygon", points: "22 2 15 22 11 13 2 9 22 2" }],
        "landmark": [{ t: "line", x1: "3", y1: "22", x2: "21", y2: "22" }, { t: "line", x1: "6", y1: "18", x2: "6", y2: "11" }, { t: "line", x1: "10", y1: "18", x2: "10", y2: "11" }, { t: "line", x1: "14", y1: "18", x2: "14", y2: "11" }, { t: "line", x1: "18", y1: "18", x2: "18", y2: "11" }, { t: "polygon", points: "12 2 20 7 4 7" }],
        "settings": [{ t: "circle", cx: "12", cy: "12", r: "3" }, { t: "path", d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" }],
        "search": [{ t: "circle", cx: "11", cy: "11", r: "7" }, { t: "line", x1: "21", y1: "21", x2: "16.65", y2: "16.65" }],
        "flame": [{ t: "path", d: "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" }],
        "camera": [{ t: "path", d: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" }, { t: "circle", cx: "12", cy: "13", r: "4" }],
        "paperclip": [{ t: "path", d: "M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" }],
        "folder": [{ t: "path", d: "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" }],
        "alert-triangle": [{ t: "path", d: "M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" }, { t: "line", x1: "12", y1: "9", x2: "12", y2: "13" }, { t: "line", x1: "12", y1: "17", x2: "12", y2: "17" }],
        "flag": [{ t: "path", d: "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" }, { t: "line", x1: "4", y1: "22", x2: "4", y2: "15" }],
        "handshake": [{ t: "path", d: "M11 17l2 2a1 1 0 0 0 3-3M14 14l2.5 2.5a1 1 0 0 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 0 1-1.42 0l-2.12-2.12a1 1 0 0 0-1.42 0L3 8.5" }, { t: "path", d: "M3 13l3.5 3.5" }],
        "wave": [{ t: "path", d: "M18 11V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2M14 10V4a2 2 0 0 0-2-2 2 2 0 0 0-2 2v2M10 10.5V6a2 2 0 0 0-2-2 2 2 0 0 0-2 2v8" }, { t: "path", d: "M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" }],
        "star": [{ t: "polygon", points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" }],
        "pin": [{ t: "line", x1: "12", y1: "17", x2: "12", y2: "22" }, { t: "path", d: "M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1v3.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24z" }],
        "clock": [{ t: "circle", cx: "12", cy: "12", r: "10" }, { t: "polyline", points: "12 6 12 12 16 14" }],
        "moon-snooze": [{ t: "path", d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" }],
        "calendar": [{ t: "rect", x: "3", y: "4", width: "18", height: "18", rx: "2" }, { t: "line", x1: "16", y1: "2", x2: "16", y2: "6" }, { t: "line", x1: "8", y1: "2", x2: "8", y2: "6" }, { t: "line", x1: "3", y1: "10", x2: "21", y2: "10" }],
        "home": [{ t: "path", d: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" }, { t: "polyline", points: "9 22 9 12 15 12 15 22" }],
        "delete": [{ t: "path", d: "M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" }, { t: "line", x1: "18", y1: "9", x2: "12", y2: "15" }, { t: "line", x1: "12", y1: "9", x2: "18", y2: "15" }],
        "play": [{ t: "polygon", points: "5 3 19 12 5 21 5 3" }],
        "arrow-down-left": [{ t: "line", x1: "17", y1: "7", x2: "7", y2: "17" }, { t: "polyline", points: "17 17 7 17 7 7" }],
        "arrow-up-right": [{ t: "line", x1: "7", y1: "17", x2: "17", y2: "7" }, { t: "polyline", points: "7 7 17 7 17 17" }]
    };

    // Legacy emoji (and aliases) → canonical icon name, so JS callers can pass either.
    var LEGACY = {
        "📞": "phone", "☏": "phone", "📱": "smartphone",
        "✉️": "mail", "✉": "mail", "📧": "mail", "🔔": "bell", "💬": "message-circle",
        "🌐": "globe", "🥇": "medal", "🥈": "medal", "🥉": "medal", "🚚": "truck",
        "☀": "sun", "☀️": "sun", "☾": "moon", "🌙": "moon",
        "📄": "file-text", "📋": "clipboard-list", "📊": "bar-chart", "📝": "edit", "✎": "edit",
        "📑": "file", "🎯": "target", "💡": "lightbulb", "🔧": "wrench", "🛠️": "wrench", "🛠": "wrench",
        "💰": "dollar", "💵": "banknote", "🔄": "refresh-cw", "🚀": "rocket", "📦": "package",
        "⚡": "zap", "🏗️": "hard-hat", "🏗": "hard-hat", "👷": "hard-hat", "✨": "sparkles",
        "🔐": "lock", "🔑": "lock", "🔒": "lock", "👥": "users", "👤": "user",
        "📭": "inbox", "📥": "inbox", "📨": "send", "🏦": "landmark", "⚙": "settings", "⚙️": "settings",
        "🔍": "search", "🔥": "flame", "📷": "camera", "📎": "paperclip", "📁": "folder",
        "⚠": "alert-triangle", "⚠️": "alert-triangle", "⚑": "flag", "🤝": "handshake", "👋": "wave",
        "✦": "star", "⭐": "star", "📌": "pin", "🕒": "clock", "💤": "moon-snooze",
        "📅": "calendar", "🏠": "home", "⌫": "delete", "▶": "play",
        "✓": "check", "✅": "check", "×": "x", "✕": "x", "✗": "x",
        "🔇": "volume-x", "🔊": "volume-2"
    };

    function resolveName(value, fallback) {
        if (value) {
            var v = ("" + value).trim();
            if (PATHS[v]) return v;
            if (LEGACY[v]) return LEGACY[v];
        }
        if (fallback) return fallback;
        return null;
    }

    function svg(name, size) {
        var resolved = (PATHS[name]) ? name : (LEGACY[name] || null);
        var def = resolved ? PATHS[resolved] : null;
        if (!def) throw new Error('S1Icons: unknown icon "' + name + '"');
        var px = size || 16;
        var s = document.createElementNS(NS, "svg");
        s.setAttribute("width", px);
        s.setAttribute("height", px);
        s.setAttribute("viewBox", "0 0 24 24");
        s.setAttribute("fill", "none");
        s.setAttribute("stroke", "currentColor");
        s.setAttribute("stroke-width", "1.75");
        s.setAttribute("stroke-linecap", "round");
        s.setAttribute("stroke-linejoin", "round");
        def.forEach(function (p) {
            var e = document.createElementNS(NS, p.t);
            Object.keys(p).forEach(function (k) {
                if (k !== "t") e.setAttribute(k, p[k]);
            });
            s.appendChild(e);
        });
        return s;
    }

    window.S1Icons = { svg: svg, resolveName: resolveName };
})();
