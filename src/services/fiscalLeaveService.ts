import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppSettings } from '../model/AppSettings';

@Injectable()
export class FiscalLeaveService {

    constructor(private _http: Http) { }

    SaveEmployeeFiscalLeaves(array: any, authToken: string) {
        debugger;
        let bodyString = JSON.stringify(array);

        let headers = new Headers({ 'Content-Type': 'application/json' });
        headers.append('AuthToken', authToken);
        let options = new RequestOptions({ headers: headers });

        return this._http.post(AppSettings.SaveEmployeeFiscalLeavesUrl, bodyString, options).pipe(map((response: any) => response.json()));
    }

    GetLeaveTypes(authToken: string) {

        let headers = new Headers({ 'AuthToken': authToken });
        let options = new RequestOptions({ headers: headers });

        return this._http.get(AppSettings.LeaveTypeUrl, options)
            .pipe(map((response: any) => response.json()));
    }
    GetFiscalYears(authToken: string) {
        let headers = new Headers({ 'AuthToken': authToken });
        let options = new RequestOptions({ headers: headers });

        return this._http.get(AppSettings.FiscalYearsUrl, options)
            .pipe(map((response: any) => response.json()));
    }
    GetFiscalLeaves(EmployeeId: string, FiscalYear: string, authToken: string) {
        let headers = new Headers({ 'AuthToken': authToken });
        let options = new RequestOptions({ headers: headers });

        return this._http.get(AppSettings.FiscalLeaveUrl + EmployeeId + "/" + FiscalYear, options)
            .pipe(map((response: any) => response.json()));
    }
    GetEmployeeImage(EmployeeCode: string, authToken: string) {
        let headers = new Headers({ 'AuthToken': authToken });
        let options = new RequestOptions({ headers: headers });

        return this._http.get(AppSettings.GetEmployeeProfileUrl + EmployeeCode, options)
            .pipe(map((response: any) => response.json()));
    }
    _errorHandler(error: Response) {
        return Observable.throw(error || "Server Error")
    }
}