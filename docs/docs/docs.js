var _self = "undefined" != typeof window ? window : "undefined" != typeof WorkerGlobalScope &&
    self instanceof WorkerGlobalScope ? self : {},
    Prism = function() {
        var e = /\blang(?:uage)?-(\w+)\b/i,
            t = 0,
            n = _self.Prism = {
                util: {
                    encode: function(e) {
                        return e instanceof a ? new a(e.type, n.util.encode(
                            e.content), e.alias) : "Array" === n.util.type(
                            e) ? e.map(n.util.encode) : e.replace(/&/g,
                            "&amp;").replace(/</g, "&lt;").replace(
                            /\u00a0/g, " ")
                    },
                    type: function(e) {
                        return Object.prototype.toString.call(e).match(
                            /\[object (\w+)\]/)[1]
                    },
                    objId: function(e) {
                        return e.__id || Object.defineProperty(e, "__id", {
                            value: ++t
                        }), e.__id
                    },
                    clone: function(e) {
                        var t = n.util.type(e);
                        switch (t) {
                            case "Object":
                                var a = {};
                                for (var r in e) e.hasOwnProperty(r) && (a[
                                    r] = n.util.clone(e[r]));
                                return a;
                            case "Array":
                                return e.map && e.map(function(e) {
                                    return n.util.clone(e)
                                })
                        }
                        return e
                    }
                },
                languages: {
                    extend: function(e, t) {
                        var a = n.util.clone(n.languages[e]);
                        for (var r in t) a[r] = t[r];
                        return a
                    },
                    insertBefore: function(e, t, a, r) {
                        r = r || n.languages;
                        var i = r[e];
                        if (2 == arguments.length) {
                            a = arguments[1];
                            for (var l in a) a.hasOwnProperty(l) && (i[l] =
                                a[l]);
                            return i
                        }
                        var o = {};
                        for (var s in i)
                            if (i.hasOwnProperty(s)) {
                                if (s == t)
                                    for (var l in a) a.hasOwnProperty(l) &&
                                        (o[l] = a[l]);
                                o[s] = i[s]
                            }
                        return n.languages.DFS(n.languages, function(t, n) {
                            n === r[e] && t != e && (this[t] = o)
                        }), r[e] = o
                    },
                    DFS: function(e, t, a, r) {
                        r = r || {};
                        for (var i in e) e.hasOwnProperty(i) && (t.call(e,
                                i, e[i], a || i), "Object" !== n.util.type(
                                e[i]) || r[n.util.objId(e[i])] ?
                            "Array" !== n.util.type(e[i]) || r[n.util.objId(
                                e[i])] || (r[n.util.objId(e[i])] = !0,
                                n.languages.DFS(e[i], t, i, r)) : (r[n.util
                                .objId(e[i])] = !0, n.languages.DFS(
                                e[i], t, null, r)))
                    }
                },
                plugins: {},
                highlightAll: function(e, t) {
                    var a = {
                        callback: t,
                        selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
                    };
                    n.hooks.run("before-highlightall", a);
                    for (var r, i = a.elements || document.querySelectorAll(
                        a.selector), l = 0; r = i[l++];) n.highlightElement(
                        r, e === !0, a.callback)
                },
                highlightElement: function(t, a, r) {
                    for (var i, l, o = t; o && !e.test(o.className);) o = o
                        .parentNode;
                    o && (i = (o.className.match(e) || [, ""])[1].toLowerCase(),
                            l = n.languages[i]), t.className = t.className.replace(
                            e, "").replace(/\s+/g, " ") + " language-" + i,
                        o = t.parentNode, /pre/i.test(o.nodeName) && (o.className =
                            o.className.replace(e, "").replace(/\s+/g, " ") +
                            " language-" + i);
                    var s = t.textContent,
                        u = {
                            element: t,
                            language: i,
                            grammar: l,
                            code: s
                        };
                    if (n.hooks.run("before-sanity-check", u), !u.code || !
                        u.grammar) return n.hooks.run("complete", u), void 0;
                    if (n.hooks.run("before-highlight", u), a && _self.Worker) {
                        var c = new Worker(n.filename);
                        c.onmessage = function(e) {
                            u.highlightedCode = e.data, n.hooks.run(
                                    "before-insert", u), u.element.innerHTML =
                                u.highlightedCode, r && r.call(u.element),
                                n.hooks.run("after-highlight", u), n.hooks
                                .run("complete", u)
                        }, c.postMessage(JSON.stringify({
                            language: u.language,
                            code: u.code,
                            immediateClose: !0
                        }))
                    } else u.highlightedCode = n.highlight(u.code, u.grammar,
                            u.language), n.hooks.run("before-insert", u), u
                        .element.innerHTML = u.highlightedCode, r && r.call(
                            t), n.hooks.run("after-highlight", u), n.hooks.run(
                            "complete", u)
                },
                highlight: function(e, t, r) {
                    var i = n.tokenize(e, t);
                    return a.stringify(n.util.encode(i), r)
                },
                tokenize: function(e, t) {
                    var a = n.Token,
                        r = [e],
                        i = t.rest;
                    if (i) {
                        for (var l in i) t[l] = i[l];
                        delete t.rest
                    }
                    e: for (var l in t)
                        if (t.hasOwnProperty(l) && t[l]) {
                            var o = t[l];
                            o = "Array" === n.util.type(o) ? o : [o];
                            for (var s = 0; s < o.length; ++s) {
                                var u = o[s],
                                    c = u.inside,
                                    g = !!u.lookbehind,
                                    h = !!u.greedy,
                                    f = 0,
                                    d = u.alias;
                                if (h && !u.pattern.global) {
                                    var p = u.pattern.toString().match(
                                        /[imuy]*$/)[0];
                                    u.pattern = RegExp(u.pattern.source,
                                        p + "g")
                                }
                                u = u.pattern || u;
                                for (var m = 0, y = 0; m < r.length; y +=
                                    (r[m].matchedStr || r[m]).length, ++
                                    m) {
                                    var v = r[m];
                                    if (r.length > e.length) break e;
                                    if (!(v instanceof a)) {
                                        u.lastIndex = 0;
                                        var b = u.exec(v),
                                            k = 1;
                                        if (!b && h && m != r.length -
                                            1) {
                                            if (u.lastIndex = y, b = u.exec(
                                                e), !b) break;
                                            for (var w = b.index + (g ?
                                                        b[1].length : 0
                                                    ), _ = b.index + b[
                                                        0].length, A =
                                                    m, S = y, P = r.length; P >
                                                A && _ > S; ++A) S += (
                                                    r[A].matchedStr ||
                                                    r[A]).length, w >=
                                                S && (++m, y = S);
                                            if (r[m] instanceof a || r[
                                                A - 1].greedy) continue;
                                            k = A - m, v = e.slice(y, S),
                                                b.index -= y
                                        }
                                        if (b) {
                                            g && (f = b[1].length);
                                            var w = b.index + f,
                                                b = b[0].slice(f),
                                                _ = w + b.length,
                                                x = v.slice(0, w),
                                                O = v.slice(_),
                                                j = [m, k];
                                            x && j.push(x);
                                            var N = new a(l, c ? n.tokenize(
                                                    b, c) : b, d, b,
                                                h);
                                            j.push(N), O && j.push(O),
                                                Array.prototype.splice.apply(
                                                    r, j)
                                        }
                                    }
                                }
                            }
                        }
                    return r
                },
                hooks: {
                    all: {},
                    add: function(e, t) {
                        var a = n.hooks.all;
                        a[e] = a[e] || [], a[e].push(t)
                    },
                    run: function(e, t) {
                        var a = n.hooks.all[e];
                        if (a && a.length)
                            for (var r, i = 0; r = a[i++];) r(t)
                    }
                }
            },
            a = n.Token = function(e, t, n, a, r) {
                this.type = e, this.content = t, this.alias = n, this.matchedStr =
                    a || null, this.greedy = !!r
            };
        if (a.stringify = function(e, t, r) {
            if ("string" == typeof e) return e;
            if ("Array" === n.util.type(e)) return e.map(function(n) {
                return a.stringify(n, t, e)
            }).join("");
            var i = {
                type: e.type,
                content: a.stringify(e.content, t, r),
                tag: "span",
                classes: ["token", e.type],
                attributes: {},
                language: t,
                parent: r
            };
            if ("comment" == i.type && (i.attributes.spellcheck = "true"),
                e.alias) {
                var l = "Array" === n.util.type(e.alias) ? e.alias : [e.alias];
                Array.prototype.push.apply(i.classes, l)
            }
            n.hooks.run("wrap", i);
            var o = "";
            for (var s in i.attributes) o += (o ? " " : "") + s + '="' + (i
                .attributes[s] || "") + '"';
            return "<" + i.tag + ' class="' + i.classes.join(" ") + '"' + (
                    o ? " " + o : "") + ">" + i.content + "</" + i.tag +
                ">"
        }, !_self.document) return _self.addEventListener ? (_self.addEventListener(
            "message", function(e) {
                var t = JSON.parse(e.data),
                    a = t.language,
                    r = t.code,
                    i = t.immediateClose;
                _self.postMessage(n.highlight(r, n.languages[a], a)),
                    i && _self.close()
            }, !1), _self.Prism) : _self.Prism;
        var r = document.currentScript || [].slice.call(document.getElementsByTagName(
            "script")).pop();
        return r && (n.filename = r.src, document.addEventListener && !r.hasAttribute(
            "data-manual") && ("loading" !== document.readyState ?
            window.requestAnimationFrame ? window.requestAnimationFrame(
                n.highlightAll) : window.setTimeout(n.highlightAll, 16) :
            document.addEventListener("DOMContentLoaded", n.highlightAll)
        )), _self.Prism
    }();
"undefined" != typeof module && module.exports && (module.exports = Prism),
    "undefined" != typeof global && (global.Prism = Prism);
Prism.languages.clike = {
    comment: [{
        pattern: /(^|[^\\])\/\*[\w\W]*?\*\//,
        lookbehind: !0
    }, {
        pattern: /(^|[^\\:])\/\/.*/,
        lookbehind: !0
    }],
    string: {
        pattern: /(["'])(\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
        greedy: !0
    },
    "class-name": {
        pattern: /((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[a-z0-9_\.\\]+/i,
        lookbehind: !0,
        inside: {
            punctuation: /(\.|\\)/
        }
    },
    keyword: /\b(if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
    "boolean": /\b(true|false)\b/,
    "function": /[a-z0-9_]+(?=\()/i,
    number: /\b-?(?:0x[\da-f]+|\d*\.?\d+(?:e[+-]?\d+)?)\b/i,
    operator: /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
    punctuation: /[{}[\];(),.:]/
};
Prism.languages.javascript = Prism.languages.extend("clike", {
    keyword: /\b(as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/,
    number: /\b-?(0x[\dA-Fa-f]+|0b[01]+|0o[0-7]+|\d*\.?\d+([Ee][+-]?\d+)?|NaN|Infinity)\b/,
    "function": /[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*(?=\()/i,
    operator: /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*\*?|\/|~|\^|%|\.{3}/
}), Prism.languages.insertBefore("javascript", "keyword", {
    regex: {
        pattern: /(^|[^\/])\/(?!\/)(\[.+?]|\\.|[^\/\\\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})]))/,
        lookbehind: !0,
        greedy: !0
    }
}), Prism.languages.insertBefore("javascript", "string", {
    "template-string": {
        pattern: /`(?:\\\\|\\?[^\\])*?`/,
        greedy: !0,
        inside: {
            interpolation: {
                pattern: /\$\{[^}]+\}/,
                inside: {
                    "interpolation-punctuation": {
                        pattern: /^\$\{|\}$/,
                        alias: "punctuation"
                    },
                    rest: Prism.languages.javascript
                }
            },
            string: /[\s\S]+/
        }
    }
}), Prism.languages.markup && Prism.languages.insertBefore("markup", "tag", {
    script: {
        pattern: /(<script[\w\W]*?>)[\w\W]*?(?=<\/script>)/i,
        lookbehind: !0,
        inside: Prism.languages.javascript,
        alias: "language-javascript"
    }
}), Prism.languages.js = Prism.languages.javascript;
! function() {
    "undefined" != typeof self && self.Prism && self.document && Prism.hooks.add(
        "complete", function(e) {
            if (e.code) {
                var t = e.element.parentNode,
                    s = /\s*\bline-numbers\b\s*/;
                if (t && /pre/i.test(t.nodeName) && (s.test(t.className) ||
                    s.test(e.element.className)) && !e.element.querySelector(
                    ".line-numbers-rows")) {
                    s.test(e.element.className) && (e.element.className = e
                            .element.className.replace(s, "")), s.test(t.className) ||
                        (t.className += " line-numbers");
                    var n, a = e.code.match(/\n(?!$)/g),
                        l = a ? a.length + 1 : 1,
                        r = new Array(l + 1);
                    r = r.join("<span></span>"), n = document.createElement(
                            "span"), n.setAttribute("aria-hidden", "true"),
                        n.className = "line-numbers-rows", n.innerHTML = r,
                        t.hasAttribute("data-start") && (t.style.counterReset =
                            "linenumber " + (parseInt(t.getAttribute(
                                "data-start"), 10) - 1)), e.element.appendChild(
                            n)
                }
            }
        })
}();
! function() {
    "undefined" != typeof self && !self.Prism || "undefined" != typeof global &&
        !global.Prism || Prism.hooks.add("wrap", function(e) {
            "keyword" === e.type && e.classes.push("keyword-" + e.content)
        })
}();


/////////////////////////////////////////////////
//MOTION ANIMATION
$('#Motion').click(function() {
    $('#motionlist').toggle('fast');
    $(this).text('Motion');
    $("#Events").toggle('fast');
    $('.container2').toggle('fast');
    $('.container3').toggle('fast');
    $('.container4').toggle('fast');
    $('.container5').toggle('fast');
    $('.container0').toggle('fast');
});
//EVENTS MOTION
$('#Events').click(function() {
    $('#eventlist').toggle('fast');
    $(this).text('Events');
    $("#Motion").toggle('fast');
    $('.container2').toggle('fast');
    $('.container3').toggle('fast');
    $('.container4').toggle('fast');
    $('.container0').toggle('fast');
    $('.container5').toggle('fast');
});
//LOOKS ANIMATION
$('#Looks').click(function() {
    $('#lookslist').toggle('fast');
    $(this).text('Looks');
    $("#Control").toggle('fast');
    $('.container1').toggle('fast');
    $('.container3').toggle('fast');
    $('.container4').toggle('fast');
    $('.container0').toggle('fast');
    $('.container5').toggle('fast');
});
//CONTROL ANIMATION
$('#Control').click(function() {
    $('#controllist').toggle('fast');
    $(this).text('Control');
    $("#Looks").toggle('fast');
    $('.container1').toggle('fast');
    $('.container3').toggle('fast');
    $('.container4').toggle('fast');
    $('.container0').toggle('fast');
    $('.container5').toggle('fast');
});
//SOUND ANIMATION
$('#Sound').click(function() {
    $('#soundlist').toggle('fast');
    // $(this).text('Sound');
    $("#Sensing").toggle('fast');
    $('.container1').toggle('fast');
    $('.container2').toggle('fast');
    $('.container4').toggle('fast');
    $('.container0').toggle('fast');
    $('.container5').toggle('fast');
});
//Sensing ANIMATION
$('#Sensing').click(function() {
    $('#sensinglist').toggle('fast');
    // $(this).text('Sensins');
    $("#Sound").toggle('fast');
    $('.container1').toggle('fast');
    $('.container2').toggle('fast');
    $('.container4').toggle('fast');
    $('.container0').toggle('fast');
    $('.container5').toggle('fast');
});
//PEN ANIMATION
$('#Pen').click(function() {
    $('#penlist').toggle('fast');
    // $(this).text('Pen');
    $("#Operations").toggle('fast');
    $('.container1').toggle('fast');
    $('.container2').toggle('fast');
    $('.container0').toggle('fast');
    $('.container3').toggle('fast');
    $('.container5').toggle('fast');
});
//OPERATORS ANIMATION
$('#Operations').click(function() {
    $('#operationslist').toggle('fast');
    // $(this).text('Operators');
    $("#Pen").toggle('fast');
    $('.container1').toggle('fast');
    $('.container2').toggle('fast');
    $('.container3').toggle('fast');
    $('.container0').toggle('fast');
    $('.container5').toggle('fast');
});
//DATA ANIMATION
$('#Data').click(function() {
    $('#datalist').toggle('fast');
    $("#More").toggle('fast');
    $('.container1').toggle('fast');
    $('.container2').toggle('fast');
    $('.container3').toggle('fast');
    $('.container0').toggle('fast');
    $('.container4').toggle('fast');
});
//MORE ANIMATION
$('#More').click(function() {
    $('#blockslist').toggle('fast');
    $(this).text('More Blocks');
    $("#Data").toggle('fast');
    $('.container1').toggle('fast');
    $('.container2').toggle('fast');
    $('.container3').toggle('fast');
    $('.container0').toggle('fast');
    $('.container4').toggle('fast');
});

//START ANIMATION
$('#Start').click(function() {
    $('#startlist').toggle('fast');
    $("#Sprite").toggle('fast');
    $('#Jsbin').toggle('fast');
    $('#Tutorial').toggle('fast');
    $('#Projects').toggle('fast');
     $('#Github').toggle('fast');
    $('.container1').toggle('fast');
    $('.container2').toggle('fast');
    $('.container3').toggle('fast');
    $('.container4').toggle('fast');
    $('.container5').toggle('fast');
    if ($('#typelist').is(':visible') && $(this).text() ==
        'Get Started') {
        $('#typelist').hide();
        $('#startlist').hide();
    }
}); 
      
    
    $('#Projects').click(function() {
    $('#projects2').toggle('fast');
    $('#Tutorial').toggle('fast');
       $('#Start').toggle('fast');
       $('#Jsbin').toggle('fast');
       $('#Github').toggle('fast');

});

$('#Tutorial').click(function() {
    $('#Projects').toggle('fast');
       $('#typelist').toggle('fast');
       $('#Start').toggle('fast');
       $('#Jsbin').toggle('fast');
       $('#Github').toggle('fast');

});

$('#Jsbin').click(function() {
     
  window.open('https://jsbin.com/lizuzuz/edit?js,output')

});

$('#Github').click(function() {
     
  window.open('http://www.thecodingspace.com/setting-up-jsbin.html')

});

//TYPE ANIMATION
$('#Type').click(function() {
    $('#typelist').toggle('fast');
    $('#startlist').hide();
});





//SPRITE ANIMATION
$('#Sprite').click(function() {
    // $('#spritelist').toggle('fast');
    $("#Start").toggle('fast');
    $("#Image").toggle('fast');
    $("#Text").toggle('fast');
    $("#Circle").toggle('fast');
    $("#Rectangle").toggle('fast');
    $("#Line").toggle('fast');
    $('.container1').toggle('fast');
    $('.container2').toggle('fast');
    $('.container3').toggle('fast');
    $('.container4').toggle('fast');
    $('.container5').toggle('fast');
    if ($('#imagelist').is(':visible') && $(this).text() ==
        'Creating Sprites') {
        $('#imagelist').toggle('fast');
        $("#Image").toggle('fast');
    $("#Text").toggle('fast');
    $("#Circle").toggle('fast');
    $("#Rectangle").toggle('fast');
    $("#Line").toggle('fast');
    }
    
       if ($('#textlist').is(':visible') && $(this).text() ==
        'Creating Sprites') {
        $('#textlist').toggle('fast');
        $("#Image").toggle('fast');
    $("#Text").toggle('fast');
    $("#Circle").toggle('fast');
    $("#Rectangle").toggle('fast');
    $("#Line").toggle('fast');
    }
    
    if ($('#circlelist').is(':visible') && $(this).text() ==
        'Creating Sprites') {
        $('#circlelist').toggle('fast');
        $("#Image").toggle('fast');
    $("#Text").toggle('fast');
    $("#Circle").toggle('fast');
    $("#Rectangle").toggle('fast');
    $("#Line").toggle('fast');
    }
    
       if ($('#rectanglelist').is(':visible') && $(this).text() ==
        'Creating Sprites') {
        $('#rectanglelist').toggle('fast');
        $("#Image").toggle('fast');
    $("#Text").toggle('fast');
    $("#Circle").toggle('fast');
    $("#Rectangle").toggle('fast');
    $("#Line").toggle('fast');
    }
    
       if ($('#linelist').is(':visible') && $(this).text() ==
        'Creating Sprites') {
        $('#linelist').toggle('fast');
        $("#Image").toggle('fast');
    $("#Text").toggle('fast');
    $("#Circle").toggle('fast');
    $("#Rectangle").toggle('fast');
    $("#Line").toggle('fast');
    }
    
});

// //IMAGE LIST ANIMATION
$('#Image').click(function() {
    $('#imagelist').toggle('fast'); 
    $("#Image").toggle('fast');
    $("#Text").toggle('fast');
    $("#Circle").toggle('fast');
    $("#Rectangle").toggle('fast');
    $("#Line").toggle('fast');
    
}); 
      
    
// //TEXT LIST ANIMATION
$('#Text').click(function() {
    $('#textlist').toggle('fast'); 
    $("#Image").toggle('fast');
    $("#Text").toggle('fast');
    $("#Circle").toggle('fast');
    $("#Rectangle").toggle('fast');
    $("#Line").toggle('fast');
    
});     

// //CIRCLE LIST ANIMATION
$('#Circle').click(function() {
    $('#circlelist').toggle('fast'); 
    $("#Image").toggle('fast');
    $("#Text").toggle('fast');
    $("#Circle").toggle('fast');
    $("#Rectangle").toggle('fast');
    $("#Line").toggle('fast');
    
});     

// //RECTANGLE LIST ANIMATION
$('#Rectangle').click(function() {
    $('#rectanglelist').toggle('fast'); 
    $("#Image").toggle('fast');
    $("#Text").toggle('fast');
    $("#Circle").toggle('fast');
    $("#Rectangle").toggle('fast');
    $("#Line").toggle('fast');
    
});     

// //LINE LIST ANIMATION
$('#Line').click(function() {
    $('#linelist').toggle('fast'); 
    $("#Image").toggle('fast');
    $("#Text").toggle('fast');
    $("#Circle").toggle('fast');
    $("#Rectangle").toggle('fast');
    $("#Line").toggle('fast');
    
});      