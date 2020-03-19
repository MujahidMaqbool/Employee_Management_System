import { Component, Injectable, OnInit } from '@angular/core';
import { LeaveTypes } from '../../model/LeaveTypes';
import { FiscalLeaves } from '../../model/FiscalLeaves';
import { Employee } from '../../model/Employee';
import { FiscalLeaveService } from '../../services/fiscalLeaveService';
import { EmployeeService } from '../../services/employeeService';
import { FiscalYears } from '../../model/FiscalYears';
import { EmployeeImages } from '../../model/EmployeeImages';
import { EmployeeProfile } from '../../model/EmployeeProfile';
import { ToastrAlertService } from 'src/services/toastr.service';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'fiscalLeave',
    templateUrl: './fiscalLeave.component.template.html'
})


export class FiscalLeaveComponent implements OnInit {
    LeaveTypesList = new Array<LeaveTypes>();
    FiscalYearsList = new Array<FiscalYears>();
    FiscalLeavesList = new Array<FiscalLeaves>();
    EmployeeList = new Array<Employee>();
    EmployeeImagesList = new Array<EmployeeImages>();
    EmployeeProfile = new EmployeeProfile();
    employeeId: string = "";
    FiscalYear: string = "";
    CreatedUTCDateTime: Date = new Date();
    LastUpdatedUTCDateTime: Date = new Date();
    employeeImage: string = "";
    TotalLeaves: number = 0;
    employeeCode: string = "";
    selectedFiscalYear: string = "";
    empError: string = "";
    errorTotalLeaves: string = "";
    totalLeavesCount: number = 0;
    joiningDate: string = "";
    confirmationDate: string = "";
    errMsg: string = "";

    constructor(private _fiscalLeaveService: FiscalLeaveService,
        private _employeeService: EmployeeService,
        private _toastrAlertService: ToastrAlertService
    ) { }
    ngOnInit() {
        this.employeeImage = "../../assets/Images/default-img.png";
        this.GetEmployees();
        this.GetFiscalYears();
        this.GetLeaveTypes();
    }

    GetEmployees() {
        this._employeeService.getEmployees(JSON.parse(localStorage.getItem('AuthToken') || ''))
            .subscribe(employeeResponse => {
                if (employeeResponse.IsSuccess)
                    this.EmployeeList = employeeResponse.EmployeeResult
            }, ErrorResponse => this.errMsg = ErrorResponse);
    }

    GetLeaveTypes() {
        debugger;
        this._fiscalLeaveService.GetLeaveTypes(JSON.parse(localStorage.getItem('AuthToken') || '')).subscribe(leaveResponse => {
            if (leaveResponse.IsSuccess)
                this.LeaveTypesList = leaveResponse.LeaveTypes;
        }, ErrorResponse => this.errMsg = ErrorResponse);
    }
    GetFiscalYears() {

        this._fiscalLeaveService.GetFiscalYears(JSON.parse(localStorage.getItem('AuthToken') || '')).subscribe(leaveResponse => {
            if (leaveResponse.IsSuccess) {
                this.FiscalYearsList = leaveResponse.FiscalYears;
                for (var i = 0; i < this.FiscalYearsList.length; i++) {
                    if (this.FiscalYearsList[i].IsCurrent == 1)
                        this.selectedFiscalYear = this.FiscalYearsList[i].FiscalYear;
                }
                //console.log('selectedFiscalYear: ' + this.selectedFiscalYear);
            }
        }, ErrorResponse => this.errMsg = ErrorResponse);
    }
    GetFiscalLeaves(EmployeeId: string) {

        if (EmployeeId == "")
            EmployeeId = "00000000-0000-0000-0000-000000000000";
        this._fiscalLeaveService.GetFiscalLeaves(EmployeeId, this.selectedFiscalYear, JSON.parse(localStorage.getItem('AuthToken') || '')).subscribe(leaveResponse => {
            if (leaveResponse.IsSuccess) {

                this.FiscalLeavesList = leaveResponse.FiscalLeaves;

                if (this.FiscalLeavesList.length > 0) {
                    for (var i = 0; i < this.LeaveTypesList.length; i++) {
                        var leaveType = this.LeaveTypesList[i];
                        var fiscalLeave = this.FiscalLeavesList[i];
                        if (leaveType.LeaveTypeId == fiscalLeave.LeaveTypeId)
                            leaveType.TotalLeaves = fiscalLeave.TotalLeaves;
                    }
                }
                else {
                    for (var i = 0; i < this.LeaveTypesList.length; i++) {
                        var leaveType = this.LeaveTypesList[i];
                        leaveType.TotalLeaves = 0;
                    }
                }

                this._fiscalLeaveService.GetEmployeeImage(this.employeeCode, JSON.parse(localStorage.getItem('AuthToken') || '')).subscribe(leaveResponse => {
                    if (leaveResponse.IsSuccess) {

                        if (leaveResponse.EmployeeResult != null) {
                            this.joiningDate = "Joining Date:";
                            this.confirmationDate = "Confirmation Date:";
                            this.EmployeeProfile = leaveResponse.EmployeeResult
                            this.EmployeeImagesList = leaveResponse.EmployeeResult.EmployeeImages
                            this.employeeImage = "";
                            if (this.EmployeeImagesList.length > 0) {
                                var empImg = this.EmployeeImagesList[0];
                                this.employeeImage = empImg.ImageUrl;
                            }
                            else {
                                this.employeeImage = "../../assets/Images/default-img.png";
                            }
                        }
                        else {
                            this.employeeImage = "../../assets/Images/default-img.png";
                            this.joiningDate = "";
                            this.confirmationDate = "";
                            this.EmployeeProfile.Designation = "";
                            this.EmployeeProfile.EmployeeCode = "";
                            this.EmployeeProfile.EmployeeName = "";
                            this.EmployeeProfile.JoiningDate = new Date();
                            this.EmployeeProfile.ConfirmationDate = "";
                        }
                    }
                }, ErrorResponse => this.errMsg = ErrorResponse);
            }
        }, ErrorResponse => this.errMsg = ErrorResponse);
    }
    onEmployeeChangeFiscalLeaves(params: any) {
        this.empError = "";
        this.errorTotalLeaves = "";
        var EmployeeId = params.split("+")[0];
        var empCode = params.split("+")[1];
        this.employeeId = EmployeeId;
        this.employeeCode = empCode;
        this.GetFiscalLeaves(EmployeeId);
    }

    onChangeFiscalYear() {
        this.GetFiscalLeaves(this.employeeId);
    }

    AddFiscalLeaves(addFiscalLeaveForm: NgForm) {

        for (var field in addFiscalLeaveForm.controls) {
            if (addFiscalLeaveForm.controls[field].value == null) {
                this._toastrAlertService.Alert_Error("Please enter all leaves");
                return;
            }
        }

        this.totalLeavesCount = 0;
        this.errorTotalLeaves = "";

        var array = [];
        if (this.employeeId == "") {
            this.empError = "";
            this._toastrAlertService.Alert_Error("Please select an employee");
            return
        }
        for (let i = 0; i < this.LeaveTypesList.length; i++) {
            var leaveType = this.LeaveTypesList[i];

            //if (leaveType.TotalLeaves == 0) {
            //this.totalLeavesCount = this.totalLeavesCount + 1;
            //if (this.totalLeavesCount == this.LeaveTypesList.length) {
            //debugger
            //this.errorTotalLeaves = "Please enter a number";
            //this.totalLeavesCount = 0;
            //}
            //}

            let obj = {
                EmployeeId: this.employeeId,
                LeaveTypeId: leaveType.LeaveTypeId,
                TotalLeaves: leaveType.TotalLeaves,
                Aproved: 1,
                AprovedBy: this.employeeId,
                FiscalYear: this.selectedFiscalYear,
                CreatedUTCDateTime: this.CreatedUTCDateTime,
                LastUpdatedUTCDateTime: this.LastUpdatedUTCDateTime
            };
            array.push(obj);
        }
        debugger
        if (this.empError == "" && this.errorTotalLeaves == "") {
            debugger;
            this._fiscalLeaveService.SaveEmployeeFiscalLeaves(array, JSON.parse(localStorage.getItem('AuthToken') || '')).subscribe(leaveResponse => {
                if (leaveResponse.IsSuccess) {
                    //this.errorTotalLeaves = "";
                    //for (let i = 0; i < this.LeaveTypesList.length; i++) {
                    //    this.LeaveTypesList[i].TotalLeaves = 0;

                    //}

                    this._toastrAlertService.Alert_Success("Employee Leave Record Saved");
                } else {
                    this._toastrAlertService.Alert_Error("Something went wrong!");
                }
            }, ErrorResponse => this.errMsg = ErrorResponse);
        }

    }
}
