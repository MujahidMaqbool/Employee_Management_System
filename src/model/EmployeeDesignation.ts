export class EmployeeDesignation {
    public DesignationId: number = 0;
    public Designation: string = "";
    public ShortDescription: string = "";
    public CreatedUtcDateTime: Date = new Date();
    public LastUpdatedUTCDateTime: Date = new Date(); 
    public IsDisabled: boolean = false;
}