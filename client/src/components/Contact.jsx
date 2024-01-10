/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Contact = ({ listing }) => {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");
  const fetchUser = async () => {
    await fetch(`/api/user/${listing.userRef}`).then(async (res) => {
      const data = await res.json();
      if (data.success === false) {
        alert(data.message);
        return;
      }
      console.log(data);
      setLandlord(data);
    });
  };
  useEffect(() => {
    fetchUser();
  }, [listing.userRef]);
  console.log(listing);
  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-4">
          <p>
            Contact <span className="font-semibold">{landlord.username}</span>{" "}
            for{" "}
            <span className="font-semibold">{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            name="message"
            id="message"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            placeholder="Enter your message here..."
            className="w-full border p-3 rounded-lg"
          ></textarea>
          <Link
            to={`mailto:${landlord.email}?subject=Regarding ${listing?.name}&body=${message}`}
            className="text-white bg-slate-700 text-center p-3 uppercase rounded-lg hover:opacity-95"
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
};

export default Contact;
