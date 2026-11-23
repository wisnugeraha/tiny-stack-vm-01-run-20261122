// Tiny stack VM — faithful interpreter of make.fun's tiny stack ISA v1 (compact).
// Run on the practice set:
//   mkdir -p out && MAKEFUN_INPUT_DIR=practice/input MAKEFUN_OUTPUT_DIR=out node main.ts
import{mkdirSync,readdirSync,readFileSync,writeFileSync}from"node:fs";
import{join}from"node:path";
const T={1:17,2:65,3:4,4:6,5:10,6:11,7:15,16:9,17:9,18:9,19:9,20:9,21:9,22:9,23:5,24:9,25:9,26:9,27:5,28:9,29:9,30:9,32:9,33:9,34:9,48:32,49:36,50:36,51:32,52:0,64:5,65:8,80:4,81:4,82:1,83:4,0:0};
function run(p,q){
let D=new Int32Array(256),C=new Int32Array(64),M=new Int32Array(256),o=new Uint8Array(65536),l=0,g=0,c=0,s=0,d=0,e=0;
const f=x=>({out:o.slice(0,l),code:x});
for(;;){
if(s==1e6)return f(10);
if(c<0||c>=p.length)return f(9);
let a=p[c],t=T[a];
if(t===undefined)return f(5);
let i=t>>4,n=(t>>2)&3,u=t&3;
if(c+i>=p.length)return f(9);
s++;
let w=c+1+i;
if(d<n)return f(2);
if(d-n+u>256)return f(3);
c=w;
switch(a){
case 0:return f(0);
case 1:D[d++]=(p[w-1]<<24)>>24;break;
case 2:D[d++]=p[w-4]|p[w-3]<<8|p[w-2]<<16|p[w-1]<<24;break;
case 3:d--;break;
case 4:D[d]=D[d-1];d++;break;
case 5:{let v=D[d-1];D[d-1]=D[d-2];D[d-2]=v;break;}
case 6:D[d]=D[d-2];d++;break;
case 7:{let v=D[d-3];D[d-3]=D[d-2];D[d-2]=D[d-1];D[d-1]=v;break;}
case 23:D[d-1]=-D[d-1]|0;break;
case 27:D[d-1]=~D[d-1];break;
case 16:case 17:case 18:case 19:case 20:case 21:case 22:case 24:case 25:case 26:case 28:case 29:case 30:case 32:case 33:case 34:{
let b=D[d-1],x=D[d-2],r;
if(a==16)r=(x+b)|0;
else if(a==17)r=(x-b)|0;
else if(a==18)r=Math.imul(x,b);
else if(a==19){if(!b)return f(4);r=x==-2147483648&&b==-1?x:(x/b)|0;}
else if(a==20){if(!b)return f(4);r=b==-1?0:(x%b)|0;}
else if(a==21){if(!b)return f(4);r=Math.floor((x>>>0)/(b>>>0))|0;}
else if(a==22){if(!b)return f(4);r=((x>>>0)%(b>>>0))|0;}
else if(a==24)r=x&b;
else if(a==25)r=x|b;
else if(a==26)r=x^b;
else if(a==28)r=x<<(b&31);
else if(a==29)r=x>>(b&31);
else if(a==30)r=(x>>>(b&31))|0;
else if(a==32)r=x==b?1:0;
else if(a==33)r=x<b?1:0;
else r=(x>>>0)<(b>>>0)?1:0;
d-=2;D[d++]=r;break;}
case 48:case 49:case 50:{
let v=((p[w-2]|p[w-1]<<8)<<16)>>16,take=1;
if(a!=48){let y=D[--d];take=a==49?y==0:y!=0;}
if(take)c=w+v;
break;}
case 51:
if(e==64)return f(7);
C[e++]=w;c=p[w-2]|p[w-1]<<8;break;
case 52:
if(!e)return f(8);
c=C[--e];break;
case 64:{let v=D[d-1];if(v<0||v>255)return f(6);D[d-1]=M[v];break;}
case 65:{let v=D[d-1],x=D[d-2];if(v<0||v>255)return f(6);d-=2;M[v]=x;break;}
case 80:{let v=String(D[d-1]);if(l+v.length>65536)return f(11);d--;for(let i=0;i<v.length;i++)o[l++]=v.charCodeAt(i);break;}
case 81:
if(l+1>65536)return f(11);
o[l++]=D[--d]&255;break;
case 82:D[d++]=g<q.length?q[g++]:-1;break;
case 83:return f(D[--d]&255);
}
}
}
const I=process.env.MAKEFUN_INPUT_DIR??"/input",O=process.env.MAKEFUN_OUTPUT_DIR??"/output";
for(const id of readdirSync(I).sort()){
let r=run(readFileSync(join(I,id,"program.bin")),readFileSync(join(I,id,"input.bin")));
mkdirSync(join(O,id),{recursive:!0});
writeFileSync(join(O,id,"stdout.bin"),r.out);
writeFileSync(join(O,id,"exit.txt"),r.code+"\n");
}
