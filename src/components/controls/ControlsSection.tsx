import React from 'react';
import BasicInfoPanel from './BasicInfoPanel';
import StatsPanel from './StatsPanel';
import AppearancePanel from './AppearancePanel';
import ArtPanel from './ArtPanel';
import SkillPanel from './SkillPanel';
import ExtraPanel from './ExtraPanel';
import BadgePanel from './BadgePanel';
import LayoutPanel from './LayoutPanel';

const ControlsSection: React.FC = () => {
  return (
    <div className="controls-section">
      <BasicInfoPanel />
      <StatsPanel />
      <AppearancePanel />
      <ArtPanel />
      <SkillPanel />
      <BadgePanel />
      <LayoutPanel />
      <ExtraPanel />
    </div>
  );
};

export default ControlsSection;
