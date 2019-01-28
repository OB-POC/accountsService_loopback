'use strict';
var jwt = require('jsonwebtoken');
const secret = "TOPSECRET";

module.exports = function (Accounts) {
  Accounts.getBalance = (req, cb) => {
    var token = req.headers['x-access-token'];
    jwt.verify(token, secret, function (err, decodedObj) {
      if (err) {
        err.statusCode = 500;
        err.message = "token not verified."
        cb(err, null);
      }
      Accounts.app.dataSources.getAccountData.getData((err, response, context) => {
        if (err) {
          cb(err, null);
        }
        let users = response;
        if (users instanceof Array) {
          let userData = users.filter(user => user.username == decodedObj.username);
          if (userData.length > 0) {
            cb(null, 200, userData[0]);
          }
        }
      });
    });
  }

  Accounts.getDebitData = (req, cb) => {
    var token = req.headers['x-access-token'];
    jwt.verify(token, secret, function (err, decodedObj) {
      if (err) {
        err.statusCode = 500;
        err.message = "token not verified."
        cb(err, null);
      }
      Accounts.app.dataSources.getAccountData.getDebData(decodedObj.username, (err, response, context) => {
        if (err) {
          cb(err, null);
        } else {
          cb(null, 200, response);
        }
      });
    });
  }

  Accounts.getCreditData = (req, cb) => {
    var token = req.headers['x-access-token'];
    jwt.verify(token, secret, function (err, decodedObj) {
      if (err) {
        err.statusCode = 500;
        err.message = "token not verified."
        cb(err, null);
      }
      Accounts.app.dataSources.getAccountData.getCredData(decodedObj.username, (err, response, context) => {
        if (err) {
          cb(err, null);
        } else {
          cb(null, 200, response);
        }
      });
    });
  }

  Accounts.customizedBalance = (req, cb) => {
    var token = req.headers['x-access-token'];
    jwt.verify(token, secret, function (err, decodedObj) {
      if (err) {
        err.statusCode = 500;
        err.message = "token not verified."
        cb(err, null);
      }
      Accounts.app.dataSources.getAccountData.getCustomData(decodedObj.username, (err, response, context) => {
        if (err) {
          cb(err, null);
        }
        var userDebitAccountDetails = response;

        // getting index of bank
        var bankDetails = [];

        for (let i = 0; i < userDebitAccountDetails.banks.length; i++) {
          if (userDebitAccountDetails.banks[i].bankId === bankId) {
            bankDetails.push({
              'index': i,
              'bank': userDebitAccountDetails.banks[i]
            });
            break;
          }
        }
        let err = Error();
        console.log(JSON.stringify(bankDetails));
        // getting index of account of specific bank
        if (bankDetails.length === 1) {
          var accountDetails = [];

          for (let j = 0; j < bankDetails[0].bank.accounts.length; j++) {
            if (bankDetails[0].bank.accounts[j].accountNumber === accountNumber) {
              accountDetails.push({
                'index': j,
                'account': bankDetails[0].bank.accounts[j]
              });
              break;
            }
          }

          console.log(JSON.stringify(accountDetails));

          // making change into the 'customizedMinBalance' key of selected account of a bank
          if (accountDetails.length === 1) {
            userDebitAccountDetails.banks[bankDetails[0].index]
              .accounts[accountDetails[0].index]
              .customizedMinBalance = customizedMinBalance;

            var data = userDebitAccountDetails;
            console.log(JSON.stringify(data), 'data');

            // saving into the file
            if (data) {}
            console.log(JSON.stringify(data), 'modified data dupe');
            cb(null, 200, data);
          } else {
            err.statusCode = 401
            err.message = "Account not found"
            cb(err, null)
          }
        } else {
          err.statusCode = 401
          err.message = "Bank not found"
          cb(err, null)
        }
      });
    });
  }

  Accounts.remoteMethod(
    'getBalance', {
      http: {
        path: '/getBalance',
        verb: 'GET'
      },
      accepts: [{
        arg: 'req',
        type: 'object',
        http: {
          source: 'req'
        }
      }],
      returns: [{
          arg: 'status',
          type: 'number'
        },
        {
          arg: 'message',
          type: 'string'
        }
      ]
    }
  );

  Accounts.remoteMethod(
    'getDebitData', {
      http: {
        path: '/getDebitData',
        verb: 'GET'
      },
      accepts: [{
        arg: 'req',
        type: 'object',
        http: {
          source: 'req'
        }
      }],
      returns: [{
          arg: 'status',
          type: 'number'
        },
        {
          arg: 'message',
          type: 'string'
        }
      ]
    }
  );

  Accounts.remoteMethod(
    'getCreditData', {
      http: {
        path: '/getCreditData',
        verb: 'GET'
      },
      accepts: [{
        arg: 'req',
        type: 'object',
        http: {
          source: 'req'
        }
      }],
      returns: [{
          arg: 'status',
          type: 'number'
        },
        {
          arg: 'message',
          type: 'string'
        }
      ]
    }
  );

  Accounts.remoteMethod(
    'getMinCustomizedBalance', {
      http: {
        path: '/customizedbalance',
        verb: 'GET'
      },
      accepts: [{
        arg: 'req',
        type: 'object',
        http: {
          source: 'req'
        }
      }],
      returns: [{
          arg: 'status',
          type: 'number'
        },
        {
          arg: 'message',
          type: 'string'
        }
      ]
    }
  );


};
