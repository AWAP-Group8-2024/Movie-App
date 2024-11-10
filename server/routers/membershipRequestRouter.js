// routers/membershipRequestRouter.js
import express from "express";
import {
  createMembershipRequest,
  getRequestsByGroup,
  updateRequestStatus,
  deleteMembershipRequest
} from "../controllers/membershipRequestController.js";

const router = express.Router();

// Route to create a new membership request
router.post("/", createMembershipRequest);

// Route to get all membership requests for a group
router.get("/group/:groupId", getRequestsByGroup);

// Route to update the status of a membership request
router.patch("/:requestId", updateRequestStatus);

// Route to delete a membership request
router.delete("/:requestId", deleteMembershipRequest);

export default router;
