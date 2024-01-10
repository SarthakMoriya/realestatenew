import { BrowserRouter, Routes, Route } from "react-router-dom";
import {useSelector} from 'react-redux'
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Header from "./components/Header";
import CreateListing from "./pages/CreateListing";
import UpdateListing from "./pages/UpdateListing";
import Listing from "./pages/Listing";
import Search from "./pages/Search";

export default function App() {
  const {currentUser}=useSelector(state=>state.user)
  return (
    <BrowserRouter>
    <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} />
        <Route path="/search" element={<Search />} />
        <Route path="/profile" element={currentUser?<Profile />:<Signin/>} />
        <Route path="/listing/:id" element={<Listing />} />
        <Route path="/create-listing" element={currentUser?<CreateListing />:<Signin/>} />
        <Route path="/update-listing/:id" element={currentUser?<UpdateListing />:<Signin/>} />
        {/* <Route path="/update-listing/:id" element={<UpdateListing />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
