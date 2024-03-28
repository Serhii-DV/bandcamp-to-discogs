(()=>{"use strict";function t(t){return"function"==typeof t}function e(t){return t.replace(/[\u200B-\u200D\uFEFF\u200E\u200F\u202A-\u202E]|&lrm;/g,"")}const n="album",r="artists",s="community",i="merch",o="music",a="track",c="video",l="unknown";class u{constructor(t){this.value=t}isAlbum=()=>this.value===n;isArtists=()=>this.value===r;isCommunity=()=>this.value===s;isMerch=()=>this.value===i;isMusic=()=>this.value===o;isTrack=()=>this.value===a;isVideo=()=>this.value===c;isUnknow=()=>this.value===l}class d{constructor(){this.url=window.location.href}detect=()=>{const t=this;let e=l;return t.isAlbum()?e=n:t.isArtists()?e=r:t.isCommunity()?e=s:t.isMusic()?e=o:t.isMerch()?e=i:t.isTrack()?e=a:t.isVideo()&&(e=c),new u(e)};isAlbum=()=>this.url.includes("/album/");isArtists=()=>this.url.includes("/artists/")||!!document.querySelector(".artists-grid");isCommunity=()=>this.url.includes("/community/");isMerch=()=>this.url.includes("/merch/");isMusic=()=>this.url.includes("/music/")||!!document.querySelector("#music-grid");isTrack=()=>this.url.includes("/track/");isVideo=()=>this.url.includes("/video/")}const m="This draft was created via CSV upload and Bandcamp To Discogs Google Chrome extension {extension_url}\n\nRelease url: {release_url}",h=[];for(let t=0;t<256;++t)h.push((t+256).toString(16).slice(1));const f=/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i,p=function(t){if(!function(t){return"string"==typeof t&&f.test(t)}(t))throw TypeError("Invalid UUID");let e;const n=new Uint8Array(16);return n[0]=(e=parseInt(t.slice(0,8),16))>>>24,n[1]=e>>>16&255,n[2]=e>>>8&255,n[3]=255&e,n[4]=(e=parseInt(t.slice(9,13),16))>>>8,n[5]=255&e,n[6]=(e=parseInt(t.slice(14,18),16))>>>8,n[7]=255&e,n[8]=(e=parseInt(t.slice(19,23),16))>>>8,n[9]=255&e,n[10]=(e=parseInt(t.slice(24,36),16))/1099511627776&255,n[11]=e/4294967296&255,n[12]=e>>>24&255,n[13]=e>>>16&255,n[14]=e>>>8&255,n[15]=255&e,n};function g(t,e,n,r){switch(t){case 0:return e&n^~e&r;case 1:case 3:return e^n^r;case 2:return e&n^e&r^n&r}}function b(t,e){return t<<e|t>>>32-e}const w=function(t,e,n){function r(t,e,n,r){var s;if("string"==typeof t&&(t=function(t){t=unescape(encodeURIComponent(t));const e=[];for(let n=0;n<t.length;++n)e.push(t.charCodeAt(n));return e}(t)),"string"==typeof e&&(e=p(e)),16!==(null===(s=e)||void 0===s?void 0:s.length))throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");let i=new Uint8Array(16+t.length);if(i.set(e),i.set(t,e.length),i=function(t){const e=[1518500249,1859775393,2400959708,3395469782],n=[1732584193,4023233417,2562383102,271733878,3285377520];if("string"==typeof t){const e=unescape(encodeURIComponent(t));t=[];for(let n=0;n<e.length;++n)t.push(e.charCodeAt(n))}else Array.isArray(t)||(t=Array.prototype.slice.call(t));t.push(128);const r=t.length/4+2,s=Math.ceil(r/16),i=new Array(s);for(let e=0;e<s;++e){const n=new Uint32Array(16);for(let r=0;r<16;++r)n[r]=t[64*e+4*r]<<24|t[64*e+4*r+1]<<16|t[64*e+4*r+2]<<8|t[64*e+4*r+3];i[e]=n}i[s-1][14]=8*(t.length-1)/Math.pow(2,32),i[s-1][14]=Math.floor(i[s-1][14]),i[s-1][15]=8*(t.length-1)&4294967295;for(let t=0;t<s;++t){const r=new Uint32Array(80);for(let e=0;e<16;++e)r[e]=i[t][e];for(let t=16;t<80;++t)r[t]=b(r[t-3]^r[t-8]^r[t-14]^r[t-16],1);let s=n[0],o=n[1],a=n[2],c=n[3],l=n[4];for(let t=0;t<80;++t){const n=Math.floor(t/20),i=b(s,5)+g(n,o,a,c)+l+e[n]+r[t]>>>0;l=c,c=a,a=b(o,30)>>>0,o=s,s=i}n[0]=n[0]+s>>>0,n[1]=n[1]+o>>>0,n[2]=n[2]+a>>>0,n[3]=n[3]+c>>>0,n[4]=n[4]+l>>>0}return[n[0]>>24&255,n[0]>>16&255,n[0]>>8&255,255&n[0],n[1]>>24&255,n[1]>>16&255,n[1]>>8&255,255&n[1],n[2]>>24&255,n[2]>>16&255,n[2]>>8&255,255&n[2],n[3]>>24&255,n[3]>>16&255,n[3]>>8&255,255&n[3],n[4]>>24&255,n[4]>>16&255,n[4]>>8&255,255&n[4]]}(i),i[6]=15&i[6]|80,i[8]=63&i[8]|128,n){r=r||0;for(let t=0;t<16;++t)n[r+t]=i[t];return n}return function(t,e=0){return h[t[e+0]]+h[t[e+1]]+h[t[e+2]]+h[t[e+3]]+"-"+h[t[e+4]]+h[t[e+5]]+"-"+h[t[e+6]]+h[t[e+7]]+"-"+h[t[e+8]]+h[t[e+9]]+"-"+h[t[e+10]]+h[t[e+11]]+h[t[e+12]]+h[t[e+13]]+h[t[e+14]]+h[t[e+15]]}(i)}try{r.name="v5"}catch(t){}return r.DNS="6ba7b810-9dad-11d1-80b4-00c04fd430c8",r.URL="6ba7b811-9dad-11d1-80b4-00c04fd430c8",r}();function y(t){return w(t,w.URL)}class v{constructor(t,e,n){this.url=t,this.artist=e,this.title=n,this.uuid=y(t)}static fromObject(t){return new v(t.url,t.artist,t.title)}}class A{constructor(t,e,n,r,s,i,o,a){this.releaseItem=new v(i,t,e),this.label=n,this.date=r,this.tracks=s,this.tracksQty=s.length,this.image=o,this.keywords=a}get artist(){return this.releaseItem.artist}get url(){return this.releaseItem.url}get title(){return this.releaseItem.title}static fromBandcampData(t,e,n,r){const{artist:s,current:i,url:o}=t,{title:a,publish_date:c}=i,{keywords:l}=n,u=t.trackinfo.map((t=>new S(t.track_num,t.title,function(t){let e=t%60;return Math.floor(t/60).toString()+":"+("0",2,((n=e.toString()).length>=2?"":"0".repeat(2-n.length))+n);var n}(Math.trunc(t.duration))))),d=e.name;return new A(s,a,s===d?`Not On Label (${d} Self-released)`:d,new Date(c),u,o,r.big,l)}static fromBandcampSchema(t){const e=t.byArtist.name,n=t.name,r=t.publisher.name,s=new Date(t.datePublished),i=t.track.itemListElement.map((t=>new S(t.position,t.item.name,k.fromDuration(t.item.duration)))),o=t.mainEntityOfPage,a=t.image,c=t.keywords;return new A(e,n,r,s,i,o,a,c)}toObject(){return{uuid:this.releaseItem.uuid,artist:this.releaseItem.artist,title:this.releaseItem.title,url:this.releaseItem.url,label:this.label,date:this.date.toISOString(),tracks:this.tracks,image:this.image,keywords:this.keywords}}static fromObject(t){if(!t.url||!t.tracks)throw new Error("Cannot create Release object from object",t);const e=t.tracks.map((t=>S.fromObject(t)));return new A(t.artist,t.title,t.label,new Date(t.date),e,t.url,t.image,t.keywords)}toMetadata(){return{version:chrome.runtime.getManifest().version,format:{qty:this.tracksQty,fileType:"FLAC",description:"Album"},submissionNotes:(this,function(t,e){for(const n in e)e.hasOwnProperty(n)&&(t=t.replace(`{${n}}`,e[n]));return t}(m,{extension_url:"https://chrome.google.com/webstore/detail/bandcamp-to-discogs-b2d/hipnkehalkffbdjnbbeoefmoondaciok",release_url:this.releaseItem.url}))}}}class S{num;title;duration;constructor(t,e,n){this.num=t,this.title=e,this.duration=n}static fromObject(t){return new S(t.num,t.title,t.duration)}}class k{date;value;constructor(t,e,n){this.date=new Date(0),this.date.setHours(t),this.date.setMinutes(e),this.date.setSeconds(n),this.value=this.toString()}toString(){return new Intl.DateTimeFormat("en",{hour12:!1,hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(this.date)}static fromDuration(t){const e=(/(\d+)H/.exec(t)||[])[1]||0,n=(/(\d+)M/.exec(t)||[])[1]||0,r=(/(\d+)S/.exec(t)||[])[1]||0;return new k(parseInt(e,10),parseInt(n,10),parseInt(r,10))}}function I(t,e,n=void 0){return function(t,e){return t.hasAttribute(`data-${e}`)}(t,e)?t.getAttribute(`data-${e}`):n}function M(t,e){return function(t){return"string"==typeof t}(e)?(t.value!==e&&(t.value=e,C(t)),t):(C(t),t)}function C(t){return t.dispatchEvent(new Event("input")),t}function D(t){const e=document.createElement("div");return e.innerHTML=t.trim(),e.firstChild}function E(){const t=[];return document.querySelectorAll("#music-grid .music-grid-item").forEach((n=>{const r=function(t){let n=t.querySelector(".artist-override")?.innerText;n||(n=document.querySelector("#band-name-location .title").innerText),n=function(t,e){const n=" -\n".replace(/[-/\\^$*+?.()|[\]{}]/g,"\\$&"),r=new RegExp(`^[${n}]+|[${n}]+$`,"g");return t.replace(r,"")}(n),n=e(n);const r=e(t.querySelector(".title").innerText.split("\n")[0]),s=t.querySelector("a").getAttribute("href");return{artist:n,title:r,url:("/"===s[0]?window.location.origin:"")+s,item_id:I(t,"item-id")}}(n);t.push(r)})),t}const q=chrome.storage.local;function B(){const e=function(){const t=document.querySelector('script[type="application/ld+json"]');return t?JSON.parse(t.textContent):null}(),n=A.fromBandcampSchema(e);!function(e){!function(e,n,r){const s=y(e);q.get([s],(e=>{if(i=e[s],"[object Object]"===Object.prototype.toString.call(i)){const r=A.fromObject(e[s]);t(n)&&n(r)}else console.log("B2D: Release data doesn't exists",s),t(r)&&r(s);var i}))}(window.location.href,null,(t=>{!function(t){const e=function(t){return y(t.releaseItem.url)}(t);q.set({[e]:t.toObject()},(()=>{console.log("B2D: Release data was saved in the local storage")}))}(e)}))}(n),function(t){chrome.runtime.onMessage.addListener(((e,n,r)=>("getBandcampData"===e.type&&r({type:"release",data:t.toObject()}),!0)))}(n)}function R(){window.B2D=window.B2D||{},window.B2D.pageReleases=E(),chrome.runtime.onMessage.addListener(((t,e,n)=>("getBandcampData"===t.type&&n({type:"list",data:window.B2D.pageReleases,popup:{imageSrc:document.querySelector(".band-photo").src,search:document.querySelector("#b2dArtistFilter").value}}),!0))),function(){let t=document.querySelector("#music-grid"),e=new Isotope(t,{itemSelector:".music-grid-item",layoutMode:"fitRows"});const n=function(){const t=window.B2D||{};return function(t){return Array.isArray(t)}(e=t.pageReleases)&&0!==e.length||(t.pageReleases=E()),t.pageReleases;var e}();n.forEach((e=>{!function(t,e,n=""){t.setAttribute(`data-${e}`,n)}(t.querySelector('[data-item-id="'+e.item_id+'"]'),"filter-artist",(e.artist+" - "+e.title).toLowerCase())}));const r=function(t){let e=D('<div class="b2d-widget">\n  <label for="b2dArtistFilter">Artist / Album:</label>\n  <input list="artist-filter-data" id="b2dArtistFilter" name="artist-filter" />\n</div>');const n=function(t){let e=[],n=[],r=[];return t.forEach((t=>{if(function(t,e){for(const e of["V/A"])if(t.includes(e))return!0;return!1}(t.artist))n.push(t.artist);else{const r=(e=/[,/+•|]| Vs | & +/,t.artist.split(e).map((t=>t.trim())).filter((t=>""!==t)));n.push(...r)}var e})),n.sort(),e.push(...function(t){const e=new Map,n=new Map,r=[];for(const r of t){const t=r.toLowerCase();n.has(t)||n.set(t,r),e.set(t,(e.get(t)||0)+1)}for(const[t,s]of n){const n=e.get(t);n>1?r.push(`${s} (${n})`):r.push(s)}return r}(n)),t.forEach((t=>r.push(t.artist+" - "+t.title))),r.sort(),e.push(...r),[...new Set(e)]}(t),r=function(t,e){const n=document.createElement("datalist");return n.id="artist-filter-data",t.forEach((t=>{const e=document.createElement("option");e.value=t,n.appendChild(e)})),n}(n);return e.append(r),e}(n),s=D('<div class="b2d-widget-container"></div>'),i=function(t){return D(`<div class="b2d-albumAmount b2d-widget" title="The amount of releases on the page">\nReleases: <span class="b2d-visible">${t.length}</span> / <span class="b2d-total">${t.length}</span>\n</div>`)}(n);s.append(r),s.append(i),document.querySelector(".leftMiddleColumns").prepend(s),function(t,e,n){const r=t.querySelector("#b2dArtistFilter");r.addEventListener("input",(()=>{let t=r.value.replace(/\s*\([^)]*\)/,"");r.value=t,t=t.toLowerCase();const s=t?`[data-filter-artist*="${t}"]`:"*";e.arrange({filter:s}),n.querySelector(".b2d-visible").innerHTML=e.getFilteredItemElements().length,window.scrollBy(0,1),window.scrollBy(0,-1)})),chrome.runtime.onMessage.addListener(((t,e,n)=>{"releases-list-search"===t.type&&M(r,t.search)}));const s=document.querySelector(".leftMiddleColumns .label-band-selector-container");if(s){let t=function(t,e,n){const r=t.querySelectorAll(".bands-menu-title span");for(const t of r)if(t.textContent.includes("artists"))return t;return null}(s);t||(t=s.querySelector(".bands-menu-title span.name")),t&&function(t,e,n=1e3){let r=t.textContent;setInterval((()=>{const n=t.textContent;n!==r&&(e(n),r=n)}),n)}(t,(t=>{"artists"===t&&(t=""),M(r,t)}),500)}}(r,e,i),console.log("B2D: Isotope setuped correctly")}()}!function(){const t=(new d).detect();t.isMusic()?R():t.isAlbum()&&B(),function(t){const e=document.createElement("link");e.rel="stylesheet",e.href=t,document.head.appendChild(e)}(chrome.runtime.getURL("src/bandcamp/styles.css"))}()})();
//# sourceMappingURL=bandcamp-content.js.map