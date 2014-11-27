// Retrieve
var express = require('express');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var BSON = mongodb.BSONPure;
var http = require('http');
var bodyParser = require('body-parser')
var path = require('path');
var sessionManager = require('./node_modules/session-manager/session-manager.js');
var session; 

// Best to use one shared session manager across requests
var sessionManager = sessionManager.create({engine: 'file', directory: __dirname + '/node_modules/session-manager/.session_data'});

var app = express();
app.set('views', __dirname + '/views/index.html'); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'views'))); 

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/views/index.html');

});

console.log("asasasas12121212");


// Connect to the db
MongoClient.connect("mongodb://localhost:27017/exampleDb", function(err, db) {
  if(!err) {
    console.log("We are connected at 8000 port");
	
	var collection = db.collection('test');
	var credientialsCollection = db.collection('credientials');
	console.log("We are createCollection");
		
	var doc1 = {"hello": "doc1"};
	var doc2 = {"hello": "doc2"};
	var lotsOfDocs = [{'hello':'doc3'}, {'hello':'doc4'}];

	var setdbDummyData = function()
	{
		//insert/update/remove/query 	
		collection.insert(doc1, {w:1}, function(err1, result) {
			if(!err1)
			{
				collection.insert(doc2, {w:1}, function(err2, result) {
					if(!err2)
					{
						collection.insert(lotsOfDocs, {w:1}, function(err3, result) {
							//collection.update({$set:{doc1: {"hello":"1212"}}}, {w:1}, function(err, result) {});
							var docs = [{mykey:1}, {mykey:2}, {mykey:3}];

							collection.insert(docs, {w:1}, function(err4, result) {
								//collection.remove({mykey:1}, {w:1}, function(err, result) {});
							});
						});
					}
				});
			}
		});
	}
	
	// get all user
	app.get('/dummyAjax', function (req, res){
		//client.collection('user', function(err, collection) {
		collection.find().toArray(function(err, items) {
		  //console.log(items);
		  res.send(items);
		});
	  //});
	});
	
	// get requested db data 
	app.get('/queryAjax', function (req, res){

		//client.collection('user', function(err, collection) {
		collection.findOne({mykey:1}, function(err, item) {
		  //console.log(items);
		  res.send(item);
		});
	  //});
	});

	//setSessionManeger
	app.post('/setSessionManeger', function(req, res){
		session = sessionManager.start(req, res);
	    session.set('count', (session.get('count') || 0) + 1); 
	   	session.set('loginTrue', (session.get('loginTrue') || " ~ ")); 
    	
    	var usrNm = session.get('loginTrue').split("~")[0]; 
    	var pswrd = session.get('loginTrue').split("~")[1]; 
    	credientialsCollection.findOne({userName:usrNm}, function(err, result){
			try{
				if(result.password == pswrd)
				{
					res.send({status:true, name: result.name}); 
				}
				else
				{
					res.send({status:false});
				}
			}
			catch(e){
				res.send({status:false});
			}

		});	

	});

	//setLogoutDetails
	app.post('/setLogoutDetails', function(req, res){
		session.set('loginTrue', " ~ ");
		res.send({status:true});
	});

	//setLoginDetails
	app.post('/setLoginDetails', function(req, res){
		var docs = [{name:req.body.name, userName:req.body.username, password:req.body.password, shareContent: "", shareImg: ""}];
		credientialsCollection.insert(docs, {w:1}, function(err, result) {			
			res.send({status:true});
		});
	});

	//getTravShareDetails
	app.get('/getTravShareDetails', function(req, res){
		var usrNm = session.get('loginTrue').split("~")[0]; 
    	var pswrd = session.get('loginTrue').split("~")[1]; 
    	credientialsCollection.findOne({userName:usrNm}, function(err, result){
			try{
				if(result.password == pswrd)
				{
					
					res.send({status:true, share: result.shareContent, shareImg: result.shareImg}); 
				}
				else
				{
					res.send({status:false});
				}
			}
			catch(e){
				res.send({status:false});
			}

		});	

		
	});

	//setTravShareDetails
	app.post('/setTravShareDetails', function(req, res){
		var usrNm = session.get('loginTrue').split("~")[0]; 
    	var pswrd = session.get('loginTrue').split("~")[1]; 
    	credientialsCollection.findOne({userName:usrNm}, function(err, result){
			try{
				if(result.password == pswrd)
				{
					credientialsCollection.update(result, {$set:{shareContent:req.body.name, shareImg: req.body.img}}, {w:1}, function(err1, result1) {
						res.send({status:true});
					});
				}
				else
				{
					res.send({status:false});
				}
			}
			catch(e){
				res.send({status:false});
			}

		});	

		
	});

	//validateLoginDetails
	app.post('/validateLoginDetails', function(req, res){
		var docs = [{userName:req.body.username, password:req.body.password}];
		//console.log(credientialsCollection.find({userName:req.body.username}).forEach);
		credientialsCollection.findOne({userName:req.body.username}, function(err, result){
			try{
				if(result.password == req.body.password)
				{
					session.set('loginTrue', req.body.username+"~"+req.body.password); 
					res.send({status:true, name: result.name}); 
				}
				else
				{
					res.send({status:false});
				}
			}
			catch(e){
				res.send({status:false});
			}			
		});
	});

	// post user registeration
	app.post('/dummyAjax', function (req, res){
	  	var getaccount = req.body; 
	  	var id = getaccount.id; 
	  	/*console.log(req.body.name); 
	  	for(i in getaccount)
	  	{
	  		console.log(i+"  ::  "+getaccount[i]);
	  	}
		collection.update({'_id':new BSON.ObjectID(id)},[],{ $pull: {hello: getaccount.hello } }, {new:true,safe:true}, function(err, result2) {
            if (err) {
                console.log('Error updating wine: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result2 + ' dsk(s) updated');
                console.log(result2);
                res.send(result2);
            }
        });*/
	    collection.update({mykey:1}, {$set:{newVal:req.body.name}}, {w:1}, function(err, result) {});

	});

	// delete data 
	app.delete('/dummyAjax', function (req, res){
		console.log("Deleting all db data !! ");
		collection.remove(function(err, result) {});		
	});

	app.post('/setDummyData', function (req, res){
		setdbDummyData();
	});
  }
  else
  {
	console.log("pls start mongo DB");
  }
  
});

var server = http.createServer(app)

server.listen(8000);
