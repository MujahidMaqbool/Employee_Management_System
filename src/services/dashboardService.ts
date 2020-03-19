import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AppSettings } from '../model/AppSettings';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class DashBoardService {
    constructor(private _http: Http) { }

    GetDashBoardSummary(authToken: string) {
        debugger;
        let headers = new Headers({ 'AuthToken': authToken });
        let options = new RequestOptions({ headers: headers });

        return this._http.get(AppSettings.DashBoardUrl, options)
            .pipe(map((response: any) => response.json()));
    }

    _errorHandler(error: Response) {
        return Observable.throw(error || "Server Error")
    }
}