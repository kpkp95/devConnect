import { API_BASE_URL } from "../utils/constants";
import axios from "axios";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
import { motion, useMotionValue, useTransform } from "framer-motion";

const UserCard = ({ user, showActions = true, compact = false }) => {
  const dispatch = useDispatch();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-250, 0, 250], [-18, 0, 18]);

  const handleSendRequest = async (status, userId) => {
    try {
      await axios.post(
        `${API_BASE_URL}/request/send/${status}/${userId}`,
        {},
        { withCredentials: true },
      );
      dispatch(removeUserFromFeed(userId));
    } catch (err) {
      // request failure is handled by the UI state and server response
    }
  };

  const handleSwipe = (direction) => {
    if (direction === "right") {
      handleSendRequest("interested", user._id);
    } else {
      handleSendRequest("ignored", user._id);
    }
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      style={{ x, rotate }}
      onDragEnd={(_, info) => {
        if (info.offset.x > 120) {
          handleSwipe("right");
        } else if (info.offset.x < -120) {
          handleSwipe("left");
        } else {
          x.set(0);
        }
      }}
      className="cursor-grab active:cursor-grabbing"
    >
      <article
        className={`card card-border bg-base-300 w-full overflow-hidden shadow-xl ${
          compact ? "max-w-sm" : "max-w-md"
        }`}
      >
        <figure
          className={`relative aspect-4/5 bg-base-200 ${compact ? "max-h-72" : "max-h-80"}`}
        >
          <img
            src={user?.photo || "https://placeimg.com/400/225/arch"}
            alt={`${user?.firstName || "User"} ${user?.lastName || "profile"}`}
            className="h-full w-full object-cover object-top"
          />
          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 to-transparent px-5 pb-4 pt-12 text-white">
            <h2 className="text-2xl font-bold">
              {user?.firstName} {user?.lastName}
            </h2>
            {(user?.age != null || user?.gender) && (
              <div className="mt-2 flex gap-2 text-sm">
                {user?.age != null && <span>{user.age}</span>}
                {user?.age != null && user?.gender && (
                  <span aria-hidden="true">•</span>
                )}
                {user?.gender && (
                  <span className="capitalize">{user.gender}</span>
                )}
              </div>
            )}
          </div>
        </figure>
        <div className={`card-body gap-3 ${compact ? "p-4" : "p-5"}`}>
          <p className="text-sm leading-6 text-base-content/70">
            {user?.about}
          </p>

          {user?.skills?.length > 0 && (
            <div aria-label="Skills">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-base-content/60">
                Skills
              </p>
              <div className="flex flex-wrap gap-2">
                {user.skills.map((skill) => (
                  <span key={skill} className="badge badge-outline badge-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {(user?.linkedinUrl || user?.githubUrl) && (
            <div className="mt-2 flex flex-wrap gap-2">
              {user.linkedinUrl && (
                <a
                  href={user.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline btn-sm flex-1"
                >
                  LinkedIn
                </a>
              )}
              {user.githubUrl && (
                <a
                  href={user.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline btn-sm flex-1"
                >
                  GitHub
                </a>
              )}
            </div>
          )}
          {showActions && (
            <div className="card-actions mt-1 grid grid-cols-2">
              <button
                className="btn btn-error"
                onClick={() => handleSendRequest("ignored", user._id)}
              >
                Ignore
              </button>
              <button
                className="btn btn-primary"
                onClick={() => handleSendRequest("interested", user._id)}
              >
                Interested
              </button>
            </div>
          )}
        </div>
      </article>
    </motion.div>
  );
};

export default UserCard;
