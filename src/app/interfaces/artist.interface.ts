export interface Artist {
    artistId : string;
    artistName : string;
    thumbnailS : URL;
    thumbnailM : URL;
    thumbnailL : URL;
    likes: number,
    downloads: number,
    listens: number,
    numberOfSongs: number,
    isDeleted : boolean;
}