import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Accordion from './Accordion';
import { Button, Input, Checkbox } from '../ui';
import { useCardStore, useUIStore } from '../../store';

const SkillEditor: React.FC<{ skillId: string; index: number; }> = ({ skillId, index }) => {
  const skill = useCardStore((s) => s.skills.find(sk => sk.id === skillId));
  const updateSkill = useCardStore((s) => s.updateSkill);
  const removeSkill = useCardStore((s) => s.removeSkill);
  const canDelete = useCardStore((s) => s.skills.length > 1);

  const editor = useEditor({
    extensions: [StarterKit],
    content: skill?.description || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      updateSkill(skillId, 'description', html);
    },
    editorProps: {
      attributes: {
        style: 'min-height: 60px; padding: 8px 12px; background: var(--color-bg-input); border: 1px solid var(--color-border); border-radius: 8px; color: var(--color-text-primary); font-size: 0.85rem; line-height: 1.6; outline: none; font-family: var(--font-body);',
        class: 'skill-rich-text-editor',
      },
    },
  });

  if (!skill) return null;

  const insertSymbol = (symbol: string) => {
    editor?.chain().focus().insertContent(symbol).run();
  };

  return (
    <div className="skill-editor">
      <div className="skill-editor__header">
        <span className="skill-editor__index">技能 #{index + 1}</span>
        {canDelete && (
          <Button variant="danger" size="sm" onClick={() => removeSkill(skillId)}>删除</Button>
        )}
      </div>

      <div className="skill-editor__row">
        <div className="skill-editor__name">
          <Input
            value={skill.name}
            onChange={(v) => updateSkill(skillId, 'name', v.slice(0, 2))}
            placeholder="2字技能名"
            size="sm"
            maxLength={2}
          />
        </div>
        <div className="skill-editor__checkbox">
          <Checkbox
            checked={skill.isDerived}
            onChange={(v) => updateSkill(skillId, 'isDerived', v)}
            label="衍生技"
          />
        </div>
      </div>

      {/* 工具栏 */}
      <div className="skill-editor__toolbar">
        <button
          className="skill-editor__toolbar-btn"
          title="加粗"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          style={{ fontWeight: 'bold' }}
        >
          B
        </button>
        <button
          className="skill-editor__toolbar-btn"
          title="斜体"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          style={{ fontStyle: 'italic' }}
        >
          I
        </button>
        <button
          className="skill-editor__toolbar-btn"
          title="换行"
          onClick={() => editor?.chain().focus().setHardBreak().run()}
        >
          ↵
        </button>
        <span style={{ width: 1, height: 20, background: 'var(--color-border)', margin: '0 4px' }} />
        <button className="skill-editor__toolbar-btn" title="红心" onClick={() => insertSymbol('\u2665')}>♥</button>
        <button className="skill-editor__toolbar-btn" title="黑桃" onClick={() => insertSymbol('\u2660')}>♠</button>
        <button className="skill-editor__toolbar-btn" title="方块" onClick={() => insertSymbol('\u2666')}>♦</button>
        <button className="skill-editor__toolbar-btn" title="梅花" onClick={() => insertSymbol('\u2663')}>♣</button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
};

const SkillPanel: React.FC = () => {
  const expanded = useUIStore((s) => s.expandedPanels.skills);
  const togglePanel = useUIStore((s) => s.togglePanel);
  const skills = useCardStore((s) => s.skills);
  const addSkill = useCardStore((s) => s.addSkill);
  const canAddMore = skills.length < 10;

  return (
    <Accordion
      id="skills"
      title={`技能设置 (${skills.length}/10)`}
      expanded={expanded}
      onToggle={() => togglePanel('skills')}
      icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M2 8h12M2 12h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>}
    >
      {skills.map((skill, idx) => (
        <SkillEditor key={skill.id} skillId={skill.id} index={idx} />
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
