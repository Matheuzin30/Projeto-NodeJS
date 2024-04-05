const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const path = require('path');
const db = require('./db/connection');
const { Sequelize, Op } = require('sequelize');
const Job = require('./models/Job');

const PORT = 5001;

app.listen(PORT, function() {
    console.log(`Console rodando na porta ${PORT}`);
});

// body parser
app.use(express.urlencoded({ extended: false }));

// handlebars
app.set('views', path.join(__dirname,'views'));
app.engine('handlebars', exphbs.engine({defaultLayouts: 'main'}));
app.set('view engine', 'handlebars');

// static folder
app.use(express.static(path.join(__dirname, 'public')));

// db connection
db
    .authenticate()
    .then(() => {
        console.log("Conectou ao banco com sucesso");
    })
    .catch(err => {
        console.log("Ocorreu um erro ao conectar", err);
    });

// rotas
app.get('/', (req, res) => {
    let search = req.query.job;
    let query = '%'+search+'%';

    if(!search) {
        Job.findAll({order: [
            ['createdAt', 'DESC']
        ]})
        .then(jobs => {
            res.render('index', {
                jobs: jobs
            });
        })
        .catch(err => console.log(err));
    } else {
        Job.findAll({
            where: {title: {[Op.like]: query}},
            order: [
                ['createdAt', 'DESC']
            ]
        })
        .then(jobs => {
            res.render('index', {
                jobs: jobs,
                search: search
            });
        })
        .catch(err => console.log(err));
    }
});

// jobs routes
app.use('/jobs', require('./routes/jobs'));