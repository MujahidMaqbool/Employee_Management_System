
import { Component, Injectable, Input, OnInit } from '@angular/core';
import { ToastrAlertService } from 'src/services/toastr.service';
import { EmployeeService } from '../../../services/employeeService';
import { Employee } from '../../../model/Employee';
import { WFHService } from '../../../services/WFHService';
import { WorkFromHomeSummary } from '../../../model/WorkFromHomeSummary';

@Component({
  selector: 'app-applied-work-from-home',
  templateUrl: './applied-work-from-home.component.html',
  styleUrls: ['./applied-work-from-home.component.css']
})
export class AppliedWorkFromHomeComponent implements OnInit {

  Loader: boolean = false;
  public ToDate: Date = new Date();
  public FromDate: Date = new Date(this.ToDate.getFullYear(), this.ToDate.getMonth(), 1);

  errMsg: string = "";
  WFHStatus: string = "";
  status: string = "";
  WFHTime: string = "";
  WFHHours: string = "";
  WFHMinuts: string = "";
  WFHTotalHour: string = "";
  EmployeeCode: string = "";
  employeeCode: string = "";
  values = new Array();
  WFHManagerReason: string = "";
  TranscationId: string = "";
  ManagerRemarks: string = "";
  EmployeeList = new Array<Employee>();
  WorkFromHomeSummary = new Array<WorkFromHomeSummary>();
  ObjWorkFromHomeSummary = new WorkFromHomeSummary();
  @Input('show-modal') showWFHModal: boolean = false;

  constructor(private _workFromHomeService: WFHService, private _employeeService: EmployeeService,
    private _toastrAlertService: ToastrAlertService
  ) { }

  ngOnInit() {
    this.Loader = true;
    this.GetWFHSummary("", this.FromDate, this.ToDate, "");
    this.GetEmployees();
  }

  GetWFHSummary(status: string, FromDate: Date, ToDate: Date, EmployeeCode: string) {
    this.Loader = true;
    this._workFromHomeService.GetWFHRequest(status, FromDate, ToDate, EmployeeCode, JSON.parse(localStorage.getItem('AuthToken') || ''))
      .subscribe(workFromHomeResponse => {
        if (workFromHomeResponse.IsSuccess) {
          this.WorkFromHomeSummary = workFromHomeResponse.result;

          for (var i = 0; i < this.WorkFromHomeSummary.length; i++) {

            this.WorkFromHomeSummary[i].Date = new Date(this.WorkFromHomeSummary[i].Date).toLocaleDateString();
            this.WorkFromHomeSummary[i].StartTime = new Date(this.WorkFromHomeSummary[i].StartTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
            this.WorkFromHomeSummary[i].EndTime = new Date(this.WorkFromHomeSummary[i].EndTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

          }

          this.WorkFromHomeSummary = this.WorkFromHomeSummary.filter(i => i.EmployeeCode != JSON.parse(localStorage.getItem('EmployeeCode') || ''));
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

  onStartDateChange() {
    //var curDate = new Date();

    //if (new Date(this.FromDate) < curDate) {
    //    this._toastrAlertService.Alert_Error("Start date should not be before today.");
    //}
    // this.GetWFHSummary(this.status, this.FromDate, this.ToDate, this.employeeCode);
  }

  onEndDateChange() {

    if (new Date(this.FromDate) > new Date(this.ToDate)) {

      this._toastrAlertService.Alert_Error("To date should be greater than From date");
    }
    // this.GetWFHSummary(this.status, this.FromDate, this.ToDate, this.employeeCode);
  }

  onStatusChange(status: string) {
    this.status = status;
    // this.GetWFHSummary(this.status, this.FromDate, this.ToDate, this.employeeCode);
  }

  onEmployeeChange(EmployeeCode: string) {
    this.employeeCode = EmployeeCode;
    // this.GetWFHSummary(this.status, this.FromDate, this.ToDate, this.employeeCode);
  }

  OpenWFHPopUp() {
    this.showWFHModal = true;
  }

  Search() {
    if (new Date(this.FromDate) > new Date(this.ToDate)) {

      this._toastrAlertService.Alert_Error("To date should be greater than From date");
    } else {
      this.GetWFHSummary(this.status, this.FromDate, this.ToDate, this.employeeCode);
    }
  }

  WFHPopUp(WorkFromHomeData: any) {
    this.WFHManagerReason = "";
    this.ObjWorkFromHomeSummary = WorkFromHomeData;
    this.WFHManagerReason = this.ObjWorkFromHomeSummary.ManagerRemarks;
    console.log(this.ObjWorkFromHomeSummary);
    this.values = this.ObjWorkFromHomeSummary.TotalHour.split(":");
    this.showWFHModal = true;
  }

  onHourChange(Hour: string) {
    debugger;
    this.WFHHours = Hour;
  }

  onTimeChange(Time: string) {
    debugger;
    this.WFHTime = Time;
  }

  ClosePopUp() {
    //debugger;
    this.showWFHModal = false;

  }

  UpdateWorkFromHome(TranscationId: number, WFHStatus: string) {
    if (this.WFHManagerReason === "") {
      this._toastrAlertService.Alert_Error('Please add some reason');
    }
    //else if (this.WFHHours != null && this.WFHHours != "" && this.WFHTime != null && this.WFHTime != "") {
    //    this.WFHTotalHour = this.WFHHours + ":" + this.WFHTime;
    //}
    else {
      this.Loader = true;
      if (this.WFHHours != "" && this.WFHTime != "")
        this.WFHTotalHour = this.WFHHours + ":" + this.WFHTime;
      this._workFromHomeService.SaveWFHRequest(TranscationId, "", "", "", this.WFHTotalHour, WFHStatus, "", "", this.WFHManagerReason, JSON.parse(localStorage.getItem('AuthToken') || ''))
        .subscribe(wfhResponse => {
          this.Loader = false;
          this.errMsg = wfhResponse.Message;
          this._toastrAlertService.Alert_Success(this.errMsg);
          if (wfhResponse.IsSuccess) {
            this.showWFHModal = false;
            this.GetWFHSummary("Pending", this.FromDate, this.ToDate, "");
          }
        }, ErrorResponse => this.errMsg = ErrorResponse);
    }
  }


}
