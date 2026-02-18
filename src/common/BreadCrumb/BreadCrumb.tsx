// Libraries
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { Chevron_Breadcrumb_Icon } from '../../assets/icons';
type BreadcrumbItem = {
  name: string;
  url: string;
};

type BreadcrumbProps = {
  total?: number;
};

const BreadCrumb: React.FC<BreadcrumbProps> = ({ total }) => {
  const location = useLocation();
  const [breadcrumbItems, setBreadcrumbItems] = useState<BreadcrumbItem[]>([]);

  // useEffect(() => {
  //   const paths = location.pathname.split('/').filter((path) => path);

  //   const items = paths.slice(1).map((path, index) => {
  //     const url = `/${paths.slice(0, index + 2).join('/')}`;
  //     return { name: path.replace('-', ' '), url };
  //   });

  //   setBreadcrumbItems(items);
  // }, [location]);

  useEffect(() => {
    const paths = location.pathname.split('/').filter((path) => path);

    const items = paths.slice(1).map((path, index) => {
      const url = `/${paths.slice(0, index + 2).join('/')}`;
      const name = path
        .split('-') // Split by hyphen
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
        .join(' '); // Join with a space
      return { name, url };
    });

    setBreadcrumbItems(items);
  }, [location]);

  // console.log('What is BreadCrumb Items: ', breadcrumbItems);
  // Define non-clickable paths
  const nonClickablePaths = ['Organisation', 'posts', 'payroll'];

  return (
    <nav className="w-fit">
      <ol className="flex 2xl:space-x-1">
        {breadcrumbItems.map((item, index) => {
          const isLastItem = index === breadcrumbItems.length - 1;
          const isNonClickable = nonClickablePaths.includes(item.name);

          return (
            <li key={index} className="flex items-center">
              {!isLastItem && !isNonClickable ? (
                <Link
                  to={item.url}
                  // className="text-gray-500 hover:text-gray-700 capitalize text-xs lg:text-sm xl:text-base"
                  className="text-gray-500 hover:text-gray-700 capitalize text-responsive-breadcrumb"
                >
                  {item.name}
                </Link>
              ) : (
                <div
                  className={`capitalize flex gap-2 text-responsive-breadcrumb ${
                    isLastItem ? 'font-bold' : 'text-gray-500'
                  }`}
                >
                  <div>{item.name}</div>
                  {(item.name === 'Employee Details' || item.name === 'Posts' || item.name === 'Rank Details') && total && (
                    <div>({total})</div>
                  )}
                </div>
              )}
              {index < breadcrumbItems.length - 1 && (
                // <span className="mx-2">{'>'}</span>
                <span className="mx-1">
                  <img src={Chevron_Breadcrumb_Icon} className="w-4" alt="" />
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default BreadCrumb;
