// src/validators/login.ts
import * as Yup from 'yup';

export const loginValidationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid Email format')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(20, 'Password must not exceed 20 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()]).{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    ),
});

// Utility function to validate data and return either value or errors
export const validateLogin = async (formData: {
  email: string;
  password: string;
}) => {
  try {
    const validated = await loginValidationSchema.validate(formData, {
      abortEarly: false,
    });
    return { success: true, data: validated, errors: null };
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      const errors: { [key: string]: string } = {};
      error.inner.forEach((err) => {
        if (err.path) errors[err.path] = err.message;
      });
      return { success: false, data: null, errors };
    }
    // Unknown error
    return {
      success: false,
      data: null,
      errors: { general: 'Validation failed' },
    };
  }
};
