require('dotenv').config();

const express = require('express');
const router = express.Router();
const verifyPassword = require('./middleware/verifyPassword');
const generateToken = require('./middleware/generateToken');
const authenticateToken = require('./middleware/authenticateToken');
const extendToken = require('./middleware/extendToken');
const deleteToken = require('./middleware/deleteToken');
const lookupUser = require('./middleware/lookupUser');

router.post('/', verifyPassword, generateToken, async function(req, res, next) {
  try {
    res.status(201).json({
      token: req.tokenId
    });
    next();
  } catch (e) {
    return next(e);
  }
});

router.get('/', authenticateToken, async function(req, res, next) {
  try {
    const result = {
      token: req.token.tokenId,
      expires: req.token.expires
    }
    res.status(200).send(result);
  } catch (e) {
    return next(e);
  }
});

router.patch('/', extendToken, async function(req, res, next) {
  try {
    res.status(204).send();
    next();
  } catch (e) {
    return next(e);
  }
});

router.delete('/', deleteToken, async function(req, res, next) {
  try {
    res.status(204).send();
    next();
  } catch (e) {
    return next(e);
  }
});

module.exports = router;