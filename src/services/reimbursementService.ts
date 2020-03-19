import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { AppSettings } from '../model/AppSettings';

@Injectable()
export class ReimbursementService {
    constructor(private _http: Http) { }
    _errorHandler(error: Response) {
        return Observable.throw(error || "Server Error")
    }
}