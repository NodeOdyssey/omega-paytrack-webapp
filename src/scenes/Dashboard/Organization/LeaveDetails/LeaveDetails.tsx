import React from 'react';

import BreadCrumb from '../../../../common/BreadCrumb/BreadCrumb';
interface BreadCrumbProps {
  activeSection: string | null;
  activeSubMenuItem: string | null;
}
const LeaveDetails: React.FC<BreadCrumbProps> = ({
  activeSection,
  activeSubMenuItem,
}) => {
  return (
    <>
      <BreadCrumb />
      <div>
        LeaveDetails {activeSection} {activeSubMenuItem}
      </div>
    </>
  );
};

export default LeaveDetails;
