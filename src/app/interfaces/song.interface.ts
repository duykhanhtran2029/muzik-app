import { Artist } from './artist.interface';
import { Lyric } from './lyric.interface';
export interface Song {
  songId: string;
  songName: string;
  thumbnail: URL;
  link: URL;
  linkBeat: URL;
  linkLyric: URL;
  duration: number;
  releaseDate: Date;
  likes: number;
  downloads: number;
  listens: number;
  isDeleted: boolean;
  isRecognizable: boolean;
  artists: Artist[];
  artistsName: string;
}

export interface StreamState {
  playing: boolean;
  readableCurrentTime: string;
  readableDuration: string;
  duration: number | undefined;
  currentTime: number | undefined;
  canplay: boolean;
  error: boolean;
  volume: number;
  muted: boolean;
  song: Song;
  queue: Song[];
  recommendedSongs: Song[];
  shuffle: boolean;
  repeat: boolean;
  lyric: Lyric[];
  currentLyric: number;
}

export enum AudioEvent {
  ENDED = 'ended',
  ERROR = 'error',
  PLAY = 'play',
  PLAYING = 'playing',
  PAUSE = 'pause',
  TIMEUPDATE = 'timeupdate',
  CANPLAY = 'canplay',
  LOADEDMETADATA = 'loadedmetadata',
  LOADSTART = 'loadstart',
  VOLUMECHANGE = 'volumechange',
}

export interface History {
  songId: string;
  userId: string;
  count: number;
}
