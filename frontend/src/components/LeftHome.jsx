import React, { useState } from "react";
import logo from "../assets/logo.png";
import { FaRegHeart } from "react-icons/fa6";
import dp from "../assets/dp.webp";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import OtherUser from "./OtherUser";
import Notifications from "../pages/Notifications";

function LeftHome() {
  const { userData, suggestedUsers, notificationData } = useSelector(
    (state) => state.user
  );

  const [showNotification, setShowNotification] = useState(false);

  const dispatch = useDispatch();

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/signout`, {
        withCredentials: true,
      });

      dispatch(setUserData(null));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={`w-[25%] hidden lg:block h-[100vh] bg-[black] border-r-2 border-gray-900 ${
        showNotification ? "overflow-hidden" : "overflow-auto"
      }`}
    >
      {/* Logo and Notification */}
      <div className="w-full h-[100px] flex items-center justify-between p-[20px]">
        <img src={logo} alt="" className="w-[80px]" />

        <div
          className="relative z-[100] cursor-pointer"
          onClick={() => setShowNotification((prev) => !prev)}
        >
          <FaRegHeart className="text-[white] w-[25px] h-[25px]" />

          {notificationData?.length > 0 &&
            notificationData.some((noti) => noti.isRead === false) && (
              <div className="w-[10px] h-[10px] bg-blue-600 rounded-full absolute top-0 right-[-5px]"></div>
            )}
        </div>
      </div>

      {/* Main Content */}
      {!showNotification && (
        <>
          {/* User Profile */}
          <div className="flex items-center w-full justify-between gap-[10px] px-[10px] border-b-2 border-b-gray-900 py-[10px]">
            <div className="flex items-center gap-[10px]">
              {/* Profile Image */}
              <div className="w-[70px] h-[70px] border-2 border-black rounded-full cursor-pointer overflow-hidden">
                <img
                  src={userData?.profileImage || dp}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>

              {/* User Info */}
              <div>
                <div className="text-[18px] text-white font-semibold">
                  {userData?.userName}
                </div>

                <div className="text-[15px] text-gray-400 font-semibold">
                  {userData?.name}
                </div>
              </div>
            </div>

            {/* Logout */}
            <div
              className="text-blue-500 font-semibold cursor-pointer"
              onClick={handleLogOut}
            >
              Log Out
            </div>
          </div>

          {/* Suggested Users */}
          <div className="w-full flex flex-col gap-[20px] p-[20px]">
            <h1 className="text-[white] text-[19px]">
              Suggested Users
            </h1>

            {suggestedUsers &&
              suggestedUsers.slice(0, 3).map((user, index) => (
                <OtherUser key={index} user={user} />
              ))}
          </div>
        </>
      )}

      {/* Notifications */}
      {showNotification && <Notifications />}
    </div>
  );
}

export default LeftHome;
