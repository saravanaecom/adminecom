import APIRoutes from '../routes/APIRoutes';
import {ServerURL} from '../../src/server/serverUrl';
export const fetctopsaleproduct = async (adminId) => {
    try {
        let objlist = {
            Comid: adminId, 
          };
       const response = await fetch(`${APIRoutes.APP_TOPSALEPRODUCT}`, {
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