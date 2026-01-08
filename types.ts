
export interface BingImage {
  startdate: string;
  fullstartdate: string;
  enddate: string;
  url: string;
  urlbase: string;
  copyright: string;
  copyrightlink: string;
  title: string;
  quiz: string;
  wp: boolean;
  hsh: string;
  drk: number;
  top: number;
  bot: number;
  hs: any[];
}

export interface Wallpaper {
  id: string;
  url: string;
  hdUrl: string;
  title: string;
  copyright: string;
  description?: string;
  date: string;
  location?: string;
}

export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark'
}
