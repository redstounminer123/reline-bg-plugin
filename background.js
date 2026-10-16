//#region src/shim.ts
var e = globalThis;
e.process === void 0 && (e.process = { env: { NODE_ENV: "production" } });
//#endregion
//#region ../../sdk/index.ts
var t = (e) => e, n = 0, r = [];
function i(e) {
	let t = n, i = t, a = e;
	do
		r[t++] = a, a.flags &= -3, a = a.subs?.sub;
	while (a !== void 0 && a.flags & 2);
	for (n = t; i < --t;) {
		let e = r[i];
		r[i++] = r[t], r[t] = e;
	}
}
function a(e) {
	i(e);
}
//#endregion
//#region node_modules/@rezejs/signals/dist/graph.js
function o(e) {
	let t = e.depsTail;
	for (; t !== void 0;) {
		let n = t.prevDep;
		t.dep.dispose !== void 0 && d(t, e), t = n;
	}
}
function s(e) {
	e.flags = 0, c(e);
	let t = e.subs;
	t !== void 0 && d(t);
}
function c(e) {
	let t = e.depsTail;
	for (; t !== void 0;) {
		let n = t.prevDep;
		d(t, e), t = n;
	}
}
function l(e) {
	let t = e.depsTail, n = t === void 0 ? e.deps : t.nextDep;
	for (; n !== void 0;) n = d(n, e);
}
function u(e, t, n) {
	let r = t.depsTail;
	if (r !== void 0 && r.dep === e) return;
	let i = r === void 0 ? t.deps : r.nextDep;
	if (i !== void 0 && i.dep === e) {
		i.version = n, t.depsTail = i;
		return;
	}
	let a = e.subsTail;
	if (a !== void 0 && a.version === n && a.sub === t) return;
	let o = t.depsTail = e.subsTail = {
		version: n,
		dep: e,
		sub: t,
		prevDep: r,
		nextDep: i,
		prevSub: a,
		nextSub: void 0
	};
	i !== void 0 && (i.prevDep = o), r === void 0 ? t.deps = o : r.nextDep = o, a === void 0 ? e.subs = o : a.nextSub = o;
}
function d(e, t = e.sub) {
	let { dep: n, prevDep: r, nextDep: i, nextSub: a, prevSub: o } = e;
	return i === void 0 ? t.depsTail = r : i.prevDep = r, r === void 0 ? t.deps = i : r.nextDep = i, a === void 0 ? n.subsTail = o : a.prevSub = o, o === void 0 ? (n.subs = a) === void 0 && n.unwatched?.() : o.nextSub = a, i;
}
function f(e, t) {
	let n, r = 0, i = !1;
	top: for (;;) {
		let a = e.dep, o = a.flags;
		if (t.flags & 16) i = !0;
		else if ((o & 17) == 17) {
			let e = a.subs;
			a.update() && (e.nextSub !== void 0 && p(e), i = !0);
		} else if ((o & 33) == 33) {
			(n ??= []).push(e), e = a.deps, t = a, ++r;
			continue;
		}
		if (!i) {
			let t = e.nextDep;
			if (t !== void 0) {
				e = t;
				continue;
			}
		}
		for (; r--;) {
			if (e = n.pop(), i) {
				let n = t.subs;
				if (t.update()) {
					n.nextSub !== void 0 && p(n), t = e.sub;
					continue;
				}
				i = !1;
			} else t.flags &= -33;
			t = e.sub;
			let r = e.nextDep;
			if (r !== void 0) {
				e = r;
				continue top;
			}
		}
		return i && t.flags !== 0;
	}
}
function p(e) {
	do {
		let t = e.sub, n = t.flags;
		(n & 48) == 32 && (t.flags = n | 16, (n & 6) == 2 && a(t));
	} while ((e = e.nextSub) !== void 0);
}
//#endregion
//#region node_modules/@rezejs/signals/dist/context.js
var m, h, g = 0, _ = 0;
function v(e) {
	let t = m;
	return m = e, t;
}
function y(e) {
	let t = h;
	return h = e, t;
}
function b(e, t) {
	u(e, t, 0), t.flags |= 64;
}
function x(e) {
	let t = m, n = t ?? h;
	return m = e, n !== void 0 && b(e, n), t;
}
function S() {
	++_;
}
function C() {
	--_;
}
function w(e, t) {
	return !1;
}
function T(e, t) {
	if (!w(e, t)) throw t;
}
function E(e, t) {
	++g, e.depsTail = void 0, e.flags = t | 4;
	let n = m;
	return m = e, n;
}
function D(e, t) {
	m = t, e.flags &= -5, l(e);
}
//#endregion
//#region node_modules/@rezejs/signals/dist/owner.js
function O(e, t) {
	let n = v(void 0);
	if (n === void 0) return e(t);
	let r = y(n);
	try {
		return e(t);
	} finally {
		v(n), y(r);
	}
}
//#endregion
//#region node_modules/@rezejs/signals/dist/render.js
var ee = class {
	constructor(e, t) {
		this.deps = void 0, this.depsTail = void 0, this.subs = void 0, this.subsTail = void 0, this.flags = 6, this.fn = e, this.value = t;
	}
	run() {
		try {
			this.runIfDirty();
		} catch (e) {
			T(this, e);
		}
	}
	runIfDirty() {
		let e = this.flags;
		if (e & 16 || e & 32 && f(this.deps, this)) {
			e & 64 && o(this);
			let t = E(this, 2);
			try {
				S(), this.value = this.fn(this.value);
			} finally {
				C(), D(this, t);
			}
		} else this.deps !== void 0 && (this.flags = 2 | e & 64);
	}
	unwatched() {
		s(this);
	}
	dispose() {
		s(this);
	}
};
function k(e, t) {
	let n = new ee(e, t), r = x(n);
	try {
		S(), n.value = e(n.value);
	} finally {
		C(), v(r), n.flags &= -5;
	}
	n.deps === void 0 && s(n);
}
//#endregion
//#region node_modules/@rezejs/signals/dist/internal/scope.js
var A = O;
//#endregion
//#region node_modules/@rezejs/dom/dist/attributes.js
function j(e, t, n) {
	n == null || n === !1 ? e.removeAttribute(t) : e.setAttribute(t, n);
}
//#endregion
//#region node_modules/@rezejs/dom/dist/reconcile.js
function M(e, t, n) {
	let r = n.length, i = t.length, a = r, o = 0, s = 0, c = t[i - 1].nextSibling, l;
	for (; o < i || s < a;) if (t[o] === n[s]) o++, s++;
	else {
		for (; t[i - 1] === n[a - 1];) i--, a--;
		if (i === o) {
			let t = a < r ? s ? n[s - 1].nextSibling : n[a - s] : c;
			for (; s < a;) e.insertBefore(n[s++], t);
		} else if (a === s) for (; o < i;) l?.has(t[o]) || t[o].remove(), o++;
		else if (t[o] === n[a - 1] && n[s] === t[i - 1]) {
			let r = t[--i].nextSibling;
			e.insertBefore(n[s++], t[o++].nextSibling), e.insertBefore(n[--a], r), t[i] = n[a];
		} else {
			if (!l) {
				l = /* @__PURE__ */ new Map();
				for (let e = s; e < a; e++) l.set(n[e], e);
			}
			let r = l.get(t[o]);
			if (r == null) t[o++].remove();
			else if (s < r && r < a) {
				let c = o, u = 1;
				for (; ++c < i && c < a;) {
					let e = l.get(t[c]);
					if (e == null || e !== r + u) break;
					u++;
				}
				if (u > r - s) {
					let i = t[o];
					for (; s < r;) e.insertBefore(n[s++], i);
				} else e.replaceChild(n[s++], t[o++]);
			} else o++;
		}
	}
}
//#endregion
//#region node_modules/@rezejs/dom/dist/insert.js
function N(e, t, n) {
	let r = n === void 0 ? void 0 : [];
	typeof t == "function" ? k((r) => P(e, t(), r, n), r) : P(e, t, r, n);
}
function P(e, t, n, r, i) {
	for (; typeof n == "function";) n = n();
	if (t === n) return n;
	let a = r !== void 0;
	a && (e = n[0]?.parentNode ?? e);
	let o = typeof t;
	if (o === "string" || o === "number" || o === "bigint") {
		let i = String(t);
		if (a) {
			let t = n, a = t[0];
			return a !== void 0 && a.nodeType === 3 ? (a.data !== i && (a.data = i), t.length === 1 ? t : R(e, t, r, a)) : R(e, t, r, document.createTextNode(i));
		}
		return typeof n == "string" && n !== "" ? e.firstChild.data = i : e.textContent = i, i;
	}
	if (t == null || o === "boolean") return R(e, n, r);
	if (o === "function") return k(() => {
		let i = t();
		for (; typeof i == "function";) i = i();
		n = P(e, i, n, r);
	}), () => n;
	if (Array.isArray(t)) {
		let o = [];
		if (F(o, t, n, i)) return k(() => {
			n = P(e, o, n, r, !0);
		}), () => n;
		let s = o;
		if (s.length === 0) {
			let t = R(e, n, r);
			return a ? t : s;
		}
		return Array.isArray(n) ? n.length === 0 ? L(e, s, r ?? null) : M(e, n, s) : (n && (e.textContent = ""), L(e, s, null)), s;
	}
	if (t.nodeType !== void 0) {
		let i = t;
		if (Array.isArray(n)) {
			if (a) return R(e, n, r, i);
			R(e, n, null, i);
		} else e.firstChild === null ? e.appendChild(i) : e.replaceChild(i, e.firstChild);
		return i;
	}
	return n;
}
function F(e, t, n, r) {
	let i = !1;
	for (let a = 0; a < t.length; a++) I(e, t[a], n, r) && (i = !0);
	return i;
}
function I(e, t, n, r) {
	if (typeof t == "function") {
		if (!r) return e.push(t), !0;
		do
			t = t();
		while (typeof t == "function");
	}
	if (t == null || typeof t == "boolean") return !1;
	if (Array.isArray(t)) return F(e, t, n, r);
	if (t.nodeType !== void 0) return e.push(t), !1;
	let i = String(t), a = Array.isArray(n) ? n[e.length] : void 0;
	return a !== void 0 && a.nodeType === 3 ? (a.data !== i && (a.data = i), e.push(a)) : e.push(document.createTextNode(i)), !1;
}
function L(e, t, n) {
	if (t.length < 2) {
		for (let r = 0; r < t.length; r++) e.insertBefore(t[r], n);
		return;
	}
	let r = document.createDocumentFragment();
	for (let e = 0; e < t.length; e++) r.appendChild(t[e]);
	e.insertBefore(r, n);
}
function R(e, t, n, r) {
	if (n === void 0) return e.textContent = "", "";
	let i = r ?? document.createTextNode(""), a = t;
	if (a.length === 0) return e.insertBefore(i, n), [i];
	let o = !1;
	for (let t = a.length - 1; t >= 0; t--) {
		let r = a[t];
		if (r === i) {
			o = !0;
			continue;
		}
		let s = r.parentNode === e;
		!o && t === 0 ? s ? e.replaceChild(i, r) : e.insertBefore(i, n) : s && r.remove();
	}
	return [i];
}
//#endregion
//#region node_modules/@rezejs/dom/dist/component.js
function z(e, t, n) {
	return A(e, t);
}
//#endregion
//#region node_modules/@rezejs/dom/dist/ref.js
function B(e, t, n) {
	O(() => e(t, n));
}
//#endregion
//#region node_modules/@rezejs/dom/dist/style.js
function te(e, t, n) {
	let r = e.style;
	if (t == null) return e.setAttribute("style", ""), e.removeAttribute("style"), t;
	if (typeof t == "string") return r.cssText = t, t;
	let i = typeof n == "object" && n ? n : void 0;
	if (i === void 0) r.cssText = "";
	else for (let e in i) t[e] ?? r.removeProperty(e);
	for (let e in t) {
		let n = t[e];
		n != null && (i === void 0 || n !== i[e]) && r.setProperty(e, n);
	}
	return t;
}
//#endregion
//#region node_modules/@rezejs/dom/dist/template.js
var V = /* @__PURE__ */ new Map();
function H(e) {
	let t = document.createElement("template");
	return t.innerHTML = e, t.content.firstChild;
}
function U(e) {
	let t = V.get(e);
	return t === void 0 && V.set(e, t = H(e)), t.cloneNode(!0);
}
//#endregion
//#region src/index.tsx
var W = [
	{
		id: "none",
		labelKey: "bgNone",
		value: { kind: "none" }
	},
	{
		id: "dark",
		labelKey: "bgDark",
		value: {
			kind: "color",
			color: "#1a1a1f"
		}
	},
	{
		id: "light",
		labelKey: "bgLight",
		value: {
			kind: "color",
			color: "#f5f5f7"
		}
	},
	{
		id: "dusk",
		labelKey: "bgDusk",
		value: {
			kind: "gradient",
			from: "#2b1055",
			to: "#7597de",
			angle: 135
		}
	},
	{
		id: "ember",
		labelKey: "bgEmber",
		value: {
			kind: "gradient",
			from: "#ff512f",
			to: "#dd2476",
			angle: 45
		}
	}
], G = "[class*=\"workspace\"]", K = "acme-bg-host", q = "acme-bg-workspace-style", J = [
	"--color-bg",
	"--color-surface",
	"--color-surface-strong",
	"--color-surface-raised",
	"--color-surface-sunken",
	"--color-field"
], Y = t({ activate(e) {
	let { Button: t, IconButton: n, Icon: r } = e.ui.kit;
	e.i18n.add("en", {
		bgTab: "Background",
		bgNone: "None",
		bgDark: "Dark",
		bgLight: "Light",
		bgDusk: "Dusk",
		bgEmber: "Ember",
		bgKind: "Type",
		bgColor: "Color",
		bgGradientFrom: "From",
		bgGradientTo: "To",
		bgGradientAngle: "Angle",
		bgImageUrl: "Image URL",
		bgImageFile: "Upload image",
		bgFit: "Fit",
		bgFitCover: "Cover",
		bgFitContain: "Contain",
		bgFitRepeat: "Repeat",
		bgDim: "Dim",
		bgReset: "Reset",
		bgPresets: "Presets",
		bgNone_: "None",
		bgColor_: "Color",
		bgGradient_: "Gradient",
		bgImage_: "Image",
		bgPanelOpacity: "Panel opacity",
		bgPanelBlur: "Panel blur",
		bgBgBlur: "Background blur",
		bgBgOpacity: "Background opacity"
	}), e.i18n.add("ru", {
		bgTab: "Фон",
		bgNone: "Нет",
		bgDark: "Тёмный",
		bgLight: "Светлый",
		bgDusk: "Сумерки",
		bgEmber: "Угли",
		bgKind: "Тип",
		bgColor: "Цвет",
		bgGradientFrom: "От",
		bgGradientTo: "До",
		bgGradientAngle: "Угол",
		bgImageUrl: "Ссылка на изображение",
		bgImageFile: "Загрузить изображение",
		bgFit: "Заполнение",
		bgFitCover: "Заполнить",
		bgFitContain: "Вместить",
		bgFitRepeat: "Повторять",
		bgDim: "Затемнение",
		bgReset: "Сбросить",
		bgPresets: "Готовые",
		bgNone_: "Нет",
		bgColor_: "Цвет",
		bgGradient_: "Градиент",
		bgImage_: "Картинка",
		bgPanelOpacity: "Прозрачность панелей",
		bgPanelBlur: "Размытие панелей",
		bgBgBlur: "Размытие фона",
		bgBgOpacity: "Прозрачность фона"
	});
	let i = e.storage.getJson("background") ?? { kind: "none" }, a = e.storage.getJson("bgBlur") ?? 0, o = e.storage.getJson("bgOpacity") ?? 1, s = e.storage.getJson("panelOpacity") ?? 1, c = e.storage.getJson("panelBlur") ?? 0, l = (e) => (t) => {
		t.addEventListener("click", e);
	}, u = (e) => (t) => {
		t.addEventListener("input", e);
	}, d = (e) => (t) => {
		t.addEventListener("change", e);
	}, f = null;
	function p() {
		if (f) return;
		let e = document.documentElement;
		for (let t of J) e.style.removeProperty(t);
		let t = getComputedStyle(e);
		f = {};
		for (let e of J) f[e] = t.getPropertyValue(e).trim();
	}
	function m(e) {
		p();
		let t = document.documentElement;
		for (let n of J) {
			let r = f[n];
			r && (e >= 1 ? t.style.removeProperty(n) : t.style.setProperty(n, `color-mix(in srgb, ${r} ${e * 100}%, transparent)`));
		}
	}
	function h(e) {
		document.documentElement.style.setProperty("--acme-panel-blur", `${e}px`);
	}
	function g(e) {
		switch (e.kind) {
			case "none": return "transparent";
			case "color": return e.color;
			case "gradient": return `linear-gradient(${e.angle}deg, ${e.from}, ${e.to})`;
			case "image": {
				let t = e.fit === "repeat" ? "auto" : e.fit, n = e.fit === "repeat" ? "repeat" : "no-repeat", r = Math.max(0, Math.min(1, e.dim));
				return `linear-gradient(rgba(0,0,0,${r}), rgba(0,0,0,${r})), url("${e.url}") center/${t} ${n}`;
			}
		}
	}
	function _() {
		let e = `${G}.${K}`;
		return `
        ${e} {
          position: relative !important;
          overflow: hidden !important;
          isolation: isolate !important;
        }
        ${e}::before {
          content: "" !important;
          position: absolute !important;
          inset: 0 !important;
          background: ${g(i)} !important;
          background-attachment: fixed !important;
          pointer-events: none !important;
          z-index: -1 !important;
          filter: blur(${a}px) !important;
          opacity: ${o} !important;
          transition: background 0.2s ease, filter 0.2s ease, opacity 0.2s ease;
        }
        ${G} [class*="column"],
        ${G} [class*="columns"],
        ${G} [class*="strip"],
        ${G} [class*="panel"],
        ${G} [class*="card"],
        ${G} [class*="nodeCard"],
        ${G} [class*="nodeBody"],
        ${G} [class*="tabScroll"] {
          backdrop-filter: blur(var(--acme-panel-blur, 0px)) !important;
          -webkit-backdrop-filter: blur(var(--acme-panel-blur, 0px)) !important;
        }
      `;
	}
	function v() {
		try {
			let e = document.querySelector(G);
			if (!e) return;
			for (let t of [
				"background",
				"background-image",
				"background-size",
				"background-repeat",
				"background-position",
				"background-attachment"
			]) e.style.removeProperty(t);
			e.classList.add(K);
			let t = document.getElementById(q);
			t || (t = document.createElement("style"), t.id = q, document.head.appendChild(t)), t.textContent = _(), m(s), h(c);
		} catch (t) {
			e.log("background: apply failed", String(t));
		}
	}
	function y() {
		try {
			e.storage.setJson("background", i), e.storage.setJson("bgBlur", a), e.storage.setJson("bgOpacity", o), e.storage.setJson("panelOpacity", s), e.storage.setJson("panelBlur", c);
		} catch (t) {
			e.log("background: save failed", String(t));
		}
	}
	function b() {
		let e = document.querySelector(".acme-bg");
		if (!e) return;
		for (let t of [
			"color",
			"gradient",
			"image"
		]) {
			let n = e.querySelector(`[data-block="${t}"]`);
			n && (n.style.display = i.kind === t ? "flex" : "none");
		}
		if (e.querySelectorAll("[data-preset]").forEach((e) => {
			let t = e.dataset.preset, n = W.find((e) => e.id === t);
			n && (X(i, n.value) ? e.classList.add("acme-bg__swatch--active") : e.classList.remove("acme-bg__swatch--active"));
		}), i.kind === "color") {
			let t = e.querySelector("[data-field='color']");
			t && (t.value = i.color);
		}
		if (i.kind === "gradient") {
			let t = e.querySelector("[data-field='gradFrom']"), n = e.querySelector("[data-field='gradTo']"), r = e.querySelector("[data-field='gradAngle']"), a = e.querySelector("[data-label='gradAngle']");
			t && (t.value = i.from), n && (n.value = i.to), r && (r.value = String(i.angle)), a && (a.textContent = i.angle + "°");
		}
		if (i.kind === "image") {
			let t = e.querySelector("[data-field='imgUrl']"), n = e.querySelector("[data-field='imgDim']"), r = e.querySelector("[data-label='imgDim']");
			t && (t.value = i.url.startsWith("data:") ? "" : i.url), n && (n.value = String(Math.round(i.dim * 100))), r && (r.textContent = Math.round(i.dim * 100) + "%");
		}
		let t = e.querySelector("[data-field='bgBlur']"), n = e.querySelector("[data-label='bgBlur']");
		t && (t.value = String(a)), n && (n.textContent = a + " px");
		let r = e.querySelector("[data-field='bgOpacity']"), l = e.querySelector("[data-label='bgOpacity']");
		r && (r.value = String(Math.round(o * 100))), l && (l.textContent = Math.round(o * 100) + "%");
		let u = e.querySelector("[data-field='panelOpacity']"), d = e.querySelector("[data-label='panelOpacity']");
		u && (u.value = String(Math.round(s * 100))), d && (d.textContent = Math.round(s * 100) + "%");
		let f = e.querySelector("[data-field='panelBlur']"), p = e.querySelector("[data-label='panelBlur']");
		f && (f.value = String(c)), p && (p.textContent = c + " px");
	}
	let x = (e) => {
		i = e, v(), y(), b();
	}, S = (e) => {
		a = e, v(), y(), b();
	}, C = (e) => {
		o = e, v(), y(), b();
	}, w = (e) => {
		s = e, v(), y(), b();
	}, T = (e) => {
		c = e, v(), y(), b();
	}, E = 0, D = () => {
		document.querySelector(G) ? (v(), setTimeout(b, 200), setTimeout(b, 800)) : (E++, E < 20 ? setTimeout(D, 250) : e.log("background: workspace element never appeared"));
	};
	D(), e.onDispose(() => {
		let e = document.documentElement;
		for (let t of J) e.style.removeProperty(t);
		e.style.removeProperty("--acme-panel-blur"), document.getElementById(q)?.remove(), document.querySelector(`.${K}`)?.classList.remove(K);
	}), e.ui.panelTab({
		id: "acme.background.tab",
		label: e.i18n.text("bgTab"),
		Component: () => {
			let a = (e, t) => {
				i.kind === "gradient" && x({
					...i,
					[e]: t
				});
			}, o = async (t) => {
				if (t.size > 2097152) {
					e.log("background: file too large (max 2 MB)");
					return;
				}
				let n = await new Promise((e, n) => {
					let r = new FileReader();
					r.onload = () => e(String(r.result)), r.onerror = () => n(r.error), r.readAsDataURL(t);
				});
				x({
					kind: "image",
					url: n,
					fit: "cover",
					dim: 0
				});
			}, s = (t) => e.i18n.t(`bg${t[0].toUpperCase()}${t.slice(1)}_`);
			{
				let c = U("<div class=acme-bg><div class=acme-bg__row><span class=acme-bg__label></span></div><div class=acme-bg__presets></div><div class=acme-bg__row><span class=acme-bg__label></span><div class=acme-bg__kinds></div></div><div data-block=color class=acme-bg__row style=display:none><span class=acme-bg__label></span><input type=color class=acme-bg__color data-field=color></div><div data-block=gradient style=display:none><div class=acme-bg__row><span class=acme-bg__label></span><input type=color class=acme-bg__color data-field=gradFrom></div><div class=acme-bg__row><span class=acme-bg__label></span><input type=color class=acme-bg__color data-field=gradTo></div><div class=acme-bg__row><span class=acme-bg__label></span><input type=range min=0 max=360 data-field=gradAngle><span class=acme-bg__num data-label=gradAngle>0°</span></div></div><div data-block=image style=display:none><div class=acme-bg__row><span class=acme-bg__label></span><input class=acme-bg__url type=text placeholder=https://… data-field=imgUrl></div><div class=acme-bg__row><label class=acme-bg__upload><span></span><input type=file accept=image/* class=acme-bg__file></label></div><div class=acme-bg__row><span class=acme-bg__label></span><div class=acme-bg__kinds></div></div><div class=acme-bg__row><span class=acme-bg__label></span><input type=range min=0 max=100 data-field=imgDim><span class=acme-bg__num data-label=imgDim>0%</span></div></div><div class=acme-bg__row><span class=acme-bg__label></span><input type=range min=0 max=50 data-field=bgBlur><span class=acme-bg__num data-label=bgBlur>0 px</span></div><div class=acme-bg__row><span class=acme-bg__label></span><input type=range min=0 max=100 data-field=bgOpacity><span class=acme-bg__num data-label=bgOpacity>100%</span></div><div class=acme-bg__row><span class=acme-bg__label></span><input type=range min=0 max=100 data-field=panelOpacity><span class=acme-bg__num data-label=panelOpacity>100%</span></div><div class=acme-bg__row><span class=acme-bg__label></span><input type=range min=0 max=30 data-field=panelBlur><span class=acme-bg__num data-label=panelBlur>0 px</span></div><div class=acme-bg__row>"), f = c.firstChild, p = f.firstChild, m = f.nextSibling, h = m.nextSibling, g = h.firstChild, _ = g.nextSibling, v = h.nextSibling, y = v.firstChild, b = y.nextSibling, E = v.nextSibling, D = E.firstChild, O = D.firstChild, ee = O.nextSibling, A = D.nextSibling, M = A.firstChild, P = M.nextSibling, F = A.nextSibling.firstChild, I = F.nextSibling, L = E.nextSibling, R = L.firstChild, V = R.firstChild, H = V.nextSibling, G = R.nextSibling, K = G.firstChild, q = K.firstChild, J = q.nextSibling, Y = G.nextSibling, X = Y.firstChild, re = X.nextSibling, Z = Y.nextSibling.firstChild, ie = Z.nextSibling, Q = L.nextSibling, ae = Q.firstChild, oe = ae.nextSibling, se = Q.nextSibling, ce = se.firstChild, le = ce.nextSibling, ue = se.nextSibling, de = ue.firstChild, fe = de.nextSibling, pe = ue.nextSibling, me = pe.firstChild, he = me.nextSibling, ge = pe.nextSibling, _e = u((e) => x({
					kind: "color",
					color: e.target.value
				}));
				typeof _e == "function" && B(_e, b);
				let ve = u((e) => a("from", e.target.value));
				typeof ve == "function" && B(ve, ee);
				let ye = u((e) => a("to", e.target.value));
				typeof ye == "function" && B(ye, P);
				let be = u((e) => a("angle", Number(e.target.value)));
				typeof be == "function" && B(be, I);
				let $ = u((e) => x({
					...i,
					url: e.target.value
				}));
				typeof $ == "function" && B($, H);
				let xe = d((e) => {
					let t = e.target.files?.[0];
					t && o(t);
				});
				typeof xe == "function" && B(xe, J);
				let Se = u((e) => {
					i.kind === "image" && x({
						...i,
						dim: Number(e.target.value) / 100
					});
				});
				typeof Se == "function" && B(Se, ie);
				let Ce = u((e) => S(Number(e.target.value)));
				typeof Ce == "function" && B(Ce, oe);
				let we = u((e) => C(Number(e.target.value) / 100));
				typeof we == "function" && B(we, le);
				let Te = u((e) => w(Number(e.target.value) / 100));
				typeof Te == "function" && B(Te, fe);
				let Ee = u((e) => T(Number(e.target.value)));
				return typeof Ee == "function" && B(Ee, he), N(p, () => e.i18n.t("bgPresets")), N(m, () => W.map((t) => {
					let n = U("<button type=button class=acme-bg__swatch>"), r = l(() => x(t.value));
					typeof r == "function" && B(r, n), k(() => {
						let e = t.id;
						j(n, "data-preset", e);
					}), k(() => {
						let r = e.i18n.t(t.labelKey);
						j(n, "aria-label", r);
					}), k(() => {
						let r = e.i18n.t(t.labelKey);
						j(n, "title", r);
					});
					let i;
					return k(() => {
						let e = "background: " + ne(t.value);
						i = te(n, e, i);
					}), n;
				})), N(g, () => e.i18n.t("bgKind")), N(_, () => [
					"none",
					"color",
					"gradient",
					"image"
				].map((e) => z(t, {
					get variant() {
						return i.kind === e ? "primary" : void 0;
					},
					onClick: () => x(e === "none" ? { kind: "none" } : e === "color" ? {
						kind: "color",
						color: "#1a1a1f"
					} : e === "gradient" ? {
						kind: "gradient",
						from: "#2b1055",
						to: "#7597de",
						angle: 135
					} : {
						kind: "image",
						url: "",
						fit: "cover",
						dim: 0
					}),
					get children() {
						return s(e);
					}
				}))), N(y, () => e.i18n.t("bgColor")), N(O, () => e.i18n.t("bgGradientFrom")), N(M, () => e.i18n.t("bgGradientTo")), N(F, () => e.i18n.t("bgGradientAngle")), N(V, () => e.i18n.t("bgImageUrl")), N(K, z(r, { name: "upload" }), q), N(q, () => e.i18n.t("bgImageFile")), N(X, () => e.i18n.t("bgFit")), N(re, () => [
					"cover",
					"contain",
					"repeat"
				].map((n) => z(t, {
					get variant() {
						return i.kind === "image" && i.fit === n ? "primary" : void 0;
					},
					onClick: () => {
						i.kind === "image" && x({
							...i,
							fit: n
						});
					},
					get children() {
						return e.i18n.t(`bgFit${n[0].toUpperCase()}${n.slice(1)}`);
					}
				}))), N(Z, () => e.i18n.t("bgDim")), N(ae, () => e.i18n.t("bgBgBlur")), N(ce, () => e.i18n.t("bgBgOpacity")), N(de, () => e.i18n.t("bgPanelOpacity")), N(me, () => e.i18n.t("bgPanelBlur")), N(ge, z(n, {
					icon: "refresh",
					get label() {
						return e.i18n.t("bgReset");
					},
					onClick: () => {
						x({ kind: "none" }), S(0), C(1), w(1), T(0);
					}
				})), c;
			}
		},
		order: 60
	}), e.ui.styles("\n      .acme-bg { display: flex; flex-direction: column; gap: var(--space-2, 8px); padding: var(--space-2, 8px); }\n      .acme-bg__row { display: flex; align-items: center; gap: var(--space-2, 8px); }\n      .acme-bg [data-block] { display: flex; flex-direction: column; gap: var(--space-2, 8px); }\n      .acme-bg__label { min-width: 90px; color: var(--color-text-muted, #8a8a94); font-size: var(--font-size-sm, 12px); }\n      .acme-bg__kinds { display: flex; gap: var(--space-1, 4px); flex-wrap: wrap; }\n      .acme-bg__presets { display: flex; gap: var(--space-2, 8px); }\n      .acme-bg__swatch {\n        width: 32px; height: 32px; border-radius: var(--radius-md, 6px);\n        border: 2px solid transparent; cursor: pointer; padding: 0;\n        background-size: cover; background-position: center;\n      }\n      .acme-bg__swatch--active { border-color: var(--color-accent, #7c5cff); }\n      .acme-bg__color { width: 40px; height: 24px; border: none; background: none; padding: 0; cursor: pointer; }\n      .acme-bg__upload {\n        display: inline-flex; align-items: center; gap: var(--space-2, 8px);\n        cursor: pointer; color: var(--color-text, #e6e6ea);\n      }\n      .acme-bg__file { display: none; }\n      .acme-bg__num {\n        color: var(--color-text-muted, #8a8a94); font-size: var(--font-size-sm, 12px);\n        min-width: 40px; text-align: right;\n      }\n      .acme-bg__row input[type=\"range\"] { flex: 1; }\n      .acme-bg__url {\n        flex: 1; padding: var(--space-1, 4px) var(--space-2, 8px);\n        background: var(--color-bg-2, #1a1a1f); color: var(--color-text, #e6e6ea);\n        border: 1px solid var(--color-border, #2a2a30); border-radius: var(--radius-sm, 4px);\n        font-size: var(--font-size-sm, 12px);\n      }\n    "), e.log("background: ready");
} });
function X(e, t) {
	return e.kind === t.kind ? e.kind === "color" && t.kind === "color" ? e.color === t.color : e.kind === "gradient" && t.kind === "gradient" ? e.from === t.from && e.to === t.to && e.angle === t.angle : e.kind === "none" && t.kind === "none" : !1;
}
function ne(e) {
	switch (e.kind) {
		case "none": return "repeating-conic-gradient(#2a2a30 0 25%, #1a1a1f 0 50%) 0 0/12px 12px";
		case "color": return e.color;
		case "gradient": return `linear-gradient(${e.angle}deg, ${e.from}, ${e.to})`;
		case "image": return e.url ? `center / cover no-repeat url("${e.url}")` : "#444";
	}
}
//#endregion
export { Y as default };
