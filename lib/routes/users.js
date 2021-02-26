// Route handlers for user account creation and management

const express = require('express');
const router = express.Router();

const sanitizeNewUserData = require('./middleware/sanitizeNewUserData');
const hashNewPassword = require('./middleware/hashNewPassword');
const saveNewUser = require('./middleware/saveNewUser');
const lookupUser = require('./middleware/lookupUser');
const authenticateToken = require('./middleware/authenticateToken');
const sanitizeUserPatchInput = require('./middleware/sanitizeUserPatchInput');
const updateUser = require('./middleware/updateUser');
const deleteUser = require('./middleware/deleteUser');

router.post('/', sanitizeNewUserData, hashNewPassword, saveNewUser, async function(req, res, next) {
  try {
    res.status(201).send(req.result);
    next();
  } catch (e) {
    return next(e);
  }
});

router.get('/:email', authenticateToken, lookupUser, async function(req, res, next) {
  try {
    res.status(200).send(req.result);
    next();
  } catch (e) {
    return next(e);
  }
});

router.patch('/:email', sanitizeUserPatchInput, authenticateToken, lookupUser, updateUser, async function(req, res, next) {
  try {
    res.status(204).send();
  } catch (e) {
    return next(e);
  }
});

router.delete('/:email', authenticateToken, lookupUser, deleteUser, async function(req, res, next) {
  try {
    res.status(204).send();
  } catch (e) {
    return next(e);
  }
});

module.exports = router;