import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppSettings } from '../model/AppSettings';

@Injectable()
export class EmployeeRegistrationService {
    constructor(private _http: Http) { }

    GetEmployeeDesignations(authToken: string) {

        let headers = new Headers({ 'AuthToken': authToken });
        let options = new RequestOptions({ headers: headers });

        return this._http.get(AppSettings.GetEmployeeDesignationsUrl, options)
            .pipe(map((response: any) => response.json()));
    }

    GetCitiesByCountry(countryId: number, authToken: string) {

        let headers = new Headers({ 'AuthToken': authToken });
        let options = new RequestOptions({ headers: headers });

        return this._http.get(AppSettings.GetCitiesByCountryIdUrl + countryId, options)
            .pipe(map((response: any) => response.json()));
    }

    AllEmployees(sortBy: string, orderBy: number, dateChecked: boolean, employeeId: string, fromDate: Date, toDate: Date, authToken: string) {
        debugger;

        var searchInfo = { SortBy: sortBy, OrderBy: orderBy, DateChecked: dateChecked, EmployeeId: employeeId, FromDate: fromDate, ToDate: toDate }

        let bodyString = JSON.stringify(searchInfo);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        headers.append('AuthToken', authToken);
        let options = new RequestOptions({ headers: headers });

        return this._http.post(AppSettings.EmployeeListUrl, bodyString, options).pipe(map((response: any) => response.json()));
    }

    GetNewAddedDesignation(authToken: string) {

        let headers = new Headers({ 'AuthToken': authToken });
        let options = new RequestOptions({ headers: headers });

        return this._http.get(AppSettings.GetNewAddedDesignationUrl, options)
            .pipe(map((response: any) => response.json()));
    }

    SaveDesignation(obj: any, authToken: string) {
        //debugger;
        let bodyString = JSON.stringify(obj);

        let headers = new Headers({ 'Content-Type': 'application/json' });
        headers.append('AuthToken', authToken);
        let options = new RequestOptions({ headers: headers });

        return this._http.post(AppSettings.SaveDesignationUrl, bodyString, options).pipe(map((response: any) => response.json()));
    }

    GetCountries(authToken: string) {

        let headers = new Headers({ 'AuthToken': authToken });
        let options = new RequestOptions({ headers: headers });

        return this._http.get(AppSettings.GetCountriesUrl, options)
            .pipe(map((response: any) => response.json()));
    }

    GetCities(authToken: string) {

        let headers = new Headers({ 'AuthToken': authToken });
        let options = new RequestOptions({ headers: headers });

        return this._http.get(AppSettings.GetCitiesUrl, options)
            .pipe(map((response: any) => response.json()));
    }

    SaveNewEmployee(employee: any, authToken: string) {
        debugger;
        let bodyString = JSON.stringify(employee);

        let headers = new Headers({ 'Content-Type': 'application/json' });
        headers.append('AuthToken', authToken);
        let options = new RequestOptions({ headers: headers });

        return this._http.post(AppSettings.SaveNewEmployeeUrl, bodyString, options).pipe(map((response: any) => response.json()));
    }

    _errorHandler(error: Response) {
        return Observable.throw(error || "Server Error")
    }

    GetReportingtoEmployeeList(authToken: string) {

        let headers = new Headers({ 'AuthToken': authToken });
        let options = new RequestOptions({ headers: headers });

        return this._http.get(AppSettings.GetReportingtoEmployeeListUrl, options)
            .pipe(map((response: any) => response.json()));
    }

    GetEmployeeProfile(EmployeeCode: string, authToken: string) {
        let headers = new Headers({ 'AuthToken': authToken });
        let options = new RequestOptions({ headers: headers });

        return this._http.get(AppSettings.GetEmployeeProfileUrl + EmployeeCode, options)
            .pipe(map((response: any) => response.json()));
    }

    DeleteEmployee(employeeId: string, status: boolean, authToken: string) {
        let headers = new Headers({ 'AuthToken': authToken });
        let options = new RequestOptions({ headers: headers });

        return this._http.get(AppSettings.DeleteEmployeeUrl + employeeId + '/' + status, options)
            .pipe(map((response: any) => response.json()));
    }

    GetTeams(authToken: string) {

        let headers = new Headers({ 'AuthToken': authToken });
        let options = new RequestOptions({ headers: headers });

        return this._http.get(AppSettings.GetTeamsUrl, options)
            .pipe(map((response: any) => response.json()));
    }

    GetDepartments(authToken: string) {

        let headers = new Headers({ 'AuthToken': authToken });
        let options = new RequestOptions({ headers: headers });

        return this._http.get(AppSettings.GetDepartmentsUrl, options)
            .pipe(map((response: any) => response.json()));
    }

    ChangeEmployeePassword(employeeCode: string, password: string, authToken: string) {
        debugger;
        var obj = { EmployeeCode: employeeCode, Password: password }

        let bodyString = JSON.stringify(obj);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        headers.append('AuthToken', authToken);
        let options = new RequestOptions({ headers: headers });

        return this._http.post(AppSettings.ChangeEmployeePasswordUrl, bodyString, options).pipe(map((response: any) => response.json()));
    }
}