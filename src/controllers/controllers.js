import { users } from "../models/userModel.js";
import * as services from "../services/services.js";

export const getUserByUid = async (req, res) => {
  try {
    const result = await services.getUserByUid(req.params.uid);
    res.json(result);
  } catch (error) {
    console.log("Error :", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const addUser = async (req, res) => {
  try {
    const result = await services.addUser(req.body);
    res.json(result);
  } catch (error) {
    console.log("Error :", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const result = await services.searchUsers(req.decodedToken.uid, req.body);
    res.json(result);
  } catch (error) {
    console.log("Error :", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const sendFriendRequest = async (req, res) => {
  try {
    const result = await services.sendFriendRequest(
      req.body.currentUser,
      req.body.targetUser
    );
    res.json(result.userDoc);
  } catch (error) {
    console.log("Error :", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const cancelFriendRequest = async (req, res) => {
  try {
    const result = await services.cancelFriendRequest(
      req.body.currentUser,
      req.body.targetUser
    );
    res.json(result.userDoc);
  } catch (error) {
    console.log("Error :", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
