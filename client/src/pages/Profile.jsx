import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { app } from "../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signInStart,
  updateUserFailure,
  updateUserSuccess,
} from "../redux/user/userSlice";
const Profile = () => {
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [fileProgress, setFileProgress] = useState(0);
  const [fileUploadError, setFileUploadError] = useState("");
  const [formData, setFormData] = useState({});
  const [userUpdateSuccess, setUserUpdateSuccess] = useState(false);
  const [showListingError, setShowListingError] = useState(false);
  const [userListings, setUserListings] = useState([]);

  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleFileUpload = async (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name; // So no two users have same file
    const storageRef = ref(storage, fileName); //location+filename
    const uploadTask = uploadBytesResumable(storageRef, file); //finalStep

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFileProgress(progress);
      },
      (err) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setFormData({ ...formData, avatar: downloadUrl });
        });
      }
    );
  };
  useEffect(() => {
    if (file) handleFileUpload(file);
  }, [file]);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data.rest));
      setUserUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };
  const handleDelete = async () => {
    dispatch(deleteUserStart("Error Deleting user"));
    await fetch(`/api/user/delete/${currentUser._id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
      .then(async (res) => {
        const data = await res.json();
        console.log(data);
        if (data.ok === false) {
          dispatch(deleteUserFailure(data.message));
        } else {
          dispatch(deleteUserSuccess());
          navigate("/signin");
        }
      })
      .catch((error) => console.log(error));
  };
  const handleSignout = async () => {
    await fetch("/api/auth/signout");
    dispatch(deleteUserSuccess());
  };
  const handleShowListings = async () => {
    setShowListingError(false);
    await fetch(`/api/user/listings/${currentUser?._id}`).then(async (res) => {
      const data = await res.json();
      if (data.success === false) {
        setShowListingError("Erro Fetching Listings");
        return;
      }
      setUserListings(data);
      setShowListingError(false);
    });
  };
  const handleDeleteListing = async (id) => {
    await fetch(`/api/listing/delete/${id}`, { method: "DELETE" }).then(
      async (res) => {
        const data = await res.json();
        if (data.success === false) {
          alert(data.message);
          return;
        }
      }
    );
    setUserListings((prev) => prev.filter((listing) => listing._id !== id));
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => {
            setFile(e.target.files[0]);
          }}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          src={formData?.avatar || currentUser?.avatar}
          alt="profilePic"
          className="rounded-full w-24 h-24 object-cover cursor-pointer self-center mt-2"
          onClick={() => {
            fileRef.current.click();
          }}
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">Error Uploading Photo</span>
          ) : fileProgress > 0 && fileProgress < 100 ? (
            <span className="text-slate-700">{`Uploading ${fileProgress}`}</span>
          ) : fileProgress === 100 ? (
            <span className="text-green-700">Image Uploaded Successfully</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          className="border p-3 rounded-lg"
          placeholder="username"
          id="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <input
          type="text"
          className="border p-3 rounded-lg"
          placeholder="email"
          id="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <input
          type="password"
          className="border p-3 rounded-lg"
          placeholder="password"
          id="password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-90 disabled:opacity-80"
        >
          {loading ? "Updating..." : "Update"}
        </button>
        <Link
          to="/create-listing"
          className="w-full bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-80"
        >
          Create Listing
        </Link>
      </form>
      <div className="flex items-center justify-between text-red-700 mt-5 cursor-pointer">
        <div className="" onClick={handleDelete}>
          Delete Account
        </div>
        <div className="" onClick={handleSignout}>
          Sign Out
        </div>
      </div>
      <p className="text-red-700">{error ? error : ""}</p>
      <p className="text-green-700">
        {userUpdateSuccess ? "Updated Successfully" : ""}
      </p>
      <button onClick={handleShowListings} className="text-green-700 w-full">
        Show Listings
      </button>
      {showListingError && (
        <p className="text-red-700">Error Fetching Listing</p>
      )}
      {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center mt-7 text-3xl font-semibold">
            Your Listings
          </h1>
          {userListings.map((listing) => {
            return (
              <div
                className=" p-3 flex items-center gap-4 border justify-between rounded-lg my-2"
                key={listing?._id}
              >
                <Link to={`/listing/${listing._id}`}>
                  <img
                    src={listing?.imageUrls[0]}
                    alt=""
                    className="w-24 h-24 object-cover"
                  />
                </Link>
                <Link to={`/listing/${listing._id}`}>
                  <div className="flex-1 text-slate-700 hover:underline truncate">
                    {listing?.name}
                  </div>
                </Link>
                <div className="flex flex-col ">
                  <Link to={`/update-listing/${listing._id}`}>
                    <button className="text-green-700">Edit</button>
                  </Link>
                  <button
                    className="text-red-700"
                    onClick={() => {
                      handleDeleteListing(listing._id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Profile;
