import{a as E,S as X}from"./assets/vendor-4ycomzgc.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))n(o);new MutationObserver(o=>{for(const a of o)if(a.type==="childList")for(const c of a.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&n(c)}).observe(document,{childList:!0,subtree:!0});function s(o){const a={};return o.integrity&&(a.integrity=o.integrity),o.referrerPolicy&&(a.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?a.credentials="include":o.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(o){if(o.ep)return;o.ep=!0;const a=s(o);fetch(o.href,a)}})();const d={headerBtnOpenMenu:document.querySelector(".header-button-menu"),headerBtnCloseMenu:document.querySelector(".button-close"),mobileMenu:document.querySelector(".menu-drive"),mobileLinks:document.querySelectorAll(".header-mobile-nav-link"),menuLogoLink:document.querySelector(".menu-drive .header-link-logo"),desktopLinks:document.querySelectorAll(".header-list a"),headerNav:document.querySelector(".header-list")},O=()=>{d.mobileMenu.classList.toggle("is-open"),document.body.classList.toggle("no-scroll")};d.headerBtnOpenMenu&&d.headerBtnOpenMenu.addEventListener("click",O);d.headerBtnCloseMenu&&d.headerBtnCloseMenu.addEventListener("click",O);d.mobileLinks.length>0&&d.mobileLinks.forEach(e=>{e.addEventListener("click",O)});d.menuLogoLink&&d.menuLogoLink.addEventListener("click",O);d.desktopLinks.length>0&&(d.desktopLinks.forEach(e=>{e.addEventListener("click",function(t){d.desktopLinks.forEach(s=>{s.classList.remove("is-active")}),t.currentTarget.classList.add("is-active")})}),document.addEventListener("click",function(e){d.headerNav.contains(e.target)||d.desktopLinks.forEach(s=>{s.classList.remove("is-active")})}));async function P(){try{return(await E.get("https://sound-wave.b.goit.study/api/artists")).data.artists}catch(e){console.error("Помилка отримання артистів:",e)}}function Q(e){let t=e.length,s;for(;t!==0;)s=Math.floor(Math.random()*t),t--,[e[t],e[s]]=[e[s],e[t]];return e}P().then(e=>{const t=document.getElementById("colLeft"),s=document.getElementById("colRight");if(!e||e.length===0)return;const o=Q([...e]).slice(0,6);o.slice(0,3).forEach(a=>{const c=document.createElement("img");c.src=a.strArtistThumb,c.className="hero-img",t.appendChild(c)}),o.slice(3,6).forEach(a=>{const c=document.createElement("img");c.src=a.strArtistThumb,c.className="hero-img",s.appendChild(c)})});const U="https://sound-wave.b.goit.study",F=8;async function Z(e=1,t={}){const s={limit:F,page:e,...t};try{return(await E.get(`${U}/api/artists`,{params:s})).data}catch(n){throw n}}async function W(){try{const t=(await E.get(`${U}/api/genres`)).data;return Array.isArray(t)?t.map(s=>typeof s=="string"?s:typeof s=="object"&&s!==null&&(s.name||s.genre||s.title)||String(s)):typeof t=="object"&&t!==null?Object.values(t).map(s=>typeof s=="string"?s:typeof s=="object"&&s!==null&&(s.name||s.genre||s.title)||String(s)):[]}catch(e){return console.error("Error fetching genres:",e),[]}}const y="/bcon_78_Vonels/assets/sprite-D7DqdrPg.svg";function ee(e){const t=Math.floor(e/1e3),s=Math.floor(t/60),n=t%60;return`${s}:${n.toString().padStart(2,"0")}`}function te(e,t){return!e&&!t?"Information missing":t?`${e} - ${t}`:`${e}-present`}function se(){const e=document.querySelector(".loader");e&&(e.style.display="block")}function ne(){const e=document.querySelector(".loader");e&&(e.style.display="none")}function oe(e,t=500){e||(e="Information missing");const s=e.length>t,n=e.slice(0,t);return`
    <span id="bio-text">${s?n:e}</span>
    ${s?`<button id="bio-toggle" class="bio-toggle-btn">
              <svg class="modal-icon" width="20" height="20">
                <use href="${y}#icon-dots-horizontal"></use>
              </svg>
           </button>`:""}
  `}function ie(e){const t=document.querySelector("#bio-toggle"),s=document.querySelector("#bio-text");if(!t)return;let n=!1;t.addEventListener("click",()=>{n=!n,n?(s.textContent=e,t.innerHTML=`
        <svg class="modal-icon" width="20" height="20">
          <use href="${y}#icon-modal-up"></use>
        </svg>`):(s.textContent=e.slice(0,250),t.innerHTML=`
        <svg class="modal-icon" width="20" height="20">
          <use href="${y}#icon-dots-horizontal"></use>
        </svg>`)})}const re=E.create({baseURL:"https://sound-wave.b.goit.study/api"});async function ae(e){try{se();const t=document.querySelector(".modal-overlay"),s=document.querySelector(".modal");document.body.classList.add("modal-open"),s.innerHTML="",t.classList.add("is-open");const{data:n}=await re.get(`/artists/${e}/albums`);ce(n)}catch(t){console.error("Error loading artist:",t)}finally{ne()}}let m=1;const I=8;let N=[];function ce(e){const{strArtistThumb:t,strArtist:s,intFormedYear:n,intDiedYear:o,genres:a,strGender:c,intMembers:i,strCountry:r,strBiographyEN:l,albumsList:u}=e;N=u||[],m=1;const p=document.querySelector(".modal"),z=(a==null?void 0:a.map(K=>`<span>${K}</span>`).join(" "))||"";p.innerHTML=`
    <button class="btn-exit" type="button">
      <svg class="modal-icon-exit" width="20" height="20">
        <use href="${y}#icon-close"></use>
      </svg>
    </button>

    <h1 class="actor-name">${s}</h1>

    <div class="actor">
      <div class="actor-img-wrapper" style="position:relative;">
        <img class="actor-img" src="${t}" alt="${s}" />
      </div>

      <ul class="actor-info">
        <div class="actor-info-container">
          <li><h2>Years active</h2><p>${te(n,o)}</p></li>
          <li><h2>Sex</h2><p>${c||"Information missing"}</p></li>
        </div>

        <div class="actor-info-container">
          <li><h2>Members</h2><p>${i||"Information missing"}</p></li>
          <li><h2>Country</h2><p>${r||"Information missing"}</p></li>
        </div>

        <li><h2>Biography</h2>${oe(l)}</li>
        <li class="actor-cards">${z}</li>
      </ul>
    </div>

    <div class="albums">
      <h2>Albums</h2>
      <div class="albums-cards" id="albums-container"></div>
      <div class="pagination" id="pagination"></div>
    </div>
  `,ie(l),pe();const J=p.querySelector(".actor-img-wrapper");ue(J,u),V(!0)}function V(e){const t=(m-1)*I,s=t+I,n=N.slice(t,s),o=document.querySelector("#albums-container");o.innerHTML=le(n),de(),e||document.querySelector(".albums").scrollIntoView({behavior:"smooth"})}function le(e){return e.map(t=>{var n;const s=((n=t.tracks)==null?void 0:n.map(o=>`
        <li class="track">
          <span class="title">${o.strTrack}</span>
          <span class="time">${ee(o.intDuration)}</span>
          ${o.movie?`<a href="${o.movie}" class="yt-btn" target="_blank">
                    <svg class="modal-icon-yt" width="20" height="20">
                      <use href="${y}#icon-YouTube"></use>
                    </svg>
                </a>`:""}
        </li>`).join(""))||"<li>No tracks found</li>";return`
        <div class="album-card">
          <h3>${t.strAlbum}</h3>
          <div class="table-header">
            <span>Track</span>
            <span>Time</span>
            <span>Link</span>
          </div>
          <ul class="track-list">${s}</ul>
        </div>
      `}).reduce((t,s,n)=>(n%2===0?t.push(`<div class="albums-thumb">${s}`):t[t.length-1]+=s+"</div>",t),[]).join("")}function de(){const e=Math.ceil(N.length/I),t=document.querySelector("#pagination"),s=3;let n=`<button class="page-btn" data-move="-1" ${m===1?"disabled":""}>←</button>`,o=Math.max(m-2,1),a=Math.min(o+s-1,e);a-o+1<s&&(o=Math.max(a-s+1,1)),o>1&&(n+='<button class="page-btn" data-page="1">1</button><span style="padding:0 4px;">...</span>');for(let c=o;c<=a;c++)n+=`<button class="page-btn ${c===m?"active-page":""}" data-page="${c}">${c}</button>`;a<e&&(n+=`<span style="padding:0 4px;">...</span><button class="page-btn" data-page="${e}">${e}</button>`),n+=`<button class="page-btn" data-move="1" ${m===e?"disabled":""}>→</button>`,t.innerHTML=n,t.onclick=c=>{const i=c.target.closest(".page-btn");if(!i||i.disabled)return;const r=i.dataset.page,l=i.dataset.move;r&&(m=Number(r)),l&&(m+=Number(l)),V(!1)}}function ue(e,t){var c,i,r;if(!e)return;const s=(r=(i=(c=t==null?void 0:t[0])==null?void 0:c.tracks)==null?void 0:i.find(l=>l.movie))==null?void 0:r.movie;if(!s)return;const n=a(s);if(!n)return;e.querySelector(".actor-img");const o=document.createElement("iframe");o.style.position="absolute",o.style.top=0,o.style.left=0,o.style.width="100%",o.style.height="100%",o.style.border="none",o.style.display="none",e.appendChild(o),setTimeout(()=>{o.src=n,o.style.display="block"},5e3),e.addEventListener("mouseleave",()=>{o.src="",o.style.display="none"});function a(l){const u=l.match(/v=([^&]+)/)||l.match(/youtu\.be\/([^?]+)/),p=u?u[1]:null;return p?`https://www.youtube.com/embed/${p}?autoplay=1&mute=1&controls=1`:null}}function pe(){const e=document.querySelector(".modal-overlay"),t=document.querySelector(".btn-exit");function s(){e.classList.remove("is-open"),document.body.classList.remove("modal-open")}t.addEventListener("click",s),e.addEventListener("click",n=>{n.target===e&&s()}),document.addEventListener("keydown",n=>{n.key==="Escape"&&s()})}const A=document.querySelector(".artists-list"),v=document.querySelector(".artists-loader"),h=document.querySelector(".pagination");function fe(){v==null||v.classList.remove("is-hidden")}function me(){v==null||v.classList.add("is-hidden")}function C(){A&&(A.innerHTML="")}function ge(e){return!Array.isArray(e)||e.length===0?"":`<div class="artist-genres">${e.map(s=>`<span class="genre-tag">${s}</span>`).join("")}</div>`}function he(e){const t=e.map(s=>{const n=s.strBiographyEN||"";return`
        <li class="artist-card">
          <img 
            class="img-card"
            src="${s.strArtistThumb||""}" 
            alt="${s.strArtist||"Artist Photo"}" 
            loading="lazy"
            data-artist-id="${s._id}"
          >

          ${ge(s.genres)}

          <h3 class="artist-name">${s.strArtist}</h3>

          ${n?`<p class="artist-short-info">${n}</p>`:""}
          
          <button
            type="button"
            class="learn-more-btn"
            data-artist-id="${s._id}"
          >
            Learn More
            <svg class="model-open-btm-icon" width="8" height="14">
              <use href="${y}#icon-con"></use>
            </svg>
          </button>
        </li>
      `}).join("");A&&(A.innerHTML=t),document.addEventListener("click",s=>{if(s.target.classList.contains("learn-more-btn")||s.target.classList.contains("img-card")){const n=s.target.dataset.artistId;ae(n)}})}function f(e,t,s,n){const o=e===s?" active":"",a=t==="..."?" pagination-dots":"",c=t==="..."||t==="Prev"&&s===1||t==="Next"&&s===n?" disabled":"";return`
    <button 
      class="paginationBtn${o}${a}${c}" 
      data-page="${e}"
      ${c?"disabled":""}
    >
      ${t}
    </button>
  `}function be(e,t){if(!h)return;h.innerHTML="";let s="";if(s+=f(e-1,"←",e,t),t<=5)for(let n=1;n<=t;n++)s+=f(n,String(n),e,t);else s+=f(1,"1",e,t),s+=f(2,"2",e,t),s+=f(3,"3",e,t),e>4&&e<t-2&&(s+='<span class="pagination-dots">...</span>'),e>3&&e<t-2&&(s+=f(e,String(e),e,t)),e<t-3&&(s+='<span class="pagination-dots">...</span>'),s+=f(t,String(t),e,t);s+=f(e+1,"→",e,t),h.innerHTML=s}function _(){h&&(h.innerHTML="")}function ve(e){h&&h.addEventListener("click",t=>{var o;const s=t.target.closest(".paginationBtn");if(!s||s.classList.contains("disabled"))return;const n=Number(s.dataset.page);isNaN(n)||(e(n),(o=document.querySelector(".section-subtitle"))==null||o.scrollIntoView({behavior:"smooth"}))})}let b=1,x=0,q="",B="",S="";function w(){return{filtersToggleBtn:document.querySelector(".filters-toggle-btn"),filtersPanel:document.querySelector(".filters-panel"),genreListMobile:document.querySelector(".genre-list"),sortListMobile:document.querySelector(".sort-list"),searchInput:document.getElementById("artist-search"),searchInputDesktop:document.getElementById("artist-search-desktop"),resetBtn:document.querySelectorAll(".reset-btn"),emptyState:document.querySelector(".empty-state"),resetFiltersBtn:document.querySelector(".reset-filters-btn"),sortOptionsDesktop:document.querySelector(".sort-options-desktop"),genreOptionsDesktop:document.querySelector(".genre-options-desktop"),filterDropdownBtns:document.querySelectorAll(".filter-dropdown-btn"),filterGroupHeaders:document.querySelectorAll(".filter-group-header")}}async function ye(){const e=w(),t=await W();e.genreOptionsDesktop&&(e.genreOptionsDesktop.innerHTML='<li class="filter-option-item active" data-genre="">All Genres</li>',t.forEach(s=>{const n=document.createElement("li");n.className="filter-option-item",n.textContent=s,n.setAttribute("data-genre",s),e.genreOptionsDesktop.appendChild(n)})),e.genreListMobile&&(e.genreListMobile.innerHTML='<li class="dropdown-item" data-genre="">All Genres</li>',t.forEach(s=>{const n=document.createElement("li");n.className="dropdown-item",n.textContent=s,n.setAttribute("data-genre",s),e.genreListMobile.appendChild(n)}))}function Le(){const e=w();if(e.sortListMobile){const t=e.sortListMobile.querySelector('.sort-item[data-sort=""]');t&&t.classList.add("active")}if(e.sortOptionsDesktop){const t=e.sortOptionsDesktop.querySelector('.filter-option-item[data-sort=""]');t&&t.classList.add("active")}}async function g(e=1){const t=w();t.emptyState&&t.emptyState.classList.add("is-hidden"),fe();const s={};q&&(s.genre=q),S&&(s.name=S),B&&(s.sortName=B==="name_asc"?"asc":"desc");try{const n=await Z(e,s),o=n.artists||[],a=n.totalArtists||0;return x=Math.ceil(a/F),b=e,C(),o.length===0&&e===1?(t.emptyState&&t.emptyState.classList.remove("is-hidden"),_()):(he(o),be(e,x)),{artists:o,totalArtists:a}}catch(n){return console.error("Error fetching artists:",n),C(),t.emptyState&&t.emptyState.classList.remove("is-hidden"),_(),{artists:[],totalArtists:0}}finally{me()}}function G(){const e=w();if(q="",B="",S="",b=1,e.searchInput&&(e.searchInput.value=""),e.searchInputDesktop&&(e.searchInputDesktop.value=""),[e.sortListMobile,e.sortOptionsDesktop].forEach(t=>{if(!t)return;t.querySelectorAll(".sort-item, .filter-option-item").forEach(n=>{n.classList.remove("active")});const s=t.querySelector('[data-sort=""]');s&&s.classList.add("active")}),e.genreOptionsDesktop){e.genreOptionsDesktop.querySelectorAll(".filter-option-item").forEach(s=>s.classList.remove("active"));const t=e.genreOptionsDesktop.querySelector('[data-genre=""]');t&&t.classList.add("active")}g(1)}function ke(){var o,a,c;const e=w();function t(i){q=i,e.genreOptionsDesktop&&e.genreOptionsDesktop.querySelectorAll(".filter-option-item").forEach(r=>{r.classList.toggle("active",r.getAttribute("data-genre")===i)}),e.genreListMobile&&e.genreListMobile.querySelectorAll(".dropdown-item").forEach(r=>{r.classList.toggle("active",r.getAttribute("data-genre")===i)}),b=1,g(1)}function s(i){B=i,e.sortOptionsDesktop&&e.sortOptionsDesktop.querySelectorAll(".filter-option-item").forEach(r=>{r.classList.toggle("active",r.getAttribute("data-sort")===i)}),e.sortListMobile&&e.sortListMobile.querySelectorAll(".sort-item").forEach(r=>{r.classList.toggle("active",r.getAttribute("data-sort")===i)}),b=1,g(1)}function n(i,r){if(!i)return;let l;i.addEventListener("input",()=>{clearTimeout(l),l=setTimeout(()=>{S=i.value.trim(),r&&(r.value=i.value),b=1,g(1)},500)}),i.addEventListener("keypress",u=>{u.key==="Enter"&&(clearTimeout(l),S=i.value.trim(),r&&(r.value=i.value),b=1,g(1))})}e.genreOptionsDesktop&&e.genreOptionsDesktop.addEventListener("click",i=>{const r=i.target.closest(".filter-option-item");r&&t(r.getAttribute("data-genre")||"")}),e.genreListMobile&&e.genreListMobile.addEventListener("click",i=>{const r=i.target.closest(".dropdown-item");r&&t(r.getAttribute("data-genre")||"")}),e.sortOptionsDesktop&&e.sortOptionsDesktop.addEventListener("click",i=>{const r=i.target.closest(".filter-option-item");r&&s(r.getAttribute("data-sort")||"")}),e.sortListMobile&&e.sortListMobile.addEventListener("click",i=>{const r=i.target.closest(".sort-item");r&&s(r.getAttribute("data-sort")||"")}),n(e.searchInput,e.searchInputDesktop),n(e.searchInputDesktop,e.searchInput),((o=e.resetBtn)==null?void 0:o.length)>0&&e.resetBtn.forEach(i=>i.addEventListener("click",G)),e.resetFiltersBtn&&e.resetFiltersBtn.addEventListener("click",G),e.filtersToggleBtn&&e.filtersPanel&&(e.filtersToggleBtn.addEventListener("click",i=>{i.stopPropagation();const r=e.filtersPanel.classList.contains("is-open");e.filtersPanel.classList.toggle("is-open",!r),e.filtersToggleBtn.classList.toggle("is-open",!r)}),document.addEventListener("click",i=>{!i.target.closest(".filters-panel")&&!i.target.closest(".filters-toggle-btn")&&(e.filtersPanel.classList.remove("is-open"),e.filtersToggleBtn.classList.remove("is-open"))})),(a=e.filterGroupHeaders)==null||a.forEach(i=>{i.addEventListener("click",()=>{var l;const r=(l=i.closest(".filter-group"))==null?void 0:l.querySelector(".filter-group-content");r&&r.classList.toggle("is-hidden")})}),(c=e.filterDropdownBtns)==null||c.forEach(i=>{i.addEventListener("click",r=>{r.stopPropagation();const l=i.closest(".filter-dropdown"),u=l==null?void 0:l.querySelector(".filter-dropdown-content");document.querySelectorAll(".filter-dropdown-content").forEach(p=>{p!==u&&p.classList.remove("is-open")}),u&&u.classList.toggle("is-open")})}),document.addEventListener("click",i=>{i.target.closest(".filter-dropdown")||document.querySelectorAll(".filter-dropdown-content").forEach(r=>{r.classList.remove("is-open")})}),ve(g)}async function Se(){try{ke(),await ye(),Le(),await g(1)}catch(e){console.error("Error initializing filters:",e)}}Se();document.addEventListener("DOMContentLoaded",()=>{const e=document.querySelector(".read-more-about"),t=document.querySelector(".read-more-modal"),s=document.querySelector(".close-button-about");e.addEventListener("click",()=>{t.classList.add("is-open")}),s.addEventListener("click",()=>{t.classList.remove("is-open")}),t.addEventListener("click",n=>{n.target===t&&t.classList.remove("is-open")}),document.addEventListener("keydown",n=>{n.key==="Escape"&&t.classList.remove("is-open")})});const M=window.$,T=document.querySelector(".submit-modal"),L=document.querySelector(".submit-feedback"),Ee=document.querySelector(".submit-button_modal"),k=document.querySelector(".submit-form"),j="project-feedbacks";function $e(){L&&L.classList.add("is-open"),T&&(T.classList.add("is-open"),document.body.style.overflow="hidden")}function H(){L&&L.classList.remove("is-open"),T&&(T.classList.remove("is-open"),document.body.style.overflow="")}Ee.addEventListener("click",H);L.addEventListener("click",e=>{e.target===L&&H()});M(document).ready(()=>{M("#user-rating-input").raty({starType:"img",number:5,path:"https://cdnjs.cloudflare.com/ajax/libs/raty/2.7.1/images",score:0,click:e=>{M("#rating-score").val(e)}}),k.addEventListener("submit",e=>{e.preventDefault();const t=k.username.value.trim(),s=k.message.value.trim(),n=Number(k["rating-score"].value);if(!t||!s||n===0){alert("Please, fill the fields and choose a rating");return}const o={id:Date.now().toString(),name:t,message:s,rating:n},a=JSON.parse(localStorage.getItem(j))||[];a.push(o),localStorage.setItem(j,JSON.stringify(a)),k.reset(),M("#user-rating-input").raty("score",0),document.querySelector("#rating-score").value=0,H()})});const we="https://sound-wave.b.goit.study",Me=`${we}/api/feedbacks`,D=document.querySelector(".swiper-wrapper"),R=document.querySelector(".feedback-submit-btn");function Ae(e){new X(".feedback-slider",{slidesPerView:1,loop:!0,spaceBetween:30,navigation:{nextEl:".feedback-next-btn",prevEl:".feedback-prev-btn"},pagination:{el:".feedback-pagination",clickable:!0,type:"custom",renderCustom:function(t,s,n){let a="";const c=Math.min(n,3);for(let i=1;i<=c;i++){let r="swiper-pagination-bullet";i===(s%c||c)&&(r+=" swiper-pagination-bullet-active"),a+=`<span class="${r}" aria-label="Go to slide ${i}"></span>`}return a}}})}async function Y(){var e;if(!D){console.error("Swiper wrapper element not found.");return}try{const s=((e=(await E.get(Me)).data)==null?void 0:e.data)||[];D.innerHTML=s.slice(0,10).map((n,o)=>`
        <div class="swiper-slide feedback-card">
          <div id="star-${o}" class="star-rating-container"></div>
          <p class="feedback-text">"${n.descr}"</p>
          <p class="feedback-author">${n.name}</p>
        </div>
      `).join(""),s.forEach((n,o)=>{const a=Math.round(typeof n.rating=="number"?n.rating:0);$(`#star-${o}`).raty({score:a,readOnly:!0,starType:"i"})}),Ae(s.length)}catch(t){console.error("Помилка при оновленні відгуків:",t),D.innerHTML='<p class="error-message">Не вдалося завантажити відгуки. Спробуйте пізніше.</p>'}}window.updateFeedbacks=Y;R&&R.addEventListener("click",$e);Y();
//# sourceMappingURL=index.js.map
