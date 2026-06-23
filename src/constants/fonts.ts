export interface FontOption {
  id: string;
  name: string;
  family: string;
  cssImport: string;
}

export const TITLE_FONTS: FontOption[] = [
  { id: 'serif-sc', name: '思源宋体', family: "'Noto Serif SC', serif", cssImport: '' },
  { id: 'ma-shan', name: '马山体', family: "'Ma Shan Zheng', cursive", cssImport: "@import url('https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&display=swap');" },
  { id: 'zcool-kai', name: '站酷楷体', family: "'ZCOOL XiaoWei', serif", cssImport: "@import url('https://fonts.googleapis.com/css2?family=ZCOOL+XiaoWei&display=swap');" },
];

export const NAME_FONTS: FontOption[] = [
  { id: 'serif-sc', name: '思源宋体', family: "'Noto Serif SC', serif", cssImport: '' },
  { id: 'ma-shan', name: '马山体', family: "'Ma Shan Zheng', cursive", cssImport: "@import url('https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&display=swap');" },
  { id: 'zcool-kai', name: '站酷楷体', family: "'ZCOOL XiaoWei', serif", cssImport: "@import url('https://fonts.googleapis.com/css2?family=ZCOOL+XiaoWei&display=swap');" },
  { id: 'liu-jian', name: '刘建毛草', family: "'Liu Jian Mao Cao', cursive", cssImport: "@import url('https://fonts.googleapis.com/css2?family=Liu+Jian+Mao+Cao&display=swap');" },
];

export const SKILL_FONTS: FontOption[] = [
  { id: 'serif-sc', name: '思源宋体', family: "'Noto Serif SC', serif", cssImport: '' },
  { id: 'sans-sc', name: '思源黑体', family: "'Noto Sans SC', sans-serif", cssImport: '' },
];
