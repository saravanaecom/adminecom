import React, { useState, useEffect } from "react";
import { fetchSaleOrderview } from "../services/DashBordServices";
import "../index.css";

const RecentOrders = () => {
  const today = new Date();

  // Calculate the start (Sunday) and end (Saturday) of the current week
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // Set to Sunday
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Set to Saturday

  const [fromDate, setFromDate] = useState(startOfWeek.toISOString().split("T")[0]);
  const [toDate, setToDate] = useState(endOfWeek.toISOString().split("T")[0]);
  const [status, setStatus] = useState("All");
  const [orders, setOrders] = useState([]);
  const [Comid, setCompanyId] = useState(null);
  const Status1 = ["All", "Pending", "Cancel", "Accepted", "Delivered"];

  useEffect(() => {
    const adminuserid = localStorage.getItem("adminuserid");
    if (adminuserid) {
      setCompanyId(Number(adminuserid));
    } else {
      console.error("ComID not found in localStorage");
    }
  }, []);

  const fetchOrders = async () => {
    const objlist = [
      {
        Id: 0,
        Comid: Comid,
        fromdate: fromDate,
        todate: toDate,
        Type: status,
      },
    ];

    try {
      const data = await fetchSaleOrderview(objlist);
      if (data && Array.isArray(data)) {
        setOrders(data);
      } else {
        console.error("Unexpected API response:", data);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  useEffect(() => {
    if (Comid) {
      fetchOrders();
    }
  }, [Comid, fromDate, toDate, status]);

  const handleApplyClick = () => {
    if (!Comid) {
      console.error("Company ID is missing. Cannot fetch orders.");
      return;
    }
    fetchOrders();
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-10">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gray-200 p-6">
          <h5 className="text-2xl font-semibold text-gray-800">Recent Orders</h5>
        </div>
        <div className="p-6">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex flex-col w-full sm:w-1/4">
              <label className="text-sm font-medium text-gray-600 mb-2">From Date:</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col w-full sm:w-1/4">
              <label className="text-sm font-medium text-gray-600 mb-2">To Date:</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col w-full sm:w-1/4">
              <label className="text-sm font-medium text-gray-600 mb-2">Status:</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Status1.map((statusOption, index) => (
                  <option key={index} value={statusOption}>
                    {statusOption}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-center items-center w-full sm:w-auto">
              <button
                className="py-3 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={handleApplyClick}
              >
                Apply
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto p-6">
          <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 text-left border border-gray-300">Order No</th>
                <th className="p-3 text-left border border-gray-300">Order Date</th>
                <th className="p-3 text-left border border-gray-300">Customer Name</th>
                <th className="p-3 text-left border border-gray-300">Payment Type</th>
                <th className="p-3 text-left border border-gray-300">Net Amount</th>
                <th className="p-3 text-left border border-gray-300">Delivery Date</th>
                <th className="p-3 text-left border border-gray-300">Order Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-100 transition-colors duration-200"
                >
                  <td className="p-3 border border-gray-300">{order.OrderNo}</td>
                  <td className="p-3 border border-gray-300">
                    {new Date(order.OrderDate).toISOString().split("T")[0]}
                  </td>
                  <td className="p-3 border border-gray-300">{order.CustomerName}</td>
                  <td className="p-3 border border-gray-300">{order.OrderType}</td>
                  <td className="p-3 border border-gray-300">₹{order.NetAmt}</td>
                  <td className="p-3 border border-gray-300">
                    {new Date(order.DeliveryDate).toISOString().split("T")[0]}
                  </td>
                  <td className="p-3 border border-gray-300">{order.orderstatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <p className="text-center text-gray-500 mt-4">No orders found for the selected date range.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentOrders;