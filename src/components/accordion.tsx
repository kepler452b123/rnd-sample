import React from 'react';
import { Accordion } from 'devextreme-react/accordion';
import { DataGrid, Column, Selection } from 'devextreme-react/data-grid';
import 'devextreme/dist/css/dx.light.css';

const employees = [
  { ID: 1, FirstName: "John", LastName: "Doe", Position: "Developer" },
  { ID: 2, FirstName: "Jane", LastName: "Smith", Position: "Manager" },
  { ID: 3, FirstName: "Mike", LastName: "Brown", Position: "Designer" },
  { ID: 4, FirstName: "Anna", LastName: "Davis", Position: "QA Engineer" },
  { ID: 5, FirstName: "John", LastName: "Doe", Position: "Developer" },
  { ID: 6, FirstName: "Jane", LastName: "Smith", Position: "Manager" },
  { ID: 7, FirstName: "Mike", LastName: "Brown", Position: "Designer" },
  { ID: 8, FirstName: "Anna", LastName: "Davis", Position: "QA Engineer" },
  { ID: 9, FirstName: "John", LastName: "Doe", Position: "Developer" },
  { ID: 10, FirstName: "Jane", LastName: "Smith", Position: "Manager" },
  { ID: 11, FirstName: "Mike", LastName: "Brown", Position: "Designer" },
  { ID: 12, FirstName: "Anna", LastName: "Davis", Position: "QA Engineer" },
  { ID: 13, FirstName: "John", LastName: "Doe", Position: "Developer" },
  { ID: 14, FirstName: "Jane", LastName: "Smith", Position: "Manager" },
  { ID: 15, FirstName: "Mike", LastName: "Brown", Position: "Designer" },
  { ID: 16, FirstName: "Anna", LastName: "Davis", Position: "QA Engineer" },
];

const orders = [
  { OrderID: 101, EmployeeID: 1, CustomerName: "Customer A", OrderDate: "2024-01-15" },
  { OrderID: 102, EmployeeID: 1, CustomerName: "Customer B", OrderDate: "2024-02-20" },
  { OrderID: 103, EmployeeID: 2, CustomerName: "Customer C", OrderDate: "2024-03-10" },
  { OrderID: 104, EmployeeID: 3, CustomerName: "Customer D", OrderDate: "2024-04-05" },
  { OrderID: 105, EmployeeID: 2, CustomerName: "Customer E", OrderDate: "2024-05-18" },
  { OrderID: 106, EmployeeID: 1, CustomerName: "Customer F", OrderDate: "2024-06-22" },
  { OrderID: 107, EmployeeID: 4, CustomerName: "Customer G", OrderDate: "2024-07-30" },
  { OrderID: 108, EmployeeID: 5, CustomerName: "Customer H", OrderDate: "2024-08-15" },
  { OrderID: 109, EmployeeID: 6, CustomerName: "Customer I", OrderDate: "2024-09-20" },
  { OrderID: 110, EmployeeID: 7, CustomerName: "Customer J", OrderDate: "2024-10-10" },
  { OrderID: 111, EmployeeID: 8, CustomerName: "Customer K", OrderDate: "2024-11-05" },
  { OrderID: 112, EmployeeID: 9, CustomerName: "Customer L", OrderDate: "2024-12-22" },
  { OrderID: 113, EmployeeID: 10, CustomerName: "Customer M", OrderDate: "2024-01-30" },
  { OrderID: 114, EmployeeID: 11, CustomerName: "Customer N", OrderDate: "2024-02-25" },
  { OrderID: 115, EmployeeID: 12, CustomerName: "Customer O", OrderDate: "2024-03-15" },
  { OrderID: 116, EmployeeID: 13, CustomerName: "Customer P", OrderDate: "2024-04-10" },
  { OrderID: 117, EmployeeID: 14, CustomerName: "Customer Q", OrderDate: "2024-05-20" },
  { OrderID: 118, EmployeeID: 15, CustomerName: "Customer R", OrderDate: "2024-06-15" },
  { OrderID: 119, EmployeeID: 16, CustomerName: "Customer S", OrderDate: "2024-07-05" },
];

const getOrdersForEmployee = (employeeID) => {
  return orders.filter(order => order.EmployeeID === employeeID);
};

const MasterDetailAccordion = () => {

  const renderAccordionItemContent = (employee) => {
    return (
      <DataGrid
        dataSource={getOrdersForEmployee(employee.ID)}
        showBorders={true}
        repaintChangesOnly={true}
        style={{ width: '100%' }} // Ensure the DataGrid takes full width
      >
        <Selection mode='multiple' showCheckBoxesMode='always' />
        <Column dataField="OrderID" caption="Order ID" />
        <Column dataField="CustomerName" caption="Customer Name" />
        <Column dataField="OrderDate" caption="Order Date" dataType="date" />
      </DataGrid>
    );
  };

  return (
    <Accordion
      collapsible={true}
      multiple={true} 
      animationDuration={300}
      dataSource={employees}
      itemTitleRender={(employee) => `${employee.FirstName} ${employee.LastName} - ${employee.Position}`}
      itemRender={(employee) => renderAccordionItemContent(employee)}
      style={{ width: '100%' }} // Ensure the Accordion takes full width
    />
  );
};

export default MasterDetailAccordion;
