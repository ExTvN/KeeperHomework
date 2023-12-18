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

    // Rest of your code...

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
