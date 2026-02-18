// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import Datetime from 'react-datetime';
// import moment from 'moment';

// import Accordion from '../../common/Accordion/Accordion';
// import Loader from '../../common/Loader/Loader';
// import SmallButton from '../../common/Button/SmallButton';
// import DatabaseDropdown from '../../common/DatabaseDropdown/DatabaseDropdown';

// type Database = {
//   identifier: string;
//   arn: string;
// };

// type MigrationParams = {
//   sourceDatabaseId: string;
//   sourceDatabaseArn: string;
//   targetDatabaseId: string;
//   targetDatabaseArn: string;
//   migrationStartTime: string;
//   migrationEndTime: string;
// };

// const DMSControlAuto = (): React.ReactElement => {
//   /* Loader */
//   const [isLoading, setIsLoading] = useState(false);

//   /** Database  */
//   const [availableDatabases, setAvailableDatabases] = useState<Database[]>([]);
//   const [selectedSourceDatabase, setSelectedSourceDatabase] =
//     useState<Database>({} as Database);
//   const [selectedTargetDatabase, setSelectedTargetDatabase] =
//     useState<Database>({} as Database);

//   const fetchActiveRdsInstances = async () => {
//     setIsLoading(true);
//     try {
//       const response = await axios.get(
//         `http://localhost:8081/rds-control/active-instances`
//       );
//       if (response.data.success) {
//         setAvailableDatabases(response.data.instances);
//       }
//     } catch (error) {
//       console.log('Error: ', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchActiveRdsInstances();
//   }, []);

//   /** Migration Params */
//   const [migrationParams, setMigrationParams] = useState<MigrationParams>({
//     sourceDatabaseId: '',
//     sourceDatabaseArn: '',
//     targetDatabaseId: '',
//     targetDatabaseArn: '',
//     migrationStartTime: '',
//     migrationEndTime: '',
//   });

//   const handleUpdateMigrationParams = (key: string, value: string) => {
//     setMigrationParams((prev) => ({
//       ...prev,
//       [key]: value,
//     }));
//   };

//   const handleDmsStartMigration = async (event: React.FormEvent) => {
//     event.preventDefault();
//     setIsLoading(true);

//     try {
//       const response = await axios.post(
//         `http://localhost:8081/dms-control/setup-replication`,
//         migrationParams
//       );
//       if (response.data.success) {
//         console.log('Success: ', response.data.message);
//         toast.success(response.data.message);
//       }
//     } catch (error) {
//       console.log('Error: ', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Helper function to format date and time
//   function formatReadableDateTime(isoString: string) {
//     if (!isoString) {
//       return '';
//     }

//     console.log('What is date coming after cdc update: ', isoString);
//     // Parse the ISO string into a Date object
//     const date = new Date(isoString);
//     interface DateTimeFormatOptions {
//       year?: 'numeric' | '2-digit';
//       month?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow';
//       day?: 'numeric' | '2-digit';
//       hour?: 'numeric' | '2-digit';
//       minute?: 'numeric' | '2-digit';
//       second?: 'numeric' | '2-digit';
//       hour12?: boolean;
//     }

//     // Define options for formatting
//     const options: DateTimeFormatOptions = {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//       second: '2-digit',
//       hour12: true, // For 12-hour format with AM/PM
//     };

//     // Use Intl.DateTimeFormat to format the date
//     return new Intl.DateTimeFormat('en-US', options).format(date);
//   }

//   // Helper function to filter available databases
//   const filteredSourceDatabases = availableDatabases.filter(
//     (db) => db.identifier !== selectedTargetDatabase.identifier
//   );
//   const filteredTargetDatabases = availableDatabases.filter(
//     (db) => db.identifier !== selectedSourceDatabase.identifier
//   );

//   // Test use effect
//   useEffect(() => {
//     console.log('Available Databases: ', availableDatabases);
//     console.log('Migration Params: ', migrationParams);
//     // console.log('Selected Source Database: ', migrationParams.sourceDatabaseId);
//     // console.log('Selected Target Database: ', migrationParams.targetDatabaseId);
//     // console.log('CDC Start Time: ', migrationParams.migrationStartTime);
//     // console.log('CDC Stop Time: ', migrationParams.migrationEndTime);
//   });

//   return (
//     <>
//       {isLoading && <Loader />}
//       {/* Header Component */}
//       <div
//         className={`z-20 h-20 fixed top-0 left-0 right-0 px-8 py-4 flex items-center font-semibold justify-between shadow-md bg-white`}
//       >
//         {/* Title */}
//         <h2 className="text-left font-medium text-sm sm:text-base lg:text-gl xl:text-xl">
//           Node Odyssey Pvt. Ltd.
//         </h2>
//       </div>
//       {/* Sub Header Component */}
//       <div className="flex flex-col w-full fixed z-20 py-2 px-4 2xl:px-8 gap-1 2xl:gap-2">
//         <p className="primaryHeadings text-secondaryText flex w-fit items-center gap-2">
//           Start a Custom Migration Process from one RDS to another
//         </p>
//       </div>
//       {/* Body Component */}
//       <div className="bg-white mt-20 z-10 overflow-y-auto h-[calc(100vh-208px)] scrollbar scrollbar-thumb-scrollBarColor scrollbar-track-scrollBarBg">
//         <form
//           // onSubmit={handleDmsStartMigration}
//           className="w-[100%] mx-auto mt-16"
//         >
//           {/* Accordion 1 - UTC */}
//           <Accordion title="DMS Replication">
//             <div className="flex flex-col justify-between gap-8 px-4 border-b pb-20 w-full">
//               <div className="flex flex-col gap-4">
//                 {/* <p>
//                     Select the replication source and target databases here:
//                   </p> */}
//                 <div className="flex gap-8">
//                   <div className="flex flex-col gap-2 w-1/3">
//                     {/* Source Database */}
//                     <DatabaseDropdown
//                       value={migrationParams.sourceDatabaseId || ''}
//                       onChange={(event) => {
//                         handleUpdateMigrationParams(
//                           'sourceDatabaseId',
//                           event.target.value
//                         );
//                         handleUpdateMigrationParams(
//                           'sourceDatabaseArn',
//                           availableDatabases.find(
//                             (db) => db.identifier === event.target.value
//                           )?.arn || ''
//                         );
//                       }}
//                       options={filteredSourceDatabases} // Use filtered source databases
//                       label="Select Source Database"
//                       placeholder="Click to select"
//                     />
//                   </div>
//                   <div className="flex flex-col gap-2 w-1/3">
//                     {/* Target Database */}
//                     <DatabaseDropdown
//                       value={selectedTargetDatabase.identifier || ''}
//                       onChange={(event) => {
//                         handleUpdateMigrationParams(
//                           'targetDatabaseId',
//                           event.target.value
//                         );
//                         handleUpdateMigrationParams(
//                           'targetDatabaseArn',
//                           availableDatabases.find(
//                             (db) => db.identifier === event.target.value
//                           )?.arn || ''
//                         );
//                       }}
//                       options={filteredTargetDatabases} // Use filtered target databases
//                       label="Select Target Database"
//                       placeholder="Click to select"
//                     />
//                   </div>
//                   <div className="flex flex-col gap-2 w-1/3">
//                     <div className="flex flex-col items-start justify-end gap-2 w-1/3 h-[5.1rem]"></div>
//                   </div>
//                   {/* {errors.postName && (
//                   <p className="text-red-500">{errors.postName}</p>
//                 )} */}
//                 </div>

//                 <div className="flex flex-col gap-4">
//                   {/* <div>
//                       Select the replication start and stop date and time
//                       for&nbsp;&apos;
//                       <span className="font-semibold">
//                         {currentReplicationTaskId || '---'}
//                       </span>
//                       &apos;&nbsp;here:
//                     </div> */}
//                   <div className="flex gap-8">
//                     {/* CDC Start Time */}
//                     <div className="flex flex-col gap-2 w-1/3">
//                       <label className="font-medium text-secondaryText text-xs lg:text-sm xl:text-base">
//                         Start Date & Time
//                         <span className=" text-red-500 pl-1">*</span>
//                       </label>
//                       <Datetime
//                         value={
//                           migrationParams.migrationStartTime
//                             ? moment(migrationParams.migrationStartTime)
//                             : undefined
//                         }
//                         initialValue={migrationParams.migrationStartTime}
//                         onChange={(value) =>
//                           handleUpdateMigrationParams(
//                             'migrationStartTime',
//                             moment(value).toDate().toISOString()
//                           )
//                         }
//                         utc
//                         inputProps={{
//                           placeholder: 'Click to Select',
//                         }}
//                         dateFormat="YYYY-MM-DD"
//                         timeFormat="HH:mm:ss"
//                         className="py-2 lg:py-3 xl:py-4 px-2 w-full h-full rounded-md shadow-sm border border-inputBorder text-xs lg:text-sm xl:text-base"
//                       />
//                     </div>
//                     {/* CDC Stop Time */}
//                     <div className="flex flex-col gap-2 w-1/3 ">
//                       <label className="font-medium text-secondaryText text-[10px] md:text-xs lg:text-sm xl:text-base">
//                         Stop Date & Time
//                         <span className=" text-red-500 pl-1">*</span>
//                       </label>
//                       <Datetime
//                         value={
//                           migrationParams.migrationEndTime
//                             ? moment(migrationParams.migrationEndTime)
//                             : undefined
//                         }
//                         initialValue={migrationParams.migrationEndTime}
//                         onChange={(value) =>
//                           handleUpdateMigrationParams(
//                             'migrationEndTime',
//                             moment(value).toDate().toISOString()
//                           )
//                         }
//                         utc
//                         inputProps={{
//                           placeholder: 'Click to Select',
//                         }}
//                         dateFormat="YYYY-MM-DD"
//                         timeFormat="HH:mm:ss"
//                         className="py-2 lg:py-3 xl:py-4 px-2 w-full h-full rounded-md shadow-sm border border-inputBorder text-xs lg:text-sm xl:text-base"
//                       />
//                     </div>
//                     <div className="flex flex-col items-start justify-end gap-2 w-1/3 h-[5.1rem]"></div>
//                   </div>
//                 </div>
//                 <div className="flex flex-col items-start justify-end gap-2 w-1/3">
//                   <SmallButton
//                     disabled={
//                       !migrationParams.sourceDatabaseId ||
//                       !migrationParams.targetDatabaseId ||
//                       !migrationParams.migrationStartTime ||
//                       !migrationParams.migrationEndTime
//                     }
//                     type="button"
//                     onClick={handleDmsStartMigration}
//                   >
//                     Start Migration
//                   </SmallButton>
//                 </div>
//               </div>

//               <p>Status: &nbsp;</p>
//             </div>
//           </Accordion>
//         </form>
//       </div>
//     </>
//   );
// };

// export default DMSControlAuto;
