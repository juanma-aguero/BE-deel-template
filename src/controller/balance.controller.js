const express = require('express')
const { Op } = require("sequelize");
const router = express.Router()

/**
 * Deposits money into the balance of a client, a client can't deposit more than 25% his total of jobs to pay. (at the deposit moment)
 * @returns 201 when pay ok
 */
router.post('/deposit/:userId', async (req, res) => {

  const {Job, Contract, Profile} = req.app.get('models')
  const clientId = req.get('profile_id')
  const amount = req.body.amount;
  const {userId} = req.params
  const transaction = await req.app.get('sequelize').transaction();

  // TODO: Refactor to make one call to database and filter each client
  const clientFrom = await Profile.findOne({where: {id: clientId}});
  const clientTo = await Profile.findOne({where: {id: userId}});

  // Check if clientTo exists
  if (!clientTo) {
    return res.status(404).end()
  }

  // Check if balance more than 25%
  // TODO: Calculate all pending jobs to pay
  if (amount > 0 && clientFrom.balance < amount){
    return res.status(400).end()
  }

  // Deposit amount from balance to balance
  try {
    clientTo.balance = clientTo.balance + amount;
    await  clientTo.save();

    clientFrom.balance = clientFrom.balance - amount;
    await  clientFrom.save();

    await transaction.commit();

  } catch (error) {


    await transaction.rollback();
  }


  res.status(200).end();
})


module.exports = router
