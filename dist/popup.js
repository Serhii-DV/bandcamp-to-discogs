(()=>{"use strict";const t={Ё:"YO",Й:"I",Ц:"TS",У:"U",К:"K",Е:"E",Н:"N",Г:"G",Ш:"SH",Щ:"SCH",З:"Z",Х:"H",Ъ:"'",ё:"yo",й:"i",ц:"ts",у:"u",к:"k",е:"e",н:"n",г:"g",ш:"sh",щ:"sch",з:"z",х:"h",ъ:"'",Ф:"F",Ы:"I",В:"V",А:"A",П:"P",Р:"R",О:"O",Л:"L",Д:"D",Ж:"ZH",Э:"E",ф:"f",ы:"i",в:"v",а:"a",п:"p",р:"r",о:"o",л:"l",д:"d",ж:"zh",э:"e",Я:"Ya",Ч:"CH",С:"S",М:"M",И:"I",Т:"T",Ь:"'",Б:"B",Ю:"YU",я:"ya",ч:"ch",с:"s",м:"m",и:"i",т:"t",ь:"'",б:"b",ю:"yu"};function e(t){return t.split(" ").map((t=>`${t.charAt(0).toUpperCase()}${t.slice(1)}`)).join(" ")}function n(t){return"string"==typeof t}function r(t){return"[object Object]"===Object.prototype.toString.call(t)}function s(t){return Array.isArray(t)}function a(t){return"function"==typeof t}function o(t){return!s(t)||0===t.length}function i(t){return[].concat(...t)}function c(t){return[...new Set(i(t))]}function l(t,e){for(const n in e)e.hasOwnProperty(n)&&(t=t.replace(`{${n}}`,e[n]));return t}function u(t){const e=t.split(":");return"00"===e[0]&&e.shift(),e.join(":")}let d={},h={};function f(){return h=function(t){for(const e in t)if(t.hasOwnProperty(e))return!1;return!0}(h)?function(t){const e={};for(const r in t)if(t.hasOwnProperty(r)){const s=t[r];""!==s&&(e[r]=n(s)?new m(s):s)}return e}(g):h}class m{constructor(t){this.style=t,this._genre=null}get genre(){return this._genre=r(this._genre)?this._genre:(t=this.style,function(t,e){for(const n in t)if(t.hasOwnProperty(n)&&t[n].includes(e))return n;return null}(d,t));var t}}let g={};function p(t){const e=f(),r=t.toLowerCase();if(r in e){const t=e[r];if(t instanceof m)return[t.genre];if(s(t))return b(t);if(n(t))return p(t)}return[]}function y(t){const e=f(),r=t.toLowerCase();if(r in e){const t=e[r];if(t instanceof m)return[t.style];if(s(t))return w(t);if(n(t))return y(t)}return[]}function b(t){return c(t.map(p))}function w(t){return c(t.map(y))}class v{constructor({artist:t,title:e,label:n,catno:r,format:s,genres:a,styles:o,tracks:i,notes:c,date:l,images:u}){this.artist=t,this.title=e,this.label=n,this.catno=r,this.format=s,this.genres=a,this.styles=o,this.tracks=i,this.notes=c,this.date=l,this.images=u}static fromRelease(t){const e=t.artist===t.label?`Not On Label (${t.artist} Self-released)`:t.label;return new v({artist:t.releaseItem.artist,title:t.releaseItem.title,label:e,catno:"none",format:"File",genres:b(t.keywords),styles:w(t.keywords),tracks:t.tracks,notes:JSON.stringify(t.toMetadata()),date:t.date.toISOString().split("T")[0],images:t.image})}addGenre(t){return this.genres.push(t),this}addStyle(t){return this.styles.push(t),this}addTrack(t){return this.tracks.push(t),this}getGenre(){return this.genres.filter((t=>"Folk, World, & Country"!==t)).join(", ")}getStyle(){return this.styles.join(", ")}toCsvObject(){const t=this.tracks.map((t=>`${e(t.title)} ${u(t.duration)}`)).join("\r"),n=this.notes?this.notes.replace(/"/g,'""'):"";return{artist:`"${this.artist}"`,title:`"${e(this.title)}"`,label:`"${this.label}"`,catno:this.catno,format:this.format,genre:`"${this.getGenre()}"`,style:`"${this.getStyle()}"`,tracks:`"${t}"`,notes:`"${n}"`,date:this.date,images:this.images}}}const E={genres_url:"../data/discogs_genres.json",keyword_mapping_url:"https://gist.githubusercontent.com/Serhii-DV/44181f307548aabac2703147d3c730ba/raw/mapping.json",about_url:"../data/about.html",extension_url:"https://chrome.google.com/webstore/detail/bandcamp-to-discogs-b2d/hipnkehalkffbdjnbbeoefmoondaciok",discogs_search_artist_url:"https://www.discogs.com/search?q={artist}&type=artist",discogs_search_release_url:"https://www.discogs.com/search?q={artist}+{release}&type=release",text:{notes:"This draft was created via CSV upload and Bandcamp To Discogs Google Chrome extension {extension_url}\n\nRelease url: {release_url}"},discogsApi:{consumerKey:"TJGtBNerXwCzYvFCQXSD"}};function I(t){return v.fromRelease(t)}function S(t,e){return l(E.discogs_search_release_url,{artist:t,release:e})}async function k(t){let e={active:!0,currentWindow:!0};if(a(t))return void chrome.tabs.query(e,t);let[n]=await chrome.tabs.query(e);return n}function L(){return chrome.runtime.getManifest()}const C=[];for(let t=0;t<256;++t)C.push((t+256).toString(16).slice(1));const j=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i,M=function(t){if(!function(t){return"string"==typeof t&&j.test(t)}(t))throw TypeError("Invalid UUID");let e;const n=new Uint8Array(16);return n[0]=(e=parseInt(t.slice(0,8),16))>>>24,n[1]=e>>>16&255,n[2]=e>>>8&255,n[3]=255&e,n[4]=(e=parseInt(t.slice(9,13),16))>>>8,n[5]=255&e,n[6]=(e=parseInt(t.slice(14,18),16))>>>8,n[7]=255&e,n[8]=(e=parseInt(t.slice(19,23),16))>>>8,n[9]=255&e,n[10]=(e=parseInt(t.slice(24,36),16))/1099511627776&255,n[11]=e/4294967296&255,n[12]=e>>>24&255,n[13]=e>>>16&255,n[14]=e>>>8&255,n[15]=255&e,n};function $(t,e,n,r){switch(t){case 0:return e&n^~e&r;case 1:case 3:return e^n^r;case 2:return e&n^e&r^n&r}}function O(t,e){return t<<e|t>>>32-e}const B=function(t,e,n){function r(t,e,n,r){var s;if("string"==typeof t&&(t=function(t){t=unescape(encodeURIComponent(t));const e=[];for(let n=0;n<t.length;++n)e.push(t.charCodeAt(n));return e}(t)),"string"==typeof e&&(e=M(e)),16!==(null===(s=e)||void 0===s?void 0:s.length))throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");let a=new Uint8Array(16+t.length);if(a.set(e),a.set(t,e.length),a=function(t){const e=[1518500249,1859775393,2400959708,3395469782],n=[1732584193,4023233417,2562383102,271733878,3285377520];if("string"==typeof t){const e=unescape(encodeURIComponent(t));t=[];for(let n=0;n<e.length;++n)t.push(e.charCodeAt(n))}else Array.isArray(t)||(t=Array.prototype.slice.call(t));t.push(128);const r=t.length/4+2,s=Math.ceil(r/16),a=new Array(s);for(let e=0;e<s;++e){const n=new Uint32Array(16);for(let r=0;r<16;++r)n[r]=t[64*e+4*r]<<24|t[64*e+4*r+1]<<16|t[64*e+4*r+2]<<8|t[64*e+4*r+3];a[e]=n}a[s-1][14]=8*(t.length-1)/Math.pow(2,32),a[s-1][14]=Math.floor(a[s-1][14]),a[s-1][15]=8*(t.length-1)&4294967295;for(let t=0;t<s;++t){const r=new Uint32Array(80);for(let e=0;e<16;++e)r[e]=a[t][e];for(let t=16;t<80;++t)r[t]=O(r[t-3]^r[t-8]^r[t-14]^r[t-16],1);let s=n[0],o=n[1],i=n[2],c=n[3],l=n[4];for(let t=0;t<80;++t){const n=Math.floor(t/20),a=O(s,5)+$(n,o,i,c)+l+e[n]+r[t]>>>0;l=c,c=i,i=O(o,30)>>>0,o=s,s=a}n[0]=n[0]+s>>>0,n[1]=n[1]+o>>>0,n[2]=n[2]+i>>>0,n[3]=n[3]+c>>>0,n[4]=n[4]+l>>>0}return[n[0]>>24&255,n[0]>>16&255,n[0]>>8&255,255&n[0],n[1]>>24&255,n[1]>>16&255,n[1]>>8&255,255&n[1],n[2]>>24&255,n[2]>>16&255,n[2]>>8&255,255&n[2],n[3]>>24&255,n[3]>>16&255,n[3]>>8&255,255&n[3],n[4]>>24&255,n[4]>>16&255,n[4]>>8&255,255&n[4]]}(a),a[6]=15&a[6]|80,a[8]=63&a[8]|128,n){r=r||0;for(let t=0;t<16;++t)n[r+t]=a[t];return n}return function(t,e=0){return C[t[e+0]]+C[t[e+1]]+C[t[e+2]]+C[t[e+3]]+"-"+C[t[e+4]]+C[t[e+5]]+"-"+C[t[e+6]]+C[t[e+7]]+"-"+C[t[e+8]]+C[t[e+9]]+"-"+C[t[e+10]]+C[t[e+11]]+C[t[e+12]]+C[t[e+13]]+C[t[e+14]]+C[t[e+15]]}(a)}try{r.name="v5"}catch(t){}return r.DNS="6ba7b810-9dad-11d1-80b4-00c04fd430c8",r.URL="6ba7b811-9dad-11d1-80b4-00c04fd430c8",r}();function T(t){return B(t,B.URL)}class _{constructor(t,e,n){this.url=t,this.artist=e,this.title=n,this.uuid=T(t)}static fromObject(t){return new _(t.url,t.artist,t.title)}}class A{constructor(t,e,n,r,s,a,o,i){this.releaseItem=new _(a,t,e),this.label=n,this.date=r,this.tracks=s,this.tracksQty=s.length,this.image=o,this.keywords=i}get artist(){return this.releaseItem.artist}get url(){return this.releaseItem.url}get title(){return this.releaseItem.title}static fromBandcampData(t,e,n,r){const{artist:s,current:a,url:o}=t,{title:i,publish_date:c}=a,{keywords:l}=n,u=t.trackinfo.map((t=>new H(t.track_num,t.title,function(t){let e=t%60;return Math.floor(t/60).toString()+":"+("0",2,((n=e.toString()).length>=2?"":"0".repeat(2-n.length))+n);var n}(Math.trunc(t.duration))))),d=e.name;return new A(s,i,s===d?`Not On Label (${d} Self-released)`:d,new Date(c),u,o,r.big,l)}static fromBandcampSchema(t){const e=t.byArtist.name,n=t.name,r=t.publisher.name,s=new Date(t.datePublished),a=t.track.itemListElement.map((t=>{return new H(t.position,t.item.name,(e=t.item.duration,`${(/(\d+)H/.exec(e)||[])[1]||0}:${(/(\d+)M/.exec(e)||[])[1]||0}:${(/(\d+)S/.exec(e)||[])[1]||0}`));var e})),o=t.mainEntityOfPage,i=t.image,c=t.keywords;return new A(e,n,r,s,a,o,i,c)}toObject(){return{uuid:this.releaseItem.uuid,artist:this.releaseItem.artist,title:this.releaseItem.title,url:this.releaseItem.url,label:this.label,date:this.date.toISOString(),tracks:this.tracks,image:this.image,keywords:this.keywords}}static fromObject(t){if(!t.url||!t.tracks)throw new Error("Cannot create Release object from object",t);const e=t.tracks.map((t=>H.fromObject(t)));return new A(t.artist,t.title,t.label,new Date(t.date),e,t.url,t.image,t.keywords)}toMetadata(){return{version:L().version,format:{qty:this.tracksQty,fileType:"FLAC",description:"Album"},submissionNotes:(this,l(E.text.notes,{extension_url:E.extension_url,release_url:this.releaseItem.url}))}}}class H{constructor(t,e,n){this.num=t,this.title=e,this.duration=n}static fromObject(t){return new H(t.num,t.title,t.duration)}}function x(t){if(!t||0===t.length)return"";const e=Object.keys(t[0]),n=[e.join(",")];for(const r of t){const t=e.map((t=>r[t]));n.push(t.join(","))}return n.join("\n")}function D(e,n){const r=new Blob([e],{type:"text/csv"}),s=URL.createObjectURL(r),a=document.createElement("a");var o,i;a.href=s,a.download=`${o=n,(i=o,Array.from(i).map((e=>t[e]||e)).join("")).replace(/[^a-zA-Z0-9]/gi,"_").toLowerCase()}.csv`,a.click(),URL.revokeObjectURL(s)}function q(t,e){return t.hasAttribute(`data-${e}`)}function R(t,e,n=""){t.setAttribute(`data-${e}`,n)}function U(...t){t.forEach((t=>s(t)?U(...t):t.classList.remove("visually-hidden")))}function N(...t){t.forEach((t=>s(t)?N(...t):t.classList.add("visually-hidden")))}function P(...t){t.forEach((t=>s(t)?P(...t):t.disabled=!0))}function z(...t){t.forEach((t=>s(t)?z(...t):t.disabled=!1))}function G(t){var e=new MouseEvent("click",{bubbles:!0,cancelable:!0,view:window});return t.dispatchEvent(e),t}function V(t){return t.dispatchEvent(new Event("input")),t}function F(t){const e=document.createElement("div");return e.innerHTML=t.trim(),e.firstChild}const Y=chrome.storage.local;function K(t,e){const n=function(t){const e=[];return t.forEach((t=>e.push(T(t)))),e}(t);Y.get(n,(t=>{let n=Object.values(t).map((t=>A.fromObject(t)));a(e)&&e(n)}))}function Q(t,e){s(t)?t.forEach((t=>Q(t,e))):Y.remove(t,(()=>{chrome.runtime.lastError&&console.error(`Error clearing local storage item with key "${t}": ${chrome.runtime.lastError}`),a(e)&&e()}))}function Z(t){if(!r(t)&&!s(t))return document.createTextNode(t);const e=document.createElement("table");e.classList.add("table","table-sm","table-striped","table-bordered");for(const[a,o]of Object.entries(t)){const t=document.createElement("tr"),i=document.createElement("th"),c=document.createElement("td");i.classList.add("w-25"),c.classList.add("w-auto"),i.textContent=a,r(o)?c.appendChild(Z(o)):s(o)?c.innerHTML=o.map((t=>n(t)?t:Z(t).outerHTML)).join(", "):c.innerHTML=n(o)?o.replace(/[\r\n]+/g,"<br/>"):o,t.appendChild(i),t.appendChild(c),e.appendChild(t)}return e}function J(t,e){t.populateData(function(t){const e=[];return t.forEach((t=>{const n=t instanceof A?t.releaseItem:t,r=W(n.url,"box-arrow-up-right"),s=W(S(n.artist,n.title),"search");var a;e.push({title:`${n.artist} - ${n.title} ${r} ${s}`,value:n.url,id:(a=n.title,a.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,""))})})),e}(e))}function W(t,e){const n=document.createElement("a");return n.href=t,n.target="_blank",n.innerHTML=`<b2d-icon name="${e}"></b2d-icon>`,n.outerHTML}function X(t,e){!t instanceof HTMLElement||(t.style.backgroundImage=`url(${e})`)}function tt(t){return P(t),R(t,"original-content",t.innerHTML),t.innerHTML='\n  <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>\n  <span class="visually-hidden" role="status">Loading...</span>\n',t}function et(t){var e;return z(t),q(t,"original-content")&&(t.innerHTML=q(e=t,"original-content")?e.getAttribute("data-original-content"):undefined),t}function nt(t,e){const n=document.querySelector("#historyReleasesList");q(t,"buttons-initialized")||(function(t,e,n){const r=F('\n<button id="historyDataClearSelected" type="button" class="btn btn-danger" data-status-update title="Clear selected history">\n  <b2d-icon name="database-dash"></b2d-icon>\n</button>'),s=F('\n<button id="historyDataClear" type="button" class="btn btn-dark" title="Remove all items from the history" data-bs-toggle="modal" data-bs-target="#historyTabDeleteAllModal">\n  <b2d-icon name="database-x"></b2d-icon>\n</button>');n.addEventListener("click",(t=>{const n=t.target;tt(n),K(e.getSelectedValues(),(t=>{const e=t[0];D(x(t.map((t=>v.fromRelease(t).toCsvObject()))),`discogs-selected-releases-${e.artist}`),et(n)}))})),e.addStateButton(n),r.addEventListener("click",(()=>{Q(e.getSelectedValues(),(()=>{rt(e)}))})),t.querySelector("#historyTabDeleteAllModal_btnYes").addEventListener("click",(()=>{Y.clear(),rt(e)})),e.appendButton(r,s),e.addStatusElement(document.getElementById("selectedStatusInfo"),document.getElementById("viewedStatusInfo"))}(t,n,e),R(t,"buttons-initialized")),rt(n)}function rt(t){var e;e=e=>{J(t,e)},Y.get(null,(t=>{const n=[];for(const e in t)if(t.hasOwnProperty(e)||r(t[e]))try{n.push(A.fromObject(t[e]))}catch(t){continue}a(e)&&e(n)}))}function st(t){if(o(t))return;const e=t[0];D(x(t.map((t=>v.fromRelease(t).toCsvObject()))),t.length>1?`discogs-selected-releases-${e.artist}`:`discogs-releases-${e.artist}-${e.title}`)}function at(t,e,r,s,o){X(document.querySelector(".bg-image"),r);const i=t.querySelector("#releasesTabLIst");o.addEventListener("click",(async t=>{const e=t.target;tt(e);const n=i.getSelectedValues();!function(t,e){const n=function(t){const e={};return t.forEach((t=>{const n=T(t);e[n]=t})),e}(t),r=Object.keys(n);Y.get(r,(t=>{const s=Object.keys(t),o=r.filter((t=>!s.includes(t))).map((t=>n[t]));a(e)&&e(o)}))}(n,(t=>{(async function(t,e){const n=[];for(const r of t){const t=new Promise((t=>{chrome.tabs.create({url:r,active:!1},(n=>{e&&e(n),t(n)}))}));n.push(t)}return Promise.all(n)})(t,(t=>{chrome.scripting.executeScript({target:{tabId:t.id},func:ot}).then((()=>{}))})).then((()=>{setTimeout((()=>{K(n,(t=>{st(t),et(e)}))}),3e3)}))}))})),i.addStateButton(o).addStatusElement(document.getElementById("selectedStatusInfo"),document.getElementById("viewedStatusInfo"));const c=[];let l;var u,d;function h(t,e){chrome.tabs.sendMessage(t.id,{type:"releases-list-search",search:e})}e.forEach((t=>c.push(_.fromObject(t)))),J(i,c),i.searchInput.addEventListener("input",(()=>{const t=i.searchInput.value;l?h(l,t):k().then((e=>{l=e,h(l,t)}))})),u=i.searchInput,n(d=s)?u.value!==d&&(u.value=d,V(u)):V(u)}function ot(){setTimeout((()=>window.close()),1e3)}function it(t){let e=t.offsetHeight,n=parseInt(getComputedStyle(t).lineHeight);return Math.round(e/n)}function ct(t,e){e.addEventListener("click",(()=>{const e=document.getElementById("csvData");e.innerHTML="",t instanceof A&&function(t,e,n){const r=document.createElement("h2");r.classList.add("display-6"),r.innerText="Discogs CSV data",n.appendChild(r),n.appendChild(Z(e))}(0,I(t).toCsvObject(),e)}))}const lt=document.querySelector("console-command");const ut=document.getElementById("warningMessage-tab"),dt=document.getElementById("release-tab"),ht=document.getElementById("releases-tab"),ft=document.getElementById("csvData-tab"),mt=document.getElementById("history-tab"),gt=document.getElementById("downloadRelease"),pt=document.getElementById("downloadReleases"),yt=document.getElementById("downloadHistory"),bt=document.getElementById("discogsSearchArtist"),wt=document.getElementById("releases");async function vt(){k().then((t=>{chrome.tabs.sendMessage(t.id,{type:"getBandcampData"},(t=>{if(null==t||0===Object.keys(t).length||void 0===t.data)return P(dt,ft),N(ht),U(ut,pt),void G(ut);!function(t){const n="release"===t.type,r="list"===t.type;(n||r)&&(N(ut),async function(t){return fetch(t).then((t=>t.json())).then((t=>(d=t,d))).catch((t=>{d={}}))}(E.genres_url).then((r=>{(async function(t){return fetch(t).then((t=>t.json())).then((t=>(g=t,g))).catch((t=>{g={}}))})(E.keyword_mapping_url).then((r=>{n?function(t,n){N(ht),U(dt),G(dt);const r=A.fromObject(t);(function(t,e){lt.addCommand("log.release",(()=>{console.log(t)})),lt.addCommand("log.keywordsMapping",(()=>{console.log(e)}));const n=I(t);lt.addCommand("log.discogsCsvNotes",(()=>{console.log(n.notes)}))})(r,n),function(t,n,r,s){var a,i;!function(t,n){const r=t.querySelector("#release-artist"),s=t.querySelector("#release-title"),a=t.querySelector("#release-year"),o=t.querySelector(".release-content");X(document.querySelector(".bg-image"),n.image),r.innerHTML=n.releaseItem.artist,s.innerHTML=n.releaseItem.title,a.innerHTML=n.date.getFullYear();let i=it(r),c=it(s);r.classList.toggle("display-6",i>=3&&i<=5),t.classList.add("lines-a"+i+"-t"+c);const l=n.tracks.map((t=>`${t.num}. ${e(t.title)} (${u(t.duration)})`)).join("<br>");o.innerHTML=l}(t,n),s.href=S(n.releaseItem.artist,n.releaseItem.title),a=r,o(i=[n])?P(a):(z(a),a.addEventListener("click",(()=>st(i))))}(document.getElementById("release"),r,gt,bt),ct(r,ft)}(t.data,r):function(t){N(dt),U(ht),G(ht),at(wt,t.data,t.popup.imageSrc,t.popup.search,pt)}(t)}))})))}(t)}))}))}function Et(t){const e=L();t.querySelectorAll(".version").forEach((t=>{t.textContent=e.version}))}document.addEventListener("DOMContentLoaded",(function(){var t,e;lt.addCommand("log.storage",(()=>{console.log("B2D: Storage data"),Y.get(null,(t=>console.log(t)))})),dt.addEventListener("click",(()=>{N(pt,yt),U(gt),z(ft)})),ht.addEventListener("click",(()=>{N(gt,yt),U(pt),P(ft),wt.querySelector("releases-list").refreshStatus()})),mt.addEventListener("click",(()=>{N(gt,pt),U(yt),nt(document.getElementById("history"),yt)})),Et(document),vt(),t=t=>{document.querySelectorAll(".storage-size").forEach((e=>{e.textContent=function(t){if(0===t)return"0 Byte";const e=parseInt(Math.floor(Math.log(t)/Math.log(1024)));return Math.round(t/Math.pow(1024,e),2)+" "+["Bytes","KB","MB","GB","TB"][e]}(t),e.setAttribute("title",`Storage size (${t} bytes)`)}))},Y.getBytesInUse(null,t),e=t=>{Et(t.target)},document.querySelectorAll("external-content").forEach((t=>{t.addEventListener("externalContentLoaded",e)}))}))})();
//# sourceMappingURL=popup.js.map