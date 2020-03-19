import { Router } from '@angular/router';
import { Component, OnInit, Inject, ElementRef, ViewChild, Input } from '@angular/core';
import { Injectable } from '@angular/core';
import { EmployeeReport } from '../../model/EmployeeReport';
import { ToastrAlertService } from 'src/services/toastr.service';
import { AttendanceService } from "../../services/attendanceService";
import { AttendanceSummaryPDF } from "../../model/AttedndanceSummaryPDF";
import { EmployeeLeaveService } from '../../services/employeeLeaveService';
import { LeaveTypes } from '../../model/LeaveTypes';
import { GetLeaveRequestService } from '../../services/getLeaveRequestService';
import { EmployeeLeave } from '../../model/EmployeeLeave';

@Component({
    selector: 'attendanceMonthlyStatus',
    templateUrl: './attendanceMonthlyStatus.component.template.html',
    providers: [
        { provide: 'Window', useValue: window }
    ]
})

export class AttendanceMonthlyStatusComponent {
    date: Date = new Date();
    month: any = [];
    monthName: string = '';
    SelectMonth: any;
    AttedndanceMonthlyStatusModel = new Array<AttendanceSummaryPDF>();
    EmployeeAttedndanceMonthlyStatusModel = new AttendanceSummaryPDF();
    FromDate: Date = new Date();
    ToDate: Date = new Date();
    TotalAttendedDays: Number = 0;
    TotalRequiredHours: Number = 0;
    errMsg: string = "";
    Loader: boolean = false;
    LeaveTypesList = new Array<LeaveTypes>();
    leaveTypeId: string = "";
    LeaveDeduction: Number = 0;
    LeaveCompensation: Number = 0;
    EmployeeLeaveList = new Array<EmployeeLeave>();

    months: any = [
        'January', 'February', 'March', 'April', 'May',
        'June', 'July', 'August', 'September',
        'October', 'November', 'December'
    ];

    @Input('show-modal') showEmployeeMonthlyStatusModal: boolean = false;

    constructor(private _getLeaveService: GetLeaveRequestService,
        private _toastrAlertService: ToastrAlertService,
        private _attendanceService: AttendanceService,
        private _employeeLeaveService: EmployeeLeaveService
    ) { }

    ngOnInit() {
        this.getMonthName(this.date.getMonth());
    }

    getMonthName(monthNumber: number) {

        var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        var today = new Date();

        var d;

        for (var i = 6; i > 0; i -= 1) {

            d = new Date(today.getFullYear(), today.getMonth() + 1 - i, 1);

            var abc: any = {
                MonthName: monthNames[d.getMonth()],
                Id: d.getMonth()
            }

            this.month.push(abc);
        }

        this.month.reverse();
    }

    onMonthChange(selectMonth: any) {
        debugger
        if (selectMonth != '') {
            this.monthName = this.months[selectMonth];
            this.SelectMonth = selectMonth;
            var firstDay = new Date(this.ToDate.getFullYear(), Number(selectMonth), 1);
            var lastDay = new Date(this.ToDate.getFullYear(), Number(selectMonth) + 1, 0);

            var d = new Date();
            if (d.getMonth() < firstDay.getMonth()) {

                var firstyear = firstDay.getFullYear();
                var firstmonth = firstDay.getMonth();
                var firstday = firstDay.getDate();
                this.FromDate = new Date(firstyear - 1, firstmonth, firstday)

                var lastyear = lastDay.getFullYear();
                var lastmonth = lastDay.getMonth();
                var lastday = lastDay.getDate();
                this.ToDate = new Date(lastyear - 1, lastmonth, lastday)
            }
            else {
                this.FromDate = firstDay;
                this.ToDate = lastDay;
            }
        }
        else {
            this.SelectMonth = undefined;
        }
    }

    GetAttendanceSummary() {
        this.Loader = true;
        if (this.SelectMonth == undefined) {
            this._toastrAlertService.Alert_Error("Please select month");
            this.Loader = false;
        } else {
            var employeeReport = new EmployeeReport();

            employeeReport.FromDate = this.FromDate;
            employeeReport.ToDate = this.ToDate;

            this._attendanceService.GetEmployeeAttendanceSummaryPDF(employeeReport, JSON.parse(localStorage.getItem('AuthToken') || '')).subscribe(employeeAttendancePDFResponse => {
                if (employeeAttendancePDFResponse.IsSuccess) {

                    this.AttedndanceMonthlyStatusModel = employeeAttendancePDFResponse.EmployeeAttendanceSummaryPDFResult;
                    for (let i = 0; i < this.AttedndanceMonthlyStatusModel.length; i++) {
                        this.AttedndanceMonthlyStatusModel[i].Diffrence = this.AttedndanceMonthlyStatusModel[i].RequiredHours - this.AttedndanceMonthlyStatusModel[i].HoursinOffice;
                        this.AttedndanceMonthlyStatusModel[i].Deduction = 0;
                        if (Number(this.AttedndanceMonthlyStatusModel[i].Diffrence) > 4) {
                            this.AttedndanceMonthlyStatusModel[i].Deduction = Math.abs(this.AttedndanceMonthlyStatusModel[i].Diffrence / 8);
                        }
                    }
                    this.TotalAttendedDays = employeeAttendancePDFResponse.TotalAttendedDays;
                    this.TotalRequiredHours = employeeAttendancePDFResponse.TotalRequiredHours;
                    this.Loader = false;
                }
                else { }
            }, ErrorResponse => this.errMsg = ErrorResponse);
        }
    }

    OpenEmployeeMonthlyStatusPopUp(val: any) {
        var monthName = this.monthNumToName(this.SelectMonth);
        this.EmployeeAttedndanceMonthlyStatusModel = val;
        if (this.EmployeeAttedndanceMonthlyStatusModel.Deduction > 0 || this.EmployeeAttedndanceMonthlyStatusModel.Compensation > 0) {
            this.LeaveDeduction = this.EmployeeAttedndanceMonthlyStatusModel.Deduction;
            this.LeaveCompensation = this.EmployeeAttedndanceMonthlyStatusModel.Compensation;
            if (this.EmployeeAttedndanceMonthlyStatusModel.Deduction > 0) {
                this.GetLeavesInfo();
            }
            this.showEmployeeMonthlyStatusModal = true;
        }
    }

    CloseEmployeeMonthlyStatusPopUp() {
        this.showEmployeeMonthlyStatusModal = false;
    }

    monthNumToName(monthnum: any) {
        return this.months[monthnum] || '';
    }

    GetLeavesInfo() {
        this._getLeaveService.GetEmployeeLeaveInfo(this.EmployeeAttedndanceMonthlyStatusModel.EmployeeId, JSON.parse(localStorage.getItem('AuthToken') || '')).subscribe(leaveResponse => {
            if (leaveResponse.IsSuccess) {

                this.LeaveTypesList = leaveResponse.Result.LeaveTypes;
                this.EmployeeLeaveList = leaveResponse.Result.EmployeeLeavesRecord;
            }

        }, ErrorResponse => this.errMsg = ErrorResponse);
    }

    onLeaveChange(leaveType: string) {
        this.leaveTypeId = leaveType;
    }

    Save() {
      debugger;
        if (this.EmployeeAttedndanceMonthlyStatusModel.Deduction > 0 && this.LeaveDeduction == 0) {
            this._toastrAlertService.Alert_Error("Please Add Leaves Deduction");
        } else if (this.EmployeeAttedndanceMonthlyStatusModel.Compensation > 0 && this.LeaveCompensation == 0) {
            this._toastrAlertService.Alert_Error("Please Add Compensation Leaves");
        } else if (this.EmployeeAttedndanceMonthlyStatusModel.Deduction > 0 && this.leaveTypeId == "") {
            this._toastrAlertService.Alert_Error("Please Select Leave Type");
        }
        else {

            this.showEmployeeMonthlyStatusModal = false;
            this.Loader = true;
            var month: Number = Number(this.SelectMonth) + 1;
            var approvedBy: string = JSON.parse(localStorage.getItem('EmployeeId') || '');

            var obj: any = {
                EmployeeId: this.EmployeeAttedndanceMonthlyStatusModel.EmployeeId,
                ApprovedBy: approvedBy,
                Month: month,
                LeaveTypeId: this.leaveTypeId,
                Deduction: this.LeaveDeduction,
                Compensation: this.LeaveCompensation
            };

            this._employeeLeaveService.SaveEmployeeLeaveHistory(obj, JSON.parse(localStorage.getItem('AuthToken') || ''))
                .subscribe(serviceResponse => {
                    if (serviceResponse.IsSuccess) {
                        this.Loader = false;
                        this._toastrAlertService.Alert_Success(serviceResponse.Message);
                        this.GetAttendanceSummary();
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
