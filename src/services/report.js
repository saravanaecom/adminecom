import APIRoutes from '../routes/APIRoutes';
import {ServerURL} from '../../src/server/serverUrl';
export const fetcsaleorderreportdata1 = async (objlist) => {
    try {
       
       const response = await fetch(`${APIRoutes.APP_SALEOREDEREPORT1}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(objlist),
      });
  
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.error("Error fetching Area:", response.statusText);
        return [];
      }
    } catch (error) {
      console.error("API call failed:", error);
      throw error;
    }
  };
  export const fetcItemmasterreportdata = async (objlist) => {
    try {
       
       const response = await fetch(`${APIRoutes.APP_ITEMMASTERREPORT}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(objlist),
      });
  
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.error("Error fetching Area:", response.statusText);
        return [];
      }
    } catch (error) {
      console.error("API call failed:", error);
      throw error;
    }
  };




  export const fetcsaleorderdetailreport = async (objlist) => {
    try {
       
       const response = await fetch(`${APIRoutes.APP_SALEOREDERDDETAILS}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(objlist),
      });
  
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.error("Error fetching Area:", response.statusText);
        return [];
      }
    } catch (error) {
      console.error("API call failed:", error);
      throw error;
    }
  };



  export const fetccategoryreport = async (objlist) => {
    try {
       
       const response = await fetch(`${APIRoutes.APP_CATEGORYWISEREPORT}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(objlist),
      });
  
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.error("Error fetching Area:", response.statusText);
        return [];
      }
    } catch (error) {
      console.error("API call failed:", error);
      throw error;
    }
  };


  export const fetcsubcategoryreport = async (objlist) => {
    try {
       
       const response = await fetch(`${APIRoutes.APP_SUBCATEGORYWISEREPORT}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(objlist),
      });
  
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.error("Error fetching Area:", response.statusText);
        return [];
      }
    } catch (error) {
      console.error("API call failed:", error);
      throw error;
    }
  };


  export const fetcTopCustomer = async (objlist) => {
    try {
       
       const response = await fetch(`${APIRoutes.APP_TOPCUSTOMERWISEREPORT}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(objlist),
      });
  
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.error("Error fetching Area:", response.statusText);
        return [];
      }
    } catch (error) {
      console.error("API call failed:", error);
      throw error;
    }
  };

