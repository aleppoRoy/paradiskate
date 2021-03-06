var application_root = __dirname,
    express = require("express"),
    path = require("path"),
    mongoose = require('mongoose');
var request = require('request');
var fs      = require('fs');
var Grid    = require('gridfs-stream');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var MongoStore = require('connect-mongo')(express);

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
  app.use(express.cookieParser('coucouille'));
  app.use(express.session({
  	  store: new MongoStore({
  	  	url: connection_string
	 }),
  	secret: '1234567890QWERTY'}));
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
	temps:{ type: Date, default: Date.now },
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
  
var cible =new Schema({  
    latitude: { type: Number},  
    longitude: { type: Number},
	nbplanche:{ type:Number},
	email: {type: String},	
	heure:{type: Date},	
    modified: { type: Date, default: Date.now }
});

var cibleModel = mongoose.model('cible', cible);  
//routing
app.get('/', function(req, res){
	console.log(req.ip);
	user = new utilisateurModel({"nbvisite":1,"ip":req.ip});
	user.save(function (err) {
		if (!err) {
		  return console.log("created");
		} else {
		  return console.log(err);
		}
	});
	console.log('cookies',req.cookies);
	req.session.lastPage = '/';
	var minute = 60 * 1000000;
	if(req.cookies.foot==1){
	res.cookie('skateboard', 1, { maxAge: minute });
		res.send('toi tu as ete sur ce site');	
	} else {
	res.redirect('/index.html');
	}
});

app.get('/forget', function(req, res){
  res.clearCookie('remember');
  res.redirect('back');
});

app.post('/', function(req, res){
  var minute = 60 * 1000;
  if (req.body.remember){
  res.cookie('remember', 1, { maxAge: minute });
  res.redirect('back');
  }
});
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
app.get('/test/:filename', function(req, res){
	//res.send({"title":"dede"});
	req.params.filename
	var chunks=[];
	console.log(req.params.filename);
	gfs.createReadStream({ filename:req.params.filename})
		  // and pipe it to Express' response
		  .on('data', function(data){
		  chunks.push(data);
		  })
		  .on("end",function(){
		  var fbuf = Buffer.concat(chunks);
			res.set('Content-Type', 'text/html');
			var base64 = (fbuf.toString('base64'));
			res.send(base64);
		  })
});
app.get('/test', function(req, res){
	res.send({'data':req.user});
});
app.get('/mesimages', function(req, res){
	gfs.files.find().toArray(function (err, files) {
    res.send(files);
  })
});
app.get('/download', function(req, res) {
    // TODO: set proper mime type + filename, handle errors, etc...    
	gfs.createReadStream({ filename:"IMGP8043.JPG"})
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
app.post('/api/cibles', function (req, res){
  var cible;
  cible = new cibleModel({
    latitude: req.body.latitude,  
    longitude:req.body.longitude,
	nbplanche:req.body.nbplanche,
	email: req.body.email,	
	heure:req.body.heure
  });
  cible.save(function (err) {
    if (!err) {
      return console.log("created");
    } else {
      return console.log(err);
    }
  });
  return res.send(utilisateur);
});

app.get('/api', function (req, res) {
console.log(req.session);
console.log(req.cookies);
var minute = 60 * 1000000;
res.cookie('foot', 1, { maxAge: minute });
req.session.lastPage = '/api';
	var stream=utilisateurModel.find().stream({transform: JSON.stringify}).pipe(res);
	/*stream.on('data', function (doc) {
	console.log(doc);
		res.send(doc);
	  //res.send(doc);
	  //res.end();
	})
	stream.on('error', function (err) {
		//res.write(err);
	  // handle err
	})
	stream.on('close', function () {
	  // all done
	  res.end();
	})*/
var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;

  //res.send('Ecomm API is running');
}); 
// Launch server

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
io.on('connection', function(socket){
	var address = socket.request.socket.remoteAddress;;
	var user;
	var cookies = JSON.stringify(socket.handshake.headers.cookie);
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
		var stream=utilisateurModel.find().stream();
			stream.on('data', function (doc) {
			  io.emit('les autres',doc);
			})
			stream.on('error', function (err) {
			  // handle err
			})
			stream.on('close', function () {
			  // all done
			})
		io.emit('registration', produit);
		var stream=gfs.createReadStream({ filename:"IMGP8043.JPG"});
		stream.on('data',function(doc){
		io.emit('pub', JSON.stringify(doc));
		});
  	});
});
http.listen(server_port,server_ip_address,function(){
  console.log('listening on' + server_port);
});
