import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@auth0/auth0-angular';
import createAuth0Client from '@auth0/auth0-spa-js';
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';
import { Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, EMPTY, forkJoin, from, Observable, of, throwError } from 'rxjs';
import { catchError, concatMap, map, shareReplay, skip, skipWhile, takeWhile, tap } from 'rxjs/operators';
import { AppState } from 'src/app/store/reducers';
import { environment } from 'src/environments/environment';
import { setIsAdmin, setIsAuthenticated, setToken, setUserId } from '../store/actions/core.actions';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    // Create an observable of Auth0 instance of client
    auth0Client$: Observable<Auth0Client>;
    auth0APIClient$: Observable<Auth0Client>;

    isAuthenticated$: Observable<boolean>;
    handleRedirectCallback$: Observable<any>;
    getUser$: Observable<User>;
    getToken$: Observable<any>;
    isAdmin$: Observable<boolean>;
    private handleCallbackCompleteSubject$ = new BehaviorSubject<boolean>(false);
    handleCallbackComplete$ = this.handleCallbackCompleteSubject$.asObservable();

    constructor(
        private router: Router,
        private store: Store<AppState>,
        private http: HttpClient
    ) {
        // On initial load, check authentication state with authorization server
        // Set up local auth streams if user is already authenticated
        this.onInitService();
        this.localAuthSetup();
        this.handleAuthCallback();
    }

    // When calling, options can be passed if desired
    // https://auth0.github.io/auth0-spa-js/classes/auth0client.html#getuser

    onInitService(): void {
        // Create an observable of Auth0 instance of client
        this.auth0Client$ = (from(
            createAuth0Client({
                domain: environment.AUTH0_CONFIG.DOMAIN,
                client_id: environment.AUTH0_CONFIG.CLIENT_ID,
                redirect_uri: `${window.location.origin}`,
                response_type: environment.AUTH0_CONFIG.RESPONSE_TYPE
            })
        ) as Observable<Auth0Client>).pipe(
            shareReplay(1), // Every subscription receives the same shared value
            catchError(err => {
                console.log(err);
                return EMPTY;
            })
        );

        this.isAuthenticated$ = this.auth0Client$.pipe(
            concatMap((client: Auth0Client) => from(client.isAuthenticated())),
            tap((res: boolean) => this.store.dispatch(setIsAuthenticated({ isAuthenticated: res })))
        );

        this.handleRedirectCallback$ = this.auth0Client$.pipe(
            concatMap((client: Auth0Client) => from(client.handleRedirectCallback()))
        );

        this.getUser$ = this.auth0Client$.pipe(
            concatMap((client: Auth0Client) => from(client.getUser())),
            skipWhile((user) => !user),
            tap(user => {
                this.store.dispatch(setUserId({ userId: user.sub }));
            })
        );

        this.getToken$ =this.getAPIAccessToken().pipe(
            skipWhile((token) => !token),
            tap(token => {
                this.store.dispatch(setToken({ token: token['access_token'] }));
            })
        );

        this.isAdmin$ = forkJoin([this.getUser$, this.getToken$]).pipe(
            skipWhile(([user, token]) => !user || !token),
            concatMap(([user, token]) =>  (user && token) ? this.getUserRoles(user.sub, token['access_token']) : EMPTY),
            map((res) => {
                if(res[0]) {
                    const isAdmin = res[0]['id'] === environment.AUTH0_CONFIG.ADMIN_ROLE_ID;
                    this.store.dispatch(setIsAdmin({isAdmin: isAdmin}));
                    return isAdmin;
                }
                return false;
            }),
        );
    }

    login(redirectPath: string = '/') {
        // ensure redirect path not in error path
        redirectPath = redirectPath.includes('/error') ? '' : redirectPath;
        // A desired redirect path can be passed to login method
        // (e.g., from a route guard)
        // Ensure Auth0 client instance exists
        this.auth0Client$.subscribe((client: Auth0Client) => {
            client.loginWithRedirect({
                prompt: 'select_account',
                redirect_uri: `${window.location.origin}`,
                appState: { target: redirectPath }
            });
        });
    }

    logout() {
        // Ensure Auth0 client instance exists
        this.auth0Client$.subscribe((client: Auth0Client) => {
            // Call method to log out
            client.logout({
                client_id: environment.AUTH0_CONFIG.CLIENT_ID,
                returnTo: `${window.location.origin}`
            });
        });
    }

    getAPIAccessToken() {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const body = {
          client_id: environment.AUTH0_CONFIG.API_CLIENT_ID,
          client_secret: environment.AUTH0_CONFIG.API_CLIENT_SECRET,
          audience: environment.AUTH0_CONFIG.API_AUDIENCE,
          grant_type: "client_credentials"
        };
        return this.http.post(`${environment.AUTH0_CONFIG.DOMAIN}/oauth/token`, body, { headers });
    }

    getUserRoles(userId: string, token: string) {
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        });
        return this.http.get(encodeURI(`${environment.AUTH0_CONFIG.DOMAIN}/api/v2/users/${userId}/roles`), { headers: headers });
    }

    private localAuthSetup() {
        // This should only be called on app initialization
        // Set up local authentication streams
        const checkAuth$ = this.isAuthenticated$.pipe(
            concatMap((loggedIn: boolean) => {
                if (loggedIn) {
                    // If authenticated, get user and set in app
                    // NOTE: you could pass options here if needed
                    return combineLatest([
                        this.getUser$,
                        this.getToken$,
                        this.isAuthenticated$,
                        this.isAdmin$
                    ]);
                }
                // If not authenticated, return stream that emits 'false'
                return of(loggedIn);
            })
        );
        checkAuth$.subscribe();
    }

    private handleAuthCallback() {
        // Call when app reloads after user logs in with Auth0
        const params = window.location.search;
        const shouldIgnore = localStorage.getItem('SHOULD_IGNORE');
        if (!shouldIgnore && params && params.includes('code=') && params.includes('state=') && !params.includes('error=')) {
            let targetRoute: string; // Path to redirect to after login processsed
            const authComplete$ = this.handleRedirectCallback$.pipe(
                // Have client, now call method to handle auth callback redirect
                tap(cbRes => {
                    // Get and set target redirect route from callback results
                    targetRoute = cbRes.appState && cbRes.appState.target ? cbRes.appState.target : '/';
                    // Login by ticket, if you want to make sure it is the first time, you should disable the ticket after loged in
                    if (targetRoute !== '/' &&
                        targetRoute.includes('email=') && targetRoute.includes('message=') && targetRoute.includes('success=')) {
                        targetRoute = '/';
                    }
                }),
                concatMap(() =>
                    // Redirect callback complete; get user and login status
                    combineLatest([
                        this.getUser$,
                        this.getToken$,
                        this.isAuthenticated$,
                        this.isAdmin$
                    ])
                )
            );
            // Subscribe to authentication completion observable
            // Response will be an array of user and login status
            authComplete$.subscribe(([user, loggedIn]) => {
                // Redirect to target route after callback processing
                this.handleCallbackCompleteSubject$.next(true);
                this.router.navigateByUrl(this.cleanTargetRoute(targetRoute));
            });
        } else if (params.includes('error=unauthorized')) {
            this.logout();
        } else {
            this.handleCallbackCompleteSubject$.next(true);
        }
    }

    /**
     *
     * @param route targetRoute
     * @returns cleaned route that deleted `code` and `state`
     */
    private cleanTargetRoute(route: string): string {
        const splittedRoute = route.split('?');
        const params = new URLSearchParams(splittedRoute[1]);
        params.delete('code');
        params.delete('state');
        return params.toString() ? `${splittedRoute[0]}?${params.toString()}` : splittedRoute[0];
    }
}




