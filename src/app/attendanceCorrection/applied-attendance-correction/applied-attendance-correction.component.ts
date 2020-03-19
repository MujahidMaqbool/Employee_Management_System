import { Component, Injectable, OnInit, Input } from '@angular/core';
import { AttendanceCorrectionService } from '../../../services/attendanceCorrectionService';
import { Employee } from '../../../model/Employee';
import { EmployeeService } from '../../../services/employeeService';
import { AttendanceCorrectionSummary } from '../../../model/AttendanceCorrectionSummary';
import { ToastrAlertService } from 'src/services/toastr.service';

@Component({
  selector: 'app-applied-attendance-correction',
  templateUrl: './applied-attendance-correction.component.html',
  styleUrls: ['./applied-attendance-correction.component.css']
})
export class AppliedAttendanceCorrectionComponent implements OnInit {

  Loader: boolean = true;
  public ToDate: Date = new Date();
  public FromDate: Date = new Date(this.ToDate.getFullYear(), this.ToDate.getMonth(), 1);
  errMsg: string = "";
  status: string = "";
  EmployeeCode: string = "";
  ChangeCorrectionTime: Date = new Date();
  employeeCode: string = "";
  ManagerNote: string = "";
  validTime: boolean = false;
  AttendanceCorrectionStatus: string = "";
  AttendanceCorrectionManagerReason: string = "";
  EmployeeList = new Array<Employee>();
  AttendanceCorrectionSummary = new Array<AttendanceCorrectionSummary>();
  ObjAttendanceCorrectionSummary = new AttendanceCorrectionSummary();
  @Input('show-modal') AttendanceCorrectionModal: boolean = false;

  constructor(private _attendanceCorrectionService: AttendanceCorrectionService,
    private _employeeService: EmployeeService,
    private _toastrAlertService: ToastrAlertService
  ) {
  }
  ngOnInit() {
    this.Loader = true;
    this.GetEmployees();
    this.GetAttendanceCorrectionSummary("", this.FromDate, this.ToDate, "");
  }

  isValid(event: boolean): void {
    this.validTime = event;
  }

  GetAttendanceCorrectionSummary(status: string, FromDate: Date, ToDate: Date, EmployeeCode: string) {
    this.Loader = true;
    this._attendanceCorrectionService.GetAll(status, FromDate, ToDate, EmployeeCode, JSON.parse(localStorage.getItem('AuthToken') || ''))
      .subscribe(AttendanceCorrectionResponse => {
        if (AttendanceCorrectionResponse.IsSuccess) {
          this.AttendanceCorrectionSummary = AttendanceCorrectionResponse.result;

          for (var i = 0; i < this.AttendanceCorrectionSummary.length; i++) {

            this.AttendanceCorrectionSummary[i].Date = new Date(this.AttendanceCorrectionSummary[i].Date).toLocaleDateString();
            this.AttendanceCorrectionSummary[i].CorrectionTime = new Date(this.AttendanceCorrectionSummary[i].CorrectionTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

          }

          this.AttendanceCorrectionSummary = this.AttendanceCorrectionSummary.filter(i => i.EmployeeCode != JSON.parse(localStorage.getItem('EmployeeCode') || ''));
          this.Loader = false;
        }
        else {
          this.Loader = false;
        }
      }, ErrorResponse => this.errMsg = ErrorResponse);
  }

  GetEmployees() {
    this._employeeService.getEmployees(JSON.parse(localStorage.getItem('AuthToken') || ''))
      .subscribe(employeeResponse => {
        if (employeeResponse.IsSuccess)
          this.EmployeeList = employeeResponse.EmployeeResult
      }, ErrorResponse => this.errMsg = ErrorResponse);
  }

  //onStartDateChange() {
  //    //var curDate = new Date();

  //    //if (new Date(this.FromDate) < curDate) {
  //    //    this._toastrAlertService.Alert_Error("Start date should not be before today.");
  //    //}
  //    this.GetAttendanceCorrectionSummary(this.status, this.FromDate, this.ToDate, this.employeeCode);
  //}

  //onEndDateChange() {

  //    if (new Date(this.FromDate) > new Date(this.ToDate)) {

  //        this._toastrAlertService.Alert_Error("To date should be greater than from date");
  //    }
  //    //this.GetAttendanceCorrectionSummary(this.status, this.FromDate, this.ToDate, this.employeeCode);
  //}

  onStatusChange(status: string) {
    this.status = status;
    //this.GetAttendanceCorrectionSummary(this.status, this.FromDate, this.ToDate, this.employeeCode);
  }

  onEmployeeChange(EmployeeCode: string) {
    debugger;
    this.employeeCode = EmployeeCode;
    // this.GetAttendanceCorrectionSummary(this.status, this.FromDate, this.ToDate, this.employeeCode);
  }

  Search() {
    if (new Date(this.FromDate) > new Date(this.ToDate)) {

      this._toastrAlertService.Alert_Error("To date should be greater than From date");
    } else {
      this.GetAttendanceCorrectionSummary(this.status, this.FromDate, this.ToDate, this.employeeCode);
    }
  }

  AttendanceCorrectionPopUp(ObjAttendanceCorrectionData: any) {
    this.ObjAttendanceCorrectionSummary = ObjAttendanceCorrectionData;
    this.AttendanceCorrectionManagerReason = "";

    var a = "Aug 28, 2008 " + this.ObjAttendanceCorrectionSummary.CorrectionTime;
    this.ChangeCorrectionTime = new Date(a);
    this.AttendanceCorrectionManagerReason = this.ObjAttendanceCorrectionSummary.ManagerNote;
    this.AttendanceCorrectionModal = true;
  }

  UpdateAttendanceCorrection(TranscationId: number, AttendanceCorrectionStatus: string) {

    if (this.AttendanceCorrectionManagerReason === "") {
      this._toastrAlertService.Alert_Error('Please add some reason');
      //} else if (this.WFHHours != null && this.WFHHours != "" && this.WFHTime != null && this.WFHTime != "") {
      //    this.WFHTotalHour = this.WFHHours + ":" + this.WFHTime;
    } else {
      this.Loader = true;
      this.AttendanceCorrectionModal = false;
      this._attendanceCorrectionService.SaveAttendanceRequest(TranscationId, "", "", new Date(this.ChangeCorrectionTime).toUTCString(), "", false, "", this.AttendanceCorrectionManagerReason, AttendanceCorrectionStatus, JSON.parse(localStorage.getItem('AuthToken') || ''))
        .subscribe(AttendanceCorrectionResponse => {

          this.errMsg = AttendanceCorrectionResponse.Message;
          this._toastrAlertService.Alert_Success(this.errMsg);
          if (AttendanceCorrectionResponse.IsSuccess) {
            this.Loader = false;
            this.GetAttendanceCorrectionSummary(this.status, this.FromDate, this.ToDate, this.EmployeeCode);
          }
          else {
            this.AttendanceCorrectionModal = false;
          }

        }, ErrorResponse => this.errMsg = ErrorResponse);
    }
  }



}
