import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppSettings } from '../model/AppSettings';

@Injectable()
export class AnnualHolidayService {
    constructor(private _http: Http) { }

    GetAll(authToken: string) {

        let headers = new Headers({ 'Content-Type': 'application/json' });
        headers.append('AuthToken', authToken);
        let options = new RequestOptions({ headers: headers });

        return this._http.get(AppSettings.GetAllAnnualHolidaysUrl, options)
            .pipe(map((response: any) => response.json()));
    }

    Save(obj: any, authToken: string) {

        let bodyString = JSON.stringify(obj);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        headers.append('AuthToken', authToken);
        let options = new RequestOptions({ headers: headers });

        return this._http.post(AppSettings.SaveAnnualHolidayRequest, bodyString, options).pipe(map((response: any) => response.json()));
    }

    _errorHandler(error: Response) {
        return Observable.throw(error || "Server Error")
    }

}