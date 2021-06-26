import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {AuthModel} from '../_models/auth.model';
import {environment} from '../../../../environments/environment';
import {Router} from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {

    private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

    constructor(
        private router: Router
    ) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // request = request.clone({
        //     setHeaders: {
        //         'X-IBM-Client-Id': ApiConfig.DPW.X_IBM_CLIENT_ID,
        //         'X-IBM-Client-Secret': ApiConfig.DPW.X_IBM_CLIENT_SECRET,
        //     }
        // });

        if (!request || !request.url) {
            return next.handle(request);
        }

        return this.addAuthorization(request, next);
    }

    private addAuthorization(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authModel = this.getAuthFromLocalStorage();
        if (authModel) {
            request = request.clone({
                setHeaders: {
                    Authorization: 'Bearer ' + authModel.jwt
                }
            });
        } else {
            this.router.navigateByUrl('/auth/login');
            return;
        }
        return next.handle(request);
    }

    private getAuthFromLocalStorage(): AuthModel {
        try {
            return JSON.parse(
                localStorage.getItem(this.authLocalStorageToken)
            );
        } catch (error) {
            console.error(error);
            return undefined;
        }
    }

}
