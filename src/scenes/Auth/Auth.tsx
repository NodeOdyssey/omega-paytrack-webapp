import React from 'react';
// Libraries
import { useParams } from 'react-router';

// Components
import EnterOTP from './EnterOTP';
import ForgotPassword from './ForgotPassword';
import Login from './Login';
import SetNewPassword from './SetNewPassword';
import Error404 from '../Error/Error404';

export const Auth = (): React.ReactElement => {
  const { action } = useParams<{ action: string }>();

  let Component;
  switch (action) {
    case 'login':
      Component = Login;
      break;
    case 'reset-password':
      Component = ForgotPassword;
      break;
    case 'enter-otp':
      Component = EnterOTP;
      break;
    case 'set-new-password':
      Component = SetNewPassword;
      break;
    default:
      Component = Error404; // TODO: Fujaiel, please display 404 page here
  }
  return <Component />;
};
