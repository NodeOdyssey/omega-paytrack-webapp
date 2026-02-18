// libraries
import React from 'react';

// types
type SubMenuItemProps = {
  label: string;
  onClick: () => void;
  // showMenu: boolean;
};

type SubMenuProps = {
  items: SubMenuItemProps[];
  showMenu: boolean;
  // onSubMenuClick: () => void;
  onSubMenuClick: (subItem: SubMenuItemProps) => void;
  parentLabel: string;
};

// const SubMenu: React.FC<{ items: SubMenuItemProps[]; showMenu: boolean }> = ({
const SubMenu: React.FC<SubMenuProps> = ({
  items,
  showMenu,
  onSubMenuClick,
  parentLabel,
}) => {
  return (
    <>
      <div
        className={`flex flex-col gap-2 ${showMenu ? 'p-4 absolute top-0 left-12 2xl:left-16 bg-bgAside w-44 2xl:w-52 shadow-md rounded-sm' : 'pl-10 2xl:pl-12'} font-Mona_Sans submenu-container z-50`}
      >
        {showMenu && (
          <h3 className="font-Mona_Sans text-left font-semibold text-primaryText hover:text-bgPrimaryButton text-responsive-aside-menu">
            {parentLabel}
          </h3>
        )}
        {items.map((item, index) => (
          <div
            key={index}
            // onClick={item.onClick}
            onClick={(e) => {
              e.stopPropagation();
              item.onClick();
              onSubMenuClick(item);
            }}
            className="flex gap-2 items-center cursor-pointer w-full"
          >
            <h3
              className={`font-Mona_Sans text-left text-responsive-button font-medium text-primaryText hover:text-bgPrimaryButton w-full ${showMenu ? 'pl-2 2xl:pl-3 py-0.5 2xl:py-1' : ''}`}
            >
              {item.label}
            </h3>
          </div>
        ))}
      </div>
    </>
  );
};

export default SubMenu;
