import Listing from "../models/listingModel.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(errorHandler(404, "ListingNot Found"));

    if (req.user.id !== listing.userRef) {
      return next(errorHandler(401, "You can only delete your own listings"));
    }

    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Listing Deleted ");
  } catch (error) {
    next(errorHandler());
  }
};

export const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(errorHandler(404, "Listing Not Found"));

    if (req.user.id !== listing.userRef) {
      return next(errorHandler(401, "You can only update your own listings"));
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(errorHandler(500, "SOMETHING WENT WRONG"));
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(errorHandler(404, "Listing Not Found"));

    res.status(200).json(listing);
  } catch (error) {
    next(errorHandler(500, "ERROR INTERNAL"));
  }
};

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.params.limit) || 9;
    const startIndex = parseInt(req.params.startIndex) || 0;
    let offer = req.query.offer; //undefined,true or false

    if (offer === "undefined" || offer === "false") {
      offer = { $in: [false, true] }; //find documenets which have offer either true or false
    }

    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] }; //find documenets which have offer either true or false
    }
    let parking = req.query.parking;

    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] }; //find documenets which have offer either true or false
    }
    let type = req.query.type;

    if (type === undefined || type === "all") {
      type = { $in: ["sale", "rent"] }; //find documenets which have offer either true or false
    }

    const searchTerm = req.query.searchTerm || "";
    const sort = req.query.sort || "createdAt";
    const order = req.query.order || "desc";

    const listings = await Listing.find({
      //if name is Modern Extra Large Rooms then ignore uppercase lowercase and search entire name not only first word
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

     res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
