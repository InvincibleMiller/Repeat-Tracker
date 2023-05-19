import React, { useState } from "react";
import TabBox from "./Tabs/TabBox";

const NavBar = ({ setTab, index }) => {
  const [tabs, setTabs] = useState([
    {
      text: "Weeks",
      icon: null,
    },
    {
      text: "Days",
      icon: null,
    },
  ]);
  return (
    <div
      className="w-full bg-red-500 min-h-[3.5rem] text-white text-xl font-bold
                 flex justify-between gap-2 items-center px-6 shadow-sm shadow-gray-300"
    >
      <span className="overflow-hidden text-clip whitespace-nowrap">
        Repeat Tracker
      </span>
      <TabBox tabs={tabs} tab={index} setTab={setTab} />
    </div>
  );
};

export default NavBar;
