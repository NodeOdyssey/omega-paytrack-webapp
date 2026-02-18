// import React, { useEffect, useState } from 'react';
// import Accordion from '../../common/Accordion/Accordion';
// import SmallButton from '../../common/Button/SmallButton';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import Loader from '../../common/Loader/Loader';
// import Datetime from 'react-datetime';
// import moment from 'moment';
// // import ClearButton from '../common/Button/ClearButton';
// import StateDropDown from '../../common/StateDropDown/StateDropDown';
// // import useClickOutside from '../hooks/useClickOutside';

// type Database = {
//   identifier: string;
//   arn: string;
// };

// type CdcControlProps = {
//   cdcStartTime: string;
//   cdcStopTime: string;
//   replicationTaskArn: string;
// };
// type ReplicationTask = {
//   taskName: string;
//   status: string;
//   taskArn: string;
//   isActionRequired: boolean;
// };
// enum ProcessStatus {
//   WAITING_FETCH_RDS_STATUS = 'Waiting User to Fetch RDS status',
//   RDS_ACTION = 'Action Needed by User',
//   CDC_UPDATE_READY = 'Ready to update CDC by User',
//   REPLICATION_READY_WAITING = 'Waiting for User to Start Replication',
//   STARTED = 'Started',
//   STOPPED = 'Stopped',
// }
// // const databases = ['pscpl-paytrack-dev-db', 'pscpl-paytrack-prod-db'];

// const DMSControlCustom = (): React.ReactElement => {
//   /* Loader */
//   const [isLoading, setIsLoading] = useState(false);

//   const defaultDmsControlData: CdcControlProps = {
//     cdcStartTime: '',
//     cdcStopTime: '',
//     replicationTaskArn: '',
//   };

//   const [cdcStartTime, setCdcStartTime] = useState<string>(
//     defaultDmsControlData.cdcStartTime
//   );
//   const [cdcStopTime, setCdcStopTime] = useState<string>(
//     defaultDmsControlData.cdcStopTime
//   );
//   // const [isReadyToReplicate, setIsReadyToReplicate] = useState<boolean>(false);
//   // const [hasReplicationStarted, setHasReplicationStarted] =
//   //   useState<boolean>(false);
//   const [availableDatabases, setAvailableDatabases] = useState<Database[]>([]);
//   const [selectedSourceDatabase, setSelectedSourceDatabase] =
//     useState<string>('');
//   const [selectedTargetDatabase, setSelectedTargetDatabase] =
//     useState<string>('');
//   const [processStatus, setProcessStatus] = useState<string>(
//     ProcessStatus.WAITING_FETCH_RDS_STATUS
//   );
//   const [activeReplicationTasks, setActiveReplicationTasks] = useState<
//     ReplicationTask[]
//   >([]);
//   const [currentReplicationTaskId, setCurrentReplicationTaskId] =
//     useState<string>('');
//   const [currentReplicationTaskArn, setCurrentReplicationTaskArn] =
//     useState<string>('');

//   /** Table Action Modal Controls */
//   // const [actionModalIndex, setActionModalIndex] = useState<number | null>(null);
//   // const actionMenuRef = useRef<HTMLDivElement>(null);
//   // useClickOutside(actionMenuRef, () => setActionModalIndex(null));

//   // Handler function to start replication
//   const handleDmsStartReplication = async (event: React.FormEvent) => {
//     event.preventDefault();
//     setIsLoading(true);
//     console.log(
//       'Start Replication from ',
//       selectedSourceDatabase,
//       ' to ',
//       selectedTargetDatabase
//     );
//     try {
//       const response = await axios.post(
//         `http://localhost:8081/dms-control/start-dms/${currentReplicationTaskArn}`,
//         {
//           sourceInstanceId: selectedSourceDatabase,
//           targetInstanceId: selectedTargetDatabase,
//         }
//       );
//       if (response.data.success) {
//         console.log('Success: ', response.data.message);
//         toast.success(response.data.message);
//         setProcessStatus(ProcessStatus.WAITING_FETCH_RDS_STATUS);
//         // getReplicationStatus();
//       }
//     } catch (error) {
//       console.log('Error: ', error);
//       toast.error(error.response.data.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handler function to Submit for update CDC Time in the state and UI
//   const handleUpdateCdcTime = (time: string, type: string) => {
//     if (type === 'start') {
//       setCdcStartTime(time);
//     }
//     if (type === 'stop') {
//       setCdcStopTime(time);
//     }
//   };

//   // Handler function to Update CDC Time to the server
//   const handleSubmitCdcUpdateReq = async () => {
//     setIsLoading(true);
//     const cdcUpdateReqBody: CdcControlProps = {
//       cdcStartTime,
//       cdcStopTime,
//       replicationTaskArn: currentReplicationTaskArn,
//     };
//     try {
//       const response = await axios.post(
//         `http://localhost:8081/dms-control/update-cdc`,
//         cdcUpdateReqBody
//       );
//       console.log(
//         'What is response after updating cdc time to server: ',
//         response
//       );
//       if (response.data.success) {
//         toast.success(response.data.message);
//         setProcessStatus(ProcessStatus.REPLICATION_READY_WAITING);
//         x; // getReplicationStatus();
//       }
//     } catch (error) {
//       console.log('Error: ', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handler function to get replication status
//   const getReplicationStatus = async () => {
//     setIsLoading(true);
//     try {
//       const response = await axios.get(
//         `http://localhost:8081/dms-control/get-status`
//       );
//       if (response.data.success) {
//         console.log(
//           'What is response.data.taskStatus: ',
//           response.data.taskStatus
//         );
//         // setProcessStatus(ProcessStatus.);
//         toast.success(response.data.message);
//         if (response.data.taskStatus === 'running') {
//           setCdcStartTime(response.data.cdcStartTime);
//           setCdcStopTime(response.data.cdcStopTime);
//         }
//         if (response.data.taskStatus === 'stopping') {
//           // setCdcStartTime('');
//           // setCdcStopTime('');
//         }
//         if (response.data.taskStatus === 'stopped') {
//           // setCdcStartTime('');
//           // setCdcStopTime('');
//         }
//       }
//     } catch (error) {
//       console.log('Error: ', error);
//       toast.error(error.response.data.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handler function to stop replication
//   const handleStopReplication = async (taskArn: string) => {
//     setIsLoading(true);
//     try {
//       const response = await axios.post(
//         `http://localhost:8081/dms-control/stop-dms/${taskArn}`,
//         {
//           stop: true,
//         }
//       );
//       if (response.data.success) {
//         console.log('Success: ', response.data.message);
//         toast.success(response.data.message);
//         fetchReplicationStatusForSelectedRdsInstances();
//         // getReplicationStatus();
//         // setCdcStartTime('');
//         // setCdcStopTime('');
//         // setIsReadyToReplicate(false);
//       }
//     } catch (error) {
//       console.log('Error: ', error);
//       toast.error(error.response.data.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };

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

//   const fetchReplicationStatusForSelectedRdsInstances = async () => {
//     setIsLoading(true);
//     if (!selectedSourceDatabase || !selectedTargetDatabase) {
//       console.log('selectedSourceDatabase or selectedTargetDatabase is null');
//       return;
//     }
//     try {
//       const response = await axios.get(
//         `http://localhost:8081/rds-control/replication-status/${selectedSourceDatabase}/${selectedTargetDatabase}`
//       );
//       if (response.data.success) {
//         console.log('What are active replication tasks: ', response.data);
//         console.log(
//           'What are replication tasks: ',
//           response.data.replicationTasks
//         );
//         console.log(
//           'What is matching replication task: ',
//           response.data.matchingReplicationTask
//         );
//         if (response.data.matchingReplicationTask) {
//           setCurrentReplicationTaskId(response.data.matchingReplicationTask);
//           setCurrentReplicationTaskArn(
//             response.data.matchingReplicationTaskArn
//           );
//         }
//         if (response.data.isActionRequired) {
//           setActiveReplicationTasks(response.data.replicationTasks);
//           setProcessStatus(ProcessStatus.RDS_ACTION);
//         } else {
//           setActiveReplicationTasks([]);
//           setProcessStatus(ProcessStatus.CDC_UPDATE_READY);
//           toast.success(response.data.message);
//         }
//         // setReplicationStatus(ProcessStatus.RDS_ACTION);
//         // setReplicationStatus(response.data.taskStatus);
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
//     (db) => db.identifier !== selectedTargetDatabase
//   );
//   const filteredTargetDatabases = availableDatabases.filter(
//     (db) => db.identifier !== selectedSourceDatabase
//   );

//   useEffect(() => {
//     fetchActiveRdsInstances();
//     // getReplicationStatus();
//     // setAvailableDatabases(databases);
//   }, []);

//   // Test use effect
//   useEffect(() => {
//     console.log('CDC Start Time: ', cdcStartTime);
//     console.log('CDC Stop Time: ', cdcStopTime);
//     console.log('Active replication tasks: ', activeReplicationTasks);
//     console.log('processStatus: ', processStatus);
//     console.log('current replication task id: ', currentReplicationTaskId);
//     // console.log('Available Databases: ', databases);
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
//           AWS DMS Control
//         </h2>
//       </div>
//       {/* Sub Header Component */}
//       <div className="flex flex-col w-full fixed z-20 py-2 px-4 2xl:px-8 gap-1 2xl:gap-2">
//         <p className="primaryHeadings text-secondaryText flex w-fit items-center gap-2">
//           Start a Custom Replication Process from one RDS to another
//         </p>
//       </div>
//       {/* Body Component */}
//       <div className="bg-white mt-20 z-10 overflow-y-auto h-[calc(100vh-208px)] scrollbar scrollbar-thumb-scrollBarColor scrollbar-track-scrollBarBg">
//         <form
//           // onSubmit={handleDmsStartReplication}
//           className="w-[100%] mx-auto mt-16"
//         >
//           {/* Accordion 1 - UTC */}
//           <Accordion title="DMS Replication">
//             <div className="flex flex-col justify-between gap-8 px-4 border-b pb-20 w-full">
//               {processStatus === ProcessStatus.WAITING_FETCH_RDS_STATUS && (
//                 <div className="flex flex-col gap-4">
//                   <p>
//                     Select the replication source and target databases here:
//                   </p>
//                   <div className="flex gap-8">
//                     <div className="flex flex-col gap-2 w-1/3">
//                       <StateDropDown
//                         value={selectedSourceDatabase || ''}
//                         onChange={(event) =>
//                           setSelectedSourceDatabase(event.target.value)
//                         }
//                         options={filteredSourceDatabases} // Use filtered source databases
//                         label="Select Source Database"
//                         placeholder="Click to select"
//                       />
//                     </div>
//                     <div className="flex flex-col gap-2 w-1/3">
//                       <StateDropDown
//                         value={selectedTargetDatabase || ''}
//                         onChange={(event) =>
//                           setSelectedTargetDatabase(event.target.value)
//                         }
//                         options={filteredTargetDatabases} // Use filtered target databases
//                         label="Select Target Database"
//                         placeholder="Click to select"
//                       />
//                     </div>
//                     <div className="flex flex-col gap-2 w-1/3">
//                       <div className="flex flex-col items-start justify-end gap-2 w-1/3 h-[5.1rem]"></div>
//                     </div>
//                     {/* {errors.postName && (
//                   <p className="text-red-500">{errors.postName}</p>
//                 )} */}
//                   </div>
//                   <div>
//                     <SmallButton
//                       type="button"
//                       onClick={fetchReplicationStatusForSelectedRdsInstances}
//                       disabled={
//                         !selectedSourceDatabase || !selectedTargetDatabase
//                       }
//                     >
//                       Get Status
//                     </SmallButton>
//                   </div>
//                 </div>
//               )}

//               {processStatus === ProcessStatus.RDS_ACTION && (
//                 <div className="flex flex-col gap-4">
//                   <p>
//                     Following replication tasks need to be stopped for the
//                     replication to run:
//                   </p>
//                   <div className="flex gap-8">
//                     <table
//                       id="replicationStatusActionTable"
//                       className="bg-white border border-tableBorder w-2/3 "
//                     >
//                       <thead className="text-center text-primaryText border border-tableBorder sticky top-0 bg-tableHeadingColour z-10">
//                         <tr>
//                           <th
//                             className="p-2 border border-tableBorder w-[10%] text-xs md:text-sm xl:text-base"
//                             rowSpan={2}
//                           >
//                             Replication Task
//                           </th>
//                           <th
//                             className="p-2 border border-tableBorder w-[10%] text-xs md:text-sm xl:text-base"
//                             rowSpan={2}
//                           >
//                             Task Status
//                           </th>

//                           <th
//                             className="p-2 border border-tableBorder w-[5%] text-xs md:text-sm xl:text-base"
//                             rowSpan={2}
//                           >
//                             Action
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody className="text-primaryText border border-tableBorder ">
//                         {activeReplicationTasks &&
//                           activeReplicationTasks.map(
//                             (task: ReplicationTask) => (
//                               <tr
//                                 key={task.taskName}
//                                 className="border border-tableBorder"
//                               >
//                                 <td className="p-2 border border-tableBorder w-[10%] text-xs lg:text-sm xl:text-base ">
//                                   <p>{task.taskName || '---'}</p>
//                                 </td>
//                                 <td className="p-2 border border-tableBorder w-[10%] text-xs lg:text-sm xl:text-base ">
//                                   {task.status || '---'}
//                                 </td>

//                                 <td className="p-2 border border-tableBorder w-[5%] text-xs lg:text-sm xl:text-base relative text-center">
//                                   <div className="flex justify-center items-center">
//                                     {task.status === 'running' ? (
//                                       <SmallButton
//                                         isError
//                                         type="button"
//                                         onClick={(e) => {
//                                           e.preventDefault();
//                                           return handleStopReplication(
//                                             task.taskArn
//                                           );
//                                         }}
//                                       >
//                                         Stop Replication
//                                       </SmallButton>
//                                     ) : (
//                                       <p>---</p>
//                                     )}
//                                   </div>
//                                 </td>
//                               </tr>
//                             )
//                           )}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               )}

//               {processStatus === ProcessStatus.CDC_UPDATE_READY && (
//                 <>
//                   <div className="flex flex-col gap-4">
//                     <div>
//                       Select the replication start and stop date and time
//                       for&nbsp;&apos;
//                       <span className="font-semibold">
//                         {currentReplicationTaskId || '---'}
//                       </span>
//                       &apos;&nbsp;here:
//                     </div>
//                     <div className="flex gap-8">
//                       {/* CDC Start Time */}
//                       <div className="flex flex-col gap-2 w-1/3">
//                         <label className="font-medium text-secondaryText text-xs lg:text-sm xl:text-base">
//                           Start Date & Time
//                           <span className=" text-red-500 pl-1">*</span>
//                         </label>
//                         <Datetime
//                           value={
//                             cdcStartTime ? moment(cdcStartTime) : undefined
//                           }
//                           initialValue={cdcStartTime}
//                           onChange={(value) =>
//                             handleUpdateCdcTime(
//                               moment(value).toDate().toISOString(),
//                               'start'
//                             )
//                           }
//                           utc
//                           inputProps={{
//                             placeholder: 'Click to Select',
//                           }}
//                           dateFormat="YYYY-MM-DD"
//                           timeFormat="HH:mm:ss"
//                           className="py-2 lg:py-3 xl:py-4 px-2 w-full h-full rounded-md shadow-sm border border-inputBorder text-xs lg:text-sm xl:text-base"
//                         />
//                       </div>
//                       {/* CDC Stop Time */}
//                       <div className="flex flex-col gap-2 w-1/3 ">
//                         <label className="font-medium text-secondaryText text-[10px] md:text-xs lg:text-sm xl:text-base">
//                           Stop Date & Time
//                           <span className=" text-red-500 pl-1">*</span>
//                         </label>
//                         <Datetime
//                           value={cdcStopTime ? moment(cdcStopTime) : undefined}
//                           initialValue={cdcStopTime}
//                           onChange={(value) =>
//                             // handleDmsControlDateChange('cdcStartTime', value)
//                             handleUpdateCdcTime(
//                               moment(value).toDate().toISOString(),
//                               'stop'
//                             )
//                           }
//                           utc
//                           inputProps={{
//                             placeholder: 'Click to Select',
//                           }}
//                           dateFormat="YYYY-MM-DD"
//                           timeFormat="HH:mm:ss"
//                           className="py-2 lg:py-3 xl:py-4 px-2 w-full h-full rounded-md shadow-sm border border-inputBorder text-xs lg:text-sm xl:text-base"
//                         />
//                       </div>
//                       <div className="flex flex-col items-start justify-end gap-2 w-1/3 h-[5.1rem]"></div>
//                     </div>
//                   </div>
//                   <div className="flex flex-col items-start justify-end gap-2 w-1/3">
//                     <SmallButton
//                       disabled={
//                         // isReadyToReplicate || !cdcStartTime || !cdcStopTime
//                         !cdcStartTime || !cdcStopTime
//                       }
//                       type="button"
//                       onClick={handleSubmitCdcUpdateReq}
//                     >
//                       Update CDC Time
//                     </SmallButton>
//                   </div>
//                 </>
//               )}

//               {processStatus === ProcessStatus.REPLICATION_READY_WAITING && (
//                 <div className="flex flex-col gap-4">
//                   <p>Review Final Details before replication:</p>
//                   <p className=" text-secondaryText text-xs lg:text-sm xl:text-base">
//                     <span className="font-medium">Source Instance: &nbsp;</span>
//                     {selectedSourceDatabase}
//                   </p>
//                   <p className="text-secondaryText text-xs lg:text-sm xl:text-base">
//                     <span className="font-medium">Target Instance: &nbsp;</span>
//                     {selectedTargetDatabase}
//                   </p>
//                   <p className="text-secondaryText text-xs lg:text-sm xl:text-base">
//                     <span className="font-medium">Replicaion Task: &nbsp;</span>
//                     {currentReplicationTaskId}
//                   </p>
//                   <p className="text-secondaryText text-xs lg:text-sm xl:text-base">
//                     <span className="font-medium">
//                       Start Date & Time: &nbsp;
//                     </span>
//                     {formatReadableDateTime(cdcStartTime)}
//                   </p>
//                   <p className="text-secondaryText text-xs lg:text-sm xl:text-base">
//                     <span className="font-medium">
//                       Stop Date & Time: &nbsp;
//                     </span>
//                     {formatReadableDateTime(cdcStopTime)}
//                   </p>
//                   <div>
//                     <SmallButton
//                       onClick={handleDmsStartReplication}
//                       type="button"
//                     >
//                       Start Replication
//                     </SmallButton>
//                   </div>
//                 </div>
//               )}
//               <p>
//                 Status: &nbsp;
//                 <span
//                   className={`${processStatus === ProcessStatus.WAITING_FETCH_RDS_STATUS ? 'text-bgPrimaryButton' : 'text-errorColour'}`}
//                 >
//                   {processStatus}
//                 </span>
//               </p>
//             </div>
//           </Accordion>
//         </form>
//       </div>
//     </>
//   );
// };

// export default DMSControlCustom;
