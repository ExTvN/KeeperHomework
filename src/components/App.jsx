import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import notesData from "./notes";

function App() {
  const [notes, setNotes] = useState(notesData);
  const [newNote, setNewNote] = useState({ title: "", content: "" });

  const addNote = () => {
    if (newNote.title.trim() !== "" && newNote.content.trim() !== "") {
      const updatedNotes = [...notes, { ...newNote, key: notes.length + 1 }];
      setNotes(updatedNotes);
      setNewNote({ title: "", content: "" });
    }
  };

  const deleteNote = (id) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.key !== id));
  };

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
            key={note.key}
            id={note.key}
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
