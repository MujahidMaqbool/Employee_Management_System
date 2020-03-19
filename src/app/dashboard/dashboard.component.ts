import { Component, Injectable, Input, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrAlertService } from 'src/services/toastr.service';
import { Status } from '../../model/Status';
import { StatusTime } from '../../model/StatusTime';
import { WFHService } from '../../services/WFHService';
import { DashBoardSummary } from '../../model/DashBoardSummary';
import { DashBoardService } from '../../services/dashboardService';
import { AttendanceService } from '../../services/attendanceService';
import { EmployeeStatusLabels } from '../../model/EmployeeStatusLabels';
import { AttendanceCorrectionService } from '../../services/attendanceCorrectionService';
//import { } from '../dashboard/da'
//import { SharedService } from "../../services/SharedService";
import { EmployeeStatus } from '../../model/EmployeeStatus';
import { EmployeeAttendanceService } from "../../services/employeeAttendanceService";
import { EmployeeAttendance } from "../../model/EmployeeAttendance";
import { EmployeePermission } from "../../model/EmployeePermission";

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.template.html'
})


export class DashBoardComponent implements OnInit {
    SearchString: string = "";
    ShowMessage: boolean = false;
    Loader: boolean = false;
    DashBoardLoader: boolean = false;

    public Date: Date = new Date();
    errMsg: string = "";
    empObj: any;
    WFHReason: string = "";
    status: string = "";
    StatusId: number = 0;
    Status1: string = "";
    remarks: string = "";
    WFHDate: string = "";
    WFHTime: string = "";
    WFHHours: string = "";
    WFHMinuts: string = "";
    buttonText: string = "";
    employeeId: string = "";
    statusTime: string = "";
    currentTime: string = "";
    currentDate: string = "";
    WFHStartTime: Date = new Date();
    WFHTotalHour: string = "";
    TranscationId: number = 0;
    WFHAprrovedBy: string = "";
    isChecked: boolean = false;
    statusErrorMsg: string = "";
    TimeDescription: string = "";
    statusTimeString: string = "";
    attendanceStatus: string = "";
    IsTimeAssociated: string = "";
    daysLapsed: number = 0;
    requiredHours: number = 0;
    hoursinOffice: number = 0;
    validTime: boolean = false;
    TimeValueInMinutes: number = 0;
    StatusList = new Array<Status>();
    dropdownDisabled: boolean = true;
    StatusTimeList = new Array<StatusTime>();
    DashBoardSummary = new DashBoardSummary();
    EmployeeStatusLabelsModel = new EmployeeStatusLabels();

    EmployeeStatusModel = new Array<EmployeeStatus>();
    EmployeeStatusList = new Array<EmployeeStatus>();

    EmployeeAttendanceModel = new Array<EmployeeAttendance>();

    //for corection attance
    IsCheckedIn: boolean = true;
    AttendanceCorrectionCheckInTime = "";
    AttendanceCorrectionCheckOutTime = "";
    AttendanceTime = "";
    AttendanceCorrectionDate: string = "";
    CorrectionTime: Date = new Date();
    AttendanceCorrectionReason: string = "";
    @Input('show-modal') showAttendanceCorrectionModal: boolean = false;

    selectedStatusTime: StatusTime = { TimeValueInMinutes: 0, TimeDescription: "Choose Time Status", TransactionId: 0, IsDisabled: true };
    selectedStatus: Status = { StatusId: -1, IsTimeAssociated: false, Status1: "Choose Status", StatusType: "", IsDisabled: true, StatusText: "" };

    @Input('show-modal') showModal: boolean = false;
    @Input('show-modal') showWFHModal: boolean = false;
    @Input('show-modal') SaveShowModal: boolean = false;

    //open/close loader
    public sharedData: any;

    public employeePermission = new EmployeePermission();

    NotAllowAttendanceCorrection: boolean = false;

    constructor(private router: Router,
        private _dashboardService: DashBoardService,
        private _attendanceService: AttendanceService,
        private _wfhService: WFHService,
        private _attendanceCorrectionService: AttendanceCorrectionService,
        // private _sharedService: SharedService,
        private _toastrAlertService: ToastrAlertService,
        private _employeeAttendanceService: EmployeeAttendanceService
    ) {
        //debugger;
        setInterval(() => {
            //debugger;
            this.currentTime = new Date().toLocaleTimeString();
            this.currentDate = new Date().toLocaleDateString();
        }, 1000);
    }

    ngOnInit() {
        this.GetStatuses();
        this.GetDashBoardData();
    }

    GetDashBoardData() {
        this.DashBoardLoader = true;
        this._dashboardService.GetDashBoardSummary(JSON.parse(localStorage.getItem('AuthToken') || ''))
            .subscribe(dashBoardResponse => {
                if (dashBoardResponse.IsSuccess) {
                    this.DashBoardSummary = dashBoardResponse.result;
                    for (var i = 0; i < this.DashBoardSummary.EmployeesStatus.length; i++) {
                        if (this.DashBoardSummary.EmployeesStatus[i].Status != "" && this.DashBoardSummary.EmployeesStatus[i].Status != null) {
                            this.DashBoardSummary.EmployeesStatus[i].AttendanceCheckInStatus = this.DashBoardSummary.EmployeesStatus[i].Status;
                        }
                        if (this.DashBoardSummary.EmployeesStatus[i].AttendanceCheckInStatus != null && this.DashBoardSummary.EmployeesStatus[i].AttendanceCheckInStatus != "" && (this.DashBoardSummary.EmployeesStatus[i].Status == "" || this.DashBoardSummary.EmployeesStatus[i].Status == null)) {
                            this.DashBoardSummary.EmployeesStatus[i].AttendanceCheckInStatus = this.DashBoardSummary.EmployeesStatus[i].AttendanceCheckInStatus + new Date(this.DashBoardSummary.EmployeesStatus[i].CheckInTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
                        }
                        if (this.DashBoardSummary.EmployeesStatus[i].AttendanceCheckOutStatus != null && this.DashBoardSummary.EmployeesStatus[i].AttendanceCheckOutStatus != "") {
                            this.DashBoardSummary.EmployeesStatus[i].AttendanceCheckInStatus = this.DashBoardSummary.EmployeesStatus[i].AttendanceCheckInStatus + " <br> " + this.DashBoardSummary.EmployeesStatus[i].AttendanceCheckOutStatus + new Date(this.DashBoardSummary.EmployeesStatus[i].CheckOutTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
                        }
                        if (this.DashBoardSummary.EmployeesStatus[i].ImageUrl == null)
                            this.DashBoardSummary.EmployeesStatus[i].ImageUrl = "../../assets/Images/default-img.png";
                  }

                    this.EmployeeStatusList = this.DashBoardSummary.EmployeesStatus;
                    this.EmployeeStatusModel = this.DashBoardSummary.EmployeesStatus;
                    debugger
                    for (var i = 0; i < this.DashBoardSummary.EmployeeAttendance.length; i++) {
                        //if (this.DashBoardSummary.EmployeeAttendance[i].ActualHour != null) {
                        //    var val = this.DashBoardSummary.EmployeeAttendance[i].ActualHour.split(':');
                        //    var a = Number(val[0]) - 1;
                        //    var b = a + ":" + val[1];
                        //    this.DashBoardSummary.EmployeeAttendance[i].ActualHour = b.toString();
                        //}
                    }

                    this.daysLapsed = this.DashBoardSummary.DaysLapsed;
                    this.requiredHours = this.DashBoardSummary.RequiredHours;
                    this.hoursinOffice = this.DashBoardSummary.HoursinOffice;
                    this.DashBoardLoader = false;
                } else {
                    this.DashBoardLoader = false;
                }
            }, ErrorResponse => this.errMsg = ErrorResponse);
    }

    GetStatuses() {
        this._attendanceService.GetStatuses(JSON.parse(localStorage.getItem('AuthToken') || '')).subscribe(attendanceResponse => {
            if (attendanceResponse.IsSuccess) {
                this.StatusList = attendanceResponse.Statuses.StatusList;
                this.StatusTimeList = attendanceResponse.Statuses.StatusTimeList;

                this.StatusList.unshift(this.selectedStatus);
                this.StatusTimeList.unshift(this.selectedStatusTime);
            }
        }, ErrorResponse => this.errMsg = ErrorResponse);
    }

    SearchEmployee() {
        debugger
        if (this.SearchString == '') {
            this.EmployeeStatusModel = this.EmployeeStatusList;
        }

        this.EmployeeStatusModel = Object.assign(this.EmployeeStatusList, this.EmployeeStatusList).filter(EmployeeStatusList =>
            EmployeeStatusList.Name.toLowerCase().indexOf(this.SearchString.toLowerCase()) > -1
        )
    }

    SaveEmployeeStatus() {
        if (this.selectedStatus.Status1 == "Choose Status" && this.selectedStatusTime.TimeDescription == "Choose Time Status") {
            this.statusErrorMsg = "Please select status";
            this.showModal = true;
        }
        else if (this.selectedStatus.IsTimeAssociated == true && this.selectedStatusTime.TimeDescription == "Choose Time Status") {
            this.statusErrorMsg = "Please select status time";
            this.showModal = true;
        }
        else {
            if (this.selectedStatusTime.TimeDescription == "Choose Time Status")
                this.statusTime = "";
            else
                this.statusTime = this.selectedStatusTime.TimeDescription;

            if (this.statusTime == "")
                this.status = this.selectedStatus.Status1;
            else {
                var currentDate = new Date();
                currentDate.setMinutes(currentDate.getMinutes() + this.selectedStatusTime.TimeValueInMinutes);
                this.status = this.selectedStatus.Status1 + " for " + this.statusTime + " and will reach office by " + currentDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
            }

            let obj = {
                EmployeeId: this.employeeId,
                StatusDateTime: new Date().toUTCString(),
                Status: this.status,
                CreatedUTCDateTime: new Date().toUTCString(),
                LastUpdatedUTCDateTime: new Date().toUTCString(),
                StatusId: this.selectedStatus.StatusId,
                StatusTimeId: this.selectedStatusTime.TransactionId,
                IsActive: true
            };

            this._attendanceService.SaveEmployeeStatus(obj, JSON.parse(localStorage.getItem('AuthToken') || '')).subscribe(attendanceResponse => {
                if (attendanceResponse.IsSuccess) {
                    this.empObj["AttendanceCheckInStatus"] = this.status;

                    //this.selectedStatus = this.StatusList[0];
                    //this.selectedStatusTime = this.StatusTimeList[0];
                    //this.dropdownDisabled = true;

                    this.showModal = false;
                }
            }, ErrorResponse => this.errMsg = ErrorResponse);
        }
    }

    OpenWFHPopUp() {
        this.showWFHModal = true;
    }

    CloseWFHPopUp() {
        this.WFHDate = "";
        this.WFHReason = "";
        this.WFHTime = "";
        this.showWFHModal = false;
    }

    EmpPopUpInfo(Employee: any) {
        debugger;
        this.empObj = Employee;
        this.employeeId = Employee.EmployeeId,
            this.showModal = true;
    }

    onChangeStatus() {
        this.statusErrorMsg = "";
        if (!this.selectedStatus.IsTimeAssociated) {
            this.dropdownDisabled = true;
            this.selectedStatusTime = this.StatusTimeList[0];
        }
        else {
            this.dropdownDisabled = false;
        }
    }

    ClosePopUp() {
        this.selectedStatus = this.StatusList[0];
        this.selectedStatusTime = this.StatusTimeList[0];
        this.dropdownDisabled = true;
        this.showModal = false;

    }

    CloseAttendancePopUp() {
        this.SaveShowModal = false;
    }

    OpenAttendancePopUp(Employee: any) {
        this.empObj = Employee;
        this.employeeId = Employee.EmployeeId,
            this.SaveShowModal = true;

    }

    onChangeStatusTime() {
        this.statusErrorMsg = "";
    }

    isValid(event: boolean): void {
        this.validTime = event;
    }

    SaveEmployeeAttendance(Employee: any) {
        if (this.empObj["BottonText"] == this.EmployeeStatusLabelsModel.textCheckIn) {//if checkin 
            this.isChecked = true;
            this.buttonText = this.EmployeeStatusLabelsModel.textCheckOut;//checkout
            this.attendanceStatus = this.EmployeeStatusLabelsModel.textCheckIn + ": " + new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
            //for (var i = 0; i < this.StatusList.length; i++) {
            //    if (this.StatusList[i].StatusType == this.EmployeeStatusLabelsModel.textCheckIn.replace(/ +/g, "")) {
            //        this.status = this.StatusList[i].Status1;// Available
            //        break;
            //    }
            //}
        }
        else { //if checkout
            this.isChecked = false;
            this.buttonText = this.EmployeeStatusLabelsModel.textCheckOut;//checkout
            this.empObj["AttendanceCheckInStatus"] = this.empObj["AttendanceCheckInStatus"].split("<br>")[0];
            this.attendanceStatus = this.empObj["AttendanceCheckInStatus"] + "<br>" + this.EmployeeStatusLabelsModel.textCheckOut + ": " + new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
            //for (var i = 0; i < this.StatusList.length; i++) {
            //    if (this.StatusList[i].StatusType == this.EmployeeStatusLabelsModel.textCheckOut.replace(/ +/g, "")) {
            //        this.status = this.StatusList[i].Status1;// Not Available
            //        break;
            //    }
            //}
        }
        let obj = {
            Checked: this.isChecked,
            Date: new Date().toUTCString(),
            EmployeeId: this.empObj["EmployeeId"],
            Remarks: this.remarks,
            Status: this.status,
            AttendanceStatus: this.buttonText
        };
        this._attendanceService.SaveEmployeeAttendance(obj, JSON.parse(localStorage.getItem('AuthToken') || '')).subscribe(attendanceResponse => {
            if (attendanceResponse.IsSuccess) {
                //debugger;
                this.empObj["BottonText"] = this.buttonText;
                this.empObj["AttendanceCheckInStatus"] = this.attendanceStatus;
                this.empObj["Status"] = this.status;
                this.attendanceStatus = "";
                this.SaveShowModal = false;
            }
        }, ErrorResponse => this.errMsg = ErrorResponse);
    }

    onHourChange(Hour: string) {
        this.WFHHours = Hour;
    }

    onTimeChange(Time: string) {
        this.WFHTime = Time;
    }

    SaveWFHRequest() {
        this.Date = new Date(this.WFHDate);
        this.WFHTotalHour = this.WFHHours + ":" + this.WFHTime;

        if (this.WFHDate === "") {
            this._toastrAlertService.Alert_Error('Please add Date');
        }
        else if (this.WFHReason === "") {
            this._toastrAlertService.Alert_Error('Please add Reason');
        }
        else if (this.WFHHours === "") {
            this._toastrAlertService.Alert_Error('Please add Hour');
        }
        else if (this.WFHTime === "") {
            this._toastrAlertService.Alert_Error('Please add Minute');
        } else {
            this.Loader = false;
            this._wfhService.SaveWFHRequest(0, "", this.Date.toUTCString(), new Date(this.WFHStartTime).toUTCString(), this.WFHTotalHour, "Pending", this.WFHReason, "", "", JSON.parse(localStorage.getItem('AuthToken') || ''))
                .subscribe(wfhResponse => {
                    if (wfhResponse.IsSuccess) {
                        this.WFHReason = "";
                        this.WFHDate = "";
                        this.WFHTotalHour = "";
                        this.showWFHModal = false;
                        //this.GetDashBoardData();
                        this.Loader = false;
                        if (wfhResponse.Message == "1") {
                            this._toastrAlertService.Alert_Success("Request sent successfully");
                        } else {
                            this._toastrAlertService.Alert_warning("You have already applied WFH for this date");
                        }
                    }
                    else {
                        this.Loader = false;
                        this.errMsg = wfhResponse.Message;
                        this._toastrAlertService.Alert_Error(this.errMsg);
                    }

                }, ErrorResponse => this.errMsg = ErrorResponse);
        }
    }

    AttendanceCorrectionPopUp() {
        this.AttendanceCorrectionDate = "";
        this.AttendanceCorrectionReason = "";
        this.AttendanceCorrectionCheckInTime = "";
        this.AttendanceCorrectionCheckOutTime = "";
        this.AttendanceTime = "";
        this.CorrectionTime = new Date();
        this.showAttendanceCorrectionModal = true;
    }

    onDateChange() {

        if (new Date(this.AttendanceCorrectionDate) > new Date()) {

            this._toastrAlertService.Alert_Error("Date cannot be greater than today.");
            return;
        }
        else {
            this.GetAttendanceByDate();
        }

    }

    GetAttendanceByDate() {

        this._employeeAttendanceService.GetEmployeeAttendance(new Date(this.AttendanceCorrectionDate), new Date(this.AttendanceCorrectionDate), JSON.parse(localStorage.getItem('EmployeeCode') || ''), JSON.parse(localStorage.getItem('AuthToken') || ''))
            .subscribe(attendanceResponse => {
                if (attendanceResponse.IsSuccess) {
                    this.EmployeeAttendanceModel = attendanceResponse.AttendanceResult;
                    if (this.EmployeeAttendanceModel.length > 0) {
                        this.AttendanceCorrectionCheckInTime = this.EmployeeAttendanceModel[0].ActualTimeIn;
                        this.AttendanceCorrectionCheckOutTime = this.EmployeeAttendanceModel[0].ActualTimeOut;

                        if (this.IsCheckedIn == true) {
                            this.AttendanceTime = this.AttendanceCorrectionCheckInTime;
                        }
                        else { this.AttendanceTime = this.AttendanceCorrectionCheckOutTime; }

                        if (this.EmployeeAttendanceModel[0].ActualTimeIn == '' && this.EmployeeAttendanceModel[0].ActualTimeOut == '') { this.NotAllowAttendanceCorrection = true; } else { this.NotAllowAttendanceCorrection = false; }
                    }
                    //else {
                    //    this.NotAllowAttendanceCorrection = true;
                    //}
                }
            }, ErrorResponse => this.errMsg = ErrorResponse);
    }

    onStatusChange(status: string) {
        if (status == "true") {
            this.IsCheckedIn = true;
            this.AttendanceTime = this.AttendanceCorrectionCheckInTime;
        } else {
            this.IsCheckedIn = false;
            this.AttendanceTime = this.AttendanceCorrectionCheckOutTime;
        }
    }

    SaveAttendanceCorrectionRequest() {
        //if (this.NotAllowAttendanceCorrection) {
        //    this._toastrAlertService.Alert_Error("you cannot apply attendance correction for this date");
        //}
        //else if (this.AttendanceCorrectionDate === "") {
        if (this.AttendanceCorrectionDate === "") {
            this._toastrAlertService.Alert_Error('Please add Date');
            return
        }
        else if (this.AttendanceCorrectionReason === "") {
            this._toastrAlertService.Alert_Error('Please add Reason');
            return
        } else {
            this.showAttendanceCorrectionModal = false;
            this.Loader = true;
            this._attendanceCorrectionService.SaveAttendanceRequest(0, "", new Date(this.AttendanceCorrectionDate).toUTCString(), new Date(this.CorrectionTime).toUTCString(), this.AttendanceCorrectionReason, this.IsCheckedIn, "", "", "Pending", JSON.parse(localStorage.getItem('AuthToken') || ''))
                .subscribe(AttendanceCorrectionResponse => {
                    if (AttendanceCorrectionResponse.IsSuccess) {
                        this.Loader = false;
                        if (AttendanceCorrectionResponse.Message == "1") {
                            this._toastrAlertService.Alert_Success("Request sent successfully");
                        } else {
                            this._toastrAlertService.Alert_warning("You have already applied Attendance Correction for this date");
                        }
                    }
                    else {
                        this.Loader = false;
                        this.errMsg = AttendanceCorrectionResponse.Message;
                        this._toastrAlertService.Alert_Error(this.errMsg);
                    }

                }, ErrorResponse => this.errMsg = ErrorResponse);
        }
    }

    CloseAttendanceCorrectionPopup() {
        this.showAttendanceCorrectionModal = false;
    }


    GoToLeavs() {
        this.router.navigate(['/Leaves']);
    }

    GoToApplicationStatus(Id: string) {
        this.employeePermission = JSON.parse(localStorage.getItem("EmployeePermission") || '{}');
        //if (this.employeePermission.ShowLeavesApproval) {
        //    this.router.navigate(['/AppliedLeaves'], { queryParams: { LeaveId: Id } });
        //} else {
        this.router.navigate(['/AppliedLeavesStatus'], { queryParams: { LeaveId: Id } });
        //}
    }

    GoToAttendance() {
        this.router.navigate(['/attendance']);
    }
}

