//imports
import express from 'express';
import mongoose from 'mongoose';
import Schema from './dbMessages.js';
import Pusher from 'pusher';
import cors from 'cors';
import dotenv from 'dotenv';

//app configs
dotenv.config();
const app= express();
const port = process.env.PORT || 9000;


const pusher = new Pusher({
    appId:process.env.appId,
    key:process.env.key,
    secret:process.env.secret,
    cluster:process.env.cluster,
    useTLS:process.env.useTLS
  });


//middleware
app.use(express.json());
app.use(cors());

//DB config

const connection_url=`mongodb+srv://admin:${process.env.DB_admin_pass}@cluster0.bhhxn.mongodb.net/${process.env.DB_name}?retryWrites=true&w=majority`;
mongoose.connect(connection_url,{
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.set('useFindAndModify', false);
const db=mongoose.connection;
db.once('open',()=>{
    console.log("DB Connected");
});

const usersCollection=mongoose.model('users',mongoose.Schema({
    full_name: String,
    email: String,
    secret_code: String,
    friends: Array,
  }));

var Messages = mongoose.model('messagecontents',Schema);


const chatRender = (chatName) =>{
    Messages = mongoose.model(chatName,Schema);
    var msgCollection= db.collection(chatName);
    var changeStream=msgCollection.watch();

    changeStream.on('change',(change)=>{
        console.log("A change occured",change);

        if(change.operationType==='insert'){
            const messageDetails = change.fullDocument;
            pusher.trigger('messages','inserted',
            {
                name: messageDetails.name,
                message: messageDetails.message,
                timestamp:messageDetails.timestamp,
                received:messageDetails.received
            }
            );
        }else{
            console.log('error triggering pusher');
        }
    });
}



//api routes
app.post('/addUser',(req,res)=>{
    usersCollection.create(req.body,(err,data)=>{
        if(err){
            res.status(500).send(err)
        }else{
            res.status(201).send(data)
        }
    })
})


app.get('/messages/sync',(req,res)=>{
    Messages.find((err,data)=>{
        if(err){
            res.status(500).send(err);
        } else{
            res.status(200).send(data);
        }
    });
});

app.post('/messages/new',(req,res)=>{
    const dbMessage= req.body

    Messages.create(dbMessage,(err,data)=>{
        if(err){
            res.status(500).send(err)
        }else{
            res.status(201).send(data)
        }
    })
})

app.get('/getUser',(req,res)=>{
    usersCollection.find({secret_code:req.query.uid},(err,data)=>{
        if(err){
            res.status(500).send(err);
        } else{
            console.log(data)
            res.status(200).send(data);
        }
    });
})


app.post('/friend/new',(req,res)=>{
    const current = req.body.current_user;
    const frd = req.body.frd;
    const newChat = `${current.email}_${frd.email}_chats`;
    const arr1={name:frd.full_name,chat:newChat}
    const arr2={name:current.displayName,chat:newChat}

    var error="";
    var success="";

    usersCollection.findOneAndUpdate({secret_code:current.uid},
        {$push: {friends:arr1}},(err,data)=>{
            if(err){
                error="error updating";
            } else{
                success="Success updating";
            }
        })

    usersCollection.findOneAndUpdate({secret_code:frd.secret_code},
        {$push: {friends:arr2}},(err,data)=>{
            if(err){
                error="error updating";
            } else{
                success="Success updating";
            }
        })
        if(error=="error updating"){
            res.status(500).send(error);
        }else{
            res.status(200).send(success);
        }
    })


app.get('/chats',(req,res)=>{
    usersCollection.find({full_name:req.query.currentUser},(err,data)=>{
        if(err){
            res.status(500).send(err);
        } else{
            console.log(data)
            res.status(200).send(data);
        }
    });
})


app.post('/changeChat',(req,res)=>{
    Messages = mongoose.model(req.body.chat,Schema);
    Messages.find((err,data)=>{
        if(err){
            res.status(500).send(err);
        } else{
            chatRender(req.body.chat);
            res.status(200).send(data);
        }
    });
})


//listen
app.listen(port ,()=> console.log(`listening to port:${port}`));