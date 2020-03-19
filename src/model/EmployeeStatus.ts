export class EmployeeStatus {
    public AttendanceCheckInStatus: string = "";
    public AttendanceCheckOutStatus: string = "";
    public CheckInTime: Date = new Date();
    public CheckOutTime: Date = new Date();
    public BottonText: string = "";
    public Designation: string = "";
    public EmployeeId: string = "";
    public ImageUrl: string = "";
    public Name: string = "";
    public Status: string = "";
    public Remarks: string = "";
    public StatusId: number = 0;
    public StatusTimeId: number = 0;
    public IsActive: boolean = false;
    public ShowStatus: boolean = false;
    public IsAvaiable: boolean = false;
    public PhoneNumber: string = "";
    public Email: string = "";
}