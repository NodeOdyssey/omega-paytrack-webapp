import React, { useEffect, useRef, useState } from 'react';
import { Keyboard_Arrow_Down, Keyboard_Arrow_Up } from '../../assets/icons';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { TaxesAndDeduction } from '../../types/taxesAndDeduction';

// type CustomTaxSlabDropdownProps = {
//   slabs: TaxesAndDeduction[];
//   onSelectSlab: (taxId: number, slabName: string) => void;
//   placeholder: string;
// };

// const CustomTaxSlabDropdown: React.FC<CustomTaxSlabDropdownProps> = ({
//   slabs,
//   onSelectSlab,
//   placeholder,
// }) => {
//   const [selectedSlabName, setSelectedSlabName] = useState<string>(placeholder);
//   const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   const handleSelectSlab = (
//     slabId: number | undefined,
//     slabName: string,
//     event: React.MouseEvent<HTMLLIElement>
//   ) => {
//     if (slabId === undefined) {
//       console.error('Error: Invalid slab selected');
//       return;
//     }

//     event.stopPropagation();
//     setSelectedSlabName(slabName);
//     onSelectSlab(slabId, slabName);
//     setIsDropdownOpen(false);
//   };

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node)
//       ) {
//         setIsDropdownOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   return (
//     <>
//       <div className="relative inline-block w-32" ref={dropdownRef}>
//         <div
//           className="flex items-center justify-between w-full p-1 rounded-lg cursor-pointer bg-white"
//           onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//         >
//           <span className=" text-primaryText">{selectedSlabName}</span>
//           {isDropdownOpen ? (
//             <img
//               src={Keyboard_Arrow_Up}
//               alt="Keyboard_Arrow_Up"
//               className="w-3 lg:w-4 xl:w-5"
//             />
//           ) : (
//             <img
//               src={Keyboard_Arrow_Down}
//               alt="Keyboard_Arrow_Down"
//               className="w-3 lg:w-4 xl:w-5"
//             />
//           )}
//         </div>
//         {isDropdownOpen && (
//           <ul className="absolute z-50 bottom-0 w-full bg-white border rounded-lg mt-1 max-h-60 overflow-auto">
//             {slabs.map((slab) => (
//               <li
//                 key={slab.ID}
//                 value={slab.ID}
//                 className="p-1 border cursor-pointer hover:bg-gray-100"
//                 onClick={(e) => handleSelectSlab(slab.ID, slab.taxDeducName, e)}
//                 data-tooltip-id={`tooltip-${slab.ID}`}
//                 data-tooltip-html={`
//                   <b>${slab.taxDeducName}</b><br />
//                   Esi: ${slab.esi}<br />
//                   Epf: ${slab.epf}<br />
//                   PTax: ${slab.pTax}<br />
//                   EmployerEsi: ${slab.employerEsi}<br />
//                   EmployerEpf: ${slab.employerEpf}
//                 `}
//               >
//                 {slab.taxDeducName}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//       {slabs.map((slab) => (
//         <ReactTooltip
//           key={slab.ID}
//           id={`tooltip-${slab.ID}`}
//           place="left"
//           //   effect="solid"
//           className="requiredRanksTooltip"
//           // html={true}
//         />
//       ))}
//     </>
//   );
// };

// export default CustomTaxSlabDropdown;
type CustomTaxSlabDropdownProps = {
  slabs: TaxesAndDeduction[];
  onSelectSlab: (taxId: number, slabName: string) => void;
  placeholder: string;
  reset: boolean; // Add this line
};

const CustomTaxSlabDropdown: React.FC<CustomTaxSlabDropdownProps> = ({
  slabs,
  onSelectSlab,
  placeholder,
  reset, // Add this line
}) => {
  const [selectedSlabName, setSelectedSlabName] = useState<string>(placeholder);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelectSlab = (
    slabId: number | undefined,
    slabName: string,
    event: React.MouseEvent<HTMLLIElement>
  ) => {
    if (slabId === undefined) {
      console.error('Error: Invalid slab selected');
      return;
    }

    event.stopPropagation();
    setSelectedSlabName(slabName);
    onSelectSlab(slabId, slabName);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    if (reset) {
      setSelectedSlabName(placeholder);
    }
  }, [reset, placeholder]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="relative inline-block w-32" ref={dropdownRef}>
        <div
          className="flex items-center justify-between w-full p-1 rounded-lg cursor-pointer bg-white"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <span className=" text-primaryText">{selectedSlabName}</span>
          {isDropdownOpen ? (
            <img
              src={Keyboard_Arrow_Up}
              alt="Keyboard_Arrow_Up"
              className="w-3 lg:w-4 xl:w-5"
            />
          ) : (
            <img
              src={Keyboard_Arrow_Down}
              alt="Keyboard_Arrow_Down"
              className="w-3 lg:w-4 xl:w-5"
            />
          )}
        </div>
        {isDropdownOpen && (
          <ul className="absolute z-50 bottom-0 w-full bg-white border rounded-lg mt-1 max-h-60 overflow-auto">
            {slabs.map((slab) => (
              <li
                key={slab.ID}
                value={slab.ID}
                className="p-1 border cursor-pointer hover:bg-gray-100"
                onClick={(e) => handleSelectSlab(slab.ID, slab.taxDeducName, e)}
                data-tooltip-id={`tooltip-${slab.ID}`}
                data-tooltip-html={`
                  <b>${slab.taxDeducName}</b><br />
                  Esi: ${slab.esi}<br />
                  Epf: ${slab.epf}<br />
                  PTax: ${slab.pTax}<br />
                  EmployerEsi: ${slab.employerEsi}<br />
                  EmployerEpf: ${slab.employerEpf}
                `}
              >
                {slab.taxDeducName}
              </li>
            ))}
          </ul>
        )}
      </div>
      {slabs.map((slab) => (
        <ReactTooltip
          key={slab.ID}
          id={`tooltip-${slab.ID}`}
          place="left"
          className="requiredRanksTooltip"
        />
      ))}
    </>
  );
};

export default CustomTaxSlabDropdown;
