import { useState } from 'react';

export interface EventFormData {
  title: string;
  description: string;
  event_date: string;
  location: string;
}

export default function EventForm({ onSubmit }: { onSubmit: (data: EventFormData) => Promise<void> }) {
  const [form, setForm] = useState<EventFormData>({
    title: '',
    description: '',
    event_date: '',
    location: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.title || !form.event_date || !form.location) {
      setError('Please fill all required fields.');
      return;
    }
    setLoading(true);
    try {
      await onSubmit(form);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto p-6 border rounded">
      <h2 className="text-xl font-bold text-center mb-2">Create Event</h2>
      <input
        name="title"
        placeholder="Event Title"
        value={form.title}
        onChange={handleChange}
        required
        className="border p-2 rounded"
      />
      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        className="border p-2 rounded"
      />
      <input
        name="event_date"
        type="date"
        value={form.event_date}
        onChange={handleChange}
        required
        className="border p-2 rounded"
      />
      <input
        name="location"
        placeholder="Location"
        value={form.location}
        onChange={handleChange}
        required
        className="border p-2 rounded"
      />
      <button type="submit" disabled={loading} className="bg-black text-white p-2 rounded">
        {loading ? 'Creating...' : 'Create Event'}
      </button>
      {error && <p className="text-red-500 text-center">{error}</p>}
    </form>
  );
} 