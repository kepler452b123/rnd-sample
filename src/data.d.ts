// data.d.ts
declare module './data.js' {
    export const employeesArray: Array<{
        ID: number;
        FirstName: string;
        LastName: string;
        Position: string;
        Checked: boolean;
    }>;

    export const ordersArray: Array<{
        OrderID: number;
        EmployeeID: number;
        CustomerName: string;
        OrderDate: string;
        Checked: boolean;
    }>;
}
