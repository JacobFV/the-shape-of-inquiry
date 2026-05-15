import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {SceneBase, BeatHeadline, LowerNarration, TopMeta} from '../components/Base';
import {LabImage, Callout} from '../components/LabPhoto';
import {
  CalibrationGrid,
  EquationBox,
  EventLanes,
  KineticList,
  MetricGrid,
  NodeGraph,
  PHStripGraphic,
  StateTree,
  UncertaintyField,
} from '../components/Procedural';
import {Beat} from '../data/timeline';
import {palette, font} from '../primitives/styles';
import {appear, clamp, pulse} from '../primitives/timing';

const Pipeline: React.FC<{items:string[]}> = ({items}) => {
  const frame=useCurrentFrame();
  return <div style={{position:'absolute', left:60, right:60, top:535, display:'grid', gap:14}}>
    {items.map((it,i)=><div key={it} style={{
      opacity:appear(frame,i*8,12), transform:`translateX(${interpolate(frame,[i*8,i*8+12],[-30,0],clamp)}px)`,
      display:'flex', alignItems:'center', gap:12
    }}>
      <div style={{width:34,height:34,borderRadius:17, background:i%2?palette.green:palette.blue}}/>
      <div style={{fontFamily:font.mono, color:palette.ink, fontSize:29, borderBottom:`1px solid ${palette.line}`, flex:1, paddingBottom:8}}>{it}</div>
    </div>)}
  </div>
};

const TopologyLoop: React.FC = () => {
  const items=['Unknown','Affordance','Instrument','Evidence','Compression','New Affordance'];
  const frame=useCurrentFrame();
  return <div style={{position:'absolute', left:65, right:65, top:420}}>
    {items.map((it,i)=><div key={it} style={{
      opacity:appear(frame,i*7,10), fontFamily:font.serif, color:palette.ink, fontSize:50, marginBottom:12,
      transform:`translateX(${interpolate(frame,[i*7,i*7+10],[-20,0],clamp)}px)`
    }}>
      <span style={{color:i%2?palette.green:palette.amber}}>{String(i+1).padStart(2,'0')}</span> {it}
    </div>)}
  </div>
};

const DualAccess: React.FC = () => (
  <>
    <div style={{position:'absolute', left:58, top:390, width:468, border:`1px solid ${palette.blue}`, background:'rgba(0,0,0,.45)', padding:24}}>
      <div style={{fontFamily:font.mono, color:palette.blue, fontSize:24}}>view(camera_id)</div>
      <div style={{fontFamily:font.serif, color:palette.ink, fontSize:40, marginTop:18}}>semantic perception</div>
    </div>
    <div style={{position:'absolute', right:58, top:570, width:468, border:`1px solid ${palette.green}`, background:'rgba(0,0,0,.45)', padding:24}}>
      <div style={{fontFamily:font.mono, color:palette.green, fontSize:24}}>exec(python_code)</div>
      <div style={{fontFamily:font.serif, color:palette.ink, fontSize:40, marginTop:18}}>measurement construction</div>
    </div>
    <EquationBox x={130} y={880} delay={48}>pixels → segmentation → estimator</EquationBox>
  </>
);

const FailureTiles: React.FC = () => {
  const tiles=['semantic chemist','novelty addict','calibration bureaucrat','passive observer'];
  return <div style={{position:'absolute', left:60, right:60, top:450, display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
    {tiles.map((t,i)=><div key={t} style={{border:`1px solid ${palette.red}`, padding:22, background:'rgba(0,0,0,.45)', minHeight:145, opacity:appear(useCurrentFrame(),i*9,12)}}>
      <div style={{fontFamily:font.serif, color:palette.ink, fontSize:38}}>{t}</div>
      <div style={{fontFamily:font.mono, color:palette.red, marginTop:12, fontSize:16}}>failure mode {i+1}</div>
    </div>)}
  </div>
};

const TrialBars: React.FC = () => {
  const frame=useCurrentFrame();
  const metrics=[['uncertainty',76,38],['actions',64,41],['latency',82,47],['calibration error',70,28]];
  return <div style={{position:'absolute', left:80, right:80, top:450}}>
    {metrics.map((m,i)=> {
      const after=interpolate(frame,[i*8+15,i*8+45],[m[1] as number,m[2] as number],clamp);
      return <div key={m[0]} style={{marginBottom:34}}>
        <div style={{fontFamily:font.mono, color:palette.muted, fontSize:20, textTransform:'uppercase', marginBottom:8}}>{m[0]}</div>
        <div style={{height:28, border:`1px solid ${palette.line}`, background:'rgba(255,255,255,.05)'}}>
          <div style={{height:'100%', width:`${after}%`, background:i%2?palette.green:palette.amber}}/>
        </div>
      </div>
    })}
  </div>
};

export const BeatScene: React.FC<{beat: Beat; index: number}> = ({beat, index}) => {
  const frame = useCurrentFrame();
  const visual = (() => {
    switch (beat.visual) {
      case 'labTitle':
        return <><LabImage crop="wide" opacity={0.72}/><UncertaintyField/><Callout x={62} y={360} label="calibration before answer" color={palette.amber}/></>;
      case 'hiddenLabor':
        return <><LabImage crop="samples" opacity={0.35}/><KineticList items={beat.micro}/></>;
      case 'pipeline':
        return <><Pipeline items={['segmentation','labels','task boundary','reward','clean trajectory']}/><EquationBox x={92} y={930} delay={54}>dataset = compressed prior labor</EquationBox></>;
      case 'typology':
        return <><NodeGraph/><EquationBox x={70} y={455} delay={10}>objective layer ≠ answer layer</EquationBox><EquationBox x={70} y={545} delay={45}>W_inst = ΔI + Δκ + ΔA − Cost − Risk</EquationBox></>;
      case 'labScan':
        return <><LabImage crop="wide" opacity={0.92}/><Callout x={70} y={410} label="safe unknown samples"/><Callout x={662} y={350} label="robot arm"/><Callout x={680} y={960} label="pH strips"/><Callout x={578} y={1070} label="calibration card"/></>;
      case 'labClose':
        return <><LabImage crop="arm" opacity={0.86}/><EquationBox x={70} y={630} delay={20}>colored strip ≠ calibrated evidence</EquationBox></>;
      case 'loop':
        return <><TopologyLoop/><UncertaintyField/></>;
      case 'sideBySide':
        return <><div style={{position:'absolute',left:58,top:360,width:440,height:520,border:`1px solid ${palette.blue}`,background:'rgba(0,0,0,.4)',padding:22}}><div style={{fontFamily:font.mono,color:palette.blue}}>semantic agency</div><div style={{fontFamily:font.serif,color:palette.ink,fontSize:42,marginTop:40}}>“I see a colored strip.”</div></div><div style={{position:'absolute',right:58,top:360,width:440,height:520,border:`1px solid ${palette.green}`,background:'rgba(0,0,0,.4)',padding:22}}><div style={{fontFamily:font.mono,color:palette.green}}>causal agency</div><div style={{fontFamily:font.serif,color:palette.ink,fontSize:42,marginTop:40}}>“I can measure pH with uncertainty.”</div></div></>;
      case 'dualAccess':
        return <><LabImage crop="camera" opacity={0.35}/><DualAccess/></>;
      case 'cameraCalibration':
        return <><LabImage crop="camera" opacity={0.55}/><KineticList items={beat.micro}/><EquationBox x={80} y={860} delay={48}>κₜ = (pose, color, lighting, tool, sensor)</EquationBox></>;
      case 'phMeasurement':
        return <><PHStripGraphic x={70} y={430} scale={1.25}/><CalibrationGrid x={84} y={705} scale={1.2}/><Pipeline items={['wet strip','capture frame','normalize color','estimate pH','update posterior']}/></>;
      case 'selfEffect':
        return <><StateTree/><EquationBox x={80} y={930} delay={20}>ρτ = I(Aₜ;Oₜ₊τ | O≤ₜ) / H(Oₜ₊τ | O≤ₜ)</EquationBox></>;
      case 'eventStreams':
        return <><EventLanes/><EquationBox x={70} y={1020} delay={60}>event(type, payload, parents, uncertainty)</EquationBox></>;
      case 'ledger':
        return <><Pipeline items={['fork worker','message / wait','merge evidence','preserve contradiction','update belief ledger']}/><EquationBox x={80} y={920} delay={65}>GLₜ₊₁ = merge(GLₜ, m₁…mₙ)</EquationBox></>;
      case 'curiosityField':
        return <><UncertaintyField/><EquationBox x={70} y={470} delay={10}>Curiosity = Vᵉᵖⁱ · H(R) · ΔA · (1−s) · Safe</EquationBox><EquationBox x={70} y={580} delay={60}>uncertainty welcomed only where it becomes traction</EquationBox></>;
      case 'compression':
        return <><NodeGraph/><EquationBox x={70} y={440} delay={10}>C = N · IG · ΔA · max(0, MDLₜ − MDLₜ₊₁)</EquationBox><Pipeline items={['new routine','less uncertainty','lower future cost']}/></>;
      case 'alignment':
        return <><StateTree/><EquationBox x={70} y={870} delay={10}>D_world ↔ D_latent</EquationBox><EquationBox x={70} y={960} delay={60}>intervention + transfer + recovery</EquationBox></>;
      case 'metrics':
        return <MetricGrid/>;
      case 'failureModes':
        return <FailureTiles/>;
      case 'trialImprovement':
        return <TrialBars/>;
      case 'organ':
        return <><LabImage crop="wide" opacity={0.62}/><EquationBox x={70} y={820} delay={20}>laboratory = cognitive organ</EquationBox><EquationBox x={70} y={920} delay={80}>measurement construction enters the objective</EquationBox></>;
      case 'plausibility':
        return <><NodeGraph/><KineticList items={beat.micro}/></>;
      case 'final':
        return <><LabImage crop="wide" opacity={0.26}/><div style={{position:'absolute',left:60,right:60,top:640,textAlign:'center'}}><div style={{fontFamily:font.serif,color:palette.ink,fontSize:84,lineHeight:.95,letterSpacing:-2}}>The Shape of Inquiry</div><div style={{fontFamily:font.mono,color:palette.amber,fontSize:20,letterSpacing:2.4,textTransform:'uppercase',marginTop:26}}>the first public glimpse of embodied scientific intelligence</div></div></>;
      default:
        return <NodeGraph/>;
    }
  })();

  return (
    <SceneBase>
      {visual}
      <TopMeta section={`${String(index+1).padStart(2,'0')} / ${beat.id.replaceAll('-', ' ')}`} time={`${beat.start}s`} />
      <BeatHeadline headline={beat.headline} micro={beat.micro} />
      <LowerNarration text={beat.narration} />
    </SceneBase>
  );
};
