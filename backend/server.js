const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');

const app = express();

// Middleware
const corsOptions = {
    origin: 'https://keeper-homework-9bs9.vercel.app/',
};

app.use(cors(corsOptions)); // Handling CORS
app.use(express.json()); // For parsing application/json

// Connect to MongoDB
mongoose.connect('mongodb+srv://enc2129:Este163420@cluster0.otyk3fe.mongodb.net/?retryWrites=true&w=majority');

// MongoDB Schema and Model
const noteSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Note = mongoose.model('Note', noteSchema);

// Create a function to find an available port
function findAvailablePort(startPort, callback) {
    const server = http.createServer();
    server.listen(startPort, () => {
        const port = server.address().port;
        server.close(() => {
            callback(port);
        });
    });
    server.on('error', () => {
        // If the port is already in use, try the next one
        findAvailablePort(startPort + 1, callback);
    });
}

// Specify a starting port (e.g., 3000) or use 3000 as a default if none is available
const startPort = process.env.PORT || 3000;

// Find an available port and start the server
findAvailablePort(startPort, (port) => {
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

    // Start the server on the dynamically found port
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
});
