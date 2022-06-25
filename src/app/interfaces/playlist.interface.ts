export interface Playlist{
  playlistId: string;
  playlistName: string;
  thumbnail: URL;
	userID: number;
	sortDescription: string;
  isDeleted: boolean;
  isPrivate: boolean;
}

export interface PlaylistSong{
  playlistId: string;
  songId: string;
}