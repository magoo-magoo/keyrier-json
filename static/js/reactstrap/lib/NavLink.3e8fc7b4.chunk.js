(window.webpackJsonp=window.webpackJsonp||[]).push([[19],{168:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e},r=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),a=f(n(0)),l=f(n(1)),i=f(n(8)),u=n(11);function f(e){return e&&e.__esModule?e:{default:e}}var c={tag:l.default.oneOfType([l.default.func,l.default.string]),innerRef:l.default.oneOfType([l.default.object,l.default.func,l.default.string]),disabled:l.default.bool,active:l.default.bool,className:l.default.string,cssModule:l.default.object,onClick:l.default.func,href:l.default.any},s=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var n=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!==typeof t&&"function"!==typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.onClick=n.onClick.bind(n),n}return function(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,a.default.Component),r(t,[{key:"onClick",value:function(e){this.props.disabled?e.preventDefault():("#"===this.props.href&&e.preventDefault(),this.props.onClick&&this.props.onClick(e))}},{key:"render",value:function(){var e=this.props,t=e.className,n=e.cssModule,r=e.active,l=e.tag,f=e.innerRef,c=function(e,t){var n={};for(var o in e)t.indexOf(o)>=0||Object.prototype.hasOwnProperty.call(e,o)&&(n[o]=e[o]);return n}(e,["className","cssModule","active","tag","innerRef"]),s=(0,u.mapToCssModules)((0,i.default)(t,"nav-link",{disabled:c.disabled,active:r}),n);return a.default.createElement(l,o({},c,{ref:f,onClick:this.onClick,className:s}))}}]),t}();s.propTypes=c,s.defaultProps={tag:"a"},t.default=s}}]);
//# sourceMappingURL=NavLink.3e8fc7b4.chunk.js.map