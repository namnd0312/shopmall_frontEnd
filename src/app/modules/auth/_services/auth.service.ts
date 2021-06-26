import {Injectable, OnDestroy} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {catchError, finalize, map} from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService implements OnDestroy {

    authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;
    authUrl = environment.baseUrl;
    isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    currentUserSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    permissions: any[] = [];

    get currentUserValue() {
        return this.currentUserSubject.getValue();
    }

    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        this.init();
    }

    init(): void {
        const auth = JSON.parse(localStorage.getItem(this.authLocalStorageToken));
        if (auth) {
            this.currentUserSubject.next(auth.username);
        }
    }

    login(username: string, password: string): Observable<any> {
        this.isLoading$.next(true);
        const body = {
            authenType: 'getLogin',
            data: {
                username,
                password
            }
        };

        return this.http.post(`${this.authUrl}/login`, body, {observe: 'response'})
            .pipe(
                map(res => {
                    console.log('>>>> response when call login ::', res);
                    const fakeData = {
                        jwt: 'fake_jwt',
                        username,
                        secretKey: 'hungtt_secret_key'
                    };
                    return this.setAuthToLocalStorage(fakeData);
                    // return fakeData;
                }),
                catchError(err => {
                    console.error('error >', err);
                    return of(undefined);
                }),
                finalize(() => this.isLoading$.next(false)));
    }

    fakeLogin(username: string, password: string): Observable<any> {
        this.isLoading$.next(true);

        return of({
            jwt: 'fake_jwt',
            username,
            secretKey: 'hungtt_secret_key'
        }).pipe(
            map(res => {
                console.log('>>>> response when call login ::', res);
                return this.setAuthToLocalStorage(res);
            }),
            catchError(err => {
                console.error('error >', err);
                return of(undefined);
            }),
            finalize(() => this.isLoading$.next(false)));
    }

    setAuthToLocalStorage(auth: any): boolean {
        if (auth && auth.jwt) {
            localStorage.setItem('secretKey', auth.secretKey);
            localStorage.setItem(this.authLocalStorageToken, JSON.stringify(auth));
            this.currentUserSubject.next(auth.username);
            return true;
        }
        return false;
    }

    getAuthFromLocalStorage() {
        try {
            return JSON.parse(localStorage.getItem(this.authLocalStorageToken));
        } catch (error) {
            console.error(error);
            return undefined;
        }
    }

    logout(): void {
        localStorage.removeItem(this.authLocalStorageToken);
        localStorage.removeItem('secretKey');
        this.router.navigate(['/auth/login']);
    }

    ngOnDestroy() {
    }
}
