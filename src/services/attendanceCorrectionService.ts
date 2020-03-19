import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppSettings } from '../model/AppSettings';

@Injectable()
export class AttendanceCorrectionService {
    constructor(private _http: Http) { }

    GetAll(Status: string, FromDate: Date, ToDate: Date, EmployeeCode: string, authToken: string) {

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

        return this._http.post(AppSettings.GetAllUrl, bodyString, options)
            .pipe(map((response: any) => response.json()));
    }

    SaveAttendanceRequest(TranscationId: number, EmployeeId: string, SelectedDate: string, CorrectionTime: string, UserNote: string, IsCheckedIn: boolean, ApprovedBy: string, ManagerNote: string, Status: string, authToken: string) {

        var WFHInfo = {
            TranscationId: TranscationId,
            EmployeeId: EmployeeId,
            Date: SelectedDate,
            CorrectionTime: CorrectionTime,
            UserNote: UserNote,
            ApprovedBy: ApprovedBy,
            ManagerNote: ManagerNote,
            Status: Status,
            IsCheckedIn: IsCheckedIn
        }

        let bodyString = JSON.stringify(WFHInfo);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        headers.append('AuthToken', authToken);
        let options = new RequestOptions({ headers: headers });

        return this._http.post(AppSettings.SaveAttendanceCorrectionRequest, bodyString, options).pipe(map((response: any) => response.json()));
    }

    _errorHandler(error: Response) {
        return Observable.throw(error || "Server Error")
    }
}