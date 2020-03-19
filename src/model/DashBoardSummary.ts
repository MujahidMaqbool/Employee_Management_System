import { EmployeeAttendance } from '../model/EmployeeAttendance';
import { EmployeeStatus } from '../model/EmployeeStatus';
import { EmployeeLeaveSummary } from '../model/EmployeeLeaveSummary';
import { EmployeeLeave } from '../model/EmployeeLeave';

export class DashBoardSummary {
    public EmployeeLeavesSummary = new Array<EmployeeLeaveSummary>();
    public EmployeeStatus = new EmployeeStatus();
    public EmployeesStatus = new Array<EmployeeStatus>();
    public EmployeeAttendance = new Array<EmployeeAttendance>();
    public EmployeeLeaves = new Array<EmployeeLeave>();
    public DaysLapsed: number = 0;
    public RequiredHours: number = 0;
    public HoursinOffice: number = 0;
}

