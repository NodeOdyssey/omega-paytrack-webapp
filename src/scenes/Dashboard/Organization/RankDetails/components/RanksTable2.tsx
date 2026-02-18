/* Libraries */
import React, { useEffect, useRef, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

/* Configs */
import { api } from '../../../../../configs/api';

/* Hooks */
import useVerifyUserAuth from '../../../../../hooks/useVerifyUserAuth';
import useClickOutside from '../../../../../hooks/useClickOutside';
// import useHorizontalScroll from '../../../../../hooks/useHorizontalScroll';
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
const RanksTable2: React.FC<RanksTableProps> = ({
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
  // const tableRef = useHorizontalScroll();

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
    navigate(`/paytrack/organisation/rank-details/edit-rank?id=${id}`);
  };

  // menu position
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const handleActionClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    rank: Rank,
    index: number
  ) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();

    // Wait for the menu to render so ref is not null
    setTimeout(() => {
      if (actionMenuRef.current) {
        const menuWidth = actionMenuRef.current.offsetWidth;

        setMenuPosition({
          top: rect.bottom + window.scrollY,
          left: rect.right + window.scrollX - menuWidth, // aligns right edge
        });
      }
    }, 0);

    setActionModalIndex(index);
    setCurrentRankId(rank.ID ?? 0);
    setCurrentRankName(rank.designation);
  };

  useEffect(() => {
    const handleScroll = () => {
      setActionModalIndex(null);
    };

    window.addEventListener('scroll', handleScroll, true); // useCapture = true to catch inner scrolls

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, []);

  /* JSX */
  return (
    <>
      {isLoading && <Loader />}
      <div
        // ref={tableRef}
        className="table-container"
      >
        <table
          id="ranksTable"
          className="bg-white border border-tableBorder w-full h-full table-fixed border-collapse"
        >
          <thead className="text-center text-primaryText border border-tableBorder sticky top-0 z-20 bg-tableHeadingColour">
            <tr>
              <th className="table-header w-[4.3%] text-left" rowSpan={2}>
                Rank
              </th>
              <th className="table-header w-[2.2%]" rowSpan={2}>
                Basic Salary
              </th>
              <th className="table-header w-[14%] h-8" colSpan={7}>
                Allowance
              </th>
              <th className="table-header w-[1.4%]" rowSpan={2}>
                Action
              </th>
            </tr>
            <tr className="border border-tableBorder">
              <th className="table-header">House Rent</th>
              <th className="table-header">Conveyance</th>
              <th className="table-header">Kit/Washing Allowance</th>
              <th className="table-header">Uniform</th>
              <th className="table-header">City Allowance</th>
              {/* <th className="table-header">
                VDA
              </th>
              <th className="table-header">
                Other Allowances
              </th> */}
              <th className="table-header">Special Allowance</th>
              <th className="table-header">Weekly Off</th>
            </tr>
          </thead>
          <tbody className="text-primaryText border border-tableBorder">
            {ranksData.map((rank: Rank, index: number) => (
              <tr key={rank.ID} className="table-body-row">
                {/* Rank */}
                <td className="table-td-existing-data text-left">
                  <button onClick={() => handleEdit(rank.ID || 0)}>
                    <p className="text-left text-bgPrimaryButton hover:text-bgPrimaryButtonHover underline">
                      {rank.designation ? (
                        rank.designation
                      ) : (
                        <p className="text-center">-</p>
                      )}
                    </p>
                  </button>
                </td>
                {/* Basic Salary */}
                <td className="table-td-existing-data text-right">
                  Rs. {Number(rank.basicSalary).toFixed(2)}
                </td>
                {/* HRA */}
                <td className="table-td-existing-data text-right">
                  {Number(rank.hra) !== 0 ? (
                    'Rs. ' + Number(rank.hra).toFixed(2)
                  ) : (
                    <p className="text-center">-</p>
                  )}
                </td>
                {/* Conveyance */}
                <td className="table-td-existing-data text-right">
                  {Number(rank.conveyance) !== 0 ? (
                    'Rs. ' + Number(rank.conveyance).toFixed(2)
                  ) : (
                    <p className="text-center">-</p>
                  )}
                </td>
                {/* Kit Washing Allowance */}
                <td className="table-td-existing-data text-right">
                  {Number(rank.kitWashingAllowance) !== 0 ? (
                    'Rs. ' + Number(rank.kitWashingAllowance).toFixed(2)
                  ) : (
                    <p className="text-center">-</p>
                  )}
                </td>
                {/* Uniform */}
                <td className="table-td-existing-data text-right">
                  {Number(rank.uniformAllowance) !== 0 ? (
                    'Rs. ' + Number(rank.uniformAllowance).toFixed(2)
                  ) : (
                    <p className="text-center">-</p>
                  )}
                </td>
                {/* City Allowance */}
                <td className="table-td-existing-data text-right">
                  {Number(rank.cityAllowance) !== 0 ? (
                    'Rs. ' + Number(rank.cityAllowance).toFixed(2)
                  ) : (
                    <p className="text-center">-</p>
                  )}
                </td>
                {/* vda */}
                {/* <td className="py-2 border border-tableBorder w-[2%] text-responsive-table font-medium ">
                  {Number(rank.vda) !== 0
                    ? 'Rs. ' + Number(rank.vda).toFixed(2)
                    : '-'}
                </td> */}
                {/* other allowance */}
                {/* <td className="py-2 border border-tableBorder w-[2%] text-responsive-table font-medium ">
                  {Number(rank.otherAllowance) !== 0
                    ? 'Rs. ' + Number(rank.otherAllowance)?.toFixed(2)
                    : '-'}
                </td> */}
                {/* special allowance */}
                <td className="table-td-existing-data text-right">
                  {Number(rank.specialAllowance) !== 0 ? (
                    'Rs. ' + Number(rank.specialAllowance).toFixed(2)
                  ) : (
                    <p className="text-center">-</p>
                  )}
                </td>
                {/* weekly off */}
                <td className="table-td-existing-data text-right">
                  {Number(rank.weeklyOff) !== 0 ? (
                    'Rs. ' + Number(rank.weeklyOff)?.toFixed(2)
                  ) : (
                    <p className="text-center">-</p>
                  )}
                </td>
                {/* action */}
                <td className="table-td-existing-data">
                  <button
                    onClick={(e) => handleActionClick(e, rank, index)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <img
                      src={TableOptionsIcon}
                      className="w-4 h-4"
                      alt="TableOptionsIcon"
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {actionModalIndex !== null && (
          <div
            ref={actionMenuRef}
            className="fixed z-50 bg-white border border-gray-300 shadow-lg"
            style={{
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`,
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(currentRankId);
              }}
              className="action-menu-button"
            >
              <img
                src={EditPencil_Icon}
                alt="EditPencil_Icon"
                className="w-4 h-4"
              />
              <p className="text-responsive-table">Edit</p>
            </button>
            <button
              onClick={(event) => {
                event.stopPropagation();
                setShowDeleteModal(true);
                setActionModalIndex(null);
              }}
              className="action-menu-button"
            >
              <img src={Delete_Icon} alt="Delete_Icon" className="w-4 h-4" />
              <p className="text-responsive-table">Delete</p>
            </button>
          </div>
        )}
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

export default RanksTable2;
