(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{138:function(e,t,n){},139:function(e,t,n){e.exports={loader:"Loading_loader__1an9P",spin:"Loading_spin__1FEQz"}},189:function(e,t,n){"use strict";n.r(t);var a=n(1),l=n(27),c=(n(138),n(45)),r=n(20),o=n(25),s=n(33),u=n.n(s),i=n(41),m=n(31),b=n(24),d=n(32),E=n(59),f=n(98),v=n(39),p=n(139),j=n.n(p),O=function(e){return a.createElement("div",{className:j.a.loader},"")},g=Object(a.lazy)(function(){return n.e(11).then(n.bind(null,191))}),h=Object(l.b)(function(e){return{data:Object(b.k)(e),displayedColumns:Object(b.q)(e),columns:Object(b.a)(e),groupBy:Object(b.c)(e)}},{onColumnsChange:m.l,setTableGroupBy:m.m})(Object(a.memo)(Object(v.a)(function(e){var t=e.onColumnsChange,l=e.columns,c=e.setTableGroupBy,o=e.data,s=e.displayedColumns,m=Object(d.b)(),b=Object(r.a)(m,2),v=b[0],p=b[1],j=Object(a.useCallback)(function(e){if(e instanceof Array){var n=e.map(function(e){return e.value?e.value:""});t(n)}},[t]),h=Object(a.useCallback)(Object(i.a)(u.a.mark(function e(){var t,a,l;return u.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Promise.all([n.e(10),n.e(6)]).then(n.t.bind(null,187,7));case 2:t=e.sent,a=t.utils.book_new(),l=t.utils.json_to_sheet(o),t.utils.book_append_sheet(a,l,"keyrier-json"),t.writeFile(a,"export.xlsx");case 7:case"end":return e.stop()}},e)})),[o]),y=Object(a.useCallback)(function(e){return c([e.target.value])},[c]);if(l.length<=0)return a.createElement(a.Fragment,null);var N=l.map(function(e){return{value:e,label:e}});return a.createElement("div",{className:"row"},a.createElement("div",{className:"col"},a.createElement(E.a,{className:"float-left",color:"primary",block:!0,onClick:p},v?"Hide advanced options":"Advanced options"),a.createElement(f.a,{isOpen:v},a.createElement("select",{className:"form-control-lg form-control",name:"select",id:"groupingSelect",onChange:y},a.createElement("option",{key:"Group by..."},"Group by..."),s.map(function(e){return a.createElement("option",{key:e},e)})),a.createElement(E.a,{color:"success",onClick:h},"Export to Excel (.xlsx)"),a.createElement(a.Suspense,{fallback:a.createElement(O,{componentName:"ReactSelect"})},a.createElement(g,{options:N,value:s.map(function(e){return{value:e,label:e}}),isMulti:!0,onChange:j})))))}))),y=n(156),N=n(128),k=n(129),C=n(122),w=n.n(C),T=(n(140),n(47)),S=Object(a.lazy)(function(){return n.e(31).then(n.t.bind(null,186,7))}),x=Object(a.lazy)(function(){return n.e(32).then(n.bind(null,188))}),A=function(e,t){return e&&t&&Object(o.a)(Object(o.b)(t[e.id]),e.value)},z=Object(l.b)(function(e){return{data:Object(b.k)(e),displayedColumns:Object(b.q)(e),columns:Object(b.a)(e),groupBy:Object(b.c)(e)}})(Object(v.a)(Object(a.memo)(function(e){var t=e.data,n=e.displayedColumns,l=e.groupBy,s=Object(a.useState)(null),u=Object(r.a)(s,2),i=u[0],m=u[1],b=Object(a.useCallback)(function(e,t,n,a){return{onClick:function(e,a){t&&t.aggregated?a():e&&n&&n.id&&t&&t.row&&m(t.row[n.id])}}},[m]),d=Object(a.useCallback)(function(){return m(null)},[m]);if(!t||!Array.isArray(t)||0===t.length||t.every(function(e){return null===e||void 0===e||"object"===typeof e&&0===Object.keys(e).length}))return a.createElement("div",null);var E=n.map(function(e){return{Aggregated:function(){return function(e){return e?e.value:""}},Cell:function(e){return null!==e&&void 0!==e?Object(o.b)(e.value):""},Header:e,headerClassName:"data-test-id-column-name",accessor:e,className:"text-center btn btn-link data-test-id-cell-data"}});return a.createElement(a.Fragment,null,a.createElement("div",{className:"row"},a.createElement("div",{className:"col"},a.createElement(h,null))),a.createElement("div",{className:"row"},a.createElement("div",{className:"col"},a.createElement(a.Suspense,{fallback:a.createElement(O,{componentName:"ReactTable"})},a.createElement(x,{noDataText:"FRACKING EMPTY!",className:"data-test-id-output-table -highlight",data:t.map(function(e){return e?"object"===typeof e?e:Object(c.a)({},T.a,e):{}}),defaultPageSize:20,columns:E,filterable:!0,pivotBy:l,defaultFilterMethod:A,getTdProps:b})))),a.createElement("div",{id:"data-test-id-output-table-length",className:"mx-3 align-items-center justify-content-end d-flex"},a.createElement("h4",null,"Number of elements: ",t.length)),a.createElement(y.a,{isOpen:!!i,toggle:d,size:"lg"},a.createElement(N.a,null,"Details"),a.createElement(k.a,null,"object"===typeof i?a.createElement(a.Suspense,{fallback:a.createElement(O,{componentName:"ReactJson"})},a.createElement(S,{src:i||{},name:"data",iconStyle:"triangle",indentWidth:8,onAdd:function(){return null},onDelete:function(){return null},onEdit:function(){return null},onSelect:function(){return null}})):i)))},function(e,t){return w()(e,t)}))),_=n(130),M=Object(l.b)(function(e){return{data:Object(b.g)(e),isModalOpen:Object(b.r)(e)}},{toggleModal:m.e})(Object(v.a)(Object(a.memo)(function(e){var t=e.toggleModal,n=e.isModalOpen;return a.createElement("div",{className:"output-table"},a.createElement(y.a,{isOpen:n,toggle:t,className:"mw-100"},a.createElement(N.a,{toggle:t},"Table view"),a.createElement(k.a,null,a.createElement(z,null)),a.createElement(_.a,null,a.createElement(E.a,{color:"secondary",onClick:t},"Close"))),a.createElement("div",{className:"row"},a.createElement("div",{className:"col"},a.createElement(E.a,{block:!0,color:"dark",outline:!0,onClick:t},"Display results table fullscreen"))),a.createElement("div",{className:"row"},a.createElement("div",{className:"col"},a.createElement(z,null))))}))),F=n(6),R=n.n(F),J=n(141),B=Object(a.lazy)(function(){return n.e(31).then(n.t.bind(null,186,7))}),D={border:"3px solid red"},G=function(){return null},P=Object(l.b)(function(e){return{src:Object(b.g)(e),searchTerm:Object(b.j)(e),match:Object(b.i)(e)}},{onSearchChange:m.j})(Object(v.a)(Object(a.memo)(function(e){var t=e.src,n=e.searchTerm,l=e.onSearchChange,c=e.match,r=Object(a.useCallback)(function(e){return l(e.target.value)},[l]);return a.createElement("div",{id:"jsonView"},a.createElement(J.DebounceInput,{style:n&&""!==n&&!c?D:{},value:n,className:"form-control",onChange:r,debounceTimeout:500,placeholder:"Type your search term..."}),a.createElement(a.Suspense,{fallback:a.createElement("div",null,"Loading...")},a.createElement(B,{src:t||{},name:"data",iconStyle:"triangle",indentWidth:8,onAdd:G,onDelete:G,onEdit:G,onSelect:G})))},function(e,t){return w()(e,t)}))),I=n(126),L=n(182),q=n(183),H=n(184),V={cursor:"pointer",fontSize:"large"};t.default=Object(l.b)(function(e){return{errorMessage:Object(b.e)(e),isArray:Object(b.f)(e),activeTab:Object(b.d)(e),objSize:Object(b.h)(e)}},{setActiveTab:m.g})(Object(a.memo)(Object(v.a)(function(e){var t=e.isArray,n=e.errorMessage,l=e.activeTab,c=e.setActiveTab,r=e.objSize,s=Object(a.useCallback)(function(){return c("Table")},[c]),u=Object(a.useCallback)(function(){return c("RawJson")},[c]);return a.createElement(a.Fragment,null,a.createElement("div",{className:"row"},a.createElement("div",{className:"col-sm-10 offset-sm-2"},a.createElement("h3",null,"3. View your results:"))),a.createElement("div",{hidden:!n},a.createElement("div",{className:"row"},a.createElement("div",{className:"col-sm-10 offset-sm-2"},a.createElement(I.a,{color:"danger"},n)))),a.createElement(a.Fragment,null,a.createElement("div",{className:"row"},a.createElement("div",{className:"col"},a.createElement("ul",{className:"nav nav-tabs"},a.createElement("li",{className:"nav-item"},a.createElement("button",{className:R()({active:"RawJson"===l,"nav-link":!0}),onClick:u,style:V},"Raw JSON view")),a.createElement("li",{className:"nav-item",hidden:!t},a.createElement("button",{className:R()({active:"Table"===l,"nav-link":!0}),onClick:s,style:V},"Table view"))))),a.createElement(L.a,{activeTab:l},a.createElement(q.a,{tabId:"RawJson"},a.createElement("div",{className:"row"},a.createElement("div",{className:"col-sm-2 pt-5"},a.createElement("h3",null,a.createElement(H.a,{id:"badgeSize",color:"secondary",pill:!0},Object(o.c)(r)))),a.createElement("div",{className:"col-sm-10"},a.createElement(P,null)))),a.createElement(q.a,{tabId:"Table"},a.createElement(M,null)))))})))}}]);
//# sourceMappingURL=Output.5cf847fd.chunk.js.map