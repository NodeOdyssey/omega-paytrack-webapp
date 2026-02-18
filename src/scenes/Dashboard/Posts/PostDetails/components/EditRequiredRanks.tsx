/* Libraries */
import React, { useEffect, useRef, useState } from 'react';
import * as Yup from 'yup';
import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';

/* Configs */
import { api } from '../../../../../configs/api';

/* Hooks */
import useVerifyUserAuth from '../../../../../hooks/useVerifyUserAuth';
import useHandleAxiosError from '../../../../../hooks/useHandleAxiosError';
import useHandleYupError from '../../../../../hooks/useHandleYupError';

/* Types */
import { Rank } from '../../../../../types/rank';
import { PostRankLink } from '../../../../../types/postRankLink';
// import { TaxesAndDeduction } from '../../../../../types/taxesAndDeduction';

/* Components */
import ColumnSelector from './common/ColumnSelector';
import Loader from '../../../../../common/Loader/Loader';
import ConfirmationModal from '../../../../../common/Modal/ConfirmationModal';
// import CustomTaxSlabDropdown from '../../../../../common/CustomTaxSlabDropDown/CustomTaxSlabDropDown';

/* Assets */
import {
  Cancel,
  Delete_Icon,
  EditPencil_Icon,
  Ok,
  Plus_Black,
  TableOptionsIcon,
} from '../../../../../assets/icons';
import useClickOutside from '../../../../../hooks/useClickOutside';
import { Tooltip } from 'react-tooltip';

/* Initial Row Data */
const initialRanksRowData: PostRankLink = {
  postId: 0,
  rankId: 0,
  designation: '',
  basicSalary: 0,
  hra: 0,
  // vda: 0,
  kitWashingAllowance: 0,
  cityAllowance: 0,
  conveyance: 0,
  uniformAllowance: 0,
  // otherAllowance: 0,
  taxDeductionId: 0,
  taxDeducName: '',
  // added special allowance & weekly off
  specialAllowance: 0,
  weeklyOff: 0,
};

// column storage key
const COLUMN_STORAGE_KEY = 'visibleColumns';

/* Dynamic Column Data */
const initalColumnsToShow = [
  'designation',
  'basicSalary',
  'kitWashingAllowance',
  'hra',
  // 'vda',
  'specialAllowance',
  'weeklyOff',
  // 'taxGroup',
];

const allColumns = [
  'designation',
  'basicSalary',
  'hra',
  'conveyance',
  'kitWashingAllowance',
  'uniformAllowance',
  'cityAllowance',
  // 'vda',
  // 'otherAllowance',
  'specialAllowance',
  'weeklyOff',
  // 'taxGroup',
];

/* Prop Types */
type RequiredRanksProps = {
  existingPostRanks: PostRankLink[];
  refreshPostRanks: () => void;
  updateRequiredRanks: (requiredRanks: PostRankLink[]) => void;
  requiredRanks: PostRankLink[];
  // resetTaxDropdown: boolean;
  currentPostId: number;
};

const EditRequiredRanks: React.FC<RequiredRanksProps> = ({
  existingPostRanks,
  refreshPostRanks,
  updateRequiredRanks,
  requiredRanks,
  // resetTaxDropdown,
  currentPostId,
}: RequiredRanksProps) => {
  /* Verify User Auth */
  const accessToken = useVerifyUserAuth();

  /* Loader */
  const [isLoading, setIsLoading] = useState(false);

  /* Error Handling */
  const { handleYupError, setErrors } = useHandleYupError();
  const { handleAxiosError } = useHandleAxiosError(setErrors);

  /* Manage visible columns */
  // const [visibleColumns, setVisibleColumns] =
  //   useState<string[]>(initalColumnsToShow);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(() => {
    // Load columns from localStorage or fallback to initial values
    const savedColumns = localStorage.getItem(COLUMN_STORAGE_KEY);
    return savedColumns ? JSON.parse(savedColumns) : initalColumnsToShow;
  });
  const [areAllColsSelected, setAreAllColsSelected] = useState(false);

  const handleUpdateVisibleColumns = (column: string) => {
    let updatedColumns: string[];

    if (column === 'all') {
      if (visibleColumns.length === allColumns.length) {
        // setVisibleColumns(['designation', 'basicSalary']);
        updatedColumns = ['designation', 'basicSalary'];
        setAreAllColsSelected(false);
      } else {
        // setVisibleColumns(allColumns);
        updatedColumns = allColumns;
        setAreAllColsSelected(true);
      }
    } else {
      // setVisibleColumns((prevColumns) =>
      //   prevColumns.includes(column)
      //     ? prevColumns.filter((col) => col !== column)
      //     : [...prevColumns, column]
      // );
      updatedColumns = visibleColumns.includes(column)
        ? visibleColumns.filter((col) => col !== column)
        : [...visibleColumns, column];
    }

    // Update state and localStorage
    setVisibleColumns(updatedColumns);
    localStorage.setItem(COLUMN_STORAGE_KEY, JSON.stringify(updatedColumns));
  };

  useEffect(() => {
    const allSelected = visibleColumns.length === allColumns.length;
    if (allSelected) {
      setAreAllColsSelected(true);
    } else {
      setAreAllColsSelected(false);
    }
  }, [visibleColumns]);

  /* Ranks Data Handling */
  const [allRanksData, setAllRanksData] = useState<Rank[]>([]);
  const [selectedRankIds, setSelectedRankIds] = useState<number[]>([]);

  const fetchRanks = async () => {
    if (!accessToken) return;
    try {
      const response = await axios.get(`${api.baseUrl}/ranks`, {
        headers: {
          'x-access-token': accessToken,
        },
      });
      if (response.data && response.data.success) {
        const allRanks: Rank[] = response.data.ranks;

        if (allRanks && allRanks.length > 0) {
          // Set the ranks data
          setAllRanksData(allRanks);
        }
      } else {
        console.error('Error:', response.data.message);
      }
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        handleYupError(error);
      } else {
        handleAxiosError(error as AxiosError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRanks();
  }, [accessToken]);

  // Update selected rank ids when existingPostRanks changes
  useEffect(() => {
    if (existingPostRanks.length > 0) {
      const rankIds = existingPostRanks.map((rank) => rank.rankId);
      setSelectedRankIds((prevSelectedRankIds) => [
        ...prevSelectedRankIds,
        ...rankIds,
      ]);
    }
  }, [existingPostRanks]);

  /* Tax Group Data Handling */
  // const [allTaxGroupsData, setAllTaxGroupsData] = useState<TaxesAndDeduction[]>(
  //   []
  // );

  // const fetchTaxGroups = async () => {
  //   if (!accessToken) return;
  //   setIsLoading(true);
  //   try {
  //     const response = await axios.get(`${api.baseUrl}/taxes-and-deduction`, {
  //       headers: { 'x-access-token': accessToken },
  //     });
  //     if (response.data && response.data.success) {
  //       // console.log('taxesAndDeductions: ', response.data);
  //       setAllTaxGroupsData(response.data.taxesAndDeductions);
  //     } else {
  //       console.error('Error:', response.data.message);
  //     }
  //   } catch (error) {
  //     if (error instanceof Yup.ValidationError) {
  //       handleYupError(error);
  //     } else {
  //       handleAxiosError(error as AxiosError);
  //     }
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchTaxGroups();
  // }, [accessToken]);

  /* Ranks Table Data Handling */
  const isAddMoreRowsAllowed = () => {
    if (requiredRanks.length === 0) return true;
    const lastRow = requiredRanks[requiredRanks.length - 1];
    return lastRow && lastRow.designation !== '';
  };

  const handleAddRow = () => {
    updateRequiredRanks([...requiredRanks, initialRanksRowData]);
  };

  const handleRemoveRow = (index: number) => {
    const newRows = [...requiredRanks];
    const removedRow = newRows[index];
    newRows.splice(index, 1);

    // Update the selected ranks data
    updateRequiredRanks(newRows);

    // Update selectedRankIds by removing the ID of the removed row
    if (removedRow && removedRow.ID) {
      const newSelectedRankIds = selectedRankIds.filter(
        (id) => id !== removedRow.ID
      );
      setSelectedRankIds(newSelectedRankIds);
    }
  };

  // const calculatePTax = (basicSalary: number) => {
  //   if (basicSalary < 10000) {
  //     return 0;
  //   } else if (basicSalary >= 10000 && basicSalary < 15000) {
  //     return 150;
  //   } else {
  //     return 180;
  //   }
  // };

  // const findTaxDeductionId = (basicSalary: number) => {
  //   const pTax = calculatePTax(basicSalary);

  //   for (const taxGroup of allTaxGroupsData) {
  //     for (const [key, value] of Object.entries(taxGroup)) {
  //       if (key === 'pTax' && Number(value) === Number(pTax)) {
  //         return taxGroup.ID as number;
  //       }
  //     }
  //   }
  //   return 0;
  // };

  // const findTaxDeducName = (basicSalary: number) => {
  //   const taxDeductionId = findTaxDeductionId(basicSalary);
  //   if (taxDeductionId) {
  //     const taxDeduction = allTaxGroupsData.find(
  //       (taxGroup) => taxGroup.ID === taxDeductionId
  //     );
  //     if (taxDeduction) {
  //       return taxDeduction.taxDeducName;
  //     }
  //   }
  //   return '';
  // };

  const handleRankRowDataChange = (
    index: number,
    field: keyof PostRankLink,
    value: number | string
  ) => {
    const newRows = [...requiredRanks];
    if (field === 'ID') {
      const rankId = Number(value);
      const selectedRank = allRanksData.find((rank) => rank.ID === rankId);
      if (selectedRank) {
        newRows[index] = {
          ...selectedRank,
          postId: newRows[index].postId,
          rankId: newRows[index].rankId,
          taxDeductionId: 0,
          taxDeducName: '',
          // taxDeductionId: findTaxDeductionId(selectedRank.basicSalary),
          // taxDeducName: findTaxDeducName(selectedRank.basicSalary),
        };
      }
    } else if (field === 'designation') {
      newRows[index] = { ...newRows[index], [field]: value as string };
    } else {
      newRows[index] = {
        ...newRows[index],
        [field]: parseInt(value as string),
      };
    }

    updateRequiredRanks(newRows);
    setSelectedRankIds([...selectedRankIds, Number(newRows[index].ID)]);
  };

  /* Delete Old Post Ranks */
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [currentPostRankId, setCurrentPostRankId] = useState<number>(0);
  const [currentPostRankName, setSelectedPostRankName] = useState<string>('');

  const handleDeleteOldPostRanks = async (postRankLinkId: number) => {
    if (!postRankLinkId) return;
    // await handleDeleteTaxDeducPostRankLink(currentTaxPostRankDeductionId);
    try {
      const response = await axios.delete(
        `${api.baseUrl}/posts/unlink-rank/${postRankLinkId}`,
        {
          headers: {
            'x-access-token': accessToken,
          },
        }
      );
      if (response.data.success) {
        const deletedRankId = response.data.rankId;
        const newSelectedRankIds = selectedRankIds.filter(
          (id) => id !== deletedRankId
        );
        setSelectedRankIds(newSelectedRankIds);
        toast.success(response.data.message);
        refreshPostRanks();
      }
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        handleYupError(error);
      } else {
        handleAxiosError(error as AxiosError);
      }
    } finally {
      setIsLoading(false);
      setShowDeleteModal(false);
    }
  };

  /** Table Action Modal Controls */
  const [actionModalIndex, setActionModalIndex] = useState<number | null>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);
  useClickOutside(actionMenuRef, () => setActionModalIndex(null));

  /* Update Post Rank Controls */

  const initialEditPostRankData = {
    postId: currentPostId,
    rankId: 0,
    taxDeductionId: 0,
    basicSalary: 0,
    designation: '',
    kitWashingAllowance: 0,
    cityAllowance: 0,
    conveyance: 0,
    hra: 0,
    // vda: 0,
    uniformAllowance: 0,
    // otherAllowance: 0,
    taxDeducName: '',
    specialAllowance: 0,
    weeklyOff: 0,
  };

  const [isEditingPostRank, setIsEditingPostRank] = useState<boolean>(false);
  // const [editPostRankId, setEditPostRankId] = useState<number>(0);
  const [editedPostRankLinkData, setEditedPostRankLinkData] =
    useState<PostRankLink>(initialEditPostRankData);

  const handleUpdatePostRankEditData = (
    // id: number,
    field: keyof PostRankLink,
    value: number
  ) => {
    console.log('what is field: ', field);
    console.log('what is value: ', value);
    setEditedPostRankLinkData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmitEditedPostRank = async (postRankId: number) => {
    if (editedPostRankLinkData.basicSalary === 0) {
      console.log('Basic Salary is 0');
      // setErrors({
      //   basicSalary: 'Basic Salary cannot be 0',
      // });
      setErrors((prev) => ({
        ...prev,
        basicSalary: 'Basic Salary cannot be 0',
      }));
      toast.error('Basic Salary cannot be empty');
      return;
    }

    try {
      setIsLoading(true);

      const response = await axios.patch(
        `${api.baseUrl}/posts/update-rank/${postRankId}`,
        editedPostRankLinkData,
        {
          headers: {
            'x-access-token': accessToken,
          },
        }
      );

      console.log('What is response data in edit: ', response.data);

      if (response.data.success) {
        toast.success(response.data.message);
        refreshPostRanks();
        setEditedPostRankLinkData(initialEditPostRankData);
      }
    } catch (error) {
      handleAxiosError(error as AxiosError);
    } finally {
      setActionModalIndex(null);
      setIsEditingPostRank(false);
      setIsLoading(false);
      // refreshPostRanks();
    }
  };

  // Test use effect
  useEffect(() => {
    console.log('selected ranks data: ', requiredRanks);
    console.log('Edited Post Rank Data: ', editedPostRankLinkData);
    // console.log('tax group data: ', allTaxGroupsData);
  });

  // JSX
  return (
    <div className="flex flex-col gap-2 2xl:gap-4  border-b">
      {isLoading && <Loader />}
      <ColumnSelector
        updateColumns={handleUpdateVisibleColumns}
        visibleColumns={visibleColumns}
        areAllColsSelected={areAllColsSelected}
      />
      <div className="flex text-center overflow-x-auto max-h-[60vh] scrollbar-thumb-scrollBarColor scrollbar-track-scrollBarBg">
        <table className="min-w-full bg-white border border-accordionBg">
          <thead className="text-center text-primaryText border border-accordionBg sticky top-0 z-20">
            <tr className="bg-tableHeadingColour">
              {visibleColumns.includes('designation') && (
                <th className="emp-posting-table-th padding-y-responsive-table-header ">
                  Rank
                </th>
              )}
              {visibleColumns.includes('basicSalary') && (
                <th className="emp-posting-table-th padding-y-responsive-table-header">
                  Basic Pay
                </th>
              )}
              {visibleColumns.includes('hra') && (
                <th className="emp-posting-table-th padding-y-responsive-table-header">
                  HRA
                </th>
              )}
              {/* {visibleColumns.includes('vda') && (
                <th className="emp-posting-table-th padding-y-responsive-table-header">
                  VDA
                </th>
              )} */}
              {visibleColumns.includes('kitWashingAllowance') && (
                <th className="emp-posting-table-th padding-y-responsive-table-header">
                  Kit/Washing Allowance
                </th>
              )}
              {visibleColumns.includes('cityAllowance') && (
                <th className="emp-posting-table-th padding-y-responsive-table-header">
                  City Allowance
                </th>
              )}
              {visibleColumns.includes('conveyance') && (
                <th className="emp-posting-table-th padding-y-responsive-table-header">
                  Conveyance
                </th>
              )}
              {visibleColumns.includes('uniformAllowance') && (
                <th className="emp-posting-table-th padding-y-responsive-table-header">
                  Uniform Allowance
                </th>
              )}
              {/* {visibleColumns.includes('otherAllowance') && (
                <th className="emp-posting-table-th padding-y-responsive-table-header">
                  Others
                </th>
              )} */}
              {/* {visibleColumns.includes('taxGroup') && (
                <th className="emp-posting-table-th padding-y-responsive-table-header">
                  Tax Group
                </th>
              )} */}
              {visibleColumns.includes('specialAllowance') && (
                <th className="emp-posting-table-th padding-y-responsive-table-header">
                  Special Allowance
                </th>
              )}
              {visibleColumns.includes('weeklyOff') && (
                <th className="emp-posting-table-th padding-y-responsive-table-header">
                  Weekly Off
                </th>
              )}
              <th className="emp-posting-table-th padding-y-responsive-table-header">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="text-primaryText border border-tableBorder">
            {existingPostRanks.length > 0 &&
              existingPostRanks.map((row, index) => (
                <tr
                  key={index}
                  className="border border-tableBorder text-xs lg:text-sm xl:text-base hover:bg-gray-200"
                >
                  {/* Designation */}
                  {visibleColumns.includes('designation') && (
                    <td className="post-required-rank-table-td">
                      <p>{row.designation}</p>
                    </td>
                  )}
                  {/* Basic Salary */}
                  {visibleColumns.includes('basicSalary') && (
                    <td className="post-required-rank-table-td">
                      {isEditingPostRank && actionModalIndex === index ? (
                        <input
                          type="number"
                          value={editedPostRankLinkData.basicSalary || ''}
                          onWheel={(e) => e.currentTarget.blur()} // Prevent scrolling in number input
                          onKeyDown={(e) => {
                            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                              e.preventDefault(); // Prevent arrow key increment/decrement
                            }
                          }}
                          onChange={(e) =>
                            handleUpdatePostRankEditData(
                              'basicSalary',
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="px-2 w-full h-10 2xl:h-12 rounded-md shadow-sm border text-responsive-table bg-transparent"
                          min="0"
                          step="1"
                        />
                      ) : (
                        <p>
                          {row.basicSalary !== undefined && row.basicSalary > 0
                            ? `Rs. ${row.basicSalary}`
                            : '-'}
                        </p>
                      )}
                    </td>
                  )}
                  {/* HRA */}
                  {visibleColumns.includes('hra') && (
                    <td className="post-required-rank-table-td">
                      {isEditingPostRank && actionModalIndex === index ? (
                        <input
                          type="number"
                          value={editedPostRankLinkData.hra || ''}
                          onWheel={(e) => e.currentTarget.blur()}
                          onKeyDown={(e) => {
                            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                              e.preventDefault();
                            }
                          }}
                          onChange={(e) =>
                            handleUpdatePostRankEditData(
                              'hra',
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="px-2 w-full h-10 2xl:h-12 rounded-md shadow-sm border text-responsive-table bg-transparent"
                          min="0"
                          step="1"
                        />
                      ) : (
                        <p>
                          {row.hra !== undefined && row.hra > 0
                            ? `Rs. ${row.hra}`
                            : '-'}
                        </p>
                      )}
                    </td>
                  )}

                  {/* VDA */}
                  {/* {visibleColumns.includes('vda') && (
                    <td className="py-3 px-4 border border-tableBorder">
                      {isEditingPostRank && actionModalIndex === index ? (
                        <input
                          type="number"
                          value={editedPostRankLinkData.vda || ''}
                          onWheel={(e) => e.currentTarget.blur()}
                          onKeyDown={(e) => {
                            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                              e.preventDefault();
                            }
                          }}
                          onChange={(e) =>
                            handleUpdatePostRankEditData(
                              'vda',
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="w-full h-[32px] border rounded-md px-2"
                          min="0"
                          step="1"
                        />
                      ) : (
                        <p>
                          {row.vda !== undefined && row.vda > 0
                            ? `Rs. ${row.vda}`
                            : '-'}
                        </p>
                      )}
                    </td>
                  )} */}

                  {/* Kit Washing Allowance */}
                  {visibleColumns.includes('kitWashingAllowance') && (
                    <td className="post-required-rank-table-td">
                      {isEditingPostRank && actionModalIndex === index ? (
                        <input
                          type="number"
                          value={
                            editedPostRankLinkData.kitWashingAllowance || ''
                          }
                          onWheel={(e) => e.currentTarget.blur()}
                          onKeyDown={(e) => {
                            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                              e.preventDefault();
                            }
                          }}
                          onChange={(e) =>
                            handleUpdatePostRankEditData(
                              'kitWashingAllowance',
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="px-2 w-full h-10 2xl:h-12 rounded-md shadow-sm border text-responsive-table bg-transparent"
                          min="0"
                          step="1"
                        />
                      ) : (
                        <p>
                          {row.kitWashingAllowance !== undefined &&
                          row.kitWashingAllowance > 0
                            ? `Rs. ${row.kitWashingAllowance}`
                            : '-'}
                        </p>
                      )}
                    </td>
                  )}

                  {/* City Allowance */}
                  {visibleColumns.includes('cityAllowance') && (
                    <td className="post-required-rank-table-td">
                      {isEditingPostRank && actionModalIndex === index ? (
                        <input
                          type="number"
                          value={editedPostRankLinkData.cityAllowance || ''}
                          onWheel={(e) => e.currentTarget.blur()}
                          onKeyDown={(e) => {
                            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                              e.preventDefault();
                            }
                          }}
                          onChange={(e) =>
                            handleUpdatePostRankEditData(
                              'cityAllowance',
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="px-2 w-full h-10 2xl:h-12 rounded-md shadow-sm border text-responsive-table bg-transparent"
                          min="0"
                          step="1"
                        />
                      ) : (
                        <p>
                          {row.cityAllowance !== undefined &&
                          row.cityAllowance > 0
                            ? `Rs. ${row.cityAllowance}`
                            : '-'}
                        </p>
                      )}
                    </td>
                  )}

                  {/* Conveyance */}
                  {visibleColumns.includes('conveyance') && (
                    <td className="post-required-rank-table-td">
                      {isEditingPostRank && actionModalIndex === index ? (
                        <input
                          type="number"
                          value={editedPostRankLinkData.conveyance || ''}
                          onWheel={(e) => e.currentTarget.blur()}
                          onKeyDown={(e) => {
                            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                              e.preventDefault();
                            }
                          }}
                          onChange={(e) =>
                            handleUpdatePostRankEditData(
                              'conveyance',
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="px-2 w-full h-10 2xl:h-12 rounded-md shadow-sm border text-responsive-table bg-transparent"
                          min="0"
                          step="1"
                        />
                      ) : (
                        <p>
                          {row.conveyance !== undefined && row.conveyance > 0
                            ? `Rs. ${row.conveyance}`
                            : '-'}
                        </p>
                      )}
                    </td>
                  )}

                  {/* Uniform Allowance */}
                  {visibleColumns.includes('uniformAllowance') && (
                    <td className="post-required-rank-table-td">
                      {isEditingPostRank && actionModalIndex === index ? (
                        <input
                          type="number"
                          value={editedPostRankLinkData.uniformAllowance || ''}
                          onWheel={(e) => e.currentTarget.blur()}
                          onKeyDown={(e) => {
                            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                              e.preventDefault();
                            }
                          }}
                          onChange={(e) =>
                            handleUpdatePostRankEditData(
                              'uniformAllowance',
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="px-2 w-full h-10 2xl:h-12 rounded-md shadow-sm border text-responsive-table bg-transparent"
                          min="0"
                          step="1"
                        />
                      ) : (
                        <p>
                          {row.uniformAllowance !== undefined &&
                          row.uniformAllowance > 0
                            ? `Rs. ${row.uniformAllowance}`
                            : '-'}
                        </p>
                      )}
                    </td>
                  )}

                  {/* Other Allowance */}
                  {/* {visibleColumns.includes('otherAllowance') && (
                    <td className="py-3 px-4 border border-tableBorder">
                      {isEditingPostRank && actionModalIndex === index ? (
                        <input
                          type="number"
                          value={editedPostRankLinkData.otherAllowance || ''}
                          onWheel={(e) => e.currentTarget.blur()}
                          onKeyDown={(e) => {
                            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                              e.preventDefault();
                            }
                          }}
                          onChange={(e) =>
                            handleUpdatePostRankEditData(
                              'otherAllowance',
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="w-full h-[32px] border rounded-md px-2"
                          min="0"
                          step="1"
                        />
                      ) : (
                        <p>
                          {row.otherAllowance !== undefined &&
                          row.otherAllowance > 0
                            ? `Rs. ${row.otherAllowance}`
                            : '-'}
                        </p>
                      )}
                    </td>
                  )} */}

                  {/* special allowance */}
                  {visibleColumns.includes('specialAllowance') && (
                    <td className="post-required-rank-table-td">
                      {isEditingPostRank && actionModalIndex === index ? (
                        <input
                          type="number"
                          value={editedPostRankLinkData.specialAllowance || ''}
                          onWheel={(e) => e.currentTarget.blur()}
                          onKeyDown={(e) => {
                            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                              e.preventDefault();
                            }
                          }}
                          onChange={(e) =>
                            handleUpdatePostRankEditData(
                              'specialAllowance',
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="px-2 w-full h-10 2xl:h-12 rounded-md shadow-sm border text-responsive-table bg-transparent"
                          min="0"
                          step="1"
                        />
                      ) : (
                        <p>
                          {/* {row.specialAllowance !== undefined &&
                          row.specialAllowance > 0
                            ? `Rs. ${row.specialAllowance}`
                            : '-'} */}
                          {row.specialAllowance !== undefined &&
                          row.specialAllowance > 0
                            ? `Rs. ${Number(row.specialAllowance).toFixed(2)}`
                            : '-'}
                        </p>
                      )}
                    </td>
                  )}

                  {/* Weekly Off */}
                  {visibleColumns.includes('weeklyOff') && (
                    <td className="post-required-rank-table-td">
                      {isEditingPostRank && actionModalIndex === index ? (
                        <input
                          type="number"
                          value={editedPostRankLinkData.weeklyOff || ''}
                          onWheel={(e) => e.currentTarget.blur()}
                          onKeyDown={(e) => {
                            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                              e.preventDefault();
                            }
                          }}
                          onChange={(e) =>
                            handleUpdatePostRankEditData(
                              'weeklyOff',
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="px-2 w-full h-10 2xl:h-12 rounded-md shadow-sm border text-responsive-table bg-transparent"
                          min="0"
                          step="1"
                        />
                      ) : (
                        <p>
                          {/* {row.weeklyOff !== undefined && row.weeklyOff > 0
                            ? `Rs. ${row.weeklyOff.toFixed(2)}`
                            : '-'} */}
                          {row.weeklyOff !== undefined && row.weeklyOff > 0
                            ? `Rs. ${Number(row.weeklyOff).toFixed(2)}`
                            : '-'}
                        </p>
                      )}
                    </td>
                  )}

                  {/* {visibleColumns.includes('taxGroup') && isEditingPostRank ? (
                    <td>
                      <CustomTaxSlabDropdown
                        // placeholder="Select"
                        placeholder={row.taxDeducName}
                        slabs={allTaxGroupsData}
                        onSelectSlab={(taxId) =>
                          handleUpdatePostRankEditData('taxDeductionId', taxId)
                        }
                        reset={resetTaxDropdown} // Pass the reset state
                      />
                    </td>
                  ) : (
                    <td className="py-3 px-4 border border-tableBorder">
                      <p>{row.taxDeducName}</p>
                    </td>
                  )} */}

                  {/* Action buttons */}
                  {isEditingPostRank && actionModalIndex === index ? (
                    <td className="post-required-rank-table-td">
                      <div className="flex gap-1 justify-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setErrors({});

                            handleSubmitEditedPostRank(row.ID ? row.ID : 0);
                          }}
                        >
                          <img src={Ok} className="table-action-icon" alt="" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsEditingPostRank(false);
                            setActionModalIndex(null);
                          }}
                        >
                          <img
                            src={Cancel}
                            className="w-4 lg:w-5 h-4 lg:h-5"
                            alt=""
                          />
                        </button>
                      </div>
                    </td>
                  ) : (
                    <td className="p-2 border border-tableBorder w-[5%] text-xs lg:text-sm xl:text-base relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setActionModalIndex(
                            actionModalIndex === index ? null : index
                          );
                          setEditedPostRankLinkData(
                            row ? row : initialEditPostRankData
                          );
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <img
                          src={TableOptionsIcon}
                          alt="TableOptionsIcon"
                          className="w-4 h-4 "
                        />
                      </button>
                      {actionModalIndex === index && (
                        <>
                          {/* <div className="absolute inset-0 bg-black opacity-50 pointer-events-none"></div> */}
                          <div
                            ref={actionMenuRef}
                            className={`absolute right-[60%] ${existingPostRanks.length === 1 ? 'bottom-[0%] lg:bottom-[0%]' : actionModalIndex === 0 ? '' : 'bottom-[10%] lg:bottom-[20%]'} ${existingPostRanks.length === 2 && actionModalIndex === 0 ? 'bottom-[-10%] lg:bottom-[-10%]' : ''} w-20 md:w-24 lg:w-28 bg-white border border-gray-300 shadow-lg z-50`}
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsEditingPostRank(true);
                              }}
                              className="flex gap-2 items-center w-full px-2 lg:px-4 py-2 text-xs md:text-sm lg:text-base primaryLabels text-secondaryText hover:bg-smallMenuHover"
                            >
                              <img
                                src={EditPencil_Icon}
                                alt="EditPencil_Icon"
                                className="w-3 h-3 lg:w-4 lg:h-4"
                              />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setCurrentPostRankId(row.ID as number);
                                setSelectedPostRankName(row.designation);
                                setShowDeleteModal(true);
                              }}
                              className="flex gap-2 items-center w-full px-2  lg:px-4 py-2 text-xs md:text-sm lg:text-base primaryLabels text-secondaryText hover:bg-smallMenuHover"
                            >
                              <img
                                src={Delete_Icon}
                                alt="Delete_Icon"
                                className="w-3 h-3 lg:w-4 lg:h-4"
                              />
                              <span>Delete</span>
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            {requiredRanks.map((row, index) => (
              <tr key={index} className="border border-tableBorder ">
                {visibleColumns.includes('designation') && (
                  <td className="post-required-rank-table-td">
                    <div
                      data-tooltip-id={`postName-tooltip-${index}`}
                      data-tooltip-content={row.designation}
                    >
                      <select
                        value={row.ID || ''}
                        disabled={selectedRankIds.includes(row.ID as number)}
                        onChange={(e) =>
                          handleRankRowDataChange(
                            index,
                            'ID',
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full h-7 2xl:h-8 bg-white border rounded-lg  px-2 max-h-60 cursor-pointer"
                      >
                        <option value="">Select</option>
                        {allRanksData.map((rank) => (
                          <option
                            key={rank.ID}
                            value={rank.ID}
                            disabled={selectedRankIds.includes(
                              rank.ID as number
                            )}
                            className="cursor-pointer text-responsive-table"
                          >
                            {rank.designation}
                          </option>
                        ))}
                      </select>
                      <Tooltip
                        id={`postName-tooltip-${index}`}
                        place="right"
                        hidden={row.designation ? false : true}
                      />
                    </div>
                  </td>
                )}
                {visibleColumns.includes('basicSalary') && (
                  <td className="post-required-rank-table-td">
                    <input
                      type="number"
                      className="px-2 w-full h-7 2xl:h-8 rounded-md shadow-sm border text-responsive-table bg-transparent"
                      value={row.basicSalary}
                      onChange={(e) =>
                        handleRankRowDataChange(
                          index,
                          'basicSalary',
                          e.target.value
                        )
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                          e.preventDefault();
                        }
                      }}
                      onWheel={(e) => e.currentTarget.blur()}
                    />
                  </td>
                )}
                {visibleColumns.includes('hra') && (
                  <td className="post-required-rank-table-td">
                    <input
                      type="number"
                      className="px-2 w-full h-7 2xl:h-8 rounded-md shadow-sm border text-responsive-table bg-transparent"
                      value={row.hra}
                      onChange={(e) =>
                        handleRankRowDataChange(index, 'hra', e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                          e.preventDefault();
                        }
                      }}
                      onWheel={(e) => e.currentTarget.blur()}
                    />
                  </td>
                )}
                {/* {visibleColumns.includes('vda') && (
                  <td className="px-2 py-2 h-8 text-xs lg:text-sm xl:text-base border border-tableBorder">
                    <input
                      type="number"
                      className="py-1 px-2 w-full h-full border rounded-md focus:outline-none focus:ring-2 focus-within:ring-slate-400 focus:ring-offset-1"
                      value={row.vda}
                      onChange={(e) =>
                        handleRankRowDataChange(index, 'vda', e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                          e.preventDefault();
                        }
                      }}
                      onWheel={(e) => e.currentTarget.blur()}
                    />
                  </td>
                )} */}
                {visibleColumns.includes('kitWashingAllowance') && (
                  <td className="post-required-rank-table-td">
                    <input
                      type="number"
                      className="px-2 w-full h-7 2xl:h-8 rounded-md shadow-sm border text-responsive-table bg-transparent"
                      value={row.kitWashingAllowance}
                      onChange={(e) => {
                        handleRankRowDataChange(
                          index,
                          'kitWashingAllowance',
                          e.target.value
                        );
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                          e.preventDefault();
                        }
                      }}
                      onWheel={(e) => e.currentTarget.blur()}
                    />
                  </td>
                )}
                {visibleColumns.includes('cityAllowance') && (
                  <td className="post-required-rank-table-td">
                    <input
                      type="number"
                      className="px-2 w-full h-7 2xl:h-8 rounded-md shadow-sm border text-responsive-table bg-transparent"
                      value={row.cityAllowance}
                      onChange={(e) => {
                        handleRankRowDataChange(
                          index,
                          'cityAllowance',
                          e.target.value
                        );
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                          e.preventDefault();
                        }
                      }}
                      onWheel={(e) => e.currentTarget.blur()}
                    />
                  </td>
                )}
                {visibleColumns.includes('conveyance') && (
                  <td className="post-required-rank-table-td">
                    <input
                      type="number"
                      className="px-2 w-full h-7 2xl:h-8 rounded-md shadow-sm border text-responsive-table bg-transparent"
                      value={row.conveyance}
                      onChange={(e) => {
                        handleRankRowDataChange(
                          index,
                          'conveyance',
                          e.target.value
                        );
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                          e.preventDefault();
                        }
                      }}
                      onWheel={(e) => e.currentTarget.blur()}
                    />
                  </td>
                )}
                {visibleColumns.includes('uniformAllowance') && (
                  <td className="post-required-rank-table-td">
                    <input
                      type="number"
                      className="px-2 w-full h-7 2xl:h-8 rounded-md shadow-sm border text-responsive-table bg-transparent"
                      value={row.uniformAllowance}
                      onChange={(e) => {
                        handleRankRowDataChange(
                          index,
                          'uniformAllowance',
                          e.target.value
                        );
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                          e.preventDefault();
                        }
                      }}
                      onWheel={(e) => e.currentTarget.blur()}
                    />
                  </td>
                )}
                {/* {visibleColumns.includes('otherAllowance') && (
                  <td className="px-2 py-2 h-8 text-xs lg:text-sm xl:text-base border border-tableBorder">
                    <input
                      type="number"
                      className="py-1 px-2 w-full h-full border rounded-md focus:outline-none focus:ring-2 focus-within:ring-slate-400 focus:ring-offset-1"
                      value={row.otherAllowance}
                      onChange={(e) => {
                        handleRankRowDataChange(
                          index,
                          'otherAllowance',
                          e.target.value
                        );
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                          e.preventDefault();
                        }
                      }}
                      onWheel={(e) => e.currentTarget.blur()}
                    />
                  </td>
                )} */}
                {/* special allowance */}
                {visibleColumns.includes('specialAllowance') && (
                  <td className="post-required-rank-table-td">
                    <input
                      type="number"
                      className="px-2 w-full h-7 2xl:h-8 rounded-md shadow-sm border text-responsive-table bg-transparent"
                      value={row.specialAllowance}
                      onChange={(e) =>
                        handleRankRowDataChange(
                          index,
                          'specialAllowance',
                          e.target.value
                        )
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                          e.preventDefault();
                        }
                      }}
                      onWheel={(e) => e.currentTarget.blur()}
                    />
                  </td>
                )}
                {/* weeklyOff */}
                {visibleColumns.includes('weeklyOff') && (
                  <td className="post-required-rank-table-td">
                    <input
                      type="number"
                      className="px-2 w-full h-7 2xl:h-8 rounded-md shadow-sm border text-responsive-table bg-transparent"
                      value={row.weeklyOff}
                      onChange={(e) =>
                        handleRankRowDataChange(
                          index,
                          'weeklyOff',
                          e.target.value
                        )
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                          e.preventDefault();
                        }
                      }}
                      onWheel={(e) => e.currentTarget.blur()}
                    />
                  </td>
                )}
                {/* {visibleColumns.includes('taxGroup') && (
                  <td>
                    <CustomTaxSlabDropdown
                      placeholder="Select"
                      slabs={allTaxGroupsData}
                      onSelectSlab={(taxId) =>
                        handleRankRowDataChange(index, 'taxDeductionId', taxId)
                      }
                      // reset={resetTaxDropdown} // Pass the reset state
                    />
                  </td>
                )} */}
                <td className="post-required-rank-table-td">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      event.preventDefault();
                      handleRemoveRow(index);
                    }}
                    className="flex gap-2 items-center justify-center w-full py-2 primaryLabels text-secondaryText"
                  >
                    <img
                      src={Delete_Icon}
                      alt="Delete_Icon"
                      className="table-action-icon"
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Add More Button */}
      <div className="flex justify-start">
        <button
          type="button"
          onClick={handleAddRow}
          className={`flex items-center justify-center gap-2 font-Mona_Sans  text-xs 2xl:text-sm font-semibold ${isAddMoreRowsAllowed() ? 'text-[#2C3183]' : 'text-gray-400'} ${isAddMoreRowsAllowed() ? 'hover:text-[#2C3183]' : 'hover:text-gray-400'} hover:duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-4 py-2`}
          disabled={!isAddMoreRowsAllowed()}
        >
          <div>
            <img src={Plus_Black} alt="" className="2xl:w-5 2xl:h-5" />
          </div>
          Add more..
        </button>
      </div>

      {showDeleteModal && (
        <ConfirmationModal
          confirmButtonTitle="Delete"
          cancelButtonTitle="Cancel"
          onConfirm={() => {
            handleDeleteOldPostRanks(currentPostRankId);
          }}
          onCancel={() => setShowDeleteModal(false)}
          message={`Are you sure you want to delete the rank ${currentPostRankName} linked with post?`}
        />
      )}
    </div>
  );
};

export default EditRequiredRanks;
