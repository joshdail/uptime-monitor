// Route handlers for checks

const express = require('express');
const router = express.Router();

const lookupUser = require('./middleware/lookupUser');
const authenticateToken = require('./middleware/authenticateToken');
const sanitizeNewCheckData = require('./middleware/sanitizeNewCheckData');
const saveNewCheck = require('./middleware/saveNewCheck');
const lookupCheck = require('./middleware/lookupCheck');
const sanitizeCheckPatchInput = require('./middleware/sanitizeCheckPatchInput');
const updateCheck = require('./middleware/updateCheck');
const deleteCheck = require('./middleware/deleteCheck');

router.post('/', sanitizeNewCheckData, authenticateToken, saveNewCheck, function(req, res, next) {
  try {
    res.status(201).send(req.result);
    next();
  } catch (e) {
    return next(e);
  }
});

router.get('/:checkName', authenticateToken, lookupCheck, function(req, res, next) {
  try {
    res.status(200).send(req.result);
    next();
  } catch (e) {
    return next(e);
  }
});

router.patch('/:checkName', sanitizeCheckPatchInput, authenticateToken, lookupCheck, updateCheck, function(req, res, next) {
  try {
    res.status(204).send();
    next();
  } catch (e) {
    return next(e);
  }
});

router.delete('/:checkName', authenticateToken, lookupCheck, deleteCheck, function(req, res, next) {
  try {
    res.status(204).send();
    next();
  } catch (e) {
    return next(e);
  }
});

module.exports = router;