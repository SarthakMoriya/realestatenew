/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { MdLocationOn } from "react-icons/md";
import { Link } from "react-router-dom";

const ListingCard = ({ listing }) => {
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]">
      <Link to={`/listing/${listing?._id}`}>
        <img
          src={listing?.imageUrls[0]}
          alt="listing cover"
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-200 mb-4"
        />
        <div className="p-3 flex flex-col gap-2">
          <p className="text-lg font-semibold truncate text-slate-700">
            {listing?.name}
          </p>
          <div className="flex gap-2 items-center">
            <MdLocationOn className="h-4 w-4 text-green-700" />
            <p className="text-gray-600 truncate w-full">{listing.address}</p>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">
            {listing.description}
          </p>
          <p className="text-slate-500 mt-2 font-semibold">
            $
            {listing.offer
              ? listing.discountPrice.toLocaleString("en-US")
              : listing.regularPrice.toLocaleString("en-US")}
            {listing.type === "rent" && "/month"}
          </p>
          <div className="flex gap-4 items-center text-slate-700">
            <div className=" font-bold text-sm">
              {listing.bedrooms > 1
                ? `${listing.bedrooms} beds`
                : `${listing.bedrooms} bed`}
            </div>
            <div className=" font-bold text-sm">
              {listing.bathrooms > 1
                ? `${listing.bathrooms} baths`
                : `${listing.bathrooms} bath`}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ListingCard;
