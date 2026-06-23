import React, { useRef, useCallback } from 'react';
import { Stage, Layer } from 'react-konva';
import { useCardStore, useUIStore } from '../store';
import BorderLayer from './layers/BorderLayer';
import FactionLayer from './layers/FactionLayer';
import TitleLayer from './layers/TitleLayer';
import NameLayer from './layers/NameLayer';
import HpLayer from './layers/HpLayer';
import SkillLayer from './layers/SkillLayer';
import CopyrightLayer from './layers/CopyrightLayer';
import BadgeLayer from './layers/BadgeLayer';
import ArtLayer from './layers/ArtLayer';
import { CARD_WIDTH, CARD_HEIGHT } from '../constants';

interface CardPreviewProps {
  scale?: number;
  onStageClick?: (e: any) => void;
  onWheel?: (e: any) => void;
  draggable?: boolean;
}

const CardPreview: React.FC<CardPreviewProps> = ({
  scale = 0.85,
  onStageClick,
  onWheel,
  draggable = false,
}) => {
  const stageRef = useRef<any>(null);
  const interactionMode = useUIStore((s) => s.interactionMode);
  const setInteractionMode = useUIStore((s) => s.setInteractionMode);
  const layout = useCardStore((s) => s.layout);
  const updateLayoutField = useCardStore((s) => s.updateLayoutField);

  const stageWidth = CARD_WIDTH * scale;
  const stageHeight = CARD_HEIGHT * scale;

  const handleStageClick = useCallback((e: any) => {
    if (e.target === e.target.getStage()) {
      setInteractionMode('none');
      return;
    }
    const targetName = e.target.name?.();
    if (targetName === 'art-layer') {
      setInteractionMode('art');
    } else if (targetName === 'title-layer') {
      setInteractionMode('title');
    } else if (targetName === 'name-layer') {
      setInteractionMode('name');
    }
  }, [setInteractionMode]);

  const handleWheelInternal = useCallback((e: any) => {
    e.evt.preventDefault();
    if (interactionMode === 'art') {
      const delta = e.evt.deltaY > 0 ? -0.05 : 0.05;
      const newScale = Math.max(0.5, Math.min(2, layout.artScale + delta));
      updateLayoutField('artScale', newScale);
    } else {
      onWheel?.(e);
    }
  }, [interactionMode, layout.artScale, updateLayoutField, onWheel]);

  return (
    <Stage
      width={stageWidth}
      height={stageHeight}
      scaleX={scale}
      scaleY={scale}
      onClick={handleStageClick}
      onWheel={handleWheelInternal}
      draggable={draggable}
      ref={stageRef}
    >
      <Layer>
        <ArtLayer />
        <BorderLayer />
        <FactionLayer />
        <TitleLayer />
        <NameLayer />
        <HpLayer />
        <SkillLayer />
        <CopyrightLayer />
        <BadgeLayer />
      </Layer>
    </Stage>
  );
};

export default CardPreview;
