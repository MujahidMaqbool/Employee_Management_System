import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderModule } from 'ngx-order-pipe';
//import { ModalModule } from 'angular2-modal';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ImageCropperModule } from 'ngx-image-cropper';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule, DatepickerModule } from 'ngx-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { SelectDropDownModule } from 'ngx-select-dropdown'
import { NgbModule, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

//********************************** */ EMS components**********************************
//************************************************************************************************ */
//import { GaugeModule } from 'ng2-gauge';
import { AuthGuard } from '../_guards/auth.guard';
import { AppComponent } from './app.component';
import { LoginComponent } from './account/login.component';
import { EmployeesComponent } from './account/Employees.component';
import { DashBoardComponent } from './dashboard/dashboard.component';
import { FiscalLeaveComponent } from './fiscalLeave/fiscalLeave.component';
import { UpdateProfileComponent } from './account/updateProfile.component';
import { PDFReportComponent } from './attendancePDFReport/pdfReport.component';
import { AnualHolidayComponent } from './annualHoliday/annualHoliday.component';
import { EmployeeLeaveComponent } from './employeeLeave/employeeLeave.component';
import { ReimbursementComponent } from './reimbursement/reimbursement.component';
import { AttendanceAdminComponent } from './attendance/attendanceAdmin.component';

import { AttendanceReportComponent } from './attendance/attendanceReport.component';

import { UploadAttendanceFileComponent } from './attendance/uploadAttendanceFile.component';
import { LeaveApplicationComponent } from './leaveApplication/leaveApplicationForm.component';
import { EmployeeAppliedLeaveComponent } from './employeeAppliedLeave/employeeAppliedLeave.component';
import { AttendanceMonthlyStatusComponent } from './attendanceMonthlyStatus/attendanceMonthlyStatus.component';
import { EmployeeAppliedLeaveStatusComponent } from './employeeAppliedLeaveStatus/employeeAppliedLeaveStatus.component';

import { AppliedWorkFromHomeComponent } from './workFromHome/applied-work-from-home/applied-work-from-home.component';
import { MyWorkFromHomeComponent } from './workFromHome/my-work-from-home/my-work-from-home.component';
import { EmployeeAttendanceComponent } from './attendance/employee-attendance/employee-attendance.component';
import { AppliedAttendanceCorrectionComponent } from './attendanceCorrection/applied-attendance-correction/applied-attendance-correction.component';
import { MyAttendanceCorrectionComponent } from './attendanceCorrection/my-attendance-correction/my-attendance-correction.component';

// ******************************services**********************************************************
//************************************************************************************************ */
import { WFHService } from '../services/WFHService';
import { LoginService } from '../services/loginService';
//import { SharedService } from "../services/SharedService";
import { EmployeeService } from '../services/employeeService';
import { DashBoardService } from '../services/dashboardService';
import { UploadFileService } from '../services/uploadfileService';
import { AttendanceService } from '../services/attendanceService';
import { FiscalLeaveService } from '../services/fiscalLeaveService';
import { EmployeeLeaveService } from '../services/employeeLeaveService';
import { ReimbursementService } from '../services/reimbursementService';
import { GetLeaveRequestService } from '../services/getLeaveRequestService';
import { LeaveApplicationService } from '../services/leaveApplicationService';
import { EmployeeAttendanceService } from '../services/employeeAttendanceService';
import { EmployeeAppliedLeaveService } from '../services/employeeAppliedLeaveService';
import { EmployeeRegistrationService } from '../services/employeeRegistrationService';
import { AttendanceCorrectionService } from '../services/attendanceCorrectionService';
import { EmployeeAppliedLeavesStatusService } from '../services/employeeAppliedLeavesStatusService';
import { TruncateStringPipe } from '../services/TruncateStringPipeSevice';
import { AnnualHolidayService } from '../services/annualHolidayService';

import { NgbDateCustomParserFormatter } from './sharedData/dateformat'





@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    EmployeesComponent,
    DashBoardComponent,
    PDFReportComponent,
    FiscalLeaveComponent,
    UpdateProfileComponent,
    ReimbursementComponent,
    EmployeeLeaveComponent,
    AnualHolidayComponent,
    AttendanceAdminComponent,
    LeaveApplicationComponent,
    AttendanceReportComponent,
    UploadAttendanceFileComponent,
    EmployeeAppliedLeaveComponent,
    AttendanceMonthlyStatusComponent,
    EmployeeAppliedLeaveStatusComponent,
    TruncateStringPipe,
    AppliedWorkFromHomeComponent,
    MyWorkFromHomeComponent,
    EmployeeAttendanceComponent,
    AppliedAttendanceCorrectionComponent,
    MyAttendanceCorrectionComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    OrderModule,
    CommonModule,
    BrowserAnimationsModule,
    ImageCropperModule,
    // BootstrapModalModule,
    // ModalModule.forRoot(),
    ToastrModule.forRoot(), // ToastrModule added
    SelectDropDownModule,
    DatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    BsDatepickerModule.forRoot(),
    NgbModule,
    RouterModule.forRoot([
      { path: '', component: DashBoardComponent, canActivate: [AuthGuard] },
      { path: 'login', component: LoginComponent },
      { path: 'dashboard', component: DashBoardComponent, canActivate: [AuthGuard] },
      { path: 'pdfReport', component: PDFReportComponent, canActivate: [AuthGuard] },
      { path: 'Employees', component: EmployeesComponent, canActivate: [AuthGuard] },
      { path: 'Leaves', component: EmployeeLeaveComponent, canActivate: [AuthGuard] },
      { path: 'Report', component: AttendanceReportComponent, canActivate: [AuthGuard] },
      { path: 'fiscalLeave', component: FiscalLeaveComponent, canActivate: [AuthGuard] },
      { path: 'annualHoliday', component: AnualHolidayComponent, canActivate: [AuthGuard] },
      { path: 'Reimbursement', component: ReimbursementComponent, canActivate: [AuthGuard] },
      { path: 'UpdateProfile', component: UpdateProfileComponent, canActivate: [AuthGuard] },

      { path: 'attendance', component: EmployeeAttendanceComponent, canActivate: [AuthGuard] },
      { path: 'MyWorkFromHome', component: MyWorkFromHomeComponent, canActivate: [AuthGuard] },
      { path: 'AppliedWorkFromHome', component: AppliedWorkFromHomeComponent, canActivate: [AuthGuard] },
      { path: 'MyAttendanceCorrection', component: MyAttendanceCorrectionComponent, canActivate: [AuthGuard] },
      { path: 'AppliedAttendanceCorrection', component: AppliedAttendanceCorrectionComponent, canActivate: [AuthGuard] },

      { path: 'AttendanceAdmin', component: AttendanceAdminComponent, canActivate: [AuthGuard] },
      { path: 'leaveApplication', component: LeaveApplicationComponent, canActivate: [AuthGuard] },
      { path: 'AppliedLeaves', component: EmployeeAppliedLeaveComponent, canActivate: [AuthGuard] },
      { path: 'uploadAttendance', component: UploadAttendanceFileComponent, canActivate: [AuthGuard] },

      { path: 'AppliedLeavesStatus', component: EmployeeAppliedLeaveStatusComponent, canActivate: [AuthGuard] },
      { path: 'attendanceMonthlyStatus', component: AttendanceMonthlyStatusComponent, canActivate: [AuthGuard] },
      //{ path: '**', redirectTo: 'login' },

    ])
  ],
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter },
    AuthGuard,
    WFHService,
    LoginService,
    //SharedService,
    EmployeeService,
    DashBoardService,
    AttendanceService,
    UploadFileService,
    FiscalLeaveService,
    AnnualHolidayService,
    EmployeeLeaveService,
    ReimbursementService,
    GetLeaveRequestService,
    LeaveApplicationService,
    EmployeeAttendanceService,
    EmployeeRegistrationService,
    EmployeeAppliedLeaveService,
    AttendanceCorrectionService,
    EmployeeAppliedLeavesStatusService],
  bootstrap: [AppComponent]
})
export class AppModule { }
