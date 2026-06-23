import React from 'react';
import Accordion from './Accordion';
import { Button, Input, TextArea, Checkbox } from '../ui';
import { useCardStore, useUIStore } from '../../store';

const SkillPanel: React.FC = () => {
  const expanded = useUIStore((s) => s.expandedPanels.skills);
  const togglePanel = useUIStore((s) => s.togglePanel);
  const skills = useCardStore((s) => s.skills);
  const addSkill = useCardStore((s) => s.addSkill);
  const removeSkill = useCardStore((s) => s.removeSkill);
  const updateSkill = useCardStore((s) => s.updateSkill);

  const canAddMore = skills.length < 10;

  const insertTag = (skillId: string, field: 'description', tag: string) => {
    const skill = skills.find((s) => s.id === skillId);
    if (!skill) return;
    // For textarea, we use a simple approach: append the tag at cursor position
    // Since we can't easily get cursor position, append at end
    updateSkill(skillId, field, skill.description + tag);
  };

  return (
    <Accordion
      id="skills"
      title={`技能设置 (${skills.length}/10)`}
      expanded={expanded}
      onToggle={() => togglePanel('skills')}
      icon={
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2 4h12M2 8h12M2 12h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      }
    >
      {skills.map((skill, idx) => (
        <div key={skill.id} className="skill-editor">
          <div className="skill-editor__header">
            <span className="skill-editor__index">技能 #{idx + 1}</span>
            {skills.length > 1 && (
              <Button variant="danger" size="sm" onClick={() => removeSkill(skill.id)}>
                删除
              </Button>
            )}
          </div>

          <div className="skill-editor__row">
            <div className="skill-editor__name">
              <Input
                value={skill.name}
                onChange={(v) => updateSkill(skill.id, 'name', v)}
                placeholder="技能名称"
                size="sm"
              />
            </div>
            <div className="skill-editor__checkbox">
              <Checkbox
                checked={skill.isDerived}
                onChange={(v) => updateSkill(skill.id, 'isDerived', v)}
                label="衍生技"
              />
            </div>
          </div>

          {/* 格式化工具栏 */}
          <div className="skill-editor__toolbar">
            <button
              className="skill-editor__toolbar-btn"
              title="加粗 [b]文字[/b]"
              onClick={() => insertTag(skill.id, 'description', '[b][/b]')}
              style={{ fontWeight: 'bold' }}
            >
              B
            </button>
            <button
              className="skill-editor__toolbar-btn"
              title="斜体 [i]文字[/i]"
              onClick={() => insertTag(skill.id, 'description', '[i][/i]')}
              style={{ fontStyle: 'italic' }}
            >
              I
            </button>
            <button
              className="skill-editor__toolbar-btn"
              title="换行 [br]"
              onClick={() => insertTag(skill.id, 'description', '[br]')}
            >
              ↵
            </button>
            <span style={{ width: 1, height: 20, background: 'var(--color-border)', margin: '0 4px' }} />
            <button
              className="skill-editor__toolbar-btn"
              title="红心"
              onClick={() => insertTag(skill.id, 'description', ':heart:')}
            >
              ♥
            </button>
            <button
              className="skill-editor__toolbar-btn"
              title="黑桃"
              onClick={() => insertTag(skill.id, 'description', ':spade:')}
            >
              ♠
            </button>
            <button
              className="skill-editor__toolbar-btn"
              title="方块"
              onClick={() => insertTag(skill.id, 'description', ':diamond:')}
            >
              ♦
            </button>
            <button
              className="skill-editor__toolbar-btn"
              title="梅花"
              onClick={() => insertTag(skill.id, 'description', ':club:')}
            >
              ♣
            </button>
          </div>

          <TextArea
            value={skill.description}
            onChange={(v) => updateSkill(skill.id, 'description', v)}
            placeholder="输入技能描述。支持 [b]加粗[/b]、[i]斜体[/i]、[br]换行、花色符号 :heart: :spade: :diamond: :club:"
            rows={3}
          />
        </div>
      ))}

      {canAddMore && (
        <Button variant="ghost" onClick={addSkill} size="sm" className="animate-fade-in">
          + 添加技能
        </Button>
      )}
      {!canAddMore && (
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>已达到最大技能数量 (10个)</p>
      )}
    </Accordion>
  );
};

export default SkillPanel;
