import { Router } from '@angular/router';
import { Component, Input } from '@angular/core';
import { Injectable } from '@angular/core';
import { AnnualHoliday } from "../../model/AnnualHoliday";
import { AnnualHolidayService } from "../../services/annualHolidayService";
import { ToastrAlertService } from 'src/services/toastr.service';

@Component({
    selector: 'annualHoliday',
    templateUrl: './annualHoliday.component.template.html'
})


export class AnualHolidayComponent {

    public Loader: boolean = false;
    public errMsg: string = "";
    AnnualHolidayModel = new Array<AnnualHoliday>();
    LeaveDate: string = "";
    description: string = "";
    @Input('show-modal') showAnnualHolidayModal: boolean = false;

    constructor(
        private _annualHolidayService: AnnualHolidayService,
        private _toastrAlertService: ToastrAlertService
    ) { }

    ngOnInit() {
        this.getAnnualHolidays();
    }

    getAnnualHolidays() {
        this.Loader = true;
        this._annualHolidayService.GetAll(JSON.parse(localStorage.getItem('AuthToken') || ''))
            .subscribe(serviceResponse => {
                if (serviceResponse.IsSuccess) {
                    this.AnnualHolidayModel = serviceResponse.result.reverse();
                    this.Loader = false;
                } else { this.Loader = false; }
            }, ErrorResponse => this.errMsg = ErrorResponse);
    }

    OpenAnnualHolidayPopUp() {
        debugger
        this.LeaveDate = "";
        this.description = "";
        this.showAnnualHolidayModal = true;
    }

    CloseAnnualHolidayPopUp() {
        this.showAnnualHolidayModal = false;
    }

    Save() {
        if (this.LeaveDate === "") {
            this._toastrAlertService.Alert_Error('Please add Date');
        }
        else if (this.description === "") {
            this._toastrAlertService.Alert_Error('Please add Description');
        } else {
            this.showAnnualHolidayModal = false;
            this.Loader = true;
            var obj: any = {
                TransactionId: 0,
                Date: this.LeaveDate,
                Description: this.description,
                HasAnnuallyFixedDate: false,
                ApprovedBy: "",
                IsActive: true
            };
            this._annualHolidayService.Save(obj, JSON.parse(localStorage.getItem('AuthToken') || ''))
                .subscribe(serviceResponse => {
                    if (serviceResponse.IsSuccess) {
                        this.Loader = false;
                        this._toastrAlertService.Alert_Success(serviceResponse.Message);
                        this.getAnnualHolidays();
                    }
                    else {
                        this.errMsg = serviceResponse.Message;
                        this.Loader = false;
                        this._toastrAlertService.Alert_Error(this.errMsg);
                    }

                }, ErrorResponse => this.errMsg = ErrorResponse);
        }
    }



}