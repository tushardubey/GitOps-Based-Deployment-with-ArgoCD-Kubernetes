import React, { useState, useEffect } from 'react';
import './NotesApp.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Tagify from '@yaireo/tagify';
import '@yaireo/tagify/dist/tagify.css';

function NotesApp() {
    const [notes, setNotes] = useState(() => {
        const savedNotes = localStorage.getItem('notes');
        if (savedNotes) {
            return JSON.parse(savedNotes);
        } else {
            return [];
        }
    });
    const [showPopup, setShowPopup] = useState(false);
    const [newNoteTitle, setNewNoteTitle] = useState('');
    const [newNoteText, setNewNoteText] = useState('');
    const [selectedNote, setSelectedNote] = useState(null);
    const [newNoteTags, setNewNoteTags] = useState([]);
    const [newNoteColor, setNewNoteColor] = useState('#ffffff');

    useEffect(() => {
        localStorage.setItem('notes', JSON.stringify(notes));
    }, [notes]);

    const handleAddNoteClick = () => {
        setShowPopup(true);
        setNewNoteTitle('');
        setNewNoteText('');
        setNewNoteTags([]);
        setNewNoteColor('#ffffff');
        setSelectedNote(null);
    };

    const handleSaveNote = () => {
        if (newNoteTitle.trim() !== '') {
            if (selectedNote) {
                setNotes(notes.map(note =>
                    note.id === selectedNote.id
                        ? { ...note, title: newNoteTitle, text: newNoteText, tags: newNoteTags.map((tag) => tag.value), color: newNoteColor }
                        : note
                ));
            } else {
                setNotes([
                    ...notes,
                    {
                        title: newNoteTitle,
                        text: newNoteText,
                        id: Date.now(),
                        tags: newNoteTags.map((tag) => tag.value),
                        color: newNoteColor,
                    },
                ]);
            }
            setShowPopup(false);
            setSelectedNote(null);
        }
    };

    const handleNoteTitleClick = (note) => {
        setSelectedNote(note);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        setSelectedNote(null);
    };

    const onDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(notes);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setNotes(items);
    };

    useEffect(() => {
        if (showPopup) {
            const input = document.querySelector('.popup-tags input');
            if (input) {
                const tagify = new Tagify(input, {
                    whitelist: [],
                    dropdown: {
                        enabled: 0,
                    },
                });
                tagify.on('change', (e) => {
                    setNewNoteTags(e.detail.tagify.value);
                });
            }
        }
    }, [showPopup]);

    const handleDeleteNote = (noteId) => {
        setNotes(notes.filter(note => note.id !== noteId));
    };

    const handleEditNote = (note) => {
        setShowPopup(true);
        setNewNoteTitle(note.title);
        setNewNoteText(note.text);
        setNewNoteTags(note.tags.map(tag => ({ value: tag })));
        setNewNoteColor(note.color);
        setSelectedNote(note);
    };

    const handleColorChange = (color) => {
        setNewNoteColor(color);
    };

    const colorOptions = [
        '#e0b0ff',
        '#a0c4ff',
        '#90ee90',
        '#ffffe0',
        '#ffdab9',
        '#f08080',
    ];

    return (
        <div className="notes-app">
            <h1>MY NOTESS</h1>
            <button onClick={handleAddNoteClick} className="add-note-button">
                Add Notes
            </button>

            {showPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <h2>{selectedNote ? 'Edit Note' : 'Add New Note'}</h2>
                        <input
                            type="text"
                            placeholder="Title"
                            value={newNoteTitle}
                            onChange={(e) => setNewNoteTitle(e.target.value)}
                            className="popup-input"
                        />
                        <ReactQuill
                            value={newNoteText}
                            onChange={setNewNoteText}
                            className="popup-quill"
                        />
                        <div className="popup-tags">
                            <input placeholder="Enter tags" defaultValue={newNoteTags.map((tag) => tag.value).join(', ')} />
                        </div>
                        <div className="color-options">
                            {colorOptions.map((color) => (
                                <button
                                    key={color}
                                    className="color-option"
                                    style={{ backgroundColor: color }}
                                    onClick={() => handleColorChange(color)}
                                />
                            ))}
                        </div>
                        <button onClick={handleSaveNote} className="save-button">
                            {selectedNote ? 'Update' : 'Save'}
                        </button>
                        <button onClick={handleClosePopup} className="close-button">
                            Close
                        </button>
                    </div>
                </div>
            )}

            {selectedNote && !showPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <h2>{selectedNote.title}</h2>
                        <div dangerouslySetInnerHTML={{ __html: selectedNote.text }} />
                        {selectedNote.tags && selectedNote.tags.map((tag, index) => (
                            <span key={index} className="note-tag">{tag}</span>
                        ))}
                        <button onClick={handleClosePopup} className="close-button">
                            Close
                        </button>
                    </div>
                </div>
            )}

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="notes-list">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="notes-list">
                            {notes.map((note, index) => (
                                <Draggable key={note.id} draggableId={String(note.id)} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className="note"
                                            style={{ ...provided.draggableProps.style, backgroundColor: note.color }}
                                        >
                                            <h3 onClick={() => handleNoteTitleClick(note)} className="note-title">
                                                {note.title}
                                            </h3>
                                            {note.tags && note.tags.map((tag, index) => (
                                                <span key={index} className="note-tag">{tag}</span>
                                            ))}
                                            <div className="note-actions">
                                                <button onClick={() => handleEditNote(note)} className="edit-note-button">
                                                    Edit
                                                </button>
                                                <button onClick={() => handleDeleteNote(note.id)} className="delete-note-button">
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
}

export default NotesApp;