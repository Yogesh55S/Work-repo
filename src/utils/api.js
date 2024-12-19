export const fetchWithAuth = async (url, token) => {
    if (!token) {
      throw new Error("No token provided");
    }
  
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized: Invalid or expired token");
        }
        throw new Error(`Request failed with status ${response.status}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error("Error in fetchWithAuth:", error.message);
      throw error;
    }
  };
  