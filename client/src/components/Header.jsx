import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    console.log(urlParams);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  useEffect(() => {
    // if we try changing searchTerm from addressbar input should also change
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);
  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
          <span className="text-slate-500">My</span>
          <span className="text-slate-700">Estate</span>
        </h1>
        <form
          onSubmit={handleSubmit}
          className="bg-slate-100 rounded-lg p-3 flex items-center"
        >
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            className="bg-transparent focus:outline-none w-24 sm:w-64"
          />
          <FaSearch className="text-slate-600" />
        </form>
        <ul className="flex gap-2">
          <li className="hidden sm:inline text-slate-900 hover:text-slate-500 duration-500 ease-in cursor-pointer">
            Home
          </li>
          <li className="hidden sm:inline text-slate-900 hover:text-slate-500 duration-500 ease-in cursor-pointer">
            About
          </li>
          <Link to={currentUser ? "/profile" : "/signin"}>
            {currentUser ? (
              <img
                src={currentUser?.avatar}
                className="rounded-full w-7 h-7 object-cover"
              />
            ) : (
              <li className="hidden sm:inline text-slate-900 hover:text-slate-500 duration-500 ease-in cursor-pointer">
                Sign In
              </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
};

export default Header;
