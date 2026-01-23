const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/js/LoginModern-kzhkhOZr.js","assets/js/ui-vendor-DHD7BrAQ.js","assets/js/react-vendor-D59vU-yI.js","assets/js/Icon-DTTGVddR.js","assets/js/pdf-vendor-B6FxxLoX.js","assets/js/FarmerProfileSetup-XrY8W53G.js","assets/js/Toast-Bcp6iQ8K.js","assets/js/ProfileCompletion-DtuRXyEY.js","assets/js/FarmOwnerDashboard-COtNOCne.js","assets/js/useApi-BjMwUkOc.js","assets/js/ResourceSharing-BuodUavg.js","assets/js/ThemeToggle-RHIRq-53.js","assets/js/FloatingChatbot-DyPCxaXG.js","assets/js/AICropAdvisor-B_RJpshs.js","assets/js/FarmWorkerDashboard-DTY7U_X1.js","assets/js/BuyerDashboard-BLf4PWeS.js","assets/js/RenterDashboard-vzO9c62J.js","assets/js/AnalyticsDashboard-BbOn-X75.js","assets/js/chart-vendor-DBhFepP-.js","assets/js/DataManagement-Decl8wwq.js","assets/js/SupportPage-BwiPYqOq.js","assets/js/CropsPage-7Rk8VOaX.js","assets/js/FarmDocsPage-BYAoB5Ay.js","assets/js/FeaturesDashboard-CdgpnQJn.js"])))=>i.map(i=>d[i]);
import{j as e}from"./ui-vendor-DHD7BrAQ.js";import{a as t,b as r,N as s,r as o,c as a,d as i,B as n}from"./react-vendor-D59vU-yI.js";import{_ as l}from"./pdf-vendor-B6FxxLoX.js";var c;!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))t(e);new MutationObserver(e=>{for(const r of e)if("childList"===r.type)for(const e of r.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&t(e)}).observe(document,{childList:!0,subtree:!0})}function t(e){if(e.ep)return;e.ep=!0;const t=function(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),"use-credentials"===e.crossOrigin?t.credentials="include":"anonymous"===e.crossOrigin?t.credentials="omit":t.credentials="same-origin",t}(e);fetch(e.href,t)}}();var d=t;c=d.createRoot,d.hydrateRoot;class m extends r.Component{constructor(e){super(e),this.state={error:null}}static getDerivedStateFromError(e){return{error:e}}componentDidCatch(e,t){}render(){return this.state.error?e.jsxs("div",{className:"p-6 bg-red-50 text-red-800 rounded-lg shadow-md",children:[e.jsx("h3",{className:"font-bold mb-2",children:"An error occurred while rendering the component"}),e.jsx("div",{className:"text-sm mb-2",children:this.state.error.message}),e.jsxs("details",{className:"text-xs text-gray-700",children:[e.jsx("summary",{className:"cursor-pointer",children:"Stack trace"}),e.jsx("pre",{className:"whitespace-pre-wrap text-xs",children:this.state.error.stack})]})]}):this.props.children}}const u="agri_auth_session",p="agri_users";function f(e){localStorage.setItem(u,JSON.stringify(e))}function h(){const e=localStorage.getItem(u);if(!e)return null;try{return JSON.parse(e)}catch{return null}}function y(e){const t={...h()||{},...e};return f(t),t}function g(){localStorage.removeItem(u),window.location.replace("/login")}function x(){const e=localStorage.getItem(p);if(!e){const e=[{id:"demo-farmer",role:"farmer",name:"Demo Farmer",email:"farmer@demo.com",phone:"9876543210",passwordHash:j("password")},{id:"demo-worker",role:"worker",name:"Demo Worker",email:"worker@demo.com",phone:"9876543211",passwordHash:j("password")},{id:"demo-buyer",role:"buyer",name:"Demo Buyer",email:"buyer@demo.com",phone:"9876543212",passwordHash:j("password"),buyerAddressLine1:"Demo Address",buyerCity:"Demo City",buyerState:"Demo State",buyerPincode:"123456"},{id:"demo-renter",role:"renter",name:"Demo Renter",email:"renter@demo.com",phone:"9876543213",passwordHash:j("password"),businessName:"Demo Equipment Rental",businessAddress:"Demo Business Address",serviceRadiusKm:50}];return b(e),e}try{return JSON.parse(e)}catch{return[]}}function b(e){localStorage.setItem(p,JSON.stringify(e))}function j(e){let t=0;const r=e+"agri_demo_salt_2024";for(let s=0;s<r.length;s++){t=(t<<5)-t+r.charCodeAt(s),t&=t}return t=Math.abs(t),t^=t>>>16,t.toString(36)}function v(e){const t=x();if(t.find(t=>t.email&&e.email&&t.email.toLowerCase()===e.email.toLowerCase()))throw new Error("User already exists");const r=Date.now().toString(),s={...e,id:r,passwordHash:j(e.password)};b([s,...t]);const o={...s};return delete o.passwordHash,f(o),o}function _(e,t){const r=x().find(t=>t.email&&t.email.toLowerCase()===e.toLowerCase()||t.phone&&t.phone===e);if(!r)return null;if(r.passwordHash!==j(t))return null;const s={...r};return delete s.passwordHash,f(s),s}const w=({children:t,roles:r})=>{const o=h();return o?r&&!r.includes(o.role)?e.jsx(s,{to:"/login",replace:!0}):e.jsx(e.Fragment,{children:t}):e.jsx(s,{to:"/login",replace:!0})};let E,D,k,O={data:""},A=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,I=/\/\*[^]*?\*\/|  +/g,L=/\n+/g,P=(e,t)=>{let r="",s="",o="";for(let a in e){let i=e[a];"@"==a[0]?"i"==a[1]?r=a+" "+i+";":s+="f"==a[1]?P(i,a):a+"{"+P(i,"k"==a[1]?"":t)+"}":"object"==typeof i?s+=P(i,t?t.replace(/([^,])+/g,e=>a.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):a):null!=i&&(a=/^--/.test(a)?a:a.replace(/[A-Z]/g,"-$&").toLowerCase(),o+=P.p?P.p(a,i):a+":"+i+";")}return r+(t&&o?t+"{"+o+"}":o)+s},C={},N=e=>{if("object"==typeof e){let t="";for(let r in e)t+=r+N(e[r]);return t}return e};function S(e){let t=this||{},r=e.call?e(t.p):e;return((e,t,r,s,o)=>{let a=N(e),i=C[a]||(C[a]=(e=>{let t=0,r=11;for(;t<e.length;)r=101*r+e.charCodeAt(t++)>>>0;return"go"+r})(a));if(!C[i]){let t=a!==e?e:(e=>{let t,r,s=[{}];for(;t=A.exec(e.replace(I,""));)t[4]?s.shift():t[3]?(r=t[3].replace(L," ").trim(),s.unshift(s[0][r]=s[0][r]||{})):s[0][t[1]]=t[2].replace(L," ").trim();return s[0]})(e);C[i]=P(o?{["@keyframes "+i]:t}:t,r?"":"."+i)}let n=r&&C.g?C.g:null;return r&&(C.g=C[i]),l=C[i],c=t,d=s,(m=n)?c.data=c.data.replace(m,l):-1===c.data.indexOf(l)&&(c.data=d?l+c.data:c.data+l),i;var l,c,d,m})(r.unshift?r.raw?((e,t,r)=>e.reduce((e,s,o)=>{let a=t[o];if(a&&a.call){let e=a(r),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;a=t?"."+t:e&&"object"==typeof e?e.props?"":P(e,""):!1===e?"":e}return e+s+(null==a?"":a)},""))(r,[].slice.call(arguments,1),t.p):r.reduce((e,r)=>Object.assign(e,r&&r.call?r(t.p):r),{}):r,(e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||O})(t.target),t.g,t.o,t.k)}S.bind({g:1});let z=S.bind({k:1});function R(e,t){let r=this||{};return function(){let t=arguments;return function s(o,a){let i=Object.assign({},o),n=i.className||s.className;r.p=Object.assign({theme:D&&D()},i),r.o=/ *go\d+/.test(n),i.className=S.apply(r,t)+(n?" "+n:"");let l=e;return e[0]&&(l=i.as||e,delete i.as),k&&l[0]&&k(i),E(l,i)}}}var T=(e,t)=>(e=>"function"==typeof e)(e)?e(t):e,$=(()=>{let e=0;return()=>(++e).toString()})(),V=(()=>{let e;return()=>{if(void 0===e&&typeof window<"u"){let t=matchMedia("(prefers-reduced-motion: reduce)");e=!t||t.matches}return e}})(),F="default",H=(e,t)=>{let{toastLimit:r}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,r)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:s}=t;return H(e,{type:e.toasts.find(e=>e.id===s.id)?1:0,toast:s});case 3:let{toastId:o}=t;return{...e,toasts:e.toasts.map(e=>e.id===o||void 0===o?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let a=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+a}))}}},M=[],B={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},J={},q=(e,t=F)=>{J[t]=H(J[t]||B,e),M.forEach(([e,r])=>{e===t&&r(J[t])})},U=e=>Object.keys(J).forEach(t=>q(e,t)),W=(e=F)=>t=>{q(t,e)},K={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},Y=e=>(t,r)=>{let s=((e,t="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:(null==r?void 0:r.id)||$()}))(t,e,r);return W(s.toasterId||(e=>Object.keys(J).find(t=>J[t].toasts.some(t=>t.id===e)))(s.id))({type:2,toast:s}),s.id},Z=(e,t)=>Y("blank")(e,t);Z.error=Y("error"),Z.success=Y("success"),Z.loading=Y("loading"),Z.custom=Y("custom"),Z.dismiss=(e,t)=>{let r={type:3,toastId:e};t?W(t)(r):U(r)},Z.dismissAll=e=>Z.dismiss(void 0,e),Z.remove=(e,t)=>{let r={type:4,toastId:e};t?W(t)(r):U(r)},Z.removeAll=e=>Z.remove(void 0,e),Z.promise=(e,t,r)=>{let s=Z.loading(t.loading,{...r,...null==r?void 0:r.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let o=t.success?T(t.success,e):void 0;return o?Z.success(o,{id:s,...r,...null==r?void 0:r.success}):Z.dismiss(s),e}).catch(e=>{let o=t.error?T(t.error,e):void 0;o?Z.error(o,{id:s,...r,...null==r?void 0:r.error}):Z.dismiss(s)}),e};var G,Q,X,ee,te=(e,t="default")=>{let{toasts:r,pausedAt:s}=((e={},t=F)=>{let[r,s]=o.useState(J[t]||B),a=o.useRef(J[t]);o.useEffect(()=>(a.current!==J[t]&&s(J[t]),M.push([t,s]),()=>{let e=M.findIndex(([e])=>e===t);e>-1&&M.splice(e,1)}),[t]);let i=r.toasts.map(t=>{var r,s,o;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(r=e[t.type])?void 0:r.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(s=e[t.type])?void 0:s.duration)||(null==e?void 0:e.duration)||K[t.type],style:{...e.style,...null==(o=e[t.type])?void 0:o.style,...t.style}}});return{...r,toasts:i}})(e,t),a=o.useRef(new Map).current,i=o.useCallback((e,t=1e3)=>{if(a.has(e))return;let r=setTimeout(()=>{a.delete(e),n({type:4,toastId:e})},t);a.set(e,r)},[]);o.useEffect(()=>{if(s)return;let e=Date.now(),o=r.map(r=>{if(r.duration===1/0)return;let s=(r.duration||0)+r.pauseDuration-(e-r.createdAt);if(!(s<0))return setTimeout(()=>Z.dismiss(r.id,t),s);r.visible&&Z.dismiss(r.id)});return()=>{o.forEach(e=>e&&clearTimeout(e))}},[r,s,t]);let n=o.useCallback(W(t),[t]),l=o.useCallback(()=>{n({type:5,time:Date.now()})},[n]),c=o.useCallback((e,t)=>{n({type:1,toast:{id:e,height:t}})},[n]),d=o.useCallback(()=>{s&&n({type:6,time:Date.now()})},[s,n]),m=o.useCallback((e,t)=>{let{reverseOrder:s=!1,gutter:o=8,defaultPosition:a}=t||{},i=r.filter(t=>(t.position||a)===(e.position||a)&&t.height),n=i.findIndex(t=>t.id===e.id),l=i.filter((e,t)=>t<n&&e.visible).length;return i.filter(e=>e.visible).slice(...s?[l+1]:[0,l]).reduce((e,t)=>e+(t.height||0)+o,0)},[r]);return o.useEffect(()=>{r.forEach(e=>{if(e.dismissed)i(e.id,e.removeDelay);else{let t=a.get(e.id);t&&(clearTimeout(t),a.delete(e.id))}})},[r,i]),{toasts:r,handlers:{updateHeight:c,startPause:l,endPause:d,calculateOffset:m}}},re=z`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,se=z`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,oe=z`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,ae=R("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${re} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${se} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${oe} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,ie=z`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,ne=R("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${ie} 1s linear infinite;
`,le=z`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,ce=z`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,de=R("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${le} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${ce} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,me=R("div")`
  position: absolute;
`,ue=R("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,pe=z`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,fe=R("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${pe} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,he=({toast:e})=>{let{icon:t,type:r,iconTheme:s}=e;return void 0!==t?"string"==typeof t?o.createElement(fe,null,t):t:"blank"===r?null:o.createElement(ue,null,o.createElement(ne,{...s}),"loading"!==r&&o.createElement(me,null,"error"===r?o.createElement(ae,{...s}):o.createElement(de,{...s})))},ye=e=>`\n0% {transform: translate3d(0,${-200*e}%,0) scale(.6); opacity:.5;}\n100% {transform: translate3d(0,0,0) scale(1); opacity:1;}\n`,ge=e=>`\n0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}\n100% {transform: translate3d(0,${-150*e}%,-1px) scale(.6); opacity:0;}\n`,xe=R("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,be=R("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,je=o.memo(({toast:e,position:t,style:r,children:s})=>{let a=e.height?((e,t)=>{let r=e.includes("top")?1:-1,[s,o]=V()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[ye(r),ge(r)];return{animation:t?`${z(s)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${z(o)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},i=o.createElement(he,{toast:e}),n=o.createElement(be,{...e.ariaProps},T(e.message,e));return o.createElement(xe,{className:e.className,style:{...a,...r,...e.style}},"function"==typeof s?s({icon:i,message:n}):o.createElement(o.Fragment,null,i,n))});G=o.createElement,P.p=Q,E=G,D=X,k=ee;var ve=({id:e,className:t,style:r,onHeightUpdate:s,children:a})=>{let i=o.useCallback(t=>{if(t){let r=()=>{let r=t.getBoundingClientRect().height;s(e,r)};r(),new MutationObserver(r).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,s]);return o.createElement("div",{ref:i,className:t,style:r},a)},_e=S`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,we=({reverseOrder:e,position:t="top-center",toastOptions:r,gutter:s,children:a,toasterId:i,containerStyle:n,containerClassName:l})=>{let{toasts:c,handlers:d}=te(r,i);return o.createElement("div",{"data-rht-toaster":i||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...n},className:l,onMouseEnter:d.startPause,onMouseLeave:d.endPause},c.map(r=>{let i=r.position||t,n=((e,t)=>{let r=e.includes("top"),s=r?{top:0}:{bottom:0},o=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:V()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${t*(r?1:-1)}px)`,...s,...o}})(i,d.calculateOffset(r,{reverseOrder:e,gutter:s,defaultPosition:t}));return o.createElement(ve,{id:r.id,key:r.id,onHeightUpdate:d.updateHeight,className:r.visible?_e:"",style:n},"custom"===r.type?T(r.message,r):a?a(r):o.createElement(je,{toast:r,position:i}))}))},Ee=Z;function De(){return e.jsx(we,{position:"top-right",reverseOrder:!1,gutter:8,toastOptions:{duration:3e3,style:{background:"#363636",color:"#fff"},success:{duration:3e3,iconTheme:{primary:"#10b981",secondary:"#fff"}},error:{duration:4e3,iconTheme:{primary:"#ef4444",secondary:"#fff"}},loading:{iconTheme:{primary:"#3b82f6",secondary:"#fff"}}}})}const ke=r.lazy(()=>l(()=>import("./LoginModern-kzhkhOZr.js"),__vite__mapDeps([0,1,2,3,4]))),Oe=r.lazy(()=>l(()=>import("./FarmerProfileSetup-XrY8W53G.js"),__vite__mapDeps([5,1,2,3,6,4]))),Ae=r.lazy(()=>l(()=>import("./ProfileCompletion-DtuRXyEY.js"),__vite__mapDeps([7,1,2,3,4]))),Ie=r.lazy(()=>l(()=>import("./FarmOwnerDashboard-COtNOCne.js"),__vite__mapDeps([8,1,2,9,6,3,10,11,12,4]))),Le=r.lazy(()=>l(()=>import("./AICropAdvisor-B_RJpshs.js"),__vite__mapDeps([13,1,2,3,9,6,11,4]))),Pe=r.lazy(()=>l(()=>import("./FarmWorkerDashboard-DTY7U_X1.js"),__vite__mapDeps([14,1,2,9,12,4]))),Ce=r.lazy(()=>l(()=>import("./BuyerDashboard-BLf4PWeS.js"),__vite__mapDeps([15,1,2,9,12,4]))),Ne=r.lazy(()=>l(()=>import("./RenterDashboard-vzO9c62J.js"),__vite__mapDeps([16,1,2,10,3,6,11,12,4]))),Se=r.lazy(()=>l(()=>import("./AnalyticsDashboard-BbOn-X75.js"),__vite__mapDeps([17,1,2,18]))),ze=r.lazy(()=>l(()=>import("./DataManagement-Decl8wwq.js"),__vite__mapDeps([19,1,2,4]))),Re=r.lazy(()=>l(()=>import("./SupportPage-BwiPYqOq.js"),__vite__mapDeps([20,1,2,4]))),Te=r.lazy(()=>l(()=>import("./CropsPage-7Rk8VOaX.js"),__vite__mapDeps([21,1,2]))),$e=r.lazy(()=>l(()=>import("./FarmDocsPage-BYAoB5Ay.js"),__vite__mapDeps([22,1,2]))),Ve=r.lazy(()=>l(()=>import("./FeaturesDashboard-CdgpnQJn.js"),__vite__mapDeps([23,1,2,3,6])));function Fe(){return e.jsxs("div",{className:"min-h-screen bg-gradient-to-br from-green-50 via-white to-amber-50",children:[e.jsx(De,{}),e.jsx(o.Suspense,{fallback:e.jsx("div",{className:"text-center text-gray-600 p-8",children:"Loading…"}),children:e.jsx(m,{children:e.jsxs(a,{children:[e.jsx(i,{path:"/",element:e.jsx(s,{to:"/login",replace:!0})}),e.jsx(i,{path:"/login",element:e.jsx(ke,{})}),e.jsx(i,{path:"/support",element:e.jsx(Re,{})}),e.jsx(i,{path:"/crops",element:e.jsx(Te,{})}),e.jsx(i,{path:"/farm-docs",element:e.jsx($e,{})}),e.jsx(i,{path:"/farmer-profile-setup",element:e.jsx(w,{roles:["farmer"],children:e.jsx(Oe,{})})}),e.jsx(i,{path:"/profile-completion",element:e.jsx(w,{roles:["worker","buyer","renter"],children:e.jsx(Ae,{})})}),e.jsx(i,{path:"/farm-owner",element:e.jsx(w,{children:e.jsx(Ie,{})})}),e.jsx(i,{path:"/crop-advisor",element:e.jsx(w,{children:e.jsx(Le,{})})}),e.jsx(i,{path:"/analytics",element:e.jsx(w,{children:e.jsx(Se,{})})}),e.jsx(i,{path:"/data-management",element:e.jsx(w,{children:e.jsx(ze,{})})}),e.jsx(i,{path:"/farm-worker",element:e.jsx(w,{roles:["worker"],children:e.jsx(Pe,{})})}),e.jsx(i,{path:"/buyer",element:e.jsx(w,{roles:["buyer"],children:e.jsx(Ce,{})})}),e.jsx(i,{path:"/renter",element:e.jsx(w,{roles:["renter"],children:e.jsx(Ne,{})})}),e.jsx(i,{path:"/features",element:e.jsx(w,{children:e.jsx(Ve,{})})}),e.jsx(i,{path:"*",element:e.jsx(s,{to:"/login",replace:!0})})]})})})]})}const He=r.createContext({locale:"en",t:e=>e,setLocale:()=>{}});function Me({children:t}){const[s,o]=r.useState(localStorage.getItem("locale")||"en"),[a,i]=r.useState({}),n=r.useCallback(e=>{localStorage.setItem("locale",e),o(e)},[]);r.useEffect(()=>{(async function(e){const t=`/src/i18n/${e}.yml`,r=await fetch(t);if(!r.ok)return{};const s=(await r.text()).split(/\r?\n/),o={};for(const a of s){const e=a.trim();if(!e||e.startsWith("#"))continue;const t=e.indexOf(":");if(-1===t)continue;const r=e.slice(0,t).trim(),s=e.slice(t+1).trim().replace(/^"|"$/g,"");r&&(o[r]=s)}return o})(s).then(i).catch(()=>i({}))},[s]);const l=r.useCallback(e=>a[e]||e,[a]);return e.jsx(He.Provider,{value:{locale:s,t:l,setLocale:n},children:t})}function Be(){return r.useContext(He)}c(document.getElementById("root")).render(e.jsx(o.StrictMode,{children:e.jsx(n,{children:e.jsx(Me,{children:e.jsx(Fe,{})})})}));export{y as a,g as b,h as g,_ as l,v as r,f as s,Be as u,Ee as z};
