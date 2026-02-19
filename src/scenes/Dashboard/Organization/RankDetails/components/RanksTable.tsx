/* Libraries */
import React, { useRef, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

/* Configs */
import { api } from '../../../../../configs/api';

/* Hooks */
import useVerifyUserAuth from '../../../../../hooks/useVerifyUserAuth';
import useClickOutside from '../../../../../hooks/useClickOutside';
import useHorizontalScroll from '../../../../../hooks/useHorizontalScroll';
import useScrollToTop from '../../../../../hooks/useScrollToTop';
import useHandleYupError from '../../../../../hooks/useHandleYupError';
import useHandleAxiosError from '../../../../../hooks/useHandleAxiosError';

/* Types */
import { Rank } from '../../../../../types/rank';

/* Components */
import ConfirmationModal from '../../../../../common/Modal/ConfirmationModal';
import Loader from '../../../../../common/Loader/Loader';

/* Assets */
import {
  Delete_Icon,
  EditPencil_Icon,
  TableOptionsIcon,
} from '../../../../../assets/icons';

// Css
import '../../.././../../App.css';

/* Prop Types */
type RanksTableProps = {
  ranksData: Rank[];
  refreshRanksData: () => void;
};

/* Rank Table Main Component */
const RanksTable: React.FC<RanksTableProps> = ({
  ranksData,
  refreshRanksData,
}) => {
  /* Scroll To Top */
  useScrollToTop();

  /* Verify User Auth */
  const accessToken = useVerifyUserAuth();

  /* Navigation */
  const navigate = useNavigate();

  /* Table Horizontal Scroll */
  const tableRef = useHorizontalScroll();

  /* Loader */
  const [isLoading, setIsLoading] = useState(false);

  /* Error Handling */
  const { setErrors } = useHandleYupError();
  const { handleAxiosError } = useHandleAxiosError(setErrors);

  /* Table Action Modal Controls */
  const [actionModalIndex, setActionModalIndex] = useState<number | null>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);
  useClickOutside(actionMenuRef, () => setActionModalIndex(null));

  /* Edit and Delete Controls */
  const [currentRankId, setCurrentRankId] = useState<number>(0);
  const [currentRankName, setCurrentRankName] = useState<string>('');
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const handleDelete = async (id: number) => {
    setIsLoading(true);
    try {
      const response = await axios.delete(`${api.baseUrl}/ranks/${id}`, {
        headers: { 'x-access-token': accessToken },
      });
      if (response.data && response.data.success) {
        setShowDeleteModal(false);
        toast.success(response.data.message);
        refreshRanksData();
      }
    } catch (error) {
      handleAxiosError(error as AxiosError);
    } finally {
      setShowDeleteModal(false);
      setIsLoading(false);
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/app/organisation/rank-details/edit-rank?id=${id}`);
  };

  /* JSX */
  return (
    <>
      {isLoading && <Loader />}
      <div
        ref={tableRef}
        className="relative overflow-x-auto overflow-y-auto whitespace-nowrap flex text-center border scrollbar border-opacity-40  scrollbar-thumb-scrollBarColor scrollbar-track-scrollBarBg"
      >
        <table
          id="ranksTable"
          className="bg-white border border-tableBorder min-w-[105%]"
        >
          <thead className="text-center text-primaryText border border-tableBorder sticky top-0 bg-tableHeadingColour z-10">
            <tr>
              <th
                className="px-1 py-2 border border-tableBorder w-[2%] text-xs md:text-sm xl:text-base"
                rowSpan={2}
              >
                Rank
              </th>
              <th
                className="px-2 py-2 border border-tableBorder w-[2%] text-xs md:text-sm xl:text-base"
                rowSpan={2}
              >
                Basic Salary
              </th>
              <th
                className="px-2 py-2 border border-tableBorder w-[10%] text-xs md:text-sm xl:text-base"
                colSpan={7}
              >
                Allowance
              </th>
              <th
                className="px-2 py-2 border border-tableBorder w-[2%] text-xs md:text-sm xl:text-base"
                rowSpan={2}
              >
                Action
              </th>
            </tr>
            <tr className="border border-tableBorder">
              <th className="px-2 py-2 border border-tableBorder w-[2%] text-xs md:text-sm xl:text-base">
                House Rent
              </th>
              <th className="px-2 py-2 border border-tableBorder w-[2%] text-xs md:text-sm xl:text-base">
                Conveyance
              </th>
              <th className="px-2 py-2 border border-tableBorder w-[2%] text-xs md:text-sm xl:text-base">
                Kit/Washing Allowance
              </th>
              <th className="px-2 py-2 border border-tableBorder w-[2%] text-xs md:text-sm xl:text-base">
                Uniform
              </th>
              <th className="px-2 py-2 border border-tableBorder w-[2%] text-xs md:text-sm xl:text-base">
                City Allowance
              </th>
              <th className="px-2 py-2 border border-tableBorder w-[2%] text-xs md:text-sm xl:text-base">
                VDA
              </th>
              <th className="px-2 py-2 border border-tableBorder w-[2%] text-xs md:text-sm xl:text-base">
                Other Allowances
              </th>
            </tr>
          </thead>
          <tbody className="text-primaryText border border-tableBorder">
            {ranksData.map((rank: Rank, index: number) => (
              <tr
                key={rank.ID}
                className="hover:bg-gray-200 border border-tableBorder"
              >
                <td className="px-1 py-2 border border-tableBorder w-[2%] text-xs lg:text-sm xl:text-base">
                  <button onClick={() => handleEdit(rank.ID || 0)}>
                    {rank.designation || '---'}
                  </button>
                </td>
                <td className="px-2 py-2 border border-tableBorder w-[2%] text-xs lg:text-sm xl:text-base">
                  Rs. {Number(rank.basicSalary).toFixed(2)}
                </td>
                <td className="px-2 py-2 border border-tableBorder w-[2%] text-xs lg:text-sm xl:text-base">
                  {Number(rank.hra) !== 0
                    ? 'Rs. ' + Number(rank.hra).toFixed(2)
                    : '-'}
                </td>
                <td className="px-2 py-2 border border-tableBorder w-[2%] text-xs lg:text-sm xl:text-base">
                  {Number(rank.conveyance) !== 0
                    ? 'Rs. ' + Number(rank.conveyance).toFixed(2)
                    : '-'}
                </td>
                <td className="px-2 py-2 border border-tableBorder w-[2%] text-xs lg:text-sm xl:text-base">
                  {Number(rank.kitWashingAllowance) !== 0
                    ? 'Rs. ' + Number(rank.kitWashingAllowance).toFixed(2)
                    : '-'}
                </td>
                <td className="px-2 py-2 border border-tableBorder w-[2%] text-xs lg:text-sm xl:text-base">
                  {Number(rank.uniformAllowance) !== 0
                    ? 'Rs. ' + Number(rank.uniformAllowance).toFixed(2)
                    : '-'}
                </td>
                <td className="px-2 py-2 border border-tableBorder w-[2%] text-xs lg:text-sm xl:text-base">
                  {Number(rank.cityAllowance) !== 0
                    ? 'Rs. ' + Number(rank.cityAllowance).toFixed(2)
                    : '-'}
                </td>
                <td className="px-2 py-2 border border-tableBorder w-[2%] text-xs lg:text-sm xl:text-base">
                  {Number(rank.vda) !== 0
                    ? 'Rs. ' + Number(rank.vda).toFixed(2)
                    : '-'}
                </td>
                <td className="px-2 py-2 border border-tableBorder w-[2%] text-xs lg:text-sm xl:text-base">
                  {Number(rank.otherAllowance) !== 0
                    ? 'Rs. ' + Number(rank.otherAllowance)?.toFixed(2)
                    : '-'}
                </td>
                <td className="px-2 py-2 border border-tableBorder relative w-[2%]">
                  <button
                    onClick={() => {
                      setActionModalIndex(
                        actionModalIndex === index ? null : index
                      );
                      setCurrentRankId(rank.ID ? rank.ID : 0);
                      setCurrentRankName(rank.designation);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <img
                      src={TableOptionsIcon}
                      className="w-4 h-4"
                      alt="TableOptionsIcon"
                    />
                  </button>
                  {actionModalIndex === index && (
                    <div
                      ref={actionMenuRef}
                      className={`absolute right-[60%] ${actionModalIndex <= 1 ? '' : 'bottom-[10%] lg:bottom-[20%]'} mb-2 w-20 md:w-24 lg:w-28 bg-white border border-gray-300 shadow-lg z-10`}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(currentRankId);
                        }}
                        className="flex gap-2 items-center w-full px-2 lg:px-4 py-2 text-xs md:text-sm lg:text-base primaryLabels text-secondaryText hover:bg-smallMenuHover"
                      >
                        <img
                          src={EditPencil_Icon}
                          alt="EditPencil_Icon"
                          className="w-4 h-4"
                        />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          setShowDeleteModal(true);
                        }}
                        className="flex gap-2 items-center w-full px-2 lg:px-4 py-2 text-xs md:text-sm lg:text-base primaryLabels text-secondaryText hover:bg-smallMenuHover"
                      >
                        <img
                          src={Delete_Icon}
                          alt="Delete_Icon"
                          className="w-4 h-4"
                        />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {showDeleteModal && (
          <ConfirmationModal
            confirmButtonTitle="Delete"
            cancelButtonTitle="Cancel"
            onConfirm={() => {
              handleDelete(currentRankId);
            }}
            onCancel={() => setShowDeleteModal(false)}
            message={`Are you sure you want to delete the rank ${currentRankName}?`}
          />
        )}
      </div>
    </>
  );
};

export default RanksTable;
