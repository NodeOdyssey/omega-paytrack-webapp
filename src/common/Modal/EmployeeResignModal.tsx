/* Libraries */
import React, { useState } from 'react';
import { AxiosError } from 'axios';
import * as Yup from 'yup';

/* Hooks */
import useVerifyUserAuth from '../../hooks/useVerifyUserAuth';
import useHandleYupError from '../../hooks/useHandleYupError';
import useHandleAxiosError from '../../hooks/useHandleAxiosError';

/* Components */
// import SecondaryButton from '../Button/SecondaryButton';
// import PrimaryButton from '../Button/PrimaryButton';
import Loader from '../Loader/Loader';

type EmployeeResignModalProps = {
  message: string;
  onConfirm: (e: React.FormEvent) => void;
  onCancel: () => void;
  updateResignDate: (date: Date | null) => void;
  confirmButtonTitle: string;
  cancelButtonTitle?: string;
};

// Validation schema for schedule employee data row
const resignEmployeeValidationSchema = Yup.object().shape({
  resignDate: Yup.date()
    .required('Please enter the date of resign')
    .test('not-2000', 'Please select a valid date of resign', (value) => {
      return value && value.getFullYear() !== 2000;
    }),
});

const EmployeeResignModal: React.FC<EmployeeResignModalProps> = ({
  message,
  onConfirm,
  onCancel,
  updateResignDate,
  confirmButtonTitle,
  cancelButtonTitle,
}) => {
  /* Verify User Auth */
  const accessToken = useVerifyUserAuth();

  /* Error Handling */
  const { errors, setErrors } = useHandleYupError();
  const { handleAxiosError } = useHandleAxiosError(setErrors);

  /* Loader */
  const [isLoading, setIsLoading] = useState(false);

  /* Dishcarge Controls */
  const [resignDate, setResignDate] = useState<Date | null>(
    null
  );

  const handleSaveClick = async (e: React.FormEvent) => {
    if (!accessToken) return;
    setIsLoading(true);
    setErrors({});

    try {
      await resignEmployeeValidationSchema.validate(
        {
          resignDate,
        },
        { abortEarly: false }
      );

      onConfirm(e);
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        setErrors({ error: error.inner[0].message });
      } else {
        handleAxiosError(error as AxiosError);
      }
    } finally {
      setIsLoading(false);
    }
  };
  // JSX here
  return (
    <>
      {isLoading && <Loader />}
      <section className="fixed inset-0 bg-gray-400 bg-opacity-30 flex justify-center items-center z-40">
        <main className="z-50 rounded-md py-[3%] w-[50%] h-auto bg-white shadow-md drop-shadow-md text-center flex flex-col justify-center items-center space-y-10">
          <p className="primaryHeadings font-medium px-6">{message}</p>
          <div className="w-[60%]">
            <div className="flex text-center overflow-x-auto max-h-[60vh] justify-center">
              <table className="w-[300px] bg-white border border-accordionBg">
                <thead className="text-center text-primaryText border border-accordionBg sticky top-0">
                  <tr className="bg-tableHeadingColour">
                    <th
                      className="py-3 px-4 border border-tableBorder font-medium text-sm lg:text-base"
                      rowSpan={2}
                    >
                      Date of Resign
                    </th>
                  </tr>
                </thead>
                <tbody className="text-primaryText border border-tableBorder">
                  <tr className="border border-tableBorder h-16">
                    <td className="px-2 py-2 h-10 text-xs lg:text-sm xl:text-base border border-tableBorder">
                      <input
                        type="date"
                        name="date"
                        id="date"
                        onChange={(e) => {
                          updateResignDate(new Date(e.target.value));
                          setResignDate(new Date(e.target.value));
                        }}
                        className="w-full h-full bg-white border rounded-lg py-2 px-2 max-h-60 cursor-pointer"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {errors.error && (
              <div className="text-red-500 mt-4 text-center">
                <p>{errors.error}</p>
              </div>
            )}
          </div>
          <div className="flex justify-center gap-8">
            <button
              onClick={onCancel}
              className="primaryHeadings text-bgPrimaryButton hover:text-secondaryText px-6 py-[6px] font-semibold rounded-md border border-bgPrimaryButton hover:border-secondaryText hover:scale-105 transition-transform"
              type="button"
            >
              {cancelButtonTitle}
            </button>
            {/* <SecondaryButton onClick={onCancel}>
              {cancelButtonTitle}
            </SecondaryButton> */}
            {/* <PrimaryButton onClick={handleSaveClick}>
              {confirmButtonTitle}
            </PrimaryButton> */}
            <button
              onClick={handleSaveClick}
              className="primaryHeadings bg-errorColour text-white hover:scale-105 transition-transform rounded-md px-6 py-[6px] font-semibold border-errorColour border-2"
              type="button"
            >
              {confirmButtonTitle}
            </button>
          </div>
        </main>
      </section>
    </>
  );
};

export default EmployeeResignModal;
