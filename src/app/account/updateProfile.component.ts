import { Component, Renderer2, Inject, OnInit, EventEmitter } from '@angular/core';
import { EmployeeRegistrationService } from '../../services/employeeRegistrationService';
import { Location } from '../../model/Location';
import { EmployeeTeam } from '../../model/EmployeeTeam';
import { Employee } from '../../model/Employee';
import { DOCUMENT } from '@angular/platform-browser';
import { EmployeeImages } from '../../model/EmployeeImages';
import { EmployeeProfile } from '../../model/EmployeeProfile';
import { EmployeeDesignation } from '../../model/EmployeeDesignation';
import { Team } from '../../model/Team';
import { Department } from '../../model/Department';
import { ActivatedRoute, Router } from '@angular/router';

import { EmployeePermission } from "../../model/EmployeePermission";
import { EmployeeService } from "../../services/employeeService";
import { Role } from "../../model/Role";

import { ToastrAlertService } from 'src/services/toastr.service';

import { NgbDateCustomParserFormatter, SetDatePickerDate, SetDatePickerDateWithNewDate, getDatePickerDate } from '../sharedData/dateformat'

import { NgbCalendar, NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';


const now = new Date();

@Component({
  selector: 'UpdateProfile',
  templateUrl: './updateProfile.component.template.html',
  outputs: ['UpdateImageEvent'],
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }
  ]
})



export class UpdateProfileComponent implements OnInit {


  model: NgbDateStruct;
  date: { year: number, month: number, day: number };

  errMsg: string = "";
  CountryList = new Array<Location>();
  currentCityList = new Array<Location>();
  permanentCityList = new Array<Location>();
  employeeDesignationList = new Array<EmployeeDesignation>();
  reportingEmployeeList = new Array<Employee>();
  EmployeeImagesList = new Array<EmployeeImages>();
  EmployeeProfile = new EmployeeProfile();
  employeeImage: string = "";
  employeeName: string = "";
  employeeCode: string = "";
  email: string = "";
  primaryPhone: string = "";
  relativeName: string = "";
  relativePhoneNumber: string = "";
  skypeId: string = "";
  dateOfBirth: NgbDateStruct;
  joiningDate: NgbDateStruct = SetDatePickerDateWithNewDate(new Date());

  selectedReportEmployee: string = "";
  selectedCurrentCountry: number = 0;
  selectedCurrentCity: number = 0;
  selectedPermanentCountry: number = 0;
  selectedPermanentCity: number = 0;
  selectedRole: number = 0;
  isDisabled: boolean = false;
  employeeImg: string = "";
  currentAddress: string = "";
  permanentAddress: string = "";
  selectedDesignation: number = 0;
  employeeId: string = "";
  selectedTeamList = new Array();
  employeeAlreadyAddedTeams = new Array();
  teamList = new Array<Team>();
  empTeams = new Array();
  delEmpTeams = new Array();
  searchTeam = '';
  filteredTeamList = new Array();
  teamExist: boolean = false;
  selectedDepartment: number = 0;
  departmentList = new Array<Department>();
  employeeRoleList = new Array<Role>();
  adminViewEmpCode: string = "";
  adminView: boolean = false;
  passwordShowModal: boolean = false;
  oldPassword: string = "";
  newPassword: string = "";
  confirmPassword: string = "";
  oldPwdErrMsg: string = "";
  newPwdErrMsg: string = "";
  ConfPwdErrMsg: string = "";
  employeePassword: string = "";
  pwdValid: boolean = true;
  _employeeCode: string = "";
  oldPwdType: string = "";
  newPwdType: string = "";
  confPwdType: string = "";
  showOldPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfPassword: boolean = false;
  deleteShowModal: boolean = false;
  Loader: boolean = false;
  IsAdmin: boolean = false;
  DeptName: string = "";
  Designation: string = "";
  EmployeeActive: boolean = false;
  ReporToName: string = "";
  public employeePermission = new EmployeePermission();
  imageChangedEvent: any = '';
  croppedImage: any = '';
  employeeShortName: string = '';
  ImageValidator: boolean = false;
  cropImageModal: boolean = false;
  EmployeeRoleName: string = "";
  ShowPassbtn: boolean = true;
  employeeSerialNumber: string = "";
  isSuperAdmin: boolean = false;


  constructor(private _employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute,
    private _employeeRegistrationService: EmployeeRegistrationService,
    private _renderer2: Renderer2, @Inject(DOCUMENT) private _document: any,

    private _toastrAlertService: ToastrAlertService,
    private calendar: NgbCalendar

  ) {

  }

  ngOnInit() {

    this.GetEmployeeProfile();

    let permissions = JSON.parse(localStorage.getItem('EmployeePermission'));
    if (permissions.SuperAdmin) {
      this.isSuperAdmin = permissions.SuperAdmin;
    }

  }


  fileChangeEvent(event: any): void {

    var type = event.target.value.split('.');

    if (type[1] != null) {
      if (type[1] == 'jpeg' || type[1] == 'png' || type[1] == 'jpg' || type[1] == 'PNG' || type[1] == 'JPG' || type[1] == 'JPEG') {
        this.ImageValidator = false;
      }
      else {
        this.ImageValidator = true;
      }
    }

    this.imageChangedEvent = event;
  }

  imageCropped(image: string) {
    this.croppedImage = image;
    this.employeeImg = this.croppedImage;
  }

  imageLoaded() {
    // show cropper
  }

  loadImageFailed() {
    // show message
  }

  UpdateImageEvent = new EventEmitter<boolean>();



  onChangejoiningDate(date: NgbDateStruct) {
    // debugger
    // this.joiningDate = date;
    // console.log('==> ' + JSON.stringify(date));
  }




  RemoveTeam(team: any) {
    for (let i = 0; i < this.employeeAlreadyAddedTeams.length; i++) {
      if (team["TeamId"] == this.employeeAlreadyAddedTeams[i]["TeamId"]) {
        var empTeam = new EmployeeTeam();
        empTeam.TeamId = team["TeamId"];
        this.delEmpTeams.push(empTeam);
        break;
      }
    }
    this.selectedTeamList.splice(this.selectedTeamList.indexOf(team), 1);
  }

  GetRoles() {
    this._employeeService.getEmployeesRole(JSON.parse(localStorage.getItem('AuthToken') || ''))
      .subscribe(roleResponse => {
        if (roleResponse.IsSuccess) {
          this.employeeRoleList = roleResponse.RoleResult;
          if (this.EmployeeProfile.RoleId > 0) {

            this.EmployeeRoleName = this.employeeRoleList.filter(i => i.RoleId == this.EmployeeProfile.RoleId)[0].Role;

          }
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
          this.teamList = teamResponse.TeamResult;
        }
        else {
          this.errMsg = teamResponse.Message;
        }
      }, ErrorResponse => this.errMsg = ErrorResponse);
  }

  FilterTeam() {
    if (this.searchTeam !== "") {
      var strSearchTeam = this.searchTeam.toLocaleLowerCase();
      this.filteredTeamList = this.teamList.filter(function (el: any) {
        return el.TeamName.toLowerCase().indexOf(strSearchTeam) > -1;
      }.bind(this));
    }
    else {
      this.filteredTeamList = [];
    }
  }

  SelectedTeam(team: any) {
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

  GetDepartments() {
    this._employeeRegistrationService.GetDepartments(JSON.parse(localStorage.getItem('AuthToken') || ''))
      .subscribe(departmentResponse => {
        if (departmentResponse.IsSuccess) {
          this.departmentList = departmentResponse.DepartmentResult;
          if (this.EmployeeProfile.DeptId > 0) {
            this.DeptName = this.departmentList.filter(i => i.DeptId == this.EmployeeProfile.DeptId)[0].DeptName;
          }
        }
        else {
          this.errMsg = departmentResponse.Message;
        }
      }, ErrorResponse => this.errMsg = ErrorResponse);
  }

  GetEmployeeDesignations() {
    this._employeeRegistrationService.GetEmployeeDesignations(JSON.parse(localStorage.getItem('AuthToken') || ''))
      .subscribe(employeeResponse => {
        if (employeeResponse.IsSuccess) {
          this.employeeDesignationList = employeeResponse.EmployeeDesignationResult;
          if (this.EmployeeProfile.DesignationId > 0) {
            this.Designation = this.employeeDesignationList.filter(i => i.DesignationId == this.EmployeeProfile.DesignationId)[0].Designation;
          }
        }
        else {
          this.errMsg = employeeResponse.Message;
        }
      }, ErrorResponse => this.errMsg = ErrorResponse);
  }

  GetReportingtoEmployeeList() {
    this._employeeService.getAllEmployees(JSON.parse(localStorage.getItem('AuthToken') || ''))
      .subscribe(employeeResponse => {
        if (employeeResponse.IsSuccess) {
          this.reportingEmployeeList = employeeResponse.EmployeeResult;
          if (this.EmployeeProfile.ReportTo != '' || this.EmployeeProfile.ReportTo != null || this.EmployeeProfile.ReportTo != undefined) {

            var reportTo = this.reportingEmployeeList.filter(i => i.EmployeeId == this.EmployeeProfile.ReportTo);
            if (reportTo != null && reportTo.length > 0)
              this.ReporToName = reportTo[0].EmployeeName;
          }
        }
        else {
          this.errMsg = employeeResponse.Message;
        }
      }, ErrorResponse => this.errMsg = ErrorResponse);
  }

  GetCountries() {
    this._employeeRegistrationService.GetCountries(JSON.parse(localStorage.getItem('AuthToken') || ''))
      .subscribe(employeeResponse => {
        if (employeeResponse.IsSuccess && employeeResponse.LocationResult != null) {
          this.CountryList = employeeResponse.LocationResult;
        }
        else {
          this.errMsg = employeeResponse.Message;
        }
      }, ErrorResponse => this.errMsg = ErrorResponse);
  }

  //GetCities() {
  //    this._employeeRegistrationService.GetCities(JSON.parse(localStorage.getItem('AuthToken') || ''))
  //        .subscribe(employeeResponse => {
  //            if (employeeResponse.IsSuccess) {
  //                this.currentCityList = employeeResponse.LocationResult;
  //                this.permanentCityList = employeeResponse.LocationResult;
  //            }
  //            else {
  //                this.errMsg = employeeResponse.Message;
  //            }
  //        }, ErrorResponse => this.errMsg = ErrorResponse);
  //}

  OpenCropImagePopUp() {
    this.ImageValidator = false;
    this.cropImageModal = true;
  }

  CloseCropImagePopUp() {
    this.cropImageModal = false;
  }

  Delete() {
    var Status: boolean = false;
    if (!this.EmployeeActive) {
      Status = true;
    }
    this._employeeRegistrationService.DeleteEmployee(this.employeeId, Status, JSON.parse(localStorage.getItem('AuthToken') || ''))
      .subscribe(employeeResponse => {
        if (employeeResponse.IsSuccess) {
          this.router.navigate(['/Employees']);
        }
        else {
          this.errMsg = employeeResponse.Message;
        }
      }, ErrorResponse => this.errMsg = ErrorResponse);
  }

  GetCurrentCitiesByCountry(countryId: number, type: string) {
    if (countryId > 0 && countryId != undefined) {
      this._employeeRegistrationService.GetCitiesByCountry(countryId, JSON.parse(localStorage.getItem('AuthToken') || ''))
        .subscribe(employeeResponse => {
          if (employeeResponse.IsSuccess) {
            this.currentCityList = employeeResponse.LocationResult;
            if (type == "true") { }
            else {
              this.selectedCurrentCity = 0;
            }
          }
          else {
            this.errMsg = employeeResponse.Message;
          }
        }, ErrorResponse => this.errMsg = ErrorResponse);
    }
  }

  GetPermenentCitiesByCountry(countryId: number, type: string) {
    if (countryId > 0 && countryId != undefined) {
      this._employeeRegistrationService.GetCitiesByCountry(countryId, JSON.parse(localStorage.getItem('AuthToken') || ''))
        .subscribe(employeeResponse => {
          if (employeeResponse.IsSuccess) {
            this.permanentCityList = employeeResponse.LocationResult;
            if (type == "true") { }
            else {
              this.selectedPermanentCity = 0;
            }
          }
          else {
            this.errMsg = employeeResponse.Message;
          }
        }, ErrorResponse => this.errMsg = ErrorResponse);
    }
  }

  GetEmployeeProfile() {
    this.Loader = true;

    this._employeeCode = JSON.parse(localStorage.getItem('EmployeeCode') || '');
    this.adminViewEmpCode = this.route.snapshot.params['EmployeeCode'];

    if (this.adminViewEmpCode != undefined) {
      this.ShowPassbtn = false;
    }
    this.adminView = this.route.snapshot.params['AdminView'];
    this._employeeCode = this.adminViewEmpCode != undefined ? this.adminViewEmpCode : this._employeeCode;
    this._employeeRegistrationService.GetEmployeeProfile(this._employeeCode, JSON.parse(localStorage.getItem('AuthToken') || ''))
      .subscribe(employeeResponse => {
        if (employeeResponse.IsSuccess) {

          this.EmployeeProfile = employeeResponse.EmployeeResult
          this.EmployeeImagesList = employeeResponse.EmployeeResult.EmployeeImages
          this.employeeImage = "";

          if (this.EmployeeImagesList.length > 0) {
            this.employeeImg = this.EmployeeImagesList[0].ImageUrl;// += '?random+\=' + Math.random();
            this.employeeImg = this.employeeImg.replace("content/i", "assets/I");
          }
          else {
            this.employeeImg = "../../assets/Images/default-img.png";
          }

          if (this.adminViewEmpCode == undefined) {
            localStorage.removeItem("EmployeeImage");
            localStorage.setItem("EmployeeImage", JSON.stringify(this.employeeImg));
          }

          this.UpdateImageEvent.emit(true);

          this.employeeId = this.EmployeeProfile.EmployeeId;
          this.employeeName = this.EmployeeProfile.EmployeeName;
          this.employeeShortName = this.EmployeeProfile.ShortName;
          this.employeeCode = this.EmployeeProfile.EmployeeCode;
          this.selectedDesignation = this.EmployeeProfile.DesignationId;

          if (this.EmployeeProfile.DateOfBirth != null) {
            this.dateOfBirth = SetDatePickerDate(this.EmployeeProfile.DateOfBirth);
          }
          debugger
          // != null ? this.EmployeeProfile.DateOfBirth : new Date();
          this.email = this.EmployeeProfile.Email;
          this.primaryPhone = this.EmployeeProfile.PrimaryPhone;
          this.relativeName = this.EmployeeProfile.RelativeName;
          this.relativePhoneNumber = this.EmployeeProfile.RelativePhoneNumber;
          this.skypeId = this.EmployeeProfile.SkypeId;
          this.joiningDate = SetDatePickerDate(this.EmployeeProfile.JoiningDate);
          this.selectedCurrentCountry = this.EmployeeProfile.CurrentCountryId;
          if (this.selectedCurrentCountry > 0) {
            this.GetCurrentCitiesByCountry(this.selectedCurrentCountry, "true");
          }
          this.selectedCurrentCity = this.EmployeeProfile.CurrentCityId;
          this.selectedRole = this.EmployeeProfile.RoleId;
          this.selectedPermanentCountry = this.EmployeeProfile.PermanentCountryId;
          if (this.selectedPermanentCountry > 0) {
            this.GetPermenentCitiesByCountry(this.selectedPermanentCountry, "true");
          }
          this.selectedPermanentCity = this.EmployeeProfile.PermanentCityId;
          this.currentAddress = this.EmployeeProfile.CurrentAddress;
          this.permanentAddress = this.EmployeeProfile.PermanentAddress;
          this.selectedReportEmployee = this.EmployeeProfile.ReportTo;
          this.employeePassword = this.EmployeeProfile.Password;

          this.selectedTeamList = [];
          for (let i = 0; i < this.EmployeeProfile.EmployeeTeams.length; i++) {
            this.selectedTeamList.push(this.EmployeeProfile.EmployeeTeams[i]);
          }

          this.employeeAlreadyAddedTeams = this.EmployeeProfile.EmployeeTeams;
          this.employeeSerialNumber = this.EmployeeProfile.SerialNumber;
          this.selectedDepartment = this.EmployeeProfile.DeptId;
          this.isDisabled = this.adminViewEmpCode != undefined ? false : true;
          this.EmployeeActive = this.EmployeeProfile.IsActive;
          this.GetEmployeeDesignations();
          this.GetDepartments();
          this.GetReportingtoEmployeeList();
          this.employeePermission = JSON.parse(localStorage.getItem("EmployeePermission") || '{}');
          if (this.employeePermission.SuperAdmin) {
            this.IsAdmin = true;
            this.isDisabled = false;
          }

          //this.GetReportingtoEmployeeList();
          this.GetRoles();


          this.GetTeams();
          //this.GetEmployeeDesignations();
          //this.GetDepartments();
          this.GetCountries();


          this.Loader = false;
        }
        else {
          this.Loader = false;
          this.errMsg = employeeResponse.Message;
        }
      }, ErrorResponse => this.errMsg = ErrorResponse);
  }


  isNumber(evt: any) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  UpdateEmployee() {
    debugger
    this.Loader = true;
    var employee = new Employee();

    if (!this.isDisabled) {
      for (let i = 0; i < this.selectedTeamList.length; i++) {
        var empTeam = new EmployeeTeam();
        empTeam.TeamId = this.selectedTeamList[i].TeamId;
        this.empTeams.push(empTeam);
      }
    }
    employee.DeptId = this.selectedDepartment;
    employee.ShortName = this.employeeShortName;
    employee.EmployeeName = this.employeeName;
    employee.EmployeeCode = this.employeeCode;
    employee.DesignationId = this.selectedDesignation;
    employee.Email = this.email;
    employee.SkypeId = this.skypeId;
    employee.JoiningDate = new Date(getDatePickerDate(this.joiningDate));
    employee.ReportTo = this.selectedReportEmployee;
    employee.EmployeeId = this.EmployeeProfile.EmployeeId;
    employee.PrimaryPhone = this.primaryPhone;
    employee.RelativeName = this.relativeName;
    employee.RoleId = this.selectedRole;
    employee.RelativePhoneNumber = this.relativePhoneNumber;
    employee.ImageBase64String = this.employeeImg;
    employee.DateOfBirth = new Date(getDatePickerDate(this.dateOfBirth));
    employee.CurrentAddress = this.currentAddress;
    employee.PermanentAddress = this.permanentAddress;
    employee.CurrentCityId = this.selectedCurrentCity;
    employee.CurrentCountryId = this.selectedCurrentCountry;
    employee.PermanentCityId = this.selectedPermanentCity;
    employee.PermanentCountryId = this.selectedPermanentCountry;
    employee.DeletedTeams = this.delEmpTeams;
    employee.EmployeeTeams = this.empTeams;
    employee.AdminView = this.isDisabled;
    employee.SerialNumber = this.employeeSerialNumber;

    this._employeeRegistrationService.SaveNewEmployee(employee, JSON.parse(localStorage.getItem('AuthToken') || '')).subscribe(employeeResponse => {
      if (employeeResponse.IsSuccess) {
        debugger
        this.empTeams = [];
        if (!this.isDisabled) {
          var employeeCode = JSON.parse(localStorage.getItem('EmployeeCode'));

          if (employeeCode == employee.EmployeeCode) {
            this._toastrAlertService.Alert_Success("Profile updated");
            this.GetEmployeeProfile();
          } else {
            this.router.navigate(['/Employees']);
          }
        }
        else {
          //this.Loader = false;
          this._toastrAlertService.Alert_Success("Profile updated");
          this.GetEmployeeProfile();
          //window.location.reload();
        }
      }
      else {
        this.Loader = false;
        this.errMsg = employeeResponse.Message;
      }
    }, ErrorResponse => this.errMsg = ErrorResponse);
  }

  OpenPasswordPopUp() {
    this.oldPassword = "";
    this.newPassword = "";
    this.confirmPassword = "";
    this.OldPwdChange();
    this.NewPwdChange();
    this.ConfPwdChange();
    this.oldPwdType = "password";
    this.newPwdType = "password";
    this.confPwdType = "password";
    //this.showOldPassword = false;
    //this.showNewPassword = true;
    //this.showConfPassword = true;
    this.passwordShowModal = true;
  }

  ClosePasswordPopUp() {
    this.passwordShowModal = false;
  }

  OldPwdChange() {
    this.oldPwdErrMsg = "";
    this.pwdValid = true;;
  }

  NewPwdChange() {
    this.newPwdErrMsg = "";
    this.pwdValid = true;;
  }

  ConfPwdChange() {
    this.ConfPwdErrMsg = "";
    this.pwdValid = true;;
  }

  ChangeEmployeePassword() {
    if (this.oldPassword == "" && !this.IsAdmin) {
      this.oldPwdErrMsg = "Old password is required";
      this.pwdValid = false;
    }
    if (this.oldPassword != this.employeePassword && this.oldPassword != "" && !this.IsAdmin) {
      this.oldPwdErrMsg = "Old password is invalid";
      this.pwdValid = false;
    }
    if (this.newPassword == "") {
      this.newPwdErrMsg = "New password is required";
      this.pwdValid = false;
    }
    if (this.confirmPassword == "") {
      this.ConfPwdErrMsg = "Confirm password is required";
      this.pwdValid = false;
    }
    if (this.newPassword != this.confirmPassword && (this.newPassword != "" && this.confirmPassword != "")) {
      this.newPwdErrMsg = "Passwords do not match";
      this.ConfPwdErrMsg = "Passwords do not match";
      this.pwdValid = false;
    }
    if (this.pwdValid) {

      var employeeCode: string = "";
      if (this.adminViewEmpCode != "" && this.adminViewEmpCode != null && this.adminViewEmpCode != undefined) {
        employeeCode = this.adminViewEmpCode;
      } else {
        employeeCode = this._employeeCode;
      }
      this._employeeRegistrationService.ChangeEmployeePassword(employeeCode, this.newPassword, JSON.parse(localStorage.getItem('AuthToken') || ''))
        .subscribe(employeeResponse => {
          if (employeeResponse.IsSuccess) {
            this.passwordShowModal = false;
            this._toastrAlertService.Alert_Success("Password changed successfully.");
          }
          else {
            this._toastrAlertService.Alert_Error(employeeResponse.Message);
            //this.errMsg = employeeResponse.Message;
          }
        }, ErrorResponse => this.errMsg = ErrorResponse);
    }
  }

  ToggleOldPassword() {
    this.showOldPassword = !this.showOldPassword;
    if (this.showOldPassword) {
      this.oldPwdType = "text";
    }
    else {
      this.oldPwdType = "password";
    }
  }

  ToggleNewPassword() {
    this.showNewPassword = !this.showNewPassword;
    if (this.showNewPassword) {
      this.newPwdType = "text";
    }
    else {
      this.newPwdType = "password";
    }
  }

  ToggleConfPassword() {
    this.showConfPassword = !this.showConfPassword;
    if (this.showConfPassword) {
      this.confPwdType = "text";
    }
    else {
      this.confPwdType = "password";
    }
  }

  OpenDeletePopUp() {
    this.deleteShowModal = true;

  }

  CloseDeletePopUp() {
    this.deleteShowModal = false;

  }


}
