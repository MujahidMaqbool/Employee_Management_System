import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
//import { ReplaySubject } from 'rxjs/ReplaySubject';
import { AppSettings } from '../model/AppSettings';
import { map } from 'rxjs/operators';

@Injectable()
export class LoginService {
    constructor(private _http: Http) { }
    LoginUser(userName: string, password: string) {
        var userInfo = { UserName: userName, Password: password }

        let bodyString = JSON.stringify(userInfo); // Stringify payload
        let headers = new Headers({ 'Content-Type': 'application/json' }); // ... Set content type to JSON
        let options = new RequestOptions({ headers: headers }); // Create a request option

        return this._http.post(AppSettings.LoginURL, bodyString, options).pipe(map((response: any) => response.json()));
    }

    ResetPassword(email: string, authToken: string) {
        //debugger;
        let bodyString = JSON.stringify(email);

        let headers = new Headers({ 'Content-Type': 'application/json' });
        headers.append('AuthToken', authToken);
        let options = new RequestOptions({ headers: headers });

        return this._http.post(AppSettings.ResetPasswordUrl, bodyString, options).pipe(map((response: any) => response.json()));
    }

    _errorHandler(error: Response) {
        return Observable.throw(error || "Server Error")
    }
}