export interface BusinessLine {
  id: string;
  name: string;
  code: string; // CMC / DMC / ECP / LIVE
}

export interface Studio {
  id: string;
  name: string;
  businessLines: BusinessLine[];
}

export interface Division {
  id: string;
  name: string;
  studios: Studio[];
}

export const BUSINESS_LINES: BusinessLine[] = [
  { id: 'cmc', name: '内容营销', code: 'CMC' },
  { id: 'dmc', name: '数字营销', code: 'DMC' },
  { id: 'ecp', name: '电商', code: 'ECP' },
  { id: 'live', name: '直播带货', code: 'LIVE' },
];

export const DIVISION: Division = {
  id: 'div-1',
  name: '数字营销事业部',
  studios: [
    {
      id: 'studio-1',
      name: '数字营销一室',
      businessLines: [BUSINESS_LINES[1]], // DMC
    },
    {
      id: 'studio-2',
      name: '数字营销二室',
      businessLines: [BUSINESS_LINES[1]], // DMC
    },
    {
      id: 'studio-3',
      name: '直播电商室',
      businessLines: [BUSINESS_LINES[2], BUSINESS_LINES[3]], // ECP + 直播带货
    },
    {
      id: 'studio-4',
      name: '内容创意室',
      businessLines: [BUSINESS_LINES[0]], // CMC
    },
  ],
};

export const ALL_STUDIOS = DIVISION.studios;
export const ALL_STUDIO_NAMES = ALL_STUDIOS.map((s) => s.name);

export function getStudioByName(name: string): Studio | undefined {
  return ALL_STUDIOS.find((s) => s.name === name);
}

export function getBusinessLinesByStudio(studioName: string): BusinessLine[] {
  return getStudioByName(studioName)?.businessLines ?? [];
}
