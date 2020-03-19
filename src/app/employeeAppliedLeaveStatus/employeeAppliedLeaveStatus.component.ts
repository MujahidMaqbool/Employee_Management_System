import { Component, Injectable, Input } from '@angular/core';
import { ToastrAlertService } from 'src/services/toastr.service';
import { EmployeeLeave } from '../../model/EmployeeLeave';
import { Employee } from '../../model/Employee';
import { EmployeeAppliedLeavesStatusService } from '../../services/employeeAppliedLeavesStatusService';
import { EmployeeService } from '../../services/employeeService';
import { LeaveApplicationService } from '../../services/leaveApplicationService';
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: 'AppliedLeavesStatus',
    templateUrl: './employeeAppliedLeaveStatus.component.template.html'
})



export class EmployeeAppliedLeaveStatusComponent {
    Loader: boolean = true;
    EmployeeAppliedLeaveList = new Array<EmployeeLeave>();
    EmployeeList = new Array<Employee>();
    errMsg: string = "";
    LeaveId: number = 0;
    leaveStatus: string = "";
    deleteShowModal: boolean = false;

    employeeAppliedLeave = new EmployeeLeave();

    @Input('show-modal') showLeaveModal: boolean = false;

    constructor(private route: ActivatedRoute,
        private _employeeAppliedLeaveStatusService: EmployeeAppliedLeavesStatusService,
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
    }

    GetLeave(employeeCode: string, status: string) {
        this.Loader = true;
        this._employeeAppliedLeaveStatusService.GetEmployeeAppliedLeavesStatus(employeeCode, status, JSON.parse(localStorage.getItem('AuthToken') || '')).subscribe(leaveResponse => {
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
                this.Loader = false;
            }
            else {
                this.Loader = false;
            }
        }, ErrorResponse => this.errMsg = ErrorResponse);
    }

    onStatusChange(status: string) {
        this.leaveStatus = status;
        this.GetLeave("", this.leaveStatus);
    }

    SelectedLeave(leave: any) {
        this.employeeAppliedLeave = leave;
        this.showLeaveModal = true;
    }

    CloseLeavePopUp() {
        this.showLeaveModal = false;
    }

    OpenDeletePopUp() {
        this.showLeaveModal = false;
        this.deleteShowModal = true;
    }

    CloseDeletePopUp() {
        this.deleteShowModal = false;

    }

    CancelLeave() {
        this.deleteShowModal = false;
        this.Loader = true;
        this._leaveApplicationService.SendLeaveApplication("", "", "", "", this.employeeAppliedLeave.UserNote, this.employeeAppliedLeave.TransactionId, 'Cancel', "", this.employeeAppliedLeave.TotalLeaves, this.employeeAppliedLeave.ChildLeaveTypeId, JSON.parse(localStorage.getItem('AuthToken') || ''))
            .subscribe(leaveResponse => {
                if (leaveResponse.IsSuccess) {
                    this.GetLeave("", this.leaveStatus);
                    this.Loader = false;
                    this._toastrAlertService.Alert_Success("Leave Cancelled Successfully");
                } else {
                    this.errMsg = leaveResponse.Message;
                    this._toastrAlertService.Alert_Error(this.errMsg);
                }
            }, ErrorResponse => this.errMsg = ErrorResponse);
    }


}