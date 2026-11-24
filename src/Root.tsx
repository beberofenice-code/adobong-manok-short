import React from "react";
import { Composition } from "remotion";
import { AdoboShort, ADOBO_FRAMES } from "./videos/adobo/AdoboShort";
import { FPS } from "./videos/adobo/story";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="AdoboShort"
      component={AdoboShort}
      durationInFrames={ADOBO_FRAMES}
      fps={FPS}
      width={1080}
      height={1920}
    />
  </>
);
