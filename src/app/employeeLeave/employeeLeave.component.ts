import { Component, Injectable } from '@angular/core';
import { EmployeeLeave } from '../../model/EmployeeLeave';
import { Employee } from '../../model/Employee';
import { EmployeeLeaveService } from '../../services/employeeLeaveService';
import { EmployeeService } from '../../services/employeeService';

@Component({
    selector: 'Leaves',
    templateUrl: './employeeLeave.component.template.html'
})


export class EmployeeLeaveComponent {
    EmployeeLeaveList = new Array<EmployeeLeave>();
    EmployeeList = new Array<Employee>();
    errMsg: string = "";
    Loader: boolean = true;

    constructor(private _employeeLeaveService: EmployeeLeaveService, private _employeeService: EmployeeService) { }
    ngOnInit() {
        this.Loader = true;
        this.GetEmployees();
    }

    GetLeave(employeeCode: string) {
        this.Loader = true;
        this._employeeLeaveService.GetEmployeeLeaves(employeeCode, JSON.parse(localStorage.getItem('AuthToken') || '')).subscribe(leaveResponse => {
            if (leaveResponse.IsSuccess) {
                this.EmployeeLeaveList = leaveResponse.EmployeeLeaves;
                this.Loader = false;
            } else {
                this.Loader = false;
            }
        }, ErrorResponse => this.errMsg = ErrorResponse);
    }

    GetEmployees() {
        this._employeeService.getEmployees(JSON.parse(localStorage.getItem('AuthToken') || ''))
            .subscribe(employeeResponse => {
                if (employeeResponse.IsSuccess) {
                    this.Loader = false;
                    this.EmployeeList = employeeResponse.EmployeeResult;
                    if (this.EmployeeList.length == 1) {
                        this.GetLeave(this.EmployeeList[0].EmployeeCode);
                    } else { this.GetLeave(""); }
                } else {
                    this.Loader = false;
                }


            }, ErrorResponse => this.errMsg = ErrorResponse);
    }

    onEmployeeChange(EmployeeCode: string) {
        this.GetLeave(EmployeeCode);
    }
}