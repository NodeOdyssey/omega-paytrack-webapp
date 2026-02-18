import React from 'react';
import { AdminModal_Close_Icon } from '../../assets/icons';

type ModalProps = {
  message: string;
  redeployServer: () => void;
  redeployClient: (e: React.MouseEvent) => void;
  onClose: () => void;
  redeployServerButtonTitle: string;
  redeployClientButtonTitle?: string;
};

const AdminSettingsModal = ({
  message,
  redeployServer,
  redeployClient,
  redeployServerButtonTitle,
  redeployClientButtonTitle,
  onClose,
}: ModalProps): React.ReactElement => {
  return (
    <>
      <section
        onClick={onClose}
        className="fixed inset-0 bg-gray-400 bg-opacity-30 flex justify-center items-center z-40"
      >
        <main
          onClick={(e) => e.stopPropagation()}
          className="relative z-50 rounded-[6px] p-8 md:px-12 md:py-14 bg-white shadow-md drop-shadow-lg text-center flex flex-col justify-center items-center gap-8"
        >
          <button onClick={onClose} className="absolute top-4 right-5">
            <img src={AdminModal_Close_Icon} alt="AdminModal_Close_Icon" />
          </button>
          <div className="max-h-auto w-full whitespace-normal">
            <p className="text-sm md:text-base text-start font-medium break-words w-full">
              {message}
            </p>
          </div>
          <div className="flex items-start gap-8 w-full">
            <button
              onClick={redeployClient}
              className="text-sm md:text-base text-white hover:text-secondaryText px-4 py-2 rounded-md bg-bgPrimaryButton hover:border-secondaryText transition-transform"
              type="button"
            >
              {redeployClientButtonTitle}
            </button>
            <button
              onClick={redeployServer}
              className="text-sm md:text-base bg-white text-bgPrimaryButton border border-bgPrimaryButton transition-transform rounded-md px-4 py-2 "
              type="button"
            >
              {redeployServerButtonTitle}
            </button>
          </div>
        </main>
      </section>
    </>
  );
};

export default AdminSettingsModal;
