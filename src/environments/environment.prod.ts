export const environment = {
  production: true,
  RECOGNIZE_API_URL: 'https://localhost:5001',
  MUSIC_API_URL: 'https://localhost:5101',
  RECOMMEND_API_URL: 'https://localhost:8089',
  AZURE_STORAGE_CONFIG: {
    STORAGE_ACCOUNT: 'shazam',
    /** Container */
    IMAGES_CONTAINER: 'images',
    SONGS_CONTAINER: 'songs',
    RECORDS_CONTAINER: 'records',
    BEATS_CONTAINER: 'beats',
    LYRICS_CONTAINER: 'lyrics',
    /** SAS */
    IMAGES_SAS: 'sp=racwdli&st=2022-06-05T13:44:09Z&se=2025-06-05T21:44:09Z&sv=2020-08-04&sr=c&sig=uDzdHjP5ggKh%2Funxi7U%2B1FREhQ%2FpoM6mBKp2dMGTFAo%3D',
    SONGS_SAS: 'sp=racwdli&st=2022-06-06T18:55:44Z&se=2025-06-07T02:55:44Z&spr=https&sv=2020-08-04&sr=c&sig=k4OAsmqD%2Bx8L9mLB9po9Rq2nggPGjndvgDnvs7%2F%2Bc%2F4%3D',
    RECORDS_SAS: 'sp=racwdli&st=2022-06-07T17:02:21Z&se=2025-06-08T01:02:21Z&sv=2020-08-04&sr=c&sig=0vADbuRg8JP2LT14%2FRXTbG3K%2Bt6lRCB9w%2BbqEFXArlg%3D',
    LYRICS_SAS: 'sp=racwdli&st=2022-06-06T13:54:59Z&se=2025-06-06T21:54:59Z&spr=https&sv=2020-08-04&sr=c&sig=lZpu5CkjZA3MUY4dJlZnHrS%2FuPXvRzzMZxKO9%2B3BHok%3D',
    BEATS_SAS: 'sp=racwdli&st=2022-06-06T13:55:22Z&se=2025-06-06T21:55:22Z&spr=https&sv=2020-08-04&sr=c&sig=Jrddr5Vh78UB6rsuxfWdq55vtrhtCHBRKY9n5AC90CM%3D'
  },
  AUTH0_CONFIG: {
    CLIENT_ID: 's7t6cdqpEvgHDlbQNfsdh2td42tBHEdC',
    DOMAIN: 'dev-music-player.eu.auth0.com',
    REDIRECT_URI: window.location.origin
  }
};
