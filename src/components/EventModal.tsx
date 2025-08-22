
import React, { useState, useEffect } from 'react';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD format for easy comparison
  color: string; // Hex color code or Tailwind color class
}

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date | null;
  events: Event[];
  addEvent: (event: Event) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (id: string) => void;
}

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, date, events, addEvent, updateEvent, deleteEvent }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#3b82f6'); // Default color: blue-500

  useEffect(() => {
    if (!isOpen) {
      setIsAdding(false);
      setEditingEvent(null);
      setTitle('');
      setDescription('');
      setColor('#3b82f6');
    }
  }, [isOpen]);

  useEffect(() => {
    console.log('Events received by EventModal:', events);
  }, [events]);

  const handleAddEvent = () => {
    console.log('Date in handleAddEvent:', date);
    if (!date) return;
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    const newEvent: Event = {
      id: Date.now().toString(),
      title,
      description,
      date: formattedDate,
      color,
    };
    addEvent(newEvent);
    setIsAdding(false);
    setTitle('');
    setDescription('');
    setColor('#3b82f6');
  };

  const handleUpdateEvent = () => {
    if (!editingEvent || !date) return;
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    const updatedEvent: Event = {
      ...editingEvent,
      title,
      description,
      date: formattedDate,
      color,
    };
    updateEvent(updatedEvent);
    setEditingEvent(null);
    setTitle('');
    setDescription('');
    setColor('#3b82f6');
  };

  const handleDeleteEvent = (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      deleteEvent(id);
    }
  };

  const startEditing = (event: Event) => {
    setEditingEvent(event);
    setTitle(event.title);
    setDescription(event.description);
    setColor(event.color);
    setIsAdding(false); // Ensure add form is hidden
  };

  if (!isOpen || !date) {
    return null;
  }

  const formattedDate = date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-lg bg-white p-8 shadow-xl transform transition-all duration-300 scale-100 opacity-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="mb-4 text-xl font-bold">Events for {formattedDate}</h2>

        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Scheduled Events</h3>
          {events.length === 0 ? (
            <p className="text-gray-600">No events scheduled for this day.</p>
          ) : (
            <ul className="space-y-2">
              {events.map((event) => (
                <li key={event.id} className="flex items-center justify-between p-2 border rounded-md bg-gray-50">
                  <div className="flex items-center">
                    <span className="size-3 rounded-full mr-2" style={{ backgroundColor: event.color }}></span>
                    <span className="font-medium">{event.title}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEditing(event)}
                      className="text-blue-500 hover:text-blue-700 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {!isAdding && !editingEvent && (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 transition-colors"
          >
            Add New Event
          </button>
        )}

        {(isAdding || editingEvent) && (
          <div className="mt-4 p-4 border rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold mb-2">{editingEvent ? 'Edit Event' : 'Add Event'}</h3>
            <div className="space-y-3">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                ></textarea>
              </div>
              <div>
                <label htmlFor="color" className="block text-sm font-medium text-gray-700">Color</label>
                <input
                  type="color"
                  id="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setEditingEvent(null);
                    setTitle('');
                    setDescription('');
                    setColor('#3b82f6');
                  }}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={editingEvent ? handleUpdateEvent : handleAddEvent}
                  className="rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600 transition-colors"
                >
                  {editingEvent ? 'Update Event' : 'Create Event'}
                </button>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100"
        >
          Close Modal
        </button>
      </div>
    </div>
  );
};

export default EventModal;
