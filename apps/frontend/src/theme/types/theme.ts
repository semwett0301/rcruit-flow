export type FontKey =
  | 'firstHeading'
  | 'secondHeading'
  | 'thirdHeading'
  | 'regular'
  | 'button';

export type SpacingKey = 'xs' | 's' | 'm' | 'l' | 'xl';
export type RadiusKey = 'xs' | 's' | 'm';

type ColorKey =
  | 'brightBlue'
  | 'darkerBlue'
  | 'lighterBlue'
  | 'white'
  | 'backgroundBlue'
  | 'blackBlue'
  | 'red'
  | 'green';

export interface FontStyle {
  fontFamily: string;
  fontWeight: number;
  fontSize: string;
  lineHeight: string;
}

export interface Theme {
  fontStyles: Record<FontKey, FontStyle>;
  colors: Record<ColorKey, string>;
  spacing: Record<SpacingKey, string>;
  radius: Record<RadiusKey, string>;
}
