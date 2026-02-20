// Libraries
import React, { useEffect, useState } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { Tooltip } from 'react-tooltip';
import { toast } from 'react-toastify';

// Assets
import {
  Admin_Panel_Setting_Icon,
  Attendance_And_Payroll_Icon,
  Attendance_And_Payroll_Icon_Blue,
  Logout_mode_off_on,
  Organisation_Icon,
  OrganisationIconBlue,
  Posts_Icon,
  PostsIconBlue,
  Reports_Icon,
  ReportsIconBlue,
  User_Avatar,
  Home_Icon,
} from '../../assets/icons';

// Menu Components
import Aside from './Aside/Aside';
import AttendanceAndPayroll from './AttendanceAndPayroll/AttendanceAndPayroll';
import Reports from './Reports/Reports';
import InvoiceReport from './Reports/components/InvoiceReport/InvoiceReport';
import RankDetails from './Organization/RankDetails/RankDetails';
import AddRankForm from './Organization/RankDetails/components/AddRankForm';
import EditRankForm from './Organization/RankDetails/components/EditRankForm';
import EmployeeDetails from './Organization/EmployeeDetails/EmployeeDetails';
import PostDetails from './Posts/PostDetails/PostDetails';
import AddPostForm from './Posts/PostDetails/components/AddPostForm';
import EditPostForm from './Posts/PostDetails/components/EditPostForm';
import AddEmployeeForm from './Organization/EmployeeDetails/components/AddEmployeeForm';
import EditEmployeeForm from './Organization/EmployeeDetails/components/EditEmployeeForm';
import ConfirmationModal from '../../common/Modal/ConfirmationModal';
import AdminSettingsModal from '../../common/Modal/AdminSettingsModal';
import Loader from '../../common/Loader/Loader';
import Home from './Home/Home';

// Error Pages
import Error404 from '../Error/Error404';
import Error500 from '../Error/Error500';

// Configs
import { api } from '../../configs/api';

// Store
import { useAppStore } from '../../store/app';

// Hooks
import useHandleAxiosError from '../../hooks/useHandleAxiosError';
import useVerifyUserAuth from '../../hooks/useVerifyUserAuth';
import useHandleYupError from '../../hooks/useHandleYupError';

// Main Component
const Dashboard = (): React.ReactElement => {
  const navigate = useNavigate();
  useVerifyUserAuth();

  const profilePhoto = localStorage.getItem('profilePhoto')?.toString();

  // const [showMenu, setShowMenu] = useState(
  //   localStorage.getItem('showMenu') === 'true'
  // );
  const { showMenu, toggleShowMenu } = useAppStore();

  // Logout modal management
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLogoutHovered, setIsLogoutHovered] = useState(false);
  console.log('isLogoutHovered', isLogoutHovered);

  const openLogoutModal = () => {
    setIsLogoutModalOpen(true);
  };

  const closeLogoutModal = () => {
    setIsLogoutModalOpen(false);
  };

  const handleLogout = async () => {
    console.log('accessToken', localStorage.getItem('accessToken'));
    try {
      const response = await axios.post(
        `${api.baseUrl}${api.logout}`,
        {},
        {
          headers: { 'x-access-token': localStorage.getItem('accessToken') },
        }
      );

      if (response.data && response.data.success) {
        // toast.success(response.data.message);
        toast.success('Logout Successful. Redirecting to Login...');
        localStorage.removeItem('accessToken');
        navigate('/app/auth/login');
      }
    } catch (error) {
      // handleError(error);
      console.error('API error:', error);
    }
  };

  const organisationSubMenuItems = [
    {
      label: 'Employee Details',
      onClick: () => navigate('/app/organisation/employee-details'),
    },
    {
      label: 'Rank Details',
      onClick: () => navigate('/app/organisation/rank-details'),
    },
  ];

  const menuItems = [
    {
      label: 'Home',
      icon: Home_Icon,
      hoverIcon: Home_Icon,
      tooltipId: 'home-tooltip',
      isActive: false,
      tooltipContent: 'Home',
      onClick: () => navigate('/app/home'),
      path: '/app/home',
    },
    {
      label: 'Organisation',
      icon: Organisation_Icon,
      hoverIcon: OrganisationIconBlue,
      tooltipId: 'organisation-tooltip',
      isActive: false,
      tooltipContent: 'Organisation',
      onClick: () => navigate('/app/organisation/rank-details'),
      path: '/organisation/rank-details',
      subMenuItems: organisationSubMenuItems,
    },
    {
      label: 'Posts',
      icon: Posts_Icon,
      hoverIcon: PostsIconBlue,
      isActive: false,
      tooltipId: 'posts-tooltip',
      tooltipContent: 'Posts',
      onClick: () => navigate('/app/posts/post-details'),
      path: '/app/posts',
      // subMenuItems: postsSubMenuItems,
    },
    {
      label: 'Attendance & Payroll',
      icon: Attendance_And_Payroll_Icon,
      hoverIcon: Attendance_And_Payroll_Icon_Blue,
      isActive: false,
      tooltipId: 'attendance-tooltip',
      tooltipContent: 'Attendance & Payroll',
      onClick: () => navigate('/app/attendance-and-payroll'),
      path: '/app/attendance-and-payroll',
    },
    {
      label: 'Reports',
      icon: Reports_Icon,
      hoverIcon: ReportsIconBlue,
      isActive: false,
      tooltipId: 'reports-tooltip',
      tooltipContent: 'Reports',
      path: '/app/reports',
      onClick: () => navigate('/app/reports'),
    },
  ];

  /* Loader */
  const [isLoading, setIsLoading] = useState(false);
  const { setErrors } = useHandleYupError();
  const { handleAxiosError } = useHandleAxiosError(setErrors);

  const [isDevAdmin, setIsDevAdmin] = React.useState(false);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    console.log('User Role: ', userRole);
    if (userRole === 'DevAdmin') {
      setIsDevAdmin(true);
    } else {
      setIsDevAdmin(false);
    }
  }, []);

  // Admin panel settings
  const [adminPanelSettingsModal, setAdminPanelSettingsModal] = useState(false);
  const openAdminPanelSettingsModal = () => {
    setAdminPanelSettingsModal(true);
  };

  const closeAdminPanelSettingsModal = () => {
    setAdminPanelSettingsModal(false);
  };

  const handleRedeployClient = async () => {
    console.log('handleRedeployClient');
    setIsLoading(true);
    // if (!) return;
    try {
      const response = await axios.post(
        `http://localhost:8082/ec2-control/redeploy/paytrack/client`,
        {
          // headers: {
          //   'x-access-token': accessToken,
          // },
        }
      );
      if (response.data && response.data.success) {
        toast.success(response.data.message);
      } else {
        console.error('Error:', response.data.message);
      }
    } catch (error) {
      handleAxiosError(error as AxiosError);
    } finally {
      setIsLoading(false);
    }
    setAdminPanelSettingsModal(false);
  };

  const handleRedeployServer = () => {
    console.log('handleRedeployServer');
    setAdminPanelSettingsModal(false);
  };

  // useEffect(() => {
  //   initializeShowMenu();
  // }, [initializeShowMenu]);

  return (
    <div className="flex font-Mona_Sans h-screen">
      {isLoading && <Loader />}
      <Aside
        logo={
          showMenu
            ? 'https://pscpl-paytrack.s3.ap-south-1.amazonaws.com/assets/logo_small.svg'
            : 'https://pscpl-paytrack.s3.ap-south-1.amazonaws.com/assets/logo_big.svg'
        }
        menuItems={menuItems}
        onToggleMenu={toggleShowMenu}
        showMenu={showMenu}
      />
      <main
        className={`transition-all duration-300 flex-1 bg-[#fafafa] ${
          showMenu ? 'pl-16 2xl:pl-20' : 'pl-36 md:pl-44 lg:pl-52 xl:pl-56'
        } overflow-hidden`}
      >
        {/* Header */}
        <div
          className={`z-20 h-10 2xl:h-14 2xl fixed top-0 ${showMenu ? 'left-16 2xl:left-20' : 'left-36 md:left-44 lg:left-52 xl:left-56'} right-0 px-4 2xl:px-8 py-4 flex items-center font-semibold justify-between shadow-md bg-white`}
        >
          <h2 className="text-left font-semibold text-sm 2xl:text-base">
            Purbanchal Security Consultants Pvt. Ltd.
          </h2>
          <div className="flex items-center gap-4">
            {/* admin settings */}
            {isDevAdmin && (
              <div className="items-center flex justify-center">
                <button onClick={openAdminPanelSettingsModal}>
                  <img
                    src={Admin_Panel_Setting_Icon}
                    alt="Admin_Panel_Setting_Icon"
                    className="w-5 h-5 md:w-6 md:h-6 cursor-pointer"
                  />
                </button>
                {adminPanelSettingsModal && (
                  <AdminSettingsModal
                    message="Admin Settings"
                    redeployClient={handleRedeployClient}
                    redeployServer={handleRedeployServer}
                    onClose={closeAdminPanelSettingsModal}
                    redeployServerButtonTitle="Re-Deploy Server"
                    redeployClientButtonTitle="Re-Deploy Client"
                  />
                )}
              </div>
            )}
            {/* Admin Panel Settings */}

            {/* profile */}
            <div className="rounded-full">
              <img
                src={profilePhoto ?? User_Avatar}
                alt="logo"
                className="w-8 h-8 2xl:w-10 2xl:h-10 rounded-full object-cover"
              />
            </div>
            {/* logout button */}
            <div
              onMouseEnter={() => setIsLogoutHovered(true)} // Set hover state to true
              onMouseLeave={() => setIsLogoutHovered(false)} // Set hover state to false
            >
              <button
                onClick={openLogoutModal}
                data-tooltip-id="logout-tooltip1"
                data-tooltip-content="Log Out"
                className="flex items-center space-x-2 hover:text-bgPrimaryButton"
              >
                <img
                  src={Logout_mode_off_on}
                  alt="logout"
                  className="w-5 h-5 2xl:w-6 2xl:h-6 cursor-pointer"
                />
              </button>
              <Tooltip id="logout-tooltip1" place="bottom" />
              {isLogoutModalOpen && (
                <ConfirmationModal
                  confirmButtonTitle="Yes"
                  cancelButtonTitle="No"
                  onConfirm={() => handleLogout()}
                  onCancel={() => closeLogoutModal()}
                  message={`Are you sure you want to logout?`}
                />
              )}
            </div>
          </div>
        </div>
        {/* Scrollable Content */}
        <div className="mt-10 2xl:mt-14 overflow-y-auto h-full w-full mx-auto">
          {/* <div className="mt-10 2xl:mt-14 overflow-y-auto h-full w-[calc(100%-6.25rem)] 2xl:w-[calc(100%-12.5rem)]"> */}
          <Routes>
            <Route path="home" element={<Home />} />
            <Route
              path="attendance-and-payroll"
              element={<AttendanceAndPayroll />}
            />
            <Route path="404" element={<Error404 />} />
            <Route path="reports" element={<Reports />} />
            <Route path="invoices/view" element={<InvoiceReport />} />
            <Route
              path="organisation/rank-details"
              element={
                <RankDetails
                  onAddRankClick={() =>
                    navigate('organisation/rank-details/add-rank')
                  }
                />
              }
            />
            <Route
              path="organisation/rank-details/add-rank"
              element={<AddRankForm />}
            />
            <Route
              path="organisation/rank-details/edit-rank"
              element={<EditRankForm />}
            />
            <Route
              path="organisation/employee-details"
              element={
                <EmployeeDetails
                  onAddEmployeeClick={() =>
                    navigate('organisation/employee-details/add-employee')
                  }
                />
              }
            />
            <Route
              path="organisation/employee-details/add-employee"
              element={<AddEmployeeForm showMenu={showMenu} />}
            />
            <Route
              path="organisation/employee-details/edit-employee"
              element={<EditEmployeeForm showMenu={showMenu} />}
            />
            <Route
              path="posts"
              element={
                <PostDetails
                  onAddPostClick={() => navigate('posts/add-post')}
                />
              }
            />
            <Route path="posts/add-post" element={<AddPostForm />} />
            <Route path="posts/edit-post" element={<EditPostForm />} />
            {/* Error routes */}
            <Route path="/app/500" element={<Error500 />} />
            <Route path="*" element={<Error404 />} /> {/* Catch-all for 404 */}
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
