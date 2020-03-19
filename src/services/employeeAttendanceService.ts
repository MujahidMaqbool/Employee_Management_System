import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppSettings } from '../model/AppSettings';

@Injectable()
export class EmployeeAttendanceService {

    constructor(private _http: Http) { }
    GetEmployeeAttendance(fromDate: Date, toDate: Date, employeeCode: string, authToken: string) {

        var searchInfo = { FromDate: fromDate, ToDate: toDate, EmployeeCode: employeeCode, PageIndex: 1, PageSize: 100 }

        let bodyString = JSON.stringify(searchInfo);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        headers.append('AuthToken', authToken);
        let options = new RequestOptions({ headers: headers });

        return this._http.post(AppSettings.EmployeeAttendanceUrl, bodyString, options).pipe(map((response: any) => response.json()));
    }

    _errorHandler(error: Response) {
        return Observable.throw(error || "Server Error")
    }
}