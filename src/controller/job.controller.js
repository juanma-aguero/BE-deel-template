const express = require('express')
const { Op } = require("sequelize");
const router = express.Router()


/**
 * @returns unpaid jobs by authenticated profile
 */
router.get('/unpaid', async (req, res) => {

  const {Job, Contract} = req.app.get('models')
  const userId = req.get('profile_id')

  const unpaidJobs = await Job.findAll({
    include: {
      model: Contract,
      as: 'Contract',
      where: {
        [Op.or]: [
          {ContractorId: userId},
          {ClientId: userId},
        ],
        [Op.and]: [
          {status: {[Op.eq]:'in_progress'}},
        ],
      }
    },
    where: {
      paid: {[Op.not]: true},
    }
  })
  res.json(unpaidJobs)
})

/**
 * Pay for a job, a client can only pay if his balance >= the amount to pay. The amount should be moved from the client's balance to the contractor balance
 * @returns 201 when pay ok
 */
router.post('/:job_id/pay', async (req, res) => {

  const {Job, Contract, Profile} = req.app.get('models')
  const clientId = req.get('profile_id')
  const amount = req.body.amount;
  const {job_id} = req.params
  const transaction = await req.app.get('sequelize').transaction();

  // Check if job exists
  const job = await Job.findOne({where: {id: job_id}});
  if (!job) {
    return res.status(404).end()
  }

  const client = await Profile.findOne({where: {id: clientId}});

  // VALIDATIONS
  // Check if balance is enough
  if (amount > 0 && client.balance < amount){
    return res.status(400).end()
  }
  // Check if pay amount is enough for job
  if (job.price > amount){
    return res.status(400).end()
  }
  // TODO: Maybe we need to check if who is paying is a client?

  // Paid for a job
  // TODO: Refactor to use joins and minimize amount of db queries
  const contract = await Contract.findOne({where: {id: job.ContractId}});
  const contractor = await Profile.findOne({where: {id: contract.ContractorId}});

  try {
    contractor.balance = contractor.balance + amount;
    await  contractor.save();

    client.balance = client.balance - amount;
    await  client.save();

    job.paid = 1;
    await  job.save();

    await transaction.commit();

  } catch (error) {


    await transaction.rollback();
  }


  res.status(201).end();
})


module.exports = router
