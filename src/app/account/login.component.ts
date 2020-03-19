import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Employee } from '../../model/Employee';
import { LoginResponse } from '../../model/LoginResponse';
import { LoginService } from '../../services/loginService';
import { EmployeePermission } from '../../model/EmployeePermission';

@Component({
    selector: 'login',
    templateUrl: './login.component.template.html',
    outputs: ['AutenticatedEvent']
})


export class LoginComponent {

    public Loader: boolean = false;
    public Email: string = "";
    public errMsg: string = "";
    public UserName: string = "";
    public Password: string = "";
    public showResetPwd: boolean = false;
    public employee = new Employee();
    public invalidEmailErrorMsg: string = "";
    public LoginResponse = new LoginResponse();
    AutenticatedEvent = new EventEmitter<boolean>();
    public EmployeePermission = new Array<EmployeePermission>();

    constructor(private router: Router,
        private _loginService: LoginService
    ) { }

    ngOnInit() {
    }

    login() {
        this.Loader = true;
        this._loginService.LoginUser(this.UserName, this.Password)
            .subscribe(LoginUserServiceResponse => {
                this.LoginResponse = LoginUserServiceResponse
                if (this.LoginResponse.IsSuccess) {
                    debugger
                    localStorage.clear();
                    localStorage.setItem("EmployeePermission", JSON.stringify(this.LoginResponse.EmployeePermission));
                    localStorage.setItem("AuthToken", JSON.stringify(this.LoginResponse.AuthToken));
                    localStorage.setItem("EmployeeName", JSON.stringify(this.LoginResponse.Name));
                    localStorage.setItem("EmployeeImage", JSON.stringify(this.LoginResponse.Image));
                    localStorage.setItem("EmployeeCode", JSON.stringify(this.LoginResponse.EmployeeCode));
                    localStorage.setItem("EmployeeId", JSON.stringify(this.LoginResponse.EmployeeId));
                    this.AutenticatedEvent.emit(true);
                    //  this.router.navigate(['/dashboard']);
                }
                else {
                    this.Loader = false;
                    this.errMsg = "Invalid username or password";
                }
            },
                resEmployeeError => this.errMsg = resEmployeeError);
    }

    ResetPassword() {
        //this.showResetPwd = true;
        if (this.Email == "") {
            this.invalidEmailErrorMsg = "Email is required";
        }
        else {
            this.Loader = true;
            this._loginService.ResetPassword(this.Email, JSON.parse(localStorage.getItem('AuthToken') || ''))
                .subscribe(LoginResponse => {
                    if (LoginResponse.IsSuccess) {
                        this.employee = LoginResponse.EmployeeResult;
                        if (this.employee == null) {
                            this.Loader = true;
                            this.invalidEmailErrorMsg = LoginResponse.Message;
                        }
                        else {
                            this.Email = "";
                            this.Loader = true;
                            this.invalidEmailErrorMsg = "Password has been reset. Check your email";
                        }
                    }
                    else {
                        this.Loader = true;
                        this.errMsg = LoginResponse.Message;
                    }
                }, ErrorResponse => this.errMsg = ErrorResponse);
        }
    }

    LoginPage() {
        this.showResetPwd = false;
        this.invalidEmailErrorMsg = "";
        this.Email = "";
        this.router.navigate(['/login']);
    }

    OnChangeEmail() {
        this.invalidEmailErrorMsg = "";
    }
}