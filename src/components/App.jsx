import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";

function App() {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState({ title: "", content: "" });
    console.log('Fetching notes from:', `${process.env.REACT_APP_API_URL}/notes`);
    fetch(`${process.env.REACT_APP_API_URL}/notes`)

    // Fetch notes from the backend when the component mounts
    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/notes`)
            .then(response => response.json())
            .then(data => setNotes(data))
            .catch(err => console.error('Error fetching notes:', err));
    }, []);

    // Add a new note
    const addNote = () => {
        if (newNote.title.trim() !== "" && newNote.content.trim() !== "") {
            fetch(`${process.env.REACT_APP_API_URL}/notes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newNote),
            })
                .then(response => response.json())
                .then(data => {
                    setNotes([...notes, { ...newNote, _id: data._id }]);
                    setNewNote({ title: "", content: "" }); // Reset form fields
                })
                .catch(err => console.error('Error adding note:', err));


        }
    };

    // Delete a note
    // Example of deleteNote function
    const deleteNote = (id) => {
        fetch(`${process.env.REACT_APP_API_URL}/notes/${id}`, {
            method: 'DELETE',
        })
            .then(() => {
                setNotes(notes.filter((note) => note._id !== id));
            })
            .catch(err => console.error('Error deleting note:', err));
    };


    // Handle input change
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewNote((prevNote) => ({ ...prevNote, [name]: value }));
    };

    return (
        <div>
            <Header />
            <div className="App">
                {notes.map((note) => (
                    <Note
                        key={note._id} // Assuming each note has a unique _id
                        id={note._id}
                        title={note.title}
                        content={note.content}
                        onDelete={deleteNote}
                    />
                ))}

            </div>

            <form className="form" onSubmit={(e) => e.preventDefault()}>
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={newNote.title}
                    onChange={handleInputChange}
                />
                <textarea
                    name="content"
                    placeholder="Take a note..."
                    rows="3"
                    value={newNote.content}
                    onChange={handleInputChange}
                />
                <button onClick={addNote}>Add Note</button>
            </form>
            <Footer />
        </div>
    );
}

export default App;
