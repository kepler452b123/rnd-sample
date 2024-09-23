// Function to generate random dates within a range
function getRandomDate(start: Date, end: Date) {
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
}

// Function to generate a list of customers
function generateCustomerName(index: number) {
    const customerNames = ["Customer A", "Customer B", "Customer C", "Customer D", "Customer E", "Customer F", 
                           "Customer G", "Customer H", "Customer I", "Customer J", "Customer K", "Customer L",
                           "Customer M", "Customer N", "Customer O", "Customer P", "Customer Q", "Customer R",
                           "Customer S", "Customer T", "Customer U", "Customer V", "Customer W", "Customer X",
                           "Customer Y", "Customer Z", "Customer AA", "Customer AB", "Customer AC", "Customer AD",
                           "Customer AE", "Customer AF"];
    return customerNames[index % customerNames.length];
}

// Generate employees data
const employees: { ID: number; FirstName: string; LastName: string; Position: string; Checked: boolean; }[] = [];
const positions = ["Developer", "Manager", "Designer", "Product Owner", "Tester", "HR", "Marketing", "Sales", "Support"];
for (let i = 1; i <= 50; i++) { // Change to 50 employees
    employees.push({
        ID: i,
        FirstName: `Employee${i}`,
        LastName: `Last${i}`,
        Position: positions[i % positions.length],
        Checked: false
    });
}

// Generate orders data for each employee
const orders: { OrderID: number; EmployeeID: number; CustomerName: string; OrderDate: string; Checked: boolean; }[] = [];
let orderID = 101; // Starting OrderID
const startDate = new Date(2024, 0, 1); // Start date range (Jan 1, 2024)
const endDate = new Date(2024, 11, 31); // End date range (Dec 31, 2024)

for (const employee of employees) {
    for (let i = 0; i < 250; i++) { // Change to 250 orders per employee
        orders.push({
            OrderID: orderID++,
            EmployeeID: employee.ID,
            CustomerName: generateCustomerName(i),
            OrderDate: getRandomDate(startDate, endDate),
            Checked: false
        });
    }
}

// Now you can export employees and orders as named exports
export const employeesArray = employees;
export const ordersArray = orders;
