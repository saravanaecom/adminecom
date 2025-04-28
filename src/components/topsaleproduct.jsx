import React, { useEffect, useState } from "react";
import { fetctopsaleproduct } from "../services/topsaleproduct";

const Topsaleproduct = () => {
  const [Comid, setCompanyId] = useState(null);
  const [admindata, setAdmindata] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10; 

  useEffect(() => {
    const adminuserid = localStorage.getItem("adminuserid");
    if (adminuserid) {
      setCompanyId(Number(adminuserid));
    } else {
      console.log("Admin ID not found in localStorage");
    }
  }, []);

  useEffect(() => {
    if (Comid !== null) {
      fetchsaleData();
    }
  }, [Comid]);

  const fetchsaleData = async () => {
    let adminId = Comid;

    try {
      const data = await fetctopsaleproduct(adminId);
      if (data && Array.isArray(data)) {
        setAdmindata(data);
      } else {
        console.log("Unexpected API response.");
      }
    } catch (error) {
      console.log("Failed to fetch admin data.");
    }
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentData = admindata.slice(indexOfFirstRow, indexOfLastRow);


  const handleNextPage = () => {
    if (currentPage < Math.ceil(admindata.length / rowsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Top Sale Products</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left border border-gray-300">S.No</th>
              <th className="p-3 text-left border border-gray-300">Product Name</th>
              <th className="p-3 text-left border border-gray-300">Quantity Sold</th>
              <th className="p-3 text-left border border-gray-300">Total Sales</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((product, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-100 transition-colors duration-200"
                >
                  <td className="p-3 border border-gray-300">
                    {indexOfFirstRow + index + 1} 
                  </td>
                  <td className="p-3 border border-gray-300">
                    {product.Description || "N/A"}
                  </td>
                  <td className="p-3 border border-gray-300">
                    {parseInt(product.TotalQuantitySold) || 0} 
                  </td>
                  <td className="p-3 border border-gray-300">
                    ₹{parseFloat(product.TotalSales).toFixed(2) || "0.00"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="p-3 text-center text-gray-500 border border-gray-300"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-md ${
            currentPage === 1 ? "bg-gray-300 text-gray-500" : "bg-blue-500 text-white"
          }`}
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {currentPage} of {Math.ceil(admindata.length / rowsPerPage)}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === Math.ceil(admindata.length / rowsPerPage)}
          className={`px-4 py-2 rounded-md ${
            currentPage === Math.ceil(admindata.length / rowsPerPage)
              ? "bg-gray-300 text-gray-500"
              : "bg-blue-500 text-white"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Topsaleproduct;