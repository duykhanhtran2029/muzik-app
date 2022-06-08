// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
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
    songsSAS: 'sp=racwdli&st=2022-06-06T18:55:44Z&se=2025-06-07T02:55:44Z&spr=https&sv=2020-08-04&sr=c&sig=k4OAsmqD%2Bx8L9mLB9po9Rq2nggPGjndvgDnvs7%2F%2Bc%2F4%3D',
    recordsSAS: 'sp=racwdli&st=2022-06-07T17:02:21Z&se=2025-06-08T01:02:21Z&sv=2020-08-04&sr=c&sig=0vADbuRg8JP2LT14%2FRXTbG3K%2Bt6lRCB9w%2BbqEFXArlg%3D',
    lyricsSAS: 'sp=racwdli&st=2022-06-06T13:54:59Z&se=2025-06-06T21:54:59Z&spr=https&sv=2020-08-04&sr=c&sig=lZpu5CkjZA3MUY4dJlZnHrS%2FuPXvRzzMZxKO9%2B3BHok%3D',
    beatsSAS: 'sp=racwdli&st=2022-06-06T13:55:22Z&se=2025-06-06T21:55:22Z&spr=https&sv=2020-08-04&sr=c&sig=Jrddr5Vh78UB6rsuxfWdq55vtrhtCHBRKY9n5AC90CM%3D'
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
