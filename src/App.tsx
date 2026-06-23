import React from 'react';
import AppHeader from './components/layout/AppHeader';
import Workspace from './components/layout/Workspace';
import AppFooter from './components/layout/AppFooter';
import { Toast } from './components/ui';
import { useAutoSave } from './hooks/useAutoSave';
import './styles/global.css';
import './styles/animations.css';
import './styles/layout.css';
import './styles/components/form.css';
import './styles/components/button.css';
import './styles/components/accordion.css';
import './styles/components/modal.css';
import './styles/components/upload.css';
import './styles/components/skill-editor.css';

const App: React.FC = () => {
  useAutoSave();

  return (
    <div className="app-container">
      <AppHeader />
      <Workspace />
      <AppFooter />
      <Toast />
    </div>
  );
};

export default App;
