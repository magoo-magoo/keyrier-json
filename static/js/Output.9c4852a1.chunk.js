(this["webpackJsonpkeyrier-json"]=this["webpackJsonpkeyrier-json"]||[]).push([[1],{611:function(e,t,n){e.exports={pointer:"Output_pointer__Fhc2d"}},612:function(e,t,n){},613:function(e,t,n){e.exports={loader:"Loading_loader__1SW_q",spin:"Loading_spin__HjhGY"}},652:function(e,t,n){"use strict";n.r(t);var a=n(60),l=n(611),c=n.n(l),r=n(0),o=n(20),s=(n(612),n(12)),u=n(24),i=n.n(u),m=n(36),b=n(15),d=n(17),p=n(18),E=n(89),f=n(153),v=n(26),O=n(613),j=n.n(O),g=Object(o.b)((function(e){return{debugMode:Object(d.d)(e)}}))((function Loading(e){var t=e.componentName,n=e.debugMode;return r.createElement("div",{className:j.a.loader},n?t:"")})),h=n(21),y=n.n(h),k=n(23),N=Object(r.lazy)((function(){return n.e(26).then(n.bind(null,651))})),C=Object(o.b)((function mapStateToProps(e){return{data:Object(d.n)(e),displayedColumns:Object(d.t)(e),columns:Object(d.c)(e),groupBy:Object(d.f)(e)}}),{onColumnsChange:b.n,setTableGroupBy:b.o})(Object(r.memo)(Object(v.a)(Object(k.c)((function TableAdvancedOptions(e){var t=e.onColumnsChange,a=e.columns,l=e.setTableGroupBy,c=e.data,o=e.displayedColumns,u=Object(p.b)(),b=Object(s.a)(u,2),d=b[0],v=b[1],O=Object(r.useCallback)((function(e){if(e instanceof Array){var n=e.map((function(e){return e.value?e.value:""}));t(n)}}),[t]),j=Object(r.useCallback)(Object(m.a)(i.a.mark((function _callee(){var e,t,a;return i.a.wrap((function _callee$(l){for(;;)switch(l.prev=l.next){case 0:return l.next=2,Promise.all([n.e(9),n.e(6)]).then(n.t.bind(null,650,7));case 2:e=l.sent,t=e.utils.book_new(),a=e.utils.json_to_sheet(c.map((function(e){return y.a.pick(e,o)})),{header:o}),e.utils.book_append_sheet(t,a,"keyrier-json"),e.writeFile(t,"export-".concat((new Date).toISOString(),".xlsx"));case 7:case"end":return l.stop()}}),_callee)}))),[o,c]),h=Object(r.useCallback)((function(e){return l([e.target.value])}),[l]);if(a.length<=0)return r.createElement(r.Fragment,null);var k=a.map((function(e){return{value:e,label:e}}));return r.createElement("div",{className:"row"},r.createElement("div",{className:"col"},r.createElement(E.a,{className:"float-left",color:"primary",block:!0,onClick:v},d?"Hide advanced options":"Advanced options"),r.createElement(f.a,{isOpen:d},r.createElement("select",{className:"form-control-lg form-control",name:"select",id:"groupingSelect",onChange:h},r.createElement("option",{key:"Group by..."},"Group by..."),o.map((function(e){return r.createElement("option",{key:e},e)}))),r.createElement(E.a,{color:"success",onClick:j},"Export to Excel (.xlsx)"),r.createElement(r.Suspense,{fallback:r.createElement(g,{componentName:"ReactSelect"})},r.createElement(N,{options:k,value:o.map((function(e){return{value:e,label:e}})),isMulti:!0,onChange:O})))))}),"TableAdvancedOptions")))),w=n(170),T=n(164),S=n(165),x=n(187),_=n.n(x),M=n(66),F=n(614),A=n(29),z=Object(r.lazy)((function(){return n.e(30).then(n.t.bind(null,649,7))})),R=function CellComponent(e){var t=e.cell,n=e.onClick;if(!t)return r.createElement(r.Fragment,null);var a=Object(A.b)(t.value),l=a.length>50,c=l?Object(A.d)(a,50):a,o=l?function(){n(t.value)}:void 0;return r.createElement("td",{onClick:o,className:"text-center text-nowrap data-test-id-cell-data"},l?r.createElement("button",{className:"btn"},c):c)},D=function DetailModal(e){var t=e.value,n=e.onClose;return r.createElement(w.a,{isOpen:!!t,toggle:n,size:"lg"},r.createElement(T.a,null,"Details"),r.createElement(S.a,null,"object"===typeof t?r.createElement(r.Suspense,{fallback:r.createElement(g,{componentName:"ReactJson"})},r.createElement(z,{src:t||{},name:"data",iconStyle:"triangle",indentWidth:8,onAdd:function onAdd(){return null},onDelete:function onDelete(){return null},onEdit:function onEdit(){return null},onSelect:function onSelect(){return null}})):t))},J=function DefaultColumnFilter(e){var t=e.column,n=t.filterValue,a=t.setFilter;return r.createElement("div",null,r.createElement("input",{className:"form-control form-control-sm",value:n||"",onChange:function onChange(e){a(e.target.value||void 0)}}))},P=Object(o.b)((function mapStateToProps(e){return{data:Object(d.n)(e),displayedColumns:Object(d.t)(e),columns:Object(d.c)(e),groupBy:Object(d.f)(e)}}))(Object(v.a)(Object(r.memo)(Object(k.c)((function OutputTableView(e){var t=e.data,n=e.displayedColumns,l=Object(r.useState)(null),c=Object(s.a)(l,2),o=c[0],u=c[1],i=Object(r.useMemo)((function(){return t.map((function(e){return e?"object"===typeof e?e:Object(a.a)({},M.a,e):{}}))}),[t]),m=r.useMemo((function(){return n.map((function(e){return{header:e,accessor:e,Filter:J}}))}),[n]),b=Object(F.useTable)({columns:m,data:i},F.useFilters,F.useSortBy),d=b.headerGroups,p=b.rows,E=b.prepareRow;return i&&Array.isArray(i)&&0!==i.length&&!i.every((function(e){return null===e||void 0===e||"object"===typeof e&&0===Object.keys(e).length}))?r.createElement(r.Fragment,null,r.createElement("div",{className:"row"},r.createElement("div",{className:"col"},r.createElement(C,null))),r.createElement("div",{className:"row"},r.createElement("div",{className:"col"},r.createElement(r.Suspense,{fallback:r.createElement(g,{componentName:"ReactTable"})},r.createElement("table",{className:"table table-bordered table-hover table-responsive data-test-id-output-table"},r.createElement("thead",null,d.map((function(e,t){return r.createElement("tr",{key:t},r.createElement("th",{scope:"col",className:"shadow-sm text-capitalize text-center data-test-id-column-name"}),e.headers.map((function(e,t){return r.createElement("th",{key:t,scope:"col",className:"shadow-sm text-capitalize text-center data-test-id-column-name min-vw-10",style:{minWidth:"50vh"}},r.createElement("div",e.getHeaderProps(e.getSortByToggleProps()),e.render("header"),r.createElement("span",null,e.isSorted?e.isSortedDesc?" \ud83d\udd3d":" \ud83d\udd3c":"")),e.render("Filter"))})))}))),r.createElement("tbody",null,p.map((function(e,t){return E(e),r.createElement("tr",{key:t},r.createElement("th",{scope:"row"},r.createElement("button",{onClick:function onClick(){return u(e.original)},className:"btn btn-link"},r.createElement("i",{className:"material-icons"},"open_in_browser"))),e.cells.map((function(e){return r.createElement(R,{key:e.column.id,cell:e,onClick:u})})))}))))))),r.createElement("div",{id:"data-test-id-output-table-length",className:"mx-3 align-items-center justify-content-end d-flex"},r.createElement("h4",null,"Number of elements: ",i.length)),r.createElement(D,{value:o,onClose:function onCloseDetailModal(){return u(null)}})):r.createElement("div",null)}),"OutputTableView"),(function(e,t){return _()(e,t)})))),B=n(166),G=Object(o.b)((function mapStateToProps(e){return{data:Object(d.j)(e),isModalOpen:Object(d.u)(e)}}),{toggleModal:b.f})(Object(v.a)(Object(r.memo)(Object(k.c)((function OutputTable(e){var t=e.toggleModal,n=e.isModalOpen;return r.createElement("div",{className:"output-table"},r.createElement(w.a,{isOpen:n,toggle:t,className:"mw-100"},r.createElement(T.a,{toggle:t},"Table view"),r.createElement(S.a,null,r.createElement(P,null)),r.createElement(B.a,null,r.createElement(E.a,{color:"secondary",onClick:t},"Close"))),r.createElement("div",{className:"row"},r.createElement("div",{className:"col"},r.createElement(E.a,{block:!0,color:"dark",outline:!0,onClick:t},"Display results table fullscreen"))),r.createElement("div",{className:"row"},r.createElement("div",{className:"col"},r.createElement(P,null))))}),"OutputTable")))),V=n(4),I=n.n(V),L=n(616),W=n(158),H=n(162),q=n(653),Y=Object(r.lazy)((function(){return n.e(30).then(n.t.bind(null,649,7))})),$={border:"3px solid red"},K=function noop(){return null},Q=Object(o.b)((function mapStateToProps(e){return{src:Object(d.j)(e),searchTerm:Object(d.m)(e),match:Object(d.l)(e),size:Object(d.k)(e),debugMode:Object(d.d)(e)}}),{onSearchChange:b.l})(Object(v.a)(Object(r.memo)(Object(k.c)((function JsonView(e){var t=e.src,n=e.searchTerm,a=e.onSearchChange,l=e.match,c=e.size,o=e.debugMode,u=Object(r.useState)(4683932),i=Object(s.a)(u,2),m=i[0],b=i[1],d=c>m,p=Object(r.useCallback)((function(e){return a(e.target.value)}),[a]);return r.createElement("div",{id:"jsonView"},r.createElement(L.DebounceInput,{style:n&&""!==n&&!l?$:{},value:n,className:"form-control",onChange:p,debounceTimeout:500,placeholder:"Type your search term..."}),r.createElement(r.Suspense,{fallback:r.createElement("div",null,"Loading...")},o?r.createElement(W.a,null,r.createElement(H.a,{for:"exampleCustomRange"},"heavy object size: ",Object(A.c)(m)),r.createElement(q.a,{type:"range",id:"exampleCustomRange",name:"customRange",value:m,steps:102400,min:102400,max:1048576,onChange:function onChange(e){return b(parseInt(e.currentTarget.value,10))}})):r.createElement(r.Fragment,null),d?r.createElement(r.Fragment,null):r.createElement(Y,{src:t||{},name:"data",iconStyle:"triangle",indentWidth:8,onAdd:K,onDelete:K,onEdit:K,onSelect:K})))}),"JsonView"),(function(e,t){return _()(e,t)})))),U=n(160),X=n(645),Z=n(646),ee=n(647);t.default=Object(o.b)((function mapStateToProps(e){return{errorMessage:Object(d.h)(e),isArray:Object(d.i)(e),activeTab:Object(d.g)(e),objSize:Object(d.k)(e)}}),{setActiveTab:b.i})(Object(r.memo)(Object(v.a)(Object(k.c)((function Output(e){var t=e.isArray,n=e.errorMessage,l=e.activeTab,o=e.setActiveTab,s=e.objSize,u=Object(r.useCallback)((function(){return o("Table")}),[o]),i=Object(r.useCallback)((function(){return o("RawJson")}),[o]);return r.createElement(r.Fragment,null,n&&r.createElement("div",null,r.createElement("div",{className:"row"},r.createElement("div",{className:"col-sm-10 offset-sm-2"},r.createElement(U.a,{className:"row align-items-center",color:"danger"},r.createElement("i",{className:"material-icons mr-2"},"error"),r.createElement("span",null,n))))),r.createElement(r.Fragment,null,r.createElement("div",{className:"row"},r.createElement("div",{className:"col"},r.createElement("ul",{className:"nav nav-tabs"},r.createElement("li",{className:"nav-item"},r.createElement("button",{className:I()(Object(a.a)({active:"RawJson"===l,"nav-link":!0},c.a.pointer,!0)),onClick:i},"Raw JSON view")),r.createElement("li",{className:"nav-item",hidden:!t},r.createElement("button",{className:I()(Object(a.a)({active:"Table"===l,"nav-link":!0},c.a.pointer,!0)),onClick:u},"Table view"))))),r.createElement(X.a,{activeTab:l},"RawJson"===l&&r.createElement(Z.a,{tabId:"RawJson"},r.createElement("div",{className:"row"},r.createElement("div",{className:"col-sm-2 pt-5"},r.createElement("h3",null,r.createElement(ee.a,{id:"badgeSize",color:"info",pill:!0},Object(A.c)(s)))),r.createElement("div",{className:"col-sm-10"},r.createElement(Q,null)))),r.createElement(Z.a,{tabId:"Table"},"Table"===l&&r.createElement(G,null)))))}),"Output"))))}}]);
//# sourceMappingURL=Output.9c4852a1.chunk.js.map