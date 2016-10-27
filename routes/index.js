var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var assert = require('assert');

var url = 'mongodb://localhost:27017/test'; //Default mongo port, and default(provided) db

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Cool, huh!', condition: true, anyArray: [1,2,3] });
});

router.get('/get-data', function (req, res, next) {
  var resultArray = [];
  mongo.connect(url, function (err, db) {
    assert.equal(null, err);
    // Cursor pointing to the data we are getting back
    var cursor = db.collection('user-data').find(); // Find gets all the entries in this collection
    // All these pointers to these entries are stored in cursor
    cursor.forEach(function (doc, err) {
      assert.equal(null, err);
      resultArray.push(doc);
    }, function () {
      db.close();
      res.render('index', {items: resultArray});
    });
  });
});

router.post('/insert', function (req, res, next) {
  var item = {
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  };

  // To actually insert something
  mongo.connect(url, function (err, db) {
    assert.equal(null, err);
    db.collection('user-data').insertOne(item, function (err, result) {
      assert.equal(null, err);
      console.log('Item inserted');
      db.close();
    });
  });
  res.redirect('/');

});

router.post('/update', function (req, res, next) {

});

router.post('/delete', function (req, res, next) {

});

module.exports = router;
