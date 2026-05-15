import React from 'react';
import {Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {palette} from '../primitives/styles';
import {clamp} from '../primitives/timing';

export const LabImage: React.FC<{
  crop?: 'wide' | 'arm' | 'samples' | 'camera' | 'controller';
  opacity?: number;
  scaleTo?: number;
}> = ({crop='wide', opacity=1, scaleTo=1.08}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, 240], [1, scaleTo], clamp);
  const pos = {
    wide: '48% 50%',
    arm: '55% 42%',
    samples: '25% 58%',
    camera: '80% 20%',
    controller: '82% 70%',
  }[crop];
  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', opacity}}>
      <Img src={staticFile('images/robot_lab_scene.png')} style={{
        width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos, transform: `scale(${scale})`,
        filter: 'contrast(1.08) saturate(.9) brightness(.78)'
      }} />
      <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,.25), rgba(0,0,0,.18) 48%, rgba(0,0,0,.7))'}} />
    </div>
  );
};

export const Callout: React.FC<{x:number; y:number; label:string; color?:string}> = ({x,y,label,color=palette.ink}) => (
  <div style={{
    position:'absolute', left:x, top:y, color, border:`1px solid ${color}88`, background:'rgba(0,0,0,.58)',
    padding:'7px 10px', fontFamily:'SF Mono, ui-monospace, monospace', fontSize:16, textTransform:'uppercase', letterSpacing:.9
  }}>{label}</div>
);
