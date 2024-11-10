import { Router } from 'express';
import { 
    getAllMembersController, 
    isMemberController, 
    addMemberController, 
    deleteMemberController 
} from '../controllers/groupMemberController.js';

const router = Router({ mergeParams: true });

// Define routes for group members
router.get('/', getAllMembersController);              // GET all members in the group
router.get('/:id', isMemberController);                // GET a specific member in the group
router.post('/', addMemberController);                 // POST to add a new member to the group
router.delete('/:id', deleteMemberController);         // DELETE to remove a member from the group

export default router;
