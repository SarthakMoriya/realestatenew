/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signInFailure, signInStart, signInSuccess } from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

const Signin = () => {
  const [formData, setFormData] = useState({});
  const {error,loading}=useSelector(state=>state.user)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signInStart());
    await fetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    }).then(async (res) => {
      const data = await res.json();
      console.log(data);

      // ERROR
      if (data.success === false) {
        dispatch(signInFailure(data.message))
        return;
      }
      // SUCCESS
      dispatch(signInSuccess(data))
      navigate("/");
    });
  };
  return (
    <div className="max-w-lg mx-auto p-3">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white uppercase p-3 rounded-lg hover:opacity-85 duration-500 ease-in"
        >
          {loading ? "Loading" : "Sign in"}
        </button>
        <OAuth/>
      </form>
      <div className="flex gap-2 mt-3">
        <p>Dont have an account?</p>
        <Link to="/signup">
          <span className="text-blue-700">Login </span>
        </Link>
      </div>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default Signin;
