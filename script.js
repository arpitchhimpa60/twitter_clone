const express = require('express');
const app = express();
const PORT = 9000;
const path = require('path');
app.use(express.json());
app.use(express.urlencoded({extended: true}));
const session = require('express-session');
app.use(session({
    secret: 'my-secret-key',
    resave: false,
    saveUninitialized: false
}));
// ejs connection:
app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

// mongodb connection
const {connectToMongoDB} = require('./connection');
connectToMongoDB('mongodb://localhost:27017/twitter')
.then(()=> console.log("MongoDB connected successfully"))
.catch((err)=> console.log(err));

//routes:
const userRouter = require('./routes/user');
const staticRouter = require('./routes/staticRouter');
const postRouter = require('./routes/post');
const followRouter = require('./routes/follow');
app.use('/user' , userRouter);
app.use('/', staticRouter);
app.use('/post', postRouter);
app.use('/follow', followRouter);

app.listen(PORT,()=>{
    console.log("Server started at PORT: ", PORT)
})