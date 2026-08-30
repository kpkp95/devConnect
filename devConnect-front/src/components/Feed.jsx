import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import { API_BASE_URL } from "../utils/constants";
import UserCard from "./UserCard";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const currentUser = useSelector((store) => store.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (feed.length > 0) return;

    const getFeedData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/feed`, {
          withCredentials: true,
        });
        const filteredFeed = Array.isArray(response.data.data)
          ? response.data.data.filter(
              (user) =>
                user?._id && currentUser?._id && user._id !== currentUser._id,
            )
          : [];
        dispatch(addFeed(filteredFeed));
      } catch (error) {
        // feed failure is handled by the empty-state UI
      }
    };

    getFeedData();
  }, [dispatch, feed.length, currentUser?._id]);

  const visibleFeed = Array.isArray(feed)
    ? feed.filter(
        (user) => user?._id && currentUser?._id && user._id !== currentUser._id,
      )
    : [];

  if (!visibleFeed.length) {
    return <p className="p-8 text-center">No new users found.</p>;
  }

  return (
    <div className="flex min-h-[calc(100vh-11rem)] items-center justify-center px-4 py-8">
      <UserCard user={visibleFeed[0]} />
    </div>
  );
};

export default Feed;
