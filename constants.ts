import { ProjectType } from './types';

export const GEMINI_TEXT_MODEL = 'gemini-2.5-flash';
export const GEMINI_IMAGE_MODEL = 'imagen-3.0-generate-002';

export const ART_STYLES: Record<ProjectType, string> = {
  [ProjectType.CLI]: 'minimalist, clean lines, black and white with a single accent color',
  [ProjectType.WEB_APP]: 'tech-noir, cyberpunk, neon-drenched, moody lighting',
  [ProjectType.GAME]: 'retro sci-fi, pulpy, vibrant colors, raygun gothic aesthetic',
  [ProjectType.UNKNOWN]: 'classic American comic book style, bold lines, primary colors',
};

export const CHARACTERS = [
  'a wise old wizard',
  'a cheerful engineer robot',
  'a daring rocket pilot',
  'a mysterious spy with gadgets',
  'a super-intelligent octopus programmer',
  'a powerful code golem',
];

export const IMAGE_GEN_FAILED = 'IMAGE_GEN_FAILED';