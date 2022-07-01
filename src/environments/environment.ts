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
    BEATS_SAS: 'sv=2021-06-08&se=2023-07-01T14%3A36%3A48Z&sr=c&sp=racwdxltfi&sig=nf6qahCmw46%2FHDfTvkuBNONCHQb8mtBbWFdm%2Fx9XkFo%3D',
    IMAGES_SAS: 'sv=2021-06-08&se=2023-07-01T14%3A36%3A48Z&sr=c&sp=racwdxltfi&sig=VzhJjDpMVqHwAaig%2BQvImQ7ZL4%2BK06%2BTRBYN0c4co%2B4%3D',
    LYRICS_SAS: 'sv=2021-06-08&se=2023-07-01T14%3A36%3A48Z&sr=c&sp=racwdxltfi&sig=fN78yG49372qUvIN4d11j5%2BUXxD5TwWzLkLK4z5NHhs%3D',
    RECORDS_SAS: 'sv=2021-06-08&se=2023-07-01T14%3A36%3A48Z&sr=c&sp=racwdxltfi&sig=5UvoJnTTi%2B%2FDl2KWNWmsg71%2BIxXm8u1LDX3grdAVIMg%3D',
    SONGS_SAS: 'sv=2021-06-08&se=2023-07-01T14%3A36%3A48Z&sr=c&sp=racwdxltfi&sig=czjlXASMMqrbnDzRTASyxGm7c5nckmOzSIDe4fuy9lE%3D',
  },
  AUTH0_CONFIG: {
    CLIENT_ID: 's7t6cdqpEvgHDlbQNfsdh2td42tBHEdC',
    API_CLIENT_ID: 'cR0sryN6DvLrHWI7OBR3S8IsQzw0fqfv',
    API_CLIENT_SECRET: 'WWXdk1O5jSeCj1R67pQLAAsxlgcL0_hQhB0eTAwLOVhPap6MbZNnYlJ8RWnIphOg',
    DOMAIN: 'https://dev-music-player.eu.auth0.com',
    REDIRECT_URI: window.location.origin,
    RESPONSE_TYPE: 'code',
		SCOPE: 'read:users read:roles read:role_members',
    AUDIENCE: 'https://dev-music-player.eu.auth0.com/api/v2/',
    ADMIN_ROLE_ID: 'rol_ikwrDz52CduoaWg8'
  }
};
