import { Component, Injectable } from '@angular/core';
import { ToastrAlertService } from 'src/services/toastr.service';
import { EmployeeLeave } from '../../model/EmployeeLeave';
import { LeaveTypes } from '../../model/LeaveTypes';
import { Employee } from '../../model/Employee';
import { AnnualHolidays } from '../../model/AnnualHolidays';
import { EmployeeLeaveService } from '../../services/employeeLeaveService';
import { LeaveApplicationService } from '../../services/leaveApplicationService';
import { GetLeaveRequestService } from '../../services/getLeaveRequestService';
import { forEach } from '@angular/router/src/utils/collection';


@Component({
    selector: 'leaveApplicationForm',
    templateUrl: './leaveApplicatonForm.component.template.html'
})


export class LeaveApplicationComponent {

    Loader: boolean = false;
    FromDate: Date = new Date();
    ToDate: Date = new Date();
    EmployeeLeaveList = new Array<EmployeeLeave>();
    LeaveTypesList = new Array<LeaveTypes>();
    EmployeeLeaveHistory = new Array<EmployeeLeave>();
    AnnualHolidays = new Array<AnnualHolidays>();
    errMsg: string = "";
    leaveTypeId: string = "";
    childleaveTypeId: string = "0";
    userNote: string = "";
    FiscalYear: string = "";
    TotalLeaveDays: number = 0;
    EmployeePendingApplication = new Array<EmployeeLeave>();

    constructor(private _getLeaveService: GetLeaveRequestService,
        private _leaveApplicationService: LeaveApplicationService,
        private _employeeLeaves: EmployeeLeaveService,
        private _toastrAlertService: ToastrAlertService
    ) { }

    ngOnInit() {
        this.GetLeavesInfo();
        this.GetEmployeeLeaves();
        this.GetAnnualHolidays();
    }


    GetLeavesInfo() {
        this._getLeaveService.GetLeaveInfo(JSON.parse(localStorage.getItem('AuthToken') || '')).subscribe(leaveResponse => {
            if (leaveResponse.IsSuccess) {
                debugger;
                this.LeaveTypesList = leaveResponse.Result.LeaveTypes;
                this.EmployeeLeaveList = leaveResponse.Result.EmployeeLeavesRecord;
                this.FiscalYear = leaveResponse.Result.FiscalYear.FiscalYear;
            }
            debugger;
        }, ErrorResponse => this.errMsg = ErrorResponse);
    }

    onEndDateChange() {
        debugger;
        this.TotalLeaveDays = 0;

        if (new Date(this.FromDate) > new Date(this.ToDate)) {

            this._toastrAlertService.Alert_Error("End date should be greater than Start date");
        }
        else {
            this.CountLeaveDays();
        }
    }

    CountLeaveDays() {
        for (var d = new Date(this.FromDate); d <= new Date(this.ToDate); d.setDate(d.getDate() + 1)) {

            var dayNumber = d.getDay();

            if (dayNumber == 6) {
            }
            else if (dayNumber == 0) {
            }
            else {
                if (this.AnnualHolidays != null && this.AnnualHolidays.length > 0) {
                    var leave = this.AnnualHolidays.filter(holiday => new Date(holiday.Date).getDate() == d.getDate() && new Date(holiday.Date).getMonth() == d.getMonth() && new Date(holiday.Date).getFullYear() == d.getFullYear());

                    if (leave != null && leave.length > 0) {
                    }
                    else {
                        this.TotalLeaveDays += 1;
                    }
                }
                else {
                    this.TotalLeaveDays += 1;
                }
            }
        }
    }

    onStartDateChange() {
        var dateOut1 = new Date(this.FromDate);
        var dateOut2 = new Date(this.ToDate);

        if (dateOut1 > dateOut2) {
            this.ToDate = dateOut1;
            this.TotalLeaveDays = 1;
            //this._toastrAlertService.Alert_Info("Total Days selected: " + this.TotalLeaveDays.toString());
        }
    }

    onLeaveChange(leaveType: string) {
        this.leaveTypeId = leaveType;
        this.childleaveTypeId = "0";
        this.TotalLeaveDays = 0;
        this.CountLeaveDays();
    }

    onChildLeaveChange(leaveType: string) {
        debugger;
        this.childleaveTypeId = leaveType;
    }

    VerifyLeaveApplication() {
        debugger;
        var dateOut1 = new Date(this.FromDate);
        var dateOut2 = new Date(this.ToDate);

        var dateBeforeFrom = new Date(dateOut1.getFullYear(), dateOut1.getMonth(), (dateOut1.getDate() - 1));
        var dateAfterTo = new Date(dateOut2.getFullYear(), dateOut2.getMonth(), (dateOut2.getDate() + 1));

        var dateFrom2 = new Date(dateOut2.getFullYear(), dateOut2.getMonth(), (dateOut2.getDate() + 2));
        var dateTo1 = new Date(dateOut2.getFullYear(), dateOut2.getMonth(), (dateOut2.getDate() - 1));

        if (this.leaveTypeId === "") {
            this._toastrAlertService.Alert_Error('Please select leave type');
        }
        else if (this.childleaveTypeId === "0" && this.leaveTypeId === "7") {
            this._toastrAlertService.Alert_Error('Please select leave type against half day leave.');
        }
        else if (this.userNote === "") {
            this._toastrAlertService.Alert_Error('Please add some description');
        }
        else if (dateOut2 < dateOut1) {
            this._toastrAlertService.Alert_Error('Invalid leave days. To date should be greater than From date.');
        }
        else if (this.TotalLeaveDays < 1) {
            this._toastrAlertService.Alert_Error('Invalid leave days. Please try other dates.');
        }
        else {
            var alertShowed: boolean = false;

            if (this.leaveTypeId === "7") {
                if (dateOut1 != dateOut2) {

                    alertShowed = true;
                    this._toastrAlertService.Alert_Error("Half Leave can only bo selected for one day.");
                }
            }

            var dayNumberFrom = dateOut1.getDay();
            var dayNumberTo = dateOut2.getDay();

            if (dayNumberFrom == 6 && dayNumberTo == 6 && (dateOut1.getTime() / 1000) === (dateOut2.getTime() / 1000)) {
                alertShowed = true;
                this._toastrAlertService.Alert_Error("Leaves cannot be applied on a holiday");
            }
            else if (dayNumberFrom == 0 && dayNumberTo == 0 && (dateOut1.getTime() / 1000) === (dateOut2.getTime() / 1000)) {
                alertShowed = true;
                this._toastrAlertService.Alert_Error("Leaves cannot be applied on a holiday");
            }
            else if (dayNumberFrom == 6 && dayNumberTo == 0 && (dateOut1.getTime() / 1000) === (dateTo1.getTime() / 1000)) {
                alertShowed = true;
                this._toastrAlertService.Alert_Error("Leaves cannot be applied on a holiday");
            }
            else if (dayNumberFrom == 5 && dayNumberTo == 1 && (dateFrom2.getTime() / 1000) === (dateTo1.getTime() / 1000)) {
                alertShowed = true;
                this._toastrAlertService.Alert_Error("Leaves cannot be applied along with a holidays");
            }

            if (this.AnnualHolidays != null && this.AnnualHolidays.length > 0 && alertShowed == false) {

                var leaveFrom = this.AnnualHolidays.filter(holiday => new Date(holiday.Date).getDate() == dateOut1.getDate() && new Date(holiday.Date).getMonth() == dateOut1.getMonth() && new Date(holiday.Date).getFullYear() == dateOut1.getFullYear());

                if (leaveFrom != null && leaveFrom.length > 0) {
                    if (dateOut1 == dateOut2) {
                        alertShowed = true;
                        this._toastrAlertService.Alert_Info("There is an holiday on " + dateOut1.toDateString());
                    }
                }
                //else {

                //    var leaveTo = this.AnnualHolidays.filter(holiday => new Date(holiday.Date).getDate() == dateOut2.getDate() && new Date(holiday.Date).getMonth() == dateOut2.getMonth() && new Date(holiday.Date).getFullYear() == dateOut2.getFullYear());

                //    if (leaveTo != null && leaveTo.length > 0) {
                //        alertShowed = true;
                //        this._toastrAlertService.Alert_Info("There is an holiday on " + dateOut2.toDateString());
                //    }
                //}
            }

            if (this.leaveTypeId == "1" && alertShowed == false) {

                //var timeDiff = Math.abs(this.ToDate.getTime() - this.FromDate.getTime());
                //var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

                if (this.TotalLeaveDays > 2) {
                    alertShowed = true;
                    this._toastrAlertService.Alert_Error("You cannot apply more than two consecutive Casual leaves");
                }
                else if (dayNumberFrom == 1 && dayNumberTo == 2) {
                    alertShowed = true;
                    this._toastrAlertService.Alert_Error("Two casual leaves cannot be applied along with a holiday.");
                }
                else if (dayNumberFrom == 4 && dayNumberTo == 5) {
                    alertShowed = true;
                    this._toastrAlertService.Alert_Error("Two casual leaves cannot be applied with a holiday.");
                }
                else if (dayNumberFrom == 5 && dayNumberTo == 1) {
                    alertShowed = true;
                    this._toastrAlertService.Alert_Error("Casual leaves cannot be applied between holidays.");
                }
                //else if (dayNumberTo == 1) {
                //    alertShowed = true;
                //    this._toastrAlertService.Alert_Error("Casual leaves cannot be applied with holiday.");
                //}
                else if (this.AnnualHolidays != null && this.AnnualHolidays.length > 0) {



                    var leaveFrom = this.AnnualHolidays.filter(holiday => new Date(holiday.Date).getDate() == dateBeforeFrom.getDate() && new Date(holiday.Date).getMonth() == dateBeforeFrom.getMonth() && new Date(holiday.Date).getFullYear() == dateBeforeFrom.getFullYear());

                    var leaveTo = this.AnnualHolidays.filter(holiday => new Date(holiday.Date).getDate() == dateAfterTo.getDate() && new Date(holiday.Date).getMonth() == dateAfterTo.getMonth() && new Date(holiday.Date).getFullYear() == dateAfterTo.getFullYear());

                    if ((leaveFrom != null && leaveFrom.length > 0) && (leaveTo != null && leaveTo.length > 0)) {
                        alertShowed = true;
                        this._toastrAlertService.Alert_Error("Casual leaves cannot be applied between two holidays.");
                    }
                    else if ((leaveFrom != null && leaveFrom.length > 0) && (dateOut1.getTime() / 1000) === (dateTo1.getTime() / 1000)) {
                        alertShowed = true;
                        this._toastrAlertService.Alert_Error("Two casual leaves cannot be applied along with a holiday.");
                    }
                    else if ((leaveTo != null && leaveTo.length > 0) && (dateOut1.getTime() / 1000) === (dateTo1.getTime() / 1000)) {
                        alertShowed = true;
                        this._toastrAlertService.Alert_Error("Two casual leaves cannot be applied along with a holiday.");
                    }
                    else if ((leaveFrom != null && leaveFrom.length > 0) && dayNumberTo == 5) {
                        alertShowed = true;
                        this._toastrAlertService.Alert_Error("Casual leaves cannot be applied between holidays.");
                    }
                    else if ((leaveTo != null && leaveTo.length > 0) && dayNumberTo == 1) {
                        alertShowed = true;
                        this._toastrAlertService.Alert_Error("Casual leaves cannot be applied between holidays.");
                    }
                }
            }
            debugger;
            if (this.EmployeeLeaveHistory != null && this.EmployeeLeaveHistory.length > 0 && alertShowed == false) {

                var employeeTotalLeaveApplications: number = 0;

                var totalLeaveApplications = this.EmployeeLeaveHistory.filter(leave => leave.LeaveTypeId == this.leaveTypeId || leave.ChildLeaveTypeId == this.leaveTypeId);

                if (totalLeaveApplications != null && totalLeaveApplications.length > 0) {
                    employeeTotalLeaveApplications = totalLeaveApplications.map(c => c.TotalLeaves).reduce((sum, current) => sum + current);
                }

                var EmployeeRemainingLeaves: number = 0;

                var remainingLeaves = this.EmployeeLeaveList.filter(leave => leave.LeaveTypeId == this.leaveTypeId);

                if (remainingLeaves != null && remainingLeaves.length > 0) {
                    EmployeeRemainingLeaves = remainingLeaves.map(c => c.RemainingLeaves).reduce(current => current);
                }

                if ((employeeTotalLeaveApplications + this.TotalLeaveDays) > EmployeeRemainingLeaves) {
                    alertShowed = true;

                    var leaveType = this.LeaveTypesList.filter(i => i.LeaveTypeId.toString() == this.leaveTypeId);
                    if (leaveType != null && leaveType.length > 0) {
                        this._toastrAlertService.Alert_warning("You have no more " + leaveType[0].Description + ". You have already requested all leaves against " + leaveType[0].Description + ". Please choose another leave type.");
                    }
                    else {
                        this._toastrAlertService.Alert_warning("You have no more leave against this type of leaves. You have been already requested all leaves against this type. Please choose another leave type.");
                    }
                }
                else {
                    var empLeave = this.EmployeeLeaveHistory.filter(leave => ((new Date(leave.FromDateTime).getTime() / 1000) >= (dateOut1.getTime() / 1000) && (new Date(leave.FromDateTime).getTime() / 1000) <= (dateOut2.getTime() / 1000)) || ((new Date(leave.ToDateTime).getTime() / 1000) >= (dateOut1.getTime() / 1000) && (new Date(leave.ToDateTime).getTime() / 1000) <= (dateOut2.getTime() / 1000)));

                    if (empLeave != null && empLeave.length > 0) {
                        alertShowed = true;
                        this._toastrAlertService.Alert_Error("You have been already applied for a leave in the above selected Dates.");
                    }
                }
            }

            if (alertShowed == false) {
                this._leaveApplicationService.VerifyLeaveApplication(dateOut1, this.leaveTypeId, dateOut2, JSON.parse(localStorage.getItem('AuthToken') || ''))
                    .subscribe(leaveResponse => {

                        this.errMsg = leaveResponse.Message;

                        if (leaveResponse.IsSuccess) {
                            this.ApplyLeave();
                        }
                        else {
                            this._toastrAlertService.Alert_Error(this.errMsg);
                        }

                    }, ErrorResponse => this.errMsg = ErrorResponse);
            }
        }

    }

    ApplyLeave() {
        this.Loader = true;
        debugger;
        var dateOut1 = new Date(this.FromDate);
        var dateOut2 = new Date(this.ToDate);
        var date = new Date();

        this._leaveApplicationService.SendLeaveApplication(date.toDateString(), dateOut1.toDateString(), dateOut2.toDateString(), this.leaveTypeId, this.userNote, 0, "Pending", "", this.TotalLeaveDays, this.childleaveTypeId, JSON.parse(localStorage.getItem('AuthToken') || ''))
            .subscribe(leaveResponse => {
                this.Loader = false;
                debugger;
                if (leaveResponse.IsSuccess) {
                    this.Loader = false;
                    this._toastrAlertService.Alert_Success("Leave application has been submitted successfully.");
                    this.userNote = "";
                    this.FromDate = new Date();
                    this.ToDate = new Date();
                }
                else {
                    this.errMsg = leaveResponse.Message;
                    this._toastrAlertService.Alert_Error(this.errMsg);
                }

            }, ErrorResponse => this.errMsg = ErrorResponse);
    }


    GetEmployeeLeaves() {
        debugger;
        this._employeeLeaves.GetEmployeeAllLeaves(JSON.parse(localStorage.getItem('AuthToken') || '')).subscribe(leaveResponse => {
            if (leaveResponse.IsSuccess) {
                debugger;
                this.EmployeeLeaveHistory = leaveResponse.EmployeeLeaves;

                if (this.EmployeeLeaveHistory != null && this.EmployeeLeaveHistory.length > 0) {

                    var leaveApp = this.EmployeeLeaveHistory.filter(i => i.Status == "Pending");
                    debugger;
                    if (leaveApp != null && leaveApp.length > 0) {
                        for (var v in leaveApp) // for acts as a foreach  
                        {
                            var leave = this.EmployeePendingApplication.filter(i => i.LeaveTypeId === leaveApp[v].LeaveTypeId || i.ChildLeaveTypeId === leaveApp[v].LeaveTypeId);

                            if (leave != null && leave.length > 0) {
                                leave[0].TotalLeaves += leaveApp[v].TotalLeaves;
                            }
                            else {
                                var leaveApplication = new EmployeeLeave();

                                leaveApplication.EmployeeId = leaveApp[v].EmployeeId;
                                leaveApplication.LeaveTypeId = leaveApp[v].LeaveTypeId;
                                leaveApplication.ChildLeaveTypeId = leaveApp[v].ChildLeaveTypeId;
                                leaveApplication.Date = leaveApp[v].Date;
                                leaveApplication.TotalLeaves = leaveApp[v].TotalLeaves;
                                leaveApplication.Status = leaveApp[v].Status;


                                var leaveType = this.LeaveTypesList.filter(i => i.LeaveTypeId.toString() == leaveApp[v].LeaveTypeId);
                                if (leaveType != null && leaveType.length > 0) {
                                    leaveApplication.LeaveType = leaveType[0].Description;
                                }

                                this.EmployeePendingApplication.push(leaveApplication);
                            }
                        }
                    }
                }
            }
        }, ErrorResponse => this.errMsg = ErrorResponse);
    }

    GetAnnualHolidays() {
        debugger;
        this._employeeLeaves.GetAnnualHolidays(JSON.parse(localStorage.getItem('AuthToken') || '')).subscribe(leaveResponse => {
            if (leaveResponse.IsSuccess) {
                debugger;
                this.AnnualHolidays = leaveResponse.Holidays;
            }
        }, ErrorResponse => this.errMsg = ErrorResponse);
    }
}