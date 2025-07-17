
export enum ProjectType {
  CLI = 'CLI',
  WEB_APP = 'WEB_APP',
  GAME = 'GAME',
  UNKNOWN = 'UNKNOWN',
}

export interface SpeechBubble {
  character: string;
  text: string;
}

export enum PanelType {
    TITLE = 'TITLE',
    OVERVIEW = 'OVERVIEW',
    INSTALL = 'INSTALL',
    FEATURE = 'FEATURE',
    FINAL = 'FINAL'
}

export interface ComicPanelData {
  type: PanelType;
  visualDescription: string;
  narration: string;
  speech?: SpeechBubble[];
  imageUrl?: string;
}

export interface ComicScript {
  projectType: ProjectType;
  characterMap: { feature: string; character: string; }[];
  panels: ComicPanelData[];
}