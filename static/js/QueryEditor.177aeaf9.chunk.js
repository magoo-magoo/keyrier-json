(this["webpackJsonp@keyrier/ui"]=this["webpackJsonp@keyrier/ui"]||[]).push([[2],{209:function(e,t,r){"use strict";r.d(t,"a",(function(){return u}));var n=r(212),i=r(1),a=r(213),c=r.n(a),o="https://cdn.jsdelivr.net/npm/ace-builds@1.3.3/src-min-noconflict";n.config.set("basePath",o),n.config.set("modePath",o),n.config.set("themePath",o),n.config.set("workerPath",o);var u=function AceEditor(e){var t=e.mode,r=e.theme,n=e.name,a=e.value,o=e.onChange;return i.createElement(c.a,{mode:t,theme:r,name:n,onChange:o,fontSize:16,highlightActiveLine:!0,value:a,minLines:24,maxLines:1/0,showPrintMargin:!1,showGutter:!1,cursorStart:1,width:"100%",debounceChangePeriod:750})}},245:function(e,t,r){"use strict";r.r(t);var n=r(7),i=r(209),a=r(33),c=r(41),o=r(1),u=r(28),s=r(132),m=r(21);t.default=Object(u.b)((function mapStateToProps(e){return{queryText:Object(m.q)(e),mode:Object(m.p)(e),currentEditorTheme:Object(m.e)(e)}}),{setQuery:n.a.updateQuery})(Object(a.a)(Object(o.memo)(Object(c.a)((function QueryEditor(e){var t=e.setQuery,r=e.queryText,n=e.mode,a=e.currentEditorTheme,c=Object(o.useCallback)((function(e){r!==e&&Object(s.unstable_runWithPriority)(s.unstable_IdlePriority,(function(){return t(e)}))}),[t,r]);return o.createElement(o.Fragment,null,o.createElement(i.a,{mode:"Javascript"===n?"javascript":"mysql",theme:a,name:"queryAceEditor",onChange:c,value:r}))}),"QueryEditor"))))}}]);
//# sourceMappingURL=QueryEditor.177aeaf9.chunk.js.map