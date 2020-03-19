"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EmployeeStatus_1 = require("../model/EmployeeStatus");
class DashBoardSummary {
    constructor() {
        this.EmployeeLeavesSummary = new Array();
        this.EmployeeStatus = new EmployeeStatus_1.EmployeeStatus();
        this.EmployeesStatus = new Array();
        this.EmployeeAttendance = new Array();
        this.EmployeeLeaves = new Array();
    }
}
exports.DashBoardSummary = DashBoardSummary;
//# sourceMappingURL=DashBoardSummary.js.map