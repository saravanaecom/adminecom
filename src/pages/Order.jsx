import React, { useState, useEffect } from "react";
import Slider from "../components/sidebar";
import { fetchSaleOrderview } from "../services/Order";
import { useNavigate } from "react-router-dom";
import { GrEdit } from "react-icons/gr";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { fetchSelectCompanyAdmin } from "../services/branch";

const Orders = () => {
  const today = new Date().toISOString().split("T")[0];
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [status, setStatus] = useState("All");
  const [Paymenttype, setPaymenttype] = useState("All");
  const [branchId, setBranchId] = useState("");
  const [branches, setBranches] = useState([]); 
  const [orders, setOrders] = useState([]);
  const [filterorders, setFillterOrders] = useState([]);
  const [Comid, setCompanyId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10; 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalamount,setTotalamount] =useState(0);
  const [totalcash,setTotalcash]=useState(2);
  const [ toatalonline,setTotalOnline]=useState(3);
  const [branchdata, setBranchdata] = useState([]);

  
  const navigate = useNavigate();

  const Status1 = ["All", "Pending", "Cancel", "Accepted", "Delivered"];
  const Payment =["All","COD","Online"];
   
  const downloadExcel = () => {
    if (orders.length === 0) {
      alert("No data available to download!");
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(
      orders.map((order) => ({
        "Order No": order.OrderNo,
        "Order Date": new Date(order.OrderDate).toLocaleDateString("en-GB"),
        "Customer Name": order.CustomerName,
        "Payment Type": order.OrderType,
        Amount: order.NetAmt,
        "Delivery Date": new Date(order.DeliveryDate).toLocaleDateString("en-GB"),
        Status: order.orderstatus,
      }))
    );
  
   
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
  

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Orders.xlsx");
  };


  useEffect(() => {
    const adminuserid = localStorage.getItem("adminuserid");
    if (adminuserid) {
      setCompanyId(Number(adminuserid));
    } else {
      console.error("Company ID not found in localStorage");
    }
  
    setBranches([{ id: 1, name: "" }]);
  }, []);
  
  useEffect(() => {
    if (Comid) {
      fetchOrders();
    }
  }, [Comid ,Paymenttype]); // Fetch orders when Comid is set
  

  const fetchOrders = async () => {
    const objlist = [
      {
        Id: 0,
        Comid: Comid,
        fromdate: fromDate || "2020-01-01",
        todate: toDate || today,
        Type: status || "All",
      },
    ];
  
    setLoading(true);
    setError(null);
  
    try {
      const data = await fetchSaleOrderview(objlist);
      if (data && Array.isArray(data)) {
        localStorage.setItem("ordereditdetails", JSON.stringify(data));
  
        
        let filteredData = data;

        setFillterOrders(filteredData);
        setOrders(filteredData);
        if (Paymenttype !== "All") {
          filteredData = data.filter(order => order.OrderType === Paymenttype);
        }
       
  
        const totalNetAmount = filteredData.reduce((sum, order) => sum + (order.NetAmt || 0), 0);
        setTotalamount(totalNetAmount);
  
        const totalCashAmount = filteredData
          .filter(order => order.OrderType === "COD")
          .reduce((sum, order) => sum + (order.NetAmt || 0), 0);
        setTotalcash(totalCashAmount);
  
        const totalOnlineAmount = filteredData
          .filter(order => order.OrderType === "Online")
          .reduce((sum, order) => sum + (order.NetAmt || 0), 0);
        setTotalOnline(totalOnlineAmount);
  
        console.log("Filtered Orders:", filteredData);
        console.log("Total Net Amount:", totalNetAmount);
        console.log("Total Cash Amount:", totalCashAmount);
        console.log("Total Online Payment:", totalOnlineAmount);
      } else {
        throw new Error("Unexpected API response");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  
  const fetchAdminData = async () => {
    try {
      const data = await fetchSelectCompanyAdmin(Comid);
      if (data && Array.isArray(data)) {
        setBranchdata(data);
      } else {
        console.log("Unexpected API response.");
      }
    } catch (error) {
      console.log("Failed to fetch admin data.");
    }
  };

  useEffect(() => {
    if (Comid !== null) {
      fetchAdminData();
    }
  }, [Comid]);
  

  const handleNavigate = (id) => {
  
    navigate(`/OrderEdit/${id}`);
  }
  const handleApplyClick = () => {
    if (!Comid) {
      console.error("Company ID is missing. Cannot fetch orders.");
      return;
    }
    fetchOrders();
  };

  const handlePageChange = (direction) => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    } else if (direction === "next" && currentPage < Math.ceil(orders.length / rowsPerPage)) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const paginatedOrders = orders.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );


  const handleBranchChange = (e) => {
    const selectedBranchId = e.target.value;
    setBranchId(selectedBranchId);
  
    const branch = branchdata.find((b) => b?.Id?.toString() === selectedBranchId);
    console.log("Selected Branch:", branch);
  
    if (selectedBranchId === "") {
     
      setOrders(filterorders);
    } else {
     
      setOrders(
        filterorders.filter((product) => {
          console.log("Product CompanyRefid:", product?.CompanyRefid);
          console.log("Selected Branch ID:", selectedBranchId);
          return product?.CompanyRefid?.toString() === selectedBranchId;
        })
      );
    }
    console.log("Filtered Orders:", orders);
    console.log("Selected Branch ID:", selectedBranchId);
    console.log("Selected Branch Name:", branch ? branch.BranchName : "Not Found");
  };


    // useEffect(() => {
    //   if (branchdata.length > 0) {
    //     setBranchId(branchdata[0].Id.toString()); // Set the initial value to the first branch ID
    //   }
    // }, [branchdata]);

    

  return (
    <div className="flex">
      <div className="flex-shrink-0">
        <Slider />
      </div>
      <div className="flex-1 p-6 bg-gray-50">
        <div className="bg-white rounded-lg shadow p-6">
          <h5 className="text-lg font-semibold mb-4">Orders</h5>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium">From Date</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="mt-1 block w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">To Date</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="mt-1 block w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Order Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 block w-full p-2 border rounded"
              >
                {Status1.map((option, idx) => (
                  <option key={idx} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">PayMentType</label>
              <select
                value={Paymenttype}
                onChange={(e) => setPaymenttype(e.target.value)}
                className="mt-1 block w-full p-2 border rounded"
              >
                {Payment.map((option, idx) => (
                  <option key={idx} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            {/* <div>
              <label className="block text-sm font-medium">Branch</label>
              <select
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                className="mt-1 block w-full p-2 border rounded"
              >
                <option value="">All Branches</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div> */}
          </div>
          <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md space-x-6">
  {/* Filter Buttons */}
  <div className="flex space-x-4">
    <button
      onClick={handleApplyClick}
      className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
    >
      Apply Filters
    </button>

    <button
      onClick={downloadExcel}
      className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-300"
    >
      Download Excel
    </button>
  </div>

  {/* Branch Dropdown */}
  {branchdata.length > 0 && (
  <div className="flex items-center space-x-2">
    <label className="text-sm font-medium text-gray-600">Branch:</label>
    <select
      value={branchId}
      onChange={handleBranchChange}
      className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">All Branches</option>
      {branchdata.map((branch) => (
        <option key={branch.Id} value={branch.Id}>
          {branch.BranchName}
        </option>
      ))}
    </select>
  </div>
)}

  {/* Summary Section */}
  <div className="flex space-x-8 text-gray-700 font-medium">
    <div className="flex flex-col items-center">
      <h4 className="text-sm font-semibold text-gray-600">Total Amount</h4>
      <p className="text-lg font-bold text-blue-600">{Math.round(totalamount)}</p>
    </div>
    <div className="flex flex-col items-center">
      <h4 className="text-sm font-semibold text-gray-600">Total Cash</h4>
      <p className="text-lg font-bold text-green-600">{Math.round(totalcash)}</p>
    </div>
    <div className="flex flex-col items-center">
      <h4 className="text-sm font-semibold text-gray-600">Total Online Payment</h4>
      <p className="text-lg font-bold text-purple-600">{Math.round(toatalonline)}</p>
    </div>
  </div>
</div>
     <div className="flex justify-between items-center mt-4">
    
      </div>





         
          <div className="overflow-x-auto px-6 py-4">
  {loading ? (
    <p className="text-center text-gray-500">Loading...</p>
  ) : error ? (
    <p className="text-center text-red-500">{error}</p>
  ) : (
    <table className="min-w-full table-auto border-separate border-spacing-0 neumorphism-table">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order No</th>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order Date</th>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Payment Type</th>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Delivery Date</th>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
        </tr>
      </thead>
      <tbody className="bg-white">
        {orders.map((order, idx) => (
          <React.Fragment key={order.Id}>
            <tr className="hover:bg-gray-50 transition duration-300 ease-in-out">
              <td className="px-6 py-4 text-sm font-medium text-gray-700">{order.OrderNo}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-700">
              {new Date(order.OrderDate).toLocaleDateString('en-GB')}</td>
              {console.log(order)}
              <td className="px-6 py-4 text-sm font-medium text-gray-700">{order.CustomerName}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-700">{order.OrderType}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-700">₹{order.NetAmt}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-700">
                  {new Date(order.DeliveryDate).toLocaleDateString('en-GB')}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-700">
                {order.orderstatus}
              </td>
              <td className="px-6 py-4 text-sm font-medium text-gray-700 flex space-x-4">
                {/* Edit Button */}
                <button    onClick={() => handleNavigate(order.Id)}
                  className="flex items-center px-3 py-1 bg-blue-100 text-blue-600 rounded-2xl hover:bg-blue-200 transition duration-300"
                >
              <GrEdit className="mr-1" />
              <span>Edit</span>
                </button>

             

                {/* Delete Button */}
           
              </td>
            </tr>
            {/* Horizontal Line */}
            <tr>
              <td colSpan="8" className="border-b border-gray-300"></td>
            </tr>
          </React.Fragment>
        ))}
      </tbody>
    </table>
  )}
</div>


   
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => handlePageChange("prev")}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Previous
            </button>
            <span>Page {currentPage}</span>
            <button
              onClick={() => handlePageChange("next")}
              disabled={currentPage >= Math.ceil(orders.length / rowsPerPage)}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
