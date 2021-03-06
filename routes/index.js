var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
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
  var item = {
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  };
  var id = req.body.id;
  mongo.connect(url, function (err, db) {
    assert.equal(null, err);
    // 1st arg identifies data, 2nd arg after $set specifies what the new data should be, replace any item with this id, with this item.
    db.collection('user-data').updateOne({"_id": objectId(id)}, {$set: item}, function (err, result) {
      assert.equal(null, err);
      console.log('Item updated');
      db.close();
    });
  });
});

router.post('/delete', function (req, res, next) {
  var id = req.body.id;
  mongo.connect(url, function (err, db) {
    assert.equal(null, err);
    db.collection('user-data').deleteOne({"_id": objectId(id)}, function (err, result) {
      assert.equal(null, err);
      console.log('Item deleted');
      db.close();
    });
  });
});

module.exports = router;
