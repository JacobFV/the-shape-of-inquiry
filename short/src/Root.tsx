import React from 'react';
import {Composition} from 'remotion';
import {FPS, HEIGHT, InquiryShortVertical, InquiryShortWide, TOTAL_FRAMES, WIDTH} from './InquiryShort';

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="InquiryShortVertical"
        component={InquiryShortVertical}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="InquiryShortWide"
        component={InquiryShortWide}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};
