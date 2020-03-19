import { EmployeeReport } from "./EmployeeReport";

export class AttendanceSummaryPDF {
    public EmployeeName: string = "";
    public EmployeeId: string = "";
    public EmployeeImage: string = "";
    public EmployeeDesignation: string = "";
    public EmployeeCode: string = "";
    public DaysLapsed: number = 0;
    public RequiredHours: number = 0;
    public HoursinOffice: number = 0;
    public Compensation: number = 0;
    public AttendedDays: number = 0;
    public Absents: number = 0;
    public Leaves: number = 0;
    public WFH: number = 0;
    public Diffrence: number = 0;
    public Deduction: number = 0;
    public Status: boolean = false;
}