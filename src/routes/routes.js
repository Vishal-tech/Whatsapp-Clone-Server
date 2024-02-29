import express from "express";
import * as controllers from "../controllers/controllers.js";
export const router = express.Router();

router.get("/users/:uid", controllers.getUserByUid);
router.post("/users/add", controllers.addUser);
router.post("/users/search", controllers.searchUsers);
router.post("/users/fetchUsersByUid", controllers.fetchUsersByUid);

router.post("/users/sendFriendRequest", controllers.sendFriendRequest);
router.post("/users/cancelFriendRequest", controllers.cancelFriendRequest);

router.post("/users/acceptFriendRequest", controllers.acceptFriendRequest);
