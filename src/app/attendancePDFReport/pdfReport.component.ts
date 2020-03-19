import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrAlertService } from 'src/services/toastr.service';
import { EmployeeReport } from '../../model/EmployeeReport';
import { AttendanceService } from '../../services/attendanceService';
import { AttendanceSummaryPDF } from "../../model/AttedndanceSummaryPDF";
import { AttendancePDF } from "../../model/AttendancePDF";
//import * as jsPDF from 'jspdf';
declare var jsPDF: any;


@Component({
    selector: 'pdfReport',
    templateUrl: './pdfReport.component.template.html',
    providers: [
        { provide: 'Window', useValue: window }
    ]
})

export class PDFReportComponent implements OnInit {

    date: Date = new Date();
    month: any = [];

    SelectMonth: any;
    AttedndancePDFModel = new Array<AttendancePDF>();
    AttedndanceSummaryPDFModel = new Array<AttendanceSummaryPDF>();
    FromDate: Date = new Date();
    ToDate: Date = new Date();
    TotalAttendedDays: Number = 0;
    TotalRequiredHours: Number = 0;
    errMsg: string = "";
    Loader: boolean = false;

    months: any = [
        'January', 'February', 'March', 'April', 'May',
        'June', 'July', 'August', 'September',
        'October', 'November', 'December'
    ];

    constructor(@Inject('Window') private window: Window,
        private router: Router,
        private _toastrAlertService: ToastrAlertService,
        private _attendanceService: AttendanceService) {

    }

    ngOnInit() {
        this.getMonthName(this.date.getMonth());
        //var d = new Date(this.date.getFullYear(), this.date.getMonth() - 1, 1);
        //this.SelectMonth = d.getMonth();
        //this.getMonthValue();
        //setTimeout(() => { this.GernateAttendancePDF(); }, 1000);
    }

    getMonthName(monthNumber: number) {

        var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        var today = new Date();

        var d;

        for (var i = 6; i > 0; i -= 1) {

            d = new Date(today.getFullYear(), today.getMonth() + 1 - i, 1);

            var abc: any = {
                MonthName: monthNames[d.getMonth()],
                Id: d.getMonth()
            }

            this.month.push(abc);
        }

        this.month.reverse();
    }

    getMonthValue() {
        debugger
        var firstDay = new Date(this.ToDate.getFullYear(), this.SelectMonth + 1, 1);
        var lastDay = new Date(this.ToDate.getFullYear(), this.SelectMonth + 1 + 1, 0);
        var d = new Date();
        if (d.getMonth() < firstDay.getMonth()) {

            var firstyear = firstDay.getFullYear();
            var firstmonth = firstDay.getMonth();
            var firstday = firstDay.getDate();
            this.FromDate = new Date(firstyear - 1, firstmonth, firstday)

            var lastyear = lastDay.getFullYear();
            var lastmonth = lastDay.getMonth();
            var lastday = lastDay.getDate();
            this.ToDate = new Date(lastyear - 1, lastmonth, lastday)
        }
        else {
            this.FromDate = firstDay;
            this.ToDate = lastDay;
        }
        this.onMonthChange(4);
    }

    onMonthChange(selectMonth: any) {

        if (selectMonth != '') {
            this.SelectMonth = selectMonth;
            var firstDay = new Date(this.ToDate.getFullYear(), Number(selectMonth), 1);
            var lastDay = new Date(this.ToDate.getFullYear(), Number(selectMonth) + 1, 0);
            var d = new Date();
            if (d.getMonth() < firstDay.getMonth()) {

                var firstyear = firstDay.getFullYear();
                var firstmonth = firstDay.getMonth();
                var firstday = firstDay.getDate();
                this.FromDate = new Date(firstyear - 1, firstmonth, firstday)

                var lastyear = lastDay.getFullYear();
                var lastmonth = lastDay.getMonth();
                var lastday = lastDay.getDate();
                this.ToDate = new Date(lastyear - 1, lastmonth, lastday)
            }
            else {
                this.FromDate = firstDay;
                this.ToDate = lastDay;
            }
        }
        else {
            this.SelectMonth = undefined;
        }
    }

    GernateAttendancePDF() {
        this.Loader = true;
        if (this.SelectMonth == undefined) {
            this._toastrAlertService.Alert_Error("Please select month");
            this.Loader = false;
        } else {
            var employeeReport = new EmployeeReport();

            employeeReport.FromDate = this.FromDate;
            employeeReport.ToDate = this.ToDate;

            this._attendanceService.GetEmployeeAttendancePDF(employeeReport, JSON.parse(localStorage.getItem('AuthToken') || '')).subscribe(employeeAttendancePDFResponse => {
                if (employeeAttendancePDFResponse.IsSuccess) {
                    debugger;
                    this.AttedndancePDFModel = employeeAttendancePDFResponse.EmployeeAttendancePDFResult;
                    this.downloadAttendance();
                    this.Loader = false;
                }
                else { }
            }, ErrorResponse => this.errMsg = ErrorResponse);
        }
    }

    downloadAttendance() {
        var monthName = this.monthNumToName(this.SelectMonth);
        var doc = new jsPDF('p', 'pt');

        for (let i = 0; i < this.AttedndancePDFModel.length; i++) {

            var lMargin = 20; //left margin in mm
            var rMargin = 15; //right margin in mm
            var pdfInMM = 210;  // width of A4 in mm
            var topMargin = 0;

            // Name
            var username = "Name: " + this.AttedndancePDFModel[i].EmployeeName;
            var linesusername = doc.splitTextToSize(username, (pdfInMM - lMargin - rMargin));
            doc.setFontSize(12);
            var topMargin = topMargin + 40;
            doc.text(lMargin, topMargin, linesusername);

            // designation
            var designation = "Designation: " + this.AttedndancePDFModel[i].EmployeeDesignation;
            var linesdesignation = doc.splitTextToSize(designation, (pdfInMM - lMargin - rMargin));
            doc.setFontSize(12);
            var topMargin = topMargin + 15;
            doc.text(lMargin, topMargin, designation);

            var columns = ['Date', 'Check In', 'Check Out', 'Required Hours', 'Hours in Office', 'Remarks'];
            var rows = [];
            for (let j = 0; j < this.AttedndancePDFModel[i].EmployeeAttendance.length; j++) {

                var date = this.formatDate(this.AttedndancePDFModel[i].EmployeeAttendance[j].Date);

                var RequiredHours: string = '-';

                if (this.AttedndancePDFModel[i].EmployeeAttendance[j].RequiredHours != '') {
                    RequiredHours = this.AttedndancePDFModel[i].EmployeeAttendance[j].RequiredHours;
                }

                rows.push([
                    date,
                    this.AttedndancePDFModel[i].EmployeeAttendance[j].ActualTimeIn,
                    this.AttedndancePDFModel[i].EmployeeAttendance[j].ActualTimeOut,
                    RequiredHours,
                    this.AttedndancePDFModel[i].EmployeeAttendance[j].ActualHour,
                    this.AttedndancePDFModel[i].EmployeeAttendance[j].Remarks
                ]);
            }

            doc.autoTable(columns, rows, {
                margin: { top: 70, left: 20, right: 20, bottom: 0 },
                drawHeaderCell: function (cell: any, data: any) {
                    cell.styles.textColor = 255;
                    cell.styles.fontSize = 8;
                }
            });

            //Required hours
            var requiredHoues = "Required hours: " + this.AttedndancePDFModel[i].RequiredHours;
            var linesrequiredHoues = doc.splitTextToSize(requiredHoues, (pdfInMM - lMargin - rMargin));
            doc.setFontSize(11);
            var topMargin = 780;
            doc.text(lMargin, topMargin, linesrequiredHoues);

            // Attendance hours
            var attendanceHours = "Attendance hours: " + this.AttedndancePDFModel[i].HoursinOffice;
            var linesdesignation = doc.splitTextToSize(attendanceHours, (pdfInMM - lMargin - rMargin));
            doc.setFontSize(11);
            var topMargin = 790;
            doc.text(lMargin, topMargin, linesdesignation);

            // difference 
            var diff: number = 0;
            diff = this.AttedndancePDFModel[i].RequiredHours - this.AttedndancePDFModel[i].HoursinOffice;
            var difference = "Difference: " + diff;
            var linesdifference = doc.splitTextToSize(difference, (pdfInMM - lMargin - rMargin));
            doc.setFontSize(11);
            var topMargin = 800;
            doc.text(lMargin, topMargin, linesdifference);

            // deduction 
            var deduct: number = 0;
            if (Number(diff) > 4) {
                deduct = Math.abs(diff / 8);
            }
            var deduction = "Deduction: " + deduct;
            var linesdeduction = doc.splitTextToSize(deduction, (pdfInMM - lMargin - rMargin));
            doc.setFontSize(11);
            var topMargin = 810;
            doc.text(lMargin, topMargin, linesdeduction);

            // compensation 
            var compensation = "Compensation: " + this.AttedndancePDFModel[i].Compensation;
            var linescompensation = doc.splitTextToSize(compensation, (pdfInMM - lMargin - rMargin));
            doc.setFontSize(11);
            var topMargin = 820;
            doc.text(lMargin, topMargin, linescompensation);

            doc.addPage();
        }

        var _date = new Date();
        var fileName = monthName + ' Attendance' + _date.getTime() + '.pdf';

        doc.save(fileName);
    }

    GernateAttendanceSummaryPDF() {
        this.Loader = true;
        if (this.SelectMonth == undefined) {
            this._toastrAlertService.Alert_Error("Please select month");
            this.Loader = false;
        } else {
            var employeeReport = new EmployeeReport();

            employeeReport.FromDate = this.FromDate;
            employeeReport.ToDate = this.ToDate;

            this._attendanceService.GetEmployeeAttendanceSummaryPDF(employeeReport, JSON.parse(localStorage.getItem('AuthToken') || '')).subscribe(employeeAttendancePDFResponse => {
                if (employeeAttendancePDFResponse.IsSuccess) {
                    debugger;
                    this.AttedndanceSummaryPDFModel = employeeAttendancePDFResponse.EmployeeAttendanceSummaryPDFResult;
                    this.TotalAttendedDays = employeeAttendancePDFResponse.TotalAttendedDays;
                    this.TotalRequiredHours = employeeAttendancePDFResponse.TotalRequiredHours;
                    this.downloadAttendanceSummary();
                    this.Loader = false;
                }
                else { }
            }, ErrorResponse => this.errMsg = ErrorResponse);
        }
    }

    downloadAttendanceSummary() {
        var monthName = this.monthNumToName(this.SelectMonth);
        debugger
        var doc = new jsPDF('l', 'mm', 'a4');

        var lMargin = 10; //left margin in mm
        var rMargin = 10; //right margin in mm
        var pdfInMM = 210;  // width of A4 in mm
        var topMargin = 0;

        // Name
        var username = monthName + " Attendance Summary Of Employees";
        var linesusername = doc.splitTextToSize(username, (pdfInMM - lMargin - rMargin));
        doc.setFontSize(18);
        var topMargin = topMargin + 10;
        doc.text(lMargin, topMargin, linesusername);

        // designation
        var designation = "Total Attended Days: " + this.TotalAttendedDays + "     Total Required Hours: " + this.TotalRequiredHours;
        var linesdesignation = doc.splitTextToSize(designation, (pdfInMM - lMargin - rMargin));
        doc.setFontSize(12);
        var topMargin = 17;
        doc.text(lMargin, topMargin, designation);

        var columns = ['Name', 'Days Attended', 'Required Hours', 'Hours In Office', 'Leaves', 'WFH', 'Compensation', 'Difference', 'Deduction'];
        var rows = [];
        for (let i = 0; i < this.AttedndanceSummaryPDFModel.length; i++) {
            var diff: number = 0;
            diff = this.AttedndanceSummaryPDFModel[i].RequiredHours - this.AttedndanceSummaryPDFModel[i].HoursinOffice;

            var deduct: number = 0;
            if (Number(diff) > 4) {
                deduct = Math.abs(diff / 8);
            }

            rows.push([
                //this.AttedndanceSummaryPDFModel[i].EmployeeCode,
                this.AttedndanceSummaryPDFModel[i].EmployeeName,
                this.AttedndanceSummaryPDFModel[i].AttendedDays,
                this.AttedndanceSummaryPDFModel[i].RequiredHours,
                this.AttedndanceSummaryPDFModel[i].HoursinOffice,
                this.AttedndanceSummaryPDFModel[i].Absents,
                this.AttedndanceSummaryPDFModel[i].WFH,
                this.AttedndanceSummaryPDFModel[i].Compensation,
                diff,
                deduct,
            ]);
        }

        doc.autoTable(columns, rows, {
            margin: { top: 20, left: 10, right: 10, bottom: 0 },
            drawHeaderCell: function (cell: any, data: any) {
                cell.styles.textColor = 255;
                cell.styles.fontSize = 9;
            }
            //}, columnStyles: {
            //    0: { columnWidth: 36 },
            //    1: { columnWidth: 100 },
            //    2: { columnWidth: 65 },
            //    3: { columnWidth: 80 },
            //    4: { columnWidth: 80 },
            //    5: { columnWidth: 40 },
            //    6: { columnWidth: 30 },
            //    7: { columnWidth: 70 },
            //    8: { columnWidth: 50 },
            //    9: { columnWidth: 70 },
            //}
        });


        var _date = new Date();
        var fileName = monthName + ' Attendance Summary' + _date.getTime() + '.pdf';
        doc.save(fileName);
    }

    formatDate(date: any) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [day, month, year].join('-');
    }

    monthNumToName(monthnum: any) {
        return this.months[monthnum] || '';
    }



    //download() {
    //    var doc = new jsPDF('p', 'pt');
    //    for (let i = 0; i < this.AttedndancePDFSummaryModel.length; i++) {

    //        doc.text(20, 20, 'Name: ' + this.AttedndancePDFSummaryModel[i].EmployeeName + ' Required Hour: ' + this.AttedndancePDFSummaryModel[i].RequiredHours + ' Hour in  office: ' + this.AttedndancePDFSummaryModel[i].HoursinOffice);

    //        var columns = ['Date', 'Check In', 'Check Out', 'Required Hours', 'Hours in Office', 'Remarks'];
    //        var rows = [];
    //        for (let j = 0; j < this.AttedndancePDFSummaryModel[i].EmployeeAttendance.length; j++) {

    //            var date = this.formatDate(this.AttedndancePDFSummaryModel[i].EmployeeAttendance[j].Date);

    //            var remarks: string = '-';

    //            if (this.AttedndancePDFSummaryModel[i].EmployeeAttendance[j].Remarks != '') {
    //                var remarks = this.AttedndancePDFSummaryModel[i].EmployeeAttendance[j].Remarks;
    //            }

    //            rows.push([
    //                date,
    //                this.AttedndancePDFSummaryModel[i].EmployeeAttendance[j].ActualTimeIn,
    //                this.AttedndancePDFSummaryModel[i].EmployeeAttendance[j].ActualTimeOut,
    //                this.AttedndancePDFSummaryModel[i].EmployeeAttendance[j].StandardHour,
    //                this.AttedndancePDFSummaryModel[i].EmployeeAttendance[j].ActualHour,
    //                remarks
    //            ]);

    //        }

    //        doc.autoTable(columns, rows, {
    //            margin: { top: 50, left: 20, right: 20, bottom: 0 },
    //            drawHeaderCell: function (cell: any, data: any) {
    //                //if (cell.raw === 'ID') {//paint.Name header red
    //                //    cell.styles.fontSize = 15;
    //                //    cell.styles.textColor = [255, 0, 0];
    //                //} else {
    //                cell.styles.textColor = 255;
    //                cell.styles.fontSize = 10;

    //                //}
    //            }//,
    //            //createdCell: function (cell: any, data: any) {
    //            //    if (cell.raw === 'Jack') {
    //            //        cell.styles.fontSize = 15;
    //            //        cell.styles.textColor = [255, 0, 0];
    //            //    }
    //            //}
    //        });

    //        //doc.text(
    //        //    'Required Hours: ' + this.AttedndancePDFSummaryModel[i].RequiredHours + ' Reported Hours: ' + this.AttedndancePDFSummaryModel[i].RequiredHours,
    //        //    10, 10);

    //        doc.addPage();
    //    }
    //    doc.save('PDFReport.pdf');

    //    this.Loader = false;

    //    //for (let i = 0; i < this.AttedndancePDFSummaryModel.length; i++) {

    //    //    doc.text(
    //    //        'EmployeeName: ' + this.AttedndancePDFSummaryModel[i].EmployeeName +'EmployeeDesignation: ' + this.AttedndancePDFSummaryModel[i].EmployeeDesignation,
    //    //        10, 10);
    //    //    for (let i = 0; i < this.AttedndancePDFSummaryModel[i].EmployeeAttendance.length; i++) {
    //    //        doc.fromHTML(
    //    //            '<html>' +
    //    //            '<body style="font-family: Helvetica Neue, Helvetica, Arial, sans-serif; font-size: 8px; line-height: 1.42857143; color: #333; background-color: #fff; height: 842px; width: 595px;" >' +
    //    //            '<div style="min-height: 250px;	padding: 15px;	margin-right: auto;	margin-left: auto;" >' +
    //    //            '<div style="position: relative; border-radius: 3px; background: #ffffff;border-top: 3px solid #d2d6de;	margin-bottom: 20px; width: 100%; box-shadow: 0 1px 1px rgba(0,0,0,0.1);" >' +
    //    //            '<div class="box-body table-responsive no-padding" style="border-top-left-radius: 0; border-top-right-radius: 0; border-bottom-right-radius: 3px; border-bottom-left-radius: 3px; padding: 10px;" >' +
    //    //            '<table style="margin-bottom: 0; font-size: 8px;" >' +
    //    //            '<thead>' +
    //    //            '<tr style="padding: 8px; line-height: 2.5; vertical-align: top;" >' +
    //    //            '<th>Date</th>' +
    //    //            '<th>Check In</th>' +
    //    //            '<th>Check Out</th>' +
    //    //            '<th>Required Hours</th>' +
    //    //            '<th>Hours in Office</th>' +
    //    //            '<th>Remarks</th>' +
    //    //            '</tr>' +
    //    //            '</thead>' +
    //    //            '<tbody>' +
    //    //            '<tr style="padding: 8px;  line-height: 2.5;  vertical-align: top;  border-top: 1px solid #ddd;" >' +
    //    //            '<td>' + this.AttedndancePDFSummaryModel[i].EmployeeAttendance[i].Date + '</td>' +
    //    //            '<td>' + this.AttedndancePDFSummaryModel[i].EmployeeAttendance[i].ActualTimeIn + '</td>' +
    //    //            '<td>' + this.AttedndancePDFSummaryModel[i].EmployeeAttendance[i].ActualTimeOut + '</td>' +
    //    //            '<td>' + this.AttedndancePDFSummaryModel[i].EmployeeAttendance[i].StandardHour + '</td>' +
    //    //            '<td>' + this.AttedndancePDFSummaryModel[i].EmployeeAttendance[i].ActualHour + '</td>' +
    //    //            '<td>' + this.AttedndancePDFSummaryModel[i].EmployeeAttendance[i].Remarks + '</td>' +
    //    //            '</tr>' +
    //    //            '</tbody>' +
    //    //            '</table>' +
    //    //            '</div>' +
    //    //            '</div>' +
    //    //            '</div>' +
    //    //            '</body>' +
    //    //            '</html>', 10, 10);
    //    //    }
    //    //    doc.addPage();
    //    //}

    //    //doc.save('PDFReport.pdf');

    //}

}

