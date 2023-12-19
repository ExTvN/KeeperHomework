import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";

function App() {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState({ title: "", content: "" });
    const [isLoading, setIsLoading] = useState(true);

    // Fetch notes from the backend when the component mounts
    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/notes`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setNotes(data);
                setIsLoading(false); // Data has been loaded
            })
            .catch(err => {
                console.error('Error fetching notes:', err);
                setIsLoading(false); // Data loading failed
            });
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
                    // Update the client-side state with the newly created note's _id
                    setNotes([...notes, { ...newNote, _id: data._id }]);
                    setNewNote({ title: "", content: "" }); // Reset form fields
                })
                .catch(err => console.error('Error adding note:', err));
        }
    };

    // Delete a note
    const deleteNote = (id) => {
        fetch(`${process.env.REACT_APP_API_URL}/notes/${_id}`, {
            method: 'DELETE',
        })
            .then(() => {
                // Remove the deleted note from the client-side state
                setNotes(notes.filter((note) => note._id !== _id));
            })
            .catch(err => console.error('Error deleting note:', err));
    };



    return (
        <div>
            <Header />
            <div className="App">
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    notes.map((note) => (
                        <Note
                            key={note._id}
                            id={note._id}
                            title={note.title}
                            content={note.content}
                            onDelete={deleteNote}
                        />
                    ))
                )}
            </div>

            <form className="form" onSubmit={(e) => e.preventDefault()}>
                {/* Rest of your form */}
            </form>
            <Footer />
        </div>
    );
}

export default App;
