const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const path = require('path');
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//database url
const url = '';
//Connecting our App with MongoDB using mongoose
const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
//Call the database model
const Diary = require('./models/Diary');


mongoose.connect(url, connectionParams).then(() => {
    console.log('MongoDB Connected');
}).catch(err => console.log(err));

//set templating egine as ejs 
app.set('view engine', 'ejs');

//seerving Static files
app.use(express.static('public'));

// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

//ROUTING

//route for /
app.get('/', (req, res) => {
    res.render('Home');
})
//route for about page
app.get('/about', (req, res) => {
    res.render('About');
})

//route for Diary page
app.get('/diary', (req, res) => {
    Diary.find().then((data) => {
        res.render('Diary', { data: data });
    }).catch(err => conaole.log(err))
})
//route for Adding page
app.get('/add', (req, res) => {
    res.render('Add');
})
//route for saving diary
app.post('/add-to-diary', (req, res) => {
    const Data = new Diary({
        title: req.body.title,
        description: req.body.description,
        date: req.body.date
    })

    //saving data in the database
    Data.save().then(() => {
        console.log("Data Saved");
        res.redirect('/diary');
    })
        .catch(err => console.log(err));
})

//route for Diary id
app.get('/diary/:id', (req, res) => {
    Diary.findOne({
        _id: req.params.id
    }).then(data => {
        res.render('Page', { data: data });
    })
        .catch(err => console.log(err));
})
//route for Diary Edit id
app.get('/diary/edit/:id', (req, res) => {
    Diary.findOne({
        _id: req.params.id
    }).then((data) => {
        res.render('Edit', { data: data });
    }).catch(err => console.log(err));
})

//route for saving diary
app.put('/diary/edit/:id', (req, res) => {
    Diary.findOne({
        _id: req.params.id
    }).then(data => {
        data.title = req.body.title,
        data.description = req.body.description,
        data.date = req.body.date

        data.save().then(() => {
            res.redirect('/diary');
        }).catch(err => console.log(err))
    }).catch(err => console.log(err));
})

//delete from database
app.delete('/diary/delete/:id', (req, res) => {
    Diary.deleteOne({ _id: req.params.id })
        .then(() => {
            res.redirect('/diary');
        })
        .catch(err => console.log(err));
});
//Create a server 
app.listen(3000, () => {
    console.log('server is running..')
})