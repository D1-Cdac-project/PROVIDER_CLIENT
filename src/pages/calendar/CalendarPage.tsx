import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { getBookingsByProvider } from "../../services/bookingApi";

const localizer = momentLocalizer(moment);

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: "booking" | "blocked";
  status?: string;
  customer?: string;
  resource?: any;
}

const CalendarPage: React.FC = () => {
  const [view, setView] = useState("month");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch bookings from API
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const bookingsData = await getBookingsByProvider();
        setBookings(bookingsData);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Convert bookings to calendar events
  const bookingEvents: Event[] = bookings.flatMap((booking) =>
    booking.orderDates.map((date, index) => ({
      id: `${booking._id}-${index}`,
      title: `${booking.mandapId.mandapName} - ${booking.userId.fullName}`,
      start: new Date(date),
      end: new Date(date), // Assuming single-day bookings; adjust if spans multiple days
      type: "booking" as const,
      status: booking.paymentStatus.toLowerCase(), // Map paymentStatus to event status
      customer: booking.userId.fullName,
    }))
  );

  // Blocked dates (empty for now, as not provided in API response)
  const blockedEvents: Event[] = [];

  // Combine all events
  const events = [...bookingEvents, ...blockedEvents];

  const eventStyleGetter = (event: Event) => {
    let style = {
      backgroundColor: "",
      borderRadius: "4px",
      color: "#fff",
      border: "0px",
      display: "block",
    };

    if (event.type === "booking") {
      switch (event.status) {
        case "confirmed":
          style.backgroundColor = "#5E35B1";
          break;
        case "pending":
          style.backgroundColor = "#FF9800";
          break;
        case "cancelled":
          style.backgroundColor = "#F44336";
          break;
        case "completed":
          style.backgroundColor = "#4CAF50";
          break;
        default:
          style.backgroundColor = "#5E35B1";
      }
    } else {
      style.backgroundColor = "#9E9E9E";
    }

    return { style };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Booking Calendar</h1>
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant={view === "month" ? "primary" : "outline"}
            onClick={() => setView("month")}
          >
            Month
          </Button>
          <Button
            size="sm"
            variant={view === "week" ? "primary" : "outline"}
            onClick={() => setView("week")}
          >
            Week
          </Button>
          <Button
            size="sm"
            variant={view === "day" ? "primary" : "outline"}
            onClick={() => setView("day")}
          >
            Day
          </Button>
          <Button
            size="sm"
            variant={view === "agenda" ? "primary" : "outline"}
            onClick={() => setView("agenda")}
          >
            Agenda
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="h-[700px] p-4">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: "100%" }}
              views={["month", "week", "day", "agenda"]}
              view={view as Views}
              onView={(view) => setView(view)}
              eventPropGetter={eventStyleGetter}
              popup
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="flex items-center p-3 bg-white rounded-md shadow-sm">
          <div className="w-4 h-4 rounded-full bg-[#5E35B1] mr-2"></div>
          <span>Confirmed Booking</span>
        </div>
        <div className="flex items-center p-3 bg-white rounded-md shadow-sm">
          <div className="w-4 h-4 rounded-full bg-[#FF9800] mr-2"></div>
          <span>Pending Booking</span>
        </div>
        <div className="flex items-center p-3 bg-white rounded-md shadow-sm">
          <div className="w-4 h-4 rounded-full bg-[#4CAF50] mr-2"></div>
          <span>Completed Booking</span>
        </div>
        <div className="flex items-center p-3 bg-white rounded-md shadow-sm">
          <div className="w-4 h-4 rounded-full bg-[#9E9E9E] mr-2"></div>
          <span>Blocked Date</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
