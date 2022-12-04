export interface Video {
  header: string;
  title: string;
  titleUrl: string;
  subtitles: Array<{ name: string; url: string }>;
  time: string;
  products: Array<string>;
  activityControls: Array<string>;
}
