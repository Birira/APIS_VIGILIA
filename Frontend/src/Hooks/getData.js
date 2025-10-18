/**
 * Base URL for the FastAPI backend
 */
const API_BASE_URL = 'http://168.181.186.157:80';

/**
 * Function to fetch data from the FastAPI backend
 * @returns {Promise<Array>} The data from the API
 */
export const getData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

/**
 * Function to test API connectivity
 * @returns {Promise<Object>} Status response from the API
 */
export const pingApi = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/ping`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error pinging API:', error);
    return { status: 'error', message: error.message };
  }
};
