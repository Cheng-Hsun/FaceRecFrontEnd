const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')

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
	res.send(database.users);
})

app.post('/signin', (req, res) => {
	// we're just checking, so no need to use transaction
	db.select('email', 'hash').from('login')
		.where('email', '=', req.body.email)
		.then(data => {
			const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
			if (isValid) {
				return db.select('*').from('users')
					.where('email', '=', req.body.email)
					.then(user => {
						res.json(user[0])
					})
					.catch(err => res.status(400).json('unable to get user'))
			} else {
				res.status(400).json('wrong credentials')
			}
		})
		.catch(err => res.status(400).json('wrong credentials'))
	// console.log(req.body);
	// if (req.body.email === database.users[0].email &&
	// 	req.body.password === database.users[0].password) {
	// 	res.json(database.users[0]);
	// } else {
	// 	res.status(400).json('error logging in');
	// }
})

// 可以用 req.params 讀id
app.get('/profile/:id', (req, res) => {
	const { id } = req.params;
	db.select('*').from('users').where({id})
		.then(user => {
			if (user.length) {
				res.json(user[0]);
			} else {
				res.status(400).json('Not found')
			}
		})
		.catch(err => res.status(400).json('error getting user'))
	// database.users.forEach(user => {
	// 	if (user.id === id) {
	// 		found = true;
	// 		return res.json(user);
	// 	}
	// })
})

app.post('/register', (req, res) => {
	const { email, name, password } = req.body;
	const hash = bcrypt.hashSync(password);
		db.transaction(trx => {
			trx.insert({
				hash: hash,
				email: email
			})
			.into('login')
			.returning('email')
			.then(loginEmail => {
				return trx('users')
					.returning('*')
					.insert({
					email: loginEmail[0] ,
					name: name,
					joined: new Date()
					})
					.then(user => {
						res.json(user[0]);
					})
			})
			.then(trx.commit)
			.catch(trx.rollback)
		})
		.catch(err => res.status(400).json('unable to register'))

	// const { email, name, password } = req.body;
	// bcrypt.hash("bacon", null, null, function(err, hash) {
	//     console.log(hash);

	// });
	// database.users.push({
	// 	id: '125',
	// 	name: name,
	// 	email: email,
	// 	password: password,
	// 	entries: 0,
	// 	joined: new Date() // create data by JS
	// });

	// // 一定要response才會結束
	// res.json(database.users[database.users.length-1]);
})

app.put('/image', (req, res) => {
	const { id } = req.body;
	db('users').where('id', '=', id)
	.increment('entries', 1)
	.returning('entries')
	.then(entries => {
		res.json(entries[0]);
	})
	.catch(err => res.status(400).json('unable to get entries'))

	// let found = false;
	// database.users.forEach(user => {
	// 	if (user.id === id) {
	// 		found = true;
	// 		user.entries++;
	// 		return res.json(user.entries);
	// 	}
	// })
	// if (!found) {
	// 	res.status(404).json('not found');
	// }
})

app.listen(3001, () => { 
	console.log('app is running on port 3001')
})

/*
/signin --> POST = success/fail
// since password is secret we use post instead of get
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> res
*/