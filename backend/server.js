const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});


// Middleware
app.use(cors()); // Handling CORS
app.use(express.json()); // For parsing application/json

// Connect to MongoDB
mongoose.connect('mongodb+srv://enc2129:Este163420@cluster0.otyk3fe.mongodb.net/?retryWrites=true&w=majority');

// MongoDB Schema and Model
const noteSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Note = mongoose.model('Note', noteSchema);

// API Endpoints

// GET: Retrieve all notes
app.get('/notes', (req, res) => {
    Note.find({})
        .then(notes => {
            res.send(notes);
        })
        .catch(err => {
            res.status(500).send(err);
        });
});


// POST: Add a new note
app.post('/notes', (req, res) => {
    const newNote = new Note({
        title: req.body.title,
        content: req.body.content
    });

    newNote.save()
        .then(() => res.json({ message: 'Successfully added a new note.' }))
        .catch(err => res.status(500).json({ error: err.message }));
});



// DELETE: Delete a note
app.delete('/notes/:id', (req, res) => {
    Note.findOneAndDelete({ _id: req.params.id })
        .then(() => res.send('Note deleted successfully.'))
        .catch(err => res.status(500).send(err));
});


// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
