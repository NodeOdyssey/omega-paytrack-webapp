// Libraries
// import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { api } from '../configs/api';

// Custom hook
const useVerifyUserAuth = () => {
  const [token, setToken] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      // Retrieve the access token from local storage
      const accessTokenFromLocalStorage = localStorage.getItem('accessToken');

      // console.log('access token inside hook: ', accessTokenFromLocalStorage);
      // If the access token is not found, navigate to the login page
      if (!accessTokenFromLocalStorage) {
        setToken(null);
        navigate('/paytrack/auth/login');
      }
      if (accessTokenFromLocalStorage) {
        // Verify the access token using the API
        // try {
        //   const response = await axios.post(
        //     `${api.baseUrl}/auth/verify/${accessTokenFromLocalStorage}`
        //   );
        //   if (!response.data.success) {
        //     setToken(accessTokenFromLocalStorage);
        //     console.log('Token is valid');
        //   }
        // } catch (error) {
        //   setToken(null);
        //   navigate('/paytrack/auth/login');
        // }
        setToken(accessTokenFromLocalStorage);
      }
    };
    verifyToken();
  }, [navigate]);

  return token;
};

export default useVerifyUserAuth;
