const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'cheng-hsunyang',
    password : '',
    database : 'smart-brain'
  }
}); 

// db.select('*').from('users').then(data => {
// 	// it's not sending through http
// 	console.log(data);
// });

const app = express()

app.use(bodyParser.json());
app.use(cors());

const database = {
	users: [
		{
			id: '123',
			name: 'John',
			email: 'john@gmail.com',
			password: 'c',
			entries: 0,
			joined: new Date() // create data by JS
		},
		{
			id: '124',
			name: 'Sally',
			email: 'sally@gmail.com',
			password: 'bananas',
			entries: 0,
			joined: new Date() // create data by JS
		}
	],
	login: [
		{
			id: '987',
			hash: '',
			email: 'john@gmail.com'
		}
	]
}

app.get('/', (req, res) => {
	res.send('it is working!');
})

app.post('/signin', signin.handleSignin(db, bcrypt))

// 可以用 req.params 讀id
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db)})

app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })

app.put('/image', (req, res) => { image.handleImage(req, res, db) })

app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) })


app.listen(process.env.PORT || 3001, () => { 
	console.log(`app is running on port ${process.env.PORT}`)
})

/*
/signin --> POST = success/fail
// since password is secret we use post instead of get
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> res
*/