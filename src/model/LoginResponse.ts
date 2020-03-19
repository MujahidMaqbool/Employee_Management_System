import { EmployeePermission } from '../model/EmployeePermission';

export class LoginResponse {
    public IsSuccess: boolean = false;
    public Message: string = "";
    public AuthToken: string = "";
    public EmployeeId: string = "";
    public EmployeeCode: string = "";
    public Name: string = "";
    public Image: string = "";
    public Designation: string = "";
    EmployeePermission = new EmployeePermission();
}