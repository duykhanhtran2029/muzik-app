export const environment = {
  production: true,
  apiRecognizeUrl: 'https://localhost:5001',
  apiMusicUrl: 'https://localhost:5101',
  apiRecommendUrl: 'https://localhost:8089',
  azureStorage: {
    storageAccount: 'shazam',
    /** Container */
    imagesContainer: 'images',
    songsContainer: 'songs',
    recordsContainer: 'records',
    beatsContainer: 'beats',
    lyricsContainer: 'lyrics',
    /** SAS */
    imagesSAS: 'sp=racwdli&st=2022-06-05T13:44:09Z&se=2025-06-05T21:44:09Z&sv=2020-08-04&sr=c&sig=uDzdHjP5ggKh%2Funxi7U%2B1FREhQ%2FpoM6mBKp2dMGTFAo%3D',
    songsSAS: 'sp=racwdl&st=2021-12-25T08:02:37Z&se=2022-01-08T16:02:37Z&sv=2020-08-04&sr=c&sig=B%2FkMVH2PJ5S1Qx49Y4PNKH%2BeZTHD21tZLS1J9fojw4o%3D',
    recordsSAS: 'sp=racwdli&st=2022-06-07T17:02:21Z&se=2025-06-08T01:02:21Z&sv=2020-08-04&sr=c&sig=0vADbuRg8JP2LT14%2FRXTbG3K%2Bt6lRCB9w%2BbqEFXArlg%3D',
    lyricsSAS: 'sp=racwdli&st=2022-06-06T13:54:59Z&se=2025-06-06T21:54:59Z&spr=https&sv=2020-08-04&sr=c&sig=lZpu5CkjZA3MUY4dJlZnHrS%2FuPXvRzzMZxKO9%2B3BHok%3D',
    beatsSAS: 'sp=racwdli&st=2022-06-06T13:55:22Z&se=2025-06-06T21:55:22Z&spr=https&sv=2020-08-04&sr=c&sig=Jrddr5Vh78UB6rsuxfWdq55vtrhtCHBRKY9n5AC90CM%3D'
  },
};