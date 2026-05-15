import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {palette, font} from '../primitives/styles';
import {appear, clamp, pulse} from '../primitives/timing';

export const EquationBox: React.FC<{children: React.ReactNode; x:number; y:number; delay?:number; color?:string}> = ({children,x,y,delay=0,color=palette.ink}) => {
  const frame = useCurrentFrame();
  const op = appear(frame, delay, 14);
  const tx = interpolate(frame, [delay, delay+16], [24, 0], clamp);
  return <div style={{
    position:'absolute', left:x, top:y, opacity:op, transform:`translateX(${tx}px)`,
    color, fontFamily:font.mono, fontSize:22, lineHeight:1.15, border:`1px solid ${color}66`, background:'rgba(0,0,0,.54)', padding:'11px 13px',
  }}>{children}</div>;
};

export const KineticList: React.FC<{items:string[]; x?:number; y?:number}> = ({items,x=80,y=410}) => {
  const frame = useCurrentFrame();
  return <div style={{position:'absolute', left:x, top:y, display:'grid', gap:12}}>
    {items.map((item,i)=>{
      const op=appear(frame, i*7, 10);
      const tx=interpolate(frame,[i*7,i*7+12],[-18,0],clamp);
      return <div key={item} style={{
        opacity:op, transform:`translateX(${tx}px)`, color:palette.ink, fontFamily:font.mono,
        fontSize:25, letterSpacing:.8, textTransform:'uppercase', borderLeft:`3px solid ${i%2?palette.green:palette.amber}`,
        padding:'9px 12px', background:'rgba(0,0,0,.46)'
      }}>{item}</div>
    })}
  </div>
};

export const EventLanes: React.FC = () => {
  const frame = useCurrentFrame();
  const lanes = ['visual','motor','tool','calibration','thought','judge/train'];
  return <div style={{position:'absolute', left:60, right:60, top:440}}>
    {lanes.map((lane,i)=><div key={lane} style={{height:70, display:'flex', alignItems:'center', gap:12}}>
      <div style={{width:155, fontFamily:font.mono, color:palette.muted, fontSize:17, textTransform:'uppercase'}}>{lane}</div>
      <div style={{height:1, flex:1, background:palette.line, position:'relative'}}>
        {Array.from({length:9},(_,j)=>{
          const op=appear(frame, i*8+j*6, 8);
          return <div key={j} style={{
            position:'absolute', left:`${j*11+2}%`, top:-9, width:18, height:18, borderRadius:9,
            border:`1px solid ${palette.ink}`, background:i%2?palette.green:palette.blue, opacity:op
          }}/>
        })}
      </div>
    </div>)}
  </div>
};

export const StateTree: React.FC = () => {
  const frame = useCurrentFrame();
  return <svg style={{position:'absolute', left:80, top:330}} width={920} height={600} viewBox="-460 -80 920 600">
    {Array.from({length:4},(_,d)=>Array.from({length:2**d},(_,i)=>{
      const x=(i-(2**d-1)/2)*(580/(2**Math.max(d-1,0)));
      const y=d*115;
      const op=appear(frame,d*12+i*3,12);
      return <circle key={`${d}-${i}`} cx={x} cy={y} r={9} fill={d===0?palette.amber:palette.green} opacity={op}/>
    }))}
    {Array.from({length:3},(_,d)=>Array.from({length:2**d},(_,i)=>{
      const x=(i-(2**d-1)/2)*(580/(2**Math.max(d-1,0)));
      const y=d*115;
      return [0,1].map(k=>{
        const ci=i*2+k; const cx=(ci-(2**(d+1)-1)/2)*(580/(2**Math.max(d,0)));
        const op=appear(frame,d*12+i*3,12);
        return <line key={`${d}-${i}-${k}`} x1={x} y1={y} x2={cx} y2={y+115} stroke={palette.line} strokeWidth={2} opacity={op}/>
      })
    }))}
  </svg>
};

export const UncertaintyField: React.FC = () => {
  const frame = useCurrentFrame();
  return <svg style={{position:'absolute', inset:0}} width={1080} height={1920}>
    {Array.from({length:28},(_,i)=>{
      const y=(i/27)*1920; const d=Array.from({length:9},(_,j)=>{
        const x=(j/8)*1080; const off=Math.sin(j*.9+i*.45+frame/35)*42;
        return `${j?'L':'M'} ${x.toFixed(1)} ${(y+off).toFixed(1)}`
      }).join(' ');
      return <path key={i} d={d} fill="none" stroke={palette.line} strokeWidth={1} opacity={0.20}/>
    })}
  </svg>
};

export const NodeGraph: React.FC = () => {
  const frame=useCurrentFrame();
  const nodes=Array.from({length:32},(_,i)=>({x:540+Math.cos(i*2.1)*(130+(i%5)*34), y:720+Math.sin(i*1.3)*(100+(i%4)*45)}));
  return <svg style={{position:'absolute', inset:0}} width={1080} height={1920}>
    {nodes.map((a,i)=>nodes.slice(i+1).map((b,j)=>(i+j)%7===0?<line key={`${i}-${j}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={palette.line} opacity={0.25}/>:null))}
    {nodes.map((n,i)=><circle key={i} cx={n.x} cy={n.y} r={5+(i%4)} fill={i%3?palette.blue:palette.amber} opacity={appear(frame,i*2,10)}/>)}
  </svg>
};

export const PHStripGraphic: React.FC<{x?:number;y?:number;scale?:number}> = ({x=100,y=430,scale=1}) => {
  const colors=['#f4f1e8','#e8c35d','#df9149','#a1a667','#6d9678','#758ebb','#7a6ca9'];
  return <div style={{position:'absolute', left:x, top:y, transform:`scale(${scale})`, transformOrigin:'top left', display:'flex', gap:6}}>
    {colors.map((c,i)=><div key={c} style={{width:58, height:170, background:c, border:'1px solid rgba(0,0,0,.35)', opacity:appear(useCurrentFrame(),i*8,10)}}/> )}
  </div>
};

export const CalibrationGrid: React.FC<{x?:number;y?:number;scale?:number}> = ({x=100,y=660,scale=1}) => {
  const c=['#f0c15a','#e58b4f','#b85e5c','#8b6fb0','#5a7d9b','#7da868','#b8b45d','#d6d6c9'];
  return <div style={{position:'absolute', left:x, top:y, transform:`scale(${scale})`, transformOrigin:'top left', display:'grid', gridTemplateColumns:'repeat(4, 52px)', gap:8, padding:12, background:'#ddd8c8'}}>
    {c.concat([...c].reverse()).map((color,i)=><div key={i} style={{width:52, height:36, background:color}} />)}
  </div>
};

export const MetricGrid: React.FC = () => {
  const frame=useCurrentFrame();
  const rows=[
    ['epistemic gain','H(Θ|hₜ) − H(Θ|hₜ,a,o)'],
    ['self-effect','I(Aₜ;Oₜ₊τ|O≤ₜ) / H(Oₜ₊τ|O≤ₜ)'],
    ['calibration gain','U_pre(m) − U_post(m)'],
    ['world-touch ratio','causal interventions / verbal events'],
    ['cosplay penalty','unsupported claims / event-grounded claims'],
  ];
  return <div style={{position:'absolute', left:62, right:62, top:430, display:'grid', gap:10}}>
    {rows.map((r,i)=><div key={r[0]} style={{
      opacity:appear(frame,i*8,10), display:'grid', gridTemplateColumns:'240px 1fr', gap:12, alignItems:'center',
      border:`1px solid ${palette.line}`, background:'rgba(0,0,0,.45)', padding:'12px 14px'
    }}>
      <div style={{fontFamily:font.mono, color:palette.amber, textTransform:'uppercase', fontSize:17}}>{r[0]}</div>
      <div style={{fontFamily:font.mono, color:palette.ink, fontSize:22}}>{r[1]}</div>
    </div>)}
  </div>
};
