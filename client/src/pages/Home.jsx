import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import ListingItem from "../components/ListinItem";
const Home = () => {
  SwiperCore.use([Navigation]);
  const [offerListing, setOfferListing] = useState([]);
  const [saleListings, setSaleListing] = useState([]);
  const [rentListing, setRentListing] = useState([]);
  const fetchOfferListings = async () => {
    try {
      const res = await fetch(`/api/listing/get?offer=true&limit=4`);
      const data = await res.json();
      setOfferListing(data);
      fetchRentListings();
    } catch (error) {
      console.log(error.message);
    }
  };
  const fetchRentListings = async () => {
    try {
      const res = await fetch(`/api/listing/get?type=rent&limit=4`);
      const data = await res.json();
      setRentListing(data);
      fetchSaleListings();
    } catch (error) {
      console.log(error.message);
    }
  };
  const fetchSaleListings = async () => {
    try {
      const res = await fetch(`/api/listing/get?type=sale&limit=4`);
      const data = await res.json();
      setSaleListing(data);
    } catch (error) {
      console.log(error.message);
    }
  };
  console.log(offerListing, saleListings, rentListing);
  useEffect(() => {
    fetchOfferListings();
  }, []);
  return (
    <div className="">
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Find yout next <span className="text-slate-500">Perfect</span> <br />
          place with ease
        </h1>
        <div className=" text-gray-500">
          XYZ Estate is the best place to find your next perfect place to live
          <br />
          We have awide range of properties for you t ochoose from.
        </div>
        <Link
          className="text-xs sm:text-sm text-blue-800 font-bold"
          to={"/search"}
        >{`Let's Start Now...`}</Link>
      </div>
      <Swiper navigation>
        {offerListing &&
          offerListing?.length > 0 &&
          offerListing?.map((listing) => {
            return (
              <SwiperSlide key={listing._id}>
                <div
                  className="h-[500px]"
                  key={listing._id}
                  style={{
                    background: `url(${listing?.imageUrls[0]}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            );
          })}
      </Swiper>
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
      {offerListing && offerListing.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent offers</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>Show more offers</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {offerListing.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {rentListing && rentListing.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent places for rent</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=rent'}>Show more places for rent</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {rentListing.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-600'>Recent places for sale</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=sale'}>Show more places for sale</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
