(()=>{"use strict";function t(t){return Array.isArray(t)}function e(t){return"function"==typeof t}function r(t){return t.replace(/[\u200B-\u200D\uFEFF\u200E\u200F\u202A-\u202E]|&lrm;/g,"")}const n="album",s="artists",i="community",o="merch",a="music",c="track",l="video",u="unknown";class d{constructor(t){this.value=t}isAlbum=()=>this.value===n;isArtists=()=>this.value===s;isCommunity=()=>this.value===i;isMerch=()=>this.value===o;isMusic=()=>this.value===a;isTrack=()=>this.value===c;isVideo=()=>this.value===l;isUnknow=()=>this.value===u}class m{constructor(){this.url=window.location.href}detect=()=>{const t=this;let e=u;return t.isAlbum()?e=n:t.isArtists()?e=s:t.isCommunity()?e=i:t.isMusic()?e=a:t.isMerch()?e=o:t.isTrack()?e=c:t.isVideo()&&(e=l),new d(e)};isAlbum=()=>this.url.includes("/album/");isArtists=()=>this.url.includes("/artists/")||!!document.querySelector(".artists-grid");isCommunity=()=>this.url.includes("/community/");isMerch=()=>this.url.includes("/merch/");isMusic=()=>this.url.includes("/music/")||!!document.querySelector("#music-grid");isTrack=()=>this.url.includes("/track/");isVideo=()=>this.url.includes("/video/")}const h="This draft was created via CSV upload and Bandcamp To Discogs Google Chrome extension {extension_url}\n\nRelease url: {release_url}",f=[];for(let t=0;t<256;++t)f.push((t+256).toString(16).slice(1));const p=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i,g=function(t){if(!function(t){return"string"==typeof t&&p.test(t)}(t))throw TypeError("Invalid UUID");let e;const r=new Uint8Array(16);return r[0]=(e=parseInt(t.slice(0,8),16))>>>24,r[1]=e>>>16&255,r[2]=e>>>8&255,r[3]=255&e,r[4]=(e=parseInt(t.slice(9,13),16))>>>8,r[5]=255&e,r[6]=(e=parseInt(t.slice(14,18),16))>>>8,r[7]=255&e,r[8]=(e=parseInt(t.slice(19,23),16))>>>8,r[9]=255&e,r[10]=(e=parseInt(t.slice(24,36),16))/1099511627776&255,r[11]=e/4294967296&255,r[12]=e>>>24&255,r[13]=e>>>16&255,r[14]=e>>>8&255,r[15]=255&e,r};function b(t,e,r,n){switch(t){case 0:return e&r^~e&n;case 1:case 3:return e^r^n;case 2:return e&r^e&n^r&n}}function w(t,e){return t<<e|t>>>32-e}const y=function(t,e,r){function n(t,e,r,n){var s;if("string"==typeof t&&(t=function(t){t=unescape(encodeURIComponent(t));const e=[];for(let r=0;r<t.length;++r)e.push(t.charCodeAt(r));return e}(t)),"string"==typeof e&&(e=g(e)),16!==(null===(s=e)||void 0===s?void 0:s.length))throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");let i=new Uint8Array(16+t.length);if(i.set(e),i.set(t,e.length),i=function(t){const e=[1518500249,1859775393,2400959708,3395469782],r=[1732584193,4023233417,2562383102,271733878,3285377520];if("string"==typeof t){const e=unescape(encodeURIComponent(t));t=[];for(let r=0;r<e.length;++r)t.push(e.charCodeAt(r))}else Array.isArray(t)||(t=Array.prototype.slice.call(t));t.push(128);const n=t.length/4+2,s=Math.ceil(n/16),i=new Array(s);for(let e=0;e<s;++e){const r=new Uint32Array(16);for(let n=0;n<16;++n)r[n]=t[64*e+4*n]<<24|t[64*e+4*n+1]<<16|t[64*e+4*n+2]<<8|t[64*e+4*n+3];i[e]=r}i[s-1][14]=8*(t.length-1)/Math.pow(2,32),i[s-1][14]=Math.floor(i[s-1][14]),i[s-1][15]=8*(t.length-1)&4294967295;for(let t=0;t<s;++t){const n=new Uint32Array(80);for(let e=0;e<16;++e)n[e]=i[t][e];for(let t=16;t<80;++t)n[t]=w(n[t-3]^n[t-8]^n[t-14]^n[t-16],1);let s=r[0],o=r[1],a=r[2],c=r[3],l=r[4];for(let t=0;t<80;++t){const r=Math.floor(t/20),i=w(s,5)+b(r,o,a,c)+l+e[r]+n[t]>>>0;l=c,c=a,a=w(o,30)>>>0,o=s,s=i}r[0]=r[0]+s>>>0,r[1]=r[1]+o>>>0,r[2]=r[2]+a>>>0,r[3]=r[3]+c>>>0,r[4]=r[4]+l>>>0}return[r[0]>>24&255,r[0]>>16&255,r[0]>>8&255,255&r[0],r[1]>>24&255,r[1]>>16&255,r[1]>>8&255,255&r[1],r[2]>>24&255,r[2]>>16&255,r[2]>>8&255,255&r[2],r[3]>>24&255,r[3]>>16&255,r[3]>>8&255,255&r[3],r[4]>>24&255,r[4]>>16&255,r[4]>>8&255,255&r[4]]}(i),i[6]=15&i[6]|80,i[8]=63&i[8]|128,r){n=n||0;for(let t=0;t<16;++t)r[n+t]=i[t];return r}return function(t,e=0){return f[t[e+0]]+f[t[e+1]]+f[t[e+2]]+f[t[e+3]]+"-"+f[t[e+4]]+f[t[e+5]]+"-"+f[t[e+6]]+f[t[e+7]]+"-"+f[t[e+8]]+f[t[e+9]]+"-"+f[t[e+10]]+f[t[e+11]]+f[t[e+12]]+f[t[e+13]]+f[t[e+14]]+f[t[e+15]]}(i)}try{n.name="v5"}catch(t){}return n.DNS="6ba7b810-9dad-11d1-80b4-00c04fd430c8",n.URL="6ba7b811-9dad-11d1-80b4-00c04fd430c8",n}();function v(t){return y(t,y.URL)}class S{#t;#e;#r;constructor(t,e,r){this.#t=t,this.#e=e,this.#r=r}get value(){return this.toString()}get date(){return this.toDate()}toString(){return new Intl.DateTimeFormat("en",{hour12:!1,hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(this.toDate())}toDate(){const t=new Date(0);return t.setHours(this.#t),t.setMinutes(this.#e),t.setSeconds(this.#r),t}static fromString(t){if(!/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(t))throw new Error("Invalid time format. Please use HH:MM:SS.");const[e,r,n]=t.split(":");return new S(parseInt(e,10),parseInt(r,10),parseInt(n,10))}static fromDuration(t){const e=(/(\d+)H/.exec(t)||[])[1]||0,r=(/(\d+)M/.exec(t)||[])[1]||0,n=(/(\d+)S/.exec(t)||[])[1]||0;return new S(parseInt(e,10),parseInt(r,10),parseInt(n,10))}}const A=S;class I{constructor(t,e,r){this.url=t,this.artist=e,this.title=r,this.uuid=v(t)}static fromObject(t){return new I(t.url,t.artist,t.title)}}class k{releaseItem;label;published;modified;tracks;tracksQty;image;keywords;constructor(t,e,r,n,s,i,o,a,c){this.releaseItem=new I(o,t,e),this.label=r,this.published=n,this.modified=s,this.tracks=i,this.tracksQty=i.length,this.image=a,this.keywords=c}get artist(){return this.releaseItem.artist}get url(){return this.releaseItem.url}get title(){return this.releaseItem.title}toStorageObject(){return{uuid:this.releaseItem.uuid,artist:this.releaseItem.artist,title:this.releaseItem.title,url:this.releaseItem.url,label:this.label,published:this.published.toISOString(),modified:this.modified.toISOString(),tracks:this.tracks.map((t=>t.toStorageObject())),image:this.image,keywords:this.keywords}}static fromStorageObject(t){if(!t.url||!t.tracks)throw new Error("Cannot create Release object from object",t);const e=t.tracks.map((t=>M.fromStorageObject(t)));if(!t.published&&!t.date)throw new Error("Missing published or date property");if(!t.modified&&!t.date)throw new Error("Missing published or date property");return new k(t.artist,t.title,t.label,new Date(t.published??t.date),new Date(t.modified??t.date),e,t.url,t.image,t.keywords)}toMetadata(){return{version:chrome.runtime.getManifest().version,format:{qty:this.tracksQty,fileType:"FLAC",description:"Album"},submissionNotes:(this,function(t,e){for(const r in e)e.hasOwnProperty(r)&&(t=t.replace(`{${r}}`,e[r]));return t}(h,{extension_url:"https://chrome.google.com/webstore/detail/bandcamp-to-discogs-b2d/hipnkehalkffbdjnbbeoefmoondaciok",release_url:this.releaseItem.url}))}}}class M{num;title;time;constructor(t,e,r){this.num=t,this.title=e,this.time=r}toStorageObject(){return{num:this.num,title:this.title,time:this.time.value}}static fromStorageObject(t){return new M(t.num,t.title,A.fromString(t.time||t.duration))}}function E(t,e,r=void 0){return function(t,e){return t.hasAttribute(`data-${e}`)}(t,e)?t.getAttribute(`data-${e}`):r}function D(t,e){return function(t){return"string"==typeof t}(e)?(t.value!==e&&(t.value=e,C(t)),t):(C(t),t)}function C(t){return t.dispatchEvent(new Event("input")),t}function q(t){const e=document.createElement("div");return e.innerHTML=t.trim(),e.firstChild}function $(){const t=[];return document.querySelectorAll("#music-grid .music-grid-item").forEach((e=>{const n=function(t){let e=t.querySelector(".artist-override")?.innerText;e||(e=document.querySelector("#band-name-location .title").innerText),e=function(t,e){const r=" -\n".replace(/[-/\\^$*+?.()|[\]{}]/g,"\\$&"),n=new RegExp(`^[${r}]+|[${r}]+$`,"g");return t.replace(n,"")}(e),e=r(e);const n=r(t.querySelector(".title").innerText.split("\n")[0]),s=t.querySelector("a").getAttribute("href");return{artist:e,title:n,url:("/"===s[0]?window.location.origin:"")+s,item_id:E(t,"item-id")}}(e);t.push(n)})),t}const j=chrome.storage.local;function O(t,r,n){const s=v(t);j.get([s],(t=>{if(i=t[s],"[object Object]"===Object.prototype.toString.call(i))try{const n=k.fromStorageObject(t[s]);e(r)&&r(n)}catch(e){console.log("B2D: Broken storage data for release",t[s]),R(s)}else console.log("B2D: Release data doesn't exists",s),e(n)&&n(s);var i}))}function R(r,n){t(r)?r.forEach((t=>R(t,n))):j.remove(r,(()=>{chrome.runtime.lastError&&console.error(`Error clearing local storage item with key "${r}": ${chrome.runtime.lastError}`),e(n)&&n()}))}function B(){const t=function(t){const e=t.byArtist.name,r=t.name,n=t.publisher.name,s=new Date(t.datePublished),i=new Date(t.dateModified),o=t.track.itemListElement.map((t=>new M(t.position,t.item.name,A.fromDuration(t.item.duration)))),a=t.mainEntityOfPage,c=t.image,l=t.keywords;return new k(e,r,n,s,i,o,a,c,l)}(function(){const t=document.querySelector('script[type="application/ld+json"]');return t?JSON.parse(t.textContent):null}());!function(t){O(window.location.href,null,(e=>{!function(t){const e=function(t){return v(t.releaseItem.url)}(t);j.set({[e]:t.toStorageObject()},(()=>{console.log("B2D: Release data was saved in the local storage")}))}(t)}))}(t),function(t){chrome.runtime.onMessage.addListener(((e,r,n)=>("getBandcampData"===e.type&&n({type:"release",data:t.toStorageObject()}),!0)))}(t)}!function(){const e=(new m).detect();e.isMusic()?(window.B2D=window.B2D||{},window.B2D.pageReleases=$(),chrome.runtime.onMessage.addListener(((t,e,r)=>("getBandcampData"===t.type&&r({type:"list",data:window.B2D.pageReleases,popup:{imageSrc:document.querySelector(".band-photo").src,search:document.querySelector("#b2dArtistFilter").value}}),!0))),function(){let e=document.querySelector("#music-grid"),r=new Isotope(e,{itemSelector:".music-grid-item",layoutMode:"fitRows"});const n=function(){const e=window.B2D||{};return t(r=e.pageReleases)&&0!==r.length||(e.pageReleases=$()),e.pageReleases;var r}();n.forEach((t=>{!function(t,e,r=""){t.setAttribute(`data-${e}`,r)}(e.querySelector('[data-item-id="'+t.item_id+'"]'),"filter-artist",(t.artist+" - "+t.title).toLowerCase())}));const s=function(t){let e=q('<div class="b2d-widget">\n  <label for="b2dArtistFilter">Artist / Album:</label>\n  <input list="artist-filter-data" id="b2dArtistFilter" name="artist-filter" />\n</div>');const r=function(t){let e=[],r=[],n=[];return t.forEach((t=>{if(function(t,e){for(const e of["V/A"])if(t.includes(e))return!0;return!1}(t.artist))r.push(t.artist);else{const n=(e=/[,/+•|]| Vs | & +/,t.artist.split(e).map((t=>t.trim())).filter((t=>""!==t)));r.push(...n)}var e})),r.sort(),e.push(...function(t){const e=new Map,r=new Map,n=[];for(const n of t){const t=n.toLowerCase();r.has(t)||r.set(t,n),e.set(t,(e.get(t)||0)+1)}for(const[t,s]of r){const r=e.get(t);r>1?n.push(`${s} (${r})`):n.push(s)}return n}(r)),t.forEach((t=>n.push(t.artist+" - "+t.title))),n.sort(),e.push(...n),[...new Set(e)]}(t),n=function(t,e){const r=document.createElement("datalist");return r.id="artist-filter-data",t.forEach((t=>{const e=document.createElement("option");e.value=t,r.appendChild(e)})),r}(r);return e.append(n),e}(n),i=q('<div class="b2d-widget-container"></div>'),o=function(t){return q(`<div class="b2d-albumAmount b2d-widget" title="The amount of releases on the page">\nReleases: <span class="b2d-visible">${t.length}</span> / <span class="b2d-total">${t.length}</span>\n</div>`)}(n);i.append(s),i.append(o),document.querySelector(".leftMiddleColumns").prepend(i),function(t,e,r){const n=t.querySelector("#b2dArtistFilter");n.addEventListener("input",(()=>{let t=n.value.replace(/\s*\([^)]*\)/,"");n.value=t,t=t.toLowerCase();const s=t?`[data-filter-artist*="${t}"]`:"*";e.arrange({filter:s}),r.querySelector(".b2d-visible").innerHTML=e.getFilteredItemElements().length,window.scrollBy(0,1),window.scrollBy(0,-1)})),chrome.runtime.onMessage.addListener(((t,e,r)=>{"releases-list-search"===t.type&&D(n,t.search)}));const s=document.querySelector(".leftMiddleColumns .label-band-selector-container");if(s){let t=function(t,e,r){const n=t.querySelectorAll(".bands-menu-title span");for(const t of n)if(t.textContent.includes("artists"))return t;return null}(s);t||(t=s.querySelector(".bands-menu-title span.name")),t&&function(t,e,r=1e3){let n=t.textContent;setInterval((()=>{const r=t.textContent;r!==n&&(e(r),n=r)}),r)}(t,(t=>{"artists"===t&&(t=""),D(n,t)}),500)}}(s,r,o),console.log("B2D: Isotope setuped correctly")}()):e.isAlbum()&&B(),function(t){const e=document.createElement("link");e.rel="stylesheet",e.href=t,document.head.appendChild(e)}(chrome.runtime.getURL("src/bandcamp/styles.css"))}()})();
//# sourceMappingURL=bandcamp-content.js.map