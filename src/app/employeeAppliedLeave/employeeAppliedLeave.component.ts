import { Component, Injectable, Input } from '@angular/core';
import { ToastrAlertService } from 'src/services/toastr.service';
import { EmployeeLeave } from '../../model/EmployeeLeave';
import { Employee } from '../../model/Employee';
import { EmployeeAppliedLeaveService } from '../../services/employeeAppliedLeaveService';
import { EmployeeService } from '../../services/employeeService';
import { LeaveApplicationService } from '../../services/leaveApplicationService';
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: 'AppliedLeaves',
    templateUrl: './employeeAppliedLeave.component.template.html'
})


export class EmployeeAppliedLeaveComponent {

    Loader: boolean = false;
    EmployeeAppliedLeaveList = new Array<EmployeeLeave>();
    EmployeeList = new Array<Employee>();
    LeaveId: number = 0;
    errMsg: string = "";
    employeeCode: string = "";
    employeeStatus: string = "";
    employeeAppliedLeave = new EmployeeLeave();
    leaveStatus: string = "";

    @Input('show-modal') showLeaveModal: boolean = false;

    constructor(private route: ActivatedRoute,
        private _employeeAppliedLeaveService: EmployeeAppliedLeaveService,
        private _employeeService: EmployeeService,
        private _leaveApplicationService: LeaveApplicationService,
        private _toastrAlertService: ToastrAlertService
    ) { }
    ngOnInit() {
        this.Loader = true;
        this.route
            .queryParams
            .subscribe(params => {
                // Defaults to 0 if no query param provided.
                this.LeaveId = +params['LeaveId'] || 0;
            });
        this.GetLeave("", "");
        this.GetEmployees();
    }

    GetLeave(employeeCode: string, status: string) {
        this.Loader = true;
        this._employeeAppliedLeaveService.GetEmployeeAppliedLeaves(employeeCode, status, JSON.parse(localStorage.getItem('AuthToken') || '')).subscribe(leaveResponse => {
            if (leaveResponse.IsSuccess) {
                this.EmployeeAppliedLeaveList = leaveResponse.EmployeeAppliedLeaves;
                if (this.LeaveId > 0) {
                    debugger
                    this.employeeAppliedLeave = this.EmployeeAppliedLeaveList.filter(
                        al => al.TransactionId === this.LeaveId)[0];
                    this.SelectedLeave(this.employeeAppliedLeave);
                    this.Loader = false;
                    this.LeaveId = 0;
                }
                this.EmployeeAppliedLeaveList = this.EmployeeAppliedLeaveList.filter(i => i.EmployeeCode != JSON.parse(localStorage.getItem('EmployeeCode') || ''));
                this.Loader = false;
            }
            else { this.Loader = false; }
        }, ErrorResponse => this.errMsg = ErrorResponse);
    }

    GetEmployees() {
        this._employeeService.getEmployees(JSON.parse(localStorage.getItem('AuthToken') || ''))
            .subscribe(employeeResponse => {
                if (employeeResponse.IsSuccess)
                    this.EmployeeList = employeeResponse.EmployeeResult
            }, ErrorResponse => this.errMsg = ErrorResponse);
    }

    onEmployeeChange(EmployeeCode: string) {
        this.employeeCode = EmployeeCode;
        this.GetLeave(this.employeeCode, this.employeeStatus);
    }

    onStatusChange(status: string) {
        this.employeeStatus = status;
        this.GetLeave(this.employeeCode, this.employeeStatus);
    }

    SelectedLeave(leave: any) {
        this.employeeAppliedLeave = leave;
        this.showLeaveModal = true;
    }

    ApproveLeave(status: string) {
        debugger;
        if (this.employeeAppliedLeave.ManagerNote === "" || this.employeeAppliedLeave.ManagerNote == null) {
            this._toastrAlertService.Alert_Error('Please add Reason');
        }
        else {
            this.showLeaveModal = false;
            this.Loader = true;
            this._leaveApplicationService.SendLeaveApplication("", "", "", "", "", this.employeeAppliedLeave.TransactionId, status, this.employeeAppliedLeave.ManagerNote, this.employeeAppliedLeave.TotalLeaves, this.employeeAppliedLeave.ChildLeaveTypeId, JSON.parse(localStorage.getItem('AuthToken') || ''))
                .subscribe(leaveResponse => {
                    this.GetLeave(this.employeeCode, this.employeeStatus);
                    this.errMsg = leaveResponse.Message;
                    this.Loader = false;
                    this._toastrAlertService.Alert_Error(this.errMsg);
                }, ErrorResponse => this.errMsg = ErrorResponse);
        }
    }

    CloseLeavePopUp() {
        this.showLeaveModal = false;
    }


}