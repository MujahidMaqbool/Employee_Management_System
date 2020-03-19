import { Component } from '@angular/core';
import { UploadFileService } from '../../services/uploadfileService';
import { AppSettings } from '../../model/AppSettings';

@Component({
    selector: 'attendance-file',
    templateUrl: './uploadAttendanceFile.component.template.html'
})
export class UploadAttendanceFileComponent {
    
    ErrMsg: string = "";

    constructor(private fileService: UploadFileService) {
        this.fileService.progress$.subscribe(
            (data: any) => {
                console.log('progress = ' + data);
            });
    }

    fileChange(event: any) {
        console.log('onChange');
        var files = event.srcElement.files;
        console.log(files);
        this.fileService.makeFileRequest(AppSettings.FileUploadURL, [], files, JSON.parse(localStorage.getItem('AuthToken') || '')).subscribe(
            response => {
                    this.ErrMsg = response.Message
            },
            error => {
                this.ErrMsg = error
            }
        );
    }
}