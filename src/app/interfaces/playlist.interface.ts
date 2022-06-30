export interface Playlist{
  playlistId: string;
  playlistName: string;
  thumbnail: URL;
	userID: string;
	sortDescription: string;
  isDeleted: boolean;
  isPrivate: boolean;
}

export interface PlaylistSong{
  playlistId: string;
  songId: string;
}