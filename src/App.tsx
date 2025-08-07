// src/App.js
import { useEffect, useState } from "react";

type Note = {
  id: number;
  content: string;
  createdAt: string;
};

const API_URL = import.meta.env.VITE_API_BASE_URL

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const fetchNotes = async () => {
    try {
      const response = await fetch(`${API_URL}/notes`);
      const data = await response.json();
      setNotes(data);
    } catch (err) {
      console.error("Failed to fetch notes:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!content) {
      setError("Note content is required.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        const errData = await response.json();
        setError(errData.error || "Failed to add note.");
      } else {
        const newNote = await response.json();
        setNotes((prev) => [...prev, newNote]);
        setContent("");
      }
    } catch (err) {
      setError("Error posting note.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div style={{ width: "600px", margin: "auto", padding: "1rem" }}>
      <h1>Notes</h1>

      <form onSubmit={handleSubmit}>
        <textarea
          rows={4}
          cols={50}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note here..."
        />
        <br />
        <button type="submit">Add Note</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <hr />

      <ul>
        {notes.map((note) => (
          <li key={note.id}>
            <strong>{new Date(note.createdAt).toLocaleString()}</strong>
            <p>{note.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
