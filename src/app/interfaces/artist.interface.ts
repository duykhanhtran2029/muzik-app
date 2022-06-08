export interface Artist {
    artistId : string;
    artistName : string;
    thumbnail : URL;
    likes: number,
    downloads: number,
    listens: number,
    numberOfSongs: number,
    isDeleted : boolean;
}

export interface RawArtist {
    artistId : string;
    artistName : string;
    thumbnail : URL;
    isDeleted : boolean;
}
