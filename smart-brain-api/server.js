const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const app = express()

app.use(bodyParser.json());
app.use(cors());

const database = {
	users: [
		{
			id: '123',
			name: 'John',
			email: 'john@gmail.com',
			password: 'cookies',
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
	console.log(req.body);
	if (req.body.email === database.users[0].email &&
		req.body.password === database.users[0].password) {
		res.json('success');
	} else {
		res.status(400).json('error logging in');
	}

})

// 可以用 req.params 讀id
app.get('/profile/:id', (req, res) => {
	const { id } = req.params;
	let found = false;
	database.users.forEach(user => {
		if (user.id === id) {
			found = true;
			return res.json(user);
		}
	})
	if (!found) {
		res.status(400).json('not found');
	}
})

app.post('/register', (req, res) => {
	const { email, name, password } = req.body;
	bcrypt.hash("bacon", null, null, function(err, hash) {
	    console.log(hash);

	});
	database.users.push({
		id: '125',
		name: name,
		email: email,
		password: password,
		entries: 0,
		joined: new Date() // create data by JS
	});

	// 一定要response才會結束
	res.json(database.users[database.users.length-1]);
})

app.put('/image', (req, res) => {
	const { id } = req.body;
	let found = false;
	database.users.forEach(user => {
		if (user.id === id) {
			found = true;
			user.entries++;
			return res.json(user.entries);
		}
	})
	if (!found) {
		res.status(404).json('not found');
	}
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