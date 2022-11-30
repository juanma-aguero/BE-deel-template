const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const {sequelize} = require('./model')
const {getProfile} = require('./middleware/getProfile')
const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

const contractController = require('./controller/contract.controller');
const jobController = require('./controller/job.controller');
const balanceController = require('./controller/balance.controller');
const adminController = require('./controller/admin.controller');

// Security


// Define paths
app.use('/jobs', getProfile, jobController);
app.use('/contracts', getProfile, contractController);
app.use('/balances', getProfile, balanceController);
app.use('/admin', adminController);


module.exports = app;
