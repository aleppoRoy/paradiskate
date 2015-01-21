var application_root = __dirname,
    express = require("express"),
    path = require("path"),
    mongoose = require('mongoose');
var fs      = require('fs');
var Grid    = require('gridfs-stream');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Database
var connection_string = 'mongodb://localhost/mydb';
if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
  connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
  process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
  process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
  process.env.OPENSHIFT_APP_NAME;
}
mongoose.connect(connection_string);
var db = mongoose.connection.db;
var gfs = Grid(db, mongoose.mongo);
// Config

app.configure(function () {
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({secret: '1234567890QWERTY'}));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(application_root, "public")));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

//models
var Schema = mongoose.Schema;  

var Product = new Schema({  
    title: { type: String},  
    description: { type: String},  
    style: { type: String},  
    modified: { type: Date, default: Date.now }
});

var ProductModel = mongoose.model('Product', Product); 

var utilisateur = new Schema({  
    nom: { type: String},  
    email: { type: String},
	ip:{ type:String},
	nbvisite: { type: Number},	
    modified: { type: Date, default: Date.now }
});

var utilisateurModel = mongoose.model('utilisateur', utilisateur);  
//routing
app.post('/upload', function(req, res) {
   var tempfile    = req.files.userPhoto.path;
    var origname    = req.files.userPhoto.name;
	console.log(JSON.stringify(req.files));
    var writestream = gfs.createWriteStream({ filename: origname });
    // open a stream to the temporary file created by Express...
    fs.createReadStream(tempfile)
      .on('end', function() {
        res.send('OK');
      })
      .on('error', function() {
        res.send('ERR');
      })
      // and pipe it to gfs
      .pipe(writestream);
});

app.get('/download', function(req, res) {
    // TODO: set proper mime type + filename, handle errors, etc...
    gfs
      // create a read stream from gfs...
      .createReadStream({ filename: req.param('filename') })
      // and pipe it to Express' response
      .pipe(res);
});
 
app.get('/api/products', function (req, res){
  return ProductModel.find(function (err, products) {
    if (!err) {
      return res.send(products);
    } else {
      return console.log(err);
    }
  });
});
app.get('/api/utilisateurs', function (req, res){
  return utilisateurModel.find(function (err, utilisateurs) {
    if (!err) {
      return res.send(utilisateurs);
    } else {
      return console.log(err);
    }
  });
});
app.post('/api/products', function (req, res){
  var product;
  console.log("POST: ");
  console.log(req.body);
  product = new ProductModel({
    title: req.body.title,
    description: req.body.description,
    style: req.body.style,
  });
  product.save(function (err) {
    if (!err) {
      return console.log("created");
    } else {
      return console.log(err);
    }
  });
  return res.send(product);
});
app.post('/api/utilisateurs', function (req, res){
  var utilisateur;
  console.log("POST: ");
  console.log(req.body);
  utilisateur = new utilisateurModel({
    nom: req.body.nom,
    email: req.body.email,
  });
  utilisateur.save(function (err) {
    if (!err) {
      return console.log("created");
    } else {
      return console.log(err);
    }
  });
  return res.send(utilisateur);
});

app.get('/api', function (req, res) {
req.session.lastPage = '/api';
  res.send('Ecomm API is running');
});

// Launch server

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
io.on('connection', function(socket){
	var address = socket.request.socket.remoteAddress;;
	var user;
	console.log('voici les cookies que je peux voir:' + cookies);
  	console.log('a user connected from '+address);
	user = new utilisateurModel({"nbvisite":1,"ip":address});
	user.save(function (err) {
		if (!err) {
		  return console.log("created");
		} else {
		  return console.log(err);
		}
	});
	var cookies = JSON.stringify(socket.handshake.headers);
   	socket.on('disconnect', function(){
    		console.log('user disconnected');
  	});
  	socket.on('registration', function(produit){
	  	var product;
	  	product = new ProductModel(produit);
	  	product.save(function (err) {
			if (!err) {
			  return console.log("created");
			} else {
			  return console.log(err);
			}
	  	});
		io.emit('registration', produit);
  	});
});
http.listen(server_port,server_ip_address,function(){
  console.log('listening on' + server_port);
});
