import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { DataGrid, Column, MasterDetail, DataGridTypes, Editing, Selection } from "devextreme-react/data-grid";
import 'devextreme/dist/css/dx.light.css';
import ArrayStore from 'devextreme/data/array_store';
import DataSource from 'devextreme/data/data_source';
import { CheckBox } from 'devextreme-react/check-box';
import { employeesArray, ordersArray } from '../data.ts';



/*
    Current bugs: 
    -deselecting master does not deselect all
    -unselecting all children does not deselect master
    -master can turn on when deselecting children

*/

const MasterDetailGrid = () => {
    const employees= employeesArray;
    const orders= ordersArray;
    const getTasks = (key: any) => new DataSource({
        store: new ArrayStore({
            data: orders,
            key: 'OrderID',
        }),
        filter: ['EmployeeID', '=', key],
    });
    const programmaticSelectionMaster = useRef(false);
    const programmaticSelectionDetail = useRef(false);
    const expandedBySelection = useRef(false);
    const [currentSelectedKey, setCurrentSelectedKey] = useState<any>(null);
    const [currentDeselectedKey, setCurrentDeselectedKey] = useState<any>(null);
    const [currentSelectedKeyDetail, setCurrentSelectedKeyDetail] = useState<any>(null);
    const [currentDeselectedKeyDetail, setCurrentDeselectedKeyDetail] = useState<any>(null);
    const [detailGridData, setDetailGridData] = useState(new Map<number, any[]>());
    const [detailRefsCreated, setDetailRefsCreated] = useState<any>(0);
    const [testRef, setTestRef] = useState<any>(null);
    const masterComponent = useRef<any>(null);
    const detailComponent = useRef<any>(null);
    const detailGridRefs = useRef(new Map<number, any>());

    const saveDetailGridData = (key: number) => {
        const detailGridInstance = detailGridRefs.current.get(key);
        if (detailGridInstance) {
            const selectedRows = detailGridInstance.instance().getSelectedRowKeys();
            setDetailGridData(prev => new Map(prev).set(key, selectedRows));
        }
    };

    const onRowExpanded = useCallback( ( {key}: DataGridTypes.RowExpandedEvent) => {
        console.log('expanding');
        detailGridRefs.current.get(1).instance().selectRows([103], true);
    }, [])

    
    const onSelectionChanged = useCallback(({ selectedRowsData, currentDeselectedRowKeys, currentSelectedRowKeys, component }: DataGridTypes.SelectionChangedEvent) => {
        if (programmaticSelectionMaster.current){
            console.log("blocked master change");
            programmaticSelectionMaster.current = false;
            return;
        }
        expandedBySelection.current = true;
        component.expandRow(currentSelectedRowKeys[0]);
        if (currentDeselectedRowKeys.length > 0){
            setCurrentDeselectedKey(currentDeselectedRowKeys[0]);
        }
        if (currentSelectedRowKeys.length > 0){
            setCurrentSelectedKey(currentSelectedRowKeys[0]);
        }
        else{
            
        }
        
      }, []);

    useEffect( () => {
        if (currentSelectedKey && detailGridData.has(currentSelectedKey)) {
            const savedData = detailGridData.get(currentSelectedKey);
            const detailGridInstance = detailGridRefs.current.get(currentSelectedKey);
            if (detailGridInstance) {
                detailGridInstance.instance.selectRows(savedData, true);
            }
        }
        else if (currentSelectedKey){
            const data = employees.find(employee => employee.ID == currentSelectedKey);
            if(!data){
                return;
            }
            programmaticSelectionDetail.current = true;
            const arr = orders.filter( order => order.EmployeeID === data.ID).map( order => order.OrderID);
            detailGridRefs.current.get(currentSelectedKey).instance().selectRows(arr, true);
            setCurrentSelectedKey(null);
        }
    }, [currentSelectedKey])

    useEffect( () => {
        if (currentDeselectedKey){
            //console.log(`currentDeselectedKey set: ${currentDeselectedKey}`);
            const data = employees.find(employee => employee.ID == currentDeselectedKey);
            if(!data){
                return;
            }
            programmaticSelectionDetail.current = true;
            detailGridRefs.current.get(currentDeselectedKey).instance().selectRows([]);
            setCurrentDeselectedKey(null);
        }
    }, [currentDeselectedKey]);

    const onSelectionChangedDetail = useCallback(({selectedRowsData, currentSelectedRowKeys, currentDeselectedRowKeys}: DataGridTypes.SelectionChangedEvent) => {
        const order = orders.find(order => order.OrderID == currentSelectedKeyDetail);
        const emp = employees.find(emp => order?.EmployeeID == emp.ID);
        if (emp){
            saveDetailGridData(emp?.ID);
        }
        if (programmaticSelectionDetail.current){
            programmaticSelectionDetail.current = false;
            return;
        }
        if (currentSelectedRowKeys.length > 0){
            //console.log(`currentDeselectedRowKeys: ${currentSelectedRowKeys}`);
            setCurrentSelectedKeyDetail(currentSelectedRowKeys);
        }
        if (currentDeselectedRowKeys.length > 0){
            //console.log(`currentDeselectedRowKeys: ${currentDeselectedRowKeys}`);
        }
        /*
        if (currentDeselectedRowKeys.length > 0){
        }
        else if (currentDeselectedRowKeys.length < 0){
            setCurrentSelectedKeyDetail(currentSelectedRowKeys[0]);
        }*/
        
    }, []);

    useEffect( () => {
        //console.log("starting programmatic master select");
        if (currentSelectedKeyDetail){
            const order = orders.find(order => order.OrderID == currentSelectedKeyDetail);
            const emp = employees.find(emp => order?.EmployeeID == emp.ID);
            if (emp){
                const id = emp.ID;
                if (!masterComponent.current.instance().getSelectedRowKeys().includes(id)){
                        programmaticSelectionMaster.current = true;
                        masterComponent.current.instance().selectRows(id, true);
                }
            }
        }
    }, [currentSelectedKeyDetail])

    const attachDetailRef = useCallback ( (ID:number, el:any) => {
        
            detailGridRefs.current.set(ID, el);
            console.log(detailGridRefs.current.get(ID));
    }, [])

    const DetailTemplate = React.useCallback((props: DataGridTypes.MasterDetailTemplateData) => {
        const { FirstName, LastName } = props.data.data;
        const dataSource = getTasks(props.data.key);

        return (
            <div>
                <div className="master-detail-caption">
                    {`${FirstName} ${LastName}'s Tasks:`}
                </div>
                
                <DataGrid
                    ref={(el) => {
                        attachDetailRef(props.data.data.ID, el);
                    }}
                    dataSource={dataSource}
                    showBorders={true}
                    repaintChangesOnly={true}
                    onSelectionChanged={onSelectionChangedDetail}
                    
                >
                    <Selection mode="multiple" showCheckBoxesMode="always" allowSelectAll={false}/>
                    <Editing allowUpdating={true} mode={'batch'} allowAdding={true}></Editing>
                    <Column dataField="OrderID" caption="Order ID" width={100} />
                    <Column dataField="CustomerName" caption="Customer Name" />
                    <Column dataField="OrderDate" caption="Order Date" dataType="date" />
                    
                </DataGrid>
            </div>
        );
    }, []);

    return (
        <DataGrid
            ref={ masterComponent }
            dataSource={employees}
            keyExpr="ID"
            showBorders={true}
            repaintChangesOnly={true}
            onSelectionChanged={onSelectionChanged}
            //onRowExpanded={onRowExpanded}
        >
            <MasterDetail enabled={true} component={DetailTemplate}/> 
            <Editing allowUpdating={true} mode={'cell'}></Editing>
            <Selection mode="multiple" showCheckBoxesMode="always" allowSelectAll={false} />
            <Column dataField="ID" caption="Employee ID" width={100} />
            <Column dataField="FirstName" caption="First Name" />
            <Column dataField="LastName" caption="Last Name" />
            <Column dataField="Position" caption="Position" />
        </DataGrid>
    );
};

export default MasterDetailGrid;
