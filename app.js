const {log} = require ("console")
const express = require('express')
const app = express()
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser')
var cors = require('cors')
app.use(cors())

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
const url = "mongodb://localhost:27017/PARCIAL2";

const dbname="base de datos";

app.get('/', function (req, res) {
  res.send('servidor cargando...')
})

//busqueda total en la base de datos
app.get('/data', async function (req, res) {
  const client = new MongoClient(url);
  await client.connect();
   const collection = client.db().collection(dbname);
   const estimate = await collection.estimatedDocumentCount();
   const findResult = await collection.find({}).toArray();
   res.send(findResult);
   console.log(`numero de datos : ${estimate}`);
})

//filtrado
app.get('/data/reserva', async function (req, res) {
   const client = new MongoClient(url);
   await client.connect();
    const collection = client.db().collection(dbname);
    const filtros = await collection.find(  {estado:"sin reservar"}
    
    
 ).toArray();
    res.send(filtros);
 })


   //agregar 
app.post('/data/registro', async function (req, res) {
  const client = new MongoClient(url);
  await client.connect();
   const collection = client.db().collection(dbname);
   const insertResult = await collection.insertMany(req.body)
   if(insertResult){

      res.send({status : "Cliente ha recibido paquete"});
   }
   else{

    res.send({status : "error"});
   }
  })

//modificar
  app.put('/data/reserva/:id', async function (req, res) {
    const client = new MongoClient(url);
    await client.connect();
     const collection = client.db().collection(dbname);
     const updateResult = await collection.updateOne({ cod_envio: req.params.id }, { $set: {status:req.body} });
    
     if(updateResult){

      res.send({status : req.body.estado});
   }
   else{

    res.send({status : "error"});
   }
  })

  //eliminar

  /*
  app.delete('/data/reserva/:id', async function (req, res) {
    const client = new MongoClient(url);
    await client.connect();
     const collection = client.db().collection(dbname);
  const deleteResult = await collection.deleteOne({ inmueble: req.params.id });
  if(deleteResult){

    res.send({status :"BORRADO CON EXITO"});
 }
 else{

  res.send({status : "error"});
 }
})*/

app.get('/cedula', async function (req, res) {
   const client = new MongoClient(url);
   await client.connect();
    const collection = client.db().collection(dbname);
    const filteredDocs = await collection.find(  {$or: [
     {DNI_recepcion: req.body},
     {cod_envio: req.body},
 ]}).toArray();
    res.send(filteredDocs);
 })

MongoClient.connect(url, function(err, db) {

 if (err) throw err;

 console.log("Hay conexión!");
 app.listen(5000)
 db.close();
});