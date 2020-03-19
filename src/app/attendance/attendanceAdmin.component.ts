import { Component, Injectable, OnInit, Input, EventEmitter } from '@angular/core';
import { AttendanceService } from '../../services/attendanceService';
import { Status } from '../../model/Status';
import { StatusTime } from '../../model/StatusTime';
import { EmployeeStatus } from '../../model/EmployeeStatus';
import { Employee } from '../../model/Employee';
import { EmployeeStatusLabels } from '../../model/EmployeeStatusLabels';
import { EmployeeService } from '../../services/employeeService';

@Component({
    selector: 'AttendanceAdmin',
    templateUrl: './attendanceAdmin.component.template.html'
})


export class AttendanceAdminComponent implements OnInit {
    empObj: any;
    remarks: string = "";
    colon: string = ":";
    isChecked: boolean = false;
    StatusList = new Array<Status>();
    StatusTimeList = new Array<StatusTime>();
    EmployeeStatusList = new Array<EmployeeStatus>();
    EmployeeSelectedtStatusObj = new EmployeeStatus();
    EmployeeList = new Array<Employee>();
    EmployeeStatusLabelsModel = new EmployeeStatusLabels();
    currentTime: string = "";
    buttonText: string = "";
    currentDate: string = "";
    employeeName: string = "";
    employeeDesg: string = "";
    employeeImg: string = "";
    employeeId: string = "";
    StatusId: number = 0
    Status1: string = "";
    IsTimeAssociated: string = "";
    TimeValueInMinutes: number = 0;
    TimeDescription: string = "";
    selectedStatus: Status = { StatusId: -1, IsTimeAssociated: false, Status1: "Set a Status", StatusType: "", IsDisabled: true, StatusText: "" };
    selectedStatusTime: StatusTime = { TimeValueInMinutes: 0, TimeDescription: "Select a Duration", TransactionId: 0, IsDisabled: true };
    dropdownDisabled: boolean = true;
    btnDisabled: boolean = true;
    errMsg: string = "";
    statusErrorMsg: string = "";
    statusTimeString: string = "";
    statusTime: string = "";
    status: string = "";
    attendanceStatus: string = "";

    @Input('show-modal') showModal: boolean = false;
    @Input('show-modal') SaveShowModal: boolean = false;

    AttendanceClickEvent = new EventEmitter<boolean>();

    constructor(private _attendanceService: AttendanceService, private _employeeService: EmployeeService) {
        this.AttendanceClickEvent.emit(true);
        //debugger;
        setInterval(() => {
            //debugger;
            var currentDate = new Date();
            if (currentDate.getHours() == 7 && (currentDate.getMinutes() == 10 && currentDate.getSeconds() == 0)) {
                window.location.reload();
            }
            this.currentTime = currentDate.toLocaleTimeString();
            this.currentDate = currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        }, 1000);
    }
    ngOnInit() {
        //debugger;
        this.GetEmployees();
        this.GetStatuses();
        this.GetEmployeeStatus("");
    }

    GetEmployees() {
        this._employeeService.getEmployees(JSON.parse(localStorage.getItem('AuthToken') || ''))
            .subscribe(employeeResponse => {
                if (employeeResponse.IsSuccess)
                    // debugger;
                    this.EmployeeList = employeeResponse.EmployeeResult
                else {
                    this.errMsg = employeeResponse.Message;
                }
            }, ErrorResponse => this.errMsg = ErrorResponse);
    }

    GetStatuses() {

        this._attendanceService.GetStatuses(JSON.parse(localStorage.getItem('AuthToken') || '')).subscribe(attendanceResponse => {
            if (attendanceResponse.IsSuccess) {
                //debugger;
                this.StatusList = attendanceResponse.Statuses.StatusList;
                this.StatusTimeList = attendanceResponse.Statuses.StatusTimeList;
                this.StatusList.unshift(this.selectedStatus);
                this.StatusTimeList.unshift(this.selectedStatusTime);
            }
            else {
                this.errMsg = attendanceResponse.Message;
            }
        }, ErrorResponse => this.errMsg = ErrorResponse);
    }

    GetEmployeeStatus(employeeId: string) {
        //debugger;
        this._attendanceService.GetEmployeeStatus(employeeId, JSON.parse(localStorage.getItem('AuthToken') || '')).subscribe(attendanceResponse => {

            if (attendanceResponse.IsSuccess) {
                debugger;
                this.EmployeeStatusList = attendanceResponse.EmployeeResult;
                for (var i = 0; i < this.EmployeeStatusList.length; i++) {

                    if (this.EmployeeStatusList[i].AttendanceCheckInStatus != null && this.EmployeeStatusList[i].AttendanceCheckInStatus != "") {
                        this.EmployeeStatusList[i].AttendanceCheckInStatus = this.EmployeeStatusList[i].AttendanceCheckInStatus + new Date(this.EmployeeStatusList[i].CheckInTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
                    }
                    if (this.EmployeeStatusList[i].AttendanceCheckOutStatus != null && this.EmployeeStatusList[i].AttendanceCheckOutStatus != "") {
                        this.EmployeeStatusList[i].AttendanceCheckInStatus = this.EmployeeStatusList[i].AttendanceCheckInStatus + " <br> " + this.EmployeeStatusList[i].AttendanceCheckOutStatus + new Date(this.EmployeeStatusList[i].CheckOutTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
                    }
                    if (this.EmployeeStatusList[i].ImageUrl == null)
                        this.EmployeeStatusList[i].ImageUrl = "../../assets/Images/default-img.png";
                }
            }
            else {
                this.errMsg = attendanceResponse.Message;
            }
        }, ErrorResponse => this.errMsg = ErrorResponse);
    }

    ClearEmployeeStatus() {
        //debugger;
        let obj = {
            EmployeeId: this.employeeId,
            IsActive: false
        };
        this._attendanceService.SaveEmployeeStatus(obj, JSON.parse(localStorage.getItem('AuthToken') || '')).subscribe(attendanceResponse => {
            if (attendanceResponse.IsSuccess) {
                //debugger;
                this.showModal = false;
                this.empObj["Status"] = "";
                this.empObj["ShowStatus"] = false;

                if (this.empObj["AttendanceCheckOutStatus"] != null && this.empObj["AttendanceCheckOutStatus"] != "") {
                    this.empObj["IsAvaiable"] = false;
                } else if (this.empObj["AttendanceCheckInStatus"] != null && this.empObj["AttendanceCheckInStatus"] != "") {
                    this.empObj["IsAvaiable"] = true;
                }
            }
            else {
                this.errMsg = attendanceResponse.Message;
            }
        }, ErrorResponse => this.errMsg = ErrorResponse);
    }

    SaveEmployeeStatus() {
        debugger;
        if (this.selectedStatus.StatusId == -1 && this.selectedStatusTime.TransactionId == 0) {
            this.statusErrorMsg = "Please select status";
            this.showModal = true;
        }
        else if (this.selectedStatus.IsTimeAssociated == true && this.selectedStatusTime.TransactionId == 0) {
            this.statusErrorMsg = "Please select Duration";
            this.showModal = true;
        }
        else {
            debugger;
            if (this.selectedStatusTime.TransactionId == 0)
                this.statusTime = "";

            else
                this.statusTime = this.selectedStatusTime.TimeDescription;

            if (this.statusTime == "")
                this.status = this.selectedStatus.StatusText;
            else {
                debugger;
                var currentDate = new Date();
                currentDate.setMinutes(currentDate.getMinutes() + this.selectedStatusTime.TimeValueInMinutes);
                this.status = this.selectedStatus.StatusText + " " + currentDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
            }
            // debugger;
            let obj = {
                EmployeeId: this.employeeId,
                StatusDateTime: new Date().toUTCString(),
                Status: this.status,
                CreatedUTCDateTime: new Date().toUTCString(),
                LastUpdatedUTCDateTime: new Date().toUTCString(),
                StatusId: this.selectedStatus.StatusId,
                StatusTimeId: this.selectedStatusTime.TransactionId,
                IsActive: true,
            };

            //  debugger;
            this._attendanceService.SaveEmployeeStatus(obj, JSON.parse(localStorage.getItem('AuthToken') || '')).subscribe(attendanceResponse => {
                if (attendanceResponse.IsSuccess) {
                    //debugger;
                    this.empObj["Status"] = this.status;
                    this.empObj["ShowStatus"] = true;
                    this.empObj["IsAvaiable"] = false;
                    this.showModal = false;
                }
                else {
                    this.errMsg = attendanceResponse.Message;
                }
            }, ErrorResponse => this.errMsg = ErrorResponse);
        }
    }

    EmpPopUpInfo(Employee: any) {
        debugger;
        this.btnDisabled = true;
        this.empObj = Employee;
        if (this.empObj["Status"] != "" && this.empObj["Status"] != null) {
            //debugger;
            var currentDateTime = new Date().toUTCString();
            this.GetEmployeeSelectedStatus(Employee);
        }
        else {
            this.selectedStatus = this.StatusList[0];
            this.selectedStatusTime = this.StatusTimeList[0];
            this.dropdownDisabled = false;
            this.employeeId = Employee.EmployeeId,
                this.employeeName = Employee.Name;
            this.employeeDesg = Employee.Designation;
            this.employeeImg = Employee.ImageUrl;
            this.showModal = true;
        }
    }

    GetEmployeeSelectedStatus(Employee: any) {
        debugger;
        this._attendanceService.GetEmployeeSelectedStatus(Employee.EmployeeId, JSON.parse(localStorage.getItem('AuthToken') || ''))
            .subscribe(employeeResponse => {
                if (employeeResponse.IsSuccess) {
                    debugger;
                    this.EmployeeSelectedtStatusObj = employeeResponse.EmployeeResult;
                    for (var i = 0; i < this.StatusList.length; i++) {
                        if (this.StatusList[i].StatusId == this.EmployeeSelectedtStatusObj.StatusId) {
                            debugger;
                            this.selectedStatus = this.StatusList[i];

                            if (!this.selectedStatus.IsTimeAssociated) {
                                this.dropdownDisabled = false;
                                this.selectedStatusTime = this.StatusTimeList[0];
                            }
                            else {
                                this.dropdownDisabled = true;
                            }
                            break;
                        }
                    }
                    for (var i = 0; i < this.StatusTimeList.length; i++) {
                        if (this.StatusTimeList[i].TransactionId == this.EmployeeSelectedtStatusObj.StatusTimeId) {
                            // debugger;
                            this.selectedStatusTime = this.StatusTimeList[i];
                            break;
                        }
                    }
                    this.employeeId = Employee.EmployeeId,
                        this.employeeName = Employee.Name;
                    this.employeeDesg = Employee.Designation;
                    this.employeeImg = Employee.ImageUrl;
                    this.btnDisabled = false;
                    this.showModal = true;
                }
                else {
                    this.errMsg = employeeResponse.Message;
                }

            }, ErrorResponse => this.errMsg = ErrorResponse);
    }

    onChangeStatus() {
        debugger;
        this.statusErrorMsg = "";
        if (!this.selectedStatus.IsTimeAssociated) {
            this.dropdownDisabled = false;
            this.selectedStatusTime = this.StatusTimeList[0];
        }
        else {

            this.dropdownDisabled = true;
        }
    }

    ClosePopUp() {

        this.showModal = false;
    }

    CloseAttendancePopUp() {
        //debugger;
        this.SaveShowModal = false;

    }

    OpenAttendancePopUp(Employee: any) {
        // debugger;
        this.empObj = Employee;
        this.employeeId = Employee.EmployeeId,
            this.employeeName = Employee.Name;
        this.employeeDesg = Employee.Designation;
        this.employeeImg = Employee.ImageUrl;
        this.SaveShowModal = true;

    }

    onChangeStatusTime() {
        // debugger;
        this.statusErrorMsg = "";
    }

    SaveEmployeeAttendance(Employee: any) {
        debugger;
        if (this.empObj["BottonText"] == this.EmployeeStatusLabelsModel.textCheckIn) {//if checkin 
            this.isChecked = true;
            this.buttonText = this.EmployeeStatusLabelsModel.textCheckOut;//checkout
            this.attendanceStatus = this.EmployeeStatusLabelsModel.textCheckIn + ": " + new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
        }
        else { //if checkout
            this.isChecked = false;
            this.buttonText = this.EmployeeStatusLabelsModel.textCheckOut;//checkout
            this.empObj["AttendanceCheckOutStatus"] = this.EmployeeStatusLabelsModel.textCheckOut + ": " + new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
            this.empObj["AttendanceCheckInStatus"] = this.empObj["AttendanceCheckInStatus"].split("<br>")[0];
            this.attendanceStatus = this.empObj["AttendanceCheckInStatus"] + "<br>" + this.empObj["AttendanceCheckOutStatus"];
        }
        let obj = {
            Checked: this.isChecked,
            Date: new Date().toUTCString(),
            EmployeeId: this.empObj["EmployeeId"],
            Remarks: this.remarks,
            Status: this.status,
            AttendanceStatus: this.buttonText
        };

        this.SaveShowModal = false;
        this.empObj["ShowStatus"] = false;
        this.empObj["Status"] = "";

        this._attendanceService.SaveEmployeeAttendance(obj, JSON.parse(localStorage.getItem('AuthToken') || '')).subscribe(attendanceResponse => {
            if (attendanceResponse.IsSuccess) {
                debugger;
                this.empObj["BottonText"] = this.buttonText;
                this.empObj["AttendanceCheckInStatus"] = this.attendanceStatus;
                if (this.empObj["AttendanceCheckOutStatus"] != null && this.empObj["AttendanceCheckOutStatus"] != "") {
                    this.empObj["IsAvaiable"] = false;
                } else if (this.empObj["AttendanceCheckInStatus"] != null && this.empObj["AttendanceCheckInStatus"] != "") {
                    this.empObj["IsAvaiable"] = true;
                }
                this.attendanceStatus = "";
            }
            else {
                this.errMsg = attendanceResponse.Message;
            }
        }, ErrorResponse => this.errMsg = ErrorResponse);
    }
}
