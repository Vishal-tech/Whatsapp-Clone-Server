import { users } from "../models/userModel.js";

export const getUserByUid = async (uid) => {
  try {
    const getUser = await users.findOne({ uid: uid });
    return getUser;
  } catch (error) {
    throw error;
  }
};

export const addUser = async (userDetails) => {
  try {
    const newUser = await users.create(userDetails);
    return newUser;
  } catch (error) {
    throw error;
  }
};

export const searchUsers = async (currentUser, payload) => {
  let searchTerm = payload.searchTerm ? payload.searchTerm.toLowerCase() : null;
  const page = payload.page;
  const pageSize = payload.pageSize;
  const skip = (page - 1) * pageSize;

  try {
    let currentUserObj = await getUserByUid(currentUser);
    let excludeUsers = [
      ...currentUserObj.sentRequests,
      ...currentUserObj.pendingRequests,
    ];
    let findQuery = {};
    if (searchTerm) {
      findQuery.name = { $regex: searchTerm, $options: "i" };
    }

    findQuery.uid = { $not: { $in: excludeUsers } };

    const filteredUsers = await users
      .find(findQuery)
      .sort({ _id: 1 })
      .skip(skip)
      .limit(pageSize);

    return filteredUsers;
  } catch (error) {
    throw error;
  }
};

export const sendFriendRequest = async (currentUser, targetUser) => {
  try {
    const userDoc = await users.findOneAndUpdate(
      { uid: currentUser },
      { $push: { sentRequests: targetUser } },
      {
        new: true,
      }
    );

    const friendDoc = await users.findOneAndUpdate(
      { uid: targetUser },
      { $push: { pendingRequests: currentUser } },
      {
        new: true,
      }
    );

    return { userDoc, friendDoc };
  } catch (error) {
    throw error;
  }
};

export const cancelFriendRequest = async (currentUser, targetUser) => {
  try {
    const userDoc = await users.findOneAndUpdate(
      { uid: currentUser },
      { $pull: { sentRequests: targetUser } },
      {
        new: true,
      }
    );

    const friendDoc = await users.findOneAndUpdate(
      { uid: targetUser },
      { $pull: { pendingRequests: currentUser } },
      {
        new: true,
      }
    );

    return { userDoc, friendDoc };
  } catch (error) {
    throw error;
  }
};
