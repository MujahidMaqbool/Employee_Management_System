import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AppSettings } from '../model/AppSettings';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { map } from 'rxjs/operators';

@Injectable()
export class WFHService {

    constructor(private _http: Http) { }

    GetWFHRequest(Status: string, FromDate: Date, ToDate: Date, EmployeeCode: string, authToken: string) {

        var search = {
            Status: Status,
            FromDate: FromDate,
            ToDate: ToDate,
            EmployeeCode: EmployeeCode
        }

        let bodyString = JSON.stringify(search);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        headers.append('AuthToken', authToken);
        let options = new RequestOptions({ headers: headers });

        return this._http.post(AppSettings.GetWFHRequest, bodyString, options).pipe(map((response: any) => response.json()));
    }

    SaveWFHRequest(TranscationId: number, EmployeeId: string, Date: string, StartTime: string, TotalHour: string, Status: string, Reason: string, AprrovedBy: string, ManagerRemarks: string, authToken: string) {
        debugger;
        var WFHInfo = {
            TranscationId: TranscationId,
            EmployeeId: EmployeeId,
            Date: Date,
            StartTime: StartTime,
            TotalHour: TotalHour,
            Status: Status,
            Reason: Reason,
            AprrovedBy: AprrovedBy,
            ManagerRemarks: ManagerRemarks
        }

        let bodyString = JSON.stringify(WFHInfo);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        headers.append('AuthToken', authToken);
        let options = new RequestOptions({ headers: headers });

        return this._http.post(AppSettings.SaveWFHRequest, bodyString, options).pipe(map((response: any) => response.json()));
    }

    _errorHandler(error: Response) {
        return Observable.throw(error || "Server Error")
    }
}