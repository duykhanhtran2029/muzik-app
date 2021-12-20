import { Song } from "./song.interface";

export interface MatchedSong {
    song: Song;
    score: number;
}
export interface FingerPrintingResult {
    matchedSongs: MatchedSong[];
    time: number;
}