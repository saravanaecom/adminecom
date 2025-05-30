import React, { useState, useEffect } from "react";
import Slider from "../components/sidebar";
import { useNavigate } from "react-router-dom";
import { fetchSelectDeliveryarea, DeleteArea } from "../services/addDeliveryArea";
import * as XLSX from "xlsx";
import { insertDeliveryArea,ExcelDownload  } from "../services/addDeliveryArea";
import { fetchSelectCompanyAdmin } from "../services/branch";

const DeliveryArea = () => {
  const [adminId, setAdminId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState(10);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();
  const [excelFile, setExcelFile] = useState(null);
  const [typeError, setTypeError] = useState(null);
  const [excelData, setExcelData] = useState([]);
   const [branchdata, setBranchdata] = useState([]); 
  const [errorMessage, setErrorMessage] = useState("");
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [selectBranchId, setSelectBranchId] = useState("");
 const [filterCompany,setFilterCompany] = useState([]);
 const [CompanyId,setCompanyId] = useState([]);

  // Handle file upload
  const handleFile=(e)=>{
    let fileTypes = ['application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','text/csv'];
    let selectedFile = e.target.files[0];
    if(selectedFile){
      if(selectedFile&&fileTypes.includes(selectedFile.type)){
        setTypeError(null);
        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload=(e)=>{
          setExcelFile(e.target.result);
        }
      }
      else{
        setTypeError('Please select only excel file types');
        setExcelFile(null);
      }
    }
    else{
      console.log('Please select your file');
    }
  }
  const handleFileSubmit = (e) => {
    e.preventDefault();
    if (excelFile !== null) {
      const workbook = XLSX.read(excelFile, { type: "binary" });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);

      const mappedData = data.map((row) => {
        const company = filterCompany.find(
          (company) => company.CompanyName.toLowerCase() === row.companyname.toLowerCase()
        );
        return {
          ...row,
          CompanyRefId: company ? company.CompanyRefId : null, 
        };
      });
  
      setExcelData(mappedData); 

console.log(mappedData); // Log the mapped data
     
      console.log(excelData) // Defaults to an array
    } else {
      setExcelData([]); // Ensure it's always an array
    }
  };
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
     
     

    const productsToSave = excelData.map((product) => {
      return {
        CompanyRefId: product.CompanyRefId,
        pincode: product.pincode,
        Active:1
      };
    });

    console.log(productsToSave);
  
    try {
      const success = await insertDeliveryArea(productsToSave);
      console.log(success);
  
      if (success === true) {
        setSuccessMessage("DeliveryArea saved successfully!");
        setIsSuccessModalOpen(true);
        setTimeout(() => {
          navigate(`/DeliveryArea`);
        }, 2000); 
      } else {
        setErrorMessage(success || "This DeliveryArea is already Exits.");
        setIsErrorModalOpen(true);
      }
    } catch (error) {
      console.error("Error during DeliveryArea save:", error);
      setErrorMessage("An error occurred while saving the DeliveryArea.");
      setIsErrorModalOpen(true);
    } finally {
      setLoading(false);
    }
  };
  const DownloadExcel = async () => {
    setLoading(true);

    try {
      const data = await ExcelDownload();
      if (data) {
        // Ensure the URL is valid
        var url = data.trim().replace(/^"|"$/g, ""); // Remove extra quotes
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
      
      setIsErrorModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const adminUserId = JSON.parse(localStorage.getItem("adminuserid"));
    if (!adminUserId) {
      alert("Session Closed. Please Login Again!");
      navigate("/");
    } else {
      setAdminId(Number(adminUserId));
    }
  }, [navigate]);

  useEffect(() => {
    if (adminId) {
      setLoading(true);
      const fetchDelivery = async () => {
        try {
          const DeliveryAreaData = await fetchSelectDeliveryarea(adminId);
          localStorage.setItem("Deliveryarea", JSON.stringify(DeliveryAreaData));
          setFilteredProducts(DeliveryAreaData);
          setFilterCompany(DeliveryAreaData);
          setTotalPages(Math.ceil(DeliveryAreaData.length / rows));
        } catch (error) {
          console.error("Failed to fetch DeliveryArea", error);
        } finally {
          setLoading(false);
        }
      };
      fetchDelivery();
    }
  }, [adminId, rows]);

  const handleAddDelivery = () => {
    navigate("/AddDeliveryArea/:id");
  };

  const handleEdit = (id) => {
    navigate(`/AddDeliveryArea/${id}`);
  };

  const handleDeleteClick = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this area?");
    if (!confirmDelete) return;

    try {
      const isDeleted = await DeleteArea(id);

      if (isDeleted) {
        setFilteredProducts((prevCoupons) => prevCoupons.filter((coupon) => coupon.Id !== id));
        alert("Area deleted successfully.");
      } else {
        alert("Failed to delete the area. Please try again.");
      }
    } catch (error) {
      alert("Error deleting the area: " + error.message);
    }
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
  

    const handleBranchChange = (e) => {
      const selectedBranchId = e.target.value; 
      const branch = branchdata.find((b) => b.Id.toString() === selectedBranchId); 
      setSelectBranchId(selectedBranchId); 
    
      if (selectedBranchId === "") {
        setFilteredProducts(filterCompany); // Show all products
      } 
      else {
        setFilteredProducts(
          filterCompany.filter(
            (product) => product.CompanyRefId.toString() === selectedBranchId
          )
        );
      }
      
      console.log("Selected Branch ID:", selectedBranchId);
      console.log("Selected Branch Name:", branch ? branch.BranchName : "");
    };

    useEffect(() => {
      if (adminId !== null) {
        fetchAdminData();
      }
    }, [adminId]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="flex-shrink-0">
        <Slider />
      </div>

      {/* Main Content */}
      <div className="flex-grow p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Delivery Area</h1>
         
        </div>

        {/* File Upload Form */}
        <div className="flex justify-between items-center mb-6">
        <div>
      <form
        className="flex items-center space-x-2"
        onSubmit={handleFileSubmit}
      >
        <input
          type="file"
          className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
          onChange={handleFile}
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-200"
        >
          Upload
        </button>
        <label htmlFor="branch" className="block mb-2 font-medium">
            Select Company:
          </label>
          <select
            id="branch"
            className="w-full p-2 border rounded-md mb-4"
            value={selectBranchId}
            onChange={handleBranchChange}
          >
            <option value="">All Company</option>
            {branchdata.map((branch) => (
              <option key={branch.Id} value={branch.Id}>
                {branch.BranchName}
              </option>
            ))}
          </select>

          
       

        {typeError && (
          <div
            className="text-sm text-red-600 bg-red-100 px-3 py-2 rounded-lg shadow-md"
            role="alert"
          >
            {typeError}
          </div>
        )}
      </form>
   
      {excelData && excelData.length > 0 && (
        <button
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-200"
          onClick={handleSave}
        >
          Save to Database
        </button>
      )}
    </div>

    <button
    onClick={DownloadExcel}
    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition duration-300"
  >
    Download Excel For
  </button>


  <button
    onClick={handleAddDelivery}
    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition duration-300"
  >
    + Add Pincode
  </button>
</div>


        {/* Table Container */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <span className="text-lg">Loading...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-4 py-2 text-left">S. No.</th>
                    <th className="px-4 py-2 text-left">Pincode</th>
                    <th className="px-4 py-2 text-left">CompanyName</th>
                    <th className="px-4 py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product, index) => (
                    <tr
                      key={index}
                      className={`border-b ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-gray-100 transition-all duration-200`}
                    >
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">{product.pincode}</td>
                      <td className="px-4 py-2">{product.CompanyName}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleEdit(product.Id)}
                          className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-400 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(product.Id)}
                          className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-400 ml-2 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <button className="px-4 py-2 bg-gray-200 rounded-md mx-2 hover:bg-gray-300">Prev</button>
            <button className="px-4 py-2 bg-gray-200 rounded-md mx-2 hover:bg-gray-300">Next</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryArea;
