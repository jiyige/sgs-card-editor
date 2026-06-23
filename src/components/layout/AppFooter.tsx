import React from 'react';

const AppFooter: React.FC = () => {
  return (
    <footer
      style={{
        height: 32,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderTop: '1px solid var(--color-border)',
        background: 'var(--color-bg-secondary)',
        fontSize: '0.7rem',
        color: 'var(--color-text-muted)',
      }}
    >
      三国杀卡牌编辑器 - 支持 PC 与移动端
    </footer>
  );
};

export default AppFooter;
