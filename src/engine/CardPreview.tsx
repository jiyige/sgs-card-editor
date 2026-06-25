import React, { useMemo, useCallback } from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import { useCardStore, useUIStore, useArtStore } from '../store';
import { buildCardTree } from './treeBuilder';
import { renderObj } from './renderer';
import { CARD_WIDTH, CARD_HEIGHT } from '../constants';

const CardPreview: React.FC = () => {
  const cardData = useCardStore();
  const artSrc = useArtStore((s) => s.currentArt);
  const previewScale = useUIStore((s) => s.previewScale);
  const setInteractionMode = useUIStore((s) => s.setInteractionMode);
  const selectedObjectId = useUIStore((s) => s.selectedObjectId);
  const setSelectedObjectId = useUIStore((s) => s.setSelectedObjectId);
  const updateLayoutField = useCardStore((s) => s.updateLayoutField);

  const tree = useMemo(() => {
    const t = buildCardTree(cardData);
    const artObj = t.children?.find((c) => c.id === 'art');
    if (artObj && artObj.kind === 'image') {
      (artObj as any).src = artSrc;
    }
    return t;
  }, [cardData, artSrc]);

  const handleSelect = useCallback((id: string) => {
    setSelectedObjectId(id);
    if (id === 'art') setInteractionMode('art');
    else if (id === 'nameArea' || id === 'title' || id === 'personName') setInteractionMode('title');
    else setInteractionMode('none');
  }, [setSelectedObjectId, setInteractionMode]);

  const handleStageClick = useCallback((e: any) => {
    if (e.target === e.target.getStage()) {
      setSelectedObjectId(null);
      setInteractionMode('none');
    }
  }, [setSelectedObjectId, setInteractionMode]);

  const handleObjDrag = useCallback((e: any) => {
    const { id, x, y } = e;
    if (id === 'art') {
      updateLayoutField('artX', Math.round(x));
      updateLayoutField('artY', Math.round(y));
    } else if (id === 'nameArea') {
      updateLayoutField('nameAreaX', Math.round(x));
      updateLayoutField('nameAreaY', Math.round(y));
    }
  }, [updateLayoutField]);

  const stageWidth = CARD_WIDTH * previewScale;
  const stageHeight = CARD_HEIGHT * previewScale;

  return (
    <Stage
      width={stageWidth}
      height={stageHeight}
      scaleX={previewScale}
      scaleY={previewScale}
      onClick={handleStageClick}
      onObjDrag={handleObjDrag as any}
    >
      <Layer>
        <Rect x={0} y={0} width={CARD_WIDTH} height={CARD_HEIGHT} fill="#1a1520" cornerRadius={cardData.layout.cardCornerRadius || 16} />
        {tree.children?.map((child) => renderObj(child, 0, 0, handleSelect))}
      </Layer>
    </Stage>
  );
};

export default CardPreview;
