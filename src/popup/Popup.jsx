import React, { useState, useEffect } from "react";
import { getPrompts, savePrompts } from "../utils/storage";
import './popup.css';

export default function Popup() {
  const [prompts, setPrompts] = useState([]);
  const [newPrompt, setNewPrompt] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [saveMessageIndex, setSaveMessageIndex] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);

  useEffect(() => {
    getPrompts().then(prompts => {
      // Clean up all prompts to remove newlines
      const cleanedPrompts = prompts.map(p => p.replace(/\n+/g, ' ').trim());
      if (JSON.stringify(cleanedPrompts) !== JSON.stringify(prompts)) {
        savePrompts(cleanedPrompts);
      }
      setPrompts(cleanedPrompts);
    });
  }, []);

  const addPrompt = () => {
    if (newPrompt.trim()) {
      const updated = [...prompts, newPrompt];
      savePrompts(updated);
      setPrompts(updated);
      setNewPrompt("");
    }
  };

  const askDeletePrompt = (index) => {
    setDeleteIndex(index);
  };

  const confirmDeletePrompt = () => {
    if (deleteIndex !== null) {
      const updated = prompts.filter((_, i) => i !== deleteIndex);
      savePrompts(updated);
      setPrompts(updated);
      if (editingIndex === deleteIndex) {
        setEditingIndex(null);
        setEditingValue("");
      }
      setDeleteIndex(null);
    }
  };

  const cancelDeletePrompt = () => {
    setDeleteIndex(null);
  };

  const startEdit = (index) => {
    setEditingIndex(index);
    setEditingValue(prompts[index]);
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditingValue("");
  };

  const saveEdit = (index) => {
    const cleaned = editingValue.replace(/\n+/g, ' ').trim();
    if (cleaned) {
      const updated = prompts.map((p, i) => (i === index ? cleaned : p));
      savePrompts(updated);
      setPrompts(updated);
      setEditingIndex(null);
      setEditingValue("");
      setSaveMessageIndex(index);
      setTimeout(() => setSaveMessageIndex(null), 1200);
    }
  };

  // Copy prompt to clipboard and show message
  const copyPrompt = (text, index) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1200);
    });
  };

  return (
    <div className="popup-root">
      <div className="header">
        <h2>😄 Smart AI Prompts</h2>
        <p>Save, edit, and copy your favorite prompts with style!</p>
      </div>
      <div className="add-section">
        <input
          type="text"
          value={newPrompt}
          onChange={(e) => setNewPrompt(e.target.value)}
          placeholder="✍️ Add your prompt..."
        />
        <button onClick={addPrompt} disabled={!newPrompt.trim()}>
          ➕ Add Prompt
        </button>
      </div>
      <div className="prompt-list">
        {prompts.map((p, i) => (
          <div key={i} className="prompt-card">
            {editingIndex === i ? (
              <>
                <textarea
                  value={editingValue}
                  onChange={e => setEditingValue(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                    }
                  }}
                  autoFocus
                />
                <div className="prompt-actions">
                  <button onClick={() => saveEdit(i)} title="Save changes">💾</button>
                  <button onClick={cancelEdit} title="Cancel edit">✖️</button>
                </div>
              </>
            ) : (
              <>
                <span className="prompt-text">
                  {p}
                </span>
                <div className="prompt-actions">
                  <button className="trash-btn" onClick={() => askDeletePrompt(i)} title="Delete">🗑️</button>
                  <button className="trash-btn" style={{ marginLeft: 4 }} onClick={() => startEdit(i)} title="Edit">✏️</button>
                  <button className="trash-btn" style={{ marginLeft: 4 }} onClick={() => copyPrompt(p, i)} title="Copy">📋 Copy</button>
                  {copiedIndex === i && (
                    <span className="feedback">Copied!</span>
                  )}
                  {saveMessageIndex === i && (
                    <span className="feedback">Changes saved!</span>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      {/* Cute Delete Confirmation Modal */}
      {deleteIndex !== null && (
        <div className="cute-modal-overlay">
          <div className="cute-modal">
            <div>🗑️ Are you sure you want to delete this prompt?</div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className="trash-btn" style={{ background: '#ffd700', color: '#232526', fontWeight: 'bold' }} onClick={confirmDeletePrompt}>Yes</button>
              <button className="trash-btn" style={{ background: '#eee', color: '#232526' }} onClick={cancelDeletePrompt}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}