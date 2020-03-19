import { Component, Injectable, OnInit, Input } from '@angular/core';
import { EmployeeAttendanceService } from '../../../services/employeeAttendanceService';
import { EmployeeService } from '../../../services/employeeService';
import { EmployeeAttendance } from '../../../model/EmployeeAttendance';
import { Employee } from '../../../model/Employee';
import { AttendanceCorrectionService } from '../../../services/attendanceCorrectionService';
import { ToastrAlertService } from 'src/services/toastr.service';

@Component({
  selector: 'app-employee-attendance',
  templateUrl: './employee-attendance.component.html',
  styleUrls: ['./employee-attendance.component.css']
})
export class EmployeeAttendanceComponent implements OnInit {

  public ToDate: Date = new Date();
  public FromDate: Date = new Date(this.ToDate.getFullYear(), this.ToDate.getMonth(), 1);
  EmployeeCode: string = "";
  IsCheckedIn: boolean = true;
  CorrectionTime: Date = new Date();
  AttendanceCorrectionReason: string = "";
  AttendanceCorrectionDate: string = "";

  EmployeeAttendanceList = new Array<EmployeeAttendance>();
  EmployeeList = new Array<Employee>();

  public errMsg: string = "";
  @Input('show-modal') showAttendanceCorrectionModal: boolean = false;

  Loader: boolean = false;

  AttendanceCorrectionCheckInTime = "";
  AttendanceCorrectionCheckOutTime = "";
  AttendanceTime = "";

  EmployeeAttendanceModel = new Array<EmployeeAttendance>();

  NotAllowAttendanceCorrection: boolean = false;

  constructor(private _employeeAttendanceService: EmployeeAttendanceService,
    private _employeeService: EmployeeService,
    private _attendanceCorrectionService: AttendanceCorrectionService,
    private _toastrAlertService: ToastrAlertService
  ) { }
  ngOnInit() {
    this.Loader = true;
    this.getEmployees();
  }

  getEmployees() {
    debugger
    this._employeeService.getEmployees(JSON.parse(localStorage.getItem('AuthToken') || ''))
      .subscribe(employeeResponse => {
        if (employeeResponse.IsSuccess) {
          debugger
          this.EmployeeList = employeeResponse.EmployeeResult;
        }
        if (this.EmployeeList.length == 1) {
          this.EmployeeCode = this.EmployeeList[0].EmployeeCode;
          this.GetAttendence();
        } else { this.GetAttendence(); }
      }, ErrorResponse => this.errMsg = ErrorResponse);
  }

  onEmployeeChange(employeeCode: string) {
    this.EmployeeCode = employeeCode;
    // this.GetAttendence();
  }

  //onEndDateChange() {

  //    if (new Date(this.FromDate) > new Date(this.ToDate)) {

  //        this._toastrAlertService.Alert_Error("To date should be greater than from date");
  //    }

  //}

  //onDateChange()
  //{
  //    debugger;
  //    this.GetAttendence();
  //}

  Search() {
    if (new Date(this.FromDate) > new Date(this.ToDate)) {
      this._toastrAlertService.Alert_Error("To date should be greater than From date");
    } else {
      this.GetAttendence();
    }
  }

  GetAttendence() {
    this.Loader = true;
    this._employeeAttendanceService.GetEmployeeAttendance(this.FromDate, this.ToDate, this.EmployeeCode, JSON.parse(localStorage.getItem('AuthToken') || ''))
      .subscribe(attendanceResponse => {
        if (attendanceResponse.IsSuccess)

          this.EmployeeAttendanceList = attendanceResponse.AttendanceResult;
        //for (var i = 0; i < this.EmployeeAttendanceList.length; i++) {
        //    if (this.EmployeeAttendanceList[i].ActualHour != null) {
        //        var val = this.EmployeeAttendanceList[i].ActualHour.split(':');
        //        if (Number(val[0]) > 2) {
        //            var a = Number(val[0]) - 1;
        //            var b = a + ":" + val[1];
        //            this.EmployeeAttendanceList[i].ActualHour = b.toString();
        //        }
        //    }
        //}
        this.Loader = false;
      }, ErrorResponse => this.errMsg = ErrorResponse);
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
    debugger
    if (new Date(this.AttendanceCorrectionDate) > new Date()) {

      this._toastrAlertService.Alert_Error("Date cannot be greater than today.");
    }
    else {
      this.GetAttendanceByDate();
    }

  }

  GetAttendanceByDate() {
    debugger;
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
          else {
            this.NotAllowAttendanceCorrection = true;
          }
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

    if (this.NotAllowAttendanceCorrection) {
      this._toastrAlertService.Alert_Error("you cannot apply attendance updation for this date");
    }
    else if (this.AttendanceCorrectionDate === "") {
      this._toastrAlertService.Alert_Error('Please add Date');
    }
    else if (this.AttendanceCorrectionReason === "") {
      this._toastrAlertService.Alert_Error('Please add Reason');
    } else {
      this.showAttendanceCorrectionModal = false;
      this.Loader = true;
      this._attendanceCorrectionService.SaveAttendanceRequest(0, "", new Date(this.AttendanceCorrectionDate).toUTCString(), new Date(this.CorrectionTime).toUTCString(), this.AttendanceCorrectionReason, this.IsCheckedIn, "", "", "Pending", JSON.parse(localStorage.getItem('AuthToken') || ''))
        .subscribe(AttendanceCorrectionResponse => {
          if (AttendanceCorrectionResponse.IsSuccess) {
            this.Loader = false;
            this._toastrAlertService.Alert_Success("Request sent successfuly");
            //this.GetAttendence();
          }
          else {
            this.errMsg = AttendanceCorrectionResponse.Message;
            this.Loader = false;
            this._toastrAlertService.Alert_Error(this.errMsg);
          }

        }, ErrorResponse => this.errMsg = ErrorResponse);
    }
  }

  CloseAttendanceCorrectionPopup() {
    this.showAttendanceCorrectionModal = false;
  }



}
