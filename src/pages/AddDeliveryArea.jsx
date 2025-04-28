import React, { useState, useEffect } from "react";
import Slider from "../components/sidebar";
import { useParams, useNavigate } from "react-router-dom";
import { insertDeliveryArea } from "../services/addDeliveryArea";
import SuccessModal from "../components/sucessmodel";
import ErrorModal from "../components/error";
import { fetchSelectCompanyAdmin } from "../services/branch";

const AddDeliveryArea = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State Variables
  const [pincode, setPincode] = useState(""); 
  const [message, setMessage] = useState(""); 
  const [adminId, setAdminId] = useState(null); 
  const [loading, setLoading] = useState(false); 
  const [errorMessage, setErrorMessage] = useState(""); 
  const [branchdata, setBranchdata] = useState([]); 
  const [selectBranchId, setSelectBranchId] = useState(""); 
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false); 
  const [successMessage, setSuccessMessage] = useState(""); 
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Fetch Admin ID from localStorage
  useEffect(() => {
    const adminUserId = JSON.parse(localStorage.getItem("adminuserid"));
    if (!adminUserId) {
      alert("Session Closed. Please Login Again!");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } else {
      setAdminId(Number(adminUserId));
    }
  }, [navigate]);

  // Fetch Branch Data
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

  // Handle Branch Selection
  const handleBranchChange = (e) => {
    const selectedBranchId = e.target.value; 
    const branch = branchdata.find((b) => b.Id.toString() === selectedBranchId); 
    setSelectBranchId(selectedBranchId); 
    console.log("Selected Branch ID:", selectedBranchId);
    console.log("Selected Branch Name:", branch ? branch.BranchName : "");
  };

  // Fetch Pincode Data from LocalStorage
  useEffect(() => {
    const Pincodelists = JSON.parse(localStorage.getItem("Deliveryarea"));
    if (Pincodelists) {
      const Pincode = Pincodelists.find((Pincode) => Pincode.Id === parseInt(id));
      if (Pincode) {
        setPincode(Pincode.pincode);
      }
    }
  }, [id]);

  // Close Success Modal
  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
  };

  // Close Error Modal
  const closeModal = () => {
    setIsErrorModalOpen(false);
  };

  // Handle Save Button Click
  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    const objlist = {
      CompanyRefid: selectBranchId,
      Id: id ? parseInt(id) : "",
      pincode: pincode,
      Active: 1,
    };

    console.log(objlist);

    try {
      const success = await insertDeliveryArea([objlist]);
      if (success === true) {
        setSuccessMessage("DeliveryArea saved successfully!");
        setIsSuccessModalOpen(true);
        setTimeout(() => {
          navigate(`/DeliveryArea`);
        }, 2000);
      } else {
        setErrorMessage(success || "This DeliveryArea already exists.");
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

  useEffect(() => {
    if (branchdata.length > 0) {
      setSelectBranchId(branchdata[0].Id.toString()); // Set the initial value to the first branch ID
    }
  }, [branchdata]);



  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="flex-shrink-0">
        <Slider />
      </div>

      {/* Content */}
      <div className="flex-grow p-8">
        <h2 className="text-2xl font-semibold mb-4">Add Delivery Area</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          {/* Branch Dropdown */}
          <label htmlFor="branch" className="block mb-2 font-medium">
            Select Branch:
          </label>
          <select
            id="branch"
            className="w-full p-2 border rounded-md mb-4"
            value={selectBranchId}
            onChange={handleBranchChange}
          >
            
            {branchdata.map((branch) => (
              <option key={branch.Id} value={branch.Id}>
                {branch.BranchName}
              </option>
            ))}
          </select>

          {/* Pincode Input */}
          <label htmlFor="pincode" className="block mb-2 font-medium">
            Enter Pincode:
          </label>
          <input
            type="text"
            id="pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            placeholder="Enter Pincode"
            className="w-full p-2 border rounded-md mb-4"
          />

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Add Pincode
          </button>
          {message && (
            <p className="mt-4 text-sm font-medium text-green-600">
              {message}
            </p>
          )}
        </div>
      </div>

      {/* Modals */}
      {isSuccessModalOpen && (
        <SuccessModal message={successMessage} onClose={closeSuccessModal} />
      )}
      {isErrorModalOpen && (
        <ErrorModal message={errorMessage} onClose={closeModal} />
      )}
    </div>
  );
};

export default AddDeliveryArea;