const express = require('express')
const { Op } = require("sequelize");
const router = express.Router()

/**
 *  Returns the profession that earned the most money (sum of jobs paid) for any contactor that worked in the query time range.
 */
router.get('/best-profession', async (req, res) => {

  const {Contract, Job, Profile} = req.app.get('models')
  const {start, end} = req.query
  const sequelize = req.app.get('sequelize')

  // TODO: Dates management for filtering

  const contracts = await Job.findAll({
    attributes: [
      "id",
      "paid",
      "Contract.Contractor.profession",
      [sequelize.fn("SUM", sequelize.col("price")), "earnedSum"],
    ],
    include: {
        model: Contract,
        as: 'Contract',
        include: {
          model: Profile,
          as: 'Contractor',
        }
    },
    group: 'Contract.Contractor.profession',
    order: [['earnedSum', "DESC"]],
  })

  const bestProfession = contracts[0];

  res.json({profession: bestProfession.Contract.Contractor.profession})
})

/**
 * @returns non-terminated contract by authenticated profile
 */
router.get('/best-client', async (req, res) => {

  const {Contract, Job, Profile} = req.app.get('models')
  const {start, end, limit} = req.query
  const sequelize = req.app.get('sequelize')

  // TODO: Dates management for filtering

  const clients = await Job.findAll({
    attributes: [
      "id",
      [sequelize.fn("SUM", sequelize.col("price")), "paid"],
    ],
    include: {
      model: Contract,
      as: 'Contract',
      include: {
        model: Profile,
        as: 'Client',
      }
    },
    group: 'Contract.Client.id',
    order: [['paid', "DESC"]],
    limit: limit ?? 2,
  })

  res.json(clients)
})


module.exports = router
