// read-only
const paymentsRouter = require('express').Router();

const controller = require('./payments.controller');

paymentsRouter.route('/confirm').get(controller.confirmPayment);

module.exports = paymentsRouter;