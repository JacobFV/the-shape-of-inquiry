import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {palette} from '../primitives/styles';
import {sceneOpacity} from '../primitives/timing';

export const SceneBase: React.FC<{children: React.ReactNode}> = ({children}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const op = sceneOpacity(frame, durationInFrames, 10);
  return (
    <AbsoluteFill style={{
      opacity: op,
      background: `radial-gradient(circle at 70% 18%, rgba(217,174,114,0.24), transparent 34%), linear-gradient(180deg, ${palette.black}, ${palette.labBlack} 58%, #15120d)`,
      overflow: 'hidden',
    }}>
      <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(0,0,0,0.62), transparent 52%, rgba(0,0,0,0.42))'}} />
      {children}
      <Grain />
    </AbsoluteFill>
  );
};

export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{
      pointerEvents: 'none',
      opacity: 0.11,
      mixBlendMode: 'overlay',
      backgroundImage: `radial-gradient(circle at ${frame%93}px ${(frame*3)%111}px, rgba(255,255,255,.35) 0 1px, transparent 1.1px),
        radial-gradient(circle at ${(frame*5)%127}px ${(frame*7)%101}px, rgba(0,0,0,.40) 0 1px, transparent 1.1px)`,
      backgroundSize: '49px 49px, 83px 83px',
    }} />
  );
};

export const TopMeta: React.FC<{section: string; time?: string}> = ({section, time}) => (
  <div style={{
    position: 'absolute', top: 54, left: 52, right: 52, display: 'flex', justifyContent: 'space-between',
    color: palette.dim, fontFamily: 'SF Mono, ui-monospace, monospace', fontSize: 19, letterSpacing: 1.2,
    textTransform: 'uppercase'
  }}>
    <span>{section}</span><span>{time ?? 'The Shape of Inquiry'}</span>
  </div>
);

export const BeatHeadline: React.FC<{headline: string; micro: string[]}> = ({headline, micro}) => {
  const frame = useCurrentFrame();
  const y = interpolate(frame, [0, 18], [34, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const op = interpolate(frame, [0, 16], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', left: 58, right: 58, bottom: 205, opacity: op, transform: `translateY(${y}px)`}}>
      <div style={{fontFamily: 'Libertinus Serif, Georgia, serif', color: palette.ink, fontSize: 54, lineHeight: 1.02, letterSpacing: -1.4, textShadow: '0 3px 22px rgba(0,0,0,.65)'}}>
        {headline}
      </div>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 18}}>
        {micro.slice(0, 5).map((m, i) => (
          <span key={m} style={{
            color: i % 2 ? palette.green : palette.amber, border: `1px solid ${(i%2?palette.green:palette.amber)}77`,
            padding: '7px 10px', fontSize: 16, fontFamily: 'SF Mono, ui-monospace, monospace',
            textTransform: 'uppercase', letterSpacing: .8, background: 'rgba(0,0,0,.42)'
          }}>{m}</span>
        ))}
      </div>
    </div>
  );
};

export const LowerNarration: React.FC<{text: string}> = ({text}) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [7, 22], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{
      position: 'absolute', left: 58, right: 58, bottom: 74, color: palette.ink, opacity: op,
      fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif', fontSize: 24, lineHeight: 1.25,
      background: 'rgba(0,0,0,.42)', padding: '14px 16px', borderLeft: `3px solid ${palette.tungsten}`,
    }}>
      {text}
    </div>
  );
};
