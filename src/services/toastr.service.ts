import { Injectable } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class ToastrAlertService {

    constructor(
        private toastr: ToastrService
    ) { }



    ToastConfig = {
        progressBar: true,
        titleClass: 'toast-title',
        enableHtml: true,
        closeButton: true,
        positionClass: 'toast-center-center'
    }

    Alert_Success(message: string) {
        this.toastr.success(message, '', this.ToastConfig);
    }

    Alert_Error(message: string) {
        this.toastr.error(message, '', this.ToastConfig);
    }

    Alert_warning(message: string) {
        this.toastr.warning(message, '', this.ToastConfig);
    }

    Alert_Info(message: string) {
        this.toastr.info(message, '', this.ToastConfig);
    }

    Alert_show(message: string) {
        this.toastr.show(message, '', this.ToastConfig);
    }


}
