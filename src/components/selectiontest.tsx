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
    const masterComponent = useRef<any>(null);
    const detailGridRefs = useRef(new Map<number, any>());

    const expandAll = useCallback(() => {
        const dataGrid = masterComponent.current.instance();
        employees.forEach((row) => {
            dataGrid.expandRow(row.ID); // Assuming ID is your unique identifier
        });
    }, []);

    // Collapse all detail grids
    const collapseAll = useCallback(() => {
        const dataGrid = masterComponent.current.instance();
        employees.forEach((row) => {
            dataGrid.collapseRow(row.ID);
        });
    }, []);

    // Automatically expand all detail grids when the content is ready
    const onContentReady = useCallback(() => {
        collapseAll(); // Automatically expand all rows after render
        
    }, [expandAll]);

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
        //component.expandRow(currentSelectedRowKeys[0]);
        if (!detailGridRefs.current.get((currentSelectedRowKeys[0])) && !detailGridRefs.current.get((currentDeselectedRowKeys[0]))){
            return;
        }
        if (currentDeselectedRowKeys.length > 0){
            setCurrentDeselectedKey(currentDeselectedRowKeys[0]);
        }
        else if (currentSelectedRowKeys.length > 0){
            setCurrentSelectedKey(currentSelectedRowKeys[0]);
        }
        else{
            
        }
        
      }, []);

    useEffect( () => {
            if (currentSelectedKey){
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
            
            
            if(detailGridRefs.current.get(currentDeselectedKey).instance().getSelectedRowKeys().length == 0){
                console.log(detailGridRefs.current.get(currentDeselectedKey).instance().getSelectedRowKeys().length);
                return;
            }
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
            setCurrentDeselectedKeyDetail(currentDeselectedRowKeys);
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
                        masterComponent.current.instance().selectRows(id);
                }
            }
        }
    }, [currentSelectedKeyDetail])

    /*
        To find out if there is an ORDER row selected with a matching employee ID:
        1. Find out the employee ID of the order that was just deselected
        2. Find out how many rows of the detail grid under the employee ID are selected
        3. If 0, then deselect the master row. 
    */
    useEffect(() => {
        if (currentDeselectedKeyDetail) {
            const employeeId = orders.find(order => order.OrderID == currentDeselectedKeyDetail)?.EmployeeID;
    
            if(!employeeId){
                return;
            }
            const hasSelectedDetails = detailGridRefs.current.get(employeeId).instance().getSelectedRowKeys().length
    
            if (hasSelectedDetails === 0) {
                const selectedRows = masterComponent.current.instance().getSelectedRowKeys();
    
                const updatedSelectedRows = selectedRows.filter( (rowKey:string|number) => rowKey !== employeeId);
                programmaticSelectionMaster.current = true;
                masterComponent.current.instance().selectRows(updatedSelectedRows);
            }
        }
    }, [currentDeselectedKeyDetail]);
    



    const attachDetailRef = useCallback ( (ID:number, el:any) => {
            if (masterComponent != null){
                detailGridRefs.current.set(ID, el);
                //masterComponent.current.instance().expandRow(ID);
                console.log(detailGridRefs.current.get(ID));
            }
    }, [masterComponent])

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
                        if (el){
                            attachDetailRef(props.data.data.ID, el); 
                        }
                    }}
                    onInitialized={ () => {
                        if (expandedBySelection && detailGridRefs.current.get(props.data.data.ID) != null && masterComponent.current){
                            masterComponent.current.instance().selectRows(101);
                            console.log("onInitialized fired");
                        }
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
            //onContentReady={onContentReady}
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
