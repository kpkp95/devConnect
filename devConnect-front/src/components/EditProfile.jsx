import { useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { API_BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [photo, setPhoto] = useState(user.photo);
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");
  const [skills, setSkills] = useState(user.skills?.join(", ") || "");
  const [linkedinUrl, setLinkedinUrl] = useState(user.linkedinUrl || "");
  const [githubUrl, setGithubUrl] = useState(user.githubUrl || "");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState(false);

  const saveProfile = async () => {
    //Clear Errors
    setError("");
    try {
      const res = await axios.patch(
        API_BASE_URL + "/profile/edit",
        {
          firstName,
          lastName,
          photo,
          age: age === "" ? undefined : Number(age),
          gender,
          about,
          skills: skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean),
          linkedinUrl,
          githubUrl,
        },
        { withCredentials: true },
      );
      dispatch(addUser(res.data.user));
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Unable to save your profile. Please try again.",
      );
    }
  };

  return (
    <>
      <div className="my-10 flex flex-col items-center justify-center gap-8 lg:flex-row lg:items-center">
        <div className="flex justify-center lg:mx-10">
          <div className="card bg-base-300 w-96 shadow-xl">
            <div className="card-body gap-4 p-5">
              <h2 className="card-title justify-center">Edit Profile</h2>
              <div className="space-y-3">
                <label className="form-control w-full max-w-xs">
                  <div className="label pb-1">
                    <span className="label-text">First Name:</span>
                  </div>
                  <input
                    type="text"
                    value={firstName}
                    className="input input-bordered w-full max-w-xs"
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </label>
                <label className="form-control w-full max-w-xs">
                  <div className="label pb-1">
                    <span className="label-text">Last Name:</span>
                  </div>
                  <input
                    type="text"
                    value={lastName}
                    className="input input-bordered w-full max-w-xs"
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </label>
                <label className="form-control w-full max-w-xs">
                  <div className="label pb-1">
                    <span className="label-text">Photo URL:</span>
                  </div>
                  <input
                    type="text"
                    value={photo}
                    className="input input-bordered w-full max-w-xs"
                    onChange={(e) => setPhoto(e.target.value)}
                  />
                </label>
                <label className="form-control w-full max-w-xs">
                  <div className="label pb-1">
                    <span className="label-text">Age:</span>
                  </div>
                  <input
                    type="number"
                    min="18"
                    value={age}
                    className="input input-bordered w-full max-w-xs"
                    onChange={(e) => setAge(e.target.value)}
                  />
                </label>
                <label className="form-control w-full max-w-xs">
                  <div className="label pb-1">
                    <span className="label-text">Gender:</span>
                  </div>
                  <select
                    value={gender}
                    className="select select-bordered w-full max-w-xs"
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="" disabled>
                      Select gender
                    </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </label>
                <label className="form-control w-full max-w-xs">
                  <div className="label pb-1">
                    <span className="label-text">About:</span>
                  </div>
                  <input
                    type="text"
                    value={about}
                    className="input input-bordered w-full max-w-xs"
                    onChange={(e) => setAbout(e.target.value)}
                  />
                </label>
                <div className="flex w-full max-w-xs flex-col gap-2">
                  <label className="form-control w-full">
                    <div className="label pb-1">
                      <span className="label-text">Skills:</span>
                    </div>
                    <input
                      type="text"
                      value={skills}
                      className="input input-bordered w-full"
                      placeholder="JavaScript, React, Node.js"
                      onChange={(e) => setSkills(e.target.value)}
                    />
                  </label>
                  <div className="text-xs text-base-content/60">
                    Separate skills with commas
                  </div>
                </div>

                <label className="form-control w-full max-w-xs">
                  <div className="label pb-1">
                    <span className="label-text">LinkedIn URL:</span>
                  </div>
                  <input
                    type="url"
                    value={linkedinUrl}
                    className="input input-bordered w-full max-w-xs"
                    placeholder="https://linkedin.com/in/yourname"
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                  />
                </label>

                <label className="form-control w-full max-w-xs">
                  <div className="label pb-1">
                    <span className="label-text">GitHub URL:</span>
                  </div>
                  <input
                    type="url"
                    value={githubUrl}
                    className="input input-bordered w-full max-w-xs"
                    placeholder="https://github.com/yourname"
                    onChange={(e) => setGithubUrl(e.target.value)}
                  />
                </label>
              </div>
              <p className="text-red-500">{error}</p>
              <div className="card-actions justify-center m-2">
                <button className="btn btn-primary" onClick={saveProfile}>
                  Save Profile
                </button>
              </div>
            </div>
          </div>
        </div>
        <UserCard
          user={{
            firstName,
            lastName,
            photo,
            age,
            gender,
            about,
            skills: skills
              .split(",")
              .map((skill) => skill.trim())
              .filter(Boolean),
            linkedinUrl,
            githubUrl,
          }}
          showActions={false}
          compact
        />
      </div>
      {showToast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span>Profile saved successfully.</span>
          </div>
        </div>
      )}
    </>
  );
};
export default EditProfile;
