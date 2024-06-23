(()=>{"use strict";const t={Ё:"YO",Й:"I",Ц:"TS",У:"U",К:"K",Е:"E",Н:"N",Г:"G",Ш:"SH",Щ:"SCH",З:"Z",Х:"H",Ъ:"'",ё:"yo",й:"i",ц:"ts",у:"u",к:"k",е:"e",н:"n",г:"g",ш:"sh",щ:"sch",з:"z",х:"h",ъ:"'",Ф:"F",Ы:"I",В:"V",А:"A",П:"P",Р:"R",О:"O",Л:"L",Д:"D",Ж:"ZH",Э:"E",ф:"f",ы:"i",в:"v",а:"a",п:"p",р:"r",о:"o",л:"l",д:"d",ж:"zh",э:"e",Я:"Ya",Ч:"CH",С:"S",М:"M",И:"I",Т:"T",Ь:"'",Б:"B",Ю:"YU",я:"ya",ч:"ch",с:"s",м:"m",и:"i",т:"t",ь:"'",б:"b",ю:"yu"};function e(t){return t.split(" ").map((t=>`${t.charAt(0).toUpperCase()}${t.slice(1)}`)).join(" ")}function n(t){return"string"==typeof t}function r(t){return"[object Object]"===Object.prototype.toString.call(t)}function s(t){return Array.isArray(t)}function o(t){return"function"==typeof t}function a(t){return!s(t)||0===t.length}function i(t){return[].concat(...t)}function c(t){return[...new Set(i(t))]}function l(t,e){for(const n in e)e.hasOwnProperty(n)&&(t=t.replace(`{${n}}`,e[n]));return t}function u(t){return t.replace(/^(:|0)*/,"")}let d={},h={};function m(){return h=function(t){for(const e in t)if(t.hasOwnProperty(e))return!1;return!0}(h)?function(t){const e={};for(const r in t)if(t.hasOwnProperty(r)){const s=t[r];""!==s&&(e[r]=n(s)?new f(s):s)}return e}(g):h}class f{constructor(t){this.style=t,this._genre=null}get genre(){return this._genre=r(this._genre)?this._genre:(t=this.style,function(t,e){for(const n in t)if(t.hasOwnProperty(n)&&t[n].includes(e))return n;return null}(d,t));var t}}let g={};function p(t){const e=m(),r=t.toLowerCase();if(r in e){const t=e[r];if(t instanceof f)return[t.genre];if(s(t))return y(t);if(n(t))return p(t)}return[]}function b(t){const e=m(),r=t.toLowerCase();if(r in e){const t=e[r];if(t instanceof f)return[t.style];if(s(t))return w(t);if(n(t))return b(t)}return[]}function y(t){return c(t.map(p))}function w(t){return c(t.map(b))}const S=t=>t.toISOString().split("T")[0];class v{constructor({artist:t,title:e,label:n,catno:r,format:s,genres:o,styles:a,tracks:i,notes:c,date:l,images:u}){this.artist=t,this.title=e,this.label=n,this.catno=r,this.format=s,this.genres=o,this.styles=a,this.tracks=i,this.notes=c,this.date=l,this.images=u}static fromRelease(t){const e=t.artist===t.label?`Not On Label (${t.artist} Self-released)`:t.label;return new v({artist:t.releaseItem.artist,title:t.releaseItem.title,label:e,catno:"none",format:"File",genres:y(t.keywords),styles:w(t.keywords),tracks:t.tracks,notes:JSON.stringify(t.toMetadata()),date:t.published,images:t.image})}addGenre(t){return this.genres.push(t),this}addStyle(t){return this.styles.push(t),this}addTrack(t){return this.tracks.push(t),this}getGenre(){return this.genres.filter((t=>"Folk, World, & Country"!==t)).join(", ")}getStyle(){return this.styles.join(", ")}getDate(){return S(this.date)}toCsvObject(){const t=this.tracks.map((t=>`${e(t.title)} ${u(t.time.value)}`)).join("\r"),n=this.notes?this.notes.replace(/"/g,'""'):"";return{artist:`"${this.artist}"`,title:`"${e(this.title)}"`,label:`"${this.label}"`,catno:this.catno,format:this.format,genre:`"${this.getGenre()}"`,style:`"${this.getStyle()}"`,tracks:`"${t}"`,notes:`"${n}"`,date:this.getDate(),images:this.images}}}const I={genres_url:"../data/discogs_genres.json",keyword_mapping_url:"https://gist.githubusercontent.com/Serhii-DV/44181f307548aabac2703147d3c730ba/raw/mapping.json",about_url:"../data/about.html",extension_url:"https://chrome.google.com/webstore/detail/bandcamp-to-discogs-b2d/hipnkehalkffbdjnbbeoefmoondaciok",discogs_search_artist_url:"https://www.discogs.com/search?q={artist}&type=artist",discogs_search_release_url:"https://www.discogs.com/search?q={artist}+{release}&type=release",text:{notes:"This draft was created via CSV upload and Bandcamp To Discogs Google Chrome extension {extension_url}\n\nRelease url: {release_url}"},discogsApi:{consumerKey:"TJGtBNerXwCzYvFCQXSD"}};function E(t){return v.fromRelease(t)}function L(t,e){return l(I.discogs_search_release_url,{artist:t,release:e})}async function k(t){let e={active:!0,currentWindow:!0};if(o(t))return void chrome.tabs.query(e,t);let[n]=await chrome.tabs.query(e);return n}function M(){return chrome.runtime.getManifest()}const j=[];for(let t=0;t<256;++t)j.push((t+256).toString(16).slice(1));const C=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i,T=function(t){if(!function(t){return"string"==typeof t&&C.test(t)}(t))throw TypeError("Invalid UUID");let e;const n=new Uint8Array(16);return n[0]=(e=parseInt(t.slice(0,8),16))>>>24,n[1]=e>>>16&255,n[2]=e>>>8&255,n[3]=255&e,n[4]=(e=parseInt(t.slice(9,13),16))>>>8,n[5]=255&e,n[6]=(e=parseInt(t.slice(14,18),16))>>>8,n[7]=255&e,n[8]=(e=parseInt(t.slice(19,23),16))>>>8,n[9]=255&e,n[10]=(e=parseInt(t.slice(24,36),16))/1099511627776&255,n[11]=e/4294967296&255,n[12]=e>>>24&255,n[13]=e>>>16&255,n[14]=e>>>8&255,n[15]=255&e,n};function O(t,e,n,r){switch(t){case 0:return e&n^~e&r;case 1:case 3:return e^n^r;case 2:return e&n^e&r^n&r}}function B(t,e){return t<<e|t>>>32-e}const $=function(t,e,n){function r(t,e,n,r){var s;if("string"==typeof t&&(t=function(t){t=unescape(encodeURIComponent(t));const e=[];for(let n=0;n<t.length;++n)e.push(t.charCodeAt(n));return e}(t)),"string"==typeof e&&(e=T(e)),16!==(null===(s=e)||void 0===s?void 0:s.length))throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");let o=new Uint8Array(16+t.length);if(o.set(e),o.set(t,e.length),o=function(t){const e=[1518500249,1859775393,2400959708,3395469782],n=[1732584193,4023233417,2562383102,271733878,3285377520];if("string"==typeof t){const e=unescape(encodeURIComponent(t));t=[];for(let n=0;n<e.length;++n)t.push(e.charCodeAt(n))}else Array.isArray(t)||(t=Array.prototype.slice.call(t));t.push(128);const r=t.length/4+2,s=Math.ceil(r/16),o=new Array(s);for(let e=0;e<s;++e){const n=new Uint32Array(16);for(let r=0;r<16;++r)n[r]=t[64*e+4*r]<<24|t[64*e+4*r+1]<<16|t[64*e+4*r+2]<<8|t[64*e+4*r+3];o[e]=n}o[s-1][14]=8*(t.length-1)/Math.pow(2,32),o[s-1][14]=Math.floor(o[s-1][14]),o[s-1][15]=8*(t.length-1)&4294967295;for(let t=0;t<s;++t){const r=new Uint32Array(80);for(let e=0;e<16;++e)r[e]=o[t][e];for(let t=16;t<80;++t)r[t]=B(r[t-3]^r[t-8]^r[t-14]^r[t-16],1);let s=n[0],a=n[1],i=n[2],c=n[3],l=n[4];for(let t=0;t<80;++t){const n=Math.floor(t/20),o=B(s,5)+O(n,a,i,c)+l+e[n]+r[t]>>>0;l=c,c=i,i=B(a,30)>>>0,a=s,s=o}n[0]=n[0]+s>>>0,n[1]=n[1]+a>>>0,n[2]=n[2]+i>>>0,n[3]=n[3]+c>>>0,n[4]=n[4]+l>>>0}return[n[0]>>24&255,n[0]>>16&255,n[0]>>8&255,255&n[0],n[1]>>24&255,n[1]>>16&255,n[1]>>8&255,255&n[1],n[2]>>24&255,n[2]>>16&255,n[2]>>8&255,255&n[2],n[3]>>24&255,n[3]>>16&255,n[3]>>8&255,255&n[3],n[4]>>24&255,n[4]>>16&255,n[4]>>8&255,255&n[4]]}(o),o[6]=15&o[6]|80,o[8]=63&o[8]|128,n){r=r||0;for(let t=0;t<16;++t)n[r+t]=o[t];return n}return function(t,e=0){return j[t[e+0]]+j[t[e+1]]+j[t[e+2]]+j[t[e+3]]+"-"+j[t[e+4]]+j[t[e+5]]+"-"+j[t[e+6]]+j[t[e+7]]+"-"+j[t[e+8]]+j[t[e+9]]+"-"+j[t[e+10]]+j[t[e+11]]+j[t[e+12]]+j[t[e+13]]+j[t[e+14]]+j[t[e+15]]}(o)}try{r.name="v5"}catch(t){}return r.DNS="6ba7b810-9dad-11d1-80b4-00c04fd430c8",r.URL="6ba7b811-9dad-11d1-80b4-00c04fd430c8",r}();function A(t){return $(t,$.URL)}class D{#t;#e;#n;constructor(t,e,n){this.#t=t,this.#e=e,this.#n=n}get value(){return this.toString()}get date(){return this.toDate()}toString(){return new Intl.DateTimeFormat("en",{hour12:!1,hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(this.toDate())}toDate(){const t=new Date(0);return t.setHours(this.#t),t.setMinutes(this.#e),t.setSeconds(this.#n),t}static fromString(t){if(!/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(t))throw new Error("Invalid time format. Please use HH:MM:SS.");const[e,n,r]=t.split(":");return new D(parseInt(e,10),parseInt(n,10),parseInt(r,10))}static fromDuration(t){const e=(/(\d+)H/.exec(t)||[])[1]||0,n=(/(\d+)M/.exec(t)||[])[1]||0,r=(/(\d+)S/.exec(t)||[])[1]||0;return new D(parseInt(e,10),parseInt(n,10),parseInt(r,10))}}const H=D;class _{constructor(t,e,n){this.url=t,this.artist=e,this.title=n,this.uuid=A(t)}static fromObject(t){return new _(t.url,t.artist,t.title)}}class q{releaseItem;label;published;modified;tracks;tracksQty;image;keywords;constructor(t,e,n,r,s,o,a,i,c){this.releaseItem=new _(a,t,e),this.label=n,this.published=r,this.modified=s,this.tracks=o,this.tracksQty=o.length,this.image=i,this.keywords=c}get artist(){return this.releaseItem.artist}get url(){return this.releaseItem.url}get title(){return this.releaseItem.title}toStorageObject(){return{uuid:this.releaseItem.uuid,artist:this.releaseItem.artist,title:this.releaseItem.title,url:this.releaseItem.url,label:this.label,published:this.published.toISOString(),modified:this.modified.toISOString(),tracks:this.tracks.map((t=>t.toStorageObject())),image:this.image,keywords:this.keywords}}static fromStorageObject(t){if(!t.url||!t.tracks)throw new Error("Cannot create Release object from object",t);const e=t.tracks.map((t=>x.fromStorageObject(t)));if(!t.published&&!t.date)throw new Error("Missing published or date property");if(!t.modified&&!t.date)throw new Error("Missing published or date property");return new q(t.artist,t.title,t.label,new Date(t.published??t.date),new Date(t.modified??t.date),e,t.url,t.image,t.keywords)}toMetadata(){return{version:M().version,format:{qty:this.tracksQty,fileType:"FLAC",description:"Album"},submissionNotes:(this,l(I.text.notes,{extension_url:I.extension_url,release_url:this.releaseItem.url}))}}}class x{num;title;time;constructor(t,e,n){this.num=t,this.title=e,this.time=n}toStorageObject(){return{num:this.num,title:this.title,time:this.time.value}}static fromStorageObject(t){return new x(t.num,t.title,H.fromString(t.time||t.duration))}}function R(t){if(!t||0===t.length)return"";const e=Object.keys(t[0]),n=[e.join(",")];for(const r of t){const t=e.map((t=>r[t]));n.push(t.join(","))}return n.join("\n")}function U(e,n){const r=new Blob([e],{type:"text/csv"}),s=URL.createObjectURL(r),o=document.createElement("a");var a,i;o.href=s,o.download=`${a=n,(i=a,Array.from(i).map((e=>t[e]||e)).join("")).replace(/[^a-zA-Z0-9]/gi,"_").toLowerCase()}.csv`,o.click(),URL.revokeObjectURL(s)}function P(t,e){return t.hasAttribute(`data-${e}`)}function N(t,e,n=""){t.setAttribute(`data-${e}`,n)}function z(...t){t.forEach((t=>s(t)?z(...t):t.classList.remove("visually-hidden")))}function F(...t){t.forEach((t=>s(t)?F(...t):t.classList.add("visually-hidden")))}function G(...t){t.forEach((t=>s(t)?G(...t):t.disabled=!0))}function V(...t){t.forEach((t=>s(t)?V(...t):t.disabled=!1))}function Y(t){var e=new MouseEvent("click",{bubbles:!0,cancelable:!0,view:window});return t.dispatchEvent(e),t}function Q(t){return t.dispatchEvent(new Event("input")),t}function J(t){const e=document.createElement("div");return e.innerHTML=t.trim(),e.firstChild}const K=chrome.storage.local;function Z(t,e){const n=function(t){const e=[];return t.forEach((t=>e.push(A(t)))),e}(t);K.get(n,(t=>{let n=Object.values(t).map((function(t){try{return q.fromStorageObject(t)}catch(e){return console.log("B2D: Broken storage object. "+JSON.stringify(e),t),null}})).filter((t=>t instanceof q));o(e)&&e(n)}))}function W(t,e){s(t)?t.forEach((t=>W(t,e))):K.remove(t,(()=>{chrome.runtime.lastError&&console.error(`Error clearing local storage item with key "${t}": ${chrome.runtime.lastError}`),o(e)&&e()}))}function X(t){if(!r(t)&&!s(t))return document.createTextNode(t);const e=document.createElement("table");e.classList.add("table","table-sm","table-striped","table-bordered");for(const[o,a]of Object.entries(t)){const t=document.createElement("tr"),i=document.createElement("th"),c=document.createElement("td");i.classList.add("w-25"),c.classList.add("w-auto"),i.textContent=o,r(a)?c.appendChild(X(a)):s(a)?c.innerHTML=a.map((t=>n(t)?t:X(t).outerHTML)).join(", "):c.innerHTML=n(a)?a.replace(/[\r\n]+/g,"<br/>"):a,t.appendChild(i),t.appendChild(c),e.appendChild(t)}return e}function tt(t,e){t.populateData(function(t){const e=[];return t.forEach((t=>{const n=t instanceof q?t.releaseItem:t,r=et(n.url,"box-arrow-up-right"),s=et(L(n.artist,n.title),"search");var o,a;e.push({title:`${n.artist} - ${n.title} ${r} ${s}`,value:(a=n,A(a.url)),id:(o=n.title,o.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,""))})})),e}(e))}function et(t,e){const n=document.createElement("a");return n.href=t,n.target="_blank",n.innerHTML=`<b2d-icon name="${e}"></b2d-icon>`,n.outerHTML}function nt(t,e){!t instanceof HTMLElement||(t.style.backgroundImage=`url(${e})`)}function rt(t){return G(t),N(t,"original-content",t.innerHTML),t.innerHTML='\n  <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>\n  <span class="visually-hidden" role="status">Loading...</span>\n',t}function st(t){var e;return V(t),P(t,"original-content")&&(t.innerHTML=P(e=t,"original-content")?e.getAttribute("data-original-content"):undefined),t}function ot(t,e){const n=document.querySelector("#historyReleasesList");P(t,"buttons-initialized")||(function(t,e,n){const r=J('\n<button id="historyDataClearSelected" type="button" class="btn btn-danger" data-status-update title="Clear selected history">\n  <b2d-icon name="database-dash"></b2d-icon>\n</button>'),s=J('\n<button id="historyDataClear" type="button" class="btn btn-dark" title="Remove all items from the history" data-bs-toggle="modal" data-bs-target="#historyTabDeleteAllModal">\n  <b2d-icon name="database-x"></b2d-icon>\n</button>');n.addEventListener("click",(t=>{const n=t.target;rt(n),Z(e.getSelectedValues(),(t=>{const e=t[0];U(R(t.map((t=>v.fromRelease(t).toCsvObject()))),`discogs-selected-releases-${e.artist}`),st(n)}))})),e.addStateButton(n),r.addEventListener("click",(()=>{W(e.getSelectedValues(),(()=>{at(e)}))})),t.querySelector("#historyTabDeleteAllModal_btnYes").addEventListener("click",(()=>{K.clear(),at(e)})),e.appendButton(r,s),e.addStatusElement(document.getElementById("selectedStatusInfo"),document.getElementById("viewedStatusInfo"))}(t,n,e),N(t,"buttons-initialized")),at(n)}function at(t){var e;e=e=>{tt(t,e)},K.get(null,(t=>{const n=[];for(const e in t)if(t.hasOwnProperty(e)||r(t[e]))try{n.push(q.fromStorageObject(t[e]))}catch(t){continue}o(e)&&e(n)}))}function it(t){if(a(t))return;const e=t[0];U(R(t.map((t=>v.fromRelease(t).toCsvObject()))),t.length>1?`discogs-selected-releases-${e.artist}`:`discogs-releases-${e.artist}-${e.title}`)}function ct(t,e,r,s,a){nt(document.querySelector(".bg-image"),r);const i=t.querySelector("#releasesTabLIst");a.addEventListener("click",(async t=>{const e=t.target;rt(e);const n=i.getSelectedValues();!function(t,e){const n=function(t){const e={};return t.forEach((t=>{const n=A(t);e[n]=t})),e}(t),r=Object.keys(n);K.get(r,(t=>{const s=Object.keys(t),a=r.filter((t=>!s.includes(t))).map((t=>n[t]));o(e)&&e(a)}))}(n,(t=>{(async function(t,e){const n=[];for(const r of t){const t=new Promise((t=>{chrome.tabs.create({url:r,active:!1},(n=>{e&&e(n),t(n)}))}));n.push(t)}return Promise.all(n)})(t,(t=>{chrome.scripting.executeScript({target:{tabId:t.id},func:lt}).then((()=>{}))})).then((()=>{setTimeout((()=>{Z(n,(t=>{it(t),st(e)}))}),3e3)}))}))})),i.addStateButton(a).addStatusElement(document.getElementById("selectedStatusInfo"),document.getElementById("viewedStatusInfo"));const c=[];let l;var u,d;function h(t,e){chrome.tabs.sendMessage(t.id,{type:"releases-list-search",search:e})}e.forEach((t=>c.push(_.fromStorageObject(t)))),tt(i,c),i.searchInput.addEventListener("input",(()=>{const t=i.searchInput.value;l?h(l,t):k().then((e=>{l=e,h(l,t)}))})),u=i.searchInput,n(d=s)?u.value!==d&&(u.value=d,Q(u)):Q(u)}function lt(){setTimeout((()=>window.close()),1e3)}const ut=(t,e)=>{t.addEventListener("click",(()=>{const n=t.querySelector("b2d-icon");dt(e??t.getAttribute("data-content")).then((()=>{const t=n.getAttribute("name");n.setIcon("clipboard2-check-fill"),setTimeout((()=>{n.setIcon(t)}),3e3)}))}))},dt=t=>navigator&&navigator.clipboard&&navigator.clipboard.writeText?navigator.clipboard.writeText(t):Promise.reject("The Clipboard API is not available.");function ht(t){let e=t.offsetHeight,n=parseInt(getComputedStyle(t).lineHeight);return Math.round(e/n)}function mt(t,e){e.addEventListener("click",(()=>{const e=document.getElementById("csvData");e.innerHTML="",t instanceof q&&function(t,e,n){const r=document.createElement("h2");r.classList.add("display-6"),r.innerText="Discogs CSV data",n.appendChild(r),n.appendChild(X(e))}(0,E(t).toCsvObject(),e)}))}const ft=document.querySelector("console-command");const gt=document.getElementById("dashboard-tab"),pt=document.getElementById("release-tab"),bt=document.getElementById("releases-tab"),yt=document.getElementById("csvData-tab"),wt=document.getElementById("history-tab"),St=document.getElementById("downloadRelease"),vt=document.getElementById("downloadReleases"),It=document.getElementById("downloadHistory"),Et=document.getElementById("discogsSearchArtist"),Lt=document.getElementById("releases");async function kt(){k().then((t=>{chrome.tabs.sendMessage(t.id,{type:"getBandcampData"},(t=>{null!=t&&0!==Object.keys(t).length&&void 0!==t.data?function(t){const n="release"===t.type,r="list"===t.type;(n||r)&&async function(t){return fetch(t).then((t=>t.json())).then((t=>(d=t,d))).catch((t=>{d={}}))}(I.genres_url).then((r=>{(async function(t){return fetch(t).then((t=>t.json())).then((t=>(g=t,g))).catch((t=>{g={}}))})(I.keyword_mapping_url).then((r=>{n?function(t,n){F(bt),z(pt),Y(pt);try{const r=q.fromStorageObject(t);!function(t,e){ft.addCommand("log.release",(()=>{console.log(t)})),ft.addCommand("log.keywordsMapping",(()=>{console.log(e)}));const n=E(t);ft.addCommand("log.discogsCsvNotes",(()=>{console.log(n.notes)}))}(r,n),function(t,n,r,s){var o,i;!function(t,n){const r=t.querySelector("#release-artist"),s=t.querySelector("#release-title"),o=t.querySelector("#release-year"),a=t.querySelector(".release-content"),i=t.querySelector("#release-tracks");nt(document.querySelector(".bg-image"),n.image),r.innerHTML=n.releaseItem.artist,s.innerHTML=n.releaseItem.title,o.innerHTML=n.published.getFullYear();let c=ht(r),l=ht(s);r.classList.toggle("display-6",c>=3&&c<=5),t.classList.add("lines-a"+c+"-t"+l);const d=n.tracks.map((t=>`${t.num}. ${e(t.title)} (${u(t.time.value)})`)).join("<br>");i.innerHTML=d;const h=new Intl.DateTimeFormat("en-US",{year:"numeric",month:"long",day:"numeric"});a.querySelectorAll(".js-releasePublishedDate").forEach((t=>{t.innerHTML=h.format(n.published)+t.innerHTML,t.title=n.published.toLocaleString(),ut(t.querySelector(".action-copy"),S(n.published))})),a.querySelectorAll(".js-releaseModifiedDate").forEach((t=>{t.innerHTML=h.format(n.modified)+t.innerHTML,t.title=n.modified.toLocaleString(),ut(t.querySelector(".action-copy"),S(n.modified))}))}(t,n),s.href=L(n.releaseItem.artist,n.releaseItem.title),o=r,a(i=[n])?G(o):(V(o),o.addEventListener("click",(()=>it(i))))}(document.getElementById("release"),r,St,Et),mt(r,yt)}catch(t){console.error(t)}}(t.data,r):function(t){F(pt),z(bt),Y(bt),ct(Lt,t.data,t.popup.imageSrc,t.popup.search,vt)}(t)}))}))}(t):(G(pt,yt),F(bt),z(vt),Y(gt),z(document.getElementById("b2d-warning-bandcamp-data-not-found")))}))}))}function Mt(t){const e=M();t.querySelectorAll(".version").forEach((t=>{t.textContent=e.version}))}document.addEventListener("DOMContentLoaded",(function(){var t,e;ft.addCommand("log.storage",(()=>{console.log("B2D: Storage data"),K.get(null,(t=>console.log(t)))})),pt.addEventListener("click",(()=>{F(vt,It),z(St),V(yt)})),bt.addEventListener("click",(()=>{F(St,It),z(vt),G(yt),Lt.querySelector("releases-list").refreshStatus()})),wt.addEventListener("click",(()=>{F(St,vt),z(It),ot(document.getElementById("history"),It)})),Mt(document),kt(),t=t=>{document.querySelectorAll(".storage-size").forEach((e=>{e.textContent=function(t){if(0===t)return"0 Byte";const e=parseInt(Math.floor(Math.log(t)/Math.log(1024)));return Math.round(t/Math.pow(1024,e),2)+" "+["Bytes","KB","MB","GB","TB"][e]}(t),e.setAttribute("title",`Storage size (${t} bytes)`)}))},K.getBytesInUse(null,t),e=t=>{Mt(t.target)},document.querySelectorAll("external-content").forEach((t=>{t.addEventListener("externalContentLoaded",e)}))}))})();
//# sourceMappingURL=popup.js.map