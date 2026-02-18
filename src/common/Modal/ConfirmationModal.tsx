import React from 'react';

type ModalProps = {
  message: string;
  onConfirm: () => void;
  onCancel: (e: React.MouseEvent) => void;
  confirmButtonTitle: string;
  cancelButtonTitle?: string;
};

const ConfirmationModal = ({
  message,
  onConfirm,
  onCancel,
  confirmButtonTitle,
  cancelButtonTitle,
}: ModalProps): React.ReactElement => {
  return (
    <>
      <section className="fixed inset-0 bg-gray-400 bg-opacity-30 flex justify-center items-center z-40">
        <main className="z-50 rounded-[4px] p-8 md:p-10 lg:p-12 xl:p-16 2xl:p-20 bg-white shadow-md drop-shadow-md text-center flex flex-col justify-center items-center space-y-10 w-2/3 max-w-4xl">
          <div className="max-h-auto w-full whitespace-normal">
            <p className="primaryHeadings font-medium break-words w-full">
              {message}
            </p>
          </div>
          <div className="flex justify-center items-center space-x-8">
            <button
              onClick={onCancel}
              className="primaryHeadings text-bgPrimaryButton hover:text-secondaryText px-6 py-[6px] font-semibold rounded-md border border-bgPrimaryButton hover:border-secondaryText hover:scale-105 transition-transform"
              type="button"
            >
              {cancelButtonTitle}
            </button>
            <button
              onClick={onConfirm}
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

export default ConfirmationModal;
