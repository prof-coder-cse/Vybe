import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import NotificationCard from "../components/NotificationCard";
import axios from "axios";
import { serverUrl } from "../App";
import { setNotificationData } from "../redux/userSlice";

function Notifications() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { notificationData } = useSelector((state) => state.user);

  const fetchNotifications = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/user/getAllNotifications`,
        { withCredentials: true }
      );

      dispatch(setNotificationData(result.data || []));
    } catch (error) {
      console.log("Fetch notification error:", error);
    }
  };

  const markAsRead = async () => {
    try {
      if (!notificationData || notificationData.length === 0) {
        return;
      }

      const ids = notificationData
        .filter((n) => n?._id)
        .map((n) => n._id);

      if (ids.length === 0) return;

      await axios.post(
        `${serverUrl}/api/user/markAsRead`,
        {
          notificationId: ids,
        },
        {
          withCredentials: true,
        }
      );

      await fetchNotifications();

    } catch (error) {
      console.log("Mark as read error:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (notificationData?.length > 0) {
      markAsRead();
    }
  }, []);

  return (
    <div className="w-full h-[100vh] bg-black overflow-auto">
      
      <div className="w-full h-[80px] flex items-center gap-[20px] px-[20px] lg:hidden">
        <MdOutlineKeyboardBackspace
          className="text-white cursor-pointer w-[25px] h-[25px]"
          onClick={() => navigate("/")}
        />

        <h1 className="text-white text-[20px] font-semibold">
          Notifications
        </h1>
      </div>

      <div className="w-full flex flex-col gap-[20px] px-[10px]">
        
        {notificationData?.length > 0 ? (
          notificationData.map((noti) => (
            <NotificationCard
              noti={noti}
              key={noti._id}
            />
          ))
        ) : (
          <div className="text-white text-center mt-[30px]">
            No notifications yet
          </div>
        )}

      </div>
    </div>
  );
}

export default Notifications;