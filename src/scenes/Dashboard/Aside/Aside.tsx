// libraries
import React, { useEffect } from 'react';
import { useState } from 'react';
import { Tooltip } from 'react-tooltip';
// import { Building2 } from 'lucide-react';
// assets
import {
  Chevron_Backward,
  Chevron_Forward,
  Keyboard_Arrow_Down,
  Keyboard_Arrow_Up,
  // LogOut_Icon,
  // LogoutBlue,
} from '../../../assets/icons';

// components
import SubMenu from '../components/SubMenu/SubMenu';
// import ConfirmationModal from '../../../common/Modal/ConfirmationModal';
import { useLocation, useNavigate } from 'react-router';

type SubMenuItemsType = {
  label: string;
  onClick: () => void;
};

type MenuItem = {
  label: string;
  subMenuItems?: SubMenuItemsType[];
  path: string;
};

type AsideMenuProps = {
  logo: string;
  menuItems: {
    path: string;
    label: string;
    hoverIcon: string;
    icon: string;
    tooltipId: string;
    tooltipContent: string;
    isActive: boolean;
    onClick: () => void;
    subMenuItems?: SubMenuItemsType[];
  }[];
  onToggleMenu: () => void;
  showMenu: boolean;
  // onLogout: () => void;
  // isLogoutModalOpen: boolean;
  // closeLogoutModal: () => void;
  // handleLogout: () => void;
  // isLogoutHovered: boolean;
  // setIsLogoutHovered: (value: boolean) => void;
};

const Aside: React.FC<AsideMenuProps> = ({
  logo,
  menuItems,
  onToggleMenu,
  showMenu,
  // onLogout,
  // isLogoutModalOpen,
  // closeLogoutModal,
  // handleLogout,
  // isLogoutHovered,
  // setIsLogoutHovered,
}) => {
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const [activeMenuItem, setActiveMenuItem] = useState<string>('');
  // logout
  // const [isLogoutHovered, setIsLogoutHovered] = useState(false);
  // const [currentActivePath, setCurrentActivePath] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation(); // Detect current path

  useEffect(() => {
    const currentPath = location.pathname;
    const activeItem = menuItems.find((item) =>
      currentPath.startsWith(item.path)
    );
    if (activeItem) setActiveMenuItem(activeItem.path); // Use path for consistency
  }, [location.pathname, menuItems]);

  // const handleMenuClick = (label: string) => {
  //   setActiveMenuItem(label);
  //   setExpandedMenu(expandedMenu === label ? null : label);
  // };
  // const handleMenuClick = (item: any) => {
  //   setActiveMenuItem(item.label); // Set active item
  //   setExpandedMenu(expandedMenu === item.label ? null : item.label); // Toggle submenu
  //   navigate(item.path); // Navigate to the route
  // };
  // main menu click
  const handleMenuClick = (item: MenuItem) => {
    if (item.subMenuItems) {
      // Toggle dropdown if it has submenus
      setExpandedMenu(expandedMenu === item.label ? null : item.label);
    } else {
      // Navigate directly if no submenu
      navigate(item.path);
      setActiveMenuItem(item.path); // Use path to track active state
      setExpandedMenu(null); // Close all submenus
    }
  };

  // subMenu click
  // const handleSubMenuClick = () => {
  //   setExpandedMenu(null); // Close the submenu when an item is clicked
  // };
  // const handleSubMenuClick = (
  //   subItem: SubMenuItemsType,
  //   parentPath: string
  // ) => {
  //   subItem.onClick(); // Perform submenu action
  //   navigate(parentPath); // Navigate to the parent path
  //   setActiveMenuItem(parentPath); // Set parent path as active
  //   setExpandedMenu(null); // Close submenu after selection
  // };
  const handleSubMenuClick = (subItem: SubMenuItemsType, path: string) => {
    subItem.onClick(); // Perform submenu action
    // setActiveMenuItem(subItem.label); // Set the submenu item as active
    setActiveMenuItem(path); // Set the submenu item as active
    setExpandedMenu(null); // Close submenu after selection
    // TODO: need to use path properly
    // console.error('Path:', path);
    // navigate(path);
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.submenu-container') && !target.closest('aside')) {
        setExpandedMenu(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <>
      <aside
        className={`fixed z-30 left-0 top-0 h-screen transition-all duration-300 ease-in-out ${
          showMenu
            ? 'w-16 2xl:w-20 py-2 2xl:py-4 px-2'
            : 'w-36 md:w-44 lg:w-52 xl:w-56 px-4 2xl:px-8 py-10 2xl:py-14'
        }   shadow-md font-Mona_Sans bg-bgAside`}
      >
        {/* toggle menu drawer */}
        <button
          onClick={onToggleMenu}
          className="absolute top-2/3 right-0 -translate-y-1/2 h-16 md:h-20 lg:h-24 xl:h-[98px] 2xl: bg-bgPrimaryButton rounded-l-lg flex justify-center items-center w-4 2xl:w-5"
        >
          {showMenu ? (
            <img
              src={Chevron_Forward}
              alt="Chevron_Forward"
              className="lg:w-5"
            />
          ) : (
            <img
              src={Chevron_Backward}
              alt="Chevron_Backward"
              className="lg:w-5"
            />
          )}
        </button>

        {/* <div className="flex flex-col gap-16 2xl:gap-24 px-1 2xl:px-2 relative items-center"> */}
        <div
          className={`flex flex-col ${showMenu ? 'gap-16 2xl:gap-24' : 'gap-16 2xl:gap-10'} px-1 2xl:px-2 relative items-center`}
        >
          {/* logo */}
          <div
            className={`${showMenu ? 'h-10 w-full' : 'h-22 2xl:h-24 w-36 2xl:w-full'} transition-opacity duration-300 ease-in-out`}
          >
            <img src={logo} alt="logo" />
          </div>
          {/* menu */}
          <div
            className={`shadow-all flex flex-col ${
              showMenu ? 'items-center mt-1 2xl:mt-3' : ''
            } gap-4 2xl:gap-6 pl-2 2xl:pl-0`}
          >
            {menuItems.map((item, index) => (
              <div key={index} className="relative submenu-container">
                <div
                  onClick={() => handleMenuClick(item)}
                  className={`flex justify-between items-center cursor-pointer hover:text-bgPrimaryButton ${showMenu ? 'mb-4' : 'mb-2'} ${
                    activeMenuItem === item.path ? 'text-bgPrimaryButton' : ''
                  }`}
                  onMouseEnter={() => setHoveredIcon(item.label)} // Set hovered icon
                  onMouseLeave={() => setHoveredIcon(null)} // Reset hovered icon
                >
                  <div
                    className={`flex gap-3 transition-all duration-500 ease-in-out`}
                    data-tooltip-id={item.tooltipId}
                    data-tooltip-content={item.tooltipContent}
                  >
                    {/* <div className="w-6 2xl:w-7 h-6 2xl:h-7"> */}
                    <div
                      // className={`w-6 2xl:w-7 h-6 2xl:h-7 ${item.label === 'Attendance & Payroll' ? 'w-8 2xl:w-10 h-8 2xl:h-10' : ''}`}
                      // className={`w-5 h-5 2xl:w-6 2xl:h-6`} // For showmenu = true
                      // className={`w-6 h-6 2xl:w-8 2xl:h-8`} // For showmenu = false
                      className={`${!showMenu ? 'w-5 h-5 2xl:w-6 2xl:h-6 mt-0.5' : 'w-6 h-6 2xl:w-7 2xl:h-7'}`}
                    >
                      <img
                        src={
                          hoveredIcon === item.label ||
                          activeMenuItem === item.path
                            ? item.hoverIcon
                            : item.icon
                        }
                        alt={item.label}
                        className={`w-full h-full hover:scale-105 transition-all duration-300 ease-in-out`}
                      />
                    </div>
                    {/* <div
                      // className={`w-6 2xl:w-7 h-6 2xl:h-7 ${item.label === 'Attendance & Payroll' ? 'w-8 2xl:w-10 h-8 2xl:h-10' : ''}`}
                      className={`w-5 h-5 2xl:w-7 2xl:h-7 bg-red-700`}
                    ></div> */}
                    {/* <Building2
                      width={showMenu ? 24 : 16}
                      height={showMenu ? 24 : 16}
                    /> */}

                    {!showMenu && (
                      <div className="flex flex-1 items-center gap-1 2xl:gap-2">
                        <h3
                          className={`cursor-pointer font-medium text-responsive-aside-menu ${activeMenuItem === item.path ? 'text-bgPrimaryButton' : ''}`}
                        >
                          {item.label}
                        </h3>
                        {item.subMenuItems &&
                          (expandedMenu === item.label ? (
                            <img
                              src={Keyboard_Arrow_Up}
                              alt="Keyboard_Arrow_Up"
                              className="cursor-pointer icon-responsive-button"
                            />
                          ) : (
                            <img
                              src={Keyboard_Arrow_Down}
                              alt="Keyboard_Arrow_Down"
                              className="cursor-pointer icon-responsive-button"
                            />
                          ))}
                      </div>
                    )}
                  </div>
                </div>
                {item.subMenuItems && expandedMenu === item.label && (
                  <SubMenu
                    showMenu={showMenu}
                    items={item.subMenuItems}
                    // onSubMenuClick={handleSubMenuClick} // Pass the new handler
                    onSubMenuClick={(subItem) =>
                      handleSubMenuClick(subItem, item.path)
                    }
                    parentLabel={item.label}
                  />
                )}

                {/* {showMenu && <Tooltip id={item.tooltipId} place="right" />} */}
                {showMenu && expandedMenu !== item.label && (
                  <Tooltip
                    id={item.tooltipId}
                    place="right"
                    className="custom-tooltip"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* logout */}
        {/* <div
          className={`flex absolute bottom-[12%] lg:bottom-[10%] xl:bottom-[6%] hover:text-bgPrimaryButton ${showMenu ? 'left-1/2 transform -translate-x-1/2' : 'pl-1'} ${showMenu ? 'justify-center' : ''} items-center`}
          onMouseEnter={() => setIsLogoutHovered(true)} 
          onMouseLeave={() => setIsLogoutHovered(false)} 
        >
          <div
            onClick={onLogout}
            className={`flex gap-2 md:gap-3 items-center cursor-pointer`}
            data-tooltip-id="logout-tooltip"
            data-tooltip-content="Log Out"
          >
            <img
              src={isLogoutHovered ? LogoutBlue : LogOut_Icon}
              alt="Log Out"
              className={`md:w-5 lg:w-6 xl:w-7 hover:scale-105`}
            />
            {!showMenu && (
              <h3 className="cursor-pointer text-left font-medium text-xs sm:text-sm lg:text-lg">
                Log Out
              </h3>
            )}
          </div>
          {showMenu && <Tooltip id="logout-tooltip" place="right" />}
        </div>

        {isLogoutModalOpen && (
          <ConfirmationModal
            confirmButtonTitle="Yes"
            cancelButtonTitle="No"
            onConfirm={() => handleLogout()}
            onCancel={() => closeLogoutModal()}
            message={`Are you sure you want to logout?`}
          />
        )} */}
      </aside>
    </>
  );
};

export default Aside;
