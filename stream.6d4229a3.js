parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"eJar":[function(require,module,exports) {
"use strict";function e(e){for(var n=[],t=0,o=Object.keys(e);t<o.length;t++){var r=o[t];e[r]&&n.push(encodeURIComponent(r)+"="+encodeURIComponent(e[r]))}return n.join("&")}function n(){var e=window.location.href.split("?")[0].split("/");return e.slice(0,e.length-1).join("/")+"/overlay.html"}function t(t,o,r,u){var i=n(),l=document.getElementById("overlay-link"),a=e({user:t,sessionStart:o,hAlign:r,vAlign:u}),c=a?i+"?"+a:i;l.value=c}Object.defineProperty(exports,"__esModule",{value:!0}),exports.updateOverlayLink=exports.getBaseUrl=exports.getQueryString=void 0,exports.getQueryString=e,exports.getBaseUrl=n,exports.updateOverlayLink=t,document.addEventListener("DOMContentLoaded",function(){var e=document.getElementById("overlay-user-name"),n=document.getElementById("overlay-session-start"),o=document.getElementsByName("halign"),r=document.getElementsByName("valign"),u=document.getElementById("overlay-link"),i=document.getElementById("overlay-link-copy-button"),l=e.value,a=n.value,c="",s="";t(l,a,c,s),e.oninput=function(){t(l=e.value,a,c,s)},n.oninput=function(){a=n.value,t(l,a,c,s)},o.forEach(function(e){e.oninput=function(){e.checked&&(c=e.value,t(l,a,c,s))}}),r.forEach(function(e){e.oninput=function(){e.checked&&(s=e.value,t(l,a,c,s))}}),i.onclick=function(){navigator.clipboard.writeText(u.value)}});
},{}]},{},["eJar"], null)
//# sourceMappingURL=stream.6d4229a3.js.map