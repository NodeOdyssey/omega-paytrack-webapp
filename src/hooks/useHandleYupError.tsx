// Libraries
import { useState } from 'react';
import { ValidationError } from 'yup';

// Types
export type Errors = { [key: string]: string };

const useHandleYupError = () => {
  const [errors, setErrors] = useState<Errors>({});

  const handleYupError = (error: ValidationError) =>
    setErrors(
      error.inner.reduce(
        (acc, err) => (err.path ? { ...acc, [err.path]: err.message } : acc),
        {}
      )
    );

  // const handleYupError = (error: ValidationError) => {
  //   const newError: { [key: string]: string } = {};
  //   console.log('new error in yup:', error);
  //   error.inner.forEach((err) => {
  //     console.log('err:', err);
  //     if (err.path) newError[err.path] = err.message;
  //   });
  //   setErrors(newError);
  // };

  return { errors, handleYupError, setErrors };
};

export default useHandleYupError;
