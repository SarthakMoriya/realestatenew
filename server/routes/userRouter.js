import { Router } from "express";
import {
  updateUser,
  deleteUser,
  getUserListings,
  getUser
} from "../controllers/userController.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = Router();

router.post("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/listings/:id", verifyToken, getUserListings);
router.get("/:id", verifyToken, getUser);

export default router;
