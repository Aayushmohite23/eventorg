"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { submitRSVP } from "@/actions/submitRSVP";
import { toast } from "sonner";

const RSVPForm = () => {
  const params = useParams();
  const eventId = params?.eventId;
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [accompany, setAccompany] = useState<string | null>(null);
  const [attendance, setAttendance] = useState("yes");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .single();
      if (!error && data) setEvent(data);
      setLoading(false);
    };
    fetchEvent();
  }, [eventId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      setErrors({ name: "Name is required" });
      return;
    }
    if (!email) {
      setErrors({ email: "Email is required" });
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("accompany", accompany || "0");
    formData.append("attendance", attendance);
    if (eventId && typeof eventId === 'string') formData.append("event_id", eventId);

    setIsLoading(true);
    const result = await submitRSVP(formData);

    if (result.success) {
      toast("Thank you for your response!");
      setName("");
      setEmail("");
      setAccompany(null);
      setAttendance("yes");
      setErrors({});
    } else {
      toast(result.message);
      if (result.error && result.error.code === "23505") {
        setErrors({ email: "Email already exists" });
      }
    }
    setIsLoading(false);
  };

  const openGoogleMaps = () => {
    if (!event?.location) return;
    const encodedLocation = encodeURIComponent(event.location);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`,
      "_blank"
    );
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  if (!event) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Event not found.</div>;
  }

  return (
    <div className="flex flex-col justify-center gap-1 max-w-md mx-auto p-6 bg-white rounded-lg shadow-md border">
      <h1 className="text-2xl font-bold mb-4">{event.title}</h1>
      <p className="mb-6">{event.description}</p>
      <div className="mb-6 flex flex-col gap-3">
        <Label>Event Date</Label>
        <Calendar
          mode="single"
          selected={event.event_date ? new Date(event.event_date) : undefined}
          className="rounded-md border flex flex-col items-center"
          fromDate={event.event_date ? new Date(event.event_date) : undefined}
          toDate={event.event_date ? new Date(event.event_date) : undefined}
          defaultMonth={event.event_date ? new Date(event.event_date) : undefined}
          ISOWeek
        />
        <div className="mt-4">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={openGoogleMaps}
          >
            <MapPin className="mr-2" />
            View Location on Google Maps
          </Button>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col gap-3">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="accompany">Number of Guests</Label>
          <Input
            id="accompany"
            type="number"
            min="0"
            value={accompany || ""}
            onChange={(e) => setAccompany(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-3">
          <Label>Will you attend?</Label>
          <RadioGroup value={attendance} onValueChange={setAttendance}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="yes" />
              <Label htmlFor="yes">Yes, I'll be there!</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="no" />
              <Label htmlFor="no">Sorry, I can't make it</Label>
            </div>
          </RadioGroup>
        </div>
        <Button disabled={isLoading} type="submit" className="bg-[#f02e65]">
          {isLoading ? "Sending..." : "Send RSVP"}
        </Button>
      </form>
    </div>
  );
};

export default RSVPForm;