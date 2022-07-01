import { FingerPrintingResult } from "src/app/interfaces/fingerPrintingResult.interface";
import { Song } from "src/app/interfaces/song.interface";
import { ApiRequestStatus } from "src/app/utils/api-request-status.enum";

export interface CoreState {
    songs: Song[];
    fingerPrintingResult: FingerPrintingResult;
    getSongsStatus: ApiRequestStatus;
    fingerPrintingStatus: ApiRequestStatus;
    isAdmin: boolean;
    userId: string;
}
