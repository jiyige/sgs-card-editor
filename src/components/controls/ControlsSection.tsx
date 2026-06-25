import React from 'react';
import BasicInfoPanel from './BasicInfoPanel';
import StatsPanel from './StatsPanel';
import ArtPanel from './ArtPanel';
import SkillPanel from './SkillPanel';

interface ControlsSectionProps {
  noWrapper?: boolean;
}

const ControlsSection: React.FC<ControlsSectionProps> = ({ noWrapper }) => {
  const content = (
    <>
      <BasicInfoPanel />
      <StatsPanel />
      <ArtPanel />
      <SkillPanel />
    </>
  );

  if (noWrapper) return content;
  return <div className="controls-section">{content}</div>;
};

export default ControlsSection;
