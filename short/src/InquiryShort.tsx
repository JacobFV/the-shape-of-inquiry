import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {beats, FPS, HEIGHT, TOTAL_SECONDS, WIDTH} from './data/timeline';
import {BeatScene} from './scenes/BeatScene';

export {FPS, WIDTH, HEIGHT};
export const TOTAL_FRAMES = TOTAL_SECONDS * FPS;

export const InquiryShortVertical: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: '#050505'}}>
      {beats.map((beat, index) => (
        <Sequence key={beat.id} from={beat.start * FPS} durationInFrames={beat.duration * FPS}>
          <BeatScene beat={beat} index={index} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const InquiryShortWide: React.FC = () => {
  // Wide variant currently letterboxes the vertical composition for screening exports.
  return (
    <AbsoluteFill style={{backgroundColor: '#050505', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{width: 607.5, height: 1080, transform: 'scale(1)', transformOrigin: 'center'}}>
        <InquiryShortVertical />
      </div>
    </AbsoluteFill>
  );
};
