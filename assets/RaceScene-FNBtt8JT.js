import{T as e,t}from"./sectorBoundaries-4se19hHn.js";import{i as n,t as r}from"./react-runtime-CXKGcn_o.js";import{F as i,P as a,cn as o,h as s,i as c,l,n as u,o as d,r as f,t as p}from"./startingGrid-Bi0OFsks.js";import{t as m}from"./index-CT2C3zrQ.js";import{C as h,Et as g,It as _,L as v,M as y,Mt as b,Nt as x,O as S,Ot as C,Pt as w,V as T,X as ee,Y as E,Z as te,_t as D,a as O,bt as ne,c as k,ct as re,d as ie,f as ae,h as A,ht as oe,i as j,jt as M,k as se,lt as ce,n as le,ot as ue,p as de,q as fe,r as N,st as pe,t as me,wt as he,xt as ge}from"./markerTexture-CPMmPYTv.js";function P(){return P=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},P.apply(null,arguments)}var _e=parseInt(`185`.replace(/\D+/g,``)),ve=_e>=125?`uv1`:`uv2`,ye=Object.defineProperty,be=(e,t,n)=>t in e?ye(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,xe=(e,t,n)=>(be(e,typeof t==`symbol`?t:t+``,n),n),Se=class{constructor(){xe(this,`_listeners`)}addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;let n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;let n=this._listeners[e];if(n!==void 0){let e=n.indexOf(t);e!==-1&&n.splice(e,1)}}dispatchEvent(e){if(this._listeners===void 0)return;let t=this._listeners[e.type];if(t!==void 0){e.target=this;let n=t.slice(0);for(let t=0,r=n.length;t<r;t++)n[t].call(this,e);e.target=null}}},Ce=Object.defineProperty,we=(e,t,n)=>t in e?Ce(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,F=(e,t,n)=>(we(e,typeof t==`symbol`?t:t+``,n),n),Te=new D,Ee=new ce,De=Math.cos(Math.PI/180*70),Oe=(e,t)=>(e%t+t)%t,ke=class extends Se{constructor(e,t){super(),F(this,`object`),F(this,`domElement`),F(this,`enabled`,!0),F(this,`target`,new x),F(this,`minDistance`,0),F(this,`maxDistance`,1/0),F(this,`minZoom`,0),F(this,`maxZoom`,1/0),F(this,`minPolarAngle`,0),F(this,`maxPolarAngle`,Math.PI),F(this,`minAzimuthAngle`,-1/0),F(this,`maxAzimuthAngle`,1/0),F(this,`enableDamping`,!1),F(this,`dampingFactor`,.05),F(this,`enableZoom`,!0),F(this,`zoomSpeed`,1),F(this,`enableRotate`,!0),F(this,`rotateSpeed`,1),F(this,`enablePan`,!0),F(this,`panSpeed`,1),F(this,`screenSpacePanning`,!0),F(this,`keyPanSpeed`,7),F(this,`zoomToCursor`,!1),F(this,`autoRotate`,!1),F(this,`autoRotateSpeed`,2),F(this,`reverseOrbit`,!1),F(this,`reverseHorizontalOrbit`,!1),F(this,`reverseVerticalOrbit`,!1),F(this,`keys`,{LEFT:`ArrowLeft`,UP:`ArrowUp`,RIGHT:`ArrowRight`,BOTTOM:`ArrowDown`}),F(this,`mouseButtons`,{LEFT:fe.ROTATE,MIDDLE:fe.DOLLY,RIGHT:fe.PAN}),F(this,`touches`,{ONE:C.ROTATE,TWO:C.DOLLY_PAN}),F(this,`target0`),F(this,`position0`),F(this,`zoom0`),F(this,`_domElementKeyEvents`,null),F(this,`getPolarAngle`),F(this,`getAzimuthalAngle`),F(this,`setPolarAngle`),F(this,`setAzimuthalAngle`),F(this,`getDistance`),F(this,`getZoomScale`),F(this,`listenToKeyEvents`),F(this,`stopListenToKeyEvents`),F(this,`saveState`),F(this,`reset`),F(this,`update`),F(this,`connect`),F(this,`dispose`),F(this,`dollyIn`),F(this,`dollyOut`),F(this,`getScale`),F(this,`setScale`),this.object=e,this.domElement=t,this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this.getPolarAngle=()=>l.phi,this.getAzimuthalAngle=()=>l.theta,this.setPolarAngle=e=>{let t=Oe(e,2*Math.PI),r=l.phi;r<0&&(r+=2*Math.PI),t<0&&(t+=2*Math.PI);let i=Math.abs(t-r);2*Math.PI-i<i&&(t<r?t+=2*Math.PI:r+=2*Math.PI),u.phi=t-r,n.update()},this.setAzimuthalAngle=e=>{let t=Oe(e,2*Math.PI),r=l.theta;r<0&&(r+=2*Math.PI),t<0&&(t+=2*Math.PI);let i=Math.abs(t-r);2*Math.PI-i<i&&(t<r?t+=2*Math.PI:r+=2*Math.PI),u.theta=t-r,n.update()},this.getDistance=()=>n.object.position.distanceTo(n.target),this.listenToKeyEvents=e=>{e.addEventListener(`keydown`,V),this._domElementKeyEvents=e},this.stopListenToKeyEvents=()=>{this._domElementKeyEvents.removeEventListener(`keydown`,V),this._domElementKeyEvents=null},this.saveState=()=>{n.target0.copy(n.target),n.position0.copy(n.object.position),n.zoom0=n.object.zoom},this.reset=()=>{n.target.copy(n.target0),n.object.position.copy(n.position0),n.object.zoom=n.zoom0,n.object.updateProjectionMatrix(),n.dispatchEvent(r),n.update(),s=o.NONE},this.update=(()=>{let t=new x,i=new x(0,1,0),a=new oe().setFromUnitVectors(e.up,i),p=a.clone().invert(),m=new x,h=new oe,g=2*Math.PI;return function(){let _=n.object.position;a.setFromUnitVectors(e.up,i),p.copy(a).invert(),t.copy(_).sub(n.target),t.applyQuaternion(a),l.setFromVector3(t),n.autoRotate&&s===o.NONE&&ie(ne()),n.enableDamping?(l.theta+=u.theta*n.dampingFactor,l.phi+=u.phi*n.dampingFactor):(l.theta+=u.theta,l.phi+=u.phi);let v=n.minAzimuthAngle,y=n.maxAzimuthAngle;isFinite(v)&&isFinite(y)&&(v<-Math.PI?v+=g:v>Math.PI&&(v-=g),y<-Math.PI?y+=g:y>Math.PI&&(y-=g),v<=y?l.theta=Math.max(v,Math.min(y,l.theta)):l.theta=l.theta>(v+y)/2?Math.max(v,l.theta):Math.min(y,l.theta)),l.phi=Math.max(n.minPolarAngle,Math.min(n.maxPolarAngle,l.phi)),l.makeSafe(),n.enableDamping===!0?n.target.addScaledVector(f,n.dampingFactor):n.target.add(f),n.zoomToCursor&&te||n.object.isOrthographicCamera?l.radius=de(l.radius):l.radius=de(l.radius*d),t.setFromSpherical(l),t.applyQuaternion(p),_.copy(n.target).add(t),n.object.matrixAutoUpdate||n.object.updateMatrix(),n.object.lookAt(n.target),n.enableDamping===!0?(u.theta*=1-n.dampingFactor,u.phi*=1-n.dampingFactor,f.multiplyScalar(1-n.dampingFactor)):(u.set(0,0,0),f.set(0,0,0));let b=!1;if(n.zoomToCursor&&te){let r=null;if(n.object instanceof re&&n.object.isPerspectiveCamera){let e=t.length();r=de(e*d);let i=e-r;n.object.position.addScaledVector(ee,i),n.object.updateMatrixWorld()}else if(n.object.isOrthographicCamera){let e=new x(E.x,E.y,0);e.unproject(n.object),n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/d)),n.object.updateProjectionMatrix(),b=!0;let i=new x(E.x,E.y,0);i.unproject(n.object),n.object.position.sub(i).add(e),n.object.updateMatrixWorld(),r=t.length()}else console.warn(`WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled.`),n.zoomToCursor=!1;r!==null&&(n.screenSpacePanning?n.target.set(0,0,-1).transformDirection(n.object.matrix).multiplyScalar(r).add(n.object.position):(Te.origin.copy(n.object.position),Te.direction.set(0,0,-1).transformDirection(n.object.matrix),Math.abs(n.object.up.dot(Te.direction))<De?e.lookAt(n.target):(Ee.setFromNormalAndCoplanarPoint(n.object.up,n.target),Te.intersectPlane(Ee,n.target))))}else n.object instanceof pe&&n.object.isOrthographicCamera&&(b=d!==1,b&&(n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/d)),n.object.updateProjectionMatrix()));return d=1,te=!1,b||m.distanceToSquared(n.object.position)>c||8*(1-h.dot(n.object.quaternion))>c?(n.dispatchEvent(r),m.copy(n.object.position),h.copy(n.object.quaternion),b=!1,!0):!1}})(),this.connect=e=>{n.domElement=e,n.domElement.style.touchAction=`none`,n.domElement.addEventListener(`contextmenu`,H),n.domElement.addEventListener(`pointerdown`,Ne),n.domElement.addEventListener(`pointercancel`,R),n.domElement.addEventListener(`wheel`,B)},this.dispose=()=>{var e,t,r,i,a,o;n.domElement&&(n.domElement.style.touchAction=`auto`),(e=n.domElement)==null||e.removeEventListener(`contextmenu`,H),(t=n.domElement)==null||t.removeEventListener(`pointerdown`,Ne),(r=n.domElement)==null||r.removeEventListener(`pointercancel`,R),(i=n.domElement)==null||i.removeEventListener(`wheel`,B),(a=n.domElement)==null||a.ownerDocument.removeEventListener(`pointermove`,L),(o=n.domElement)==null||o.ownerDocument.removeEventListener(`pointerup`,R),n._domElementKeyEvents!==null&&n._domElementKeyEvents.removeEventListener(`keydown`,V)};let n=this,r={type:`change`},i={type:`start`},a={type:`end`},o={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},s=o.NONE,c=1e-6,l=new g,u=new g,d=1,f=new x,p=new b,m=new b,h=new b,_=new b,v=new b,y=new b,S=new b,w=new b,T=new b,ee=new x,E=new b,te=!1,D=[],O={};function ne(){return 2*Math.PI/60/60*n.autoRotateSpeed}function k(){return .95**n.zoomSpeed}function ie(e){n.reverseOrbit||n.reverseHorizontalOrbit?u.theta+=e:u.theta-=e}function ae(e){n.reverseOrbit||n.reverseVerticalOrbit?u.phi+=e:u.phi-=e}let A=(()=>{let e=new x;return function(t,n){e.setFromMatrixColumn(n,0),e.multiplyScalar(-t),f.add(e)}})(),j=(()=>{let e=new x;return function(t,r){n.screenSpacePanning===!0?e.setFromMatrixColumn(r,1):(e.setFromMatrixColumn(r,0),e.crossVectors(n.object.up,e)),e.multiplyScalar(t),f.add(e)}})(),M=(()=>{let e=new x;return function(t,r){let i=n.domElement;if(i&&n.object instanceof re&&n.object.isPerspectiveCamera){let a=n.object.position;e.copy(a).sub(n.target);let o=e.length();o*=Math.tan(n.object.fov/2*Math.PI/180),A(2*t*o/i.clientHeight,n.object.matrix),j(2*r*o/i.clientHeight,n.object.matrix)}else i&&n.object instanceof pe&&n.object.isOrthographicCamera?(A(t*(n.object.right-n.object.left)/n.object.zoom/i.clientWidth,n.object.matrix),j(r*(n.object.top-n.object.bottom)/n.object.zoom/i.clientHeight,n.object.matrix)):(console.warn(`WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.`),n.enablePan=!1)}})();function se(e){n.object instanceof re&&n.object.isPerspectiveCamera||n.object instanceof pe&&n.object.isOrthographicCamera?d=e:(console.warn(`WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.`),n.enableZoom=!1)}function ce(e){se(d/e)}function le(e){se(d*e)}function ue(e){if(!n.zoomToCursor||!n.domElement)return;te=!0;let t=n.domElement.getBoundingClientRect(),r=e.clientX-t.left,i=e.clientY-t.top,a=t.width,o=t.height;E.x=r/a*2-1,E.y=-(i/o)*2+1,ee.set(E.x,E.y,1).unproject(n.object).sub(n.object.position).normalize()}function de(e){return Math.max(n.minDistance,Math.min(n.maxDistance,e))}function N(e){p.set(e.clientX,e.clientY)}function me(e){ue(e),S.set(e.clientX,e.clientY)}function he(e){_.set(e.clientX,e.clientY)}function ge(e){m.set(e.clientX,e.clientY),h.subVectors(m,p).multiplyScalar(n.rotateSpeed);let t=n.domElement;t&&(ie(2*Math.PI*h.x/t.clientHeight),ae(2*Math.PI*h.y/t.clientHeight)),p.copy(m),n.update()}function P(e){w.set(e.clientX,e.clientY),T.subVectors(w,S),T.y>0?ce(k()):T.y<0&&le(k()),S.copy(w),n.update()}function _e(e){v.set(e.clientX,e.clientY),y.subVectors(v,_).multiplyScalar(n.panSpeed),M(y.x,y.y),_.copy(v),n.update()}function ve(e){ue(e),e.deltaY<0?le(k()):e.deltaY>0&&ce(k()),n.update()}function ye(e){let t=!1;switch(e.code){case n.keys.UP:M(0,n.keyPanSpeed),t=!0;break;case n.keys.BOTTOM:M(0,-n.keyPanSpeed),t=!0;break;case n.keys.LEFT:M(n.keyPanSpeed,0),t=!0;break;case n.keys.RIGHT:M(-n.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),n.update())}function be(){if(D.length==1)p.set(D[0].pageX,D[0].pageY);else{let e=.5*(D[0].pageX+D[1].pageX),t=.5*(D[0].pageY+D[1].pageY);p.set(e,t)}}function xe(){if(D.length==1)_.set(D[0].pageX,D[0].pageY);else{let e=.5*(D[0].pageX+D[1].pageX),t=.5*(D[0].pageY+D[1].pageY);_.set(e,t)}}function Se(){let e=D[0].pageX-D[1].pageX,t=D[0].pageY-D[1].pageY,n=Math.sqrt(e*e+t*t);S.set(0,n)}function Ce(){n.enableZoom&&Se(),n.enablePan&&xe()}function we(){n.enableZoom&&Se(),n.enableRotate&&be()}function ke(e){if(D.length==1)m.set(e.pageX,e.pageY);else{let t=W(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);m.set(n,r)}h.subVectors(m,p).multiplyScalar(n.rotateSpeed);let t=n.domElement;t&&(ie(2*Math.PI*h.x/t.clientHeight),ae(2*Math.PI*h.y/t.clientHeight)),p.copy(m)}function Ae(e){if(D.length==1)v.set(e.pageX,e.pageY);else{let t=W(e),n=.5*(e.pageX+t.x),r=.5*(e.pageY+t.y);v.set(n,r)}y.subVectors(v,_).multiplyScalar(n.panSpeed),M(y.x,y.y),_.copy(v)}function I(e){let t=W(e),r=e.pageX-t.x,i=e.pageY-t.y,a=Math.sqrt(r*r+i*i);w.set(0,a),T.set(0,(w.y/S.y)**+n.zoomSpeed),ce(T.y),S.copy(w)}function je(e){n.enableZoom&&I(e),n.enablePan&&Ae(e)}function Me(e){n.enableZoom&&I(e),n.enableRotate&&ke(e)}function Ne(e){var t,r;n.enabled!==!1&&(D.length===0&&((t=n.domElement)==null||t.ownerDocument.addEventListener(`pointermove`,L),(r=n.domElement)==null||r.ownerDocument.addEventListener(`pointerup`,R)),Le(e),e.pointerType===`touch`?Fe(e):Pe(e))}function L(e){n.enabled!==!1&&(e.pointerType===`touch`?Ie(e):z(e))}function R(e){var t,r,i;Re(e),D.length===0&&((t=n.domElement)==null||t.releasePointerCapture(e.pointerId),(r=n.domElement)==null||r.ownerDocument.removeEventListener(`pointermove`,L),(i=n.domElement)==null||i.ownerDocument.removeEventListener(`pointerup`,R)),n.dispatchEvent(a),s=o.NONE}function Pe(e){let t;switch(e.button){case 0:t=n.mouseButtons.LEFT;break;case 1:t=n.mouseButtons.MIDDLE;break;case 2:t=n.mouseButtons.RIGHT;break;default:t=-1}switch(t){case fe.DOLLY:if(n.enableZoom===!1)return;me(e),s=o.DOLLY;break;case fe.ROTATE:if(e.ctrlKey||e.metaKey||e.shiftKey){if(n.enablePan===!1)return;he(e),s=o.PAN}else{if(n.enableRotate===!1)return;N(e),s=o.ROTATE}break;case fe.PAN:if(e.ctrlKey||e.metaKey||e.shiftKey){if(n.enableRotate===!1)return;N(e),s=o.ROTATE}else{if(n.enablePan===!1)return;he(e),s=o.PAN}break;default:s=o.NONE}s!==o.NONE&&n.dispatchEvent(i)}function z(e){if(n.enabled!==!1)switch(s){case o.ROTATE:if(n.enableRotate===!1)return;ge(e);break;case o.DOLLY:if(n.enableZoom===!1)return;P(e);break;case o.PAN:if(n.enablePan===!1)return;_e(e);break}}function B(e){n.enabled===!1||n.enableZoom===!1||s!==o.NONE&&s!==o.ROTATE||(e.preventDefault(),n.dispatchEvent(i),ve(e),n.dispatchEvent(a))}function V(e){n.enabled===!1||n.enablePan===!1||ye(e)}function Fe(e){switch(U(e),D.length){case 1:switch(n.touches.ONE){case C.ROTATE:if(n.enableRotate===!1)return;be(),s=o.TOUCH_ROTATE;break;case C.PAN:if(n.enablePan===!1)return;xe(),s=o.TOUCH_PAN;break;default:s=o.NONE}break;case 2:switch(n.touches.TWO){case C.DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;Ce(),s=o.TOUCH_DOLLY_PAN;break;case C.DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;we(),s=o.TOUCH_DOLLY_ROTATE;break;default:s=o.NONE}break;default:s=o.NONE}s!==o.NONE&&n.dispatchEvent(i)}function Ie(e){switch(U(e),s){case o.TOUCH_ROTATE:if(n.enableRotate===!1)return;ke(e),n.update();break;case o.TOUCH_PAN:if(n.enablePan===!1)return;Ae(e),n.update();break;case o.TOUCH_DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;je(e),n.update();break;case o.TOUCH_DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;Me(e),n.update();break;default:s=o.NONE}}function H(e){n.enabled!==!1&&e.preventDefault()}function Le(e){D.push(e)}function Re(e){delete O[e.pointerId];for(let t=0;t<D.length;t++)if(D[t].pointerId==e.pointerId){D.splice(t,1);return}}function U(e){let t=O[e.pointerId];t===void 0&&(t=new b,O[e.pointerId]=t),t.set(e.pageX,e.pageY)}function W(e){let t=e.pointerId===D[0].pointerId?D[1]:D[0];return O[t.pointerId]}this.dollyIn=(e=k())=>{le(e),n.update()},this.dollyOut=(e=k())=>{ce(e),n.update()},this.getScale=()=>d,this.setScale=e=>{se(e),n.update()},this.getZoomScale=()=>k(),t!==void 0&&this.connect(t),this.update()}},Ae=new k,I=new x,je=class extends S{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type=`LineSegmentsGeometry`,this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute(`position`,new h([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute(`uv`,new h([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,n=this.attributes.instanceEnd;return t!==void 0&&(t.applyMatrix4(e),n.applyMatrix4(e),t.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let n=new se(t,6,1);return this.setAttribute(`instanceStart`,new y(n,3,0)),this.setAttribute(`instanceEnd`,new y(n,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let n;e instanceof Float32Array?n=e:Array.isArray(e)&&(n=new Float32Array(e));let r=new se(n,t*2,1);return this.setAttribute(`instanceColorStart`,new y(r,t,0)),this.setAttribute(`instanceColorEnd`,new y(r,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new _(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new k);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;e!==void 0&&t!==void 0&&(this.boundingBox.setFromBufferAttribute(e),Ae.setFromBufferAttribute(t),this.boundingBox.union(Ae))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new he),this.boundingBox===null&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(e!==void 0&&t!==void 0){let n=this.boundingSphere.center;this.boundingBox.getCenter(n);let r=0;for(let i=0,a=e.count;i<a;i++)I.fromBufferAttribute(e,i),r=Math.max(r,n.distanceToSquared(I)),I.fromBufferAttribute(t,i),r=Math.max(r,n.distanceToSquared(I));this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error(`THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.`,this)}}toJSON(){}applyMatrix(e){return console.warn(`THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4().`),this.applyMatrix4(e)}},Me=class extends je{constructor(){super(),this.isLineGeometry=!0,this.type=`LineGeometry`}setPositions(e){let t=e.length-3,n=new Float32Array(2*t);for(let r=0;r<t;r+=3)n[2*r]=e[r],n[2*r+1]=e[r+1],n[2*r+2]=e[r+2],n[2*r+3]=e[r+3],n[2*r+4]=e[r+4],n[2*r+5]=e[r+5];return super.setPositions(n),this}setColors(e,t=3){let n=e.length-t,r=new Float32Array(2*n);if(t===3)for(let i=0;i<n;i+=t)r[2*i]=e[i],r[2*i+1]=e[i+1],r[2*i+2]=e[i+2],r[2*i+3]=e[i+3],r[2*i+4]=e[i+4],r[2*i+5]=e[i+5];else for(let i=0;i<n;i+=t)r[2*i]=e[i],r[2*i+1]=e[i+1],r[2*i+2]=e[i+2],r[2*i+3]=e[i+3],r[2*i+4]=e[i+4],r[2*i+5]=e[i+5],r[2*i+6]=e[i+6],r[2*i+7]=e[i+7];return super.setColors(r,t),this}fromLine(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}},Ne=class extends ge{constructor(e){super({type:`LineMaterial`,uniforms:M.clone(M.merge([O.common,O.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new b(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
				#include <common>
				#include <fog_pars_vertex>
				#include <logdepthbuf_pars_vertex>
				#include <clipping_planes_pars_vertex>

				uniform float linewidth;
				uniform vec2 resolution;

				attribute vec3 instanceStart;
				attribute vec3 instanceEnd;

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
						attribute vec4 instanceColorStart;
						attribute vec4 instanceColorEnd;
					#else
						varying vec3 vLineColor;
						attribute vec3 instanceColorStart;
						attribute vec3 instanceColorEnd;
					#endif
				#endif

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#ifdef USE_DASH

					uniform float dashScale;
					attribute float instanceDistanceStart;
					attribute float instanceDistanceEnd;
					varying float vLineDistance;

				#endif

				void trimSegment( const in vec4 start, inout vec4 end ) {

					// trim end segment so it terminates between the camera plane and the near plane

					// conservative estimate of the near plane
					float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
					float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
					float nearEstimate = - 0.5 * b / a;

					float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

					end.xyz = mix( start.xyz, end.xyz, alpha );

				}

				void main() {

					#ifdef USE_COLOR

						vLineColor = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

					#endif

					#ifdef USE_DASH

						vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
						vUv = uv;

					#endif

					float aspect = resolution.x / resolution.y;

					// camera space
					vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
					vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

					#ifdef WORLD_UNITS

						worldStart = start.xyz;
						worldEnd = end.xyz;

					#else

						vUv = uv;

					#endif

					// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
					// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
					// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
					// perhaps there is a more elegant solution -- WestLangley

					bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

					if ( perspective ) {

						if ( start.z < 0.0 && end.z >= 0.0 ) {

							trimSegment( start, end );

						} else if ( end.z < 0.0 && start.z >= 0.0 ) {

							trimSegment( end, start );

						}

					}

					// clip space
					vec4 clipStart = projectionMatrix * start;
					vec4 clipEnd = projectionMatrix * end;

					// ndc space
					vec3 ndcStart = clipStart.xyz / clipStart.w;
					vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

					// direction
					vec2 dir = ndcEnd.xy - ndcStart.xy;

					// account for clip-space aspect ratio
					dir.x *= aspect;
					dir = normalize( dir );

					#ifdef WORLD_UNITS

						// get the offset direction as perpendicular to the view vector
						vec3 worldDir = normalize( end.xyz - start.xyz );
						vec3 offset;
						if ( position.y < 0.5 ) {

							offset = normalize( cross( start.xyz, worldDir ) );

						} else {

							offset = normalize( cross( end.xyz, worldDir ) );

						}

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						float forwardOffset = dot( worldDir, vec3( 0.0, 0.0, 1.0 ) );

						// don't extend the line if we're rendering dashes because we
						// won't be rendering the endcaps
						#ifndef USE_DASH

							// extend the line bounds to encompass  endcaps
							start.xyz += - worldDir * linewidth * 0.5;
							end.xyz += worldDir * linewidth * 0.5;

							// shift the position of the quad so it hugs the forward edge of the line
							offset.xy -= dir * forwardOffset;
							offset.z += 0.5;

						#endif

						// endcaps
						if ( position.y > 1.0 || position.y < 0.0 ) {

							offset.xy += dir * 2.0 * forwardOffset;

						}

						// adjust for linewidth
						offset *= linewidth * 0.5;

						// set the world position
						worldPos = ( position.y < 0.5 ) ? start : end;
						worldPos.xyz += offset;

						// project the worldpos
						vec4 clip = projectionMatrix * worldPos;

						// shift the depth of the projected points so the line
						// segments overlap neatly
						vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
						clip.z = clipPose.z * clip.w;

					#else

						vec2 offset = vec2( dir.y, - dir.x );
						// undo aspect ratio adjustment
						dir.x /= aspect;
						offset.x /= aspect;

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						// endcaps
						if ( position.y < 0.0 ) {

							offset += - dir;

						} else if ( position.y > 1.0 ) {

							offset += dir;

						}

						// adjust for linewidth
						offset *= linewidth;

						// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
						offset /= resolution.y;

						// select end
						vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

						// back to clip space
						offset *= clip.w;

						clip.xy += offset;

					#endif

					gl_Position = clip;

					vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

					#include <logdepthbuf_vertex>
					#include <clipping_planes_vertex>
					#include <fog_vertex>

				}
			`,fragmentShader:`
				uniform vec3 diffuse;
				uniform float opacity;
				uniform float linewidth;

				#ifdef USE_DASH

					uniform float dashOffset;
					uniform float dashSize;
					uniform float gapSize;

				#endif

				varying float vLineDistance;

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#include <common>
				#include <fog_pars_fragment>
				#include <logdepthbuf_pars_fragment>
				#include <clipping_planes_pars_fragment>

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
					#else
						varying vec3 vLineColor;
					#endif
				#endif

				vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

					float mua;
					float mub;

					vec3 p13 = p1 - p3;
					vec3 p43 = p4 - p3;

					vec3 p21 = p2 - p1;

					float d1343 = dot( p13, p43 );
					float d4321 = dot( p43, p21 );
					float d1321 = dot( p13, p21 );
					float d4343 = dot( p43, p43 );
					float d2121 = dot( p21, p21 );

					float denom = d2121 * d4343 - d4321 * d4321;

					float numer = d1343 * d4321 - d1321 * d4343;

					mua = numer / denom;
					mua = clamp( mua, 0.0, 1.0 );
					mub = ( d1343 + d4321 * ( mua ) ) / d4343;
					mub = clamp( mub, 0.0, 1.0 );

					return vec2( mua, mub );

				}

				void main() {

					#include <clipping_planes_fragment>

					#ifdef USE_DASH

						if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

						if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

					#endif

					float alpha = opacity;

					#ifdef WORLD_UNITS

						// Find the closest points on the view ray and the line segment
						vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
						vec3 lineDir = worldEnd - worldStart;
						vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

						vec3 p1 = worldStart + lineDir * params.x;
						vec3 p2 = rayEnd * params.y;
						vec3 delta = p1 - p2;
						float len = length( delta );
						float norm = len / linewidth;

						#ifndef USE_DASH

							#ifdef USE_ALPHA_TO_COVERAGE

								float dnorm = fwidth( norm );
								alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

							#else

								if ( norm > 0.5 ) {

									discard;

								}

							#endif

						#endif

					#else

						#ifdef USE_ALPHA_TO_COVERAGE

							// artifacts appear on some hardware if a derivative is taken within a conditional
							float a = vUv.x;
							float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
							float len2 = a * a + b * b;
							float dlen = fwidth( len2 );

							if ( abs( vUv.y ) > 1.0 ) {

								alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

							}

						#else

							if ( abs( vUv.y ) > 1.0 ) {

								float a = vUv.x;
								float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
								float len2 = a * a + b * b;

								if ( len2 > 1.0 ) discard;

							}

						#endif

					#endif

					vec4 diffuseColor = vec4( diffuse, alpha );
					#ifdef USE_COLOR
						#ifdef USE_LINE_COLOR_ALPHA
							diffuseColor *= vLineColor;
						#else
							diffuseColor.rgb *= vLineColor;
						#endif
					#endif

					#include <logdepthbuf_fragment>

					gl_FragColor = diffuseColor;

					#include <tonemapping_fragment>
					#include <${_e>=154?`colorspace_fragment`:`encodings_fragment`}>
					#include <fog_fragment>
					#include <premultiplied_alpha_fragment>

				}
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA=`1`:delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(e){this.uniforms.diffuse.value=e}},worldUnits:{enumerable:!0,get:function(){return`WORLD_UNITS`in this.defines},set:function(e){e===!0?this.defines.WORLD_UNITS=``:delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(e){this.uniforms.linewidth.value=e}},dashed:{enumerable:!0,get:function(){return`USE_DASH`in this.defines},set(e){!!e!=`USE_DASH`in this.defines&&(this.needsUpdate=!0),e===!0?this.defines.USE_DASH=``:delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(e){this.uniforms.dashScale.value=e}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(e){this.uniforms.dashSize.value=e}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(e){this.uniforms.dashOffset.value=e}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(e){this.uniforms.gapSize.value=e}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(e){this.uniforms.opacity.value=e}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(e){this.uniforms.resolution.value.copy(e)}},alphaToCoverage:{enumerable:!0,get:function(){return`USE_ALPHA_TO_COVERAGE`in this.defines},set:function(e){!!e!=`USE_ALPHA_TO_COVERAGE`in this.defines&&(this.needsUpdate=!0),e===!0?(this.defines.USE_ALPHA_TO_COVERAGE=``,this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}},L=new w,R=new x,Pe=new x,z=new w,B=new w,V=new w,Fe=new x,Ie=new ee,H=new v,Le=new x,Re=new k,U=new he,W=new w,G,K;function ze(e,t,n){return W.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),W.multiplyScalar(1/W.w),W.x=K/n.width,W.y=K/n.height,W.applyMatrix4(e.projectionMatrixInverse),W.multiplyScalar(1/W.w),Math.abs(Math.max(W.x,W.y))}function Be(e,t){let n=e.matrixWorld,r=e.geometry,i=r.attributes.instanceStart,a=r.attributes.instanceEnd,o=Math.min(r.instanceCount,i.count);for(let r=0,s=o;r<s;r++){H.start.fromBufferAttribute(i,r),H.end.fromBufferAttribute(a,r),H.applyMatrix4(n);let o=new x,s=new x;G.distanceSqToSegment(H.start,H.end,s,o),s.distanceTo(o)<K*.5&&t.push({point:s,pointOnLine:o,distance:G.origin.distanceTo(s),object:e,face:null,faceIndex:r,uv:null,[ve]:null})}}function Ve(e,t,n){let r=t.projectionMatrix,i=e.material.resolution,a=e.matrixWorld,o=e.geometry,s=o.attributes.instanceStart,c=o.attributes.instanceEnd,l=Math.min(o.instanceCount,s.count),u=-t.near;G.at(1,V),V.w=1,V.applyMatrix4(t.matrixWorldInverse),V.applyMatrix4(r),V.multiplyScalar(1/V.w),V.x*=i.x/2,V.y*=i.y/2,V.z=0,Fe.copy(V),Ie.multiplyMatrices(t.matrixWorldInverse,a);for(let t=0,o=l;t<o;t++){if(z.fromBufferAttribute(s,t),B.fromBufferAttribute(c,t),z.w=1,B.w=1,z.applyMatrix4(Ie),B.applyMatrix4(Ie),z.z>u&&B.z>u)continue;if(z.z>u){let e=z.z-B.z,t=(z.z-u)/e;z.lerp(B,t)}else if(B.z>u){let e=B.z-z.z,t=(B.z-u)/e;B.lerp(z,t)}z.applyMatrix4(r),B.applyMatrix4(r),z.multiplyScalar(1/z.w),B.multiplyScalar(1/B.w),z.x*=i.x/2,z.y*=i.y/2,B.x*=i.x/2,B.y*=i.y/2,H.start.copy(z),H.start.z=0,H.end.copy(B),H.end.z=0;let o=H.closestPointToPointParameter(Fe,!0);H.at(o,Le);let l=E.lerp(z.z,B.z,o),d=l>=-1&&l<=1,f=Fe.distanceTo(Le)<K*.5;if(d&&f){H.start.fromBufferAttribute(s,t),H.end.fromBufferAttribute(c,t),H.start.applyMatrix4(a),H.end.applyMatrix4(a);let r=new x,i=new x;G.distanceSqToSegment(H.start,H.end,i,r),n.push({point:i,pointOnLine:r,distance:G.origin.distanceTo(i),object:e,face:null,faceIndex:t,uv:null,[ve]:null})}}}var He=class extends te{constructor(e=new je,t=new Ne({color:Math.random()*16777215})){super(e,t),this.isLineSegments2=!0,this.type=`LineSegments2`}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,n=e.attributes.instanceEnd,r=new Float32Array(2*t.count);for(let e=0,i=0,a=t.count;e<a;e++,i+=2)R.fromBufferAttribute(t,e),Pe.fromBufferAttribute(n,e),r[i]=i===0?0:r[i-1],r[i+1]=r[i]+R.distanceTo(Pe);let i=new se(r,2,1);return e.setAttribute(`instanceDistanceStart`,new y(i,1,0)),e.setAttribute(`instanceDistanceEnd`,new y(i,1,1)),this}raycast(e,t){let n=this.material.worldUnits,r=e.camera;r===null&&!n&&console.error(`LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.`);let i=e.params.Line2===void 0?0:e.params.Line2.threshold||0;G=e.ray;let a=this.matrixWorld,o=this.geometry,s=this.material;K=s.linewidth+i,o.boundingSphere===null&&o.computeBoundingSphere(),U.copy(o.boundingSphere).applyMatrix4(a);let c;if(c=n?K*.5:ze(r,Math.max(r.near,U.distanceToPoint(G.origin)),s.resolution),U.radius+=c,G.intersectsSphere(U)===!1)return;o.boundingBox===null&&o.computeBoundingBox(),Re.copy(o.boundingBox).applyMatrix4(a);let l;l=n?K*.5:ze(r,Math.max(r.near,Re.distanceToPoint(G.origin)),s.resolution),Re.expandByScalar(l),G.intersectsBox(Re)!==!1&&(n?Be(this,t):Ve(this,r,t))}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(L),this.material.uniforms.resolution.value.set(L.z,L.w))}},Ue=class extends He{constructor(e=new Me,t=new Ne({color:Math.random()*16777215})){super(e,t),this.isLine2=!0,this.type=`Line2`}},q=e(n()),J=q.forwardRef(function({points:e,color:t=16777215,vertexColors:n,linewidth:r,lineWidth:i,segments:a,dashed:o,...s},c){var l;let u=j(e=>e.size),d=q.useMemo(()=>a?new He:new Ue,[a]),[f]=q.useState(()=>new Ne),p=(n==null||(l=n[0])==null?void 0:l.length)===4?4:3,m=q.useMemo(()=>{let r=a?new je:new Me,i=e.map(e=>{let t=Array.isArray(e);return e instanceof x||e instanceof w?[e.x,e.y,e.z]:e instanceof b?[e.x,e.y,0]:t&&e.length===3?[e[0],e[1],e[2]]:t&&e.length===2?[e[0],e[1],0]:e});if(r.setPositions(i.flat()),n){t=16777215;let e=n.map(e=>e instanceof A?e.toArray():e);r.setColors(e.flat(),p)}return r},[e,a,n,p]);return q.useLayoutEffect(()=>{d.computeLineDistances()},[e,d]),q.useLayoutEffect(()=>{o?f.defines.USE_DASH=``:delete f.defines.USE_DASH,f.needsUpdate=!0},[o,f]),q.useEffect(()=>()=>{m.dispose(),f.dispose()},[m]),q.createElement(`primitive`,P({object:d,ref:c},s),q.createElement(`primitive`,{object:m,attach:`geometry`}),q.createElement(`primitive`,P({object:f,attach:`material`,color:t,vertexColors:!!n,resolution:[u.width,u.height],linewidth:r??i??1,dashed:o,transparent:p===4},s)))}),We=q.forwardRef(({makeDefault:e,camera:t,regress:n,domElement:r,enableDamping:i=!0,keyEvents:a=!1,onChange:o,onStart:s,onEnd:c,...l},u)=>{let d=j(e=>e.invalidate),f=j(e=>e.camera),p=j(e=>e.gl),m=j(e=>e.events),h=j(e=>e.setEvents),g=j(e=>e.set),_=j(e=>e.get),v=j(e=>e.performance),y=t||f,b=r||m.connected||p.domElement,x=q.useMemo(()=>new ke(y),[y]);return N(()=>{x.enabled&&x.update()},-1),q.useEffect(()=>(a&&x.connect(a===!0?b:a),x.connect(b),()=>void x.dispose()),[a,b,n,x,d]),q.useEffect(()=>{let e=e=>{d(),n&&v.regress(),o&&o(e)},t=e=>{s&&s(e)},r=e=>{c&&c(e)};return x.addEventListener(`change`,e),x.addEventListener(`start`,t),x.addEventListener(`end`,r),()=>{x.removeEventListener(`start`,t),x.removeEventListener(`end`,r),x.removeEventListener(`change`,e)}},[o,s,c,x,d,h]),q.useEffect(()=>{if(e){let e=_().controls;return g({controls:x}),()=>g({controls:e})}},[e,x]),q.createElement(`primitive`,P({ref:u,object:x,enableDamping:i},l))});function Ge(e,t){let n=e.durationMs>0?Math.max(0,Math.min(1,(t-e.startedMs)/e.durationMs)):1;return{distance:e.from.distance+(e.to.distance-e.from.distance)*n,lateral:e.from.lateral+(e.to.lateral-e.from.lateral)*n,pitBlend:e.from.pitBlend+(e.to.pitBlend-e.from.pitBlend)*n}}function Ke(e,t,n,r){let i=e?Ge(e,n):t,a=!e||t.distance<i.distance||t.distance-i.distance>.5||r<=0;return{from:a?t:i,to:t,startedMs:n,durationMs:a?0:Math.min(250,r)}}function qe(e){return e.map((t,n)=>{let r=e[(n+1)%e.length];return{start:t,span:r>t?r-t:r+1-t}})}var Je=new WeakMap;function Ye(e){let t=Je.get(e);if(t===void 0){let n=Ze(e).getTangentAt(0);t=Math.atan2(n.z,n.x),Je.set(e,t)}return t}function Xe(e,n){let r=$e(e),i=t(e.centerline,n),a=r?tt(e,r,i):0;return new x(n[0],n[1]+a,n[2]).applyAxisAngle(new x(0,1,0),Ye(e)).toArray()}function Ze(e){return new de(e.centerline.map(e=>new x(...e)),!0,`catmullrom`,.48)}var Qe=new WeakMap;function $e(e){if(Qe.has(e))return Qe.get(e);let t=i(e.id,e.centerline.map(([e,,t])=>[e,-t]),e.lengthKm*1e3);return Qe.set(e,t),t}var et=new WeakMap;function tt(e,t,n){let r=et.get(e);return r||(r={planarLength:Ze(e).getLength(),datum:Math.min(...t.elevationsM)},et.set(e,r)),(a(t,n).elevationM-r.datum)*r.planarLength/(e.lengthKm*1e3)*(e.elevationDisplayScale??1)}var nt=class extends de{flat;height;constructor(e,t){super(e.points.map(e=>e.clone()),!0,`catmullrom`,.48),this.flat=e,this.height=t}getPointAt(e,t=new x){return this.flat.getPointAt(e,t),t.y+=this.height(e),t}getTangentAt(e,t=new x){this.flat.getTangentAt(e,t);let n=this.height((e+1-1e-5)%1),r=this.height((e+1e-5)%1);return t.y+=(r-n)/(2e-5*this.flat.getLength()),t.normalize()}};function rt(e){let t=Ze(e),n=Ye(e),r=new x(0,1,0);for(let e of t.points)e.applyAxisAngle(r,n);t.updateArcLengths();let i=$e(e);if(!i)return t;let o=t.getLength()/(e.lengthKm*1e3)*(e.elevationDisplayScale??1),s=Math.min(...i.elevationsM);return new nt(t,e=>(a(i,e).elevationM-s)*o)}function Y(e,t,n=0){let r=(t%1+1)%1,i=e.getPointAt(r),a=e.getTangentAt(r).normalize(),o=new x(-a.z,0,a.x).normalize();return{position:i.add(o.clone().multiplyScalar(n)),tangent:a,normal:o}}function it(e,t,n=192){let r=[],i=[];for(let i=0;i<=n;i+=1){let a=i/n,o=e.getPointAt(a),s=e.getTangentAt(a).normalize(),c=new x(-s.z,0,s.x).normalize(),l=o.clone().add(c.clone().multiplyScalar(t/2)),u=o.clone().add(c.clone().multiplyScalar(-t/2));r.push(l.x,l.y+.02,l.z),r.push(u.x,u.y+.02,u.z)}for(let e=0;e<n;e+=1){let t=e*2,n=t+1,r=t+2,a=t+3;i.push(t,r,n,n,r,a)}let a=new ie;return a.setAttribute(`position`,new h(r,3)),a.setIndex(i),a.computeVertexNormals(),a}function at(e,t,n,r=192){return Array.from({length:r+1},(i,a)=>{let o=a/r,s=e.getPointAt(o),c=e.getTangentAt(o).normalize(),l=new x(-c.z,0,c.x).normalize();return s.add(l.multiplyScalar(t/2*n)).add(new x(0,.06,0))})}function ot(e,t,n,r,i,a){let o=(t%1+1)%1;return e.getPointAt(o,r),e.getTangentAt(o,i).normalize(),a.set(-i.z,0,i.x).normalize(),r.addScaledVector(a,n),r}var X=r(),st=3.2,ct=(e,t,n)=>Math.min(n,Math.max(t,e)),lt=[`#00d8ff`,`#ffd21f`,`#ff344d`,`#bb89ff`,`#4ae7a2`],ut={clear:`#35d66f`,"double-yellow":`#ffe35a`,red:`#ff344d`,sc:`#ffd21f`,vsc:`#ffd21f`,yellow:`#ffd21f`},dt={clear:`CLEAR`,"double-yellow":`DOUBLE YELLOW`,red:`RED`,sc:`SC`,vsc:`VSC`,yellow:`YELLOW`};function Z(e){return ct(e.width*.27,.58,.92)}function ft(e,t){let n=s(e);return ct(Number.isFinite(t)?t:0,-n/2,n/2)/n*Z(e)}function Q({color:e,fontSize:t,outlineColor:n=`#050505`,position:r,text:i}){let a=(0,q.useMemo)(()=>{let t=document.createElement(`canvas`),r=t.getContext(`2d`);t.width=512,t.height=128,r&&(r.clearRect(0,0,t.width,t.height),r.font=`800 72px Arial, sans-serif`,r.textAlign=`center`,r.textBaseline=`middle`,r.lineJoin=`round`,r.lineWidth=14,r.strokeStyle=n,r.strokeText(i,t.width/2,t.height/2),r.fillStyle=e,r.fillText(i,t.width/2,t.height/2));let a=new ae(t);return a.colorSpace=ne,a.minFilter=T,a},[e,n,i]);return(0,q.useEffect)(()=>()=>a.dispose(),[a]),(0,X.jsx)(`sprite`,{position:r,scale:[Math.max(t*2.2,i.length*t*.72),t,1],children:(0,X.jsx)(`spriteMaterial`,{depthWrite:!1,map:a,transparent:!0})})}function $(e){return-(Z(e)/2+.62)}function pt({boxes:e}){let t=(0,q.useRef)(null),n=(0,q.useRef)(null);return(0,q.useEffect)(()=>{let r=t.current,i=n.current;if(!r||!i)return;let a=new ue,o=new A(`#4bd8ff`),s=new A(`#f4c430`);e.forEach(({index:e,pose:t},n)=>{let c=Math.atan2(t.tangent.x,t.tangent.z);a.position.copy(t.position).add(new x(0,.12,0)),a.rotation.set(0,c,0),a.updateMatrix(),r.setMatrixAt(n,a.matrix),a.position.y+=.08,a.updateMatrix(),i.setMatrixAt(n,a.matrix),i.setColorAt(n,e%2==0?o:s)}),r.instanceMatrix.needsUpdate=!0,i.instanceMatrix.needsUpdate=!0,i.instanceColor&&(i.instanceColor.needsUpdate=!0)},[e]),(0,X.jsxs)(`group`,{children:[(0,X.jsxs)(`instancedMesh`,{args:[void 0,void 0,e.length],ref:t,children:[(0,X.jsx)(`boxGeometry`,{args:[.28,.035,.54]}),(0,X.jsx)(`meshBasicMaterial`,{color:`#16191c`})]}),(0,X.jsxs)(`instancedMesh`,{args:[void 0,void 0,e.length],ref:n,children:[(0,X.jsx)(`boxGeometry`,{args:[.23,.018,.4]}),(0,X.jsx)(`meshBasicMaterial`,{vertexColors:!0})]})]})}function mt(e,t){return ft(e,u(t-1))}function ht(e,t,n){let r=p(Math.max(0,e.gridPosition-1),n.lengthKm*1e3);return t&&e.status===`running`&&e.timedRunPhase===null&&Math.abs(e.totalDistance-r)<=.035}function gt(e,t,n){return ht(t,n,e)?mt(e,t.gridPosition):t.status===`running`?ft(e,t.lateralOffsetM??t.trackLateralOffset??0):0}function _t(e,t,n,r,i,a,o,s){if(t.courseMotion){let n=ft(r,t.lateralOffsetM);return Y(e,t.progress,n+($(r)-n)*t.courseMotion.pitBlend)}let l=Y(e,t.progress,n);if(!(t.status===`pit`||t.status===`running`&&t.pitPhase===`lane`)){if(t.pitExitUntilSeconds!==null&&s<t.pitExitUntilSeconds){let n=(t.pitExitUntilSeconds-s)/st,i=Math.min(1,Math.max(0,n)),a=Y(e,t.progress,$(r));return{position:a.position.clone().lerp(l.position,1-i),tangent:a.tangent.clone().lerp(l.tangent,1-i).normalize(),normal:a.normal.clone().lerp(l.normal,1-i).normalize()}}return l}let u=t.pitLaneProgress??c(r,i,a),d=Y(e,c(r,i,a),$(r)-.56);d.position.add(d.tangent.clone().multiplyScalar(o===0?-.46:.46));let f=t.pitLaneProgress===null||t.pitPhase===`box`?d:Y(e,u,$(r));if(t.pitStartedAtSeconds===null||t.pitPhase===`box`)return f;if(t.pitPhase===`entry`||t.pitPhase===`lane`){let n=Y(e,u,0),r=Math.min(1,Math.max(0,(s-t.pitStartedAtSeconds)/st));return{position:n.position.clone().lerp(f.position,r),tangent:n.tangent.clone().lerp(f.tangent,r).normalize(),normal:n.normal.clone().lerp(f.normal,r).normalize()}}return f}function vt({curve:e,teamCount:t,track:n}){let r=(0,q.useMemo)(()=>Array.from({length:30},(t,r)=>{let i=n.pitLane?.entryProgress??.965,a=n.pitLane?.exitProgress??.13;return Y(e,(i+r/29*((a+1-i)%1))%1,$(n)).position.clone().add(new x(0,.1,0))}),[e,n]),i=Y(e,n.pitLane?.boxStartProgress??.976,$(n)-.5),a=(0,q.useMemo)(()=>Array.from({length:Math.max(n.pitLane?.boxCount??12,t)},(r,i)=>({index:i,pose:Y(e,c(n,i,t),$(n)-.72)})),[e,t,n]),o=(0,q.useMemo)(()=>it(new de(r.map(e=>e.clone()),!1,`catmullrom`,.48),.44,64),[r]);return(0,q.useEffect)(()=>()=>o.dispose(),[o]),(0,X.jsxs)(`group`,{children:[(0,X.jsx)(`mesh`,{geometry:o,children:(0,X.jsx)(`meshBasicMaterial`,{color:`#171d24`,transparent:!0,opacity:.94})}),(0,X.jsx)(J,{points:r,color:`#8794a3`,lineWidth:1.1}),(0,X.jsx)(pt,{boxes:a}),(0,X.jsx)(Q,{color:`#4bd8ff`,fontSize:.54,position:i.position.clone().add(new x(0,.45,0)),text:`PIT`}),(0,X.jsx)(Q,{color:`#f4c430`,fontSize:.42,position:i.position.clone().add(new x(0,.86,0)).add(new x(0,0,.62)),text:`${n.pitLane?.speedLimitKph??80} KPH`})]})}function yt({curve:e,track:t}){return(0,X.jsx)(`group`,{children:(0,q.useMemo)(()=>(t.aeroActivationZones??[]).map(n=>{let r=Math.max(.01,(n.end-n.start+1)%1),i=Array.from({length:19},(i,a)=>Y(e,(n.start+a/18*r)%1,Z(t)/2+.16).position.clone().add(new x(0,.14,0))),a=Y(e,n.start+r*.5,Z(t)/2+.58);return{...n,labelPose:a,points:i}}),[e,t]).map(e=>(0,X.jsxs)(`group`,{children:[(0,X.jsx)(J,{points:e.points,color:`#43e76f`,lineWidth:1.8}),(0,X.jsx)(Q,{color:`#46d880`,fontSize:.8,outlineColor:`#03120a`,position:e.labelPose.position.clone().add(new x(0,.54,0)),text:e.label})]},`${e.label}-${e.start}`))})}function bt({curve:e,track:t}){return(0,X.jsx)(`group`,{children:(0,q.useMemo)(()=>{let n=(t.overtakeControlLines??[]).flatMap((e,t)=>[{color:`#f4c430`,label:`OD${t+1}`,progress:e.detectionProgress},{color:`#46d880`,label:`OA${t+1}`,progress:e.activationProgress}]),r=t.safetyCarLines?[{color:`#f2f5f0`,label:`SC1`,progress:t.safetyCarLines.line1Progress},{color:`#f2f5f0`,label:`SC2`,progress:t.safetyCarLines.line2Progress}]:[];return[...n,...r].map(t=>({...t,pose:Y(e,t.progress,0)}))},[e,t.overtakeControlLines,t.safetyCarLines]).map(e=>(0,X.jsxs)(`group`,{position:e.pose.position.clone().add(new x(0,.11,0)),rotation:[0,Math.atan2(e.pose.tangent.x,e.pose.tangent.z),0],children:[(0,X.jsxs)(`mesh`,{children:[(0,X.jsx)(`boxGeometry`,{args:[.05,.018,Z(t)*.95]}),(0,X.jsx)(`meshBasicMaterial`,{color:e.color})]}),(0,X.jsx)(Q,{color:e.color,fontSize:.52,position:[0,.3,Z(t)*.72],text:e.label})]},`${e.label}-${e.progress}`))})}function xt({curve:e,slotCount:t,track:n}){let r=(0,q.useMemo)(()=>Array.from({length:t},(t,r)=>{let i=r+1;return{index:r,pose:Y(e,(p(r,n.lengthKm*1e3)+1)%1,mt(n,i)),position:i}}),[e,t,n]),i=(0,q.useRef)(null),a=(0,q.useRef)(null);return(0,q.useEffect)(()=>{let e=i.current,t=a.current;if(!e||!t)return;let n=new ue,o=new A(`#f2f5f0`),s=new A(`#d5dde2`);r.forEach(({index:r,pose:i},a)=>{let c=Math.atan2(i.tangent.x,i.tangent.z);n.position.copy(i.position).add(new x(0,.075,0)),n.rotation.set(0,c,0),n.updateMatrix(),e.setMatrixAt(a,n.matrix),e.setColorAt(a,r%2==0?o:s),n.position.copy(i.position).add(i.tangent.clone().multiplyScalar(-.78)).add(new x(0,.093,0)),n.updateMatrix(),t.setMatrixAt(a,n.matrix)}),e.instanceMatrix.needsUpdate=!0,t.instanceMatrix.needsUpdate=!0,e.instanceColor&&(e.instanceColor.needsUpdate=!0)},[r]),(0,X.jsxs)(`group`,{children:[(0,X.jsxs)(`instancedMesh`,{args:[void 0,void 0,r.length],ref:i,children:[(0,X.jsx)(`boxGeometry`,{args:[.26,.012,.48]}),(0,X.jsx)(`meshBasicMaterial`,{opacity:.34,transparent:!0,vertexColors:!0})]}),(0,X.jsxs)(`instancedMesh`,{args:[void 0,void 0,r.length],ref:a,children:[(0,X.jsx)(`boxGeometry`,{args:[.3,.014,.04]}),(0,X.jsx)(`meshBasicMaterial`,{color:`#f2f5f0`,opacity:.58,transparent:!0})]})]})}function St({kerbs:e}){let t=(0,q.useRef)(null),n=(0,q.useRef)(null);return(0,q.useEffect)(()=>{let r=t.current,i=n.current;if(!r||!i)return;let a=new ue,o=new A(`#c9272e`),s=new A(`#f2f5f0`);e.forEach(({index:e,pose:t,side:n},c)=>{let l=Math.atan2(t.tangent.x,t.tangent.z);a.position.copy(t.position).add(new x(0,.09,0)),a.rotation.set(0,l,0),a.scale.set(1,1,1),a.updateMatrix(),r.setMatrixAt(c,a.matrix),r.setColorAt(c,e%4<2?s:o),a.position.copy(t.position).add(t.normal.clone().multiplyScalar(n*.38)).add(new x(0,.06,0)),a.updateMatrix(),i.setMatrixAt(c,a.matrix)}),r.instanceMatrix.needsUpdate=!0,i.instanceMatrix.needsUpdate=!0,r.instanceColor&&(r.instanceColor.needsUpdate=!0)},[e]),(0,X.jsxs)(`group`,{children:[(0,X.jsxs)(`instancedMesh`,{args:[void 0,void 0,e.length],ref:t,children:[(0,X.jsx)(`boxGeometry`,{args:[.34,.05,.82]}),(0,X.jsx)(`meshBasicMaterial`,{vertexColors:!0})]}),(0,X.jsxs)(`instancedMesh`,{args:[void 0,void 0,e.length],ref:n,children:[(0,X.jsx)(`boxGeometry`,{args:[.18,.02,.9]}),(0,X.jsx)(`meshBasicMaterial`,{color:`#7a8e64`,opacity:.58,transparent:!0})]})]})}function Ct({posts:e}){let t=(0,q.useRef)(null),n=(0,q.useRef)(null);return(0,q.useEffect)(()=>{let r=t.current,i=n.current;if(!r||!i)return;let a=new ue,o=new A(`#f4c430`),s=new A(`#4bd8ff`);e.forEach((e,t)=>{a.position.set(e[0],e[1]+.28,e[2]),a.rotation.set(0,0,0),a.updateMatrix(),r.setMatrixAt(t,a.matrix),a.position.y+=.62,a.updateMatrix(),i.setMatrixAt(t,a.matrix),i.setColorAt(t,t%3==0?o:s)}),r.instanceMatrix.needsUpdate=!0,i.instanceMatrix.needsUpdate=!0,i.instanceColor&&(i.instanceColor.needsUpdate=!0)},[e]),(0,X.jsxs)(`group`,{children:[(0,X.jsxs)(`instancedMesh`,{args:[void 0,void 0,e.length],ref:t,children:[(0,X.jsx)(`cylinderGeometry`,{args:[.06,.06,.55,8]}),(0,X.jsx)(`meshStandardMaterial`,{color:`#dde4e8`,roughness:.5})]}),(0,X.jsxs)(`instancedMesh`,{args:[void 0,void 0,e.length],ref:n,children:[(0,X.jsx)(`boxGeometry`,{args:[.3,.2,.08]}),(0,X.jsx)(`meshBasicMaterial`,{vertexColors:!0})]})]})}function wt({config:e,curve:t}){let n=(0,q.useMemo)(()=>at(t,Z(e.track)+3.2,1,144),[t,e.track]),r=(0,q.useMemo)(()=>at(t,Z(e.track)+3.2,-1,144),[t,e.track]),i=(0,q.useMemo)(()=>Array.from({length:56},(n,r)=>{let i=r%2==0?1:-1;return{index:r,pose:Y(t,(r/56+(i===1?.012:.022))%1,(Z(e.track)/2+.12)*i),side:i}}),[t,e.track]),a=(0,q.useMemo)(()=>(e.track.marshalPosts??[]).filter((e,t)=>t%2==0).map(t=>Xe(e.track,t)),[e.track]);return(0,X.jsxs)(`group`,{children:[(0,X.jsx)(J,{points:n,color:`#7a8389`,lineWidth:1.2}),(0,X.jsx)(J,{points:r,color:`#7a8389`,lineWidth:1.2}),(0,X.jsx)(St,{kerbs:i}),(e.track.corners??[]).map(t=>(0,X.jsxs)(`group`,{position:Xe(e.track,[t.position[0],.62,t.position[2]]),children:[(0,X.jsxs)(`mesh`,{position:[0,-.2,0],children:[(0,X.jsx)(`cylinderGeometry`,{args:[.16,.16,.32,12]}),(0,X.jsx)(`meshStandardMaterial`,{color:`#f4c430`,roughness:.55})]}),(0,X.jsx)(Q,{color:`#111`,fontSize:.42,outlineColor:`#f4c430`,position:[0,0,0],text:`${t.label??t.number}`})]},t.label??t.number)),(0,X.jsx)(Ct,{posts:a})]})}function Tt({curve:e,sectorFlags:t,track:n,yellowSeverity:r,yellowZone:i}){let a=(0,q.useMemo)(()=>qe(n.sectorMarks).map(({start:t,span:r})=>{let i=Array.from({length:45},(n,i)=>Y(e,(t+i/44*r)%1,0).position.add(new x(0,.13,0)));return{labelPose:Y(e,(t+r*.5)%1,Z(n)/2+.82),points:i}}),[e,n]),o=(0,q.useMemo)(()=>{if(!i||!r)return null;let t=(i.startProgress%1+1)%1,a=(i.endProgress%1+1)%1,o=a>t?a-t:a+1-t,s=Math.max(10,Math.ceil(o*150)),c=Array.from({length:s},(n,r)=>Y(e,(t+r/(s-1)*o)%1,0).position.add(new x(0,.2,0))),l=Y(e,(t+o*.48)%1,Z(n)/2+1.05);return{incidentPose:Y(e,i.incidentProgress,-Z(n)/2-.84),labelPose:l,points:c}},[e,n,r,i]);return(0,X.jsxs)(`group`,{children:[a.map((e,r)=>{let a=t[r]??`clear`,o=a!==`clear`&&!(i!==null&&(a===`yellow`||a===`double-yellow`)),s=o?ut[a]:lt[r];return(0,X.jsxs)(`group`,{children:[(0,X.jsx)(J,{points:e.points,color:s,lineWidth:o?3.6:2.1}),(0,X.jsx)(Q,{color:s,fontSize:o?.94:.84,position:e.labelPose.position.clone().add(new x(0,.56,0)),text:o?`${dt[a]} ${n.sectorLabels?.[r]??`S${r+1}`}`:n.sectorLabels?.[r]??`SECTOR ${r+1}`})]},r)}),o?(0,X.jsxs)(`group`,{children:[(0,X.jsx)(J,{points:o.points,color:r===`double`?`#ffae00`:`#ffe35a`,lineWidth:r===`double`?5.8:3.8}),(0,X.jsx)(Q,{color:r===`double`?`#ffae00`:`#ffe35a`,fontSize:r===`double`?1:.9,outlineColor:`#071019`,position:o.labelPose.position.clone().add(new x(0,.68,0)),text:r===`double`?`DOUBLE YELLOW`:`SINGLE YELLOW`}),(0,X.jsx)(Q,{color:`#ffffff`,fontSize:.72,outlineColor:`#b9162e`,position:o.incidentPose.position.clone().add(new x(0,.62,0)),text:`INCIDENT`})]}):null]})}var Et=(0,q.memo)(Tt,(e,t)=>e.curve===t.curve&&e.track===t.track&&e.yellowSeverity===t.yellowSeverity&&e.yellowZone?.startProgress===t.yellowZone?.startProgress&&e.yellowZone?.endProgress===t.yellowZone?.endProgress&&e.yellowZone?.incidentProgress===t.yellowZone?.incidentProgress&&e.sectorFlags.every((e,n)=>e===t.sectorFlags[n]));function Dt({cameraMode:e,config:t,curve:n,edgeLeft:r,edgeRight:i,roadGeometry:a,sectorFlags:o,yellowSeverity:s,yellowZone:c}){return(0,X.jsxs)(`group`,{children:[(0,X.jsx)(`mesh`,{geometry:a,children:(0,X.jsx)(`meshBasicMaterial`,{color:`#222a34`,transparent:!0,opacity:.98})}),(0,X.jsx)(J,{points:r,color:`#eef4fb`,lineWidth:1.15}),(0,X.jsx)(J,{points:i,color:`#eef4fb`,lineWidth:1.15}),(0,X.jsx)(Et,{curve:n,sectorFlags:o,track:t.track,yellowSeverity:s,yellowZone:c}),(0,X.jsx)(yt,{curve:n,track:t.track}),(0,X.jsx)(bt,{curve:n,track:t.track}),(0,X.jsx)(vt,{curve:n,teamCount:t.teams.length,track:t.track}),(0,X.jsx)(xt,{curve:n,slotCount:t.drivers.length,track:t.track}),e===`overview`?(t.track.corners??[]).map(e=>(0,X.jsx)(Q,{color:`#dce7f2`,fontSize:.92,outlineColor:`#071019`,position:Xe(t.track,[e.position[0],.46,e.position[2]]),text:`${e.label??e.number}`},e.label??e.number)):(0,X.jsx)(wt,{config:t,curve:n}),t.track.sectorMarks.map((e,t)=>(0,X.jsx)(`group`,{position:Y(n,e).position,rotation:[0,0,0],children:(0,X.jsxs)(`mesh`,{rotation:[-Math.PI/2,0,0],children:[(0,X.jsx)(`ringGeometry`,{args:[.24,.31,32]}),(0,X.jsx)(`meshBasicMaterial`,{color:lt[t],transparent:!0,opacity:.92,side:2})]})},e))]})}function Ot({car:e,curve:t,garageBayIndex:n,index:r,isSelected:i,onSelectDriver:a,pitBoxCount:o,showStartingGridSlots:s,snapshotElapsedSeconds:c,track:l}){let u=(0,q.useRef)(null),d=(0,q.useRef)(!1),f=(0,q.useRef)(null),p=(0,q.useRef)(c),m=j(e=>e.invalidate),h=e.status===`retired`||e.status===`disqualified`||e.status===`dns`?`#5a5f63`:e.teamColor,g=i?`#ffffff`:e.blueFlag?`#2f8dff`:e.overtakeStatus===`active`?`#4cff79`:e.status===`pit`?`#47ddff`:`#071018`,_=(0,q.useMemo)(()=>({tangent:new x,normal:new x}),[]),v=(0,q.useMemo)(()=>me({borderColor:g,fillColor:h,isSelected:i,label:e.code}),[g,e.code,i,h]),y=(0,q.useMemo)(()=>e.courseMotion&&f.current?null:_t(t,e,gt(l,e,s),l,r,o,n,c).position.clone().add(new x(0,.54,0)),[e,t,n,r,o,s,c,l]);return(0,q.useEffect)(()=>()=>v.dispose(),[v]),(0,q.useEffect)(()=>{if(!e.courseMotion)return;let t=e.courseMotion.rate>0?(c-p.current)/e.courseMotion.rate*1e3:0;f.current=Ke(f.current,{distance:e.totalDistance,lateral:e.lateralOffsetM,pitBlend:e.courseMotion.pitBlend},performance.now(),t),p.current=c,m()},[e,c,m]),N(()=>{let n=u.current;if(!n)return;if(e.courseMotion&&f.current){let e=performance.now(),r=Ge(f.current,e),i=ft(l,r.lateral);ot(t,r.distance,i+($(l)-i)*r.pitBlend,n.position,_.tangent,_.normal),n.position.y+=.54,d.current=!0,e<f.current.startedMs+f.current.durationMs&&m();return}if(!y)return;let r=n.position.distanceToSquared(y);!d.current||r>2.25?(n.position.copy(y),d.current=!0,m()):r>4e-4?(n.position.lerp(y,.28),m()):n.position.copy(y)}),(0,X.jsx)(`group`,{ref:u,children:(0,X.jsx)(`sprite`,{onClick:t=>{t.stopPropagation(),a(e.driverId)},renderOrder:i?20:10,scale:i?[2.32,2.32,1]:[2.05,2.05,1],children:(0,X.jsx)(`spriteMaterial`,{depthTest:!1,depthWrite:!1,map:v,transparent:!0})})})}function kt({curve:e,elapsedSeconds:t,leader:n,phase:r,track:i}){let a=(0,q.useRef)(null),o=(0,q.useRef)(!1),s=j(e=>e.invalidate),c=r?.neutralisation?.kind===`safety-car`?r.neutralisation:null,u=c?.orangeLights??!0,d=c?.greenLight??!1,p=(0,q.useMemo)(()=>me({borderColor:d?`#55e887`:u?`#ff9d18`:`#d8e1e8`,fillColor:d?`#087f3f`:u?`#f4c430`:`#59636d`,label:`SC`}),[d,u]),m=(0,q.useMemo)(()=>{let r;if(c?.stage===`pit-entry`&&c.pitEntryAtSeconds!==null){let n=ct((t-c.pitEntryAtSeconds)/7,0,1);r=Y(e,f(i.pitLane?.entryProgress??.965,i.pitLane?.boxStartProgress??.976,n),$(i))}else{let t=c?c.safetyCarDistance%1:(n.progress+.012)%1;r=Y(e,t,c?.stage===`deployed`||c?.pitLaneRouteRequired===!0&&l(t,i.pitLane?.entryProgress??.965,i.pitLane?.exitProgress??.13)?$(i):0)}return r.position.clone().add(new x(0,.5,0))},[e,t,n.progress,c,i]);return(0,q.useEffect)(()=>()=>p.dispose(),[p]),N(()=>{let e=a.current;e&&(o.current?e.position.distanceToSquared(m)>3e-4?(e.position.lerp(m,.3),s()):e.position.copy(m):(e.position.copy(m),o.current=!0,s()))}),(0,X.jsx)(`group`,{ref:a,children:(0,X.jsx)(`sprite`,{renderOrder:10,scale:[2.05,2.05,1],children:(0,X.jsx)(`spriteMaterial`,{depthTest:!1,depthWrite:!1,map:p,transparent:!0})})})}function At({curve:e,driverIdByCode:t,mode:n,onSelectDriver:r,overlay:i,selectedDriverId:a,track:o}){let s=(0,q.useRef)(new Map),c=(0,q.useRef)(null),l=j(e=>e.invalidate),u=(0,q.useMemo)(()=>Y(e,0,o.width/2+1.5),[e,o.width]);return N(()=>{let t=performance.now();c.current===null&&(c.current=t);let n=Math.max(1e3,i.windowEndMs-i.windowStartMs),r=i.targetMs??i.windowStartMs+(t-c.current)%n;for(let t of i.cars){let n=s.current.get(t.driverNumber);if(!n)continue;let i=Y(e,m(t,r),0);n.position.copy(i.position.clone().add(new x(0,.46,0))),n.lookAt(n.position.clone().add(i.tangent))}l()}),(0,X.jsxs)(`group`,{children:[(0,X.jsx)(Q,{color:`#4bd8ff`,fontSize:.5,position:u.position.clone().add(new x(0,.72,0)),text:`OpenF1 ${n}`}),i.cars.map(e=>(0,X.jsxs)(`group`,{onClick:n=>{n.stopPropagation();let i=t.get(e.code);i&&r(i)},ref:t=>{t?s.current.set(e.driverNumber,t):s.current.delete(e.driverNumber)},children:[(0,X.jsxs)(`mesh`,{rotation:[-Math.PI/2,0,0],children:[(0,X.jsx)(`circleGeometry`,{args:[t.get(e.code)===a?.4:.31,24]}),(0,X.jsx)(`meshBasicMaterial`,{color:e.teamColor,transparent:!0,opacity:t.get(e.code)===a?1:.78})]}),(0,X.jsx)(Q,{color:e.teamColor,fontSize:1,position:[0,.52,0],text:e.code})]},e.driverNumber))]})}function jt({cameraMode:e,resetViewKey:t,curve:n,selectedCar:r,selectedGarageBayIndex:i,pitBoxCount:a,selectedPitSlot:o,showStartingGridSlots:s,snapshotElapsedSeconds:c,track:l}){let{camera:u,gl:d,invalidate:f,size:p}=j(),m=(0,q.useRef)(null),h=(0,q.useRef)(!1),_=(0,q.useRef)(new x(0,0,0)),v=(0,q.useMemo)(()=>{let e=new k().setFromPoints(n.getSpacedPoints(320)),t=e.getCenter(new x),r=e.getSize(new x);return{center:t,halfDepth:r.z/2,halfWidth:r.x/2}},[n]),y=(0,q.useMemo)(()=>{let e=u instanceof re?E.degToRad(u.fov):E.degToRad(48),t=Math.tan(e/2),n=Math.max(.5,p.width/Math.max(1,p.height)),r=2.8,i=Math.max(30,(v.halfDepth+r)/t,(v.halfWidth+r)/(t*n));return{position:new x(v.center.x,v.center.y+i,v.center.z+i*.48),target:new x(v.center.x,v.center.y,v.center.z)}},[u,v,p.height,p.width]);(0,q.useEffect)(()=>{h.current=!1,f()},[e,n,t,f]),(0,q.useEffect)(()=>{let t=d.domElement;t.tabIndex=0,t.setAttribute(`aria-label`,`Interactive circuit map`),t.title=`Wheel: zoom · Drag: rotate · Right drag: pan · Double-click: reset · Keys: + / −, ← / →: rotate, ↑ / ↓: tilt, Home`;let n=()=>{e===`overview`&&(h.current=!1,f())},r=t=>{if(e!==`overview`||!m.current)return;if(t.key===`Home`){t.preventDefault(),n();return}if(![`+`,`=`,`-`,`ArrowLeft`,`ArrowRight`,`ArrowUp`,`ArrowDown`].includes(t.key))return;t.preventDefault(),h.current=!0;let r=m.current,i=u.position.clone().sub(r.target);if(t.key===`+`||t.key===`=`)i.multiplyScalar(.8);else if(t.key===`-`)i.multiplyScalar(1.25);else if(t.key===`ArrowUp`||t.key===`ArrowDown`){let e=new g().setFromVector3(i);e.phi=E.clamp(e.phi+(t.key===`ArrowUp`?-1:1)*Math.PI/24,.08,Math.PI*.47),i.setFromSpherical(e)}else i.applyAxisAngle(new x(0,1,0),t.key===`ArrowLeft`?Math.PI/12:-Math.PI/12);u.position.copy(r.target).add(i),r.update(),f()};return t.addEventListener(`dblclick`,n),t.addEventListener(`keydown`,r),()=>{t.removeEventListener(`dblclick`,n),t.removeEventListener(`keydown`,r)}},[e,u,d,f]);let b=(0,q.useMemo)(()=>{let e=_t(n,r,gt(l,r,s),l,o,a,i,c),t=e.position.clone().add(new x(0,.5,0));return{chasePosition:t.clone().add(e.tangent.clone().multiplyScalar(-12)).add(new x(0,7.2,0)),target:t}},[n,a,r,i,o,s,c,l]);return N(()=>{let t=b.target;if(e===`overview`&&!h.current&&(u.position.lerp(y.position,.12),_.current.lerp(y.target,.08),u.lookAt(_.current),m.current?.target.copy(_.current),(u.position.distanceToSquared(y.position)>4e-4||_.current.distanceToSquared(y.target)>4e-4)&&f()),e===`chase`){let e=b.chasePosition;u.position.lerp(e,.28),_.current.lerp(t,.4),u.lookAt(_.current),(u.position.distanceToSquared(e)>4e-4||_.current.distanceToSquared(t)>4e-4)&&f()}e===`orbit`&&m.current&&(m.current.target.lerp(t,.1),m.current.update(),f())}),(0,X.jsx)(We,{ref:m,enabled:e!==`chase`,enableDamping:!0,maxDistance:Math.max(180,y.position.distanceTo(y.target)*4),maxPolarAngle:Math.PI*.47,minDistance:8,onChange:()=>f(),onStart:()=>{e===`overview`&&(h.current=!0)},target:[0,0,0]})}function Mt({cameraMode:e,resetViewKey:t=0,config:n,curve:r,edgeLeft:i,edgeRight:a,onSelectDriver:s,openF1Overlay:c,openF1OverlayMode:l,roadGeometry:u,selectedDriverId:f,showSimulationCars:p=!0,snapshot:m}){let h=m.cars.find(e=>e.driverId===f)??m.cars[0],g=(0,q.useMemo)(()=>new Map(n.teams.map(e=>[e.id,d(n.teams,e.id)])),[n.teams]),_=(0,q.useMemo)(()=>{let e=new Map;for(let t of n.teams)n.drivers.filter(e=>e.teamId===t.id).forEach((t,n)=>e.set(t.id,n%2));return e},[n.drivers,n.teams]),v=g.get(h.teamId)??0,y=_.get(h.driverId)??0,b=(0,q.useMemo)(()=>new Map(n.drivers.map(e=>[e.code,e.id])),[n.drivers]),x=m.cars.find(e=>e.status===`running`&&e.pitPhase===`none`),S=!!(x&&(m.flag===`sc`||m.formationBehindSafetyCar&&m.startProcedure===`formation`||m.restartProcedure===`rolling`)),C=(0,q.useMemo)(()=>m.flagPhase?.flag===`yellow`&&m.flagPhase.yellowZone?{severity:m.flagPhase.yellowSeverity??`single`,zone:m.flagPhase.yellowZone}:m.flagPhase===null&&m.timedYellowUntilSeconds!==null&&m.timedYellowProgress!==null&&m.timedYellowProgress!==void 0?{severity:`double`,zone:o(n.track,m.timedYellowProgress)}:{severity:null,zone:null},[n.track,m.flagPhase,m.timedYellowProgress,m.timedYellowUntilSeconds]);return(0,X.jsxs)(X.Fragment,{children:[(0,X.jsx)(`ambientLight`,{intensity:1.1}),(0,X.jsx)(`directionalLight`,{intensity:.8,position:[16,27,14]}),(0,X.jsx)(Dt,{cameraMode:e,config:n,curve:r,edgeLeft:i,edgeRight:a,roadGeometry:u,sectorFlags:m.sectorFlags,yellowSeverity:C.severity,yellowZone:C.zone}),S&&x?(0,X.jsx)(kt,{curve:r,elapsedSeconds:m.elapsedSeconds,leader:x,phase:m.flagPhase,track:n.track}):null,p?m.cars.map(e=>e.hiddenFromTrack?null:(0,X.jsx)(Ot,{car:e,curve:r,garageBayIndex:_.get(e.driverId)??0,index:g.get(e.teamId)??0,isSelected:e.driverId===f,onSelectDriver:s,pitBoxCount:n.teams.length,showStartingGridSlots:m.startProcedure===`grid`||m.startProcedure===`lights`,snapshotElapsedSeconds:m.elapsedSeconds,track:n.track},e.driverId)):null,c&&c.cars.length>0?(0,X.jsx)(At,{curve:r,driverIdByCode:b,mode:l,onSelectDriver:s,overlay:c,selectedDriverId:f,track:n.track}):null,(0,X.jsx)(jt,{cameraMode:e,resetViewKey:t,curve:r,selectedCar:h,selectedGarageBayIndex:y,pitBoxCount:n.teams.length,selectedPitSlot:v,showStartingGridSlots:m.startProcedure===`grid`||m.startProcedure===`lights`,snapshotElapsedSeconds:m.elapsedSeconds,track:n.track})]})}function Nt(e){let[t,n]=(0,q.useState)(3),r=(0,q.useMemo)(()=>({...e.config.track,elevationDisplayScale:t}),[e.config.track,t]),a=(0,q.useMemo)(()=>({...e.config,track:r}),[e.config,r]),o=(0,q.useMemo)(()=>i(a.track.id,a.track.centerline.map(([e,,t])=>[e,-t]),a.track.lengthKm*1e3),[a.track]),s=(0,q.useMemo)(()=>rt(a.track),[a.track]),c=Z(e.config.track),l=(0,q.useMemo)(()=>it(s,c),[s,c]),u=(0,q.useMemo)(()=>at(s,c,1),[s,c]),d=(0,q.useMemo)(()=>at(s,c,-1),[s,c]);return(0,q.useEffect)(()=>()=>l.dispose(),[l]),(0,X.jsxs)(X.Fragment,{children:[(0,X.jsx)(le,{camera:{fov:48,near:.1,far:600,position:[0,47,.01]},className:`race-canvas`,dpr:[1,1.35],frameloop:`demand`,gl:{alpha:!0,antialias:!0,powerPreference:`high-performance`},performance:{min:.7},shadows:!1,children:(0,X.jsx)(q.Suspense,{fallback:null,children:(0,X.jsx)(Mt,{...e,config:a,curve:s,edgeLeft:u,edgeRight:d,roadGeometry:l})})}),o&&(0,X.jsxs)(`div`,{className:`map-elevation-control`,"aria-label":`Map elevation`,children:[(0,X.jsxs)(`span`,{title:o.basis,children:[o.basis.includes(`official`)?`公式固定点＋補間`:o.basis.includes(`unverified`)?`提供値＋補間（未検証）`:`公開標高データ（概算）`,` · `,Math.min(...o.elevationsM,...o.anchors?.map(e=>e[1])??[]).toFixed(0),`–`,Math.max(...o.elevationsM,...o.anchors?.map(e=>e[1])??[]).toFixed(0),` m`]}),(0,X.jsxs)(`div`,{children:[[0,1,3,5].map(e=>(0,X.jsx)(`button`,{type:`button`,"aria-label":`Map elevation ${e===0?`2D`:`${e}x`}`,"aria-pressed":t===e,onClick:()=>n(e),children:e===0?`2D`:`${e}×`},e)),o.sourceUrl.startsWith(`https://`)&&(0,X.jsx)(`a`,{href:o.sourceUrl,target:`_blank`,rel:`noreferrer`,children:`出典`})]})]})]})}export{Nt as RaceScene};