(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{107:function(e,t,a){"use strict";var n=a(106),r=a.n(n);a.d(t,"a",function(){return r.a});a(114),a(115),a(116),a(117),a(118),a(119),a(120),a(121)},185:function(e,t,a){"use strict";a.r(t);var n=a(20),r=a(1),c=a(27),i=a(31),o=a(107),l=a(24),s=a(32),u=a(179),m=a(100),b=a(101),d=a(102),p=a(39),v=a(62);t.default=Object(c.b)(function(e){return{queryText:Object(l.m)(e),mode:Object(l.l)(e),currentEditorTheme:Object(l.b)(e)}},{setQuery:i.h,setQueryMode:i.i})(Object(p.a)(Object(r.memo)(function(e){var t=e.setQuery,a=e.queryText,c=e.mode,i=e.setQueryMode,l=e.currentEditorTheme,p=Object(s.b)(),E=Object(n.a)(p,2),h=E[0],y=E[1],f=Object(r.useCallback)(function(){return i("Javascript")},[i]),O=Object(r.useCallback)(function(){return i("SQL")},[i]),j=Object(r.useCallback)(function(e){Object(v.unstable_runWithPriority)(v.unstable_IdlePriority,function(){return t(e)})},[t]);return r.createElement(r.Fragment,null,r.createElement("div",{className:"row"},r.createElement("div",{className:"col-sm-10 offset-sm-2"},r.createElement("h3",null,"2. Type your query:"))),r.createElement("div",{className:"row"},r.createElement("div",{className:"col-sm-2"},r.createElement(u.a,{isOpen:h,toggle:y},r.createElement(m.a,{color:"primary",caret:!0},"Mode"),r.createElement(b.a,null,r.createElement(d.a,{header:!0},"Choose a predefined query"),r.createElement(d.a,{active:"Javascript"===c,onClick:f},"Javascript"),r.createElement(d.a,{active:"SQL"===c,onClick:O},"SQL like(experimental)")))),r.createElement("div",{className:"col-sm-10"},r.createElement(o.a,{mode:"Javascript"===c?"javascript":"mysql",theme:l,name:"queryAceEditor",onChange:j,fontSize:13,highlightActiveLine:!0,value:a,minLines:10,maxLines:25,showPrintMargin:!1,editorProps:{$blockScrolling:1/0},setOptions:{showLineNumbers:!0,tabSize:2,enableBasicAutocompletion:!0,enableLiveAutocompletion:!0,dragEnabled:!0},width:"100%",enableBasicAutocompletion:!0,enableLiveAutocompletion:!0,debounceChangePeriod:250}))))})))}}]);
//# sourceMappingURL=QueryEditor.22750ccc.chunk.js.map