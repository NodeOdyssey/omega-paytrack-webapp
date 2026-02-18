import { useEffect, useRef } from 'react';

type UseInputChangeDelayProps = {
  input: string;
  delay: number;
  updateInput: (input: string) => void;
};

const useInputChangeDelay = ({
  input,
  delay,
  updateInput,
}: UseInputChangeDelayProps) => {
  const timerRef = useRef<number | undefined>();

  useEffect(() => {
    const handleDelayedInputChange = () => {
      if (input) {
        updateInput(input);
      } else {
        updateInput('');
      }
    };

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(handleDelayedInputChange, delay);
  }, [input]);
};

export default useInputChangeDelay;
