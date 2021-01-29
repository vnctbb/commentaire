const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient
const session = require('express-session');

const PORT = process.env.PORT || 3000;

let datas = {};

const urlDb = 'mongodb+srv://admin:admin@diwjs14.hyd9w.mongodb.net/test?authSource=admin&replicaSet=atlas-636i74-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true';
const nameDb = 'blogito';
const nameCollectionCom = 'coms';
const nameCollectionUser = 'user';

const bodyParser = require('body-parser')
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
  extended : false
}));

app.use('/src', express.static(__dirname + '/public'));

app.use(session({
  secret:'123456789SECRET',
  saveUninitialized : true,
  resave: false
}));

app.use((req,res,next) => {
  datas = app.locals;
  app.locals = {};
  datas.session = req.session;
  next();
});

app.get('/', (req, res) => {
  if(req.session.username){
    res.sendFile(__dirname + '/pages/index.html');
  } else {
    res.sendFile(__dirname + '/pages/connexion.html');
  }
})

app.post('/connexion', (req, res) => {
  MongoClient.connect(urlDb, {useUnifiedTopology : true}, (err, client) => {
    const collection = client.db(nameDb).collection(nameCollectionUser);
    collection.find({username : req.body.username, password : req.body.password}).toArray((err, data) => {
      if(data.length){
        req.session.username = req.body.username;
        res.redirect('/');
      } else {
        res.sendFile(__dirname + '/pages/connexion.html');
      }
    }) 
  })
});

app.get('/deconnexion', (req, res) => {
  if(req.session.username){
    req.session.destroy(err => {
      res.redirect('/');
    })
  }
});

app.get('/requete-initial-com', (req, res) => {
  MongoClient.connect(urlDb, {useUnifiedTopology : true}, (err, client) => {
    if (err) throw err;
    const collection = client.db(nameDb).collection(nameCollectionCom);
    collection.find().sort({timestamp : -1}).toArray((err, data) => {
      res.send(data);
    });
  });
});

app.post('/post-coms', (req, res) => {
  MongoClient.connect(urlDb, {useUnifiedTopology : true}, (err, client) => {
    if (err) throw err;
    const collection = client.db(nameDb).collection(nameCollectionCom);
    collection.insertOne(req.body, (err, res) => {
      if(err) throw err;
      console.log('1 com inserted');
    });
    collection.find().sort({timestamp : -1}).toArray((err, data) => {
      res.send(data);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Our app is running on port ${ PORT }`);
});