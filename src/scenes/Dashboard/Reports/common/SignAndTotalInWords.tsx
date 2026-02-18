// Libraries
import React from 'react';

// Utils
import { numberToWords } from '../../../../utils/formatter';

// Prop types
interface SignAndTotalInWordsProps {
  totalNetPay: number;
  dataLength: number;
}

// Main Component
const SignAndTotalInWords: React.FC<SignAndTotalInWordsProps> = ({
  totalNetPay,
  dataLength,
}) => (
  <div
    className={`flex flex-col gap-2 font-bold w-full mx-auto justify-center footer-to-print items-center text-center ${
      dataLength % 8 <= 2 ? 'py-4' : 'py-2'
    }`}
  >
    <div className="flex items-center gap-2">
      <h2 className="text-primaryText reportPrimaryLabels2 font-bold">
        Rupees:
      </h2>
      <h3 className="text-primaryText reportPrimaryLabels2 uppercase font-bold">
        {numberToWords(Number(totalNetPay.toFixed(2)))}
      </h3>
    </div>
    <div className="flex flex-col gap-1">
      <h2 className="text-primaryText reportPrimaryLabels2 text-left font-bold">
        Return after disbursement
      </h2>
      <div className="flex items-center gap-2">
        <h2 className="text-primaryText reportPrimaryLabels2 font-bold">
          Incharge:.................................................................................
        </h2>
        <h3 className="text-primaryText reportPrimaryLabels2 font-bold">
          Date:...............................
        </h3>
      </div>
    </div>
  </div>
);

export default SignAndTotalInWords;
