import { useState } from 'react';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';

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
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'message' in err && typeof (err as { message?: string }).message === 'string') {
        setError((err as { message: string }).message);
      } else {
        setError('Something went wrong');
      }
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg border p-8 flex flex-col gap-5 w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-2 text-[#f02e65]">Create Event</h2>
      <div className="flex flex-col gap-2">
        <Label htmlFor="title">Event Title<span className="text-[#f02e65]">*</span></Label>
        <Input
          id="title"
          name="title"
          placeholder="Event Title"
          value={form.title}
          onChange={handleChange}
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="event_date">Event Date<span className="text-[#f02e65]">*</span></Label>
        <Input
          id="event_date"
          name="event_date"
          type="date"
          value={form.event_date}
          onChange={handleChange}
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="location">Location<span className="text-[#f02e65]">*</span></Label>
        <Input
          id="location"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#f02e65] hover:bg-[#ab073d] text-white p-2 rounded font-semibold transition-shadow hover:shadow-lg focus:shadow-lg mt-2"
      >
        {loading ? 'Creating...' : 'Create Event'}
      </button>
      {error && <p className="text-red-500 text-center mt-2">{error}</p>}
    </form>
  );
} 