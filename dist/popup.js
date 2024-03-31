(()=>{"use strict";const e={Ё:"YO",Й:"I",Ц:"TS",У:"U",К:"K",Е:"E",Н:"N",Г:"G",Ш:"SH",Щ:"SCH",З:"Z",Х:"H",Ъ:"'",ё:"yo",й:"i",ц:"ts",у:"u",к:"k",е:"e",н:"n",г:"g",ш:"sh",щ:"sch",з:"z",х:"h",ъ:"'",Ф:"F",Ы:"I",В:"V",А:"A",П:"P",Р:"R",О:"O",Л:"L",Д:"D",Ж:"ZH",Э:"E",ф:"f",ы:"i",в:"v",а:"a",п:"p",р:"r",о:"o",л:"l",д:"d",ж:"zh",э:"e",Я:"Ya",Ч:"CH",С:"S",М:"M",И:"I",Т:"T",Ь:"'",Б:"B",Ю:"YU",я:"ya",ч:"ch",с:"s",м:"m",и:"i",т:"t",ь:"'",б:"b",ю:"yu"};function t(e){return e.split(" ").map((e=>`${e.charAt(0).toUpperCase()}${e.slice(1)}`)).join(" ")}function n(e){return"string"==typeof e}function r(e){return"[object Object]"===Object.prototype.toString.call(e)}function s(e){return Array.isArray(e)}function o(e){return"function"==typeof e}function a(e){return!s(e)||0===e.length}function i(e){return[].concat(...e)}function c(e){return[...new Set(i(e))]}function l(e,t){for(const n in t)t.hasOwnProperty(n)&&(e=e.replace(`{${n}}`,t[n]));return e}function u(e){return e.replace(/^(:|0)*/,"")}let d={},h={};function f(){return h=function(e){for(const t in e)if(e.hasOwnProperty(t))return!1;return!0}(h)?function(e){const t={};for(const r in e)if(e.hasOwnProperty(r)){const s=e[r];""!==s&&(t[r]=n(s)?new m(s):s)}return t}(g):h}class m{constructor(e){this.style=e,this._genre=null}get genre(){return this._genre=r(this._genre)?this._genre:(e=this.style,function(e,t){for(const n in e)if(e.hasOwnProperty(n)&&e[n].includes(t))return n;return null}(d,e));var e}}let g={};function p(e){const t=f(),r=e.toLowerCase();if(r in t){const e=t[r];if(e instanceof m)return[e.genre];if(s(e))return y(e);if(n(e))return p(e)}return[]}function b(e){const t=f(),r=e.toLowerCase();if(r in t){const e=t[r];if(e instanceof m)return[e.style];if(s(e))return w(e);if(n(e))return b(e)}return[]}function y(e){return c(e.map(p))}function w(e){return c(e.map(b))}class S{constructor({artist:e,title:t,label:n,catno:r,format:s,genres:o,styles:a,tracks:i,notes:c,date:l,images:u}){this.artist=e,this.title=t,this.label=n,this.catno=r,this.format=s,this.genres=o,this.styles=a,this.tracks=i,this.notes=c,this.date=l,this.images=u}static fromRelease(e){const t=e.artist===e.label?`Not On Label (${e.artist} Self-released)`:e.label;return new S({artist:e.releaseItem.artist,title:e.releaseItem.title,label:t,catno:"none",format:"File",genres:y(e.keywords),styles:w(e.keywords),tracks:e.tracks,notes:JSON.stringify(e.toMetadata()),date:e.published.toISOString().split("T")[0],images:e.image})}addGenre(e){return this.genres.push(e),this}addStyle(e){return this.styles.push(e),this}addTrack(e){return this.tracks.push(e),this}getGenre(){return this.genres.filter((e=>"Folk, World, & Country"!==e)).join(", ")}getStyle(){return this.styles.join(", ")}toCsvObject(){const e=this.tracks.map((e=>`${t(e.title)} ${u(e.duration.value)}`)).join("\r"),n=this.notes?this.notes.replace(/"/g,'""'):"";return{artist:`"${this.artist}"`,title:`"${t(this.title)}"`,label:`"${this.label}"`,catno:this.catno,format:this.format,genre:`"${this.getGenre()}"`,style:`"${this.getStyle()}"`,tracks:`"${e}"`,notes:`"${n}"`,date:this.date,images:this.images}}}const v={genres_url:"../data/discogs_genres.json",keyword_mapping_url:"https://gist.githubusercontent.com/Serhii-DV/44181f307548aabac2703147d3c730ba/raw/mapping.json",about_url:"../data/about.html",extension_url:"https://chrome.google.com/webstore/detail/bandcamp-to-discogs-b2d/hipnkehalkffbdjnbbeoefmoondaciok",discogs_search_artist_url:"https://www.discogs.com/search?q={artist}&type=artist",discogs_search_release_url:"https://www.discogs.com/search?q={artist}+{release}&type=release",text:{notes:"This draft was created via CSV upload and Bandcamp To Discogs Google Chrome extension {extension_url}\n\nRelease url: {release_url}"},discogsApi:{consumerKey:"TJGtBNerXwCzYvFCQXSD"}};function E(e){return S.fromRelease(e)}function I(e,t){return l(v.discogs_search_release_url,{artist:e,release:t})}async function k(e){let t={active:!0,currentWindow:!0};if(o(e))return void chrome.tabs.query(t,e);let[n]=await chrome.tabs.query(t);return n}function L(){return chrome.runtime.getManifest()}const C=[];for(let e=0;e<256;++e)C.push((e+256).toString(16).slice(1));const M=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i,j=function(e){if(!function(e){return"string"==typeof e&&M.test(e)}(e))throw TypeError("Invalid UUID");let t;const n=new Uint8Array(16);return n[0]=(t=parseInt(e.slice(0,8),16))>>>24,n[1]=t>>>16&255,n[2]=t>>>8&255,n[3]=255&t,n[4]=(t=parseInt(e.slice(9,13),16))>>>8,n[5]=255&t,n[6]=(t=parseInt(e.slice(14,18),16))>>>8,n[7]=255&t,n[8]=(t=parseInt(e.slice(19,23),16))>>>8,n[9]=255&t,n[10]=(t=parseInt(e.slice(24,36),16))/1099511627776&255,n[11]=t/4294967296&255,n[12]=t>>>24&255,n[13]=t>>>16&255,n[14]=t>>>8&255,n[15]=255&t,n};function T(e,t,n,r){switch(e){case 0:return t&n^~t&r;case 1:case 3:return t^n^r;case 2:return t&n^t&r^n&r}}function B(e,t){return e<<t|e>>>32-t}const O=function(e,t,n){function r(e,t,n,r){var s;if("string"==typeof e&&(e=function(e){e=unescape(encodeURIComponent(e));const t=[];for(let n=0;n<e.length;++n)t.push(e.charCodeAt(n));return t}(e)),"string"==typeof t&&(t=j(t)),16!==(null===(s=t)||void 0===s?void 0:s.length))throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");let o=new Uint8Array(16+e.length);if(o.set(t),o.set(e,t.length),o=function(e){const t=[1518500249,1859775393,2400959708,3395469782],n=[1732584193,4023233417,2562383102,271733878,3285377520];if("string"==typeof e){const t=unescape(encodeURIComponent(e));e=[];for(let n=0;n<t.length;++n)e.push(t.charCodeAt(n))}else Array.isArray(e)||(e=Array.prototype.slice.call(e));e.push(128);const r=e.length/4+2,s=Math.ceil(r/16),o=new Array(s);for(let t=0;t<s;++t){const n=new Uint32Array(16);for(let r=0;r<16;++r)n[r]=e[64*t+4*r]<<24|e[64*t+4*r+1]<<16|e[64*t+4*r+2]<<8|e[64*t+4*r+3];o[t]=n}o[s-1][14]=8*(e.length-1)/Math.pow(2,32),o[s-1][14]=Math.floor(o[s-1][14]),o[s-1][15]=8*(e.length-1)&4294967295;for(let e=0;e<s;++e){const r=new Uint32Array(80);for(let t=0;t<16;++t)r[t]=o[e][t];for(let e=16;e<80;++e)r[e]=B(r[e-3]^r[e-8]^r[e-14]^r[e-16],1);let s=n[0],a=n[1],i=n[2],c=n[3],l=n[4];for(let e=0;e<80;++e){const n=Math.floor(e/20),o=B(s,5)+T(n,a,i,c)+l+t[n]+r[e]>>>0;l=c,c=i,i=B(a,30)>>>0,a=s,s=o}n[0]=n[0]+s>>>0,n[1]=n[1]+a>>>0,n[2]=n[2]+i>>>0,n[3]=n[3]+c>>>0,n[4]=n[4]+l>>>0}return[n[0]>>24&255,n[0]>>16&255,n[0]>>8&255,255&n[0],n[1]>>24&255,n[1]>>16&255,n[1]>>8&255,255&n[1],n[2]>>24&255,n[2]>>16&255,n[2]>>8&255,255&n[2],n[3]>>24&255,n[3]>>16&255,n[3]>>8&255,255&n[3],n[4]>>24&255,n[4]>>16&255,n[4]>>8&255,255&n[4]]}(o),o[6]=15&o[6]|80,o[8]=63&o[8]|128,n){r=r||0;for(let e=0;e<16;++e)n[r+e]=o[e];return n}return function(e,t=0){return C[e[t+0]]+C[e[t+1]]+C[e[t+2]]+C[e[t+3]]+"-"+C[e[t+4]]+C[e[t+5]]+"-"+C[e[t+6]]+C[e[t+7]]+"-"+C[e[t+8]]+C[e[t+9]]+"-"+C[e[t+10]]+C[e[t+11]]+C[e[t+12]]+C[e[t+13]]+C[e[t+14]]+C[e[t+15]]}(o)}try{r.name="v5"}catch(e){}return r.DNS="6ba7b810-9dad-11d1-80b4-00c04fd430c8",r.URL="6ba7b811-9dad-11d1-80b4-00c04fd430c8",r}();function $(e){return O(e,O.URL)}class A{constructor(e,t,n){this.url=e,this.artist=t,this.title=n,this.uuid=$(e)}static fromObject(e){return new A(e.url,e.artist,e.title)}}class _{releaseItem;label;published;modified;tracks;tracksQty;image;keywords;constructor(e,t,n,r,s,o,a,i,c){this.releaseItem=new A(a,e,t),this.label=n,this.published=r,this.modified=s,this.tracks=o,this.tracksQty=o.length,this.image=i,this.keywords=c}get artist(){return this.releaseItem.artist}get url(){return this.releaseItem.url}get title(){return this.releaseItem.title}toStorageObject(){return{uuid:this.releaseItem.uuid,artist:this.releaseItem.artist,title:this.releaseItem.title,url:this.releaseItem.url,label:this.label,published:this.published.toISOString(),modified:this.modified.toISOString(),tracks:this.tracks,image:this.image,keywords:this.keywords}}static fromStorageObject(e){if(!e.url||!e.tracks)throw new Error("Cannot create Release object from object",e);const t=e.tracks.map((e=>new D(e.num,e.title,e.duration)));if(!e.published&&!e.date)throw new Error("Missing published or date property");if(!e.modified&&!e.date)throw new Error("Missing published or date property");return new _(e.artist,e.title,e.label,new Date(e.published??e.date),new Date(e.modified??e.date),t,e.url,e.image,e.keywords)}toMetadata(){return{version:L().version,format:{qty:this.tracksQty,fileType:"FLAC",description:"Album"},submissionNotes:(this,l(v.text.notes,{extension_url:v.extension_url,release_url:this.releaseItem.url}))}}}class D{num;title;duration;constructor(e,t,n){this.num=e,this.title=t,this.duration=n}}function H(e){if(!e||0===e.length)return"";const t=Object.keys(e[0]),n=[t.join(",")];for(const r of e){const e=t.map((e=>r[e]));n.push(e.join(","))}return n.join("\n")}function q(t,n){const r=new Blob([t],{type:"text/csv"}),s=URL.createObjectURL(r),o=document.createElement("a");var a,i;o.href=s,o.download=`${a=n,(i=a,Array.from(i).map((t=>e[t]||t)).join("")).replace(/[^a-zA-Z0-9]/gi,"_").toLowerCase()}.csv`,o.click(),URL.revokeObjectURL(s)}function U(e,t){return e.hasAttribute(`data-${t}`)}function R(e,t,n=""){e.setAttribute(`data-${t}`,n)}function x(...e){e.forEach((e=>s(e)?x(...e):e.classList.remove("visually-hidden")))}function N(...e){e.forEach((e=>s(e)?N(...e):e.classList.add("visually-hidden")))}function P(...e){e.forEach((e=>s(e)?P(...e):e.disabled=!0))}function z(...e){e.forEach((e=>s(e)?z(...e):e.disabled=!1))}function G(e){var t=new MouseEvent("click",{bubbles:!0,cancelable:!0,view:window});return e.dispatchEvent(t),e}function F(e){return e.dispatchEvent(new Event("input")),e}function V(e){const t=document.createElement("div");return t.innerHTML=e.trim(),t.firstChild}const Y=chrome.storage.local;function Q(e,t){const n=function(e){const t=[];return e.forEach((e=>t.push($(e)))),t}(e);Y.get(n,(e=>{let n=Object.values(e).map((function(e){try{return _.fromStorageObject(e)}catch(t){return console.log("B2D: Broken storage object. "+JSON.stringify(t),e),null}})).filter((e=>e instanceof _));o(t)&&t(n)}))}function J(e,t){s(e)?e.forEach((e=>J(e,t))):Y.remove(e,(()=>{chrome.runtime.lastError&&console.error(`Error clearing local storage item with key "${e}": ${chrome.runtime.lastError}`),o(t)&&t()}))}function K(e){if(!r(e)&&!s(e))return document.createTextNode(e);const t=document.createElement("table");t.classList.add("table","table-sm","table-striped","table-bordered");for(const[o,a]of Object.entries(e)){const e=document.createElement("tr"),i=document.createElement("th"),c=document.createElement("td");i.classList.add("w-25"),c.classList.add("w-auto"),i.textContent=o,r(a)?c.appendChild(K(a)):s(a)?c.innerHTML=a.map((e=>n(e)?e:K(e).outerHTML)).join(", "):c.innerHTML=n(a)?a.replace(/[\r\n]+/g,"<br/>"):a,e.appendChild(i),e.appendChild(c),t.appendChild(e)}return t}function Z(e,t){e.populateData(function(e){const t=[];return e.forEach((e=>{const n=e instanceof _?e.releaseItem:e,r=W(n.url,"box-arrow-up-right"),s=W(I(n.artist,n.title),"search");var o;t.push({title:`${n.artist} - ${n.title} ${r} ${s}`,value:n.url,id:(o=n.title,o.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,""))})})),t}(t))}function W(e,t){const n=document.createElement("a");return n.href=e,n.target="_blank",n.innerHTML=`<b2d-icon name="${t}"></b2d-icon>`,n.outerHTML}function X(e,t){!e instanceof HTMLElement||(e.style.backgroundImage=`url(${t})`)}function ee(e){return P(e),R(e,"original-content",e.innerHTML),e.innerHTML='\n  <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>\n  <span class="visually-hidden" role="status">Loading...</span>\n',e}function te(e){var t;return z(e),U(e,"original-content")&&(e.innerHTML=U(t=e,"original-content")?t.getAttribute("data-original-content"):undefined),e}function ne(e,t){const n=document.querySelector("#storageReleasesLIst");U(e,"buttons-initialized")||(function(e,t,n){const r=V('\n<button id="storageDataClearSelected" type="button" class="btn btn-danger" data-status-update title="Clear selected storage data">\n  <b2d-icon name="database-dash"></b2d-icon>\n</button>'),s=V('\n<button id="storageDataClear" type="button" class="btn btn-dark" title="Remove all items from the storage" data-bs-toggle="modal" data-bs-target="#storageTabDeleteAllModal">\n  <b2d-icon name="database-x"></b2d-icon>\n</button>');n.addEventListener("click",(e=>{const n=e.target;ee(n),Q(t.getSelectedValues(),(e=>{const t=e[0];q(H(e.map((e=>S.fromRelease(e).toCsvObject()))),`discogs-selected-releases-${t.artist}`),te(n)}))})),t.addStateButton(n),r.addEventListener("click",(()=>{J(t.getSelectedValues(),(()=>{re(t)}))})),e.querySelector("#storageTabDeleteAllModal_btnYes").addEventListener("click",(()=>{Y.clear(),re(t)})),t.appendButton(r,s),t.addStatusElement(document.getElementById("selectedStatusInfo"),document.getElementById("viewedStatusInfo"))}(e,n,t),R(e,"buttons-initialized")),re(n)}function re(e){var t;t=t=>{Z(e,t)},Y.get(null,(e=>{const n=[];for(const t in e)if(e.hasOwnProperty(t)||r(e[t]))try{n.push(_.fromStorageObject(e[t]))}catch(e){continue}o(t)&&t(n)}))}function se(e){if(a(e))return;const t=e[0];q(H(e.map((e=>S.fromRelease(e).toCsvObject()))),e.length>1?`discogs-selected-releases-${t.artist}`:`discogs-releases-${t.artist}-${t.title}`)}function oe(e,t,r,s,a){X(document.querySelector(".bg-image"),r);const i=e.querySelector("#releasesTabLIst");a.addEventListener("click",(async e=>{const t=e.target;ee(t);const n=i.getSelectedValues();!function(e,t){const n=function(e){const t={};return e.forEach((e=>{const n=$(e);t[n]=e})),t}(e),r=Object.keys(n);Y.get(r,(e=>{const s=Object.keys(e),a=r.filter((e=>!s.includes(e))).map((e=>n[e]));o(t)&&t(a)}))}(n,(e=>{(async function(e,t){const n=[];for(const r of e){const e=new Promise((e=>{chrome.tabs.create({url:r,active:!1},(n=>{t&&t(n),e(n)}))}));n.push(e)}return Promise.all(n)})(e,(e=>{chrome.scripting.executeScript({target:{tabId:e.id},func:ae}).then((()=>{}))})).then((()=>{setTimeout((()=>{Q(n,(e=>{se(e),te(t)}))}),3e3)}))}))})),i.addStateButton(a).addStatusElement(document.getElementById("selectedStatusInfo"),document.getElementById("viewedStatusInfo"));const c=[];let l;var u,d;function h(e,t){chrome.tabs.sendMessage(e.id,{type:"releases-list-search",search:t})}t.forEach((e=>c.push(A.fromStorageObject(e)))),Z(i,c),i.searchInput.addEventListener("input",(()=>{const e=i.searchInput.value;l?h(l,e):k().then((t=>{l=t,h(l,e)}))})),u=i.searchInput,n(d=s)?u.value!==d&&(u.value=d,F(u)):F(u)}function ae(){setTimeout((()=>window.close()),1e3)}function ie(e){let t=e.offsetHeight,n=parseInt(getComputedStyle(e).lineHeight);return Math.round(t/n)}function ce(e,t){t.addEventListener("click",(()=>{const t=document.getElementById("csvData");t.innerHTML="",e instanceof _&&function(e,t,n){const r=document.createElement("h2");r.classList.add("display-6"),r.innerText="Discogs CSV data",n.appendChild(r),n.appendChild(K(t))}(0,E(e).toCsvObject(),t)}))}const le=document.querySelector("console-command");const ue=document.getElementById("warningMessage-tab"),de=document.getElementById("release-tab"),he=document.getElementById("releases-tab"),fe=document.getElementById("csvData-tab"),me=document.getElementById("storageData-tab"),ge=document.getElementById("downloadRelease"),pe=document.getElementById("downloadReleases"),be=document.getElementById("downloadStorage"),ye=document.getElementById("discogsSearchArtist"),we=document.getElementById("releases");async function Se(){k().then((e=>{chrome.tabs.sendMessage(e.id,{type:"getBandcampData"},(e=>{if(null==e||0===Object.keys(e).length||void 0===e.data)return P(de,fe),N(he),x(ue,pe),void G(ue);!function(e){const n="release"===e.type,r="list"===e.type;(n||r)&&(N(ue),async function(e){return fetch(e).then((e=>e.json())).then((e=>(d=e,d))).catch((e=>{d={}}))}(v.genres_url).then((r=>{(async function(e){return fetch(e).then((e=>e.json())).then((e=>(g=e,g))).catch((e=>{g={}}))})(v.keyword_mapping_url).then((r=>{n?function(e,n){N(he),x(de),G(de);try{const r=_.fromStorageObject(e);!function(e,t){le.addCommand("log.release",(()=>{console.log(e)})),le.addCommand("log.keywordsMapping",(()=>{console.log(t)}));const n=E(e);le.addCommand("log.discogsCsvNotes",(()=>{console.log(n.notes)}))}(r,n),function(e,n,r,s){var o,i;!function(e,n){const r=e.querySelector("#release-artist"),s=e.querySelector("#release-title"),o=e.querySelector("#release-year"),a=e.querySelector(".release-content"),i=e.querySelector("#release-tracks");X(document.querySelector(".bg-image"),n.image),r.innerHTML=n.releaseItem.artist,s.innerHTML=n.releaseItem.title,o.innerHTML=n.published.getFullYear();let c=ie(r),l=ie(s);r.classList.toggle("display-6",c>=3&&c<=5),e.classList.add("lines-a"+c+"-t"+l);const d=n.tracks.map((e=>`${e.num}. ${t(e.title)} (${u(e.duration.value)})`)).join("<br>");i.innerHTML=d;const h=new Intl.DateTimeFormat("en-US",{year:"numeric",month:"long",day:"numeric"});a.querySelectorAll(".js-releasePublishedDate").forEach((function(e){e.innerHTML=h.format(n.published),e.title=n.published.toLocaleString()})),a.querySelectorAll(".js-releaseModifiedDate").forEach((function(e){e.innerHTML=h.format(n.modified),e.title=n.modified.toLocaleString()}))}(e,n),s.href=I(n.releaseItem.artist,n.releaseItem.title),o=r,a(i=[n])?P(o):(z(o),o.addEventListener("click",(()=>se(i))))}(document.getElementById("release"),r,ge,ye),ce(r,fe)}catch(e){console.error(e)}}(e.data,r):function(e){N(de),x(he),G(he),oe(we,e.data,e.popup.imageSrc,e.popup.search,pe)}(e)}))})))}(e)}))}))}document.addEventListener("DOMContentLoaded",(function(){var e;le.addCommand("log.storage",(()=>{console.log("B2D: Storage data"),Y.get(null,(e=>console.log(e)))})),de.addEventListener("click",(()=>{N(pe,be),x(ge),z(fe)})),he.addEventListener("click",(()=>{N(ge,be),x(pe),P(fe),we.querySelector("releases-list").refreshStatus()})),me.addEventListener("click",(()=>{N(ge,pe),x(be),ne(document.getElementById("storageData"),be)})),function(){const e=L();document.querySelectorAll(".version").forEach((t=>{t.textContent=e.version}))}(),Se(),e=e=>{document.querySelectorAll(".storage-size").forEach((t=>{t.textContent=function(e){if(0===e)return"0 Byte";const t=parseInt(Math.floor(Math.log(e)/Math.log(1024)));return Math.round(e/Math.pow(1024,t),2)+" "+["Bytes","KB","MB","GB","TB"][t]}(e),t.setAttribute("title",`Storage size (${e} bytes)`)}))},Y.getBytesInUse(null,e),document.querySelector("#discogsTab"),console.log("SETUP DISCOGS TAB")}))})();
//# sourceMappingURL=popup.js.map