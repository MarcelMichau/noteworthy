(this.webpackJsonpnoteworthy=this.webpackJsonpnoteworthy||[]).push([[0],{135:function(e,t,n){e.exports=n(276)},276:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),c=n(28),o=n.n(c),s=n(15),i=n.n(s),u=n(17),l=n(29),m=function(){var e="marcelmichau.github.io"===window.location.hostname?"https://marcelmichau.github.io/noteworthy":"".concat(window.location.protocol,"//").concat(window.location.host);window.location="".concat("https://accounts.spotify.com/authorize","?client_id=").concat("4b5e3eb3d3d643daa7f8bfd21f074eda","&response_type=token&redirect_uri=").concat(e,"&scope=user-library-read user-read-currently-playing user-modify-playback-state")},p=function(){var e=Object(u.a)(i.a.mark((function e(){var t,n,a;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return console.log("get user detail called"),"https://api.spotify.com/v1/me",t=localStorage.getItem("access_token"),e.next=5,fetch("https://api.spotify.com/v1/me",{headers:{Authorization:"Bearer ".concat(t)}});case 5:return n=e.sent,e.next=8,n.json();case 8:return a=e.sent,console.log(a),e.abrupt("return",a);case 11:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),f=function(){var e=Object(u.a)(i.a.mark((function e(){var t,n,a,r,c,o,s;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return console.log("get user artists called"),t="https://api.spotify.com/v1/me/tracks?limit=50",n=localStorage.getItem("access_token"),e.next=5,fetch(t,{headers:{Authorization:"Bearer ".concat(n)}});case 5:return a=e.sent,e.next=8,a.json();case 8:r=e.sent,t=r.next,console.log("next url",t),c=r.items;case 12:if(null===t){e.next=24;break}return e.next=15,fetch(t,{headers:{Authorization:"Bearer ".concat(n)}});case 15:return o=e.sent,e.next=18,o.json();case 18:s=e.sent,c=c.concat(s.items),t=s.next,console.log("next url",t),e.next=12;break;case 24:return e.abrupt("return",c);case 25:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),h=function(){var e=Object(u.a)(i.a.mark((function e(){var t,n,a;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return console.log("get currently playing called"),"https://api.spotify.com/v1/me/player/currently-playing",t=localStorage.getItem("access_token"),e.next=5,fetch("https://api.spotify.com/v1/me/player/currently-playing",{headers:{Authorization:"Bearer ".concat(t)}});case 5:if(200===(n=e.sent).status){e.next=8;break}return e.abrupt("return");case 8:return e.next=10,n.json();case 10:return a=e.sent,console.log(a),e.abrupt("return",a);case 13:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),d=function(){var e=Object(u.a)(i.a.mark((function e(t){var n,a,r;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return console.log("set playing track called"),"https://api.spotify.com/v1/me/player/play",n=localStorage.getItem("access_token"),e.next=5,fetch("https://api.spotify.com/v1/me/player/play",{method:"PUT",headers:{Authorization:"Bearer ".concat(n)},body:JSON.stringify({uris:[t.uri]})});case 5:return a=e.sent,e.next=8,a.text();case 8:return r=e.sent,e.abrupt("return",r);case 10:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),y=n(289),b=n(35),g=n(126),w=n(288),k=function(e){var t=e.isAuthorized,n=e.userData,a=e.currentlyPlaying,c=e.onLogin,o=e.onLogout;return(r.a.createElement(y.a,{inverted:!0,stackable:!0,fixed:"top"},r.a.createElement(y.a.Item,{header:!0,active:!0,style:{backgroundColor:"#1DB954"}},"noteworthy for Spotify"),r.a.createElement(y.a.Menu,{position:"right"},t&&r.a.createElement(r.a.Fragment,null,a&&a.item&&r.a.createElement(y.a.Item,null,r.a.createElement(b.a,{name:"play"})," ",a.item.artists[0].name," -"," ",a.item.name),n.id&&r.a.createElement(y.a.Item,null,r.a.createElement(g.a,{src:n.images[0].url,size:"mini",circular:!0}),n.display_name)),t&&r.a.createElement(y.a.Item,null,r.a.createElement(w.a,{onClick:o},"Logout")),!t&&r.a.createElement(y.a.Item,null,r.a.createElement(w.a,{onClick:c},"Login")))))},v=n(282),E={marginTop:"4em"},x=function(e){var t=e.children;return(r.a.createElement(v.a,{style:E},t))},j=n(287),O=n(283),_=n(291),S=n(290),I=n(284),z=n(286),B=n(57),L=n.n(B),A=n(82),C=function(e){var t=e.sort((function(e,t){return e.artists[0].name.localeCompare(t.artists[0].name)})),n=Object(A.groupBy)(t,(function(e){return e.artists[0].name}));return Object.keys(n).forEach((function(e){n[e]=Object(A.groupBy)(n[e].sort((function(e,t){return e.album.name.localeCompare(t.album.name)})),(function(e){return e.album.name}))})),n};var D=function(){var e=null!==localStorage.getItem("access_token"),t=Object(a.useState)(e),n=Object(l.a)(t,2),c=n[0],o=n[1],s=Object(a.useState)({}),y=Object(l.a)(s,2),g=y[0],w=y[1],v=Object(a.useState)({}),E=Object(l.a)(v,2),B=E[0],A=E[1],D=Object(a.useState)(0),T=Object(l.a)(D,2),F=T[0],J=T[1],M=Object(a.useState)(null),P=Object(l.a)(M,2),G=P[0],N=P[1],V=Object(a.useState)(!1),W=Object(l.a)(V,2),H=W[0],U=W[1];return Object(a.useEffect)((function(){window.location.hash&&o(function(){var e=window.location.hash.substr(1).split("&").reduce((function(e,t){var n=t.split("=");return e[n[0]]=n[1],e}),{});return console.log(e),localStorage.setItem("access_token",e.access_token),"marcelmichau.github.io"===window.location.hostname?window.location.href="".concat(window.location.origin,"/noteworthy"):window.location.href=window.location.origin,e}())}),[]),Object(a.useEffect)((function(){function e(){return(e=Object(u.a)(i.a.mark((function e(){var t;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,h();case 2:t=e.sent,N(t);case 4:case"end":return e.stop()}}),e)})))).apply(this,arguments)}c&&function(){e.apply(this,arguments)}()}),[c]),Object(a.useEffect)((function(){function e(){return(e=Object(u.a)(i.a.mark((function e(){var t;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,p();case 2:t=e.sent,w(t);case 4:case"end":return e.stop()}}),e)})))).apply(this,arguments)}c&&function(){e.apply(this,arguments)}()}),[c]),Object(a.useEffect)((function(){function e(){return(e=Object(u.a)(i.a.mark((function e(){var t,n;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return U(!0),e.next=3,L.a.length();case 3:if(!(e.sent>0)){e.next=12;break}return t=[],e.next=8,L.a.iterate((function(e,n,a){t=t.concat(e)}));case 8:J(t.length),A(C(t)),e.next=18;break;case 12:return e.next=14,f();case 14:(n=e.sent).forEach(function(){var e=Object(u.a)(i.a.mark((function e(t){return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,L.a.setItem(t.track.id,t.track);case 2:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()),J(n.length),A(C(n.map((function(e){return e.track}))));case 18:U(!1);case 19:case"end":return e.stop()}}),e)})))).apply(this,arguments)}c&&function(){e.apply(this,arguments)}()}),[c]),r.a.createElement(r.a.Fragment,null,r.a.createElement(k,{isAuthorized:c,userData:g,currentlyPlaying:G,onLogin:m,onLogout:function(){return function(e){localStorage.removeItem("access_token"),e(!1)}(o)}}),H&&r.a.createElement(j.a,{active:!0},r.a.createElement(O.a,null,"Loading Tracks...")),r.a.createElement(_.a,{basic:!0},c&&r.a.createElement(x,null,Object.keys(B).length>0&&r.a.createElement("div",null,r.a.createElement(S.a.Group,{widths:"two"},r.a.createElement(S.a,null,r.a.createElement(S.a.Value,null,Object.keys(B).length),r.a.createElement(S.a.Label,null,"Artists")),r.a.createElement(S.a,null,r.a.createElement(S.a.Value,null,F),r.a.createElement(S.a.Label,null,"Tracks"))),r.a.createElement(I.a,null),Object.keys(B).map((function(e){return r.a.createElement("div",{key:e},r.a.createElement("h3",null,e),r.a.createElement(z.a.Group,{divided:!0},Object.keys(B[e]).map((function(t){return r.a.createElement(z.a,{key:t},r.a.createElement("div",{className:"image"},r.a.createElement("img",{loading:"lazy",width:"300",height:"300",src:B[e][t][0].album.images[1].url,alt:t})),r.a.createElement(z.a.Content,null,r.a.createElement(z.a.Header,{as:"a"},t),r.a.createElement(z.a.Meta,null,B[e][t][0].album.release_date),r.a.createElement(z.a.Description,null,B[e][t].sort((function(e,t){return e.track_number-t.track_number})).map((function(e){return r.a.createElement("p",{key:e.id},r.a.createElement(b.a,{name:"play",onClick:Object(u.a)(i.a.mark((function t(){var n;return i.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,d(e);case 2:return t.next=4,h();case 4:n=t.sent,N(n);case 6:case"end":return t.stop()}}),t)}))),style:{cursor:"pointer"}})," ",e.track_number,") ",e.name," -"," ",function(e){var t=Math.floor(e/6e4),n=(e%6e4/1e3).toFixed(0);return 60===n?t+1+":00":t+":"+(n<10?"0":"")+n}(e.duration_ms))})))))}))),r.a.createElement(I.a,null))}))))))};n(275),Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(r.a.createElement(D,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[135,1,2]]]);
//# sourceMappingURL=main.4bab5227.chunk.js.map