import {
  bowser_default,
  esm_default as esm_default2
} from "./chunk-5YN6R62V.js";
import {
  esm_default
} from "./chunk-UKICTQGP.js";

// node_modules/@perawallet/connect/dist/index-87e811df.js
var r = "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {};
var o = [];
var i = [];
var s = "undefined" != typeof Uint8Array ? Uint8Array : Array;
var a = false;
function l() {
  a = true;
  for (var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", e = 0; e < 64; ++e) o[e] = t[e], i[t.charCodeAt(e)] = e;
  i["-".charCodeAt(0)] = 62, i["_".charCodeAt(0)] = 63;
}
function u(t, e, n) {
  for (var r2, i2, s2 = [], a2 = e; a2 < n; a2 += 3) r2 = (t[a2] << 16) + (t[a2 + 1] << 8) + t[a2 + 2], s2.push(o[(i2 = r2) >> 18 & 63] + o[i2 >> 12 & 63] + o[i2 >> 6 & 63] + o[63 & i2]);
  return s2.join("");
}
function c(t) {
  var e;
  a || l();
  for (var n = t.length, r2 = n % 3, i2 = "", s2 = [], c2 = 16383, h2 = 0, f2 = n - r2; h2 < f2; h2 += c2) s2.push(u(t, h2, h2 + c2 > f2 ? f2 : h2 + c2));
  return 1 === r2 ? (e = t[n - 1], i2 += o[e >> 2], i2 += o[e << 4 & 63], i2 += "==") : 2 === r2 && (e = (t[n - 2] << 8) + t[n - 1], i2 += o[e >> 10], i2 += o[e >> 4 & 63], i2 += o[e << 2 & 63], i2 += "="), s2.push(i2), s2.join("");
}
function h(t, e, n, r2, o2) {
  var i2, s2, a2 = 8 * o2 - r2 - 1, l2 = (1 << a2) - 1, u2 = l2 >> 1, c2 = -7, h2 = n ? o2 - 1 : 0, f2 = n ? -1 : 1, d2 = t[e + h2];
  for (h2 += f2, i2 = d2 & (1 << -c2) - 1, d2 >>= -c2, c2 += a2; c2 > 0; i2 = 256 * i2 + t[e + h2], h2 += f2, c2 -= 8) ;
  for (s2 = i2 & (1 << -c2) - 1, i2 >>= -c2, c2 += r2; c2 > 0; s2 = 256 * s2 + t[e + h2], h2 += f2, c2 -= 8) ;
  if (0 === i2) i2 = 1 - u2;
  else {
    if (i2 === l2) return s2 ? NaN : 1 / 0 * (d2 ? -1 : 1);
    s2 += Math.pow(2, r2), i2 -= u2;
  }
  return (d2 ? -1 : 1) * s2 * Math.pow(2, i2 - r2);
}
function f(t, e, n, r2, o2, i2) {
  var s2, a2, l2, u2 = 8 * i2 - o2 - 1, c2 = (1 << u2) - 1, h2 = c2 >> 1, f2 = 23 === o2 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, d2 = r2 ? 0 : i2 - 1, p2 = r2 ? 1 : -1, g2 = e < 0 || 0 === e && 1 / e < 0 ? 1 : 0;
  for (e = Math.abs(e), isNaN(e) || e === 1 / 0 ? (a2 = isNaN(e) ? 1 : 0, s2 = c2) : (s2 = Math.floor(Math.log(e) / Math.LN2), e * (l2 = Math.pow(2, -s2)) < 1 && (s2--, l2 *= 2), (e += s2 + h2 >= 1 ? f2 / l2 : f2 * Math.pow(2, 1 - h2)) * l2 >= 2 && (s2++, l2 /= 2), s2 + h2 >= c2 ? (a2 = 0, s2 = c2) : s2 + h2 >= 1 ? (a2 = (e * l2 - 1) * Math.pow(2, o2), s2 += h2) : (a2 = e * Math.pow(2, h2 - 1) * Math.pow(2, o2), s2 = 0)); o2 >= 8; t[n + d2] = 255 & a2, d2 += p2, a2 /= 256, o2 -= 8) ;
  for (s2 = s2 << o2 | a2, u2 += o2; u2 > 0; t[n + d2] = 255 & s2, d2 += p2, s2 /= 256, u2 -= 8) ;
  t[n + d2 - p2] |= 128 * g2;
}
var d = {}.toString;
var p = Array.isArray || function(t) {
  return "[object Array]" == d.call(t);
};
function g() {
  return y.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823;
}
function w(t, e) {
  if (g() < e) throw new RangeError("Invalid typed array length");
  return y.TYPED_ARRAY_SUPPORT ? (t = new Uint8Array(e)).__proto__ = y.prototype : (null === t && (t = new y(e)), t.length = e), t;
}
function y(t, e, n) {
  if (!(y.TYPED_ARRAY_SUPPORT || this instanceof y)) return new y(t, e, n);
  if ("number" == typeof t) {
    if ("string" == typeof e) throw new Error("If encoding is specified then the first argument must be a string");
    return b(this, t);
  }
  return v(this, t, e, n);
}
function v(t, e, n, r2) {
  if ("number" == typeof e) throw new TypeError('"value" argument must not be a number');
  return "undefined" != typeof ArrayBuffer && e instanceof ArrayBuffer ? function(t2, e2, n2, r3) {
    if (e2.byteLength, n2 < 0 || e2.byteLength < n2) throw new RangeError("'offset' is out of bounds");
    if (e2.byteLength < n2 + (r3 || 0)) throw new RangeError("'length' is out of bounds");
    e2 = void 0 === n2 && void 0 === r3 ? new Uint8Array(e2) : void 0 === r3 ? new Uint8Array(e2, n2) : new Uint8Array(e2, n2, r3);
    y.TYPED_ARRAY_SUPPORT ? (t2 = e2).__proto__ = y.prototype : t2 = A(t2, e2);
    return t2;
  }(t, e, n, r2) : "string" == typeof e ? function(t2, e2, n2) {
    "string" == typeof n2 && "" !== n2 || (n2 = "utf8");
    if (!y.isEncoding(n2)) throw new TypeError('"encoding" must be a valid string encoding');
    var r3 = 0 | _(e2, n2);
    t2 = w(t2, r3);
    var o2 = t2.write(e2, n2);
    o2 !== r3 && (t2 = t2.slice(0, o2));
    return t2;
  }(t, e, n) : function(t2, e2) {
    if (T(e2)) {
      var n2 = 0 | E(e2.length);
      return 0 === (t2 = w(t2, n2)).length || e2.copy(t2, 0, 0, n2), t2;
    }
    if (e2) {
      if ("undefined" != typeof ArrayBuffer && e2.buffer instanceof ArrayBuffer || "length" in e2) return "number" != typeof e2.length || (r3 = e2.length) != r3 ? w(t2, 0) : A(t2, e2);
      if ("Buffer" === e2.type && p(e2.data)) return A(t2, e2.data);
    }
    var r3;
    throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.");
  }(t, e);
}
function m(t) {
  if ("number" != typeof t) throw new TypeError('"size" argument must be a number');
  if (t < 0) throw new RangeError('"size" argument must not be negative');
}
function b(t, e) {
  if (m(e), t = w(t, e < 0 ? 0 : 0 | E(e)), !y.TYPED_ARRAY_SUPPORT) for (var n = 0; n < e; ++n) t[n] = 0;
  return t;
}
function A(t, e) {
  var n = e.length < 0 ? 0 : 0 | E(e.length);
  t = w(t, n);
  for (var r2 = 0; r2 < n; r2 += 1) t[r2] = 255 & e[r2];
  return t;
}
function E(t) {
  if (t >= g()) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + g().toString(16) + " bytes");
  return 0 | t;
}
function T(t) {
  return !(null == t || !t._isBuffer);
}
function _(t, e) {
  if (T(t)) return t.length;
  if ("undefined" != typeof ArrayBuffer && "function" == typeof ArrayBuffer.isView && (ArrayBuffer.isView(t) || t instanceof ArrayBuffer)) return t.byteLength;
  "string" != typeof t && (t = "" + t);
  var n = t.length;
  if (0 === n) return 0;
  for (var r2 = false; ; ) switch (e) {
    case "ascii":
    case "latin1":
    case "binary":
      return n;
    case "utf8":
    case "utf-8":
    case void 0:
      return V(t).length;
    case "ucs2":
    case "ucs-2":
    case "utf16le":
    case "utf-16le":
      return 2 * n;
    case "hex":
      return n >>> 1;
    case "base64":
      return Z(t).length;
    default:
      if (r2) return V(t).length;
      e = ("" + e).toLowerCase(), r2 = true;
  }
}
function R(t, e, n) {
  var r2 = false;
  if ((void 0 === e || e < 0) && (e = 0), e > this.length) return "";
  if ((void 0 === n || n > this.length) && (n = this.length), n <= 0) return "";
  if ((n >>>= 0) <= (e >>>= 0)) return "";
  for (t || (t = "utf8"); ; ) switch (t) {
    case "hex":
      return k(this, e, n);
    case "utf8":
    case "utf-8":
      return W(this, e, n);
    case "ascii":
      return x(this, e, n);
    case "latin1":
    case "binary":
      return Y(this, e, n);
    case "base64":
      return B(this, e, n);
    case "ucs2":
    case "ucs-2":
    case "utf16le":
    case "utf-16le":
      return j(this, e, n);
    default:
      if (r2) throw new TypeError("Unknown encoding: " + t);
      t = (t + "").toLowerCase(), r2 = true;
  }
}
function S(t, e, n) {
  var r2 = t[e];
  t[e] = t[n], t[n] = r2;
}
function N(t, e, n, r2, o2) {
  if (0 === t.length) return -1;
  if ("string" == typeof n ? (r2 = n, n = 0) : n > 2147483647 ? n = 2147483647 : n < -2147483648 && (n = -2147483648), n = +n, isNaN(n) && (n = o2 ? 0 : t.length - 1), n < 0 && (n = t.length + n), n >= t.length) {
    if (o2) return -1;
    n = t.length - 1;
  } else if (n < 0) {
    if (!o2) return -1;
    n = 0;
  }
  if ("string" == typeof e && (e = y.from(e, r2)), T(e)) return 0 === e.length ? -1 : C(t, e, n, r2, o2);
  if ("number" == typeof e) return e &= 255, y.TYPED_ARRAY_SUPPORT && "function" == typeof Uint8Array.prototype.indexOf ? o2 ? Uint8Array.prototype.indexOf.call(t, e, n) : Uint8Array.prototype.lastIndexOf.call(t, e, n) : C(t, [e], n, r2, o2);
  throw new TypeError("val must be string, number or Buffer");
}
function C(t, e, n, r2, o2) {
  var i2, s2 = 1, a2 = t.length, l2 = e.length;
  if (void 0 !== r2 && ("ucs2" === (r2 = String(r2).toLowerCase()) || "ucs-2" === r2 || "utf16le" === r2 || "utf-16le" === r2)) {
    if (t.length < 2 || e.length < 2) return -1;
    s2 = 2, a2 /= 2, l2 /= 2, n /= 2;
  }
  function u2(t2, e2) {
    return 1 === s2 ? t2[e2] : t2.readUInt16BE(e2 * s2);
  }
  if (o2) {
    var c2 = -1;
    for (i2 = n; i2 < a2; i2++) if (u2(t, i2) === u2(e, -1 === c2 ? 0 : i2 - c2)) {
      if (-1 === c2 && (c2 = i2), i2 - c2 + 1 === l2) return c2 * s2;
    } else -1 !== c2 && (i2 -= i2 - c2), c2 = -1;
  } else for (n + l2 > a2 && (n = a2 - l2), i2 = n; i2 >= 0; i2--) {
    for (var h2 = true, f2 = 0; f2 < l2; f2++) if (u2(t, i2 + f2) !== u2(e, f2)) {
      h2 = false;
      break;
    }
    if (h2) return i2;
  }
  return -1;
}
function I(t, e, n, r2) {
  n = Number(n) || 0;
  var o2 = t.length - n;
  r2 ? (r2 = Number(r2)) > o2 && (r2 = o2) : r2 = o2;
  var i2 = e.length;
  if (i2 % 2 != 0) throw new TypeError("Invalid hex string");
  r2 > i2 / 2 && (r2 = i2 / 2);
  for (var s2 = 0; s2 < r2; ++s2) {
    var a2 = parseInt(e.substr(2 * s2, 2), 16);
    if (isNaN(a2)) return s2;
    t[n + s2] = a2;
  }
  return s2;
}
function P(t, e, n, r2) {
  return Q(V(e, t.length - n), t, n, r2);
}
function O(t, e, n, r2) {
  return Q(function(t2) {
    for (var e2 = [], n2 = 0; n2 < t2.length; ++n2) e2.push(255 & t2.charCodeAt(n2));
    return e2;
  }(e), t, n, r2);
}
function L(t, e, n, r2) {
  return O(t, e, n, r2);
}
function M(t, e, n, r2) {
  return Q(Z(e), t, n, r2);
}
function U(t, e, n, r2) {
  return Q(function(t2, e2) {
    for (var n2, r3, o2, i2 = [], s2 = 0; s2 < t2.length && !((e2 -= 2) < 0); ++s2) r3 = (n2 = t2.charCodeAt(s2)) >> 8, o2 = n2 % 256, i2.push(o2), i2.push(r3);
    return i2;
  }(e, t.length - n), t, n, r2);
}
function B(t, e, n) {
  return 0 === e && n === t.length ? c(t) : c(t.slice(e, n));
}
function W(t, e, n) {
  n = Math.min(t.length, n);
  for (var r2 = [], o2 = e; o2 < n; ) {
    var i2, s2, a2, l2, u2 = t[o2], c2 = null, h2 = u2 > 239 ? 4 : u2 > 223 ? 3 : u2 > 191 ? 2 : 1;
    if (o2 + h2 <= n) switch (h2) {
      case 1:
        u2 < 128 && (c2 = u2);
        break;
      case 2:
        128 == (192 & (i2 = t[o2 + 1])) && (l2 = (31 & u2) << 6 | 63 & i2) > 127 && (c2 = l2);
        break;
      case 3:
        i2 = t[o2 + 1], s2 = t[o2 + 2], 128 == (192 & i2) && 128 == (192 & s2) && (l2 = (15 & u2) << 12 | (63 & i2) << 6 | 63 & s2) > 2047 && (l2 < 55296 || l2 > 57343) && (c2 = l2);
        break;
      case 4:
        i2 = t[o2 + 1], s2 = t[o2 + 2], a2 = t[o2 + 3], 128 == (192 & i2) && 128 == (192 & s2) && 128 == (192 & a2) && (l2 = (15 & u2) << 18 | (63 & i2) << 12 | (63 & s2) << 6 | 63 & a2) > 65535 && l2 < 1114112 && (c2 = l2);
    }
    null === c2 ? (c2 = 65533, h2 = 1) : c2 > 65535 && (c2 -= 65536, r2.push(c2 >>> 10 & 1023 | 55296), c2 = 56320 | 1023 & c2), r2.push(c2), o2 += h2;
  }
  return function(t2) {
    var e2 = t2.length;
    if (e2 <= D) return String.fromCharCode.apply(String, t2);
    var n2 = "", r3 = 0;
    for (; r3 < e2; ) n2 += String.fromCharCode.apply(String, t2.slice(r3, r3 += D));
    return n2;
  }(r2);
}
y.TYPED_ARRAY_SUPPORT = void 0 === r.TYPED_ARRAY_SUPPORT || r.TYPED_ARRAY_SUPPORT, g(), y.poolSize = 8192, y._augment = function(t) {
  return t.__proto__ = y.prototype, t;
}, y.from = function(t, e, n) {
  return v(null, t, e, n);
}, y.TYPED_ARRAY_SUPPORT && (y.prototype.__proto__ = Uint8Array.prototype, y.__proto__ = Uint8Array), y.alloc = function(t, e, n) {
  return function(t2, e2, n2, r2) {
    return m(e2), e2 <= 0 ? w(t2, e2) : void 0 !== n2 ? "string" == typeof r2 ? w(t2, e2).fill(n2, r2) : w(t2, e2).fill(n2) : w(t2, e2);
  }(null, t, e, n);
}, y.allocUnsafe = function(t) {
  return b(null, t);
}, y.allocUnsafeSlow = function(t) {
  return b(null, t);
}, y.isBuffer = function(t) {
  return null != t && (!!t._isBuffer || tt(t) || function(t2) {
    return "function" == typeof t2.readFloatLE && "function" == typeof t2.slice && tt(t2.slice(0, 0));
  }(t));
}, y.compare = function(t, e) {
  if (!T(t) || !T(e)) throw new TypeError("Arguments must be Buffers");
  if (t === e) return 0;
  for (var n = t.length, r2 = e.length, o2 = 0, i2 = Math.min(n, r2); o2 < i2; ++o2) if (t[o2] !== e[o2]) {
    n = t[o2], r2 = e[o2];
    break;
  }
  return n < r2 ? -1 : r2 < n ? 1 : 0;
}, y.isEncoding = function(t) {
  switch (String(t).toLowerCase()) {
    case "hex":
    case "utf8":
    case "utf-8":
    case "ascii":
    case "latin1":
    case "binary":
    case "base64":
    case "ucs2":
    case "ucs-2":
    case "utf16le":
    case "utf-16le":
      return true;
    default:
      return false;
  }
}, y.concat = function(t, e) {
  if (!p(t)) throw new TypeError('"list" argument must be an Array of Buffers');
  if (0 === t.length) return y.alloc(0);
  var n;
  if (void 0 === e) for (e = 0, n = 0; n < t.length; ++n) e += t[n].length;
  var r2 = y.allocUnsafe(e), o2 = 0;
  for (n = 0; n < t.length; ++n) {
    var i2 = t[n];
    if (!T(i2)) throw new TypeError('"list" argument must be an Array of Buffers');
    i2.copy(r2, o2), o2 += i2.length;
  }
  return r2;
}, y.byteLength = _, y.prototype._isBuffer = true, y.prototype.swap16 = function() {
  var t = this.length;
  if (t % 2 != 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
  for (var e = 0; e < t; e += 2) S(this, e, e + 1);
  return this;
}, y.prototype.swap32 = function() {
  var t = this.length;
  if (t % 4 != 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
  for (var e = 0; e < t; e += 4) S(this, e, e + 3), S(this, e + 1, e + 2);
  return this;
}, y.prototype.swap64 = function() {
  var t = this.length;
  if (t % 8 != 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
  for (var e = 0; e < t; e += 8) S(this, e, e + 7), S(this, e + 1, e + 6), S(this, e + 2, e + 5), S(this, e + 3, e + 4);
  return this;
}, y.prototype.toString = function() {
  var t = 0 | this.length;
  return 0 === t ? "" : 0 === arguments.length ? W(this, 0, t) : R.apply(this, arguments);
}, y.prototype.equals = function(t) {
  if (!T(t)) throw new TypeError("Argument must be a Buffer");
  return this === t || 0 === y.compare(this, t);
}, y.prototype.inspect = function() {
  var t = "";
  return this.length > 0 && (t = this.toString("hex", 0, 50).match(/.{2}/g).join(" "), this.length > 50 && (t += " ... ")), "<Buffer " + t + ">";
}, y.prototype.compare = function(t, e, n, r2, o2) {
  if (!T(t)) throw new TypeError("Argument must be a Buffer");
  if (void 0 === e && (e = 0), void 0 === n && (n = t ? t.length : 0), void 0 === r2 && (r2 = 0), void 0 === o2 && (o2 = this.length), e < 0 || n > t.length || r2 < 0 || o2 > this.length) throw new RangeError("out of range index");
  if (r2 >= o2 && e >= n) return 0;
  if (r2 >= o2) return -1;
  if (e >= n) return 1;
  if (this === t) return 0;
  for (var i2 = (o2 >>>= 0) - (r2 >>>= 0), s2 = (n >>>= 0) - (e >>>= 0), a2 = Math.min(i2, s2), l2 = this.slice(r2, o2), u2 = t.slice(e, n), c2 = 0; c2 < a2; ++c2) if (l2[c2] !== u2[c2]) {
    i2 = l2[c2], s2 = u2[c2];
    break;
  }
  return i2 < s2 ? -1 : s2 < i2 ? 1 : 0;
}, y.prototype.includes = function(t, e, n) {
  return -1 !== this.indexOf(t, e, n);
}, y.prototype.indexOf = function(t, e, n) {
  return N(this, t, e, n, true);
}, y.prototype.lastIndexOf = function(t, e, n) {
  return N(this, t, e, n, false);
}, y.prototype.write = function(t, e, n, r2) {
  if (void 0 === e) r2 = "utf8", n = this.length, e = 0;
  else if (void 0 === n && "string" == typeof e) r2 = e, n = this.length, e = 0;
  else {
    if (!isFinite(e)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
    e |= 0, isFinite(n) ? (n |= 0, void 0 === r2 && (r2 = "utf8")) : (r2 = n, n = void 0);
  }
  var o2 = this.length - e;
  if ((void 0 === n || n > o2) && (n = o2), t.length > 0 && (n < 0 || e < 0) || e > this.length) throw new RangeError("Attempt to write outside buffer bounds");
  r2 || (r2 = "utf8");
  for (var i2 = false; ; ) switch (r2) {
    case "hex":
      return I(this, t, e, n);
    case "utf8":
    case "utf-8":
      return P(this, t, e, n);
    case "ascii":
      return O(this, t, e, n);
    case "latin1":
    case "binary":
      return L(this, t, e, n);
    case "base64":
      return M(this, t, e, n);
    case "ucs2":
    case "ucs-2":
    case "utf16le":
    case "utf-16le":
      return U(this, t, e, n);
    default:
      if (i2) throw new TypeError("Unknown encoding: " + r2);
      r2 = ("" + r2).toLowerCase(), i2 = true;
  }
}, y.prototype.toJSON = function() {
  return { type: "Buffer", data: Array.prototype.slice.call(this._arr || this, 0) };
};
var D = 4096;
function x(t, e, n) {
  var r2 = "";
  n = Math.min(t.length, n);
  for (var o2 = e; o2 < n; ++o2) r2 += String.fromCharCode(127 & t[o2]);
  return r2;
}
function Y(t, e, n) {
  var r2 = "";
  n = Math.min(t.length, n);
  for (var o2 = e; o2 < n; ++o2) r2 += String.fromCharCode(t[o2]);
  return r2;
}
function k(t, e, n) {
  var r2 = t.length;
  (!e || e < 0) && (e = 0), (!n || n < 0 || n > r2) && (n = r2);
  for (var o2 = "", i2 = e; i2 < n; ++i2) o2 += J(t[i2]);
  return o2;
}
function j(t, e, n) {
  for (var r2 = t.slice(e, n), o2 = "", i2 = 0; i2 < r2.length; i2 += 2) o2 += String.fromCharCode(r2[i2] + 256 * r2[i2 + 1]);
  return o2;
}
function $(t, e, n) {
  if (t % 1 != 0 || t < 0) throw new RangeError("offset is not uint");
  if (t + e > n) throw new RangeError("Trying to access beyond buffer length");
}
function G(t, e, n, r2, o2, i2) {
  if (!T(t)) throw new TypeError('"buffer" argument must be a Buffer instance');
  if (e > o2 || e < i2) throw new RangeError('"value" argument is out of bounds');
  if (n + r2 > t.length) throw new RangeError("Index out of range");
}
function q(t, e, n, r2) {
  e < 0 && (e = 65535 + e + 1);
  for (var o2 = 0, i2 = Math.min(t.length - n, 2); o2 < i2; ++o2) t[n + o2] = (e & 255 << 8 * (r2 ? o2 : 1 - o2)) >>> 8 * (r2 ? o2 : 1 - o2);
}
function z(t, e, n, r2) {
  e < 0 && (e = 4294967295 + e + 1);
  for (var o2 = 0, i2 = Math.min(t.length - n, 4); o2 < i2; ++o2) t[n + o2] = e >>> 8 * (r2 ? o2 : 3 - o2) & 255;
}
function F(t, e, n, r2, o2, i2) {
  if (n + r2 > t.length) throw new RangeError("Index out of range");
  if (n < 0) throw new RangeError("Index out of range");
}
function H(t, e, n, r2, o2) {
  return o2 || F(t, 0, n, 4), f(t, e, n, r2, 23, 4), n + 4;
}
function K(t, e, n, r2, o2) {
  return o2 || F(t, 0, n, 8), f(t, e, n, r2, 52, 8), n + 8;
}
y.prototype.slice = function(t, e) {
  var n, r2 = this.length;
  if ((t = ~~t) < 0 ? (t += r2) < 0 && (t = 0) : t > r2 && (t = r2), (e = void 0 === e ? r2 : ~~e) < 0 ? (e += r2) < 0 && (e = 0) : e > r2 && (e = r2), e < t && (e = t), y.TYPED_ARRAY_SUPPORT) (n = this.subarray(t, e)).__proto__ = y.prototype;
  else {
    var o2 = e - t;
    n = new y(o2, void 0);
    for (var i2 = 0; i2 < o2; ++i2) n[i2] = this[i2 + t];
  }
  return n;
}, y.prototype.readUIntLE = function(t, e, n) {
  t |= 0, e |= 0, n || $(t, e, this.length);
  for (var r2 = this[t], o2 = 1, i2 = 0; ++i2 < e && (o2 *= 256); ) r2 += this[t + i2] * o2;
  return r2;
}, y.prototype.readUIntBE = function(t, e, n) {
  t |= 0, e |= 0, n || $(t, e, this.length);
  for (var r2 = this[t + --e], o2 = 1; e > 0 && (o2 *= 256); ) r2 += this[t + --e] * o2;
  return r2;
}, y.prototype.readUInt8 = function(t, e) {
  return e || $(t, 1, this.length), this[t];
}, y.prototype.readUInt16LE = function(t, e) {
  return e || $(t, 2, this.length), this[t] | this[t + 1] << 8;
}, y.prototype.readUInt16BE = function(t, e) {
  return e || $(t, 2, this.length), this[t] << 8 | this[t + 1];
}, y.prototype.readUInt32LE = function(t, e) {
  return e || $(t, 4, this.length), (this[t] | this[t + 1] << 8 | this[t + 2] << 16) + 16777216 * this[t + 3];
}, y.prototype.readUInt32BE = function(t, e) {
  return e || $(t, 4, this.length), 16777216 * this[t] + (this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3]);
}, y.prototype.readIntLE = function(t, e, n) {
  t |= 0, e |= 0, n || $(t, e, this.length);
  for (var r2 = this[t], o2 = 1, i2 = 0; ++i2 < e && (o2 *= 256); ) r2 += this[t + i2] * o2;
  return r2 >= (o2 *= 128) && (r2 -= Math.pow(2, 8 * e)), r2;
}, y.prototype.readIntBE = function(t, e, n) {
  t |= 0, e |= 0, n || $(t, e, this.length);
  for (var r2 = e, o2 = 1, i2 = this[t + --r2]; r2 > 0 && (o2 *= 256); ) i2 += this[t + --r2] * o2;
  return i2 >= (o2 *= 128) && (i2 -= Math.pow(2, 8 * e)), i2;
}, y.prototype.readInt8 = function(t, e) {
  return e || $(t, 1, this.length), 128 & this[t] ? -1 * (255 - this[t] + 1) : this[t];
}, y.prototype.readInt16LE = function(t, e) {
  e || $(t, 2, this.length);
  var n = this[t] | this[t + 1] << 8;
  return 32768 & n ? 4294901760 | n : n;
}, y.prototype.readInt16BE = function(t, e) {
  e || $(t, 2, this.length);
  var n = this[t + 1] | this[t] << 8;
  return 32768 & n ? 4294901760 | n : n;
}, y.prototype.readInt32LE = function(t, e) {
  return e || $(t, 4, this.length), this[t] | this[t + 1] << 8 | this[t + 2] << 16 | this[t + 3] << 24;
}, y.prototype.readInt32BE = function(t, e) {
  return e || $(t, 4, this.length), this[t] << 24 | this[t + 1] << 16 | this[t + 2] << 8 | this[t + 3];
}, y.prototype.readFloatLE = function(t, e) {
  return e || $(t, 4, this.length), h(this, t, true, 23, 4);
}, y.prototype.readFloatBE = function(t, e) {
  return e || $(t, 4, this.length), h(this, t, false, 23, 4);
}, y.prototype.readDoubleLE = function(t, e) {
  return e || $(t, 8, this.length), h(this, t, true, 52, 8);
}, y.prototype.readDoubleBE = function(t, e) {
  return e || $(t, 8, this.length), h(this, t, false, 52, 8);
}, y.prototype.writeUIntLE = function(t, e, n, r2) {
  (t = +t, e |= 0, n |= 0, r2) || G(this, t, e, n, Math.pow(2, 8 * n) - 1, 0);
  var o2 = 1, i2 = 0;
  for (this[e] = 255 & t; ++i2 < n && (o2 *= 256); ) this[e + i2] = t / o2 & 255;
  return e + n;
}, y.prototype.writeUIntBE = function(t, e, n, r2) {
  (t = +t, e |= 0, n |= 0, r2) || G(this, t, e, n, Math.pow(2, 8 * n) - 1, 0);
  var o2 = n - 1, i2 = 1;
  for (this[e + o2] = 255 & t; --o2 >= 0 && (i2 *= 256); ) this[e + o2] = t / i2 & 255;
  return e + n;
}, y.prototype.writeUInt8 = function(t, e, n) {
  return t = +t, e |= 0, n || G(this, t, e, 1, 255, 0), y.TYPED_ARRAY_SUPPORT || (t = Math.floor(t)), this[e] = 255 & t, e + 1;
}, y.prototype.writeUInt16LE = function(t, e, n) {
  return t = +t, e |= 0, n || G(this, t, e, 2, 65535, 0), y.TYPED_ARRAY_SUPPORT ? (this[e] = 255 & t, this[e + 1] = t >>> 8) : q(this, t, e, true), e + 2;
}, y.prototype.writeUInt16BE = function(t, e, n) {
  return t = +t, e |= 0, n || G(this, t, e, 2, 65535, 0), y.TYPED_ARRAY_SUPPORT ? (this[e] = t >>> 8, this[e + 1] = 255 & t) : q(this, t, e, false), e + 2;
}, y.prototype.writeUInt32LE = function(t, e, n) {
  return t = +t, e |= 0, n || G(this, t, e, 4, 4294967295, 0), y.TYPED_ARRAY_SUPPORT ? (this[e + 3] = t >>> 24, this[e + 2] = t >>> 16, this[e + 1] = t >>> 8, this[e] = 255 & t) : z(this, t, e, true), e + 4;
}, y.prototype.writeUInt32BE = function(t, e, n) {
  return t = +t, e |= 0, n || G(this, t, e, 4, 4294967295, 0), y.TYPED_ARRAY_SUPPORT ? (this[e] = t >>> 24, this[e + 1] = t >>> 16, this[e + 2] = t >>> 8, this[e + 3] = 255 & t) : z(this, t, e, false), e + 4;
}, y.prototype.writeIntLE = function(t, e, n, r2) {
  if (t = +t, e |= 0, !r2) {
    var o2 = Math.pow(2, 8 * n - 1);
    G(this, t, e, n, o2 - 1, -o2);
  }
  var i2 = 0, s2 = 1, a2 = 0;
  for (this[e] = 255 & t; ++i2 < n && (s2 *= 256); ) t < 0 && 0 === a2 && 0 !== this[e + i2 - 1] && (a2 = 1), this[e + i2] = (t / s2 | 0) - a2 & 255;
  return e + n;
}, y.prototype.writeIntBE = function(t, e, n, r2) {
  if (t = +t, e |= 0, !r2) {
    var o2 = Math.pow(2, 8 * n - 1);
    G(this, t, e, n, o2 - 1, -o2);
  }
  var i2 = n - 1, s2 = 1, a2 = 0;
  for (this[e + i2] = 255 & t; --i2 >= 0 && (s2 *= 256); ) t < 0 && 0 === a2 && 0 !== this[e + i2 + 1] && (a2 = 1), this[e + i2] = (t / s2 | 0) - a2 & 255;
  return e + n;
}, y.prototype.writeInt8 = function(t, e, n) {
  return t = +t, e |= 0, n || G(this, t, e, 1, 127, -128), y.TYPED_ARRAY_SUPPORT || (t = Math.floor(t)), t < 0 && (t = 255 + t + 1), this[e] = 255 & t, e + 1;
}, y.prototype.writeInt16LE = function(t, e, n) {
  return t = +t, e |= 0, n || G(this, t, e, 2, 32767, -32768), y.TYPED_ARRAY_SUPPORT ? (this[e] = 255 & t, this[e + 1] = t >>> 8) : q(this, t, e, true), e + 2;
}, y.prototype.writeInt16BE = function(t, e, n) {
  return t = +t, e |= 0, n || G(this, t, e, 2, 32767, -32768), y.TYPED_ARRAY_SUPPORT ? (this[e] = t >>> 8, this[e + 1] = 255 & t) : q(this, t, e, false), e + 2;
}, y.prototype.writeInt32LE = function(t, e, n) {
  return t = +t, e |= 0, n || G(this, t, e, 4, 2147483647, -2147483648), y.TYPED_ARRAY_SUPPORT ? (this[e] = 255 & t, this[e + 1] = t >>> 8, this[e + 2] = t >>> 16, this[e + 3] = t >>> 24) : z(this, t, e, true), e + 4;
}, y.prototype.writeInt32BE = function(t, e, n) {
  return t = +t, e |= 0, n || G(this, t, e, 4, 2147483647, -2147483648), t < 0 && (t = 4294967295 + t + 1), y.TYPED_ARRAY_SUPPORT ? (this[e] = t >>> 24, this[e + 1] = t >>> 16, this[e + 2] = t >>> 8, this[e + 3] = 255 & t) : z(this, t, e, false), e + 4;
}, y.prototype.writeFloatLE = function(t, e, n) {
  return H(this, t, e, true, n);
}, y.prototype.writeFloatBE = function(t, e, n) {
  return H(this, t, e, false, n);
}, y.prototype.writeDoubleLE = function(t, e, n) {
  return K(this, t, e, true, n);
}, y.prototype.writeDoubleBE = function(t, e, n) {
  return K(this, t, e, false, n);
}, y.prototype.copy = function(t, e, n, r2) {
  if (n || (n = 0), r2 || 0 === r2 || (r2 = this.length), e >= t.length && (e = t.length), e || (e = 0), r2 > 0 && r2 < n && (r2 = n), r2 === n) return 0;
  if (0 === t.length || 0 === this.length) return 0;
  if (e < 0) throw new RangeError("targetStart out of bounds");
  if (n < 0 || n >= this.length) throw new RangeError("sourceStart out of bounds");
  if (r2 < 0) throw new RangeError("sourceEnd out of bounds");
  r2 > this.length && (r2 = this.length), t.length - e < r2 - n && (r2 = t.length - e + n);
  var o2, i2 = r2 - n;
  if (this === t && n < e && e < r2) for (o2 = i2 - 1; o2 >= 0; --o2) t[o2 + e] = this[o2 + n];
  else if (i2 < 1e3 || !y.TYPED_ARRAY_SUPPORT) for (o2 = 0; o2 < i2; ++o2) t[o2 + e] = this[o2 + n];
  else Uint8Array.prototype.set.call(t, this.subarray(n, n + i2), e);
  return i2;
}, y.prototype.fill = function(t, e, n, r2) {
  if ("string" == typeof t) {
    if ("string" == typeof e ? (r2 = e, e = 0, n = this.length) : "string" == typeof n && (r2 = n, n = this.length), 1 === t.length) {
      var o2 = t.charCodeAt(0);
      o2 < 256 && (t = o2);
    }
    if (void 0 !== r2 && "string" != typeof r2) throw new TypeError("encoding must be a string");
    if ("string" == typeof r2 && !y.isEncoding(r2)) throw new TypeError("Unknown encoding: " + r2);
  } else "number" == typeof t && (t &= 255);
  if (e < 0 || this.length < e || this.length < n) throw new RangeError("Out of range index");
  if (n <= e) return this;
  var i2;
  if (e >>>= 0, n = void 0 === n ? this.length : n >>> 0, t || (t = 0), "number" == typeof t) for (i2 = e; i2 < n; ++i2) this[i2] = t;
  else {
    var s2 = T(t) ? t : V(new y(t, r2).toString()), a2 = s2.length;
    for (i2 = 0; i2 < n - e; ++i2) this[i2 + e] = s2[i2 % a2];
  }
  return this;
};
var X = /[^+\/0-9A-Za-z-_]/g;
function J(t) {
  return t < 16 ? "0" + t.toString(16) : t.toString(16);
}
function V(t, e) {
  var n;
  e = e || 1 / 0;
  for (var r2 = t.length, o2 = null, i2 = [], s2 = 0; s2 < r2; ++s2) {
    if ((n = t.charCodeAt(s2)) > 55295 && n < 57344) {
      if (!o2) {
        if (n > 56319) {
          (e -= 3) > -1 && i2.push(239, 191, 189);
          continue;
        }
        if (s2 + 1 === r2) {
          (e -= 3) > -1 && i2.push(239, 191, 189);
          continue;
        }
        o2 = n;
        continue;
      }
      if (n < 56320) {
        (e -= 3) > -1 && i2.push(239, 191, 189), o2 = n;
        continue;
      }
      n = 65536 + (o2 - 55296 << 10 | n - 56320);
    } else o2 && (e -= 3) > -1 && i2.push(239, 191, 189);
    if (o2 = null, n < 128) {
      if ((e -= 1) < 0) break;
      i2.push(n);
    } else if (n < 2048) {
      if ((e -= 2) < 0) break;
      i2.push(n >> 6 | 192, 63 & n | 128);
    } else if (n < 65536) {
      if ((e -= 3) < 0) break;
      i2.push(n >> 12 | 224, n >> 6 & 63 | 128, 63 & n | 128);
    } else {
      if (!(n < 1114112)) throw new Error("Invalid code point");
      if ((e -= 4) < 0) break;
      i2.push(n >> 18 | 240, n >> 12 & 63 | 128, n >> 6 & 63 | 128, 63 & n | 128);
    }
  }
  return i2;
}
function Z(t) {
  return function(t2) {
    var e, n, r2, o2, u2, c2;
    a || l();
    var h2 = t2.length;
    if (h2 % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
    u2 = "=" === t2[h2 - 2] ? 2 : "=" === t2[h2 - 1] ? 1 : 0, c2 = new s(3 * h2 / 4 - u2), r2 = u2 > 0 ? h2 - 4 : h2;
    var f2 = 0;
    for (e = 0, n = 0; e < r2; e += 4, n += 3) o2 = i[t2.charCodeAt(e)] << 18 | i[t2.charCodeAt(e + 1)] << 12 | i[t2.charCodeAt(e + 2)] << 6 | i[t2.charCodeAt(e + 3)], c2[f2++] = o2 >> 16 & 255, c2[f2++] = o2 >> 8 & 255, c2[f2++] = 255 & o2;
    return 2 === u2 ? (o2 = i[t2.charCodeAt(e)] << 2 | i[t2.charCodeAt(e + 1)] >> 4, c2[f2++] = 255 & o2) : 1 === u2 && (o2 = i[t2.charCodeAt(e)] << 10 | i[t2.charCodeAt(e + 1)] << 4 | i[t2.charCodeAt(e + 2)] >> 2, c2[f2++] = o2 >> 8 & 255, c2[f2++] = 255 & o2), c2;
  }(function(t2) {
    if ((t2 = function(t3) {
      return t3.trim ? t3.trim() : t3.replace(/^\s+|\s+$/g, "");
    }(t2).replace(X, "")).length < 2) return "";
    for (; t2.length % 4 != 0; ) t2 += "=";
    return t2;
  }(t));
}
function Q(t, e, n, r2) {
  for (var o2 = 0; o2 < r2 && !(o2 + n >= e.length || o2 >= t.length); ++o2) e[o2 + n] = t[o2];
  return o2;
}
function tt(t) {
  return !!t.constructor && "function" == typeof t.constructor.isBuffer && t.constructor.isBuffer(t);
}
function et(t, e, n, r2) {
  return new (n || (n = Promise))(function(o2, i2) {
    function s2(t2) {
      try {
        l2(r2.next(t2));
      } catch (t3) {
        i2(t3);
      }
    }
    function a2(t2) {
      try {
        l2(r2.throw(t2));
      } catch (t3) {
        i2(t3);
      }
    }
    function l2(t2) {
      var e2;
      t2.done ? o2(t2.value) : (e2 = t2.value, e2 instanceof n ? e2 : new n(function(t3) {
        t3(e2);
      })).then(s2, a2);
    }
    l2((r2 = r2.apply(t, e || [])).next());
  });
}
var nt = class _nt extends Error {
  constructor(t, e, ...n) {
    super(...n), Error.captureStackTrace && Error.captureStackTrace(this, _nt), this.name = "PeraWalletConnectError", this.data = t, this.message = e;
  }
};
var rt = new class {
  constructor(t) {
    this.listener = void 0, this.channel = t.channel;
  }
  setupListener({ onReceiveMessage: t }) {
    this.close(), this.listener = (e) => {
      if ("object" == typeof e.data) try {
        e.data.channel === this.channel && t(e);
      } catch (t2) {
        console.error(t2);
      }
    }, window.addEventListener("message", this.listener);
  }
  sendMessage({ message: t, targetWindow: e, origin: n, timeout: r2 = 1e3 }) {
    setTimeout(() => {
      const r3 = { channel: this.channel, message: t };
      e.postMessage(r3, { targetOrigin: n || "*" });
    }, r2);
  }
  close() {
    this.listener && (window.removeEventListener("message", this.listener), this.listener = void 0);
  }
}({ channel: "pera-web-wallet" });
var ot = 700;
var it = 50;
function st() {
  const t = document.querySelector('meta[name="name"]'), e = document.querySelector('meta[name="description"]');
  let { title: n } = document, r2 = "";
  return t instanceof HTMLMetaElement && (n = t.content), e instanceof HTMLMetaElement && (r2 = e.content), { title: n, description: r2, url: window.location.origin, favicon: at()[0] };
}
function at() {
  const t = document.getElementsByTagName("link"), e = [];
  for (let n = 0; n < t.length; n++) {
    const r2 = t[n], o2 = r2.getAttribute("rel");
    if (o2 && o2.toLowerCase().indexOf("icon") > -1) {
      const t2 = r2.getAttribute("href");
      if (t2 && -1 === t2.toLowerCase().indexOf("https:") && -1 === t2.toLowerCase().indexOf("http:") && 0 !== t2.indexOf("//")) {
        let n2 = `${window.location.protocol}//${window.location.host}`;
        if (0 === t2.indexOf("/")) n2 += t2;
        else {
          const e2 = window.location.pathname.split("/");
          e2.pop();
          n2 += `${e2.join("/")}/${t2}`;
        }
        e.push(n2);
      } else if (0 === (null == t2 ? void 0 : t2.indexOf("//"))) {
        const n2 = window.location.protocol + t2;
        e.push(n2);
      } else t2 && e.push(t2);
    }
  }
  return e;
}
function lt(t) {
  return new Promise((e, n) => {
    try {
      const r2 = window.open(t, "_blank");
      let o2 = 0;
      const i2 = setInterval(() => {
        if (o2 += 1, o2 === it) return clearInterval(i2), void n(new nt({ type: "MESSAGE_NOT_RECEIVED" }, "Couldn't open Pera Wallet, please try again."));
        r2 && (true === r2.closed && (clearInterval(i2), n(new nt({ type: "OPERATION_CANCELLED" }, "Operation cancelled by user"))), rt.sendMessage({ message: { type: "TAB_OPEN" }, origin: t, targetWindow: r2 }));
      }, ot);
      rt.setupListener({ onReceiveMessage: (t2) => {
        "TAB_OPEN_RECEIVED" === t2.data.message.type && (clearInterval(i2), e(r2));
      } });
    } catch (t2) {
      n(t2);
    }
  });
}
var ut = "pera-wallet-connect-modal-wrapper";
var ct = "pera-wallet-redirect-modal-wrapper";
var ht = "pera-wallet-sign-txn-toast-wrapper";
var ft = "pera-wallet-sign-txn-modal-wrapper";
var dt = "pera-wallet-modal";
function pt(t) {
  const e = document.createElement("div");
  return e.setAttribute("id", t), document.body.appendChild(e), e;
}
function gt() {
  pt(ct).innerHTML = "<pera-wallet-redirect-modal></pera-wallet-redirect-modal>";
}
function wt() {
  pt(ht).innerHTML = "<pera-wallet-sign-txn-toast></pera-wallet-sign-txn-toast>";
}
function yt() {
  vt(ht);
}
function vt(t) {
  const e = document.getElementById(t);
  e && e.remove();
}
var mt = { WALLET: "PeraWallet.Wallet", WALLETCONNECT: "walletconnect" };
function bt() {
  return "undefined" == typeof localStorage ? void 0 : localStorage;
}
function At(t, e) {
  var n;
  null === (n = bt()) || void 0 === n || n.setItem(mt.WALLET, JSON.stringify({ type: e || "pera-wallet", accounts: t, selectedAccount: t[0] }));
}
function Et() {
  var t;
  const e = null === (t = bt()) || void 0 === t ? void 0 : t.getItem(mt.WALLET);
  return e ? JSON.parse(e) : null;
}
function Tt() {
  return new Promise((t, e) => {
    var n, r2;
    try {
      null === (n = bt()) || void 0 === n || n.removeItem(mt.WALLETCONNECT), null === (r2 = bt()) || void 0 === r2 || r2.removeItem(mt.WALLET), t(void 0);
    } catch (t2) {
      e(t2);
    }
  });
}
function _t(t) {
  const e = t.slice();
  for (let t2 = e.length - 1; t2 > 0; t2--) {
    const n = Math.floor(Math.random() * (t2 + 1));
    [e[t2], e[n]] = [e[n], e[t2]];
  }
  return e;
}
var Rt = "https://wc.perawallet.app/config.json";
function St() {
  return function(t, e = {}) {
    return fetch(t, e).then((t2) => t2.json()).then((t2) => t2);
  }(Rt, { cache: "no-store" });
}
function Nt() {
  return et(this, void 0, void 0, function* () {
    let t = { bridgeURL: "", webWalletURL: "", isWebWalletAvailable: false, shouldDisplayNewBadge: false, shouldUseSound: true, silent: false, promoteMobile: false };
    try {
      const e = yield St();
      void 0 !== e.web_wallet && e.web_wallet_url && (t.isWebWalletAvailable = e.web_wallet), void 0 !== e.display_new_badge && (t.shouldDisplayNewBadge = e.display_new_badge), void 0 !== e.use_sound && (t.shouldUseSound = e.use_sound), void 0 !== e.silent && (t.silent = e.silent), void 0 !== e.promote_mobile && (t.promoteMobile = e.promote_mobile), t = Object.assign(Object.assign({}, t), { bridgeURL: _t(e.servers || [])[0] || "", webWalletURL: e.web_wallet_url || "" });
    } catch (t2) {
      console.log(t2);
    }
    return t;
  });
}
function Ct(t) {
  return Uint8Array.from(window.atob(t), (t2) => t2.charCodeAt(0));
}
function It(t, e) {
  return { id: Date.now() * Math.pow(10, 3) + Math.floor(Math.random() * Math.pow(10, 3)), jsonrpc: "2.0", method: t, params: e };
}
function Pt() {
  return "undefined" != typeof navigator;
}
function Ot() {
  return Pt() && /Android/i.test(navigator.userAgent);
}
function Lt() {
  return Pt() && /iPhone|iPad|iPod/i.test(navigator.userAgent);
}
function Mt() {
  return Pt() && /iPhone|iPod|Android/i.test(navigator.userAgent);
}
function Ut() {
  if (!Pt()) return null;
  const { userAgent: t } = navigator;
  let e;
  return e = t.match(/DuckDuckGo/i) ? "DuckDuckGo" : t.match(/OPX/i) ? "Opera GX" : navigator.brave ? "Brave" : bowser_default.getParser(navigator.userAgent).getBrowserName(), e;
}
var Bt = "perawallet-wc://";
var Wt = "https://perawallet.app/download/";
function Dt(t) {
  return { ROOT: `https://${t}`, CONNECT: `https://${t}/connect`, TRANSACTION_SIGN: `https://${t}/transaction/sign` };
}
function xt({ method: t, signTxnRequestParams: e, signer: n, chainId: r2, webWalletURL: o2, resolve: i2, reject: s2 }) {
  const a2 = Dt(o2);
  !function() {
    et(this, void 0, void 0, function* () {
      try {
        const o3 = yield lt(a2.TRANSACTION_SIGN);
        if (o3) {
          let i3;
          "SIGN_TXN" === t ? i3 = { type: "SIGN_TXN", txn: e } : "SIGN_DATA" === t && n && r2 && (i3 = { type: "SIGN_DATA", data: e, signer: n, chainId: r2 }), i3 && rt.sendMessage({ message: i3, origin: a2.TRANSACTION_SIGN, targetWindow: o3 });
        }
        const l2 = setInterval(() => {
          true === (null == o3 ? void 0 : o3.closed) && (s2(new nt({ type: `${t}_CANCELLED` }, "Transaction signing is cancelled by user.")), clearInterval(l2));
        }, 2e3);
        rt.setupListener({ onReceiveMessage: (e2) => function({ event: t2, newPeraWalletTab: e3, method: n2, resolve: r3, reject: o4 }) {
          switch (t2.data.message.type) {
            case "SIGN_TXN_CALLBACK":
              null == e3 || e3.close(), r3(t2.data.message.signedTxns.map((t3) => Ct(t3.signedTxn)));
              break;
            case "SIGN_DATA_CALLBACK":
              null == e3 || e3.close(), r3(t2.data.message.signedData.map((t3) => Ct(t3.signedData)));
              break;
            case "SIGN_TXN_NETWORK_MISMATCH":
              o4(new nt({ type: `${n2}_NETWORK_MISMATCH`, detail: t2.data.message.error }, t2.data.message.error || "Network mismatch"));
              break;
            case "SIGN_TXN_CALLBACK_ERROR":
              null == e3 || e3.close(), o4(new nt({ type: `${n2}_CANCELLED` }, t2.data.message.error));
              break;
            case "SESSION_DISCONNECTED":
              null == e3 || e3.close(), Tt(), o4(new nt({ type: "SESSION_DISCONNECTED", detail: t2.data.message.error }, t2.data.message.error));
          }
        }({ event: e2, newPeraWalletTab: o3, method: t, resolve: i2, reject: s2 }) });
      } catch (t2) {
        s2(t2);
      }
    });
  }();
}
function Yt({ webWalletURL: t, chainId: e, resolve: n, reject: r2 }) {
  const o2 = Dt(t);
  return function() {
    return et(this, void 0, void 0, function* () {
      try {
        const t2 = yield lt(o2.CONNECT);
        t2 && rt.sendMessage({ message: { type: "CONNECT", data: Object.assign(Object.assign({}, st()), { chainId: e }) }, origin: o2.CONNECT, targetWindow: t2 });
        const s2 = setInterval(() => {
          true === (null == t2 ? void 0 : t2.closed) && (r2(new nt({ type: "CONNECT_CANCELLED" }, "Connect is cancelled by user")), clearInterval(s2), i2());
        }, 2e3);
        rt.setupListener({ onReceiveMessage: (e2) => function({ event: t3, newPeraWalletTab: e3, resolve: n2, reject: r3 }) {
          if (n2 && "CONNECT_CALLBACK" === t3.data.message.type) {
            const r4 = t3.data.message.data.addresses;
            At(r4, "pera-wallet-web"), n2(r4), vt(ut), null == e3 || e3.close();
          } else "CONNECT_NETWORK_MISMATCH" === t3.data.message.type && (r3(new nt({ type: "CONNECT_NETWORK_MISMATCH", detail: t3.data.message.error }, t3.data.message.error || "Your wallet is connected to a different network to this dApp. Update your wallet to the correct network (MainNet or TestNet) to continue.")), vt(ut), null == e3 || e3.close());
        }({ event: e2, newPeraWalletTab: t2, resolve: n, reject: r2 }) });
      } catch (t2) {
        i2(), r2(t2);
      }
    });
  };
  function i2() {
    vt(ut);
  }
}
function kt({ isWebWalletAvailable: t, shouldDisplayNewBadge: e, shouldUseSound: n, compactMode: r2, promoteMobile: o2, singleAccount: i2, selectedAccount: s2 }) {
  return { open: (a2 = { isWebWalletAvailable: t, shouldDisplayNewBadge: e, shouldUseSound: n, compactMode: r2, promoteMobile: o2, singleAccount: i2, selectedAccount: s2 }, (t2) => {
    if (!document.getElementById(ut)) {
      const e2 = pt(ut), n2 = `${t2}&algorand=true`, { isWebWalletAvailable: r3, shouldDisplayNewBadge: o3, shouldUseSound: i3, compactMode: s3, promoteMobile: l2, singleAccount: u2, selectedAccount: c2 } = a2;
      e2.innerHTML = `<pera-wallet-connect-modal uri="${n2}" is-web-wallet-avaliable="${r3}" should-display-new-badge="${o3}" should-use-sound="${i3}" compact-mode="${s3}" promote-mobile="${l2}" single-account="${u2}" selected-account="${c2 || ""}"></pera-wallet-connect-modal>`;
    }
  }), close: () => vt(ut) };
  var a2;
}
var jt = class {
  constructor(t) {
    this.bridge = (null == t ? void 0 : t.bridge) || "", this.connector = null, this.shouldShowSignTxnToast = void 0 === (null == t ? void 0 : t.shouldShowSignTxnToast) || t.shouldShowSignTxnToast, this.chainId = null == t ? void 0 : t.chainId, this.compactMode = (null == t ? void 0 : t.compactMode) || false, this.singleAccount = (null == t ? void 0 : t.singleAccount) || false;
  }
  get platform() {
    return function() {
      const t = Et();
      let e = null;
      return "pera-wallet" === (null == t ? void 0 : t.type) ? e = "mobile" : "pera-wallet-web" === (null == t ? void 0 : t.type) && (e = "web"), e;
    }();
  }
  get isConnected() {
    var t;
    return "mobile" === this.platform ? !!this.connector : "web" === this.platform && !!(null === (t = Et()) || void 0 === t ? void 0 : t.accounts.length);
  }
  get isPeraDiscoverBrowser() {
    return this.checkIsPeraDiscoverBrowser();
  }
  connect(e) {
    return new Promise((n, r2) => et(this, void 0, void 0, function* () {
      var o2;
      try {
        if (null === (o2 = this.connector) || void 0 === o2 ? void 0 : o2.connected) try {
          yield this.connector.killSession();
        } catch (t) {
        }
        const { isWebWalletAvailable: i2, bridgeURL: s2, webWalletURL: a2, shouldDisplayNewBadge: l2, shouldUseSound: u2, promoteMobile: c2 } = yield Nt(), h2 = Yt({ resolve: n, reject: r2, webWalletURL: a2, chainId: this.chainId, isCompactMode: this.compactMode });
        i2 && (window.onWebWalletConnect = h2), this.connector = new esm_default2({ bridge: this.bridge || s2 || "https://bridge.walletconnect.org", qrcodeModal: kt({ isWebWalletAvailable: i2, shouldDisplayNewBadge: l2, shouldUseSound: u2, compactMode: this.compactMode, promoteMobile: c2, singleAccount: this.singleAccount, selectedAccount: null == e ? void 0 : e.selectedAccount }) }), yield this.connector.createSession({ chainId: this.chainId || 4160 }), function(t, e2) {
          var n2, r3, o3, i3;
          const s3 = document.getElementById(t), a3 = null === (r3 = null === (n2 = null == s3 ? void 0 : s3.querySelector(t.replace("-wrapper", ""))) || void 0 === n2 ? void 0 : n2.shadowRoot) || void 0 === r3 ? void 0 : r3.querySelector(`.${dt}`), l3 = null === (i3 = null === (o3 = null == a3 ? void 0 : a3.querySelector("pera-wallet-modal-header")) || void 0 === o3 ? void 0 : o3.shadowRoot) || void 0 === i3 ? void 0 : i3.getElementById("pera-wallet-modal-header-close-button");
          null == l3 || l3.addEventListener("click", () => {
            e2(), vt(t);
          });
        }(ut, () => r2(new nt({ type: "CONNECT_MODAL_CLOSED" }, "Connect modal is closed by user"))), this.connector.on("connect", (t, e2) => {
          var o3, i3;
          t && r2(t), n((null === (o3 = this.connector) || void 0 === o3 ? void 0 : o3.accounts) || []), At((null === (i3 = this.connector) || void 0 === i3 ? void 0 : i3.accounts) || []);
        });
      } catch (t) {
        console.log(t), r2(new nt({ type: "SESSION_CONNECT", detail: t }, t.message || "There was an error while connecting to Pera Wallet"));
      }
    }));
  }
  reconnectSession() {
    return new Promise((e, n) => et(this, void 0, void 0, function* () {
      var r2, o2;
      try {
        const i2 = Et();
        if (!i2) return void e([]);
        if ("pera-wallet-web" === (null == i2 ? void 0 : i2.type)) {
          const { isWebWalletAvailable: t } = yield Nt();
          t ? e(i2.accounts || []) : n(new nt({ type: "SESSION_RECONNECT", detail: "Pera Web is not available" }, "Pera Web is not available"));
        }
        this.connector && e(this.connector.accounts || []), this.bridge = (null === (r2 = function() {
          var t;
          const e2 = null === (t = bt()) || void 0 === t ? void 0 : t.getItem(mt.WALLETCONNECT);
          return e2 ? JSON.parse(e2) : null;
        }()) || void 0 === r2 ? void 0 : r2.bridge) || "", this.bridge && (this.connector = new esm_default2({ bridge: this.bridge }), e((null === (o2 = this.connector) || void 0 === o2 ? void 0 : o2.accounts) || [])), this.isConnected || e([]);
      } catch (t) {
        yield this.disconnect(), n(new nt({ type: "SESSION_RECONNECT", detail: t }, t.message || "There was an error while reconnecting to Pera Wallet"));
      }
    }));
  }
  disconnect() {
    var t;
    return et(this, void 0, void 0, function* () {
      let e;
      this.isConnected && "mobile" === this.platform && (e = null === (t = this.connector) || void 0 === t ? void 0 : t.killSession(), null == e || e.then(() => {
        this.connector = null;
      })), yield Tt();
    });
  }
  signTransactionWithMobile(t) {
    return et(this, void 0, void 0, function* () {
      const e = It("algo_signTxn", [t]);
      try {
        try {
          const { silent: t2 } = yield Nt(), n = (yield this.connector.sendCustomRequest(e, { forcePushNotification: !t2 })).filter(Boolean);
          return "string" == typeof n[0] ? n.map(Ct) : n.map((t3) => Uint8Array.from(t3));
        } catch (t2) {
          return yield Promise.reject(new nt({ type: "SIGN_TRANSACTIONS", detail: t2 }, t2.message || "Failed to sign transaction"));
        }
      } finally {
        vt(ct), vt(ht);
      }
    });
  }
  signTransactionWithWeb(t, e) {
    return new Promise((n, r2) => xt({ signTxnRequestParams: t, webWalletURL: e, method: "SIGN_TXN", resolve: n, reject: r2 }));
  }
  signDataWithMobile({ data: t, signer: e, chainId: n }) {
    return et(this, void 0, void 0, function* () {
      const r2 = It("algo_signData", t.map((t2) => Object.assign(Object.assign({}, t2), { signer: e, chainId: n })));
      try {
        try {
          const { silent: t2 } = yield Nt(), e2 = (yield this.connector.sendCustomRequest(r2, { forcePushNotification: !t2 })).filter(Boolean);
          return "string" == typeof e2[0] ? e2.map(Ct) : e2.map((t3) => Uint8Array.from(t3));
        } catch (t2) {
          return yield Promise.reject(new nt({ type: "SIGN_TRANSACTIONS", detail: t2 }, t2.message || "Failed to sign transaction"));
        }
      } finally {
        vt(ct), vt(ht);
      }
    });
  }
  signDataWithWeb({ data: t, signer: e, chainId: n, webWalletURL: r2 }) {
    return new Promise((o2, i2) => xt({ method: "SIGN_DATA", signTxnRequestParams: t, signer: e, chainId: n, webWalletURL: r2, resolve: o2, reject: i2 }));
  }
  checkIsPeraDiscoverBrowser() {
    return window.navigator.userAgent.includes("pera");
  }
  signTransaction(t, n) {
    return et(this, void 0, void 0, function* () {
      if ("mobile" === this.platform && (Mt() ? gt() : !Mt() && this.shouldShowSignTxnToast && wt(), !this.connector)) throw new Error("PeraWalletConnect was not initialized correctly.");
      const r2 = t.flatMap((t2) => t2.map((t3) => function(t4, n2) {
        let r3;
        n2 && !(t4.signers || []).includes(n2) && (r3 = []);
        const o2 = { txn: (i2 = t4.txn, Buffer.from(esm_default.encodeUnsignedTransaction(i2)).toString("base64")) };
        var i2;
        return Array.isArray(r3) && (o2.signers = r3), t4.authAddr && (o2.authAddr = t4.authAddr), t4.message && (o2.message = t4.message), t4.msig && (o2.msig = t4.msig), o2;
      }(t3, n)));
      if ("web" === this.platform) {
        const { webWalletURL: t2 } = yield Nt();
        return this.signTransactionWithWeb(r2, t2);
      }
      return this.signTransactionWithMobile(r2);
    });
  }
  signData(t, e) {
    return et(this, void 0, void 0, function* () {
      const n = this.chainId || 4160;
      if ("mobile" === this.platform && (Mt() ? gt() : !Mt() && this.shouldShowSignTxnToast && wt(), !this.connector)) throw new Error("PeraWalletConnect was not initialized correctly.");
      if ("web" === this.platform) {
        const { webWalletURL: r3 } = yield Nt();
        return this.signDataWithWeb({ data: t, signer: e, chainId: n, webWalletURL: r3 });
      }
      const r2 = t.map((t2) => Object.assign(Object.assign({}, t2), { data: Buffer.from(t2.data).toString("base64") }));
      return this.signDataWithMobile({ data: r2, signer: e, chainId: n });
    });
  }
};
"undefined" != typeof window && (window.global = window, window.Buffer = window.Buffer || y, import("./App-428f5096-MMVFY3H6.js"));

export {
  ut,
  ct,
  ht,
  ft,
  dt,
  yt,
  vt,
  Ot,
  Lt,
  Mt,
  Ut,
  Bt,
  Wt,
  jt
};
//# sourceMappingURL=chunk-O3SOHMYN.js.map
