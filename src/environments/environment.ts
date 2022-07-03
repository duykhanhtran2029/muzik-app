export const environment = {
  production: false,
  RECOGNIZE_API_URL: 'https://localhost:5001',
  MUSIC_API_URL: 'https://localhost:5101',
  RECOMMEND_API_URL: 'https://uit-music-recommendation.azurewebsites.net',
  AZURE_STORAGE_CONFIG: {
    STORAGE_ACCOUNT: 'muzik',
    /** Container */
    IMAGES_CONTAINER: 'images',
    SONGS_CONTAINER: 'songs',
    RECORDS_CONTAINER: 'records',
    BEATS_CONTAINER: 'beats',
    LYRICS_CONTAINER: 'lyrics',
    /** SAS */
    BEATS_SAS: 'sp=racwdli&st=2022-07-01T19:38:30Z&se=2023-07-02T03:38:30Z&sv=2021-06-08&sr=c&sig=pd%2FOlqllIq4fLbxk9281Wc9nRW9%2BEpbpjLYfb12V4bI%3D',
    IMAGES_SAS: 'sp=racwdli&st=2022-07-01T19:37:59Z&se=2023-07-02T03:37:59Z&sv=2021-06-08&sr=c&sig=%2Bzr2nqFTOUw494ftnzWacK9K6rXcP8oSfu%2FwSZEQaJE%3D',
    LYRICS_SAS: 'sp=racwdli&st=2022-07-01T19:37:35Z&se=2023-07-02T03:37:35Z&sv=2021-06-08&sr=c&sig=%2BGBfzUCmqhSx1Y2ToTT4bOiMXjyp9mkS73tlULTBs%2BU%3D',
    RECORDS_SAS: 'sp=racwdli&st=2022-07-01T19:37:14Z&se=2023-07-02T03:37:14Z&sv=2021-06-08&sr=c&sig=fCd5qo3Meoi3tlJ0MgNZjxPutWpgpbXettcizq%2FU%2BJg%3D',
    SONGS_SAS: 'sp=racwdli&st=2022-07-01T19:36:30Z&se=2023-07-02T03:36:30Z&sv=2021-06-08&sr=c&sig=nIkFVTk1aQcjKIejsfR5Oh8j8nmJd5TL%2F%2F1n9fcIkDk%3D',
  },
  AUTH0_CONFIG: {
    CLIENT_ID: 'IqB39JYw4zhnsmvjBaxCWyOSJzp5Obxf',
    DOMAIN: 'https://dev-music-player.eu.auth0.com',
    REDIRECT_URI: window.location.origin,
    RESPONSE_TYPE: 'code',
		SCOPE: 'read:users,read:roles,read:role_members',
    AUDIENCE: 'https://localhost:4200',
    ADMIN_ROLE_ID: 'rol_ikwrDz52CduoaWg8',
    API_CLIENT_ID: 'cR0sryN6DvLrHWI7OBR3S8IsQzw0fqfv',
    API_CLIENT_SECRET: 'WWXdk1O5jSeCj1R67pQLAAsxlgcL0_hQhB0eTAwLOVhPap6MbZNnYlJ8RWnIphOg',
    API_AUDIENCE: 'https://dev-music-player.eu.auth0.com/api/v2/'
  }
};
