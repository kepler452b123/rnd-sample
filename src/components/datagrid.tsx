import React, { useState, useEffect, useMemo, useRef} from "react";
import { DataGrid, Column, MasterDetail, DataGridTypes, Editing, Selection } from "devextreme-react/data-grid";
import 'devextreme/dist/css/dx.light.css';
import ArrayStore from 'devextreme/data/array_store';
import DataSource from 'devextreme/data/data_source';
import { CheckBox } from 'devextreme-react/check-box';



const MasterDetailGrid = () => {
    const getTasks = (key: any) => new DataSource({
        store: new ArrayStore({
            data: orders,
            key: 'OrderID',
        }),
        filter: ['EmployeeID', '=', key],
    });
    const [isUpdating, setIsUpdating] = useState(false);
    const [employees, setEmployees] = useState([
        { ID: 1, FirstName: "John", LastName: "Doe", Position: "Developer", Checked: false },
        { ID: 2, FirstName: "Jane", LastName: "Smith", Position: "Manager", Checked: false },
    ]);
    const [orders, setOrders] = useState([
        { OrderID: 101, EmployeeID: 1, CustomerName: "Customer A", OrderDate: "2024-01-15", Checked: false },
        { OrderID: 102, EmployeeID: 1, CustomerName: "Customer B", OrderDate: "2024-02-20", Checked: false },
        { OrderID: 103, EmployeeID: 2, CustomerName: "Customer C", OrderDate: "2024-03-10", Checked: false },
    ])
    const [currentMaster, setCurrentMaster] = useState<any>(null);
    const detailComponent = useRef(null);

    useEffect(() => {
        if (currentMaster) {
            const newEmployees = employees.map(employee =>
                employee.ID === currentMaster.ID
                    ? { ...employee, Checked: currentMaster.Checked } 
                    : employee  
            );
            setEmployees(newEmployees);
            setCurrentMaster(null);
        }
    }, [currentMaster, employees]);  


    const checkSelection = (rowData: any) => {
        const order = orders.find(order => rowData.OrderID === order.OrderID);
        const emp = employees.find(emp => rowData.EmployeeID === emp.ID);
        const checked = order?.Checked || false;
    
        if (!order || !emp) {
            return;
        }
    
        const handleCheckboxChangeWrapper = (e: any) => {
            order.Checked = e.value; 
            setCurrentMaster({ ...emp, Checked: e.value }); 
    
            
            console.log(employees);
        };
    
        return (
            <div>
                <CheckBox
                    value={checked}  
                    onValueChanged={handleCheckboxChangeWrapper}
                />
            </div>
        );
    };

    const checkMasterSelection = (rowData: any) => {
        const emp = employees.find(employee => rowData.ID === employee.ID);
        const ordersForEmp = orders.filter(order => order.EmployeeID === rowData.ID);
        const isChecked = ordersForEmp.some(order => order.Checked) || emp?.Checked;

        if (!emp) {
            return;
        }


        const handleCheckboxChangeWrapper = (e: any) => {
            setCurrentMaster({ ...emp, Checked: e.value })  
            
        };

        return (
            <div>
                <CheckBox
                    value= {isChecked}
                    defaultValue={isChecked}
                    onValueChanged={handleCheckboxChangeWrapper}
                />
            </div>
        );
    };

    const DetailTemplate = (props: DataGridTypes.MasterDetailTemplateData) => {
        const { FirstName, LastName } = props.data.data;
        const dataSource = getTasks(props.data.key);

        return (
            <div>
                <div className="master-detail-caption">
                    {`${FirstName} ${LastName}'s Tasks:`}
                </div>
                
                <DataGrid
                    ref ={detailComponent}
                    dataSource={dataSource}
                    showBorders={true}
                    repaintChangesOnly={true}
                >
                    <Editing allowUpdating={true} mode={'batch'}></Editing>
                    <Column dataField="OrderID" caption="Order ID" width={100} />
                    <Column dataField="CustomerName" caption="Customer Name" />
                    <Column dataField="OrderDate" caption="Order Date" dataType="date" />
                    
                </DataGrid>
            </div>
        );
    };

    return (
        <DataGrid
            dataSource={employees}
            keyExpr="ID"
            showBorders={true}
            repaintChangesOnly={true}
        >
            <MasterDetail enabled={true} component={DetailTemplate} /> 
            <Editing allowUpdating={true} mode={'cell'}></Editing>
            <Selection mode="single" />
            <Column dataField="ID" caption="Employee ID" width={100} />
            <Column dataField="FirstName" caption="First Name" />
            <Column dataField="LastName" caption="Last Name" />
            <Column dataField="Position" caption="Position" />
            <Column
                caption="Select"
                cellRender={(cellInfo: any) => ( checkMasterSelection(cellInfo.data))}
            />
        </DataGrid>
    );
};

/*
const employees = [
    { ID: 1, FirstName: "John", LastName: "Doe", Position: "Developer", Checked: false },
    { ID: 2, FirstName: "Jane", LastName: "Smith", Position: "Manager", Checked: false },
];*/


const orders = [
    { OrderID: 101, EmployeeID: 1, CustomerName: "Customer A", OrderDate: "2024-01-15", Checked: false },
    { OrderID: 102, EmployeeID: 1, CustomerName: "Customer B", OrderDate: "2024-02-20", Checked: false },
    { OrderID: 103, EmployeeID: 2, CustomerName: "Customer C", OrderDate: "2024-03-10", Checked: false },
];

export default MasterDetailGrid;
