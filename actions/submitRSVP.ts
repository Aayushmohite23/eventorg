'use server'

import { createClient } from '../lib/supabase/server'

export async function submitRSVP(formData: FormData){
    const supabase = await createClient();  //createClient() creates a fresh Supabase client Client is used for the database operation

    const name = formData.get('name');
    const email = formData.get('email');
    const accompany = formData.get('accompany');
    const attendance = formData.get('attendance');
    const event_id = formData.get('event_id');
    
    let { data, error } = await supabase.from('rsvps').insert([{
        name: name,
        email:email,
        accompany:accompany,
        attendance: attendance== 'yes' ? true : false, // Convert to boolean
        event_id: event_id,
    }])
    
    console.log("Data inserted:", data);
    if(error){
        console.error("Error submitting RSVP:", error);
        return {success:false,message: "Failed to submit RSVP", error };
    }
    console.log( formData, 'formData' );  
    return { success:true, message: "RSVP submitted successfully" };
}