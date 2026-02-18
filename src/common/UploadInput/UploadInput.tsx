import React from 'react';

type UploadInputProps = {
  id: string;
  label: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  uploaded: boolean;
};

const UploadInput: React.FC<UploadInputProps> = ({
  id,
  label,
  uploaded,
  onChange,
}) => {
  return (
    <>
      <div className="flex flex-col gap-2 cursor-pointer">
        <label className="primaryLabels text-secondaryText">{label}</label>
        <input
          id={id}
          type="file"
          name={id}
          onChange={onChange}
          className="hidden"
        />
        <label
          htmlFor={id}
          className="flex items-center gap-2 px-4 h-[50px] rounded-md shadow-sm border border-inputBorder cursor-pointer hover:shadow-md"
        >
          <img
            src={
              uploaded
                ? 'path-to-your-uploaded-icon.svg' // Replace with the path to the uploaded icon
                : 'path-to-your-upload-icon.svg' // Replace with the path to the initial upload icon
            }
            alt={uploaded ? 'Uploaded Icon' : 'Upload Icon'}
            className="w-7 h-7"
          />
          <span className="text-labelColour font-medium text-sm md:text-base">
            {uploaded ? `${label} Uploaded` : 'Upload Document'}
          </span>
        </label>
      </div>
    </>
  );
};

export default UploadInput;
