export const environment = {
  production: false,
  RECOGNIZE_API_URL: 'https://localhost:5001',
  MUSIC_API_URL: 'https://localhost:5101',
  RECOMMEND_API_URL: 'https://uit-music-recommendation.azurewebsites.net',
  AZURE_STORAGE_CONFIG: {
    STORAGE_ACCOUNT: 'shazam',
    /** Container */
    IMAGES_CONTAINER: 'images',
    SONGS_CONTAINER: 'songs',
    RECORDS_CONTAINER: 'records',
    BEATS_CONTAINER: 'beats',
    LYRICS_CONTAINER: 'lyrics',
    /** SAS */
    IMAGES_SAS: 'sp=racwdl&st=2022-06-27T17:42:48Z&se=2023-06-28T01:42:48Z&sv=2021-06-08&sr=c&sig=%2Fmf7kM5KOBxfO4eVnQxhXCpQzbvpSxhyuyEhq9Nsjlc%3D',
    SONGS_SAS: 'sp=racwdl&st=2022-06-27T17:46:07Z&se=2023-06-28T01:46:07Z&sv=2021-06-08&sr=c&sig=R7apxT%2BgknANSHVngYn00CWqhSjjGQD3rT7%2BpeV9tTU%3D',
    RECORDS_SAS: 'sp=racwdl&st=2022-06-27T17:45:14Z&se=2023-06-28T01:45:14Z&sv=2021-06-08&sr=c&sig=otY8l0Ve4bWOXzoezUGg0wvyJ%2FDyRpkAMDYudBcynG8%3D',
    LYRICS_SAS: 'sp=racwdl&st=2022-06-27T17:44:09Z&se=2023-06-28T01:44:09Z&sv=2021-06-08&sr=c&sig=kxnZrVhl7vdSluNt7OtslaEVxQqNvnKyYCdnaiyta00%3D',
    BEATS_SAS: 'sp=racwdl&st=2022-06-27T17:41:32Z&se=2023-06-28T01:41:32Z&sv=2021-06-08&sr=c&sig=%2FH6MY4fAIqpvFQlN4mQeFGsPPp328MU27D1mapwb4Kk%3D'
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
