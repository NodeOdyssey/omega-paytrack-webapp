// import React, { useEffect, useRef, useState } from 'react';
// import Loader from '../Loader/Loader';
// import {
//   Arrow_Back,
//   EditPencil_Icon,
//   Download_Icon,
//   ID_Card_BottomShape,
//   ID_Card_Profile,
//   ID_Card_TopShape,
//   Modal_Close_Icon,
//   PSCPL_Logo_Golden,
//   Directors_Sign,
//   QR_Code_Square,
// } from '../../assets/icons';

// import { EmployeeTable } from '../../types/employee';
// import { toPng } from 'html-to-image';
// import { Tooltip } from 'react-tooltip';
// import SecondaryButton from '../Button/SecondaryButton';
// import PrimaryButton from '../Button/PrimaryButton';
// import {
//   formatDateDdMmYyyySlash,
//   getFormattedDateYyyyMmDdDash,
// } from '../../utils/formatter';

// import useEmployeeStore from '../../store/employee';

// type EmployeeIdCardModalProps = {
//   onCancel: () => void;
//   // employee: EmployeeTable;
//   employeeId: number;
//   // profile: string;
// };

// const EmployeeIdCardModal: React.FC<EmployeeIdCardModalProps> = ({
//   onCancel,
//   employeeId,
// }) => {
//   /* access token */
//   const accessToken = localStorage.getItem('accessToken');
//   if (!accessToken) {
//     console.log('No access token found');
//     return null;
//   }

//   /* loader */
//   // const [isLoading, setIsLoading] = useState(false);

//   /* refs */
//   const frontRef = useRef<HTMLDivElement>(null);
//   const backRef = useRef<HTMLDivElement>(null);

//   /* store */
//   const { fetchEmployeeById, employee, isLoading, employeeProfilePhoto } =
//     useEmployeeStore();

//   useEffect(() => {
//     if (!employeeId || !accessToken) return;
//     fetchEmployeeById(employeeId, accessToken);
//   }, [employeeId, accessToken]);

//   const [showEditForm, setShowEditForm] = useState(false);

//   const [idCardEmployee, setIdCardEmployee] = useState<EmployeeTable>(
//     employee as EmployeeTable
//   );
//   const [editedIdCardEmployee, setEditedIdCardEmployee] =
//     useState<EmployeeTable>(employee as EmployeeTable);

//   const [validFrom, setValidFrom] = useState<Date>(new Date());
//   const [validTill, setValidTill] = useState<Date>(
//     new Date(Date.now() + 364 * 24 * 60 * 60 * 1000)
//   );

//   const [editedValidFrom, setEditedValidFrom] = useState<Date>(new Date());
//   const [editedValidTill, setEditedValidTill] = useState<Date>(
//     new Date(Date.now() + 364 * 24 * 60 * 60 * 1000)
//   );

//   const handleDownload = async () => {
//     // console.log('handleDownload called');
//     // console.log('frontRef:', frontRef.current);
//     // console.log('backRef:', backRef.current);

//     if (!frontRef.current || !backRef.current) {
//       console.error('Refs are not attached');
//       return;
//     }

//     try {
//       // setIsLoading(true);
//       // console.log('Starting download...');

//       // FRONT SIDE
//       const frontDataUrl = await toPng(frontRef.current);
//       // console.log('Front side captured');

//       const frontLink = document.createElement('a');
//       frontLink.download = `${employee?.empId}_Front.png`;
//       frontLink.href = frontDataUrl;
//       frontLink.click();
//       // console.log('Front side downloaded');

//       // BACK SIDE
//       const backDataUrl = await toPng(backRef.current);
//       // console.log('Back side captured');

//       const backLink = document.createElement('a');
//       backLink.download = `${employee?.empId}_Back.png`;
//       backLink.href = backDataUrl;
//       backLink.click();
//       // console.log('Back side downloaded');
//     } catch (err) {
//       console.error('Failed to download ID card sides:', err);
//     } finally {
//       // setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     // console.log('editedIdCardEmployee: ', editedIdCardEmployee);
//     // console.log('idCardEmployee: ', idCardEmployee);
//     // console.log('validFrom: ', validFrom);
//     // console.log('validTill: ', validTill);
//   }, []);

//   // JSX
//   return (
//     <>
//       {isLoading && <Loader />}
//       {/* Overlay */}
//       <section className="modal-overlay">
//         {/* Modal */}
//         <main className="z-50 relative rounded-lg h-[570px] w-[720px] px-16 py-10 bg-white shadow-md drop-shadow-md text-center flex flex-col justify-center items-center font-Mona_Sans">
//           {/* Back and Close Buttons */}
//           <div>
//             {/* Back Button */}
//             {showEditForm && (
//               <button
//                 onClick={() => setShowEditForm(false)}
//                 className="absolute left-5 top-5"
//               >
//                 {/* Icon */}
//                 <img
//                   src={Arrow_Back}
//                   alt="Arrow_Back"
//                   className="w-5 2xl:w-6 h-5 2xl:h-6"
//                 />
//               </button>
//             )}
//             {/* Close Button */}
//             <button
//               onClick={() => {
//                 onCancel();
//                 setEditedIdCardEmployee(idCardEmployee);
//               }}
//               className="absolute top-5 right-5"
//             >
//               {/* Icon */}
//               <img
//                 src={Modal_Close_Icon}
//                 alt="Arrow_Back"
//                 className="w-5 2xl:w-6 h-5 2xl:h-6"
//               />
//             </button>
//           </div>

//           {/* EK MIN PHONE CALL */}

//           {/* Options */}
//           {!showEditForm && (
//             <>
//               {/* Edit */}
//               <div
//                 data-tooltip-id="edit_IdCard"
//                 data-tooltip-content="Edit ID Card Information"
//                 className="absolute top-[120px] 2xl:top-[116px] right-10 flex w-10 h-10 p-2 justify-center items-center bg-transparent border border-gray-300 rounded-md"
//               >
//                 <div
//                   data-tooltip-id="edit_IdCard"
//                   data-tooltip-content="Edit ID Card Information"
//                 >
//                   <img
//                     src={EditPencil_Icon}
//                     alt="EditPencil_Icon"
//                     className="w-5 h-5 2xl:w-6 2xl:h-6 cursor-pointer"
//                     onClick={() => setShowEditForm(true)}
//                   />
//                 </div>
//                 <Tooltip
//                   id="edit_IdCard"
//                   content="Edit inormation"
//                   place="right"
//                   className="custom-tooltip"
//                 />
//               </div>
//               {/* Download */}
//               <div
//                 data-tooltip-id="download_IdCard"
//                 data-tooltip-content="Download ID Card Information"
//                 className="absolute top-[170px] 2xl:top-[166px] right-10 flex w-10 h-10 p-2 justify-center items-center bg-transparent border border-gray-300 rounded-md"
//               >
//                 <div
//                   data-tooltip-id="download_IdCard"
//                   data-tooltip-content="Download ID Card"
//                 >
//                   <img
//                     src={Download_Icon}
//                     alt="Download_Icon"
//                     className="w-4 h-4 2xl:w-5 2xl:h-5 cursor-pointer"
//                     onClick={handleDownload}
//                     // onClick={() => {}}
//                   />
//                 </div>
//                 <Tooltip
//                   id="download_IdCard"
//                   content="Download ID Card"
//                   place="right"
//                   className="custom-tooltip"
//                 />
//               </div>
//             </>
//           )}

//           {/* Modal Content */}
//           <div className="flex flex-col gap-8">
//             {/* Title */}
//             <p className="text-xl font-medium">
//               {showEditForm
//                 ? 'Edit card information'
//                 : 'ID Card generated succsessfully'}
//             </p>

//             {/* Edit Form / ID Card */}
//             <div className="flex h-[360px] items-center">
//               {showEditForm ? (
//                 // Edit Form
//                 <div className="w-full grid grid-cols-2 gap-x-24 gap-y-2 items-start">
//                   {/* Left Grid */}
//                   <div className="flex flex-col gap-2 text-[#1c1c1c] w-full col-span-1">
//                     {/* Name */}
//                     <label className="text-xs text-left font-semibold">
//                       Name:
//                     </label>
//                     <input
//                       type="text"
//                       className="border p-2 rounded text-xs w-[230px] h-8 2xl:h-10"
//                       value={editedIdCardEmployee.empName}
//                       onChange={(e) =>
//                         setEditedIdCardEmployee((prev) => ({
//                           ...prev,
//                           empName: e.target.value,
//                         }))
//                       }
//                     />

//                     {/* Rank */}
//                     <label className="text-xs text-left font-semibold">
//                       Rank:
//                     </label>
//                     <input
//                       type="text"
//                       className="border p-2 rounded text-xs bg-[#EEF0F2] w-[230px] h-8 2xl:h-10"
//                       value={editedIdCardEmployee.rank}
//                       readOnly
//                     />

//                     {/* ID NO */}
//                     <label className="text-xs text-left font-semibold">
//                       ID No:
//                     </label>
//                     <input
//                       type="text"
//                       className="border p-2 rounded text-xs bg-[#EEF0F2] w-[230px] h-8 2xl:h-10"
//                       value={editedIdCardEmployee.empId}
//                       readOnly
//                     />

//                     {/* DOB */}
//                     <label className="text-xs text-left font-semibold">
//                       D.O.B:
//                     </label>
//                     <input
//                       type="text"
//                       className="border p-2 rounded text-xs bg-[#EEF0F2] w-[230px] h-8 2xl:h-10"
//                       value={formatDateDdMmYyyySlash(editedIdCardEmployee.dob)}
//                       readOnly
//                     />

//                     {/* Phone */}
//                     <label className="text-xs text-left font-semibold">
//                       Phone:
//                     </label>
//                     <input
//                       type="text"
//                       className="border p-2 rounded text-xs bg-[#EEF0F2] w-[230px] h-8 2xl:h-10"
//                       value={editedIdCardEmployee.phoneNum}
//                       readOnly
//                     />
//                   </div>

//                   {/* Right Grid */}
//                   <div className="flex flex-col gap-2 text-[#1c1c1c] col-span-1 w-full">
//                     {/* Father's Name */}
//                     <label className="text-xs text-left font-semibold">
//                       Father&apos;s Name:
//                     </label>
//                     <input
//                       type="text"
//                       className="border p-2 rounded text-xs bg-[#EEF0F2] w-[230px] h-8 2xl:h-10"
//                       value={editedIdCardEmployee.fatherName ?? ''}
//                       readOnly
//                     />

//                     {/* Valid From */}
//                     <label className="text-xs text-left font-semibold">
//                       Valid From:
//                     </label>
//                     <input
//                       type="date"
//                       className="border p-2 rounded text-xs w-[230px] h-8 2xl:h-10"
//                       // value={editedIdCardEmployee.empName ?? ''}\
//                       value={getFormattedDateYyyyMmDdDash(editedValidFrom)}
//                       onChange={(e) => {
//                         const dateValue = e.target.value;
//                         const parsedDate = new Date(dateValue); // parse the date string into a Date object
//                         setEditedValidFrom(parsedDate);
//                         setEditedValidTill(
//                           new Date(
//                             parsedDate.getTime() + 364 * 24 * 60 * 60 * 1000
//                           )
//                         );
//                       }}
//                     />

//                     {/* Valid To */}
//                     <label className="text-xs text-left font-semibold">
//                       Valid Till:
//                     </label>
//                     <input
//                       type="date"
//                       className="border p-2 rounded text-xs w-[230px] h-8 2xl:h-10"
//                       value={getFormattedDateYyyyMmDdDash(editedValidTill)}
//                       onChange={(e) => {
//                         const dateValue = e.target.value;
//                         const parsedDate = new Date(dateValue); // parse the date string into a Date object
//                         setEditedValidTill(parsedDate);
//                       }}
//                     />

//                     {/* Blood Group */}
//                     <label className="text-xs text-left font-semibold">
//                       Blood Group:
//                     </label>
//                     <input
//                       type="text"
//                       className="border p-2 rounded text-xs bg-[#EEF0F2] w-[230px] h-8 2xl:h-10"
//                       value={editedIdCardEmployee.bloodGroup ?? ''}
//                       readOnly
//                     />

//                     {/* ID Mark */}
//                     <label className="text-xs text-left font-semibold">
//                       Identification Mark:
//                     </label>
//                     <input
//                       type="text"
//                       className="border p-2 rounded text-xs bg-[#EEF0F2] w-[230px] h-8 2xl:h-10"
//                       value={editedIdCardEmployee.idMark ?? ''}
//                       readOnly
//                     />
//                   </div>
//                 </div>
//               ) : (
//                 // ID Card
//                 <div className="flex justify-between">
//                   <div className="flex flex-col gap-10">
//                     <div className="flex gap-16">
//                       {/* Front Side */}
//                       <div
//                         ref={frontRef}
//                         className="w-[204px] h-[324px] bg-white rounded-md shadow-xl drop-shadow-2xl shadow-gray-400 border border-gray-100 relative overflow-hidden"
//                       >
//                         {/* Header */}
//                         <div className="flex items-center gap-2 p-2 ">
//                           <img
//                             src={PSCPL_Logo_Golden}
//                             // src="https://pscpl-paytrack.s3.ap-south-1.amazonaws.com/assets/PSCPL_Logo_Golden.svg"
//                             alt="Company Logo"
//                             className="mx-auto w-14 h-9"
//                           />
//                           <h2 className="text-[10px] text-left font-semibold text-[#1C1C1C]">
//                             Purbanchal Security Consultants Private Ltd.
//                           </h2>
//                         </div>

//                         {/* Top shape */}
//                         <div className="absolute top-10">
//                           <img src={ID_Card_TopShape} alt="" />
//                         </div>

//                         {/* Main Card Contents */}
//                         <div className="flex flex-col gap-1 mt-2">
//                           <div className="flex flex-col ">
//                             {/* Profile Photo */}
//                             <div className="flex justify-center">
//                               <img
//                                 // src={editedIdCardEmployee.profilePhoto}
//                                 // src={
//                                 //   editedIdCardEmployee.profilePhoto
//                                 //     ? editedIdCardEmployee.profilePhoto
//                                 //     : ID_Card_Profile
//                                 // }
//                                 src={
//                                   employeeProfilePhoto
//                                     ? employeeProfilePhoto
//                                     : ID_Card_Profile
//                                 }
//                                 alt="Profile_Ppic"
//                                 className="w-[70px] h-[70px] rounded shadow-md object-cover border"
//                               />
//                             </div>

//                             {/* Name & Role */}
//                             <div className="text-center ">
//                               <h3 className="text-base font-bold text-[#4B4853]">
//                                 {editedIdCardEmployee.empName
//                                   .toLowerCase()
//                                   .split(' ')
//                                   .map(
//                                     (word) =>
//                                       word.charAt(0).toUpperCase() +
//                                       word.slice(1)
//                                   )
//                                   .join(' ')}
//                               </h3>
//                               <p className="text-[10px] font-semibold text-[#000000]">
//                                 {/* Accountant */}
//                                 {editedIdCardEmployee.rank}
//                               </p>
//                             </div>
//                           </div>

//                           {/* Details Section */}
//                           <div className="flex flex-col justify-center ">
//                             {/* ID NO */}
//                             <p className="flex justify-center gap-2 text-[8px]">
//                               <span className="font-semibold w-[72px] text-right">
//                                 ID NO
//                               </span>
//                               <span className="font-semibold w-[6px] text-center">
//                                 :
//                               </span>
//                               <span className="font-medium  w-[72px] text-left ">
//                                 {/* PSC/37/B */}
//                                 {editedIdCardEmployee.empId}
//                               </span>
//                             </p>
//                             {/* D.O.B */}
//                             <p className="flex justify-center gap-2 text-[8px] ">
//                               <span className="font-semibold w-[72px] text-right">
//                                 D.O.B
//                               </span>
//                               <span className="font-semibold w-[6px] text-center">
//                                 :
//                               </span>
//                               <span className="font-medium w-[72px] text-left ">
//                                 {/* 01-04-1990 */}
//                                 {formatDateDdMmYyyySlash(
//                                   editedIdCardEmployee.dob
//                                 )}
//                               </span>
//                             </p>
//                             {/* Phone */}
//                             <p className="flex justify-center gap-2 text-[8px]">
//                               <span className="font-semibold w-[72px] text-right">
//                                 Phone
//                               </span>
//                               <span className="font-semibold text-center w-[6px]">
//                                 :
//                               </span>
//                               <span className="font-medium text-left  w-[72px]">
//                                 {/* +91-97077-76846 */}
//                                 {editedIdCardEmployee.phoneNum}
//                               </span>
//                             </p>
//                             {/* Father's Name */}
//                             <p className="flex justify-center gap-2 text-[8px]">
//                               <span className="font-semibold w-[72px] text-right">
//                                 Father’s Name
//                               </span>
//                               <span className="font-semibold text-center w-[6px]">
//                                 :
//                               </span>
//                               <span className="font-medium text-left  w-[72px]">
//                                 {/* Lt. Pramod Kalita */}
//                                 {editedIdCardEmployee.fatherName
//                                   ? editedIdCardEmployee.fatherName
//                                       .toLowerCase()
//                                       .split(' ')
//                                       .map(
//                                         (word) =>
//                                           word.charAt(0).toUpperCase() +
//                                           word.slice(1)
//                                       )
//                                       .join(' ')
//                                   : '-'}
//                               </span>
//                             </p>
//                             {/* Valid From */}
//                             <p className="flex justify-center gap-2 text-[8px]">
//                               <span className="font-semibold w-[72px] text-right">
//                                 Valid From
//                               </span>
//                               <span className="font-semibold text-center w-[6px]">
//                                 :
//                               </span>
//                               <span className="font-medium text-left  w-[72px]">
//                                 {formatDateDdMmYyyySlash(validFrom)}
//                               </span>
//                             </p>
//                             {/* Valid Till */}
//                             <p className="flex  justify-center gap-2 text-[8px]">
//                               <span className="font-semibold w-[72px] text-right">
//                                 Valid Till
//                               </span>
//                               <span className="font-semibold text-center w-[6px]">
//                                 :
//                               </span>
//                               <span className="font-medium text-left  w-[72px]">
//                                 {/* 20-05-2026 */}
//                                 {formatDateDdMmYyyySlash(validTill)}
//                               </span>
//                             </p>
//                             {/* Blood Group */}
//                             <p className="flex  justify-center gap-2 text-[8px]">
//                               <span className="font-semibold w-[72px] text-right">
//                                 Blood Group
//                               </span>
//                               <span className="font-semibold text-center w-[6px]">
//                                 :
//                               </span>
//                               <span className="font-medium text-left  w-[72px]">
//                                 {/* A- */}
//                                 {editedIdCardEmployee.bloodGroup || '-'}
//                               </span>
//                             </p>
//                             {/* Identification Mark */}
//                             <p className="flex justify-center gap-2 text-[8px]">
//                               <span className="font-semibold w-fit text-right">
//                                 Identification Mark
//                               </span>
//                               <span className="font-semibold text-center w-[6px]">
//                                 :
//                               </span>
//                               <span className="font-medium text-left w-[72px] leading-tight">
//                                 {editedIdCardEmployee.idMark || '-'}
//                               </span>
//                             </p>
//                           </div>
//                         </div>

//                         {/* Footer */}
//                         <div className="absolute bottom-1.5 w-full h-[30px]  rounded-b-md">
//                           <img src={ID_Card_BottomShape} alt="" />
//                         </div>
//                       </div>
//                       {/* Back side*/}
//                       <div
//                         ref={backRef}
//                         className="w-[204px] h-[324px] bg-white rounded-md shadow-xl drop-shadow-2xl shadow-gray-400 border border-gray-100 relative overflow-hidden"
//                       >
//                         <div className="px-3.5 flex flex-col gap-2">
//                           {/* Header */}
//                           <div className="flex items-center pt-2">
//                             <img
//                               src={PSCPL_Logo_Golden}
//                               // src="https://pscpl-paytrack.s3.ap-south-1.amazonaws.com/assets/PSCPL_Logo_Golden.svg"
//                               alt="Company Logo"
//                               className="mx-auto w-24 h-12"
//                             />
//                           </div>

//                           {/* list */}
//                           <ul className="list-disc list-inside text-[8px]  text-left flex flex-col gap-1.5">
//                             <li>
//                               Employee must carry this card at all times while
//                               on duty.
//                             </li>
//                             <li>
//                               This card must be returned on Termination of
//                               employment.
//                             </li>
//                             <li>
//                               The loss of this ID card must be reported to the
//                               issuing authority.
//                             </li>
//                           </ul>
//                         </div>
//                         {/* directors sign */}
//                         <div className="flex justify-end px-3.5 -mt-1.5">
//                           <img
//                             src={Directors_Sign}
//                             // src="https://pscpl-paytrack.s3.ap-south-1.amazonaws.com/assets/Directors_Sign.svg"
//                             alt="Directors_Sign"
//                           />
//                         </div>

//                         {/* divider */}
//                         <div className="w-full h-[1px] bg-[#a1a1a1] mt-2 mb-1"></div>

//                         {/* details */}
//                         <div className="flex flex-col gap-0.5 px-3.5">
//                           {/* Company name */}
//                           <p className="text-[8px] font-semibold">
//                             Purbanchal Security Consultants Private Ltd.
//                           </p>
//                           {/* Address */}
//                           <div className="flex items-center justify-between">
//                             <div className="flex flex-col gap-1 text-[8px] w-2/3">
//                               <p className="text-left leading-snug">
//                                 59, JB Lane, Nabagraha Road, Krishna Nagar,
//                                 Silphukuri, Guwahati, Assam, 781003
//                               </p>
//                               <p className="flex justify-center">
//                                 <span className="font-semibold w-[38px] text-left">
//                                   Contact
//                                 </span>
//                                 <span className="font-semibold w-[6px] text-left">
//                                   :
//                                 </span>
//                                 <span className="font-medium w-[72px] text-left">
//                                   +91-98640 21429 / +91-84860 21432
//                                 </span>
//                               </p>
//                             </div>
//                             {/* qr code */}
//                             <div className="text-[3.5px]">
//                               <img
//                                 src={QR_Code_Square}
//                                 // src="https://pscpl-paytrack.s3.ap-south-1.amazonaws.com/assets/QR_Code_Square.svg"
//                                 className="w-14 h-14 object-cover"
//                                 alt="QR_Code_Square"
//                               />
//                               <span>www.purbanchalsecurity.com</span>
//                             </div>
//                           </div>
//                           <p className="flex  text-[8px]">
//                             <span className="font-semibold w-[38px] text-left">
//                               Email
//                             </span>
//                             <span className="font-semibold w-[6px] text-left">
//                               :
//                             </span>
//                             <span className="font-medium w-[72px] text-left">
//                               support@purbanchalsecurity.com
//                             </span>
//                           </p>
//                         </div>

//                         {/* Footer */}
//                         <div className="absolute bottom-1.5 w-full h-[30px]  rounded-b-md">
//                           <img
//                             src={ID_Card_BottomShape}
//                             alt="ID_Card_BottomShape"
//                           />
//                         </div>
//                       </div>
//                     </div>
//                     {/* Buttons */}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Action Buttons */}
//             <div className="flex gap-8 justify-center">
//               {showEditForm ? (
//                 <>
//                   {/* Cancel */}
//                   <SecondaryButton
//                     onClick={() => {
//                       setEditedIdCardEmployee(idCardEmployee);
//                       setEditedValidFrom(validFrom);
//                       setEditedValidTill(validTill);
//                       setShowEditForm(false);
//                     }}
//                   >
//                     Cancel
//                   </SecondaryButton>
//                   {/* Save */}
//                   <PrimaryButton
//                     onClick={() => {
//                       setIdCardEmployee(editedIdCardEmployee);
//                       setValidFrom(editedValidFrom);
//                       setValidTill(editedValidTill);
//                       setShowEditForm(false);
//                     }}
//                   >
//                     Save
//                   </PrimaryButton>
//                 </>
//               ) : (
//                 <>
//                   {/* Download */}
//                   {/* <SecondaryButton
//                     onClick={handleDownload}
//                     disabled
//                     type="button"
//                   >
//                     Download
//                   </SecondaryButton> */}
//                   {/* Print */}
//                   <PrimaryButton disabled type="button">
//                     Print
//                   </PrimaryButton>
//                 </>
//               )}
//             </div>
//           </div>
//         </main>
//       </section>
//     </>
//   );
// };

// export default EmployeeIdCardModal;
