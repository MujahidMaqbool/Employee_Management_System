import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppSettings } from '../model/AppSettings';

@Injectable()
export class LeaveApplicationService {

    constructor(private _http: Http) { }
    SendLeaveApplication(date: string, fromDate: string, toDate: string, leaveTypeId: string, userNote: string, transactionId: number, status: string, managerNote: string, totalLeavs: number, childLeaveTypeId: string, authToken: string) {

        var leaveInfo = {
            FromDateTime: fromDate, ToDateTime: toDate, TransactionId: transactionId, Date: date,
            LeaveTypeId: leaveTypeId, Status: status, AprovedBy: null, CreatedUTCDateTime: date,
            LastUpdatedUTCDatetime: date, UserNote: userNote, ManagerNote: managerNote, TotalLeaves: totalLeavs,
            ChildLeaveTypeId: childLeaveTypeId
        }

        let bodyString = JSON.stringify(leaveInfo);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        headers.append('AuthToken', authToken);
        let options = new RequestOptions({ headers: headers });

        return this._http.post(AppSettings.LeaveApplicationUrl, bodyString, options).pipe(map((response: any) => response.json()));
    }
    VerifyLeaveApplication(fromDate: Date, leaveTypeId: string, toDate: Date, authToken: string) {

        var leaveInfo = {
            FromDate: fromDate, ToDate: toDate, LeaveTypeId: leaveTypeId
        }

        let bodyString = JSON.stringify(leaveInfo);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        headers.append('AuthToken', authToken);
        let options = new RequestOptions({ headers: headers });

        return this._http.post(AppSettings.VerifyLeaveApplicationUrl, bodyString, options).pipe(map((response: any) => response.json()));
    }
    _errorHandler(error: Response) {
        return Observable.throw(error || "Server Error")
    }
}