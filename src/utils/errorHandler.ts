import axios from 'axios';
import { toast } from 'react-toastify';

export const handleApiError = (error: unknown) => {
  console.error('Error:', error); // TODO: Remove console.error
  if (axios.isAxiosError(error)) {
    if (error.response) {
      console.error('Error response:', error.response.data);
      toast.error(error.response.data.message);
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
  } else {
    console.error('Unexpected error:', error);
  }
};
