// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiBaseUrl: 'https://localhost:5001',
  azureStorage: {
    storageAccount: 'shazam',
    /** Container */
    imagesContainer: 'images',
    songsContainer: 'songs',
    recordsContainer: 'records',
    /** SAS */
    imagesSAS:
      'sp=racwdl&st=2021-12-25T08:23:13Z&se=2022-01-08T16:23:13Z&sv=2020-08-04&sr=c&sig=d53YnbwEliEIZrOt2%2BBV4mSvI8TuzumcvNQA3rADtuU%3D',
    songsSAS:
      'sp=racwdl&st=2021-12-25T08:02:37Z&se=2022-01-08T16:02:37Z&sv=2020-08-04&sr=c&sig=B%2FkMVH2PJ5S1Qx49Y4PNKH%2BeZTHD21tZLS1J9fojw4o%3D',
    recordsSAS:
      'sp=racwdl&st=2021-12-28T19:07:46Z&se=2022-01-08T03:07:46Z&spr=https&sv=2020-08-04&sr=c&sig=JNq%2BQZch45lhKCEgFT4rRnzm2jV9hQYVt7zILMU5YeY%3D',
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
