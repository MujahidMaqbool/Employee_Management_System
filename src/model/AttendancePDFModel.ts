import { EmployeeReport } from "./EmployeeReport";

export class AttendancePDFSummary {
    public EmployeeName: string = "";
    public EmployeeDesignation: string = "";
    public EmployeeAttendance = new Array<EmployeeReport>();
    public DaysLapsed: number = 0;
    public RequiredHours: number = 0;
    public HoursinOffice: number = 0;
    public Compensation: number = 0;
}
