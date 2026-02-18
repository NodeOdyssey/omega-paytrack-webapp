// Libraries
import { useNavigate } from 'react-router';
import { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';

// Types
interface ErrorResponseData {
  field?: string;
  message: string;
}

type CustomAxiosResponse = AxiosResponse<ErrorResponseData>;

const useHandleAxiosError = (
  setErrors: (errors: { [key: string]: string }) => void
) => {
  // const [axiosErrors, setAxiosErrors] = useState({}); // TODO: Error for Axios separate later

  const navigate = useNavigate();

  const handleAxiosError = (error: AxiosError) => {
    const { response, request, message } = error;

    console.error('Error:', error);
    if (response) {
      const data = (response as CustomAxiosResponse).data;

      if (response.status === 500) {
        navigate('dashboard/500');
      } else if (response.status === 409) {
        if (data.field) {
          setErrors({ [data.field]: data.message });
        } else {
          toast.error(data.message);
        }
      } else if (response.status === 404) {
        data.message && toast.error(data.message);
      } else if (response.status === 401) {
        navigate('/paytrack/auth/login');
      } else if (response.status === 400) {
        setErrors({ [data.field || '']: data.message });
      } else {
        console.error('Error response:', response.data);
      }
    } else if (request && 'responseURL' in request) {
      console.error('Error request:', request);
    } else {
      console.error('Error message:', message);
    }
  };

  return { handleAxiosError };
};

export default useHandleAxiosError;
