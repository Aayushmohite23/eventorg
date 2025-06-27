"use client"
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase/client';
import EventForm, { EventFormData } from '../../../components/EventForm';
import { toast } from 'sonner';

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
    toast('Event created successfully!');
    setTimeout(() => {
      router.push('/dashboard/my-events');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex items-center justify-center">
      <EventForm onSubmit={handleCreate} />
    </div>
  );
} 