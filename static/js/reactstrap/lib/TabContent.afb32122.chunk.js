(window.webpackJsonp=window.webpackJsonp||[]).push([[28],{151:function(t,e,a){"use strict";var r=a(53),o=a(43);e.__esModule=!0,e.default=void 0;var n=o(a(44)),i=o(a(47)),s=r(a(1)),c=a(58),u=o(a(4)),l=o(a(42)),p=a(45),d={tag:p.tagPropType,activeTab:u.default.any,className:u.default.string,cssModule:u.default.object},f={activeTabId:u.default.any},v=function(t){function e(e){var a;return(a=t.call(this,e)||this).state={activeTab:a.props.activeTab},a}(0,i.default)(e,t),e.getDerivedStateFromProps=function(t,e){return e.activeTab!==t.activeTab?{activeTab:t.activeTab}:null};var a=e.prototype;return a.getChildContext=function(){return{activeTabId:this.state.activeTab}},a.render=function(){var t=this.props,e=t.className,a=t.cssModule,r=t.tag,o=(0,p.omit)(this.props,Object.keys(d)),i=(0,p.mapToCssModules)((0,l.default)("tab-content",e),a);return s.default.createElement(r,(0,n.default)({},o,{className:i}))},e}(s.Component);(0,c.polyfill)(v);var b=v;e.default=b,v.propTypes=d,v.defaultProps={tag:"div"},v.childContextTypes=f},53:function(t,e){t.exports=function(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var a in t)if(Object.prototype.hasOwnProperty.call(t,a)){var r=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(t,a):{};r.get||r.set?Object.defineProperty(e,a,r):e[a]=t[a]}return e.default=t,e}}}]);
//# sourceMappingURL=TabContent.afb32122.chunk.js.map