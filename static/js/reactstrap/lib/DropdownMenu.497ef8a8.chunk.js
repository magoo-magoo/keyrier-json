(window.webpackJsonp=window.webpackJsonp||[]).push([[14],{112:function(e,t,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var o=arguments[t];for(var r in o)Object.prototype.hasOwnProperty.call(o,r)&&(e[r]=o[r])}return e},i=d(o(0)),a=d(o(4)),n=d(o(5)),s=o(55),l=o(47);function d(e){return e&&e.__esModule?e:{default:e}}var u={tag:a.default.string,children:a.default.node.isRequired,right:a.default.bool,flip:a.default.bool,modifiers:a.default.object,className:a.default.string,cssModule:a.default.object,persist:a.default.bool},p={isOpen:a.default.bool.isRequired,direction:a.default.oneOf(["up","down","left","right"]).isRequired,inNavbar:a.default.bool.isRequired},f={flip:{enabled:!1}},c={up:"top",left:"left",right:"right",down:"bottom"},b=function(e,t){var o=e.className,a=e.cssModule,d=e.right,u=e.tag,p=e.flip,b=e.modifiers,m=e.persist,g=function(e,t){var o={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(o[r]=e[r]);return o}(e,["className","cssModule","right","tag","flip","modifiers","persist"]),h=(0,l.mapToCssModules)((0,n.default)(o,"dropdown-menu",{"dropdown-menu-right":d,show:t.isOpen}),a),v=u;if(m||t.isOpen&&!t.inNavbar){v=s.Popper;var w=c[t.direction]||"bottom",O=d?"end":"start";g.placement=w+"-"+O,g.component=u,g.modifiers=p?b:r({},b,f)}return i.default.createElement(v,r({tabIndex:"-1",role:"menu"},g,{"aria-hidden":!t.isOpen,className:h,"x-placement":g.placement}))};b.propTypes=u,b.defaultProps={tag:"div",flip:!0},b.contextTypes=p,t.default=b}}]);
//# sourceMappingURL=DropdownMenu.497ef8a8.chunk.js.map