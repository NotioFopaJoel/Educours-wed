const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/supportTicket.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');
const { ROLES } = require('../utils/constants');

router.use(authenticate);

router.post('/', ticketController.createTicket);
router.get('/my', ticketController.getMyTickets);
router.get('/all', authorize(ROLES.ADMIN), ticketController.getAllTickets);
router.get('/:ticketId', ticketController.getTicket);
router.post('/:ticketId/reply', ticketController.replyTicket);
router.patch('/:ticketId/status', authorize(ROLES.ADMIN), ticketController.updateTicketStatus);

module.exports = router;
