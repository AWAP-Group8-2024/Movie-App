import jwt from "jsonwebtoken";
const { verify } = jwt;

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.statusMessage = "Authorization required";
    return res.status(401).json({ message: "Authorization required" });
  }

  const token = authHeader.split(" ")[1];
  console.log(token);

  try {
    const decoded = verify(token, process.env.JWT_SECRET);

    req.user = decoded; // Store decoded user information in req.user
    next();
  } catch (error) {
    console.error("Authorization error:", error);
    res.statusMessage = "Invalid credentials";
    return res.status(403).json({ message: "Invalid credentials" });
  }
};

export { auth };