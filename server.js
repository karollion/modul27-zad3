// Imports
const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');
const multer = require('multer')

const app = express();

// To upload file on server
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'public/uploads')
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname)
	},
})
const upload = multer({ storage: storage })

// Integrate handblades
app.engine('.hbs', hbs());
app.set('view engine', '.hbs');

// middleware for form (send-message)
app.use(express.urlencoded({ extended: false }));   // x-www-form-urlencoded
app.use(express.json());    // form-data JSON format

// Middleware to files

app.use(express.static(path.join(__dirname, '/public')));

// Endpoints to pages

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

// reading the body sent by the user and returning it in JSON format
app.post('/contact/send-message', upload.single('design'), (req, res) => {
	const { author, sender, title, message } = req.body
	const design = req.file

	if (author && sender && title && design && message) {
		res.render('contact', { isSent: true, image: design.filename })
	} else {
		res.render('contact', { isError: true })
	}
})

app.get('/info', (req, res) => {
  res.render('info', { layout: 'dark' });
});

app.get('/history', (req, res) => {
  res.render('history');
});

//transfer of information witch handblades
app.get('/hello/:name', (req, res) => {
  res.render('hello', {name: req.params.name });
});

// Middleware for no endpoint
app.use((req, res) => {
  res.status(404).send('404 not found...');
})

app.listen(3000, () => {
  console.log('Server is running on port: 3000');
});