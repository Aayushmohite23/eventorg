"use client"
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase/client';
import EventForm, { EventFormData } from '../../../components/EventForm';

export default function CreateEventPage() {
  const router = useRouter();

  const handleCreate = async (data: EventFormData) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('You must be logged in to create an event.');
    const { error } = await supabase.from('events').insert({
      title: data.title,
      description: data.description,
      event_date: data.event_date,
      location: data.location,
      user_id: user.id,
    });
    if (error) throw error;
    router.push('/my-events');
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <EventForm onSubmit={handleCreate} />
    </div>
  );
} 