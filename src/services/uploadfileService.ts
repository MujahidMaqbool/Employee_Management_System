import { Injectable } from '@angular/core';
//import { Observable } from 'rxjs/Rx';
//import { Observable } from 'rxjs/Observable';
//import { Observer } from 'rxjs/Observer';
import { Observable, Observer } from 'rxjs';

@Injectable()
export class UploadFileService {
    public progress$: any;
    public progressObserver: any;
    public progress: number = 0;
    constructor() {
        this.progress$ = Observable.create((observer: Observer<string>) => {
            this.progressObserver = observer
        }).share();
    }

    makeFileRequest(url: string, params: string[], files: File[], authToken: string): Observable<any> {
        return Observable.create((observer: Observer<string>) => {
            let formData: FormData = new FormData(),
                xhr: XMLHttpRequest = new XMLHttpRequest();

            for (let i = 0; i < files.length; i++) {
                formData.append("uploads[]", files[i], files[i].name);
            }

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        observer.next(JSON.parse(xhr.response));
                        observer.complete();
                    } else {
                        observer.error(xhr.response);
                    }
                }
            };

            xhr.upload.onprogress = (event) => {
                this.progress = Math.round(event.loaded / event.total * 100);

                this.progressObserver.next(this.progress);
            };

            xhr.open('POST', url, true);
            xhr.setRequestHeader("AuthToken", authToken);
            xhr.send(formData);
        });
    }
}