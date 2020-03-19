import { WFHService } from '../../../services/WFHService';
import { WorkFromHomeSummary } from '../../../model/WorkFromHomeSummary';
import { Component, Injectable, Input, OnInit } from '@angular/core';
import { ToastrAlertService } from 'src/services/toastr.service';
import { EmployeeService } from '../../../services/employeeService';
import { Employee } from '../../../model/Employee';

@Component({
  selector: 'app-my-work-from-home',
  templateUrl: './my-work-from-home.component.html',
  styleUrls: ['./my-work-from-home.component.css']
})
export class MyWorkFromHomeComponent implements OnInit {

  Loader: boolean = false;
  public ToDate: Date = new Date();
  public FromDate: Date = new Date(this.ToDate.getFullYear(), this.ToDate.getMonth(), 1);

  validTime: boolean = false;
  errMsg: string = "";
  status: string = "";
  values = new Array();
  EmployeeList = new Array<Employee>();
  WorkFromHomeSummary = new Array<WorkFromHomeSummary>();
  ObjWorkFromHomeSummary = new WorkFromHomeSummary();

  //request wfh model
  WFHDate: Date = new Date();
  WFHTime: string = "";
  WFHHours: string = "";
  WFHReason: string = "";
  WFHMinuts: string = "";
  Date: Date = new Date();
  WFHTotalHour: string = "";
  WFHStartTime: Date = new Date();
  @Input('show-modal') showWFHModal: boolean = false;

  @Input('show-modal') showWFHStatusModal: boolean = false;

  constructor(private _workFromHomeService: WFHService, private _employeeService: EmployeeService,
    private _toastrAlertService: ToastrAlertService
  ) { }

  ngOnInit() {
    this.Loader = true;
    this.GetWFHSummary("", this.FromDate, this.ToDate);
  }

  GetWFHSummary(status: string, FromDate: Date, ToDate: Date) {
    this.Loader = true;
    this._workFromHomeService.GetWFHRequest(status, FromDate, ToDate, JSON.parse(localStorage.getItem('EmployeeCode') || ''), JSON.parse(localStorage.getItem('AuthToken') || ''))
      .subscribe(workFromHomeResponse => {
        if (workFromHomeResponse.IsSuccess) {
          this.WorkFromHomeSummary = workFromHomeResponse.result;

          for (var i = 0; i < this.WorkFromHomeSummary.length; i++) {

            this.WorkFromHomeSummary[i].Date = new Date(this.WorkFromHomeSummary[i].Date).toLocaleDateString();
            this.WorkFromHomeSummary[i].StartTime = new Date(this.WorkFromHomeSummary[i].StartTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
            this.WorkFromHomeSummary[i].EndTime = new Date(this.WorkFromHomeSummary[i].EndTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

          }
          this.Loader = false;
        }
        else {
          this.Loader = false;
        }
      }, ErrorResponse => this.errMsg = ErrorResponse);
  }

  onEndDateChange() {

    if (new Date(this.FromDate) > new Date(this.ToDate)) {

      this._toastrAlertService.Alert_Error("To date should be greater than From date");
    }
  }

  onStatusChange(status: string) {
    this.status = status;
  }

  Search() {
    if (new Date(this.FromDate) > new Date(this.ToDate)) {

      this._toastrAlertService.Alert_Error("To date should be greater than From date");
    } else {
      this.GetWFHSummary(this.status, this.FromDate, this.ToDate);
    }
  }

  OpenWFHPopUp() {
    this.showWFHModal = true;
  }

  CloseWFHPopUp() {
    this.WFHDate = new Date();
    this.WFHReason = "";
    this.WFHTime = "";
    this.showWFHModal = false;
  }

  onHourChange(Hour: string) {
    this.WFHHours = Hour;
  }

  onTimeChange(Time: string) {
    this.WFHTime = Time;
  }

  isValid(event: boolean): void {
    this.validTime = event;
  }

  SaveWFHRequest() {
    this.Date = new Date(this.WFHDate);
    this.WFHTotalHour = this.WFHHours + ":" + this.WFHTime;

    if (this.WFHReason === "") {
      this._toastrAlertService.Alert_Error('Please add Reason');
    }
    else if (this.WFHHours === "") {
      this._toastrAlertService.Alert_Error('Please add Hour');
    }
    else if (this.WFHTime === "") {
      this._toastrAlertService.Alert_Error('Please add Minute');
    } else {
      this.showWFHModal = false;
      this.Loader = true;
      this._workFromHomeService.SaveWFHRequest(0, "", this.Date.toUTCString(), new Date(this.WFHStartTime).toUTCString(), this.WFHTotalHour, "Pending", this.WFHReason, "", "", JSON.parse(localStorage.getItem('AuthToken') || ''))
        .subscribe(wfhResponse => {
          if (wfhResponse.IsSuccess) {
            this.WFHReason = "";
            this.WFHDate = new Date();
            this.WFHTotalHour = "";
            this.Loader = false;
            this.GetWFHSummary(this.status, this.FromDate, this.ToDate);
            if (wfhResponse.Message == "1") {
              this._toastrAlertService.Alert_Success("Request sent successfully.");
            } else {
              this._toastrAlertService.Alert_warning("You have already applied WFH for this date");
            }
          }
          else {
            this.errMsg = wfhResponse.Message;
            this.Loader = false;
            this._toastrAlertService.Alert_Error(this.errMsg);
          }

        }, ErrorResponse => this.errMsg = ErrorResponse);
    }
  }

  WFHStatusPopUp(WorkFromHomeData: any) {
    this.ObjWorkFromHomeSummary = WorkFromHomeData;
    this.values = this.ObjWorkFromHomeSummary.TotalHour.split(":");
    this.showWFHStatusModal = true;
  }

  CloseStatusPopUp() {

    this.showWFHStatusModal = false;

  }



}
