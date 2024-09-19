import React from "react";
import { DataGrid, Column, DataGridTypes, Selection } from "devextreme-react/data-grid";
import 'devextreme/dist/css/dx.light.css';
import ArrayStore from 'devextreme/data/array_store';
import DataSource from 'devextreme/data/data_source';
import { CheckBox } from 'devextreme-react/check-box';


const getTasks = (key: any) => new DataSource({
    store: new ArrayStore({
      data: orders,
      key: 'OrderID',
    }),
    filter: ['EmployeeID', '=', key],
});


const checkSelection = (rowData: any) => {
    const order = orders.find(order => rowData.OrderID === order.OrderID);  
    const checked = order?.Checked || false;  

    if(!order){
        return;
    }
    
    const handleCheckboxChange = (e: any) => {
        
        order.Checked = e.value;  
        console.log(`Order ${order.OrderID} is now ${e.value ? 'checked' : 'unchecked'}`);
    };
    
    return (
        <div>
            <CheckBox
                defaultValue={checked}
                onValueChanged={handleCheckboxChange}  
            />
        </div>
    );
};

// Master-detail template for each row
const DetailTemplate = (props: DataGridTypes.MasterDetailTemplateData) => {
    const { FirstName, LastName } = props.data.data;
    const dataSource = getTasks(props.data.key);
    
    return (
        <div>
            <div className="master-detail-caption">
                {`${FirstName} ${LastName}'s Tasks:`}
            </div>
            
            <DataGrid
                dataSource={dataSource}
                showBorders={true}
            >
                <Column dataField="OrderID" caption="Order ID" width={100} />
                <Column dataField="CustomerName" caption="Customer Name" />
                <Column dataField="OrderDate" caption="Order Date" dataType="date" />
                <Column
                    caption="Select"
                    cellRender={(cellInfo: any) => checkSelection(cellInfo.data)}  
                />
            </DataGrid>
        </div>
    );
};


const orders = [
    { OrderID: 101, EmployeeID: 1, CustomerName: "Customer A", OrderDate: "2024-01-15", Checked: false },
    { OrderID: 102, EmployeeID: 1, CustomerName: "Customer B", OrderDate: "2024-02-20", Checked: false },
    { OrderID: 103, EmployeeID: 2, CustomerName: "Customer C", OrderDate: "2024-03-10", Checked: false },
];

export default DetailTemplate;
