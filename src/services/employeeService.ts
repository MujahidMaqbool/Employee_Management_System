import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppSettings } from '../model/AppSettings';

@Injectable()
export class EmployeeService {

    constructor(private _http: Http) { }
    getEmployees(AuthToken: string) {
        let headers = new Headers({ 'AuthToken': AuthToken }); // ... Set content type to JSON
        let options = new RequestOptions({ headers: headers }); // Create a request option

        return this._http.get(AppSettings.GetEmployeeUrl, options)
            .pipe(map((response: any) => response.json()));
  }

  getAllEmployees(AuthToken: string) {
    let headers = new Headers({ 'AuthToken': AuthToken }); // ... Set content type to JSON
    let options = new RequestOptions({ headers: headers }); // Create a request option

    return this._http.get(AppSettings.GetAllEmployeesUrl, options)
      .pipe(map((response: any) => response.json()));
  }

    getEmployeesRole(AuthToken: string) {

        let headers = new Headers({ 'AuthToken': AuthToken }); // ... Set content type to JSON
        let options = new RequestOptions({ headers: headers }); // Create a request option

        return this._http.get(AppSettings.GetEmployeeRoleUrl, options)
            .pipe(map((response: any) => response.json()));
    }

    _errorHandler(error: Response) {
        return Observable.throw(error || "Server Error")
    }
}
