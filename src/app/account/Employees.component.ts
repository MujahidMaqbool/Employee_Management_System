import { Component, Renderer2, Injectable, Inject, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { EmployeeRegistrationService } from '../../services/employeeRegistrationService';
import { EmployeeService } from '../../services/employeeService';
import { Employee } from '../../model/Employee';
import { Location } from '../../model/Location';
import { Team } from '../../model/Team';
import { Department } from '../../model/Department';
import { EmployeeTeam } from '../../model/EmployeeTeam';
import { EmployeeDesignation } from '../../model/EmployeeDesignation';
import { DOCUMENT } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrAlertService } from 'src/services/toastr.service';
import { Role } from "../../model/Role";

@Component({
    selector: 'Employees',
    templateUrl: './Employees.component.template.html'
})

////////test

export class EmployeesComponent implements OnInit {

    SearchString: string = "";
    searchTeam: string = "";
    filteredTeamList = new Array();
    selectedTeamList = new Array();
    errMsg: string = "";
    IsOtherDesignation: boolean = false;
    employeeDesignationList = new Array<EmployeeDesignation>();
    employeeNewAddedDesignationObj = new EmployeeDesignation();
    reportingEmployeeList = new Array<Employee>();
    teamList = new Array<Team>();
    departmentList = new Array<Department>();
    selectedReportEmployee: any;
    selectedDepartment: number = 0;
    @Input('show-modal') showModal: boolean = false;
    @Input('show-modal') designationShowModal: boolean = false;
    password: string = "";
    otherDesignation: string = "";
    selectedDesignation: any = { DesignationId: 0, Designation: "Choose Designation", ShortDescription: "", CreatedUtcDateTime: null, LastUpdatedUTCDateTime: null, IsDisabled: true };
    emailErrMsg: string = "";
    emailId: string = "";
    employeeName: string = "";
    Employees = new Array<Employee>();
    employeeRoleList = new Array<Role>();
    EmployeeModel = new Array<Employee>();
    employeeCode: string = "";
    skypeId: string = "";
    skypeErrMsg: string = "";
    empCodeErrMsg: string = "";
    empNameErrMsg: string = "";
    teamErrMsg: string = "";
    departmentErrMsg: string = "";
    desgErrMsg: string = "";
    otherDesgErrMsg: string = "";
    pwdErrMsg: string = "";
    joiningDate: Date = new Date();
    empShortName: string = "";
    designationId: number = 0;
    allValid: boolean = true;
    FromDate: Date = new Date();
    ToDate: Date = new Date();
    EmployeeList = new Array<Employee>();
    employeeId: string = "";
    teamExist: boolean = false;
    dateChecked: boolean = false;
    Loader: boolean = false;
    reportToErrMsg: string = "";
    succMsg: string = "";
    selectedRoleEmployee: number = 0;
    roleErrMsg: string = '';
    serialNumber: string = "";
    SNErrMsg: string = "";
    sortOptions: Array<object> = [
        { optionName: 'Name', value: 'EmployeeName' },
        { optionName: 'Serial No', value: 'SerialNumber' },
        { optionName: 'Code', value: 'EmployeeCode' },
        { optionName: 'Joining date', value: 'JoiningDate' },
        { optionName: 'Designation', value: 'Designation' },
        { optionName: 'Email', value: 'Email' },
        { optionName: 'Status', value: 'Status' },
    ];
    @ViewChild('SortOptionControl') SortOptionControl: ElementRef;
    @ViewChild('OrderBy') OrderBy: ElementRef;
    ////////////////////////////////////////////      Please don't remove this commented code      //////////////////////////////////////////

    //reportingEmployeeList = new Array<Employee>();

    //employeeDesignation: string = "";
    //dateOfBirth: Date = new Date();

    //primaryPhone: string = "";
    //relativeName: string = "";
    //relativePhoneNumber: string = "";

    //joiningDate: Date=new Date();
    //password: string = "";
    //confirmPassword: string = "";
    //selectedReportEmployee: string = "";
    //allValid: boolean=true;

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    constructor(
        private router: Router, private _employeeRegistrationService: EmployeeRegistrationService,
        private _employeeService: EmployeeService,
        private _renderer2: Renderer2, @Inject(DOCUMENT) private _document: any,
        private _toastrAlertService: ToastrAlertService
    ) {
    }


    ngOnInit() {

        this.GetReportingtoEmployeeList();
        this.GetEmployeeDesignations();
        this.GetEmployees();
        this.GetEmployeesList('Name', 1);
        this.GetTeams();
        this.GetRoles();
        this.GetDepartments();
        // let s = this._renderer2.createElement('script');
        // s.type = `text/javascript`;
        // s.src = require('../../assets/scripts/employeeRegistration.js');
        // this._renderer2.appendChild(this._document.body, s);
    }

    sortEmployee() {

        this.GetEmployeesList(this.SortOptionControl.nativeElement.value, this.OrderBy.nativeElement.value);

        //debugger
        // if (value == "EmployeeName") {
        //     this.EmployeeModel.sort((a, b) => (a.EmployeeName > b.EmployeeName) ? 1 : -1);
        // }
        // else if (value == "SerialNumber") {
        //     this.EmployeeModel.sort((a, b) => (a.SerialNumber > b.SerialNumber) ? 1 : -1);
        // }
        // else if (value == "EmployeeCode") {
        //     this.EmployeeModel.sort((a, b) => (a.EmployeeCode > b.EmployeeCode) ? 1 : -1);
        // }
        // else if (value == "JoiningDate") {
        //     this.EmployeeModel.sort((a, b) => (a.JoiningDate > b.JoiningDate) ? 1 : -1);
        // }
        // else if (value == "Designation") {
        //     this.EmployeeModel.sort((a, b) => (a.Designation > b.Designation) ? 1 : -1);
        // }
        // else if (value == "Email") {
        //     this.EmployeeModel.sort((a, b) => (a.Email > b.Email) ? 1 : -1);
        // }
        // else if (value == "Status") {
        //     this.EmployeeModel.sort((a, b) => (a.Status > b.Status) ? 1 : -1);
        // }

    }

    FilterTeam() {
        //debugger;
        this.teamErrMsg = "";
        this.allValid = true;
        if (this.searchTeam !== "") {
            var strSearchTeam: string = this.searchTeam.toLocaleLowerCase();
            this.filteredTeamList = this.teamList.filter(function (el: any) {
                return el.TeamName.toLowerCase().indexOf(strSearchTeam) > -1;
            }.bind(this));
        }
        else {
            this.filteredTeamList = [];
        }
    }

    SelectedTeam(team: any) {
        debugger;
        this.teamExist = false;
        if (this.selectedTeamList.length > 0) {
            for (let i = 0; i < this.selectedTeamList.length; i++) {
                if (team["TeamId"] == this.selectedTeamList[i]["TeamId"]) {
                    this._toastrAlertService.Alert_Error("Team already exist");
                    this.teamExist = true;
                    break;
                }
            }
        }
        if (!this.teamExist) {
            this.selectedTeamList.push(team);
            this.searchTeam = '';
            this.filteredTeamList = [];
        }
    }

    RemoveTeam(team: any) {
        //debugger;
        this.selectedTeamList.splice(this.selectedTeamList.indexOf(team), 1);
    }

    GetRoles() {
        this._employeeService.getEmployeesRole(JSON.parse(localStorage.getItem('AuthToken') || ''))
            .subscribe(roleResponse => {
                if (roleResponse.IsSuccess) {
                    this.employeeRoleList = roleResponse.RoleResult;
                }
                else {
                    this.errMsg = roleResponse.Message;
                }
            }, ErrorResponse => this.errMsg = ErrorResponse);
    }

    GetTeams() {
        this._employeeRegistrationService.GetTeams(JSON.parse(localStorage.getItem('AuthToken') || ''))
            .subscribe(teamResponse => {
                if (teamResponse.IsSuccess) {
                    // debugger;
                    this.teamList = teamResponse.TeamResult;
                }
                else {
                    this.errMsg = teamResponse.Message;
                }
            }, ErrorResponse => this.errMsg = ErrorResponse);
    }

    GetDepartments() {
        this._employeeRegistrationService.GetDepartments(JSON.parse(localStorage.getItem('AuthToken') || ''))
            .subscribe(departmentResponse => {
                if (departmentResponse.IsSuccess) {
                    //debugger;
                    this.departmentList = departmentResponse.DepartmentResult;
                }
                else {
                    this.errMsg = departmentResponse.Message;
                }
            }, ErrorResponse => this.errMsg = ErrorResponse);
    }

    GetReportingtoEmployeeList() {
        this._employeeRegistrationService.GetReportingtoEmployeeList(JSON.parse(localStorage.getItem('AuthToken') || ''))
            .subscribe(employeeResponse => {
                if (employeeResponse.IsSuccess) {
                    //debugger;
                    this.reportingEmployeeList = employeeResponse.EmployeeResult;
                }
                else {
                    this.errMsg = employeeResponse.Message;
                }
            }, ErrorResponse => this.errMsg = ErrorResponse);
    }

    GetEmployees() {
        this._employeeService.getEmployees(JSON.parse(localStorage.getItem('AuthToken') || ''))
            .subscribe(employeeResponse => {
                if (employeeResponse.IsSuccess) {
                    this.Employees = employeeResponse.EmployeeResult

                }
            }, ErrorResponse => this.errMsg = ErrorResponse);
    }

    GetEmployeesList(sortBy: string, orderBy: number) {
        this.Loader = true;
        this._employeeRegistrationService.AllEmployees(sortBy, orderBy, this.dateChecked, this.employeeId, this.FromDate, this.ToDate, JSON.parse(localStorage.getItem('AuthToken') || ''))
            .subscribe(employeeResponse => {
                if (employeeResponse.IsSuccess) {
                    this.Loader = false;
                    this.EmployeeList = employeeResponse.EmployeeResult;
                    this.EmployeeModel = employeeResponse.EmployeeResult;
                    debugger
                }
                else {
                    this.Loader = false;
                    this.errMsg = employeeResponse.Message;
                }
            }, ErrorResponse => this.errMsg = ErrorResponse);
    }

    SearchEmployee() {
        debugger
        if (this.SearchString == '') {
            this.EmployeeModel = this.EmployeeList;
        }

        this.EmployeeModel = Object.assign(this.EmployeeList, this.EmployeeList).filter(EmployeeList =>
            EmployeeList.EmployeeName.toLowerCase().indexOf(this.SearchString.toLowerCase()) > -1
        )
    }

    onEmployeeChange(employeeId: string) {
        this.employeeId = employeeId;
        this.GetEmployeesList(this.SortOptionControl.nativeElement.value, this.OrderBy.nativeElement.value);
    }

    onDateChange() {
        this.GetEmployeesList(this.SortOptionControl.nativeElement.value, this.OrderBy.nativeElement.value);
    }

    validateEmail(email: string) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    ClosePopUp() {
        this.showModal = false;
    }

    CloseDesignationPopUp() {
        this.designationShowModal = false;
        this.otherDesgErrMsg = "";
        this.showModal = true;
    }

    OpenPopUp() {
        this.employeeCode = "";
        this.employeeName = "";
        this.selectedDesignation = this.employeeDesignationList[0];
        this.emailId = "";
        this.skypeId = "";
        this.password = "";
        this.joiningDate = new Date();
        this.selectedReportEmployee = "";
        this.selectedTeamList = [];
        this.selectedDepartment = 0;
        this.showModal = true;
    }

    OpenDesignationPopUp() {
        this.otherDesignation = "";
        this.designationShowModal = true;
        this.showModal = false;
    }

    RandomPassword(length: number) {
        var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOP1234567890";
        var pass = "";
        for (var x = 0; x < length; x++) {
            var i = Math.floor(Math.random() * chars.length);
            pass += chars.charAt(i);
        }
        return pass;
    }

    GeneratePassword() {
        this.pwdErrMsg = "";
        this.allValid = true;
        this.password = this.RandomPassword(8);
    }

    GetEmployeeDesignations() {
        this._employeeRegistrationService.GetEmployeeDesignations(JSON.parse(localStorage.getItem('AuthToken') || ''))
            .subscribe(employeeResponse => {
                if (employeeResponse.IsSuccess) {
                    //debugger;
                    this.employeeDesignationList = employeeResponse.EmployeeDesignationResult;
                    this.employeeDesignationList.unshift(this.selectedDesignation);
                }
                else {
                    this.errMsg = employeeResponse.Message;
                }
            }, ErrorResponse => this.errMsg = ErrorResponse);
    }

    GetNewAddedDesignation() {
        debugger;
        var employee = new Employee();
        var empTeams = new Array();
        this._employeeRegistrationService.GetNewAddedDesignation(JSON.parse(localStorage.getItem('AuthToken') || ''))
            .subscribe(employeeResponse => {
                if (employeeResponse.IsSuccess) {
                    debugger;
                    this.employeeNewAddedDesignationObj = employeeResponse.EmployeeNewAddedDesignationResult;
                    this.designationId = this.employeeNewAddedDesignationObj.DesignationId;

                    for (let i = 0; i < this.selectedTeamList.length; i++) {
                        var empTeam = new EmployeeTeam();
                        empTeam.TeamId = this.selectedTeamList[i].TeamId;
                        empTeams.push(empTeam);
                    }
                    employee.EmployeeCode = this.employeeCode;
                    employee.EmployeeName = this.employeeName;
                    employee.ShortName = this.empShortName;
                    employee.DesignationId = this.designationId;
                    employee.Email = this.emailId;
                    employee.SkypeId = this.skypeId;
                    employee.Password = this.password;
                    employee.JoiningDate = this.joiningDate;
                    employee.ReportTo = this.selectedReportEmployee["EmployeeId"];
                    employee.EmployeeTeams = empTeams;
                    employee.DeptId = this.selectedDepartment;

                    this._employeeRegistrationService.SaveNewEmployee(employee, JSON.parse(localStorage.getItem('AuthToken') || '')).subscribe(employeeResponse => {
                        if (employeeResponse.IsSuccess) {
                            employee.Designation = this.otherDesignation;
                            employee.EmployeeCode = this.employeeCode;
                            employee.EmployeeName = this.employeeName;
                            employee.JoiningDate = this.joiningDate;
                            employee.Email = this.emailId;
                            this.EmployeeList.push(employee);
                            this.showModal = false;
                        }
                        else {
                            this.errMsg = employeeResponse.Message;
                        }
                    }, ErrorResponse => this.errMsg = ErrorResponse);
                }
                else {
                    this.errMsg = employeeResponse.Message;
                }
            }, ErrorResponse => this.errMsg = ErrorResponse);
    }

    SaveDesignation() {
        debugger;
        if (this.otherDesignation == "") {
            this.otherDesgErrMsg = "Designation is required";
            this.allValid = false;
        }
        else {

            let obj = {
                Designation: this.otherDesignation,
                ShortDescription: this.otherDesignation
            };
            this._employeeRegistrationService.SaveDesignation(obj, JSON.parse(localStorage.getItem('AuthToken') || '')).subscribe(employeeResponse => {
                if (employeeResponse.IsSuccess) {
                    debugger;

                    var selectedOtherDesignation: any = { DesignationId: 0, Designation: "", ShortDescription: "", CreatedUtcDateTime: null, LastUpdatedUTCDateTime: null, IsDisabled: false };
                    selectedOtherDesignation.Designation = this.otherDesignation;
                    this.employeeDesignationList.push(selectedOtherDesignation);
                    this.selectedDesignation = selectedOtherDesignation;
                    this.designationShowModal = false;
                    this.showModal = true;
                    this.succMsg = "New designation added successfully";
                    this._toastrAlertService.Alert_Success("New designation added successfully");
                }
                else {
                    this.errMsg = employeeResponse.Message;
                }
            }, ErrorResponse => this.errMsg = ErrorResponse);
        }
    }

    onChangeCode() {
        //debugger;
        this.empCodeErrMsg = ""
        this.allValid = true;
    }

    onChangeName() {
        // debugger;
        this.empNameErrMsg = "";
        this.allValid = true;
    }

    onChangeDesignation() {
        debugger;
        this.desgErrMsg = "";
        this.allValid = true;
    }
    onChangeOtherDesignation() {
        debugger;
        this.otherDesgErrMsg = "";
        this.allValid = true;
    }
    onChangeEmail() {
        //debugger;
        this.emailErrMsg = "";
        this.allValid = true;
    }

    onChangeSerialNumber() {
        //debugger;
        this.SNErrMsg = "";
        this.allValid = true;
    }

    onChangeSkype() {
        //debugger;
        this.skypeErrMsg = "";
        this.allValid = true;
    }

    onChangePassword() {
        //debugger;
        this.pwdErrMsg = "";
        this.allValid = true;
    }

    onChangeDepartment() {
        // debugger;
        this.roleErrMsg = "";
        this.allValid = true;
    }

    onChangeRole() {
        // debugger;
        this.departmentErrMsg = "";
        this.allValid = true;
    }

    SaveNewEmployee() {
        debugger
        var _emailValid = this.validateEmail(this.emailId);
        if (this.employeeCode == "") {
            this.empCodeErrMsg = "Code is required";
            this.allValid = false;
        }
        if (this.serialNumber == "") {
            this.SNErrMsg = "Serial Number is required";
            this.allValid = false;
        }
        if (this.serialNumber != "" && Number(this.serialNumber) < 0 || Number(this.serialNumber) == 0) {
            this.SNErrMsg = "Serial Number is required";
            this.allValid = false;
        }
        if (this.employeeName == "") {
            this.empNameErrMsg = "Name is required";
            this.allValid = false;
        }
        if (this.selectedDesignation.DesignationId == 0 && this.otherDesignation == "") {
            this.desgErrMsg = "Designation is required";
            this.allValid = false;
        }

        if (this.emailId == "") {
            this.emailErrMsg = "Email Id is required";
            this.allValid = false;
        }
        if (this.emailId != "" && !_emailValid) {
            this.emailErrMsg = "Email Id is not valid";
            this.allValid = false;
        }

        if (this.skypeId == "") {
            this.skypeErrMsg = "Skype Id is required";
            this.allValid = false;
        }

        if (this.selectedReportEmployee["EmployeeId"] == undefined) {
            this.reportToErrMsg = "Report to is required";
            this.allValid = false;
        }

        if (this.selectedRoleEmployee == 0) {
            this.roleErrMsg = "Role is required";
            this.allValid = false;
        }

        if (this.password == "") {
            this.pwdErrMsg = "Password is required";
            this.allValid = false;
        }
        if (this.selectedTeamList.length == 0) {
            this.teamErrMsg = "Team is required";
            this.allValid = false;
        }
        if (this.selectedDepartment == 0) {
            this.departmentErrMsg = "Department is required";
            this.allValid = false;
        }

        if (this.allValid) {
            this.Loader = true;
            var wordArray = [];
            var employee = new Employee();
            var empTeams = [];
            var words = this.employeeName.replace(/\s\s+/g, ' ');
            wordArray = words.trim().split(' ');
            if (this.empShortName == '') {
                if (wordArray.length > 2) {
                    this.empShortName = wordArray[0] + " " + wordArray[1];
                }
                else {
                    this.empShortName = this.employeeName;
                }
            }

            if (this.selectedDesignation.DesignationId != 0) {
                debugger;
                this.designationId = this.selectedDesignation.DesignationId;

                for (let i = 0; i < this.selectedTeamList.length; i++) {
                    var empTeam = new EmployeeTeam();
                    empTeam.TeamId = this.selectedTeamList[i].TeamId;
                    empTeams.push(empTeam);
                }

                employee.EmployeeCode = this.employeeCode;
                employee.EmployeeName = this.employeeName;
                employee.ShortName = this.empShortName;
                employee.DesignationId = this.designationId;
                employee.Email = this.emailId;
                employee.SkypeId = this.skypeId;
                employee.Password = this.password;
                employee.JoiningDate = this.joiningDate;
                employee.ReportTo = this.selectedReportEmployee["EmployeeId"];
                employee.EmployeeTeams = empTeams;
                employee.RoleId = this.selectedRoleEmployee;
                employee.DeptId = this.selectedDepartment;
                employee.SerialNumber = this.serialNumber;

                this._employeeRegistrationService.SaveNewEmployee(employee, JSON.parse(localStorage.getItem('AuthToken') || '')).subscribe(employeeResponse => {
                    if (employeeResponse.IsSuccess) {
                        for (var i = 0; i < this.employeeDesignationList.length; i++) {
                            if (this.employeeDesignationList[i].DesignationId == this.designationId) {
                                employee.Designation = this.employeeDesignationList[i].ShortDescription;
                                break;
                            }
                        }
                        employee.EmployeeCode = this.employeeCode;
                        employee.EmployeeName = this.employeeName;
                        employee.JoiningDate = this.joiningDate;
                        employee.Email = this.emailId;
                        this.EmployeeList.push(employee);
                        this.showModal = false;
                        this.Loader = false;
                        this._toastrAlertService.Alert_Success("New emploee added successfully.");
                    }
                    else {
                        this.Loader = false;
                        this.errMsg = employeeResponse.Message;
                    }
                }, ErrorResponse => this.errMsg = ErrorResponse);
            }
            else {
                this.Loader = false;
                this.GetNewAddedDesignation();
            }
        }
    }



    ////////////////////////////////////////////      Please don't remove this commented code      //////////////////////////////////////////


    //GetReportingtoEmployeeList() {
    //    this._employeeRegistrationService.GetReportingtoEmployeeList(localStorage.getItem('AuthToken'))
    //        .subscribe(employeeResponse => {
    //            if (employeeResponse.IsSuccess) {
    //                debugger;
    //                this.reportingEmployeeList = employeeResponse.EmployeeResult;
    //            }
    //            else {
    //                this.errMsg = employeeResponse.Message;
    //            }
    //        }, ErrorResponse => this.errMsg = ErrorResponse);
    //}

    //isNumber(evt) {
    //    //debugger;
    //    evt = (evt) ? evt : window.event;
    //    var charCode = (evt.which) ? evt.which : evt.keyCode;
    //    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    //        return false;
    //    }
    //    return true;
    //}

    //SaveRegisteredEmployee() {
    //    debugger;
    //    var _emailValid = this.validateEmail(this.email);
    //    var _skypeIdValid = this.validateEmail(this.skypeId);
    //    if (this.password != this.confirmPassword) {
    //        this.pwdErrMsg = "Passwords do not match"
    //        this.allValid = false;
    //    }
    //    if (!_emailValid) {
    //        this.emailErrMsg = "Email is not valid"
    //        this.allValid = false;
    //    }
    //    if (!_skypeIdValid) {
    //        this.skypeErrMsg = "SkypeID is not valid"
    //        this.allValid = false;
    //    }

    //    if (this.allValid) {
    //        let obj = {
    //            EmployeeName: this.employeeName,
    //            EmployeeCode: this.employeeCode,
    //            Designation: this.employeeDesignation,
    //            DateOfBirth: this.dateOfBirth,
    //            Email: this.email,
    //            PrimaryPhone: this.primaryPhone,
    //            RelativeName: this.relativeName,
    //            RelativePhoneNumber: this.relativePhoneNumber,
    //            SkypeId: this.skypeId,
    //            JoiningDate: this.joiningDate,
    //            ReportTo: this.selectedReportEmployee["EmployeeId"],
    //            Password: this.password,
    //            Country: this.selectedCountry["Name"],
    //            City: this.selectedCity["Name"],
    //            CountryId: this.selectedCountry["ID"],
    //            CityId: this.selectedCity["ID"]
    //        };

    //        this._employeeRegistrationService.SaveRegisteredEmployee(obj, localStorage.getItem('AuthToken')).subscribe(employeeResponse => {
    //            if (employeeResponse.IsSuccess) {
    //                debugger;
    //                this.employeeName = "";
    //                this.employeeCode = "";
    //                this.employeeDesignation = "";
    //                this.dateOfBirth = new Date();
    //                this.email = "";
    //                this.primaryPhone = "";
    //                this.relativeName = "";
    //                this.relativePhoneNumber = "";
    //                this.skypeId = "";
    //                this.joiningDate = new Date();
    //                this.selectedReportEmployee = "";
    //                this.selectedCountry = "";
    //                this.selectedCity = "";
    //                this.password = "";
    //                this.confirmPassword = "";
    //            }
    //            else {
    //                this.errMsg = employeeResponse.Message;
    //            }
    //        }, ErrorResponse => this.errMsg = ErrorResponse);
    //    }
    //}

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
}
