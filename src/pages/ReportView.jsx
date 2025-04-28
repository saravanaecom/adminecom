import React, { useState, useEffect } from "react";
import Slider from "../components/sidebar";
import { fetchSelectCoustomer, } from "../services/Customer";
import { fetchSelectProduct } from "../services/Product";
import { fetchSelectCategory,  } from "../services/Category";
import { fetchSelectsubCategory} from "../services/SubCategory";
import { fetchSelectCompanyAdmin } from "../services/branch";
import { fetcsaleorderreportdata1,fetcItemmasterreportdata,fetcsaleorderdetailreport,fetccategoryreport,fetcsubcategoryreport ,fetcTopCustomer} from "../services/report";
const ReportView = () => {
  const [selectedReport, setSelectedReport] = useState("saleOrderConsolidated");

  const companyId = localStorage.getItem("adminuserid");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerName, setSelectedCustomerName] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [selectedProductName, setSelectedProductName] = useState("");
  const [selectedCategoryName, setSelectedCatregoryName] = useState("");
  const [selectedSubCategoryName, setSelectedSubCatregoryName] = useState("");
  const [selectedSubCategoryId, setSelectedSubCatregoryId] = useState(0);
  const [selectedCustomerId, setSelectedCustomerId] = useState(0);
  const [selectedCategoryId, setSelectedCategoryId] = useState(0);
  const [selectedProductId, setSelectedProductId] = useState(0);
  const [adminId, setAdminId] = useState(null);
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [fromDate, setFromDate] = useState(""); // State for From Date
  const [toDate, setToDate] = useState("");
  const [ifromDate, setIfromDate] = useState(""); 
  const [itoDate, setItoDate] = useState("");

  const [cfromDate, setCfromDate] = useState(""); 
  const [ctoDate, setCtoDate] = useState("");

  const [scfromDate, setScfromDate] = useState(""); 
  const [sctoDate, setSctoDate] = useState("");

  const [TfromDate, setTfromDate] = useState(""); 
  const [TctoDate, setTtoDate] = useState("");
 const [branchId, setBranchId] = useState("");
  const [paymentType, setPaymentType] = useState("");
   const [branchdata, setBranchdata] = useState([]);
          useEffect(() => {
            if (adminId) {
              fetchsubCategoryData();
          
            }
          }, [adminId]);
             const fetchsubCategoryData = async () => {
               setLoading(true);
               setError(null);
               try {
                 const data = await fetchSelectsubCategory(adminId);
                 if (data) {
                   setSubCategories(data);
                   localStorage.setItem("SubCategories", JSON.stringify(data));
                 }
               } catch (error) {
                 setError("Error fetching subcategory data: " + error.message);
                 setIsErrorModalOpen(true);
               } finally {
                 setLoading(false);
               }
             };
     useEffect(() => {
        if (adminId) {
          fetchCategoryData();
        }
      }, [adminId]);
    
      const fetchCategoryData = async () => {
        setLoading(true);
        try {
          const data = await fetchSelectCategory(adminId);
          if (data) {
            setCategory(data);
            localStorage.setItem("Category", JSON.stringify(data));
          }
        } catch (error) {
          setError("Error fetching category data: " + error.message);
          setIsErrorModalOpen(true);
        } finally {
          setLoading(false);
        }
      };

  useEffect(() => {
    // Filter products based on the search term
    const filtered = products.filter((product) =>
      product.Description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

    useEffect(() => {
       const adminUserId = JSON.parse(localStorage.getItem("adminuserid"));
       if (!adminUserId) {
       } else {
         setAdminId(Number(adminUserId));
       }
     }, []);

  useEffect(() => {
    if (adminId) {
      setLoading(true);
      const fetchProducts = async () => {
        try {
          const productsData = await fetchSelectProduct(adminId);
          localStorage.setItem("AdminProductList", JSON.stringify(productsData));
          setProducts(productsData);  
          setFilteredProducts(productsData)
        } catch (error) {
          console.error("Failed to fetch products", error);
        } finally {
          setLoading(false);
        }
      };
      fetchProducts();
    }
  }, [adminId]);

  const handlecategoryChange = (event) => {
    const selectedcategoryId = event.target.value;
    const selectedCatgory = category.find(
      (category) => category.Id.toString() === selectedcategoryId
    );

    setSelectedCatregoryName(selectedCatgory); 
    setSelectedCategoryId(selectedcategoryId); 
    console.log("Selected product Name:", selectedCatgory);
  };


  const handleSubcategoryChange = (event) => {
    const selectedSubcategoryId = event.target.value;
    const selectedSubCategory = subCategories.find(
      (subCategories) => subCategories.Id.toString() === selectedSubcategoryId
    );
   
    setSelectedSubCatregoryName(selectedSubCategory);
    setSelectedSubCatregoryId(selectedSubcategoryId); 
    
    console.log("Selected product Name:", selectedSubcategoryId);
  };



  const handleProductChange = (event) => {
    const selectedProductId = event.target.value; // Get the selected product ID
    const selectedProduct = products.find(
      (product) => product.Id.toString() === selectedProductId
    ); // Find the product object
  
    setSelectedProductId(selectedProductId); // Update the selected product ID state
    setSelectedProductName(selectedProduct?.Description || ""); // Update the selected product name state
  
    console.log("Selected Product ID:", selectedProductId);
    console.log("Selected Product Name:", selectedProduct?.Description);
  };
  const handleCustomerChange = (event) => {
    const selectedId = event.target.value; 
    const selectedCustomer = customers.find((customer) => customer.Id.toString() === selectedId); 
    setSelectedCustomerId(selectedId); 
    setSelectedCustomerName(selectedCustomer?.CustomerName || ""); 
    console.log("Selected Customer ID:", selectedId);
    console.log("Selected Customer Name:", selectedCustomer?.CustomerName);
  };
   const fetchAdminData = async () => {
     try {
       const data = await fetchSelectCompanyAdmin(adminId);
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
     if (adminId !== null) {
       fetchAdminData();
     }
   }, [adminId]);







 useEffect(() => {
      if (companyId) {
        fetchCustomers();
      } else {
        console.error("Company ID not found in localStorage");
      }
    }, [companyId]);

      const fetchCustomers = async () => {
        setLoading(true);
        setError(null);
        try {
          const data = await fetchSelectCoustomer(Number(companyId));
          localStorage.setItem("Customerdata", JSON.stringify(data));
          if (data && Array.isArray(data)) {
            setCustomers(data);
           
          } else {
            throw new Error("Unexpected API response");
          }
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

  const handleReportChange = (event) => {
    setSelectedReport(event.target.value);
  };


  const fetchsaleorderreport1data = async () => {
    setLoading(true);
  
    const objlist = {
      Id: selectedCustomerId,
      Fromdate: fromDate,
      Todate: toDate,
      paymenttype: paymentType,
      Comid: branchId ?branchId : adminId,
    };
  
    console.log("Request Payload:", objlist);
  
    try {
      const data = await fetcsaleorderreportdata1(objlist);
      if (data) {
        // Ensure the URL is valid
        var url = data.Data2.trim().replace(/^"|"$/g, ""); // Remove extra quotes
        console.log("URL:", url);
  
        // Open the URL in a new tab
        var myWindow = window.open(url, "_blank");
  
        if (myWindow) {
          // Optionally, set the title of the new tab
          myWindow.addEventListener(
            "load",
            function () {
              myWindow.document.title = "Report Viewer";
            },
            false
          );
        } else {
          console.error("Popup blocked or failed to open.");
          alert("Unable to open the report. Please check your browser settings.");
        }
      }
    } catch (error) {
      setError("Error fetching data: " + error.message);
      setIsErrorModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchItemmasterreport1data = async () => {
    setLoading(true);
    const objlist = {
      Id: selectedProductId || 0,
      Fromdate: ifromDate,
      Todate: itoDate,
      Comid: branchId ?branchId : adminId,
    };
  
    console.log("Request Payload:", objlist);
  
    try {
      const data = await fetcItemmasterreportdata(objlist);
      if (data) {
        // Ensure the URL is valid
        var url = data.Data4.trim().replace(/^"|"$/g, ""); // Remove extra quotes
        console.log("URL:", url);
  
        // Open the URL in a new tab
        var myWindow = window.open(url, "_blank");
  
        if (myWindow) {
          // Optionally, set the title of the new tab
          myWindow.addEventListener(
            "load",
            function () {
              myWindow.document.title = "Report Viewer";
            },
            false
          );
        } else {
          console.error("Popup blocked or failed to open.");
          alert("Unable to open the report. Please check your browser settings.");
        }
      }
    } catch (error) {
      setError("Error fetching data: " + error.message);
      setIsErrorModalOpen(true);
    } finally {
      setLoading(false);
    }
  };



  const fetchsaleorderdetaireport = async () => {
    setLoading(true);
  
    const objlist = {
      Id: selectedProductId,
      Fromdate: fromDate,
      Todate: toDate,
      paymenttype: paymentType,
      Comid: branchId ?branchId : adminId,
    };
  
    console.log("Request Payload:", objlist);
  
    try {
      const data = await fetcsaleorderdetailreport(objlist);
      if (data) {
        // Ensure the URL is valid
        var url = data.Data4.trim().replace(/^"|"$/g, ""); // Remove extra quotes
        console.log("URL:", url);
  
        // Open the URL in a new tab
        var myWindow = window.open(url, "_blank");
  
        if (myWindow) {
          // Optionally, set the title of the new tab
          myWindow.addEventListener(
            "load",
            function () {
              myWindow.document.title = "Report Viewer";
            },
            false
          );
        } else {
          console.error("Popup blocked or failed to open.");
          alert("Unable to open the report. Please check your browser settings.");
        }
      }
    } catch (error) {
      setError("Error fetching data: " + error.message);
      setIsErrorModalOpen(true);
    } finally {
      setLoading(false);
    }
  };


  const fetchcategroywidereport = async () => {
    setLoading(true);
  
    const objlist = {
      Id: selectedCategoryId,
      Fromdate: cfromDate,
      Todate: ctoDate,
      Comid: branchId ?branchId : adminId,
    };
  
    console.log("Request Payload:", objlist);
  
    try {
      const data = await fetccategoryreport(objlist);
      if (data) {
        // Ensure the URL is valid
        var url = data.Data4.trim().replace(/^"|"$/g, ""); // Remove extra quotes
        console.log("URL:", url);
  
        // Open the URL in a new tab
        var myWindow = window.open(url, "_blank");
  
        if (myWindow) {
          // Optionally, set the title of the new tab
          myWindow.addEventListener(
            "load",
            function () {
              myWindow.document.title = "Report Viewer";
            },
            false
          );
        } else {
          console.error("Popup blocked or failed to open.");
          alert("Unable to open the report. Please check your browser settings.");
        }
      }
    } catch (error) {
      setError("Error fetching data: " + error.message);
      setIsErrorModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubcategroywidereport = async () => {
    setLoading(true);
  
    const objlist = {
      Id: selectedSubCategoryId,
      Fromdate: scfromDate,
      Todate: sctoDate,
      Comid: branchId ?branchId : adminId,
    };
  
    console.log("Request Payload:", objlist);
  
    try {
      const data = await fetcsubcategoryreport(objlist);
      if (data) {
        // Ensure the URL is valid
        var url = data.Data4.trim().replace(/^"|"$/g, ""); // Remove extra quotes
        console.log("URL:", url);
  
        // Open the URL in a new tab
        var myWindow = window.open(url, "_blank");
  
        if (myWindow) {
          // Optionally, set the title of the new tab
          myWindow.addEventListener(
            "load",
            function () {
              myWindow.document.title = "Report Viewer";
            },
            false
          );
        } else {
          console.error("Popup blocked or failed to open.");
          alert("Unable to open the report. Please check your browser settings.");
        }
      }
    } catch (error) {
      setError("Error fetching data: " + error.message);
      setIsErrorModalOpen(true);
    } finally {
      setLoading(false);
    }
  };


  const fetchtopcustomerwise = async () => {
    setLoading(true);
  
    const objlist = {
      Fromdate: TfromDate,
      Todate: TctoDate,
      Comid: branchId ?branchId : adminId,
    };
  
    console.log("Request Payload:", objlist);
  
    try {
      const data = await fetcTopCustomer(objlist);
      if (data) {
        // Ensure the URL is valid
        var url = data.Data4.trim().replace(/^"|"$/g, ""); // Remove extra quotes
        console.log("URL:", url);
  
        // Open the URL in a new tab
        var myWindow = window.open(url, "_blank");
  
        if (myWindow) {
          // Optionally, set the title of the new tab
          myWindow.addEventListener(
            "load",
            function () {
              myWindow.document.title = "Report Viewer";
            },
            false
          );
        } else {
          console.error("Popup blocked or failed to open.");
          alert("Unable to open the report. Please check your browser settings.");
        }
      }
    } catch (error) {
      setError("Error fetching data: " + error.message);
      setIsErrorModalOpen(true);
    } finally {
      setLoading(false);
    }
  };



  const handleBranchChange = (e) => {
    const selectedBranchId = e.target.value;
    setBranchId(selectedBranchId);
  
    const branch = branchdata.find((b) => b?.Id?.toString() === selectedBranchId);
    console.log("Selected Branch:", branch);
  
 
    console.log("Selected Branch ID:", selectedBranchId);
    console.log("Selected Branch Name:", branch ? branch.BranchName : "Not Found");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Section */}
      <div className="w-1/5 h-full bg-white shadow-lg overflow-y-auto">
        <Slider />
      </div>

      {/* Main Content Section */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl  mx-auto bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-gray-700">Report Selection</h2>

          <form className="grid grid-cols-4 md:grid-cols-2 ">
            {/* Report Options */}
            <div className="space-y-4 mr-10 bg-white rounded-2xl shadow-md">
  <p className="font-bold text-2xl text-gray-700 mb-2">📊 Select Report Type</p>
  {[
    { label: "Sale Order Consolidated", value: "saleOrderConsolidated" },
    { label: "Sale Order Detailed", value: "saleOrderDetailed" },
    { label: "Itemswise Report", value: "itemswiseReport" },
    { label: "Category Wise Report", value: "categoryWiseReport" },
    { label: "SubCategory Wise Report", value: "subCategoryWiseReport" },
    { label: "Top Customer Wise Report", value: "topCustomerWiseReport" },
  ].map((report) => (
    <label
      key={report.value}
      className="flex items-center space-x-4 py-3 px-4 bg-gray-100 hover:bg-gray-200 transition-colors rounded-xl cursor-pointer text-gray-800 text-lg"
    >
      <input
        type="radio"
        name="report"
        className="accent-blue-600 w-5 h-5"
        value={report.value}
        onChange={handleReportChange}
      />
      <span>{report.label}</span>
    </label>
  ))}
</div>


            {/* Report Filters */}
            {selectedReport && (
           <div className="space-y-6 border-t pt-6">
          {selectedReport === "saleOrderConsolidated" && (
  <div className="bg-white shadow-md rounded-2xl p-6 space-y-6">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">Sale Order Consolidated Report</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Branch & Customer */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Branch</label>
          <select
            value={branchId}
            onChange={handleBranchChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            {branchdata.map((branch) => (
              <option key={branch.Id} value={branch.Id}>
                {branch.BranchName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Customer</label>
          <select
            value={selectedCustomerId}
            onChange={handleCustomerChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Select Customer</option>
            {customers.map((customer) => (
              <option key={customer.Id} value={customer.Id}>
                {customer.CustomerName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* From Date & To Date */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>
    </div>

    {/* Payment Type */}
    <div>
      <p className="text-sm font-semibold text-gray-700 mb-2">Payment Type</p>
      <div className="flex flex-wrap gap-4">
        {["COD", "ONLINE", "ALL"].map((type) => (
          <label key={type} className="inline-flex items-center space-x-2 text-sm">
            <input
              type="radio"
              name="payment"
              value={type}
              checked={paymentType === type}
              onChange={(e) => setPaymentType(e.target.value)}
              className="accent-blue-500"
            />
            <span className="capitalize">{type}</span>
          </label>
        ))}
      </div>
    </div>

    {/* View Button */}
    <div className="text-right">
      <button
        type="button"
        className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition duration-300"
        onClick={fetchsaleorderreport1data}
      >
        View Report
      </button>
    </div>
  </div>
)}


                 {(
                  selectedReport === "saleOrderDetailed") && (
                  <>
                    <div>


                    <div className="flex items-center space-x-2">
    <label className="text-sm font-medium text-gray-600">Branch:</label>
    <select
      value={branchId}
      onChange={handleBranchChange}
      className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
  
      {branchdata.map((branch) => (
        <option key={branch.Id} value={branch.Id}>
          {branch.BranchName}
        </option>
      ))}
    </select>
                   </div>


                      <label className="block mb-1 text-gray-600 font-medium text-base">
                        Customer
                      </label>
                      <select
                       className="w-full p-2 border rounded text-base"
                       value={selectedCustomerId}
                       onChange={handleCustomerChange}
                       >
                      <option value="">Select Customer</option>
                      {customers.map((customer) => (
                      <option key={customer.Id} value={customer.Id}>
                      {customer.CustomerName}
                      </option>
                       ))}
                       </select>
                    </div>
                    <div>
                <label className="block mb-1 text-gray-600 font-medium text-base">
                  From Date
                </label>
                <input
                  type="date"
                  className="w-full p-2 border rounded text-base"
                  value={fromDate} 
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-600 font-medium text-base">
                  To Date
                </label>
                <input
                  type="date"
                  className="w-full p-2 border rounded text-base"
                  value={toDate} 
                  onChange={(e) => setToDate(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
              <p className="font-medium text-gray-600 text-base">Payment Type:</p>
              {["COD", "ONLINE", "ALL"].map((type) => (
                <label
                  key={type}
                  className="inline-flex items-center space-x-2 mr-4 text-base"
                >
                  <input
                    type="radio"
                    name="payment"
                    value={type}
                    checked={paymentType === type} // Bind to paymentType state
                    onChange={(e) => setPaymentType(e.target.value)} // Update paymentType state
                  />
                  <span className="capitalize">{type}</span>
                </label>
              ))}
            </div>
                    {/* View Button */}
                    <div className="mt-4">
                    <button
                type="button"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                onClick={fetchsaleorderdetaireport} // Call the function
              >
                        View
                      </button>
                    </div>
                  </>
                )}

              
                {selectedReport === "itemswiseReport" && (
                  <>
                    <div>
                    <div className="flex items-center space-x-2">
    <label className="text-sm font-medium text-gray-600">Branch:</label>
    <select
      value={branchId}
      onChange={handleBranchChange}
      className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
     
      {branchdata.map((branch) => (
        <option key={branch.Id} value={branch.Id}>
          {branch.BranchName}
        </option>
      ))}
    </select>
                   </div>
              <label className="block mb-1 text-gray-600 font-medium text-base">
              Product Name
              </label>

  {/* Search Input */}
  <input
                type="text"
              placeholder="Search product..."
              className="w-full p-2 border rounded mb-2 text-base"
             value={searchTerm} // Bind to searchTerm state
               onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm state
             />

             {/* Product Dropdown */}
            <select
           className="w-full p-2 border rounded text-base"
           value={selectedProductId} // Bind to selectedProductId state
           onChange={handleProductChange} // Handle product selection
           >
           <option value="">Select Product</option>
           {filteredProducts.map((product) => (
           <option key={product.Id} value={product.Id}>
           {product.Description}
           </option>
           ))}
           </select>
           </div>
                    <div>

        
                      <label className="block mb-1 text-gray-600 font-medium text-base">
                        From Date
                      </label>
                      <input type="date" className="w-full p-2 border rounded text-base"   value={ifromDate}  onChange={(e) => setIfromDate(e.target.value)}  />
                    </div>
                    <div>
                      <label className="block mb-1 text-gray-600 font-medium text-base">
                        To Date
                      </label>
                      <input type="date" className="w-full p-2 border rounded text-base" value={itoDate}  onChange={(e) => setItoDate(e.target.value)} />
                    </div>
                    <div className="mt-4">
                      <button
                        type="button"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                        onClick={fetchItemmasterreport1data}
                      >
                        View
                      </button>
                    </div>
                  </>
                )}

                {selectedReport === "categoryWiseReport" && (
                  <>
                    <div>
                    <div className="flex items-center space-x-2">
    <label className="text-sm font-medium text-gray-600">Branch:</label>
    <select
      value={branchId}
      onChange={handleBranchChange}
      className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      
      {branchdata.map((branch) => (
        <option key={branch.Id} value={branch.Id}>
          {branch.BranchName}
        </option>
      ))}
    </select>
                   </div>
                      <label className="block mb-1 text-gray-600 font-medium text-base">
                        Category
                      </label>
                      <select
                     className="w-full p-2 border rounded text-base"
                     value={selectedCategoryId}
                     onChange={handlecategoryChange}
                    >
                   <option value="">Select Category</option>
                   {category.map((category) => (
                   <option key={category.Id} value={category.Id}>
                   {category.Category}
                   </option>
                    ))}
                   </select>
                    </div>
                    <div>
                      <label className="block mb-1 text-gray-600 font-medium text-base">
                        From Date
                      </label>
                      <input type="date" className="w-full p-2 border rounded text-base"  value={cfromDate}  onChange={(e) => setCfromDate(e.target.value)} />
                    </div>
                    <div>
                      <label className="block mb-1 text-gray-600 font-medium text-base">
                        To Date
                      </label>
                      <input type="date" className="w-full p-2 border rounded text-base"   value={ctoDate}  onChange={(e) => setCtoDate(e.target.value)} />
                    </div>
                
                    <div className="mt-4">
                      <button
                        type="button"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                        onClick={fetchcategroywidereport}
                      >
                        View
                      </button>
                    </div>
                  </>
                )}

                {selectedReport === "subCategoryWiseReport" && (
                  <>
                    <div>
                    <div className="flex items-center space-x-2">
    <label className="text-sm font-medium text-gray-600">Branch:</label>
    <select
      value={branchId}
      onChange={handleBranchChange}
      className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
    
      {branchdata.map((branch) => (
        <option key={branch.Id} value={branch.Id}>
          {branch.BranchName}
        </option>
      ))}
    </select>
                   </div>
                      <label className="block mb-1 text-gray-600 font-medium text-base">
                        SubCategory
                      </label>
                      <select
                     className="w-full p-2 border rounded text-base"
                     value={selectedSubCategoryId}
                     onChange={handleSubcategoryChange}
                    >
                   <option value="">Select SubCategory</option>
                   {subCategories.map((subCategories) => (
                   <option key={subCategories.Id} value={subCategories.Id}>
                   {subCategories.SubCategory}
                   </option>
                    ))}
                   </select>
                    </div>
                    <div>
                      <label className="block mb-1 text-gray-600 font-medium text-base"     value={scfromDate}  onChange={(e) => setScfromDate(e.target.value)}>
                        From Date
                      </label>
                      <input type="date" className="w-full p-2 border rounded text-base"    value={sctoDate}  onChange={(e) => setSctoDate(e.target.value)}/>
                    </div>
                    <div>
                      <label className="block mb-1 text-gray-600 font-medium text-base">
                        To Date
                      </label>
                      <input type="date" className="w-full p-2 border rounded text-base" />
                    </div>
     
                    <div className="mt-4">
                      <button
                        type="button"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                        onClick={fetchSubcategroywidereport}
                      >
                        View
                      </button>
                    </div>
                  </>
                )}

                {selectedReport === "topCustomerWiseReport" && (
                  <>
                    <div>

                    <div className="flex items-center space-x-2">
    <label className="text-sm font-medium text-gray-600">Branch:</label>
    <select
      value={branchId}
      onChange={handleBranchChange}
      className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      
      {branchdata.map((branch) => (
        <option key={branch.Id} value={branch.Id}>
          {branch.BranchName}
        </option>
      ))}
    </select>
                   </div>
                      <label className="block mb-1 text-gray-600 font-medium text-base"  >
                        From Date
                      </label>
                      <input type="date" className="w-full p-2 border rounded text-base"  value={TfromDate}  onChange={(e) => setTfromDate(e.target.value)}  />
                    </div>
                    <div>
                      <label className="block mb-1 text-gray-600 font-medium text-base">
                        To Date
                      </label>
                      <input type="date" className="w-full p-2 border rounded text-base"   value={TctoDate}  onChange={(e) => setTtoDate(e.target.value)} />
                    </div>
                    {/* View Button */}
                    <div className="mt-4">
                      <button
                        type="button"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                        onClick={fetchtopcustomerwise}
                      >
                        View
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportView;