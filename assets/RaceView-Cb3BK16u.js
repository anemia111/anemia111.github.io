const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/CinematicScene-CjuKD8q0.js","assets/index-0-QOC4fI.js","assets/index-BfUWLyFj.css","assets/OrbitControls-BAVzpxJt.js"])))=>i.map(i=>d[i]);
import{M as e,T as t,V as n,W as r,_ as i,a,i as o,j as s,n as c,o as l,r as u,t as d,v as f}from"./index-0-QOC4fI.js";import{$ as p,$t as m,B as h,C as g,Jt as _,M as v,Mt as y,Pt as b,Qt as ee,W as x,Wt as te,Y as ne,Yt as S,b as re,ct as C,h as w,l as T,lt as ie,n as ae,qt as E,r as oe,s as D,t as se,u as ce,ut as le,v as ue,x as de,xt as fe,yt as O,z as pe,zt as me}from"./OrbitControls-BAVzpxJt.js";var he=ae>=125?`uv1`:`uv2`,ge=new w,k=new _,A=class extends pe{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type=`LineSegmentsGeometry`,this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute(`position`,new v([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute(`uv`,new v([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,n=this.attributes.instanceEnd;return t!==void 0&&(t.applyMatrix4(e),n.applyMatrix4(e),t.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let n=new h(t,6,1);return this.setAttribute(`instanceStart`,new x(n,3,0)),this.setAttribute(`instanceEnd`,new x(n,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let n;e instanceof Float32Array?n=e:Array.isArray(e)&&(n=new Float32Array(e));let r=new h(n,t*2,1);return this.setAttribute(`instanceColorStart`,new x(r,t,0)),this.setAttribute(`instanceColorEnd`,new x(r,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new ee(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new w);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;e!==void 0&&t!==void 0&&(this.boundingBox.setFromBufferAttribute(e),ge.setFromBufferAttribute(t),this.boundingBox.union(ge))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new me),this.boundingBox===null&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(e!==void 0&&t!==void 0){let n=this.boundingSphere.center;this.boundingBox.getCenter(n);let r=0;for(let i=0,a=e.count;i<a;i++)k.fromBufferAttribute(e,i),r=Math.max(r,n.distanceToSquared(k)),k.fromBufferAttribute(t,i),r=Math.max(r,n.distanceToSquared(k));this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error(`THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.`,this)}}toJSON(){}applyMatrix(e){return console.warn(`THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4().`),this.applyMatrix4(e)}},_e=class extends A{constructor(){super(),this.isLineGeometry=!0,this.type=`LineGeometry`}setPositions(e){let t=e.length-3,n=new Float32Array(2*t);for(let r=0;r<t;r+=3)n[2*r]=e[r],n[2*r+1]=e[r+1],n[2*r+2]=e[r+2],n[2*r+3]=e[r+3],n[2*r+4]=e[r+4],n[2*r+5]=e[r+5];return super.setPositions(n),this}setColors(e,t=3){let n=e.length-t,r=new Float32Array(2*n);if(t===3)for(let i=0;i<n;i+=t)r[2*i]=e[i],r[2*i+1]=e[i+1],r[2*i+2]=e[i+2],r[2*i+3]=e[i+3],r[2*i+4]=e[i+4],r[2*i+5]=e[i+5];else for(let i=0;i<n;i+=t)r[2*i]=e[i],r[2*i+1]=e[i+1],r[2*i+2]=e[i+2],r[2*i+3]=e[i+3],r[2*i+4]=e[i+4],r[2*i+5]=e[i+5],r[2*i+6]=e[i+6],r[2*i+7]=e[i+7];return super.setColors(r,t),this}fromLine(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}},j=class extends b{constructor(e){super({type:`LineMaterial`,uniforms:te.clone(te.merge([ce.common,ce.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new E(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
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
					#include <${ae>=154?`colorspace_fragment`:`encodings_fragment`}>
					#include <fog_fragment>
					#include <premultiplied_alpha_fragment>

				}
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA=`1`:delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(e){this.uniforms.diffuse.value=e}},worldUnits:{enumerable:!0,get:function(){return`WORLD_UNITS`in this.defines},set:function(e){e===!0?this.defines.WORLD_UNITS=``:delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(e){this.uniforms.linewidth.value=e}},dashed:{enumerable:!0,get:function(){return`USE_DASH`in this.defines},set(e){!!e!=`USE_DASH`in this.defines&&(this.needsUpdate=!0),e===!0?this.defines.USE_DASH=``:delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(e){this.uniforms.dashScale.value=e}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(e){this.uniforms.dashSize.value=e}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(e){this.uniforms.dashOffset.value=e}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(e){this.uniforms.gapSize.value=e}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(e){this.uniforms.opacity.value=e}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(e){this.uniforms.resolution.value.copy(e)}},alphaToCoverage:{enumerable:!0,get:function(){return`USE_ALPHA_TO_COVERAGE`in this.defines},set:function(e){!!e!=`USE_ALPHA_TO_COVERAGE`in this.defines&&(this.needsUpdate=!0),e===!0?(this.defines.USE_ALPHA_TO_COVERAGE=``,this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}},M=new S,ve=new _,ye=new _,N=new S,P=new S,F=new S,I=new _,L=new ie,R=new ne,z=new _,B=new w,V=new me,H=new S,U,W;function be(e,t,n){return H.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),H.multiplyScalar(1/H.w),H.x=W/n.width,H.y=W/n.height,H.applyMatrix4(e.projectionMatrixInverse),H.multiplyScalar(1/H.w),Math.abs(Math.max(H.x,H.y))}function xe(e,t){let n=e.matrixWorld,r=e.geometry,i=r.attributes.instanceStart,a=r.attributes.instanceEnd,o=Math.min(r.instanceCount,i.count);for(let r=0,s=o;r<s;r++){R.start.fromBufferAttribute(i,r),R.end.fromBufferAttribute(a,r),R.applyMatrix4(n);let o=new _,s=new _;U.distanceSqToSegment(R.start,R.end,s,o),s.distanceTo(o)<W*.5&&t.push({point:s,pointOnLine:o,distance:U.origin.distanceTo(s),object:e,face:null,faceIndex:r,uv:null,[he]:null})}}function Se(e,t,n){let r=t.projectionMatrix,i=e.material.resolution,a=e.matrixWorld,o=e.geometry,s=o.attributes.instanceStart,c=o.attributes.instanceEnd,l=Math.min(o.instanceCount,s.count),u=-t.near;U.at(1,F),F.w=1,F.applyMatrix4(t.matrixWorldInverse),F.applyMatrix4(r),F.multiplyScalar(1/F.w),F.x*=i.x/2,F.y*=i.y/2,F.z=0,I.copy(F),L.multiplyMatrices(t.matrixWorldInverse,a);for(let t=0,o=l;t<o;t++){if(N.fromBufferAttribute(s,t),P.fromBufferAttribute(c,t),N.w=1,P.w=1,N.applyMatrix4(L),P.applyMatrix4(L),N.z>u&&P.z>u)continue;if(N.z>u){let e=N.z-P.z,t=(N.z-u)/e;N.lerp(P,t)}else if(P.z>u){let e=P.z-N.z,t=(P.z-u)/e;P.lerp(N,t)}N.applyMatrix4(r),P.applyMatrix4(r),N.multiplyScalar(1/N.w),P.multiplyScalar(1/P.w),N.x*=i.x/2,N.y*=i.y/2,P.x*=i.x/2,P.y*=i.y/2,R.start.copy(N),R.start.z=0,R.end.copy(P),R.end.z=0;let o=R.closestPointToPointParameter(I,!0);R.at(o,z);let l=C.lerp(N.z,P.z,o),d=l>=-1&&l<=1,f=I.distanceTo(z)<W*.5;if(d&&f){R.start.fromBufferAttribute(s,t),R.end.fromBufferAttribute(c,t),R.start.applyMatrix4(a),R.end.applyMatrix4(a);let r=new _,i=new _;U.distanceSqToSegment(R.start,R.end,i,r),n.push({point:i,pointOnLine:r,distance:U.origin.distanceTo(i),object:e,face:null,faceIndex:t,uv:null,[he]:null})}}}var Ce=class extends le{constructor(e=new A,t=new j({color:Math.random()*16777215})){super(e,t),this.isLineSegments2=!0,this.type=`LineSegments2`}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,n=e.attributes.instanceEnd,r=new Float32Array(2*t.count);for(let e=0,i=0,a=t.count;e<a;e++,i+=2)ve.fromBufferAttribute(t,e),ye.fromBufferAttribute(n,e),r[i]=i===0?0:r[i-1],r[i+1]=r[i]+ve.distanceTo(ye);let i=new h(r,2,1);return e.setAttribute(`instanceDistanceStart`,new x(i,1,0)),e.setAttribute(`instanceDistanceEnd`,new x(i,1,1)),this}raycast(e,t){let n=this.material.worldUnits,r=e.camera;r===null&&!n&&console.error(`LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.`);let i=e.params.Line2===void 0?0:e.params.Line2.threshold||0;U=e.ray;let a=this.matrixWorld,o=this.geometry,s=this.material;W=s.linewidth+i,o.boundingSphere===null&&o.computeBoundingSphere(),V.copy(o.boundingSphere).applyMatrix4(a);let c;if(c=n?W*.5:be(r,Math.max(r.near,V.distanceToPoint(U.origin)),s.resolution),V.radius+=c,U.intersectsSphere(V)===!1)return;o.boundingBox===null&&o.computeBoundingBox(),B.copy(o.boundingBox).applyMatrix4(a);let l;l=n?W*.5:be(r,Math.max(r.near,B.distanceToPoint(U.origin)),s.resolution),B.expandByScalar(l),U.intersectsBox(B)!==!1&&(n?xe(this,t):Se(this,r,t))}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(M),this.material.uniforms.resolution.value.set(M.z,M.w))}},we=class extends Ce{constructor(e=new _e,t=new j({color:Math.random()*16777215})){super(e,t),this.isLine2=!0,this.type=`Line2`}},G=r(n()),K=G.forwardRef(function({points:e,color:t=16777215,vertexColors:n,linewidth:r,lineWidth:i,segments:a,dashed:o,...s},c){var l;let u=T(e=>e.size),d=G.useMemo(()=>a?new Ce:new we,[a]),[f]=G.useState(()=>new j),p=(n==null||(l=n[0])==null?void 0:l.length)===4?4:3,h=G.useMemo(()=>{let r=a?new A:new _e,i=e.map(e=>{let t=Array.isArray(e);return e instanceof _||e instanceof S?[e.x,e.y,e.z]:e instanceof E?[e.x,e.y,0]:t&&e.length===3?[e[0],e[1],e[2]]:t&&e.length===2?[e[0],e[1],0]:e});if(r.setPositions(i.flat()),n){t=16777215;let e=n.map(e=>e instanceof g?e.toArray():e);r.setColors(e.flat(),p)}return r},[e,a,n,p]);return G.useLayoutEffect(()=>{d.computeLineDistances()},[e,d]),G.useLayoutEffect(()=>{o?f.defines.USE_DASH=``:delete f.defines.USE_DASH,f.needsUpdate=!0},[o,f]),G.useEffect(()=>()=>{h.dispose(),f.dispose()},[h]),G.createElement(`primitive`,m({object:d,ref:c},s),G.createElement(`primitive`,{object:h,attach:`geometry`}),G.createElement(`primitive`,m({object:f,attach:`material`,color:t,vertexColors:!!n,resolution:[u.width,u.height],linewidth:r??i??1,dashed:o,transparent:p===4},s)))});function Te(e){return new de(e.centerline.map(e=>new _(...e)),!0,`catmullrom`,.48)}function q(e,t,n=0){let r=(t%1+1)%1,i=e.getPointAt(r),a=e.getTangentAt(r).normalize(),o=new _(-a.z,0,a.x).normalize();return{position:i.add(o.clone().multiplyScalar(n)),tangent:a,normal:o}}function Ee(e,t,n=192){let r=[],i=[];for(let i=0;i<=n;i+=1){let a=i/n,o=e.getPointAt(a),s=e.getTangentAt(a).normalize(),c=new _(-s.z,0,s.x).normalize(),l=o.clone().add(c.clone().multiplyScalar(t/2)),u=o.clone().add(c.clone().multiplyScalar(-t/2));r.push(l.x,l.y+.02,l.z),r.push(u.x,u.y+.02,u.z)}for(let e=0;e<n;e+=1){let t=e*2,n=t+1,r=t+2,a=t+3;i.push(t,r,n,n,r,a)}let a=new ue;return a.setAttribute(`position`,new v(r,3)),a.setIndex(i),a.computeVertexNormals(),a}function J(e,t,n,r=192){return Array.from({length:r+1},(i,a)=>{let o=a/r,s=e.getPointAt(o),c=e.getTangentAt(o).normalize(),l=new _(-c.z,0,c.x).normalize();return s.add(l.multiplyScalar(t/2*n)).setY(.06)})}var Y=e(),De=3.2,X=(e,t,n)=>Math.min(n,Math.max(t,e)),Oe=[`#00d8ff`,`#ffd21f`,`#ff344d`,`#bb89ff`],ke={clear:`#35d66f`,"double-yellow":`#ffe35a`,red:`#ff344d`,sc:`#ffd21f`,vsc:`#ffd21f`,yellow:`#ffd21f`},Ae={clear:`CLEAR`,"double-yellow":`DOUBLE YELLOW`,red:`RED`,sc:`SC`,vsc:`VSC`,yellow:`YELLOW`};function je({borderColor:e,fillColor:t,isSelected:n=!1,label:r}){let i=document.createElement(`canvas`),a=i.getContext(`2d`);i.width=192,i.height=192,a&&(a.clearRect(0,0,i.width,i.height),a.beginPath(),a.arc(96,96,n?79:73,0,Math.PI*2),a.fillStyle=t,a.fill(),a.lineWidth=n?12:10,a.strokeStyle=e,a.stroke(),a.font=`900 70px "Arial Narrow", Arial, sans-serif`,a.textAlign=`center`,a.textBaseline=`middle`,a.lineWidth=9,a.lineJoin=`round`,a.strokeStyle=`#05090e`,a.strokeText(r,96,99),a.fillStyle=`#ffffff`,a.fillText(r,96,99));let o=new re(i);return o.colorSpace=y,o.minFilter=p,o}function Z(e){return X(e.width*.27,.58,.92)}function Me(e,n){let r=t(e);return X(Number.isFinite(n)?n:0,-r/2,r/2)/r*Z(e)}function Q({color:e,fontSize:t,outlineColor:n=`#050505`,position:r,text:i}){let a=(0,G.useMemo)(()=>{let t=document.createElement(`canvas`),r=t.getContext(`2d`);t.width=512,t.height=128,r&&(r.clearRect(0,0,t.width,t.height),r.font=`800 72px Arial, sans-serif`,r.textAlign=`center`,r.textBaseline=`middle`,r.lineJoin=`round`,r.lineWidth=14,r.strokeStyle=n,r.strokeText(i,t.width/2,t.height/2),r.fillStyle=e,r.fillText(i,t.width/2,t.height/2));let a=new re(t);return a.colorSpace=y,a.minFilter=p,a},[e,n,i]);return(0,G.useEffect)(()=>()=>a.dispose(),[a]),(0,Y.jsx)(`sprite`,{position:r,scale:[Math.max(t*2.2,i.length*t*.72),t,1],children:(0,Y.jsx)(`spriteMaterial`,{depthWrite:!1,map:a,transparent:!0})})}function $(e){return-(Z(e)/2+.62)}function Ne({boxes:e}){let t=(0,G.useRef)(null),n=(0,G.useRef)(null);return(0,G.useEffect)(()=>{let r=t.current,i=n.current;if(!r||!i)return;let a=new O,o=new g(`#4bd8ff`),s=new g(`#f4c430`);e.forEach(({index:e,pose:t},n)=>{let c=Math.atan2(t.tangent.x,t.tangent.z);a.position.copy(t.position).setY(.12),a.rotation.set(0,c,0),a.updateMatrix(),r.setMatrixAt(n,a.matrix),a.position.setY(.2),a.updateMatrix(),i.setMatrixAt(n,a.matrix),i.setColorAt(n,e%2==0?o:s)}),r.instanceMatrix.needsUpdate=!0,i.instanceMatrix.needsUpdate=!0,i.instanceColor&&(i.instanceColor.needsUpdate=!0)},[e]),(0,Y.jsxs)(`group`,{children:[(0,Y.jsxs)(`instancedMesh`,{args:[void 0,void 0,e.length],ref:t,children:[(0,Y.jsx)(`boxGeometry`,{args:[.28,.035,.54]}),(0,Y.jsx)(`meshBasicMaterial`,{color:`#16191c`})]}),(0,Y.jsxs)(`instancedMesh`,{args:[void 0,void 0,e.length],ref:n,children:[(0,Y.jsx)(`boxGeometry`,{args:[.23,.018,.4]}),(0,Y.jsx)(`meshBasicMaterial`,{vertexColors:!0})]})]})}function Pe(e,t){return Me(e,f(t-1))}function Fe(e,t,n){let r=i(Math.max(0,e.gridPosition-1),n.lengthKm*1e3);return t&&e.status===`running`&&e.timedRunPhase===null&&Math.abs(e.totalDistance-r)<=.035}function Ie(e,t,n){return Fe(t,n,e)?Pe(e,t.gridPosition):t.status===`running`?Me(e,t.lateralOffsetM??t.trackLateralOffset??0):0}function Le(e,t,n,r,i,a,s,c){let l=q(e,t.progress,n);if(!(t.status===`pit`||t.status===`running`&&t.pitPhase===`lane`)){if(t.pitExitUntilSeconds!==null&&c<t.pitExitUntilSeconds){let n=(t.pitExitUntilSeconds-c)/De,i=Math.min(1,Math.max(0,n)),a=q(e,t.progress,$(r));return{position:a.position.clone().lerp(l.position,1-i),tangent:a.tangent.clone().lerp(l.tangent,1-i).normalize(),normal:a.normal.clone().lerp(l.normal,1-i).normalize()}}return l}let u=t.pitLaneProgress??o(r,i,a),d=q(e,o(r,i,a),$(r)-.56);d.position.add(d.tangent.clone().multiplyScalar(s===0?-.46:.46));let f=t.pitLaneProgress===null||t.pitPhase===`box`?d:q(e,u,$(r));if(t.pitStartedAtSeconds===null||t.pitPhase===`box`)return f;if(t.pitPhase===`entry`||t.pitPhase===`lane`){let n=q(e,u,0),r=Math.min(1,Math.max(0,(c-t.pitStartedAtSeconds)/De));return{position:n.position.clone().lerp(f.position,r),tangent:n.tangent.clone().lerp(f.tangent,r).normalize(),normal:n.normal.clone().lerp(f.normal,r).normalize()}}return f}function Re({curve:e,teamCount:t,track:n}){let r=(0,G.useMemo)(()=>Array.from({length:30},(t,r)=>{let i=n.pitLane?.entryProgress??.965,a=n.pitLane?.exitProgress??.13;return q(e,(i+r/29*((a+1-i)%1))%1,$(n)).position.setY(.1)}),[e,n]),i=q(e,n.pitLane?.boxStartProgress??.976,$(n)-.5),a=(0,G.useMemo)(()=>Array.from({length:Math.max(n.pitLane?.boxCount??12,t)},(r,i)=>({index:i,pose:q(e,o(n,i,t),$(n)-.72)})),[e,t,n]),s=(0,G.useMemo)(()=>Ee(new de(r.map(e=>e.clone()),!1,`catmullrom`,.48),.44,64),[r]);return(0,G.useEffect)(()=>()=>s.dispose(),[s]),(0,Y.jsxs)(`group`,{children:[(0,Y.jsx)(`mesh`,{geometry:s,children:(0,Y.jsx)(`meshBasicMaterial`,{color:`#171d24`,transparent:!0,opacity:.94})}),(0,Y.jsx)(K,{points:r,color:`#8794a3`,lineWidth:1.1}),(0,Y.jsx)(Ne,{boxes:a}),(0,Y.jsx)(Q,{color:`#4bd8ff`,fontSize:.54,position:i.position.setY(.45),text:`PIT`}),(0,Y.jsx)(Q,{color:`#f4c430`,fontSize:.42,position:i.position.clone().setY(.86).add(new _(0,0,.62)),text:`${n.pitLane?.speedLimitKph??80} KPH`})]})}function ze({curve:e,track:t}){return(0,Y.jsx)(`group`,{children:(0,G.useMemo)(()=>(t.aeroActivationZones??[]).map(n=>{let r=Math.max(.01,(n.end-n.start+1)%1),i=Array.from({length:19},(i,a)=>q(e,(n.start+a/18*r)%1,Z(t)/2+.16).position.setY(.14)),a=q(e,n.start+r*.5,Z(t)/2+.58);return{...n,labelPose:a,points:i}}),[e,t]).map(e=>(0,Y.jsxs)(`group`,{children:[(0,Y.jsx)(K,{points:e.points,color:`#43e76f`,lineWidth:1.8}),(0,Y.jsx)(Q,{color:`#46d880`,fontSize:.8,outlineColor:`#03120a`,position:e.labelPose.position.setY(.54),text:e.label})]},`${e.label}-${e.start}`))})}function Be({curve:e,track:t}){return(0,Y.jsx)(`group`,{children:(0,G.useMemo)(()=>{let n=(t.overtakeControlLines??[]).flatMap((e,t)=>[{color:`#f4c430`,label:`OD${t+1}`,progress:e.detectionProgress},{color:`#46d880`,label:`OA${t+1}`,progress:e.activationProgress}]),r=t.safetyCarLines?[{color:`#f2f5f0`,label:`SC1`,progress:t.safetyCarLines.line1Progress},{color:`#f2f5f0`,label:`SC2`,progress:t.safetyCarLines.line2Progress}]:[];return[...n,...r].map(t=>({...t,pose:q(e,t.progress,0)}))},[e,t.overtakeControlLines,t.safetyCarLines]).map(e=>(0,Y.jsxs)(`group`,{position:e.pose.position.setY(.11),rotation:[0,Math.atan2(e.pose.tangent.x,e.pose.tangent.z),0],children:[(0,Y.jsxs)(`mesh`,{children:[(0,Y.jsx)(`boxGeometry`,{args:[.05,.018,Z(t)*.95]}),(0,Y.jsx)(`meshBasicMaterial`,{color:e.color})]}),(0,Y.jsx)(Q,{color:e.color,fontSize:.52,position:[0,.3,Z(t)*.72],text:e.label})]},`${e.label}-${e.progress}`))})}function Ve({curve:e,slotCount:t,track:n}){let r=(0,G.useMemo)(()=>Array.from({length:t},(t,r)=>{let a=r+1;return{index:r,pose:q(e,(i(r,n.lengthKm*1e3)+1)%1,Pe(n,a)),position:a}}),[e,t,n]),a=(0,G.useRef)(null),o=(0,G.useRef)(null);return(0,G.useEffect)(()=>{let e=a.current,t=o.current;if(!e||!t)return;let n=new O,i=new g(`#f2f5f0`),s=new g(`#d5dde2`);r.forEach(({index:r,pose:a},o)=>{let c=Math.atan2(a.tangent.x,a.tangent.z);n.position.copy(a.position).setY(.075),n.rotation.set(0,c,0),n.updateMatrix(),e.setMatrixAt(o,n.matrix),e.setColorAt(o,r%2==0?i:s),n.position.copy(a.position).add(a.tangent.clone().multiplyScalar(-.78)).setY(.093),n.updateMatrix(),t.setMatrixAt(o,n.matrix)}),e.instanceMatrix.needsUpdate=!0,t.instanceMatrix.needsUpdate=!0,e.instanceColor&&(e.instanceColor.needsUpdate=!0)},[r]),(0,Y.jsxs)(`group`,{children:[(0,Y.jsxs)(`instancedMesh`,{args:[void 0,void 0,r.length],ref:a,children:[(0,Y.jsx)(`boxGeometry`,{args:[.26,.012,.48]}),(0,Y.jsx)(`meshBasicMaterial`,{opacity:.34,transparent:!0,vertexColors:!0})]}),(0,Y.jsxs)(`instancedMesh`,{args:[void 0,void 0,r.length],ref:o,children:[(0,Y.jsx)(`boxGeometry`,{args:[.3,.014,.04]}),(0,Y.jsx)(`meshBasicMaterial`,{color:`#f2f5f0`,opacity:.58,transparent:!0})]})]})}function He({kerbs:e}){let t=(0,G.useRef)(null),n=(0,G.useRef)(null);return(0,G.useEffect)(()=>{let r=t.current,i=n.current;if(!r||!i)return;let a=new O,o=new g(`#c9272e`),s=new g(`#f2f5f0`);e.forEach(({index:e,pose:t,side:n},c)=>{let l=Math.atan2(t.tangent.x,t.tangent.z);a.position.copy(t.position).setY(.09),a.rotation.set(0,l,0),a.scale.set(1,1,1),a.updateMatrix(),r.setMatrixAt(c,a.matrix),r.setColorAt(c,e%4<2?s:o),a.position.copy(t.position).add(t.normal.clone().multiplyScalar(n*.38)).setY(.06),a.updateMatrix(),i.setMatrixAt(c,a.matrix)}),r.instanceMatrix.needsUpdate=!0,i.instanceMatrix.needsUpdate=!0,r.instanceColor&&(r.instanceColor.needsUpdate=!0)},[e]),(0,Y.jsxs)(`group`,{children:[(0,Y.jsxs)(`instancedMesh`,{args:[void 0,void 0,e.length],ref:t,children:[(0,Y.jsx)(`boxGeometry`,{args:[.34,.05,.82]}),(0,Y.jsx)(`meshBasicMaterial`,{vertexColors:!0})]}),(0,Y.jsxs)(`instancedMesh`,{args:[void 0,void 0,e.length],ref:n,children:[(0,Y.jsx)(`boxGeometry`,{args:[.18,.02,.9]}),(0,Y.jsx)(`meshBasicMaterial`,{color:`#7a8e64`,opacity:.58,transparent:!0})]})]})}function Ue({posts:e}){let t=(0,G.useRef)(null),n=(0,G.useRef)(null);return(0,G.useEffect)(()=>{let r=t.current,i=n.current;if(!r||!i)return;let a=new O,o=new g(`#f4c430`),s=new g(`#4bd8ff`);e.forEach((e,t)=>{a.position.set(e[0],.28,e[2]),a.rotation.set(0,0,0),a.updateMatrix(),r.setMatrixAt(t,a.matrix),a.position.setY(.62),a.updateMatrix(),i.setMatrixAt(t,a.matrix),i.setColorAt(t,t%3==0?o:s)}),r.instanceMatrix.needsUpdate=!0,i.instanceMatrix.needsUpdate=!0,i.instanceColor&&(i.instanceColor.needsUpdate=!0)},[e]),(0,Y.jsxs)(`group`,{children:[(0,Y.jsxs)(`instancedMesh`,{args:[void 0,void 0,e.length],ref:t,children:[(0,Y.jsx)(`cylinderGeometry`,{args:[.06,.06,.55,8]}),(0,Y.jsx)(`meshStandardMaterial`,{color:`#dde4e8`,roughness:.5})]}),(0,Y.jsxs)(`instancedMesh`,{args:[void 0,void 0,e.length],ref:n,children:[(0,Y.jsx)(`boxGeometry`,{args:[.3,.2,.08]}),(0,Y.jsx)(`meshBasicMaterial`,{vertexColors:!0})]})]})}function We({config:e,curve:t}){let n=(0,G.useMemo)(()=>J(t,Z(e.track)+3.2,1,144),[t,e.track]),r=(0,G.useMemo)(()=>J(t,Z(e.track)+3.2,-1,144),[t,e.track]),i=(0,G.useMemo)(()=>Array.from({length:56},(n,r)=>{let i=r%2==0?1:-1;return{index:r,pose:q(t,(r/56+(i===1?.012:.022))%1,(Z(e.track)/2+.12)*i),side:i}}),[t,e.track]),a=(0,G.useMemo)(()=>(e.track.marshalPosts??[]).filter((e,t)=>t%2==0),[e.track.marshalPosts]);return(0,Y.jsxs)(`group`,{children:[(0,Y.jsx)(K,{points:n,color:`#7a8389`,lineWidth:1.2}),(0,Y.jsx)(K,{points:r,color:`#7a8389`,lineWidth:1.2}),(0,Y.jsx)(He,{kerbs:i}),(e.track.corners??[]).map(e=>(0,Y.jsxs)(`group`,{position:[e.position[0],.62,e.position[2]],children:[(0,Y.jsxs)(`mesh`,{position:[0,-.2,0],children:[(0,Y.jsx)(`cylinderGeometry`,{args:[.16,.16,.32,12]}),(0,Y.jsx)(`meshStandardMaterial`,{color:`#f4c430`,roughness:.55})]}),(0,Y.jsx)(Q,{color:`#111`,fontSize:.42,outlineColor:`#f4c430`,position:[0,0,0],text:`${e.number}`})]},e.number)),(0,Y.jsx)(Ue,{posts:a})]})}function Ge({curve:e,sectorFlags:t,track:n,yellowSeverity:r,yellowZone:i}){let a=(0,G.useMemo)(()=>{let t=n.sectorMarks.length>=3?n.sectorMarks:[0,1/3,2/3];return t.map((r,i)=>{let a=t[i+1]??1,o=a>r?a-r:a+1-r,s=Array.from({length:45},(t,n)=>q(e,(r+n/44*o)%1,0).position.setY(.13));return{labelPose:q(e,(r+o*.5)%1,Z(n)/2+.82),points:s}})},[e,n]),o=(0,G.useMemo)(()=>{if(!i||!r)return null;let t=(i.startProgress%1+1)%1,a=(i.endProgress%1+1)%1,o=a>t?a-t:a+1-t,s=Math.max(10,Math.ceil(o*150)),c=Array.from({length:s},(n,r)=>q(e,(t+r/(s-1)*o)%1,0).position.setY(.2)),l=q(e,(t+o*.48)%1,Z(n)/2+1.05);return{incidentPose:q(e,i.incidentProgress,-Z(n)/2-.84),labelPose:l,points:c}},[e,n,r,i]);return(0,Y.jsxs)(`group`,{children:[a.map((e,n)=>{let r=t[n]??`clear`,a=r!==`clear`&&!(i!==null&&(r===`yellow`||r===`double-yellow`)),o=a?ke[r]:Oe[n];return(0,Y.jsxs)(`group`,{children:[(0,Y.jsx)(K,{points:e.points,color:o,lineWidth:a?3.6:2.1}),(0,Y.jsx)(Q,{color:o,fontSize:a?.94:.84,position:e.labelPose.position.setY(.56),text:a?`${Ae[r]} S${n+1}`:`SECTOR ${n+1}`})]},n)}),o?(0,Y.jsxs)(`group`,{children:[(0,Y.jsx)(K,{points:o.points,color:r===`double`?`#ffae00`:`#ffe35a`,lineWidth:r===`double`?5.8:3.8}),(0,Y.jsx)(Q,{color:r===`double`?`#ffae00`:`#ffe35a`,fontSize:r===`double`?1:.9,outlineColor:`#071019`,position:o.labelPose.position.setY(.68),text:r===`double`?`DOUBLE YELLOW`:`SINGLE YELLOW`}),(0,Y.jsx)(Q,{color:`#ffffff`,fontSize:.72,outlineColor:`#b9162e`,position:o.incidentPose.position.setY(.62),text:`INCIDENT`})]}):null]})}var Ke=(0,G.memo)(Ge,(e,t)=>e.curve===t.curve&&e.track===t.track&&e.yellowSeverity===t.yellowSeverity&&e.yellowZone?.startProgress===t.yellowZone?.startProgress&&e.yellowZone?.endProgress===t.yellowZone?.endProgress&&e.yellowZone?.incidentProgress===t.yellowZone?.incidentProgress&&e.sectorFlags.every((e,n)=>e===t.sectorFlags[n]));function qe({cameraMode:e,config:t,curve:n,edgeLeft:r,edgeRight:i,roadGeometry:a,sectorFlags:o,yellowSeverity:s,yellowZone:c}){return(0,Y.jsxs)(`group`,{children:[(0,Y.jsx)(`mesh`,{geometry:a,children:(0,Y.jsx)(`meshBasicMaterial`,{color:`#222a34`,transparent:!0,opacity:.98})}),(0,Y.jsx)(K,{points:r,color:`#eef4fb`,lineWidth:1.15}),(0,Y.jsx)(K,{points:i,color:`#eef4fb`,lineWidth:1.15}),(0,Y.jsx)(Ke,{curve:n,sectorFlags:o,track:t.track,yellowSeverity:s,yellowZone:c}),(0,Y.jsx)(ze,{curve:n,track:t.track}),(0,Y.jsx)(Be,{curve:n,track:t.track}),(0,Y.jsx)(Re,{curve:n,teamCount:t.teams.length,track:t.track}),(0,Y.jsx)(Ve,{curve:n,slotCount:t.drivers.length,track:t.track}),e===`overview`?(t.track.corners??[]).map(e=>(0,Y.jsx)(Q,{color:`#dce7f2`,fontSize:.92,outlineColor:`#071019`,position:[e.position[0],.46,e.position[2]],text:`${e.number}`},e.number)):(0,Y.jsx)(We,{config:t,curve:n}),t.track.sectorMarks.map((e,t)=>(0,Y.jsx)(`group`,{position:q(n,e).position,rotation:[0,0,0],children:(0,Y.jsxs)(`mesh`,{rotation:[-Math.PI/2,0,0],children:[(0,Y.jsx)(`ringGeometry`,{args:[.24,.31,32]}),(0,Y.jsx)(`meshBasicMaterial`,{color:Oe[t],transparent:!0,opacity:.92,side:2})]})},e))]})}function Je({car:e,curve:t,garageBayIndex:n,index:r,isSelected:i,onSelectDriver:a,pitBoxCount:o,showStartingGridSlots:s,snapshotElapsedSeconds:c,track:l}){let u=(0,G.useRef)(null),d=(0,G.useRef)(!1),f=T(e=>e.invalidate),p=e.status===`retired`||e.status===`disqualified`||e.status===`dns`?`#5a5f63`:e.teamColor,m=(0,G.useMemo)(()=>je({borderColor:i?`#ffffff`:e.blueFlag?`#2f8dff`:e.overtakeStatus===`active`?`#4cff79`:e.status===`pit`?`#47ddff`:`#071018`,fillColor:p,isSelected:i,label:e.code}),[e.blueFlag,e.code,e.overtakeStatus,e.status,i,p]),h=(0,G.useMemo)(()=>Le(t,e,Ie(l,e,s),l,r,o,n,c).position.setY(.54),[e,t,n,r,o,s,c,l]);return(0,G.useEffect)(()=>()=>m.dispose(),[m]),D(()=>{let e=u.current;if(!e)return;let t=e.position.distanceToSquared(h);!d.current||t>2.25?(e.position.copy(h),d.current=!0,f()):t>4e-4?(e.position.lerp(h,.28),f()):e.position.copy(h)}),(0,Y.jsx)(`group`,{ref:u,children:(0,Y.jsx)(`sprite`,{onClick:t=>{t.stopPropagation(),a(e.driverId)},renderOrder:i?20:10,scale:i?[2.32,2.32,1]:[2.05,2.05,1],children:(0,Y.jsx)(`spriteMaterial`,{depthTest:!1,depthWrite:!1,map:m,transparent:!0})})})}function Ye({curve:e,elapsedSeconds:t,leader:n,phase:r,track:i}){let a=(0,G.useRef)(null),o=(0,G.useRef)(!1),s=T(e=>e.invalidate),c=r?.neutralisation?.kind===`safety-car`?r.neutralisation:null,d=c?.orangeLights??!0,f=c?.greenLight??!1,p=(0,G.useMemo)(()=>je({borderColor:f?`#55e887`:d?`#ff9d18`:`#d8e1e8`,fillColor:f?`#087f3f`:d?`#f4c430`:`#59636d`,label:`SC`}),[f,d]),m=(0,G.useMemo)(()=>{let r;if(c?.stage===`pit-entry`&&c.pitEntryAtSeconds!==null){let n=X((t-c.pitEntryAtSeconds)/7,0,1);r=q(e,u(i.pitLane?.entryProgress??.965,i.pitLane?.boxStartProgress??.976,n),$(i))}else{let t=c?c.safetyCarDistance%1:(n.progress+.012)%1;r=q(e,t,c?.stage===`deployed`||c?.pitLaneRouteRequired===!0&&l(t,i.pitLane?.entryProgress??.965,i.pitLane?.exitProgress??.13)?$(i):0)}return r.position.setY(.5)},[e,t,n.progress,c,i]);return(0,G.useEffect)(()=>()=>p.dispose(),[p]),D(()=>{let e=a.current;e&&(o.current?e.position.distanceToSquared(m)>3e-4?(e.position.lerp(m,.3),s()):e.position.copy(m):(e.position.copy(m),o.current=!0,s()))}),(0,Y.jsx)(`group`,{ref:a,children:(0,Y.jsx)(`sprite`,{renderOrder:10,scale:[2.05,2.05,1],children:(0,Y.jsx)(`spriteMaterial`,{depthTest:!1,depthWrite:!1,map:p,transparent:!0})})})}function Xe({curve:e,driverIdByCode:t,mode:n,onSelectDriver:r,overlay:i,selectedDriverId:a,track:o}){let s=(0,G.useRef)(new Map),l=(0,G.useRef)(null),u=T(e=>e.invalidate),d=(0,G.useMemo)(()=>q(e,0,o.width/2+1.5),[e,o.width]);return D(()=>{let t=performance.now();l.current===null&&(l.current=t);let n=Math.max(1e3,i.windowEndMs-i.windowStartMs),r=i.targetMs??i.windowStartMs+(t-l.current)%n;for(let t of i.cars){let n=s.current.get(t.driverNumber);if(!n)continue;let i=q(e,c(t,r),0);n.position.copy(i.position.setY(.46)),n.lookAt(n.position.clone().add(i.tangent))}u()}),(0,Y.jsxs)(`group`,{children:[(0,Y.jsx)(Q,{color:`#4bd8ff`,fontSize:.5,position:d.position.setY(.72),text:`OpenF1 ${n}`}),i.cars.map(e=>(0,Y.jsxs)(`group`,{onClick:n=>{n.stopPropagation();let i=t.get(e.code);i&&r(i)},ref:t=>{t?s.current.set(e.driverNumber,t):s.current.delete(e.driverNumber)},children:[(0,Y.jsxs)(`mesh`,{rotation:[-Math.PI/2,0,0],children:[(0,Y.jsx)(`circleGeometry`,{args:[t.get(e.code)===a?.4:.31,24]}),(0,Y.jsx)(`meshBasicMaterial`,{color:e.teamColor,transparent:!0,opacity:t.get(e.code)===a?1:.78})]}),(0,Y.jsx)(Q,{color:e.teamColor,fontSize:1,position:[0,.52,0],text:e.code})]},e.driverNumber))]})}function Ze({cameraMode:e,curve:t,selectedCar:n,selectedGarageBayIndex:r,pitBoxCount:i,selectedPitSlot:a,showStartingGridSlots:o,snapshotElapsedSeconds:s,track:c}){let{camera:l,invalidate:u,size:d}=T(),f=(0,G.useRef)(null),p=(0,G.useRef)(new _(0,0,0)),m=(0,G.useMemo)(()=>{let e=new w().setFromPoints(t.getSpacedPoints(320)),n=e.getCenter(new _),r=e.getSize(new _);return{center:n,halfDepth:r.z/2,halfWidth:r.x/2}},[t]),h=(0,G.useMemo)(()=>{let e=l instanceof fe?C.degToRad(l.fov):C.degToRad(48),t=Math.tan(e/2),n=Math.max(.5,d.width/Math.max(1,d.height)),r=2.8,i=Math.max(30,(m.halfDepth+r)/t,(m.halfWidth+r)/(t*n));return{position:new _(m.center.x,i,m.center.z+.01),target:new _(m.center.x,0,m.center.z)}},[l,m,d.height,d.width]),g=(0,G.useMemo)(()=>{let e=Le(t,n,Ie(c,n,o),c,a,i,r,s),l=e.position.setY(.5);return{chasePosition:l.clone().add(e.tangent.clone().multiplyScalar(-12)).add(new _(0,7.2,0)),target:l}},[t,i,n,r,a,o,s,c]);return D(()=>{let t=g.target;if(e===`overview`&&(l.position.lerp(h.position,.12),p.current.lerp(h.target,.08),l.lookAt(p.current),(l.position.distanceToSquared(h.position)>4e-4||p.current.distanceToSquared(h.target)>4e-4)&&u()),e===`chase`){let e=g.chasePosition;l.position.lerp(e,.28),p.current.lerp(t,.4),l.lookAt(p.current),(l.position.distanceToSquared(e)>4e-4||p.current.distanceToSquared(t)>4e-4)&&u()}e===`orbit`&&f.current&&(f.current.target.lerp(t,.1),f.current.update(),u())}),(0,Y.jsx)(se,{ref:f,enabled:e===`orbit`,enableDamping:!0,maxDistance:58,maxPolarAngle:Math.PI*.47,minDistance:8,onChange:()=>u(),target:[0,0,0]})}function Qe({cameraMode:e,config:t,curve:n,edgeLeft:r,edgeRight:i,onSelectDriver:o,openF1Overlay:c,openF1OverlayMode:l,roadGeometry:u,selectedDriverId:d,showSimulationCars:f=!0,snapshot:p}){let m=p.cars.find(e=>e.driverId===d)??p.cars[0],h=(0,G.useMemo)(()=>new Map(t.teams.map(e=>[e.id,a(t.teams,e.id)])),[t.teams]),g=(0,G.useMemo)(()=>{let e=new Map;for(let n of t.teams)t.drivers.filter(e=>e.teamId===n.id).forEach((t,n)=>e.set(t.id,n%2));return e},[t.drivers,t.teams]),_=h.get(m.teamId)??0,v=g.get(m.driverId)??0,y=(0,G.useMemo)(()=>new Map(t.drivers.map(e=>[e.code,e.id])),[t.drivers]),b=p.cars.find(e=>e.status===`running`&&e.pitPhase===`none`),ee=!!(b&&(p.flag===`sc`||p.formationBehindSafetyCar&&p.startProcedure===`formation`||p.restartProcedure===`rolling`)),x=(0,G.useMemo)(()=>p.flagPhase?.flag===`yellow`&&p.flagPhase.yellowZone?{severity:p.flagPhase.yellowSeverity??`single`,zone:p.flagPhase.yellowZone}:p.flagPhase===null&&p.timedYellowUntilSeconds!==null&&p.timedYellowProgress!==null&&p.timedYellowProgress!==void 0?{severity:`double`,zone:s(t.track,p.timedYellowProgress)}:{severity:null,zone:null},[t.track,p.flagPhase,p.timedYellowProgress,p.timedYellowUntilSeconds]);return(0,Y.jsxs)(Y.Fragment,{children:[(0,Y.jsx)(`ambientLight`,{intensity:1.1}),(0,Y.jsx)(`directionalLight`,{intensity:.8,position:[16,27,14]}),(0,Y.jsx)(qe,{cameraMode:e,config:t,curve:n,edgeLeft:r,edgeRight:i,roadGeometry:u,sectorFlags:p.sectorFlags,yellowSeverity:x.severity,yellowZone:x.zone}),ee&&b?(0,Y.jsx)(Ye,{curve:n,elapsedSeconds:p.elapsedSeconds,leader:b,phase:p.flagPhase,track:t.track}):null,f?p.cars.map(e=>e.hiddenFromTrack?null:(0,Y.jsx)(Je,{car:e,curve:n,garageBayIndex:g.get(e.driverId)??0,index:h.get(e.teamId)??0,isSelected:e.driverId===d,onSelectDriver:o,pitBoxCount:t.teams.length,showStartingGridSlots:p.startProcedure===`grid`||p.startProcedure===`lights`,snapshotElapsedSeconds:p.elapsedSeconds,track:t.track},e.driverId)):null,c&&c.cars.length>0?(0,Y.jsx)(Xe,{curve:n,driverIdByCode:y,mode:l,onSelectDriver:o,overlay:c,selectedDriverId:d,track:t.track}):null,(0,Y.jsx)(Ze,{cameraMode:e,curve:n,selectedCar:m,selectedGarageBayIndex:v,pitBoxCount:t.teams.length,selectedPitSlot:_,showStartingGridSlots:p.startProcedure===`grid`||p.startProcedure===`lights`,snapshotElapsedSeconds:p.elapsedSeconds,track:t.track})]})}function $e(e){let t=(0,G.useMemo)(()=>Te(e.config.track),[e.config.track]),n=Z(e.config.track),r=(0,G.useMemo)(()=>Ee(t,n),[t,n]),i=(0,G.useMemo)(()=>J(t,n,1),[t,n]),a=(0,G.useMemo)(()=>J(t,n,-1),[t,n]);return(0,Y.jsx)(oe,{camera:{fov:48,near:.1,far:220,position:[0,47,.01]},className:`race-canvas`,dpr:[1,1.35],frameloop:`demand`,gl:{alpha:!0,antialias:!0,powerPreference:`high-performance`},performance:{min:.7},shadows:!1,children:(0,Y.jsx)(G.Suspense,{fallback:null,children:(0,Y.jsx)(Qe,{...e,curve:t,edgeLeft:i,edgeRight:a,roadGeometry:r})})})}var et=class extends G.Component{state={failed:!1};static getDerivedStateFromError(){return{failed:!0}}render(){return this.state.failed?this.props.fallback:this.props.children}},tt=(0,G.lazy)(()=>d(()=>import(`./CinematicScene-CjuKD8q0.js`).then(e=>({default:e.CinematicScene})),__vite__mapDeps([0,1,2,3])));function nt(e){let[t,n]=(0,G.useState)(!1),[r,i]=(0,G.useState)(`tv`),[a,o]=(0,G.useState)(`medium`),[s,c]=(0,G.useState)(null),[l,u]=(0,G.useState)(!1),d=e.config.track.id===`suzuka-approx`&&e.dataMode===`SIM`&&e.snapshot.cars.every(e=>e.runtimeSystems.kind===`f1`)&&e.speed===1,f=t&&d,p=e.onCinematicChange;return(0,G.useEffect)(()=>p(f),[f,p]),(0,Y.jsxs)(`div`,{className:`race-view ${f?`cinematic-view`:``}`,children:[(0,Y.jsxs)(`div`,{className:`cinematic-toolbar`,children:[(0,Y.jsxs)(`div`,{className:`view-choice`,children:[(0,Y.jsx)(`button`,{type:`button`,"aria-pressed":!f,onClick:()=>n(!1),children:`Overview Map`}),(0,Y.jsx)(`button`,{type:`button`,disabled:!d,title:d?`Suzuka cinematic reconstruction`:`Cinematic: Suzuka / F1 / SIM / 1x required`,"aria-pressed":f,onClick:()=>n(!0),children:`Cinematic`})]}),f&&(0,Y.jsxs)(Y.Fragment,{children:[(0,Y.jsx)(`select`,{"aria-label":`Cinematic camera`,value:r,onChange:e=>i(e.target.value),children:Object.entries({tv:`TV Broadcast`,trackside:`Trackside`,chase:`Chase`,onboard:`Onboard`,helicopter:`Helicopter`,free:`Free Camera`}).map(([e,t])=>(0,Y.jsx)(`option`,{value:e,children:t},e))}),(0,Y.jsx)(`select`,{"aria-label":`Cinematic quality`,value:a,onChange:e=>o(e.target.value),children:[`high`,`medium`,`low`].map(e=>(0,Y.jsx)(`option`,{value:e,children:e.toUpperCase()},e))}),(0,Y.jsx)(`button`,{type:`button`,"aria-pressed":l,onClick:()=>u(e=>!e),children:`Metrics`}),(0,Y.jsx)(`button`,{type:`button`,onClick:e=>{let t=e.currentTarget.closest(`.race-view`);document.fullscreenElement?document.exitFullscreen():t?.requestFullscreen()},children:`Fullscreen`})]})]}),f?(0,Y.jsx)(et,{fallback:(0,Y.jsxs)(`div`,{className:`scene-loading`,children:[`Cinematic asset unavailable.`,` `,(0,Y.jsx)(`button`,{type:`button`,onClick:()=>n(!1),children:`Return to Overview Map`})]}),children:(0,Y.jsx)(G.Suspense,{fallback:(0,Y.jsx)(`div`,{className:`scene-loading`,children:`Loading Suzuka reconstruction…`}),children:(0,Y.jsx)(tt,{config:e.config,snapshot:e.snapshot,selected:e.selectedDriverId,paused:e.isPaused,quality:a,mode:r,onSelect:e.onSelectDriver,onMetrics:c})})}):(0,Y.jsx)($e,{...e}),f&&(0,Y.jsxs)(Y.Fragment,{children:[(0,Y.jsxs)(`div`,{className:`cinematic-caption`,children:[(0,Y.jsxs)(`strong`,{children:[`SUZUKA / `,r.toUpperCase()]}),(0,Y.jsx)(`span`,{children:`SIM · 2026 concept · DEM elevation`}),(0,Y.jsx)(`a`,{style:{pointerEvents:`auto`,color:`#d4e5e4`},href:`/cinematic/qvist-attribution.txt`,target:`_blank`,rel:`noreferrer`,children:`Model: Qvist_designs · CC BY 4.0 · adapted`}),(0,Y.jsx)(`small`,{children:`Reconstruction preview · local widths, facilities & vehicle pose estimated`})]}),l&&(0,Y.jsx)(`output`,{className:`cinematic-metrics`,children:s?`${s.fps.toFixed(1)} render fps · p95 ${s.p95Ms.toFixed(1)} ms\n${s.calls} calls · ${(s.triangles/1e3).toFixed(0)}k triangles\n${s.geometries} geometries · ${s.textures} textures\n${s.width}×${s.height} · GPU ${s.gpuMs===null?`unavailable`:s.gpuMs.toFixed(1)+` ms`}\nCPU submit ${s.renderCpuMs.toFixed(1)} ms · heap ${s.heapMiB?.toFixed(1)??`unavailable`} MiB\n${s.renderer}`:`Measuring…`})]})]})}export{nt as RaceView};