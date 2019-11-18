const express = require("express");
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');  
const mongoose = require('mongoose');
const app = express();

// Map global  promise - get rid  of Warning

mongoose.Promise = global.Promise;

// connect To MongoDB

mongoose.connect('mongodb://localhost/idea-dev',  {
        useMongoClient: true
})

.then(() => 
    console.log('MongoDB Connected....... Yeh'))
.catch(err => console.log(err));


// Load Idea Model

        require('./models/Idea');
        const Idea = mongoose.model('ideas');


// Add Handlebars

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');


// Body Parser

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())



// How Middleware Work

app.use(function(req, res, next){
        console.log(Date.now());
        req.name = 'kaushal';
        next();
});


// Index Routing

app.get('/', (req, res) => {
        const title = 'IdeaBookMark'
        res.render('index', {title: title});
});

// About Routing

app.get('/about', (req, res) => {
        res.render('about')
});


app.get('/ideas', (req, res) => {
    Idea.find({})
    .sort({})
    .then(ideas => {
    res.render('ideas/index',   {
            ideas: ideas
    });
});
});
// Add Ideas Routes

app.get('/ideas/add', (req, res) => {
        res.render('ideas/add')
})

// Process Form Data

app.post('/ideas', (req, res) => {
            let errors = [];

            if(!req.body.title){
                errors.push({text: 'Please add a Title'});
            }
            if(!req.body.details){
                errors.push({text: 'Please add Some Details'});
            }

            if(errors.length > 0){
                res.render('ideas/add', {
                    errors: errors,
                    title: req.body.title,
                    details: req.body.details
                });
            } else{
               const newUser = {
                   title: req.body.title,
                   details: req.body.details
               }
               new Idea(newUser)
                .save()
                .then(idea => {
                    res.redirect('/ideas');
                })
            }
});

const port = "5000";

app.listen(port, () => {
        console.log('server started on port' + port);
});