/* Libraries */
import React, { useEffect, useState } from 'react';
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
import { TaxesAndDeduction } from '../../../../../types/taxesAndDeduction';

/* Components */
import ColumnSelector from './common/ColumnSelector';
import Loader from '../../../../../common/Loader/Loader';
import ConfirmationModal from '../../../../../common/Modal/ConfirmationModal';
// import CustomTaxSlabDropdown from '../../../../../common/CustomTaxSlabDropDown/CustomTaxSlabDropDown';

/* Assets */
import { Delete_Icon, Plus_Black } from '../../../../../assets/icons';

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
  // added special allowance & weekly off
  specialAllowance: 0,
  weeklyOff: 0,
  taxDeductionId: 0,
  taxDeducName: '',
};

/* Dynamic Columns Data */
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
};

const RequiredRanks = ({
  existingPostRanks,
  refreshPostRanks,
  updateRequiredRanks,
  requiredRanks,
  // resetTaxDropdown,
}: RequiredRanksProps) => {
  useEffect(() => {});
  /* Verify User Auth */
  const accessToken = useVerifyUserAuth();

  /* Loader */
  const [isLoading, setIsLoading] = useState(false);

  /* Error Handling */
  const { errors, handleYupError, setErrors } = useHandleYupError();
  const { handleAxiosError } = useHandleAxiosError(setErrors);

  /* Manage visible columns */
  const [visibleColumns, setVisibleColumns] =
    useState<string[]>(initalColumnsToShow);
  const [areAllColsSelected, setAreAllColsSelected] = useState(false);

  const handleUpdateVisibleColumns = (column: string) => {
    if (column === 'all') {
      if (visibleColumns.length === allColumns.length) {
        // setVisibleColumns(['designation', 'basicSalary', 'taxGroup']);
        setVisibleColumns(['designation', 'basicSalary']);
        setAreAllColsSelected(false);
      } else {
        setVisibleColumns(allColumns);
        setAreAllColsSelected(true);
      }
    } else {
      setVisibleColumns((prevColumns) =>
        prevColumns.includes(column)
          ? prevColumns.filter((col) => col !== column)
          : [...prevColumns, column]
      );
    }
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
  const [allRanksData, setAllRanksData] = React.useState<Rank[]>([]);
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

  /* Schedule Tax Group Data Handling */
  const [allTaxGroupsData, setAllTaxGroupsData] = useState<TaxesAndDeduction[]>(
    []
  );

  const fetchTaxGroups = async () => {
    if (!accessToken) return;
    setIsLoading(true);
    try {
      const response = await axios.get(`${api.baseUrl}/taxes-and-deduction`, {
        headers: { 'x-access-token': accessToken },
      });
      if (response.data && response.data.success) {
        setAllTaxGroupsData(response.data.taxesAndDeductions);
        // console.log('tax group data: ', response.data.taxesAndDeductions);
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
    fetchTaxGroups();
  }, [accessToken]);

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

  const calculatePTax = (basicSalary: number) => {
    if (basicSalary < 10000) {
      return 0;
    } else if (basicSalary >= 10000 && basicSalary < 15000) {
      return 150;
    } else {
      return 180;
    }
  };

  const findTaxDeductionId = (basicSalary: number) => {
    const pTax = calculatePTax(basicSalary);

    for (const taxGroup of allTaxGroupsData) {
      for (const [key, value] of Object.entries(taxGroup)) {
        if (key === 'pTax' && Number(value) === Number(pTax)) {
          return taxGroup.ID as number;
        }
      }
    }
    return 0;
  };

  const findTaxDeducName = (basicSalary: number) => {
    const taxDeductionId = findTaxDeductionId(basicSalary);
    if (taxDeductionId) {
      const taxDeduction = allTaxGroupsData.find(
        (taxGroup) => taxGroup.ID === taxDeductionId
      );
      if (taxDeduction) {
        return taxDeduction.taxDeducName;
      }
    }
    return '';
  };
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
          taxDeductionId: findTaxDeductionId(selectedRank.basicSalary),
          taxDeducName: findTaxDeducName(selectedRank.basicSalary),
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

  /* Test use Effect */
  useEffect(() => {
    // console.log('existingPostRanksData: ', existingPostRanks);
    // console.log('requiredRanks: ', requiredRanks);
    // console.log('existingPostRanks:', existingPostRanks);
    // console.log('disabledSelects:', disabledSelects);
    // console.log('selectedRankIds:', selectedRankIds);
    // console.log('requiredRanks:', requiredRanks);
  });

  // JSX
  // Future provisions for updating existing row data
  // const handleExistingRowDataChange = (
  //   index: number,
  //   field: keyof Rank,
  //   value: number | string
  // ) => {
  //   const newRows = [...newSelectedPostRankLinksData];
  //   // const newDisabledSelects = [...disabledSelects];
  //   if (field === 'ID') {
  //     const rankId = Number(value);
  //     const selectedRank = allRanksData.find((rank) => rank.ID === rankId);
  //     if (selectedRank) {
  //       newRows[index] = { ...selectedRank };
  //       // newDisabledSelects[index] = true; // Disable the dropdown
  //     }
  //   } else if (field === 'designation') {
  //     newRows[index] = { ...newRows[index], [field]: value as string };
  //   } else {
  //     newRows[index] = {
  //       ...newRows[index],
  //       [field]: parseInt(value as string),
  //     };
  // };
  // JSX here
  return (
    <div className="flex flex-col gap-4 px-4 pb-8 border-b">
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
                <th className="py-3 px-4 border border-tableBorder text-xs lg:text-sm xl:text-base">
                  Rank
                </th>
              )}
              {visibleColumns.includes('basicSalary') && (
                <th className="py-3 px-4 border border-tableBorder text-xs lg:text-sm xl:text-base">
                  Basic Pay
                </th>
              )}
              {visibleColumns.includes('hra') && (
                <th className="py-3 px-4 border border-tableBorder text-xs lg:text-sm xl:text-base">
                  HRA
                </th>
              )}
              {/* {visibleColumns.includes('vda') && (
                <th className="py-3 px-4 border border-tableBorder text-xs lg:text-sm xl:text-base">
                  VDA
                </th>
              )} */}
              {visibleColumns.includes('kitWashingAllowance') && (
                <th className="py-3 px-4 border border-tableBorder text-xs lg:text-sm xl:text-base">
                  Kit/Washing Allowance
                </th>
              )}
              {visibleColumns.includes('cityAllowance') && (
                <th className="py-3 px-4 border border-tableBorder text-xs lg:text-sm xl:text-base">
                  City Allowance
                </th>
              )}
              {visibleColumns.includes('conveyance') && (
                <th className="py-3 px-4 border border-tableBorder text-xs lg:text-sm xl:text-base">
                  Conveyance
                </th>
              )}
              {visibleColumns.includes('uniformAllowance') && (
                <th className="py-3 px-4 border border-tableBorder text-xs lg:text-sm xl:text-base">
                  Uniform Allowance
                </th>
              )}
              {/* {visibleColumns.includes('otherAllowance') && (
                <th className="py-3 px-4 border border-tableBorder text-xs lg:text-sm xl:text-base">
                  Others
                </th>
              )} */}

              {/* special allowance */}
              {visibleColumns.includes('specialAllowance') && (
                <th className="py-3 px-4 border border-tableBorder text-xs lg:text-sm xl:text-base">
                  Special Allowance
                </th>
              )}
              {/* weekly off */}
              {visibleColumns.includes('weeklyOff') && (
                <th className="py-3 px-4 border border-tableBorder text-xs lg:text-sm xl:text-base">
                  Weekly Off
                </th>
              )}
              {/* {visibleColumns.includes('taxGroup') && (
                <th className="py-3 px-4 border border-tableBorder text-xs lg:text-sm xl:text-base">
                  Tax Group
                </th>
              )} */}
              <th className="py-3 px-4 border border-tableBorder text-xs lg:text-sm xl:text-base">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="text-primaryText border border-tableBorder">
            {existingPostRanks.length > 0 &&
              existingPostRanks.map((row, index) => (
                <tr
                  key={index}
                  className="border border-tableBorder text-xs lg:text-sm xl:text-base"
                >
                  {visibleColumns.includes('designation') && (
                    <td className="py-3 px-2 border border-tableBorder">
                      <p>{row.designation}</p>
                    </td>
                  )}
                  {visibleColumns.includes('basicSalary') && (
                    <td className="py-3 px-4 border border-tableBorder">
                      <p>
                        {row.basicSalary !== undefined && row.basicSalary > 0
                          ? `Rs. ${row.basicSalary}`
                          : '-'}
                      </p>
                    </td>
                  )}
                  {visibleColumns.includes('hra') && (
                    <td className="py-3 px-4 border border-tableBorder">
                      <p>
                        {row.hra !== undefined && row.hra > 0
                          ? `Rs. ${row.hra}`
                          : '-'}
                      </p>
                    </td>
                  )}
                  {/* {visibleColumns.includes('vda') && (
                    <td className="py-3 px-4 border border-tableBorder">
                      <p>
                        {row.vda !== undefined && row.vda > 0
                          ? `Rs. ${row.vda}`
                          : '-'}
                      </p>
                    </td>
                  )} */}
                  {visibleColumns.includes('kitWashingAllowance') && (
                    <td className="py-3 px-4 border border-tableBorder">
                      <p>
                        {row.kitWashingAllowance !== undefined &&
                        row.kitWashingAllowance > 0
                          ? `Rs. ${row.kitWashingAllowance}`
                          : '-'}
                      </p>
                    </td>
                  )}
                  {visibleColumns.includes('cityAllowance') && (
                    <td className="py-3 px-4 border border-tableBorder">
                      <p>
                        {row.cityAllowance !== undefined &&
                        row.cityAllowance > 0
                          ? `Rs. ${row.cityAllowance}`
                          : '-'}
                      </p>
                    </td>
                  )}
                  {visibleColumns.includes('conveyance') && (
                    <td className="py-3 px-4 border border-tableBorder">
                      <p>
                        {row.conveyance !== undefined && row.conveyance > 0
                          ? `Rs. ${row.conveyance}`
                          : '-'}
                      </p>
                    </td>
                  )}
                  {visibleColumns.includes('uniformAllowance') && (
                    <td className="py-3 px-4 border border-tableBorder">
                      <p>
                        {row.uniformAllowance !== undefined &&
                        row.uniformAllowance > 0
                          ? `Rs. ${row.uniformAllowance}`
                          : '-'}
                      </p>
                    </td>
                  )}
                  {/* {visibleColumns.includes('otherAllowance') && (
                    <td className="py-3 px-4 border border-tableBorder">
                      <p>
                        {row.otherAllowance !== undefined &&
                        row.otherAllowance > 0
                          ? `Rs. ${row.otherAllowance}`
                          : '-'}
                      </p>
                    </td>
                  )} */}
                  {/* special allowance */}
                  {visibleColumns.includes('specialAllowance') && (
                    <td className="py-3 px-4 border border-tableBorder">
                      <p>
                        {row.specialAllowance !== undefined &&
                        row.specialAllowance > 0
                          ? `Rs. ${row.specialAllowance}`
                          : '-'}
                      </p>
                    </td>
                  )}
                  {/* weekly off */}
                  {visibleColumns.includes('weeklyOff') && (
                    <td className="py-3 px-4 border border-tableBorder">
                      <p>
                        {row.weeklyOff !== undefined && row.weeklyOff > 0
                          ? `Rs. ${row.weeklyOff}`
                          : '-'}
                      </p>
                    </td>
                  )}
                  {/* tax group */}
                  {/* {visibleColumns.includes('taxGroup') && (
                    <td className="py-3 px-4 border border-tableBorder">
                      <p>{row.taxDeducName}</p>
                    </td>
                  )} */}
                  <td className="py-3 px-4 border border-tableBorder relative">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setCurrentPostRankId(row.ID as number);
                        setSelectedPostRankName(row.designation);
                        setShowDeleteModal(true);
                      }}
                      className="flex gap-2 items-center justify-center w-full py-2 primaryLabels text-secondaryText "
                    >
                      <img
                        src={Delete_Icon}
                        alt="Delete_Icon"
                        className="w-4 h-4"
                      />
                    </button>
                  </td>
                </tr>
              ))}
            {requiredRanks.map((row, index) => (
              <tr key={index} className="border border-tableBorder h-10">
                {visibleColumns.includes('designation') && (
                  <td className="py-2 px-2 text-xs lg:text-sm xl:text-base border border-tableBorder w-52">
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
                      className="w-full bg-white border rounded-lg py-3 px-2 max-h-60 cursor-pointer"
                    >
                      <option value="">Select</option>
                      {allRanksData.map((rank) => (
                        <option
                          key={rank.ID}
                          value={rank.ID}
                          disabled={selectedRankIds.includes(rank.ID as number)}
                        >
                          {rank.designation}
                        </option>
                      ))}
                    </select>
                  </td>
                )}
                {visibleColumns.includes('basicSalary') && (
                  <td className="px-2 py-2 h-8 text-xs lg:text-sm xl:text-base border border-tableBorder">
                    <input
                      type="number"
                      className="py-1 px-2 w-full h-full border rounded-md focus:outline-none focus:ring-2 focus-within:ring-slate-400 focus:ring-offset-1"
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
                  <td className="px-2 py-2 h-8 text-xs lg:text-sm xl:text-base border border-tableBorder">
                    <input
                      type="number"
                      className="py-1 px-2 w-full h-full border rounded-md focus:outline-none focus:ring-2 focus-within:ring-slate-400 focus:ring-offset-1"
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
                  <td className="px-2 py-2 h-8 text-xs lg:text-sm xl:text-base border border-tableBorder">
                    <input
                      type="number"
                      className="py-1 px-2 w-full h-full border rounded-md focus:outline-none focus:ring-2 focus-within:ring-slate-400 focus:ring-offset-1"
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
                  <td className="px-2 py-2 h-8 text-xs lg:text-sm xl:text-base border border-tableBorder">
                    <input
                      type="number"
                      className="py-1 px-2 w-full h-full border rounded-md focus:outline-none focus:ring-2 focus-within:ring-slate-400 focus:ring-offset-1"
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
                  <td className="px-2 py-2 h-8 text-xs lg:text-sm xl:text-base border border-tableBorder">
                    <input
                      type="number"
                      className="py-1 px-2 w-full h-full border rounded-md focus:outline-none focus:ring-2 focus-within:ring-slate-400 focus:ring-offset-1"
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
                  <td className="px-2 py-2 h-8 text-xs lg:text-sm xl:text-base border border-tableBorder">
                    <input
                      type="number"
                      className="py-1 px-2 w-full h-full border rounded-md focus:outline-none focus:ring-2 focus-within:ring-slate-400 focus:ring-offset-1"
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
                  <td className="px-2 py-2 h-8 text-xs lg:text-sm xl:text-base border border-tableBorder">
                    <input
                      type="number"
                      className="py-1 px-2 w-full h-full border rounded-md focus:outline-none focus:ring-2 focus-within:ring-slate-400 focus:ring-offset-1"
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
                {/* weekly off */}
                {visibleColumns.includes('weeklyOff') && (
                  <td className="px-2 py-2 h-8 text-xs lg:text-sm xl:text-base border border-tableBorder">
                    <input
                      type="number"
                      className="py-1 px-2 w-full h-full border rounded-md focus:outline-none focus:ring-2 focus-within:ring-slate-400 focus:ring-offset-1"
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
                {/* tax group */}
                {/* {visibleColumns.includes('taxGroup') && (
                  <td>
                    <h1>Select a Tax Slab</h1>
                    <CustomTaxSlabDropdown
                      placeholder="Select"
                      slabs={allTaxGroupsData}
                      onSelectSlab={(taxId) =>
                        handleRankRowDataChange(index, 'taxDeductionId', taxId)
                      }
                      reset={resetTaxDropdown} // Pass the reset state
                    />
                  </td>
                )} */}
                <td className="py-3 px-4 text-xs lg:text-sm xl:text-base  border border-tableBorder relative">
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
                      className="w-4 h-4"
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
          className={`flex items-center justify-center gap-2 font-Mona_Sans text-xs lg:text-sm xl:text-base font-semibold ${isAddMoreRowsAllowed() ? 'text-[#2C3183]' : 'text-gray-400'} ${isAddMoreRowsAllowed() ? 'hover:text-[#2C3183]' : 'hover:text-gray-400'} hover:duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-4 py-2`}
          disabled={!isAddMoreRowsAllowed()}
        >
          <div>
            <img src={Plus_Black} alt="" className="w-4 lg:w-5 h-4 lg:h-5" />
          </div>
          Add more..
        </button>
      </div>
      <p className="text-red-500">
        {Object.keys(errors).map((key, index) => (
          <span key={index}>
            {errors[key]}
            {index < Object.keys(errors).length - 1 ? ', ' : ''}
          </span>
        ))}
      </p>
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

export default RequiredRanks;
