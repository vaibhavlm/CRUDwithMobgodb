const express = require('express')
const app = express()
const mongodb = require('mongodb')
const bodyparser = require('body-parser')
const errorhandler = require('errorhandler')
const Mongoclient = mongodb.MongoClient

const url = 'mongodb://localhost:27017'
const dbName = "edx-course-db"
app.use(bodyparser.json())

Mongoclient.connect(url,{ useUnifiedTopology: true }, (error,client)=>{
 const db = client.db(dbName)
 if(error) return process.exit(1)
 console.log('Connection okay')


app.get('/accounts',(req,res,next)=>{
  db.collection(process.argv[2]).find({},{sort: {_id: -1}}).toArray((error,accounts)=>{
      if(error) return next(error)
      res.send(accounts)
  })
})

app.get('/accounts/:id',(req,res,next)=>{
    db.collection(process.argv[2]).find({_id: mongodb.ObjectID(req.params.id)},{sort: {_id: -1}}).toArray((error,accounts)=>{
        if(error) return next(error)
        res.send(accounts)
    })
  })
  

app.post('/accounts', (req,res,next)=>{
    var newAccount = req.body
    db.collection(process.argv[2]).insertOne(newAccount, (error,results)=>{
        if(error) return next(error)
        res.send(results.results)
    })
})

app.put('/accounts/:id', (req, res, next)=>{
    db.collection(process.argv[2]).upadateOne({_id: mongodb.ObjectID(req.params.id)},
    {$set: req.body},{upsert: true}, (error, results)=>{
        if(error) return next(error)
        res.send(results)
    })
})

app.delete('/accounts/:id', (req, res, next)=>{
    db.collection(process.argv[2]).remove({_id: mongodb.ObjectID(req.params.id)},
    (error, results)=>{
        if(error) return next(error)
        res.send(results)
    })
})


app.use(errorhandler())
app.listen(3000) 

})