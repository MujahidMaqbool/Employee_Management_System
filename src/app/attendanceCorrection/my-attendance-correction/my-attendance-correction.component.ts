import { Component, Injectable, OnInit, Input } from '@angular/core';
import { AttendanceCorrectionService } from '../../../services/attendanceCorrectionService';
import { Employee } from '../../../model/Employee';
import { EmployeeService } from '../../../services/employeeService';
import { AttendanceCorrectionSummary } from '../../../model/AttendanceCorrectionSummary';

import { EmployeeAttendance } from "../../../model/EmployeeAttendance";
import { EmployeeAttendanceService } from "../../../services/employeeAttendanceService";
import { ToastrAlertService } from 'src/services/toastr.service';


@Component({
  selector: 'app-my-attendance-correction',
  templateUrl: './my-attendance-correction.component.html',
  styleUrls: ['./my-attendance-correction.component.css']
})
export class MyAttendanceCorrectionComponent implements OnInit {

  Loader: boolean = true;
  public ToDate: Date = new Date();
  public FromDate: Date = new Date(this.ToDate.getFullYear(), this.ToDate.getMonth(), 1);
  errMsg: string = "";
  status: string = "";
  AttendanceCorrectionSummary = new Array<AttendanceCorrectionSummary>();
  ObjAttendanceCorrectionSummary = new AttendanceCorrectionSummary();
  @Input('show-modal') AttendanceCorrectionStatusModal: boolean = false;
  @Input('show-modal') showAttendanceCorrectionModal: boolean = false;

  IsCheckedIn: boolean = true;
  CorrectionTime: Date = new Date();
  AttendanceCorrectionReason: string = "";
  AttendanceCorrectionDate: string = "";
  AttendanceCorrectionCheckInTime = "";
  AttendanceCorrectionCheckOutTime = "";
  AttendanceTime = "";
  validTime: boolean = false;

  EmployeeAttendanceModel = new Array<EmployeeAttendance>();

  NotAllowAttendanceCorrection: boolean = false;

  constructor(private _attendanceCorrectionService: AttendanceCorrectionService,
    private _employeeService: EmployeeService,
    private _toastrAlertService: ToastrAlertService,
    private _employeeAttendanceService: EmployeeAttendanceService) {
  }
  ngOnInit() {
    this.Loader = true;
    this.GetAttendanceCorrectionSummary("", this.FromDate, this.ToDate);
  }

  GetAttendanceCorrectionSummary(status: string, FromDate: Date, ToDate: Date) {
    debugger
    this.Loader = true;
    this._attendanceCorrectionService.GetAll(status, FromDate, ToDate, JSON.parse(localStorage.getItem('EmployeeCode') || ''), JSON.parse(localStorage.getItem('AuthToken') || ''))
      .subscribe(AttendanceCorrectionResponse => {
        if (AttendanceCorrectionResponse.IsSuccess) {
          this.AttendanceCorrectionSummary = AttendanceCorrectionResponse.result;

          for (var i = 0; i < this.AttendanceCorrectionSummary.length; i++) {

            this.AttendanceCorrectionSummary[i].Date = new Date(this.AttendanceCorrectionSummary[i].Date).toLocaleDateString();
            this.AttendanceCorrectionSummary[i].CorrectionTime = new Date(this.AttendanceCorrectionSummary[i].CorrectionTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

          }
          this.Loader = false;
        }
        else {
          this.Loader = false;
        }
      }, ErrorResponse => this.errMsg = ErrorResponse);
  }

  //onEndDateChange() {

  //    if (new Date(this.FromDate) > new Date(this.ToDate)) {

  //        this._toastrAlertService.Alert_Error("To date should be greater than from date");
  //    }
  //}

  onStatusChange(status: string) {
    this.status = status;
  }

  Search() {
    if (new Date(this.FromDate) > new Date(this.ToDate)) {
      this._toastrAlertService.Alert_Error("To date should be greater than from date");
    } else {
      this.GetAttendanceCorrectionSummary(this.status, this.FromDate, this.ToDate);
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
          debugger;
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

  onStatusChangeInOut(status: string) {
    if (status == "true") {
      this.IsCheckedIn = true;
      this.AttendanceTime = this.AttendanceCorrectionCheckInTime;
    } else {
      this.IsCheckedIn = false;
      this.AttendanceTime = this.AttendanceCorrectionCheckOutTime;
    }
  }

  isValid(event: boolean): void {
    this.validTime = event;
  }

  SaveAttendanceCorrectionRequest() {

    //if (this.NotAllowAttendanceCorrection) {
    //    this._toastrAlertService.Alert_Error("you cannot apply attendance for this date");
    //}
    //else if (this.AttendanceCorrectionDate === "") {
    if (this.AttendanceCorrectionDate === "") {
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
            if (AttendanceCorrectionResponse.Message == "1") {
              this._toastrAlertService.Alert_Success("Request sent successfully.");
            } else {
              this._toastrAlertService.Alert_Info("You have already applied for this date.");
            }
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

  AttendanceCorrectionStatusPopUp(ObjAttendanceCorrectionData: any) {
    this.ObjAttendanceCorrectionSummary = ObjAttendanceCorrectionData;
    // this.ObjAttendanceCorrectionSummary = this.ObjAttendanceCorrectionSummary[0].EmployeeImage.replace("content/i", "assets/I");
    this.AttendanceCorrectionStatusModal = true;
  }

  CloseStatusPopup() {
    this.AttendanceCorrectionStatusModal = false;
  }



}
