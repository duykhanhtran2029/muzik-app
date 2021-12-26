export const environment = {
  production: true,
  azureStorage: {
    storageAccount: 'shazam',
    /** Container */
    imagesContainer: 'images',
    songsContainer: 'songs',
    /** SAS */
    imagesSAS: 'sp=racwdl&st=2021-12-25T08:23:13Z&se=2022-01-08T16:23:13Z&sv=2020-08-04&sr=c&sig=d53YnbwEliEIZrOt2%2BBV4mSvI8TuzumcvNQA3rADtuU%3D',
    songsSAS: 'sp=racwdl&st=2021-12-25T08:02:37Z&se=2022-01-08T16:02:37Z&sv=2020-08-04&sr=c&sig=B%2FkMVH2PJ5S1Qx49Y4PNKH%2BeZTHD21tZLS1J9fojw4o%3D'
  }
};
