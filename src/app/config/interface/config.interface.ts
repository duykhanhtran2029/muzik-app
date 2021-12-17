export interface IConfig {
    appConfig: IAppConfig;
    apiConfig: IAPIConfig;
}

export interface IAppConfig {
    API_BASE_URL: string;
}


// Do not start new api with a verb
export interface IAPIConfig {
    SONGS: string;
    SONG_BY_ID: string;
}

