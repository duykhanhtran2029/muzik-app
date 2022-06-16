export class QueryParamsHelper {
    /**
     * It returns string corresponding to input query params object
     * Or empty string if the input query params is undefined, null or empty
     *
     * @param queryParams The query params object
     */
    static toUrl(queryParams: any) {
        if (!queryParams || Object.entries(queryParams).length === 0) {
            return '';
        }

        const queryParamsUrl = Object.keys(queryParams).reduce((acc: string, curr: string) => `${acc}${curr}=${queryParams[curr]}&`, '');

        if (queryParamsUrl?.length > 0) {
            return queryParamsUrl.slice(0, - 1);
        } else {
            return '';
        }
    }
}
