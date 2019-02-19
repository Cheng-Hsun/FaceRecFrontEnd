const Clarifai = require('clarifai');

const app = new Clarifai.App({
 apiKey: '30f35acb36a94aa6ba3f1a15e9b68de7'
});

const handleApiCall = (req, res) => {
	app.models
		.predict(Clarifai.FACE_DETECT_MODEL, req.body.input) // 因為是 Async 不能用 .imageUrl 上面的setState 還沒跑完
		.then(data => {
			res.json(data);
		})
		.catch(err => res.status(400).json('unable to work with api'))
}

const handleImage = (req, res, db) => {
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
}

module.exports = {
	handleApiCall,
	handleImage
}