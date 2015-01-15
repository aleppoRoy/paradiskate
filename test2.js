var application_root = __dirname,
    express = require("express"),
    path = require("path"),
    mongoose = require('mongoose');

var app = express();

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

// Config

app.configure(function () {
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(application_root, "public")));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});
var Schema = mongoose.Schema;  

var Product = new Schema({  
    title: { type: String, required: true },  
    description: { type: String, required: true },  
    style: { type: String, unique: true },  
    modified: { type: Date, default: Date.now }
});

var ProductModel = mongoose.model('Product', Product); 

var utilisateur = new Schema({  
    nom: { type: String, required: true },  
    email: { type: String, required: true },   
    modified: { type: Date, default: Date.now }
});

var utilisateurModel = mongoose.model('utilisateur', utilisateur);  
 
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
  res.send('Ecomm API is running');
});

// Launch server
var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

app.listen(server_port,server_ip_address);