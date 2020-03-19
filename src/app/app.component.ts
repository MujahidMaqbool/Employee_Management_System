import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
//import { SharedService } from "../services/SharedService";
import { EmployeePermission } from '../model/EmployeePermission';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class AppComponent implements OnInit {

    currentTime: string = "";
    currentDate: string = "";
    public sharedData: any;
    public status: string = "";
    public ActiveLink: string = "";
    public IsLogin: boolean = false;
    public EmployeeName: string = "";
    public EmployeeImage: string = "";
    public ShowReport: boolean = false;
    public ShowWFHChild: boolean = false;
    public ShowEmployees: boolean = false;
    public ShowDashBoard: boolean = false;
    public ShowLeaveChild: boolean = false;
    public IsAuthenticated: boolean = false;
    public ShowFiscalLeaves: boolean = false;
    public ShowReimbursement: boolean = false;
    public ShowLeavesApproval: boolean = false;
    public ShowMainAttendance: boolean = false;
    public ShowAttendanceChild: boolean = false;
    //public ShowAdminAttendance: boolean = false;
    public ShowWorkFromHomeApproval: boolean = false;
    public ShowAppliedAttendanceCorrection: boolean = false;

    public EmployeePermission = new EmployeePermission();

    title: string = 'Employee Management System';

    constructor(private router: Router,
        // private _sharedService: SharedService
    ) {
        setInterval(() => {
            this.currentTime = new Date().toLocaleTimeString();
            this.currentDate = new Date().toLocaleDateString();
        }, 1000);
    }

    ngOnInit() {

        if (localStorage.getItem('AuthToken')) {
            // logged in so return true
            this.IsAuthenticated = true;
        }

        if (localStorage.getItem('EmployeeName') != null) {
            this.EmployeeName = JSON.parse(localStorage.getItem('EmployeeName') || '');
        }

        if (localStorage.getItem('EmployeeImage')) {
            this.EmployeeImage = JSON.parse(localStorage.getItem('EmployeeImage') || '');

            if (this.EmployeeImage == null) {
                this.EmployeeImage = "../../../../images/default-img.png";
            }
        }

        if (localStorage.getItem("EmployeePermission")) {

            this.IsLogin = true;

            this.EmployeePermission = JSON.parse(localStorage.getItem("EmployeePermission") || '{}');

            if (this.EmployeePermission.ShowWorkFromHomeApproval) {
                this.ShowWorkFromHomeApproval = this.EmployeePermission.ShowWorkFromHomeApproval;
            }

            if (this.EmployeePermission.ShowFiscalLeaves) {
                this.ShowFiscalLeaves = this.EmployeePermission.ShowFiscalLeaves;
                //debugger
            }

            if (this.EmployeePermission.ShowLeavesApproval) {
                this.ShowLeavesApproval = this.EmployeePermission.ShowLeavesApproval;
            }

            //if (this.EmployeePermission.ShowMainAttendance) {
            //    this.ShowAdminAttendance = this.EmployeePermission.ShowMainAttendance;
            //}

            if (this.EmployeePermission.ShowEmployees) {
                this.ShowEmployees = this.EmployeePermission.ShowEmployees;
            }
            if (this.EmployeePermission.ShowAppliedAttendanceCorrection) {
                this.ShowAppliedAttendanceCorrection = this.EmployeePermission.ShowAppliedAttendanceCorrection;
            }
            if (this.EmployeePermission.ShowReimbursement) {
                this.ShowReimbursement = this.EmployeePermission.ShowReimbursement;
            }
            if (this.EmployeePermission.ShowReport) {
                this.ShowReport = this.EmployeePermission.ShowReport;
            }
        }

    }

    // get translation
    getSharedData() {
        //console.log(JSON.stringify(this._sharedService.getSharedData()));
        //  this.sharedData = this._sharedService.getSharedData();
        //  return this.sharedData.Loader;
        // return this._sharedService.getSharedData();
    }

    onNotify(isAutenticationComplete: boolean): void {

        this.IsAuthenticated = isAutenticationComplete;
        if (localStorage.getItem('AuthToken')) {
            // logged in so return true
            this.IsAuthenticated = true;
        }
        debugger
        if (localStorage.getItem('EmployeeName') != null) {
            this.EmployeeName = JSON.parse(localStorage.getItem('EmployeeName') || '');
        }

        if (localStorage.getItem('EmployeeImage')) {
            this.EmployeeImage = JSON.parse(localStorage.getItem('EmployeeImage') || '');
            if (this.EmployeeImage == null) {
                this.EmployeeImage = "../../../../images/default-img.png";
            }
        }

        if (localStorage.getItem("EmployeePermission")) {

            this.IsLogin = true;

            this.EmployeePermission = JSON.parse(localStorage.getItem("EmployeePermission") || '{}');

            if (this.EmployeePermission.ShowWorkFromHomeApproval) {
                this.ShowWorkFromHomeApproval = this.EmployeePermission.ShowWorkFromHomeApproval;
            }

            if (this.EmployeePermission.ShowFiscalLeaves) {
                this.ShowFiscalLeaves = this.EmployeePermission.ShowFiscalLeaves;
                //debugger
            }

            if (this.EmployeePermission.ShowLeavesApproval) {
                this.ShowLeavesApproval = this.EmployeePermission.ShowLeavesApproval;
            }

            //if (this.EmployeePermission.ShowMainAttendance) {
            //    this.ShowAdminAttendance = this.EmployeePermission.ShowMainAttendance;
            //}

            if (this.EmployeePermission.ShowEmployees) {
                this.ShowEmployees = this.EmployeePermission.ShowEmployees;
            }
            if (this.EmployeePermission.ShowAppliedAttendanceCorrection) {
                this.ShowAppliedAttendanceCorrection = this.EmployeePermission.ShowAppliedAttendanceCorrection;
            }
            if (this.EmployeePermission.ShowReimbursement) {
                this.ShowReimbursement = this.EmployeePermission.ShowReimbursement;
            }
            if (this.EmployeePermission.ShowReport) {
                this.ShowReport = this.EmployeePermission.ShowReport;
            }
        }
        //window.location.reload();
        this.ActiveLink = "Dashboard";
        this.router.navigate(['/dashboard']);
    }

    //openAttendanceAdmin(ShowAttendance: boolean): void {
    //    this.ShowAdminAttendance = ShowAttendance;
    //}

    Active(status: string) {
        this.ActiveLink = status;
        //if (status == "ShowAttendanceChild") {
        //    this.ShowAttendanceChild = true;
        //    this.ShowLeaveChild = false;
        //    this.ShowWFHChild = false;

        //}
        //else if (status == "ShowLeaveChild") {
        //    this.ShowLeaveChild = true;
        //    this.ShowWFHChild = false;
        //    this.ShowAttendanceChild = false;

        //}
        //else if (status == "ShowWFHChild") {
        //    this.ShowWFHChild = true;
        //    this.ShowLeaveChild = false;
        //    this.ShowAttendanceChild = false;
        //}
        //else {
        //    this.ShowWFHChild = false;
        //    this.ShowLeaveChild = false;
        //    this.ShowAttendanceChild = false;
        //}
    }

    GetEmployeeImage() {
        if (localStorage.getItem('EmployeeImage')) {
            this.EmployeeImage = JSON.parse(localStorage.getItem('EmployeeImage') || '');
            if (this.EmployeeImage == null) {
                this.EmployeeImage = "../../../../images/default-img.png";
            } else {
                this.EmployeeImage = this.EmployeeImage.replace("content/i", "assets/I");
            }

        }
        return this.EmployeeImage;
    }

    signOut() {
        debugger
        localStorage.clear();
        this.IsAuthenticated = false;
        this.router.navigate(['/login']);
    }



}