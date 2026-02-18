import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

function useBackButtonHandler() {
  const navigate = useNavigate();

  const handleClickBackButton = useCallback(
    (e: React.MouseEvent) => {
      // console.log('handleClickBackButton');
      e.preventDefault();
      e.stopPropagation();
      navigate(-1);
    },
    [navigate]
  );

  return handleClickBackButton;
}

export default useBackButtonHandler;
