function floatToString(t, e) {
    var o = t.toFixed(e).toString();
    return o.match(/^\.\d+/) ? "0" + o : o
}
"undefined" == typeof window.Shopify && (window.Shopify = {}), Shopify.each = function(t, e) {
    for (var o = 0; o < t.length; o++) e(t[o], o)
}, Shopify.map = function(t, e) {
    for (var o = [], i = 0; i < t.length; i++) o.push(e(t[i], i));
    return o
}, Shopify.arrayIncludes = function(t, e) {
    for (var o = 0; o < t.length; o++)
        if (t[o] == e) return !0;
    return !1
}, Shopify.uniq = function(t) {
    for (var e = [], o = 0; o < t.length; o++) Shopify.arrayIncludes(e, t[o]) || e.push(t[o]);
    return e
}, Shopify.isDefined = function(t) {
    return void 0 !== t
}, Shopify.getClass = function(t) {
    return Object.prototype.toString.call(t).slice(8, -1)
}, Shopify.extend = function(t, e) {
    function o() {}
    o.prototype = e.prototype, t.prototype = new o, (t.prototype.constructor = t).baseConstructor = e, t.superClass = e.prototype
}, Shopify.locationSearch = function() {
    return window.location.search
}, Shopify.locationHash = function() {
    return window.location.hash
}, Shopify.replaceState = function(t) {
    window.history.replaceState({}, document.title, t)
}, Shopify.urlParam = function(t) {
    var e = RegExp("[?&]" + t + "=([^&#]*)").exec(Shopify.locationSearch());
    return e && decodeURIComponent(e[1].replace(/\+/g, " "))
}, Shopify.newState = function(t, e) {
    return (Shopify.urlParam(t) ? Shopify.locationSearch().replace(RegExp("(" + t + "=)[^&#]+"), "$1" + e) : "" === Shopify.locationSearch() ? "?" + t + "=" + e : Shopify.locationSearch() + "&" + t + "=" + e) + Shopify.locationHash()
}, Shopify.setParam = function(t, e) {
    Shopify.replaceState(Shopify.newState(t, e))
}, Shopify.Product = function(t) {
    Shopify.isDefined(t) && this.update(t)
}, Shopify.Product.prototype.update = function(t) {
    for (property in t) this[property] = t[property]
}, Shopify.Product.prototype.optionNames = function() {
    return "Array" == Shopify.getClass(this.options) ? this.options : []
}, Shopify.Product.prototype.optionValues = function(o) {
    if (!Shopify.isDefined(this.variants)) return null;
    var t = Shopify.map(this.variants, function(t) {
        var e = "option" + (o + 1);
        return t[e] == undefined ? null : t[e]
    });
    return null == t[0] ? null : Shopify.uniq(t)
}, Shopify.Product.prototype.getVariant = function(i) {
    var r = null;
    return i.length != this.options.length || Shopify.each(this.variants, function(t) {
        for (var e = !0, o = 0; o < i.length; o++) {
            t["option" + (o + 1)] != i[o] && (e = !1)
        }
        1 != e || (r = t)
    }), r
}, Shopify.Product.prototype.getVariantById = function(t) {
    for (var e = 0; e < this.variants.length; e++) {
        var o = this.variants[e];
        if (t == o.id) return o
    }
    return null
}, Shopify.money_format = "${{amount}}", Shopify.formatMoney = function(t, e) {
    function n(t, e) {
        return void 0 === t ? e : t
    }

    function o(t, e, o, i) {
        if (e = n(e, 2), o = n(o, ","), i = n(i, "."), isNaN(t) || null == t) return 0;
        var r = (t = (t / 100).toFixed(e)).split(".");
        return r[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + o) + (r[1] ? i + r[1] : "")
    }
    "string" == typeof t && (t = t.replace(".", ""));
    var i = "",
        r = /\{\{\s*(\w+)\s*\}\}/,
        a = e || this.money_format;
    switch (a.match(r)[1]) {
        case "amount":
            i = o(t, 2);
            break;
        case "amount_no_decimals":
            i = o(t, 0);
            break;
        case "amount_with_comma_separator":
            i = o(t, 2, ".", ",");
            break;
        case "amount_with_space_separator":
            i = o(t, 2, " ", ",");
            break;
        case "amount_with_period_and_space_separator":
            i = o(t, 2, " ", ".");
            break;
        case "amount_no_decimals_with_comma_separator":
            i = o(t, 0, ".", ",");
            break;
        case "amount_no_decimals_with_space_separator":
            i = o(t, 0, " ");
            break;
        case "amount_with_apostrophe_separator":
            i = o(t, 2, "'", ".")
    }
    return a.replace(r, i)
}, Shopify.OptionSelectors = function(t, e) {
    return this.selectorDivClass = "selector-wrapper", this.selectorClass = "single-option-selector", this.variantIdFieldIdSuffix = "-variant-id", this.variantIdField = null, this.historyState = null, this.selectors = [], this.domIdPrefix = t, this.product = new Shopify.Product(e.product), this.onVariantSelected = Shopify.isDefined(e.onVariantSelected) ? e.onVariantSelected : function() {}, this.replaceSelector(t), this.initDropdown(), e.enableHistoryState && (this.historyState = new Shopify.OptionSelectors.HistoryState(this)), !0
}, Shopify.OptionSelectors.prototype.initDropdown = function() {
    var t = {
        initialLoad: !0
    };
    if (!this.selectVariantFromDropdown(t)) {
        var e = this;
        setTimeout(function() {
            e.selectVariantFromParams(t) || e.fireOnChangeForFirstDropdown.call(e, t)
        })
    }
}, Shopify.OptionSelectors.prototype.fireOnChangeForFirstDropdown = function(t) {
    this.selectors[0].element.onchange(t)
}, Shopify.OptionSelectors.prototype.selectVariantFromParamsOrDropdown = function(t) {
    this.selectVariantFromParams(t) || this.selectVariantFromDropdown(t)
}, Shopify.OptionSelectors.prototype.replaceSelector = function(t) {
    var e = document.getElementById(t),
        o = e.parentNode;
    Shopify.each(this.buildSelectors(), function(t) {
        o.insertBefore(t, e)
    }), e.style.display = "none", this.variantIdField = e
}, Shopify.OptionSelectors.prototype.selectVariantFromDropdown = function(t) {
    var e = document.getElementById(this.domIdPrefix).querySelector("[selected]");
    if (e || (e = document.getElementById(this.domIdPrefix).querySelector('[selected="selected"]')), !e) return !1;
    var o = e.value;
    return this.selectVariant(o, t)
}, Shopify.OptionSelectors.prototype.selectVariantFromParams = function(t) {
    var e = Shopify.urlParam("variant");
    return this.selectVariant(e, t)
}, Shopify.OptionSelectors.prototype.selectVariant = function(t, e) {
    var o = this.product.getVariantById(t);
    if (null == o) return !1;
    for (var i = 0; i < this.selectors.length; i++) {
        var r = this.selectors[i].element,
            n = o[r.getAttribute("data-option")];
        null != n && this.optionExistInSelect(r, n) && (r.value = n)
    }
    return "undefined" != typeof jQuery ? jQuery(this.selectors[0].element).trigger("change", e) : this.selectors[0].element.onchange(e), !0
}, Shopify.OptionSelectors.prototype.optionExistInSelect = function(t, e) {
    for (var o = 0; o < t.options.length; o++)
        if (t.options[o].value == e) return !0
}, Shopify.OptionSelectors.prototype.insertSelectors = function(t, e) {
    Shopify.isDefined(e) && this.setMessageElement(e), this.domIdPrefix = "product-" + this.product.id + "-variant-selector";
    var o = document.getElementById(t);
    Shopify.each(this.buildSelectors(), function(t) {
        o.appendChild(t)
    })
}, Shopify.OptionSelectors.prototype.buildSelectors = function() {
    for (var t = 0; t < this.product.optionNames().length; t++) {
        var e = new Shopify.SingleOptionSelector(this, t, this.product.optionNames()[t], this.product.optionValues(t));
        e.element.disabled = !1, this.selectors.push(e)
    }
    var i = this.selectorDivClass,
        r = this.product.optionNames();
    return Shopify.map(this.selectors, function(t) {
        var e = document.createElement("div");
        if (e.setAttribute("class", i), 0 < r.length) {
            var o = document.createElement("label");
            o.htmlFor = t.element.id, o.innerHTML = t.name, e.appendChild(o)
        }
        return e.appendChild(t.element), e
    })
}, Shopify.OptionSelectors.prototype.selectedValues = function() {
    for (var t = [], e = 0; e < this.selectors.length; e++) {
        var o = this.selectors[e].element.value;
        t.push(o)
    }
    return t
}, Shopify.OptionSelectors.prototype.updateSelectors = function(t, e) {
    var o = this.selectedValues(),
        i = this.product.getVariant(o);
    i ? (this.variantIdField.disabled = !1, this.variantIdField.value = i.id) : this.variantIdField.disabled = !0, this.onVariantSelected(i, this, e), null != this.historyState && this.historyState.onVariantChange(i, this, e)
}, Shopify.OptionSelectorsFromDOM = function(t, e) {
    var o = e.optionNames || [],
        i = e.priceFieldExists || !0,
        r = e.delimiter || "/",
        n = this.createProductFromSelector(t, o, i, r);
    e.product = n, Shopify.OptionSelectorsFromDOM.baseConstructor.call(this, t, e)
}, Shopify.extend(Shopify.OptionSelectorsFromDOM, Shopify.OptionSelectors), Shopify.OptionSelectorsFromDOM.prototype.createProductFromSelector = function(t, n, a, s) {
    if (!Shopify.isDefined(a)) a = !0;
    if (!Shopify.isDefined(s)) s = "/";
    var e = document.getElementById(t),
        o = e.childNodes,
        p = (e.parentNode, n.length),
        l = [];
    Shopify.each(o, function(t) {
        if (1 == t.nodeType && "option" == t.tagName.toLowerCase()) {
            var e = t.innerHTML.split(new RegExp("\\s*\\" + s + "\\s*"));
            0 == n.length && (p = e.length - (a ? 1 : 0));
            var o = e.slice(0, p),
                i = a ? e[p] : "",
                r = (t.getAttribute("value"), {
                    available: !t.disabled,
                    id: parseFloat(t.value),
                    price: i,
                    option1: o[0],
                    option2: o[1],
                    option3: o[2]
                });
            l.push(r)
        }
    });
    var i = {
        variants: l
    };
    if (0 == n.length) {
        i.options = [];
        for (var r = 0; r < p; r++) i.options[r] = "option " + (r + 1)
    } else i.options = n;
    return i
}, Shopify.SingleOptionSelector = function(o, i, t, e) {
    this.multiSelector = o, this.values = e, this.index = i, this.name = t, this.element = document.createElement("select");
    for (var r = 0; r < e.length; r++) {
        var n = document.createElement("option");
        n.value = e[r], n.innerHTML = e[r], this.element.appendChild(n)
    }
    return this.element.setAttribute("class", this.multiSelector.selectorClass), this.element.setAttribute("data-option", "option" + (i + 1)), this.element.id = o.domIdPrefix + "-option-" + i, this.element.onchange = function(t, e) {
        e = e || {}, o.updateSelectors(i, e)
    }, !0
}, Shopify.Image = {
    preload: function(t, e) {
        for (var o = 0; o < t.length; o++) {
            var i = t[o];
            this.loadImage(this.getSizedImageUrl(i, e))
        }
    },
    loadImage: function(t) {
        (new Image).src = t
    },
    switchImage: function(t, e, o) {
        if (t && e) {
            var i = this.imageSize(e.src),
                r = this.getSizedImageUrl(t.src, i);
            o ? o(r, t, e) : e.src = r
        }
    },
    imageSize: function(t) {
        var e = t.match(/.+_((?:pico|icon|thumb|small|compact|medium|large|grande)|\d{1,4}x\d{0,4}|x\d{1,4})[_\.@]/);
        return null !== e ? e[1] : null
    },
    getSizedImageUrl: function(t, e) {
        if (null == e) return t;
        if ("master" == e) return this.removeProtocol(t);
        var o = t.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i);
        if (null == o) return null;
        var i = t.split(o[0]),
            r = o[0];
        return this.removeProtocol(i[0] + "_" + e + r)
    },
    removeProtocol: function(t) {
        return t.replace(/http(s)?:/, "")
    }
}, Shopify.OptionSelectors.HistoryState = function(t) {
    this.browserSupports() && this.register(t)
}, Shopify.OptionSelectors.HistoryState.prototype.register = function(t) {
    window.addEventListener("popstate", function() {
        t.selectVariantFromParamsOrDropdown({
            popStateCall: !0
        })
    })
}, Shopify.OptionSelectors.HistoryState.prototype.onVariantChange = function(t, e, o) {
    this.browserSupports() && (!t || o.initialLoad || o.popStateCall || Shopify.setParam("variant", t.id))
}, Shopify.OptionSelectors.HistoryState.prototype.browserSupports = function() {
    return window.history && window.history.replaceState
};
