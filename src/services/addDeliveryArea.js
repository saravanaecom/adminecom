
import APIRoutes from '../routes/APIRoutes';
export const insertDeliveryArea1 = async (objlist) => {
    try {
      const response = await fetch(`${APIRoutes.APP_INSERTDELIVERYAREA}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          objData:""
        },
        body: JSON.stringify(objlist),
      });
      console.log(response)
      if (response.ok) {
        return true;
      } else {
        console.error("API response error:", response.status, response.Message);
        return false;
      }
    } catch (error) {
      console.error("Error saving area:", error);
      return false;
    }
  };



  export const insertDeliveryArea = async (objlist) => {
    try {
      const response = await fetch(`${APIRoutes.APP_INSERTDELIVERYAREA}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          objData:""
        },
        body: JSON.stringify(objlist),
      });
      console.log(response)
      if (response.ok) {
        return true;
      } else {
        console.error("API response error:", response.status, response.Message);
        return false;
      }
    } catch (error) {
      console.error("Error saving area:", error);
      return false;
    }
  };





  export const fetchSelectDeliveryarea = async (adminId) => {
    let objlist = {
        Comid: adminId,
    };
    
    try {
        const response = await fetch(`${APIRoutes.APP_SELECTDElIVERYAREA}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
              
            },
            body: JSON.stringify(objlist),
        });
  
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
  
        const data = await response.json();
        
        if (!data || !Array.isArray(data)) {
            throw new Error('No data found.');
        }
  
        return data;
    } catch (error) {
        console.error('Failed to fetch product details:', error);
        throw error; 
    }
  };


  export const DeleteArea = async (Id) => {
    try {
      let objlist = { Id: Id };
      console.log(objlist)
      const response = await fetch(`${APIRoutes.APP_DELETEAREA}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          objData : ""
        },
        body: JSON.stringify(objlist),
      });
      console.log(response)
      if (response.ok) {
       
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error deleting area:", error);
      return false;
    }
  };







  export const ExcelDownload = async (adminId) => {

    
    try {
        const response = await fetch(`${APIRoutes.APP_DOWNLOAD}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
              
            },
          
        });
  
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
  
        const fileUrl = await response.text(); // If the API sends a raw URL string
        // const { url } = await response.json(); // Use this line instead if the API sends { "url": "..." }

        if (!fileUrl || typeof fileUrl !== 'string') {
            throw new Error('Invalid file URL received.');
        }

        return fileUrl;
    } catch (error) {
        console.error('Failed to fetch product details:', error);
        throw error; 
    }
  };