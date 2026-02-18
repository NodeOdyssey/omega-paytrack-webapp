// Libraries
import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="flex items-center justify-center w-full h-[calc(100vh-56px)] 2xl:h-[calc(100vh-72px)]">
      <img
        src="https://pscpl-paytrack.s3.ap-south-1.amazonaws.com/assets/logo_big.svg"
        alt="PSCPL Logo"
        className="w-72 h-auto md:w-96 lg:w-[28rem] 2xl:w-[34rem]"
      />
    </div>
  );
};

export default Home;
