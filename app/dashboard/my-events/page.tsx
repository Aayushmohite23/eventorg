"use client"
import { supabase } from '../../../lib/supabase/client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FiCopy, FiExternalLink } from 'react-icons/fi';
import { toast } from 'sonner';

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
    <div className='bg-[#f8f9fb]'>
        <div className="min-h-screen max-w-3xl mx-auto py-10 px-4 ">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Events</h1>
        {/* <Link href="/create" className="bg-black text-white px-4 py-2 rounded">+ Create Event</Link> */}
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : events.length === 0 ? (
        <p className="text-gray-500">You have not created any events yet.</p>
      ) : (
        <ul className="space-y-4">
          {events.map(event => {
            const rsvpLink = `${window.location.origin}/${event.id}/rsvp`;
            return (
              <div key={event.id} className="relative flex items-center group">
                <li className="flex-1 border p-4 rounded flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="font-semibold text-lg">{event.title}</div>
                    <div className="text-gray-500">{event.event_date}</div>
                  </div>
                  <div className="flex gap-2 mt-2 md:mt-0 items-center">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(rsvpLink);
                        toast('Copied to clipboard!');
                      }}
                      title="Copy RSVP Link"
                      className="flex items-center gap-1 px-2 py-1 border rounded hover:bg-gray-100 transition cursor-pointer"
                    >
                      <FiCopy />
                      <span className="hidden sm:inline">Copy RSVP Link</span>
                    </button>
                    <Link href={`/dashboard/event/${event.id}/rsvps`} className="text-green-600 underline">View RSVPs</Link>
                  </div>
                </li>
                <button
                  onClick={() => window.open(`/${event.id}/rsvp`, '_blank')}
                  title="Go to RSVP page"
                  className="ml-2 text-gray-500 hover:text-blue-600 transition"
                  style={{ position: 'absolute', right: -40 }}
                >
                  <FiExternalLink size={24} />
                </button>
              </div>
            );
          })}
        </ul>
      )}
    </div>
    </div>
    
  );
} 