// controllers/membershipRequestController.js
import MembershipRequest from "../models/membershipRequest.js";

// Create a new membership request
export const createMembershipRequest = async (req, res, next) => {
  try {
    const { groupId, userId } = req.body;
    const request = await MembershipRequest.createRequest(groupId, userId);
    res.status(201).json(request);
  } catch (error) {
    next(error);
  }
};

// Get all membership requests for a group
export const getRequestsByGroup = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const requests = await MembershipRequest.getRequestsByGroup(groupId);
    res.status(200).json(requests);
  } catch (error) {
    next(error);
  }
};

// Update membership request status
export const updateRequestStatus = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;
    const updatedRequest = await MembershipRequest.updateRequestStatus(requestId, status);
    res.status(200).json(updatedRequest);
  } catch (error) {
    next(error);
  }
};

// Delete a membership request
export const deleteMembershipRequest = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    const deletedRequest = await MembershipRequest.deleteRequest(requestId);
    res.status(200).json(deletedRequest);
  } catch (error) {
    next(error);
  }
};
