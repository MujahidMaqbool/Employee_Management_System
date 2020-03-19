import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppSettings } from '../model/AppSettings';

@Injectable()
export class EmployeeAppliedLeaveService {
    constructor(private _http: Http) { }
    GetEmployeeAppliedLeaves(employeeCode: string, status: string, authToken: string) {

        let headers = new Headers({ 'AuthToken': authToken });
        let options = new RequestOptions({ headers: headers });

        return this._http.get(AppSettings.EmployeeLeaveUrl + 'EmployeeCode=' + employeeCode + '&Status=' + status, options)
            .pipe(map((response: any) => response.json()));
    }
    _errorHandler(error: Response) {
        return Observable.throw(error || "Server Error")
    }
}