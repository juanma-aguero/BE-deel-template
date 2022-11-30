const express = require('express')
const { Op } = require("sequelize");
const router = express.Router()

/**
 * @returns contract by id
 */
router.get('/:id', async (req, res) => {

  const {Contract} = req.app.get('models')
  const {id} = req.params
  const authId = req.get('profile_id')

  // Check request id is from authenticated
  if ( authId !== id ) {
    return res.status(401).end()
  }
  const contract = await Contract.findOne({where: {id}})
  if(!contract) return res.status(404).end()
  res.json(contract)
})

/**
 * @returns non-terminated contract by authenticated profile
 */
router.get('/', async (req, res) => {

  const {Contract} = req.app.get('models')
  const userId = req.get('profile_id')

  const contracts = await Contract.findAll({
    where: {
      [Op.or]: [
        {ContractorId: userId},
        {ClientId: userId},
      ],
      [Op.and]: [
        {status: {[Op.ne]:'terminated'}},
      ]
    }})
  res.json(contracts)
})


module.exports = router
