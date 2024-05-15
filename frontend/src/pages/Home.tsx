import axios from "axios";
import { useEffect } from "react";

// axios.defaults.withCredentials = true;

export const Home = () => {
  useEffect(() => {
    // Function to fetch username from backend
    const fetchUsername = async () => {
      try {
        const response = await axios({
          method: "GET",
          url: import.meta.env.VITE_LINK + "/getUsername",
          withCredentials: true
        })

        console.log("Response: " ,response)
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    };

    // Call the function to fetch username when the component mounts
    fetchUsername();
  }, []);

  return (
    <div>Home</div>
  )
}
