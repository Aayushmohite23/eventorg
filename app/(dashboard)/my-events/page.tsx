"use client"
import { supabase } from '../../../lib/supabase/client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Event {
  id: number;
  title: string;
  event_date: string;
}

export default function MyEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data, error } = await supabase
        .from('events')
        .select('id, title, event_date')
        .eq('user_id', user.id)
        .order('event_date', { ascending: true });
      if (!error && data) setEvents(data);
      setLoading(false);
    };
    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen max-w-2xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Events</h1>
        <Link href="/create" className="bg-black text-white px-4 py-2 rounded">+ Create Event</Link>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : events.length === 0 ? (
        <p className="text-gray-500">You have not created any events yet.</p>
      ) : (
        <ul className="space-y-4">
          {events.map(event => (
            <li key={event.id} className="border p-4 rounded flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="font-semibold text-lg">{event.title}</div>
                <div className="text-gray-500">{event.event_date}</div>
              </div>
              <div className="flex gap-2 mt-2 md:mt-0">
                <Link href={`/${event.id}/rsvp`} className="text-blue-600 underline">RSVP Link</Link>
                <Link href={`/event/${event.id}/rsvps`} className="text-green-600 underline">View RSVPs</Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 