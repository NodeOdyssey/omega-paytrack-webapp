import { useEffect, useRef, useCallback } from 'react';
import { Rank } from '../types/rank';
import { Post } from '../types/post';
import { Employee } from '../types/employee';

type SupportedTypes = Rank | Post | Employee;
// type UseInputObjectChangeDelayProps<T> = {
//   inputObject: T;
//   delay: number;
//   updateInputObject: (inputObject: T) => void;
// };

// const useInputObjectChangeDelay = <T extends object>({
//   inputObject,
//   delay,
//   updateInputObject,
// }: UseInputObjectChangeDelayProps<T>) => {
//   const timerRef = useRef<ReturnType<typeof setTimeout>>();

//   useEffect(() => {
//     if (timerRef.current) {
//       clearTimeout(timerRef.current);
//     }

//     timerRef.current = setTimeout(() => {
//       updateInputObject(inputObject);
//     }, delay);

//     return () => {
//       if (timerRef.current) {
//         clearTimeout(timerRef.current);
//       }
//     };
//   }, [inputObject]);
// };

// export default useInputObjectChangeDelay;

type UseInputChangeDelayProps<T extends SupportedTypes> = {
  delay: number;
  updateInputObject: (inputObject: T) => void;
};

const useInputObjectChangeDelay = <T extends SupportedTypes>({
  delay,
  updateInputObject,
}: UseInputChangeDelayProps<T>) => {
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const handleChange = useCallback(
    (updatedData: T) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        updateInputObject(updatedData);
      }, delay);
    },
    [delay, updateInputObject]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return handleChange;
};

export default useInputObjectChangeDelay;
