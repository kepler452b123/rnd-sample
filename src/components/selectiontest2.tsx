import React, { useState, useEffect, useRef } from "react";
import { DataGrid, Column, MasterDetail, Editing, Selection } from "devextreme-react/data-grid";
import 'devextreme/dist/css/dx.light.css';
import ArrayStore from 'devextreme/data/array_store';
import DataSource from 'devextreme/data/data_source';

const MasterDetailGrid = () => {
    const [selectedMasterIds, setSelectedMasterIds] = useState<number[]>([]); // Track selected rows in master
    const [selectedDetailIds, setSelectedDetailIds] = useState<number[]>([]); // Track selected rows in detail

    const masterComponent = useRef<any>(null);
    const detailComponent = useRef<any>(null);

    const getTasks = (key: any) => new DataSource({
        store: new ArrayStore({
            data: orders,
            key: 'OrderID',
        }),
        filter: ['EmployeeID', '=', key],
    });

    
    const onSelectionChanged = ({ selectedRowKeys }: any) => {
       
        const detailRowIds = orders.filter(order => order.EmployeeID === selectedRowKeys[selectedRowKeys.length-1]).map(order => order.OrderID);
        setSelectedDetailIds(detailRowIds);
    };

    
    const onSelectionChangedDetail = ({ selectedRowKeys }: any) => {
        const lastSelectedDetail = selectedRowKeys[selectedRowKeys.length - 1];
        if (lastSelectedDetail) {
            const employeeId = orders.find(order => order.OrderID === lastSelectedDetail)?.EmployeeID;
            if (employeeId) {
                setSelectedMasterIds([employeeId]);  
            }
        }
        setSelectedDetailIds(selectedRowKeys);
    };

    
    useEffect(() => {
        if (masterComponent.current) {
            masterComponent.current.instance().selectRows(selectedMasterIds, true);
        }
    }, [selectedMasterIds]);

    
    useEffect(() => {
        if (detailComponent.current) {
            detailComponent.current.instance().selectRows(selectedDetailIds, true);
        }
    }, [selectedDetailIds]);

    const DetailTemplate = (props: any) => {
        const dataSource = getTasks(props.data.key);
        return (
            <div>
                <div className="master-detail-caption">
                    {`${props.data.data.FirstName} ${props.data.data.LastName}'s Tasks:`}
                </div>
                <DataGrid
                    ref={detailComponent}
                    dataSource={dataSource}
                    showBorders={true}
                    repaintChangesOnly={true}
                    
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
        >
            <MasterDetail enabled={true} component={DetailTemplate} />
            <Editing allowUpdating={true} mode={'cell'} />
            <Selection mode="multiple" showCheckBoxesMode="always" />
            <Column dataField="ID" caption="Employee ID" width={100} />
            <Column dataField="FirstName" caption="First Name" />
            <Column dataField="LastName" caption="Last Name" />
            <Column dataField="Position" caption="Position" />
        </DataGrid>
    );
};

const employees = [
    { ID: 1, FirstName: "John", LastName: "Doe", Position: "Developer" },
    { ID: 2, FirstName: "Jane", LastName: "Smith", Position: "Manager" },
];

const orders = [
    { OrderID: 101, EmployeeID: 1, CustomerName: "Customer A", OrderDate: "2024-01-15" },
    { OrderID: 102, EmployeeID: 1, CustomerName: "Customer B", OrderDate: "2024-02-20" },
    { OrderID: 103, EmployeeID: 2, CustomerName: "Customer C", OrderDate: "2024-03-10" },
];

export default MasterDetailGrid;
