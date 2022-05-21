import { Artist } from "./artist.interface";

export interface Song {
  songId: string,
  songName: string,
  thumbnailS: URL,
  thumbnailM: URL,
  thumbnailL: URL,
  link: URL,
  linkBeat: URL,
  linkLyric: URL,
  duration: number,
  releaseDate: Date,
  likes: number,
  downloads: number,
  listens: number,
  isDeleted: boolean,
  isRecognizable: boolean,
  artist: Artist[],
  artistsName: string
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
  VOLUMECHANGE = 'volumechange'
}