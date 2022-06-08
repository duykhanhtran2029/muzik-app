import { Song } from "./song.interface";

export interface RecognizableSong {
    id: string;
    songId: string;
    playableSong: Song;
}

export interface MatchedSong {
    song: RecognizableSong;
    score: number;
}
export interface FingerPrintingResult {
    matchedSongs: MatchedSong[];
    time: number;
}