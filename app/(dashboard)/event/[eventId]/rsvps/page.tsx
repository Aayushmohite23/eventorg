"use client"
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../../../../../lib/supabase/client';

interface RSVP {
  id: number;
  name: string;
  email: string;
  accompany: number;
  attendance: boolean;
  created_at: string;
}

export default function EventRSVPsPage() {
  const params = useParams();
  const eventId = params?.eventId;
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRsvps = async () => {
      const { data, error } = await supabase
        .from('rsvps')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false });
      if (!error && data) setRsvps(data);
      setLoading(false);
    };
    if (eventId) fetchRsvps();
  }, [eventId]);

  return (
    <div className="min-h-screen max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Event RSVPs</h1>
      {loading ? (
        <p>Loading...</p>
      ) : rsvps.length === 0 ? (
        <p className="text-gray-500">No RSVPs yet for this event.</p>
      ) : (
        <table className="w-full border rounded">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Accompany</th>
              <th className="p-2 text-left">Attendance</th>
              <th className="p-2 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {rsvps.map(rsvp => (
              <tr key={rsvp.id} className="border-t">
                <td className="p-2">{rsvp.name}</td>
                <td className="p-2">{rsvp.email}</td>
                <td className="p-2">{rsvp.accompany}</td>
                <td className="p-2">{rsvp.attendance ? 'Yes' : 'No'}</td>
                <td className="p-2">{new Date(rsvp.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 