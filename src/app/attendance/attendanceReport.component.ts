import { Component, Injectable, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/employeeService';
import { Employee } from '../../model/Employee';
import { EmployeeReport } from '../../model/EmployeeReport';
import { AttendanceService } from '../../services/attendanceService';
import { DOCUMENT } from '@angular/platform-browser';
import { ToastrAlertService } from 'src/services/toastr.service';
import { ExportToExcelService } from 'src/services/export-to-excel.service';

//declare function GetReport(employeeList): any;
import * as $ from 'jquery';

@Component({
    selector: 'Report',
    templateUrl: './attendanceReport.component.template.html'
})


export class AttendanceReportComponent implements OnInit {
    Loader: boolean = false;
    errMsg: string = "";
    Employees = new Array<Employee>();
    EmployeeReportList = new Array<EmployeeReport>();
    employeeExist: boolean = false;
    selectedEmployeeList = new Array();
    selectedEmployee: any;
    ToDate: Date = new Date();
    public FromDate: Date = new Date(this.ToDate.getFullYear(), this.ToDate.getMonth(), 1);
    //listOrder: string = "Date";

    constructor(private _employeeService: EmployeeService,
        private _attendanceService: AttendanceService,
        private _toastrAlertService: ToastrAlertService,
        private _excelService: ExportToExcelService
    ) {
    }

    ngOnInit() {
        this.GetEmployees();

        //let s = this._renderer2.createElement('script');
        //s.type = `text/javascript`;
        //s.src = '/content/script/employeeRegistration.js';

        //this._renderer2.appendChild(this._document.body, s);
    }


    //MonthName(dt) {
    //    var mlist = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    //    return mlist[dt.getMonth()];
    //}

    exportAsXLSX(): void {

        let Exceldata = this.EmployeeReportList.map(data =>

            ({
                Date: new Date(data.Date).getDate() + '-' + (new Date(data.Date).getMonth() + 1) + '-' + new Date(data.Date).getFullYear(),
                Code: data.EmployeeCode,
                Name: data.EmployeeName,
                Designation: data.EmployeeDesignation,
                CheckIn: data.ActualTimeIn,
                CheckOut: data.ActualTimeOut,
                RequiredHours: data.RequiredHours,
                HoursInOffice: data.ActualHour,
                Remarks: data.Remarks
            })
        );

        this._excelService.exportAsExcelFile(Exceldata, 'AttendenceReport');
    }

    // exportCSV() {
    //     $('#AttendanceTable').tableExport({ type: 'csv', tableName: 'Attendance Report', escape: 'false', fileName: 'Attendance Report' });
    // }

    GenerateReport() {

        //GetReport(this.EmployeeReportList);
    }

    GetEmployees() {
        this.Loader = true;
        this._employeeService.getEmployees(JSON.parse(localStorage.getItem('AuthToken') || ''))
            .subscribe(employeeResponse => {
                if (employeeResponse.IsSuccess) {
                    this.Employees = employeeResponse.EmployeeResult;
                    this.GetAttendanceReport();
                }
                else {
                    this.GetAttendanceReport();
                }
            }, ErrorResponse => this.errMsg = ErrorResponse);
    }

    SelectedEmployee() {

        var uu = this.selectedEmployee;
        this.employeeExist = false;
        if (this.selectedEmployeeList.length > 0) {
            for (let i = 0; i < this.selectedEmployeeList.length; i++) {
                if (this.selectedEmployee["EmployeeId"] == this.selectedEmployeeList[i]["EmployeeId"]) {
                    this._toastrAlertService.Alert_Error("Employee already exist");
                    this.employeeExist = true;
                    break;
                }
            }
        }
        if (!this.employeeExist) {
            if (this.selectedEmployee != "")
                this.selectedEmployeeList.push(this.selectedEmployee);
        }
    }

    RemoveEmployee(employee: any) {

        this.selectedEmployeeList.splice(this.selectedEmployeeList.indexOf(employee), 1);
    }

    onEndDateChange() {
        if (new Date(this.FromDate) > new Date(this.ToDate)) {

            this._toastrAlertService.Alert_Error("To date should be greater than From date");
        }
    }

    Search() {
        if (new Date(this.FromDate) > new Date(this.ToDate)) {

            this._toastrAlertService.Alert_Error("To date should be greater than From date");
        } else {
            this.GetAttendanceReport();
        }
    }

    GetAttendanceReport() {
        this.Loader = true;

        var employees = [];
        var employeeReport = new EmployeeReport();
        if (this.Employees.length == 1) {
            employees.push(this.Employees[0].EmployeeId);
        }
        else {
            for (let i = 0; i < this.selectedEmployeeList.length; i++) {
                var EmployeeId = this.selectedEmployeeList[i]["EmployeeId"];
                employees.push(EmployeeId);
            }
        }
        employeeReport.EmployeeIDs = employees;
        employeeReport.FromDate = this.FromDate;
        employeeReport.ToDate = this.ToDate;
        this._attendanceService.GetEmployeeAttendanceReport(employeeReport, JSON.parse(localStorage.getItem('AuthToken') || '')).subscribe(employeeAttendanceReportResponse => {
            if (employeeAttendanceReportResponse.IsSuccess) {
                this.EmployeeReportList = new Array<EmployeeReport>();
                var result = employeeAttendanceReportResponse.EmployeeAttendanceReportResult;
                for (let i = 0; i < result.length; i++) {
                    var _result = result[i];
                    for (let j = 0; j < result[i].length; j++) {
                        this.EmployeeReportList.push(_result[j]);
                    }
                }
                this.Loader = false;

            }
            else {
                this.Loader = false;
                this.errMsg = employeeAttendanceReportResponse.Message;
                this._toastrAlertService.Alert_Error(employeeAttendanceReportResponse.Message);
            }
        }, ErrorResponse => this.errMsg = ErrorResponse);

    }


}
