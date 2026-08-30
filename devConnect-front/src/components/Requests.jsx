import axios from "axios";
import { API_BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestSlice";
import { useEffect, useState } from "react";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const reviewRequest = async (status, requestId) => {
    try {
      await axios.post(
        `${API_BASE_URL}/request/review/${status}/${requestId}`,
        {},
        { withCredentials: true },
      );
      dispatch(removeRequest(requestId));
    } catch (err) {
      // request review failure is handled by the current UI state
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchRequests = async () => {
      setIsLoading(true);

      try {
        const response = await axios.get(
          `${API_BASE_URL}/user/requests/received`,
          {
            withCredentials: true,
          },
        );

        const requestList = Array.isArray(response.data?.data)
          ? response.data.data
          : [];

        if (isMounted) {
          dispatch(addRequests(requestList));
        }
      } catch (err) {
        if (isMounted) {
          dispatch(addRequests([]));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchRequests();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  if (!Array.isArray(requests)) return null;

  if (isLoading) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center px-4 py-10">
        <div className="flex items-center gap-3 text-base-content/70">
          <span className="loading loading-spinner loading-md text-primary" />
          <span>Loading requests...</span>
        </div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="flex min-h-[65vh] items-center justify-center px-4 py-10">
        <div className="card w-full max-w-md border border-base-300 bg-base-200/80 shadow-2xl shadow-base-300/20 backdrop-blur-sm">
          <div className="card-body items-center text-center p-8">
            <div className="avatar placeholder mb-2">
              <div className="w-16 rounded-full bg-primary text-2xl text-primary-content">
                ✉️
              </div>
            </div>
            <h2 className="card-title text-2xl text-white">No requests yet</h2>
            <p className="text-sm text-base-content/70">
              New connection requests will show up here when people reach out.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white">
          Connection Requests
        </h1>
        <p className="mt-3 text-sm text-base-content/70">
          {requests.length} pending{" "}
          {requests.length === 1 ? "request" : "requests"}
        </p>
      </div>

      <div
        className={
          requests.length === 1
            ? "flex justify-center"
            : "grid gap-5 md:grid-cols-2"
        }
      >
        {requests.map((request) => {
          const profile = request.fromUserId ?? request;
          const {
            _id,
            firstName,
            lastName,
            photo,
            photoUrl,
            age,
            gender,
            about,
          } = profile;
          const fullName =
            [firstName, lastName].filter(Boolean).join(" ") || "Connection";
          const avatar =
            photo ||
            photoUrl ||
            "https://api.dicebear.com/7.x/initials/svg?seed=" + fullName;
          const isSingle = requests.length === 1;

          return (
            <div
              key={request._id || _id}
              className={
                isSingle
                  ? "card w-full max-w-2xl border border-primary/20 bg-base-200/90 shadow-2xl shadow-primary/10 transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10"
                  : "card border border-base-300 bg-base-200/80 shadow-xl shadow-base-300/20 transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl"
              }
            >
              <div className={isSingle ? "card-body p-7" : "card-body p-5"}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="avatar">
                      <div
                        className={
                          isSingle
                            ? "w-24 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-base-200"
                            : "w-20 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-base-200"
                        }
                      >
                        <img alt={fullName} src={avatar} />
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <h2
                        className={
                          isSingle
                            ? "text-3xl font-bold text-white"
                            : "text-2xl font-bold text-white"
                        }
                      >
                        {fullName}
                      </h2>
                      {age && gender && (
                        <p className="mt-1 text-sm text-base-content/70">
                          {age}, {gender}
                        </p>
                      )}
                    </div>
                  </div>

                  {isSingle && (
                    <span className="badge badge-primary badge-soft px-3 py-3 text-xs font-medium">
                      Pending
                    </span>
                  )}
                </div>

                <p
                  className={
                    isSingle
                      ? "mt-5 min-h-[84px] text-base leading-7 text-base-content/80"
                      : "mt-4 min-h-[72px] text-sm leading-6 text-base-content/80"
                  }
                >
                  {about || "No bio added yet."}
                </p>

                <div
                  className={isSingle ? "mt-6 flex gap-3" : "mt-5 flex gap-3"}
                >
                  <button
                    className="btn btn-outline btn-error flex-1 rounded-xl"
                    onClick={() => reviewRequest("rejected", request._id)}
                  >
                    Reject
                  </button>
                  <button
                    className="btn btn-primary flex-1 rounded-xl"
                    onClick={() => reviewRequest("accepted", request._id)}
                  >
                    Accept
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Requests;
