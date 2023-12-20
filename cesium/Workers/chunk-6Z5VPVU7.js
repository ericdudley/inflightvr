/**
 * @license
 * Cesium - https://github.com/CesiumGS/cesium
 * Version 1.112
 *
 * Copyright 2011-2022 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/CesiumGS/cesium/blob/main/LICENSE.md for full licensing details.
 */

import{a as M}from"./chunk-CXKSXL5C.js";import{a as st}from"./chunk-IW442OVT.js";import{a as Z,b as H}from"./chunk-TU5B2BXL.js";import{a as V}from"./chunk-2EHQCUJI.js";import{a as U}from"./chunk-EOT3UPEC.js";import{b as it}from"./chunk-ZKNXHPHD.js";import{a as ct}from"./chunk-W5ZMPE2M.js";import{a as ot}from"./chunk-EQ7PMEBC.js";import{a as nt}from"./chunk-FDDSRMXI.js";import{b as K,c as X,d as z}from"./chunk-YYYI3I6L.js";import{f as J}from"./chunk-YIFABOF6.js";import{d as A}from"./chunk-KDW4RGIR.js";import{a as k}from"./chunk-VNDUYYBJ.js";import{a as w,b as q,c as et,d as F}from"./chunk-V624RX7A.js";import{a as I}from"./chunk-VZ2RFJ3P.js";import{a as tt}from"./chunk-RKPKWH3Z.js";import{e as x}from"./chunk-ZLUSVROX.js";function dt(n,i){this.positions=x(n)?n:[],this.holes=x(i)?i:[]}var rt=dt;function R(){this._array=[],this._offset=0,this._length=0}Object.defineProperties(R.prototype,{length:{get:function(){return this._length}}});R.prototype.enqueue=function(n){this._array.push(n),this._length++};R.prototype.dequeue=function(){if(this._length===0)return;let n=this._array,i=this._offset,u=n[i];return n[i]=void 0,i++,i>10&&i*2>n.length&&(this._array=n.slice(i),i=0),this._offset=i,this._length--,u};R.prototype.peek=function(){if(this._length!==0)return this._array[this._offset]};R.prototype.contains=function(n){return this._array.indexOf(n)!==-1};R.prototype.clear=function(){this._array.length=this._offset=this._length=0};R.prototype.sort=function(n){this._offset>0&&(this._array=this._array.slice(this._offset),this._offset=0),this._array.sort(n)};var $=R;var b={};b.computeHierarchyPackedLength=function(n,i){let u=0,c=[n];for(;c.length>0;){let r=c.pop();if(!x(r))continue;u+=2;let a=r.positions,t=r.holes;if(x(a)&&a.length>0&&(u+=a.length*i.packedLength),x(t)){let o=t.length;for(let e=0;e<o;++e)c.push(t[e])}}return u};b.packPolygonHierarchy=function(n,i,u,c){let r=[n];for(;r.length>0;){let a=r.pop();if(!x(a))continue;let t=a.positions,o=a.holes;if(i[u++]=x(t)?t.length:0,i[u++]=x(o)?o.length:0,x(t)){let e=t.length;for(let s=0;s<e;++s,u+=c.packedLength)c.pack(t[s],i,u)}if(x(o)){let e=o.length;for(let s=0;s<e;++s)r.push(o[s])}}return u};b.unpackPolygonHierarchy=function(n,i,u){let c=n[i++],r=n[i++],a=new Array(c),t=r>0?new Array(r):void 0;for(let o=0;o<c;++o,i+=u.packedLength)a[o]=u.unpack(n,i);for(let o=0;o<r;++o)t[o]=b.unpackPolygonHierarchy(n,i,u),i=t[o].startingIndex,delete t[o].startingIndex;return{positions:a,holes:t,startingIndex:i}};var O=new A;function ht(n,i,u,c){return A.subtract(i,n,O),A.multiplyByScalar(O,u/c,O),A.add(n,O,O),[O.x,O.y]}var G=new w;function gt(n,i,u,c){return w.subtract(i,n,G),w.multiplyByScalar(G,u/c,G),w.add(n,G,G),[G.x,G.y,G.z]}b.subdivideLineCount=function(n,i,u){let r=w.distance(n,i)/u,a=Math.max(0,Math.ceil(I.log2(r)));return Math.pow(2,a)};var j=new q,Q=new q,pt=new q,mt=new w,Y=new U;b.subdivideRhumbLineCount=function(n,i,u,c){let r=n.cartesianToCartographic(i,j),a=n.cartesianToCartographic(u,Q),o=new U(r,a,n).surfaceDistance/c,e=Math.max(0,Math.ceil(I.log2(o)));return Math.pow(2,e)};b.subdivideTexcoordLine=function(n,i,u,c,r,a){let t=b.subdivideLineCount(u,c,r),o=A.distance(n,i),e=o/t,s=a;s.length=t*2;let l=0;for(let h=0;h<t;h++){let f=ht(n,i,h*e,o);s[l++]=f[0],s[l++]=f[1]}return s};b.subdivideLine=function(n,i,u,c){let r=b.subdivideLineCount(n,i,u),a=w.distance(n,i),t=a/r;x(c)||(c=[]);let o=c;o.length=r*3;let e=0;for(let s=0;s<r;s++){let l=gt(n,i,s*t,a);o[e++]=l[0],o[e++]=l[1],o[e++]=l[2]}return o};b.subdivideTexcoordRhumbLine=function(n,i,u,c,r,a,t){let o=u.cartesianToCartographic(c,j),e=u.cartesianToCartographic(r,Q);Y.setEndPoints(o,e);let s=Y.surfaceDistance/a,l=Math.max(0,Math.ceil(I.log2(s))),h=Math.pow(2,l),f=A.distance(n,i),g=f/h,m=t;m.length=h*2;let p=0;for(let d=0;d<h;d++){let y=ht(n,i,d*g,f);m[p++]=y[0],m[p++]=y[1]}return m};b.subdivideRhumbLine=function(n,i,u,c,r){let a=n.cartesianToCartographic(i,j),t=n.cartesianToCartographic(u,Q),o=new U(a,t,n),e=o.surfaceDistance/c,s=Math.max(0,Math.ceil(I.log2(e))),l=Math.pow(2,s),h=o.surfaceDistance/l;x(r)||(r=[]);let f=r;f.length=l*3;let g=0;for(let m=0;m<l;m++){let p=o.interpolateUsingSurfaceDistance(m*h,pt),d=n.cartographicToCartesian(p,mt);f[g++]=d.x,f[g++]=d.y,f[g++]=d.z}return f};var yt=new w,xt=new w,wt=new w,bt=new w;b.scaleToGeodeticHeightExtruded=function(n,i,u,c,r){c=tt(c,et.WGS84);let a=yt,t=xt,o=wt,e=bt;if(x(n)&&x(n.attributes)&&x(n.attributes.position)){let s=n.attributes.position.values,l=s.length/2;for(let h=0;h<l;h+=3)w.fromArray(s,h,o),c.geodeticSurfaceNormal(o,a),e=c.scaleToGeodeticSurface(o,e),t=w.multiplyByScalar(a,u,t),t=w.add(e,t,t),s[h+l]=t.x,s[h+1+l]=t.y,s[h+2+l]=t.z,r&&(e=w.clone(o,e)),t=w.multiplyByScalar(a,i,t),t=w.add(e,t,t),s[h]=t.x,s[h+1]=t.y,s[h+2]=t.z}return n};b.polygonOutlinesFromHierarchy=function(n,i,u){let c=[],r=new $;r.enqueue(n);let a,t,o;for(;r.length!==0;){let e=r.dequeue(),s=e.positions;if(i)for(o=s.length,a=0;a<o;a++)u.scaleToGeodeticSurface(s[a],s[a]);if(s=V(s,w.equalsEpsilon,!0),s.length<3)continue;let l=e.holes?e.holes.length:0;for(a=0;a<l;a++){let h=e.holes[a],f=h.positions;if(i)for(o=f.length,t=0;t<o;++t)u.scaleToGeodeticSurface(f[t],f[t]);if(f=V(f,w.equalsEpsilon,!0),f.length<3)continue;c.push(f);let g=0;for(x(h.holes)&&(g=h.holes.length),t=0;t<g;t++)r.enqueue(h.holes[t])}c.push(s)}return c};var Lt=new q;function Tt(n,i,u){let c=u.cartesianToCartographic(n,j),r=u.cartesianToCartographic(i,Q);if(Math.sign(c.latitude)===Math.sign(r.latitude))return;Y.setEndPoints(c,r);let a=Y.findIntersectionWithLatitude(0,Lt);if(!x(a))return;let t=Math.min(c.longitude,r.longitude),o=Math.max(c.longitude,r.longitude);if(Math.abs(o-t)>I.PI){let e=t;t=o,o=e}if(!(a.longitude<t||a.longitude>o))return u.cartographicToCartesian(a)}function Et(n,i,u,c){if(c===M.RHUMB)return Tt(n,i,u);let r=it.lineSegmentPlane(n,i,ct.ORIGIN_XY_PLANE);if(x(r))return u.scaleToGeodeticSurface(r,r)}var vt=new q;function Ct(n,i,u){let c=[],r,a,t,o,e,s=0;for(;s<n.length;){r=n[s],a=n[(s+1)%n.length],t=I.sign(r.z),o=I.sign(a.z);let l=h=>i.cartesianToCartographic(h,vt).longitude;if(t===0)c.push({position:s,type:t,visited:!1,next:o,theta:l(r)});else if(o!==0){if(e=Et(r,a,i,u),++s,!x(e))continue;n.splice(s,0,e),c.push({position:s,type:t,visited:!1,next:o,theta:l(e)})}++s}return c}function lt(n,i,u,c,r,a,t){let o=[],e=a,s=h=>f=>f.position===h,l=[];do{let h=u[e];o.push(h);let f=c.findIndex(s(e)),g=c[f];if(!x(g)){++e;continue}let{visited:m,type:p,next:d}=g;if(g.visited=!0,p===0){if(d===0){let C=c[f-(t?1:-1)];if(C?.position===e+1)C.visited=!0;else{++e;continue}}if(!m&&t&&d>0||a===e&&!t&&d<0){++e;continue}}if(!(t?p>=0:p<=0)){++e;continue}m||l.push(e);let L=f+(t?1:-1),S=c[L];if(!x(S)){++e;continue}e=S.position}while(e<u.length&&e>=0&&e!==a&&o.length<u.length);n.splice(i,r,o);for(let h of l)i=lt(n,++i,u,c,0,h,!t);return i}b.splitPolygonsOnEquator=function(n,i,u,c){x(c)||(c=[]),c.splice(0,0,...n),c.length=n.length;let r=0;for(;r<c.length;){let a=c[r],t=a.slice();if(a.length<3){c[r]=t,++r;continue}let o=Ct(t,i,u);if(t.length===a.length||o.length<=1){c[r]=t,++r;continue}o.sort((s,l)=>s.theta-l.theta);let e=t[0].z>=0;r=lt(c,r,t,o,1,0,e)}return c};b.polygonsFromHierarchy=function(n,i,u,c,r,a){let t=[],o=[],e=new $;e.enqueue(n);let s=x(a);for(;e.length!==0;){let l=e.dequeue(),h=l.positions,f=l.holes,g,m;if(c)for(m=h.length,g=0;g<m;g++)r.scaleToGeodeticSurface(h[g],h[g]);if(i||(h=V(h,w.equalsEpsilon,!0)),h.length<3)continue;let p=u(h);if(!x(p))continue;let d=[],y=H.computeWindingOrder2D(p);if(y===Z.CLOCKWISE&&(p.reverse(),h=h.slice().reverse()),s){s=!1;let P=[h];if(P=a(P,P),P.length>1){for(let v of P)e.enqueue(new rt(v,f));continue}}let L=h.slice(),S=x(f)?f.length:0,C=[],T;for(g=0;g<S;g++){let P=f[g],v=P.positions;if(c)for(m=v.length,T=0;T<m;++T)r.scaleToGeodeticSurface(v[T],v[T]);if(i||(v=V(v,w.equalsEpsilon,!0)),v.length<3)continue;let E=u(v);if(!x(E))continue;y=H.computeWindingOrder2D(E),y===Z.CLOCKWISE&&(E.reverse(),v=v.slice().reverse()),C.push(v),d.push(L.length),L=L.concat(v),p=p.concat(E);let D=0;for(x(P.holes)&&(D=P.holes.length),T=0;T<D;T++)e.enqueue(P.holes[T])}t.push({outerRing:h,holes:C}),o.push({positions:L,positions2D:p,holes:d})}return{hierarchy:t,polygons:o}};var Pt=new A,Dt=new w,It=new J,St=new F;b.computeBoundingRectangle=function(n,i,u,c,r){let a=J.fromAxisAngle(n,c,It),t=F.fromQuaternion(a,St),o=Number.POSITIVE_INFINITY,e=Number.NEGATIVE_INFINITY,s=Number.POSITIVE_INFINITY,l=Number.NEGATIVE_INFINITY,h=u.length;for(let f=0;f<h;++f){let g=w.clone(u[f],Dt);F.multiplyByVector(t,g,g);let m=i(g,Pt);x(m)&&(o=Math.min(o,m.x),e=Math.max(e,m.x),s=Math.min(s,m.y),l=Math.max(l,m.y))}return r.x=o,r.y=s,r.width=e-o,r.height=l-s,r};b.createGeometryFromPositions=function(n,i,u,c,r,a,t){let o=H.triangulate(i.positions2D,i.holes);o.length<3&&(o=[0,1,2]);let e=i.positions,s=x(u),l=s?u.positions:void 0;if(r){let h=e.length,f=new Array(h*3),g=0;for(let d=0;d<h;d++){let y=e[d];f[g++]=y.x,f[g++]=y.y,f[g++]=y.z}let m={attributes:{position:new z({componentDatatype:k.DOUBLE,componentsPerAttribute:3,values:f})},indices:o,primitiveType:K.TRIANGLES};s&&(m.attributes.st=new z({componentDatatype:k.FLOAT,componentsPerAttribute:2,values:A.packArray(l)}));let p=new X(m);return a.normal?st.computeNormal(p):p}if(t===M.GEODESIC)return H.computeSubdivision(n,e,o,l,c);if(t===M.RHUMB)return H.computeRhumbLineSubdivision(n,e,o,l,c)};var ut=[],at=[],_t=new w,At=new w;b.computeWallGeometry=function(n,i,u,c,r,a){let t,o,e,s,l,h,f,g,m,p=n.length,d=0,y=0,L=x(i),S=L?i.positions:void 0;if(r)for(o=p*3*2,t=new Array(o*2),L&&(m=p*2*2,g=new Array(m*2)),e=0;e<p;e++)s=n[e],l=n[(e+1)%p],t[d]=t[d+o]=s.x,++d,t[d]=t[d+o]=s.y,++d,t[d]=t[d+o]=s.z,++d,t[d]=t[d+o]=l.x,++d,t[d]=t[d+o]=l.y,++d,t[d]=t[d+o]=l.z,++d,L&&(h=S[e],f=S[(e+1)%p],g[y]=g[y+m]=h.x,++y,g[y]=g[y+m]=h.y,++y,g[y]=g[y+m]=f.x,++y,g[y]=g[y+m]=f.y,++y);else{let E=I.chordLength(c,u.maximumRadius),D=0;if(a===M.GEODESIC)for(e=0;e<p;e++)D+=b.subdivideLineCount(n[e],n[(e+1)%p],E);else if(a===M.RHUMB)for(e=0;e<p;e++)D+=b.subdivideRhumbLineCount(u,n[e],n[(e+1)%p],E);for(o=(D+p)*3,t=new Array(o*2),L&&(m=(D+p)*2,g=new Array(m*2)),e=0;e<p;e++){s=n[e],l=n[(e+1)%p];let _,N;L&&(h=S[e],f=S[(e+1)%p]),a===M.GEODESIC?(_=b.subdivideLine(s,l,E,at),L&&(N=b.subdivideTexcoordLine(h,f,s,l,E,ut))):a===M.RHUMB&&(_=b.subdivideRhumbLine(u,s,l,E,at),L&&(N=b.subdivideTexcoordRhumbLine(h,f,u,s,l,E,ut)));let ft=_.length;for(let B=0;B<ft;++B,++d)t[d]=_[B],t[d+o]=_[B];if(t[d]=l.x,t[d+o]=l.x,++d,t[d]=l.y,t[d+o]=l.y,++d,t[d]=l.z,t[d+o]=l.z,++d,L){let B=N.length;for(let W=0;W<B;++W,++y)g[y]=N[W],g[y+m]=N[W];g[y]=f.x,g[y+m]=f.x,++y,g[y]=f.y,g[y+m]=f.y,++y}}}p=t.length;let C=ot.createTypedArray(p/3,p-n.length*6),T=0;for(p/=6,e=0;e<p;e++){let E=e,D=E+1,_=E+p,N=_+1;s=w.fromArray(t,E*3,_t),l=w.fromArray(t,D*3,At),!w.equalsEpsilon(s,l,I.EPSILON10,I.EPSILON10)&&(C[T++]=E,C[T++]=_,C[T++]=D,C[T++]=D,C[T++]=_,C[T++]=N)}let P={attributes:new nt({position:new z({componentDatatype:k.DOUBLE,componentsPerAttribute:3,values:t})}),indices:C,primitiveType:K.TRIANGLES};return L&&(P.attributes.st=new z({componentDatatype:k.FLOAT,componentsPerAttribute:2,values:g})),new X(P)};var se=b;export{se as a};
