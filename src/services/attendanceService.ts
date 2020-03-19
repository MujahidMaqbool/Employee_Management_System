import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';
import { AppSettings } from '../model/AppSettings';



@Injectable()
export class AttendanceService {
    constructor(private _http: Http) { }
    GetStatuses(authToken: string) {

        let headers = new Headers({ 'AuthToken': authToken });
        let options = new RequestOptions({ headers: headers });

        return this._http.get(AppSettings.StatusesUrl, options).pipe(map((response: any) => response.json()));
    }
    GetEmployeeStatus(employeeId: string, authToken: string) {

        let headers = new Headers({ 'AuthToken': authToken });
        let options = new RequestOptions({ headers: headers });

        return this._http.get(AppSettings.EmployeeStatusUrl + 'EmployeeId=' + employeeId, options).pipe(map((response: any) => response.json()));
    }
    SaveEmployeeAttendance(obj: any, authToken: string) {

        let bodyString = JSON.stringify(obj);

        let headers = new Headers({ 'Content-Type': 'application/json' });
        headers.append('AuthToken', authToken);
        let options = new RequestOptions({ headers: headers });

        return this._http.post(AppSettings.SaveAttendanceUrl, bodyString, options).pipe(map((response: any) => response.json()));
    }
    SaveEmployeeStatus(obj: any, authToken: string) {

        let bodyString = JSON.stringify(obj);

        let headers = new Headers({ 'Content-Type': 'application/json' });
        headers.append('AuthToken', authToken);
        let options = new RequestOptions({ headers: headers });

        return this._http.post(AppSettings.SaveEmployeeStatusUrl, bodyString, options).pipe(map((response: any) => response.json()));
    }
    GetEmployeeSelectedStatus(employeeId: string, authToken: string) {
        // debugger;
        let headers = new Headers({ 'AuthToken': authToken });
        let options = new RequestOptions({ headers: headers });//////////////////

        return this._http.get(AppSettings.GetEmployeeSelectedStatusUrl + '/' + employeeId, options).pipe(map((response: any) => response.json()));
        //return this._http.get(AppSettings.GetEmployeeSelectedStatusUrl + 'EmployeeId=' + employeeId, options)

    }
    _errorHandler(error: Response) {
        return Observable.throw(error || "Server Error")
    }

    GetEmployeeAttendanceReport(employee: any, authToken: string) {
        debugger;
        let bodyString = JSON.stringify(employee);

        let headers = new Headers({ 'Content-Type': 'application/json' });
        headers.append('AuthToken', authToken);
        let options = new RequestOptions({ headers: headers });

        return this._http.post(AppSettings.GetEmployeeAttendanceReportUrl, bodyString, options).pipe(map((response: any) => response.json()));
    }

    GetEmployeeAttendancePDF(obj: any, authToken: string) {
        debugger;
        let bodyString = JSON.stringify(obj);

        let headers = new Headers({ 'Content-Type': 'application/json' });
        headers.append('AuthToken', authToken);
        let options = new RequestOptions({ headers: headers });

        return this._http.post(AppSettings.GetEmployeeAttendancePDFUrl, bodyString, options).pipe(map((response: any) => response.json()));
    }

    GetEmployeeAttendanceSummaryPDF(obj: any, authToken: string) {
        debugger;
        let bodyString = JSON.stringify(obj);

        let headers = new Headers({ 'Content-Type': 'application/json' });
        headers.append('AuthToken', authToken);
        let options = new RequestOptions({ headers: headers });

        return this._http.post(AppSettings.GetEmployeeAttendanceSummaryPDFUrl, bodyString, options)
            .pipe(map((response: any) => response.json()));
    }
}