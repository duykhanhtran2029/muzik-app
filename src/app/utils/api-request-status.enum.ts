export enum ApiRequestStatus {
    Requesting = 'Requesting',
    Success = 'Success',
    NotFound = 'NotFound',
    FailedTemporary = 'FailedTemporary',
    FailedPermanently = 'FailedPermanently',
    PermissionChecking = 'PermissionChecking',
    NoPermission = 'NoPermission'
}
