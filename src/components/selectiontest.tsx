import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
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
    const [programmaticSelectionMaster, setProgrammaticSelectionMaster] = useState(false);
    const [programmaticSelectionDetail, setProgrammaticSelectionDetail] = useState(false);
    const [dChangedKeys, setDChangedKeys] = useState<any>([]);
    const [mChangedKeys, setMChangedKeys] = useState<any>([]);
    const [employees, setEmployees] = useState([
        { ID: 1, FirstName: "John", LastName: "Doe", Position: "Developer", Checked: false },
        { ID: 2, FirstName: "Jane", LastName: "Smith", Position: "Manager", Checked: false },
    ]);
    const masterComponent = useRef<any>(null);
    const detailComponent = useRef<any>(null);
    
    const onSelectionChanged = ({ selectedRowsData }: DataGridTypes.SelectionChangedEvent) => {
        const data = selectedRowsData[selectedRowsData.length - 1];
        if(!data){
            return;
        }
        const id = data.ID;
        const arr = orders.filter( order => order.EmployeeID == id);
        const arr2 = arr.map( order => order.OrderID );
        setProgrammaticSelectionDetail(true);
        for (var i = 0; i < arr2.length; i++){
            detailComponent.current.instance().selectRows(arr2);
        }
        /*
        const data = selectedRowsData[selectedRowsData.length - 1];
            if (data){
                const id = data.ID;
                const arr = orders.filter( order => order.EmployeeID == id);
                const arr2 = arr.map( order => order.OrderID );
                if (detailComponent.current){
                    setCountDetailSelected
                    detailComponent.current.instance().selectRows(arr2, true);
                    console.log(detailComponent.current.instance().getSelectedRowKeys());
                }
            }
        */
        
      };

    const onSelectionChangedDetail = useCallback(({selectedRowsData}: DataGridTypes.SelectionChangedEvent) => {
        console.log(selectedRowsData);
        const data = selectedRowsData[selectedRowsData.length - 1];
        if (data){
            const id = data.EmployeeID;
            const arr = employees.filter( emp => emp.ID == id);
            if (masterComponent.current){
                setProgrammaticSelectionMaster(true);
                masterComponent.current.instance().selectRows(arr[0], true);
                console.log(masterComponent.current.instance().getSelectedRowKeys());
            }
        }
        else{
            return;
        }
    }, []);




    const DetailTemplate = (props: DataGridTypes.MasterDetailTemplateData) => {
        const { FirstName, LastName } = props.data.data;
        const dataSource = getTasks(props.data.key);

        return (
            <div>
                <div className="master-detail-caption">
                    {`${FirstName} ${LastName}'s Tasks:`}
                </div>
                
                <DataGrid
                    ref={detailComponent}
                    dataSource={dataSource}
                    showBorders={true}
                    repaintChangesOnly={true}
                    onSelectionChanged={onSelectionChangedDetail}
                    //scrolling={{ mode: 'virtual' }}
                >
                    <Selection mode="multiple" showCheckBoxesMode="always" />
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
            ref={masterComponent}
            dataSource={employees}
            keyExpr="ID"
            showBorders={true}
            repaintChangesOnly={true}
            onSelectionChanged={onSelectionChanged}
            //scrolling={{ mode: 'virtual' }}
        >
            <MasterDetail enabled={true} component={DetailTemplate} /> 
            <Editing allowUpdating={true} mode={'cell'}></Editing>
            <Selection mode="multiple" showCheckBoxesMode="always" />
            <Selection mode="multiple" showCheckBoxesMode="always" />
            <Column dataField="ID" caption="Employee ID" width={100} />
            <Column dataField="FirstName" caption="First Name" />
            <Column dataField="LastName" caption="Last Name" />
            <Column dataField="Position" caption="Position" />
        </DataGrid>
    );
};

/*
const employees = [
    { ID: 1, FirstName: "John", LastName: "Doe", Position: "Developer", Checked: false },
    { ID: 2, FirstName: "Jane", LastName: "Smith", Position: "Manager", Checked: false },
];*/


export const orders = [
    { OrderID: 101, EmployeeID: 1, CustomerName: "Customer A", OrderDate: "2024-01-15", Checked: false },
    { OrderID: 102, EmployeeID: 1, CustomerName: "Customer B", OrderDate: "2024-02-20", Checked: false },
    { OrderID: 103, EmployeeID: 2, CustomerName: "Customer C", OrderDate: "2024-03-10", Checked: false },
];

export default MasterDetailGrid;
