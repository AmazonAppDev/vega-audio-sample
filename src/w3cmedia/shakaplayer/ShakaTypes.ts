import { AudioSource } from '../../types/AudioSource';

export interface PlayerInterface {
  load(content: AudioSource, autoplay: boolean): void;
  play(): void;
  pause(): void;
  seekBack(): void;
  seekFront(): void;
  unload(): void;
}
export interface ServerMap {
  [index: string]: string;
}
export interface ShakaPlayerSettings {
  secure: boolean;
  abrEnabled: boolean;
  abrMaxWidth?: number;
  abrMaxHeight?: number;
}
