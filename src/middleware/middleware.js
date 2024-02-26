import firebaseApp from "../../config/firebaseAdmin.js";

export const verifyRequest = async (req, res, next) => {
  const verifyToken = async (idToken) => {
    try {
      const decodedToken = await firebaseApp.auth().verifyIdToken(idToken);
      return decodedToken;
    } catch (error) {
      throw error;
    }
  };

  const idToken =
    req.headers.authorization && req.headers.authorization.split(" ")[1];
  if (!idToken) {
    return res.status(403).send("Unauthorized");
  }
  try {
    const decodedToken = await verifyToken(idToken);
    req.decodedToken = decodedToken;
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(403).send("Unauthorized");
  }
};

export const requestLogMiddleware = (req, res, next) => {
  const timestamp = new Date().toLocaleString();
  console.log(
    `[${timestamp}][${req.decodedToken.uid}][${req.decodedToken.email}] API Request: ${req.method} ${req.url}`
  );
  next();
};
