// adapted from Gstreamer MIME Types (https://gstreamer.freedesktop.org/documentation/subparse/subparse.html?gi-language=c)
export type MimeType =
  | 'text/plain'
  | 'text/vtt'
  | 'application/x-subtitle' // .srt
  | 'application/x-subtitle-vtt' // .vtt
  | 'application/x-subtitle-sami'
  | 'application/x-subtitle-tmplayer'
  | 'application/x-subtitle-mpl2'
  | 'application/x-subtitle-dks'
  | 'application/x-subtitle-qttext'
  | 'application/x-subtitle-lrc';

export type AudioFormat = 'MPD' | 'HLS' | 'MP4' | 'DASH';

interface DrmScheme {
  name: string;
  licenseUri: string;
  headerTag?: string;
  headerData?: string;
}
interface TextTrack {
  label: string;
  language: string;
  uri: string;
  mimeType: MimeType;
}

export interface AudioSource {
  title: string;
  uri: string;
  format: AudioFormat;
  drmScheme?: DrmScheme;
  textTrack?: TextTrack[];
  uhd: boolean;
  secure: boolean;
  aCodec?: string;
  vCodec?: string;
}
