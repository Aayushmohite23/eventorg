"use client"
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../../../../../lib/supabase/client';
import Export from '../../../../../components/ui/export';

interface RSVP {
  id: number;
  name: string;
  email: string;
  accompany: number;
  attendance: boolean;
  created_at: string;
}

interface EventDetails {
  title: string;
  event_date: string;
}

export default function EventRSVPsPage() {
  const params = useParams();
  const eventId = params?.eventId;
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);

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
    const fetchEventDetails = async () => {
      const { data, error } = await supabase
        .from('events')
        .select('title, event_date')
        .eq('id', eventId)
        .single();
      if (!error && data) setEventDetails(data);
    };
    if (eventId) {
      fetchRsvps();
      fetchEventDetails();
    }
  }, [eventId]);

  return (
    <div className="bg-[#f8f9fb] min-h-screen py-10">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-md border p-8">
          <h1 className="text-3xl font-bold text-center mb-2 text-[#f02e65]">Event RSVPs</h1>
          {eventDetails && (
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="text-lg font-semibold text-gray-700">Event title: <span className="font-normal text-gray-900">{eventDetails.title}</span></div>
              <div className="text-lg font-semibold text-gray-700">Event date: <span className="font-normal text-gray-900">{eventDetails.event_date}</span></div>
            </div>
          )}
          <hr className="mb-6" />
          {loading ? (
            <p>Loading...</p>
          ) : rsvps.length === 0 ? (
            <p className="text-gray-500">No RSVPs yet for this event.</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border rounded-xl shadow-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-3 text-left font-semibold text-gray-700">Name</th>
                      <th className="p-3 text-left font-semibold text-gray-700">Email</th>
                      <th className="p-3 text-left font-semibold text-gray-700">Accompany</th>
                      <th className="p-3 text-left font-semibold text-gray-700">Attendance</th>
                      <th className="p-3 text-left font-semibold text-gray-700">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rsvps.map(rsvp => (
                      <tr key={rsvp.id} className="border-t hover:bg-gray-50 transition">
                        <td className="p-3 text-gray-900">{rsvp.name}</td>
                        <td className="p-3 text-gray-900">{rsvp.email}</td>
                        <td className="p-3 text-gray-900">{rsvp.accompany}</td>
                        <td className="p-3 text-gray-900">{rsvp.attendance ? 'Yes' : 'No'}</td>
                        <td className="p-3 text-gray-900">{new Date(rsvp.created_at).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end mt-6">
                <Export onClick={() => {
                  const csvRows = [
                    ['Name', 'Email', 'Accompany', 'Attendance', 'Date'],
                    ...rsvps.map(rsvp => [
                      rsvp.name,
                      rsvp.email,
                      rsvp.accompany,
                      rsvp.attendance ? 'Yes' : 'No',
                      new Date(rsvp.created_at).toLocaleString()
                    ])
                  ];
                  const csvContent = csvRows.map(e => e.join(",")).join("\n");
                  const blob = new Blob([csvContent], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `event-${eventId}-rsvps.csv`;
                  a.click();
                  URL.revokeObjectURL(url);
                }} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 