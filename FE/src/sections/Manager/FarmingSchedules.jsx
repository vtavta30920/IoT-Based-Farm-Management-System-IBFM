import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { format } from "date-fns";

const FarmingSchedules = () => {
  const [events, setEvents] = useState([
    {
      id: "1",
      title: "Planting Tomatoes - Field A",
      start: new Date(),
      end: new Date(new Date().setDate(new Date().getDate() + 2)),
      color: "#4CAF50",
      extendedProps: {
        taskType: "planting",
        field: "A",
        crop: "Tomatoes",
        staff: "Team 1",
      },
    },
    {
      id: "2",
      title: "Harvesting Wheat - Field B",
      start: new Date(new Date().setDate(new Date().getDate() + 5)),
      end: new Date(new Date().setDate(new Date().getDate() + 7)),
      color: "#FF9800",
      extendedProps: {
        taskType: "harvesting",
        field: "B",
        crop: "Wheat",
        staff: "Team 2",
      },
    },
  ]);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: "",
    end: "",
    taskType: "planting",
    field: "",
    crop: "",
    staff: "",
  });

  const handleDateClick = (arg) => {
    setNewEvent({
      ...newEvent,
      start: arg.date,
      end: arg.date,
    });
  };

  const handleEventClick = (clickInfo) => {
    setSelectedEvent({
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      start: clickInfo.event.start,
      end: clickInfo.event.end,
      ...clickInfo.event.extendedProps,
    });
  };

  const handleEventDrop = (eventInfo) => {
    const updatedEvents = events.map((event) =>
      event.id === eventInfo.event.id
        ? {
            ...event,
            start: eventInfo.event.start,
            end: eventInfo.event.end,
          }
        : event
    );
    setEvents(updatedEvents);
  };

  const handleAddEvent = () => {
    const event = {
      id: Date.now().toString(),
      title: newEvent.title,
      start: newEvent.start,
      end: newEvent.end,
      color: newEvent.taskType === "planting" ? "#4CAF50" : "#FF9800",
      extendedProps: {
        taskType: newEvent.taskType,
        field: newEvent.field,
        crop: newEvent.crop,
        staff: newEvent.staff,
      },
    };
    setEvents([...events, event]);
    setNewEvent({
      title: "",
      start: "",
      end: "",
      taskType: "planting",
      field: "",
      crop: "",
      staff: "",
    });
  };

  const handleUpdateEvent = () => {
    const updatedEvents = events.map((event) =>
      event.id === selectedEvent.id
        ? {
            ...event,
            title: selectedEvent.title,
            start: selectedEvent.start,
            end: selectedEvent.end,
            extendedProps: {
              taskType: selectedEvent.taskType,
              field: selectedEvent.field,
              crop: selectedEvent.crop,
              staff: selectedEvent.staff,
            },
          }
        : event
    );
    setEvents(updatedEvents);
    setSelectedEvent(null);
  };

  const handleDeleteEvent = () => {
    setEvents(events.filter((event) => event.id !== selectedEvent.id));
    setSelectedEvent(null);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Farming Schedules
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-4">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={events}
            editable={true}
            selectable={true}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            eventDrop={handleEventDrop}
            height="600px"
          />
        </div>

        {/* Event Form */}
        <div className="bg-white rounded-lg shadow p-4">
          {selectedEvent ? (
            <div>
              <h3 className="text-lg font-semibold mb-4">Edit Schedule</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Task Title
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                    value={selectedEvent.title}
                    onChange={(e) =>
                      setSelectedEvent({
                        ...selectedEvent,
                        title: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Start Date
                    </label>
                    <input
                      type="datetime-local"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                      value={format(
                        new Date(selectedEvent.start),
                        "yyyy-MM-dd'T'HH:mm"
                      )}
                      onChange={(e) =>
                        setSelectedEvent({
                          ...selectedEvent,
                          start: new Date(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      End Date
                    </label>
                    <input
                      type="datetime-local"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                      value={format(
                        new Date(selectedEvent.end),
                        "yyyy-MM-dd'T'HH:mm"
                      )}
                      onChange={(e) =>
                        setSelectedEvent({
                          ...selectedEvent,
                          end: new Date(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Task Type
                  </label>
                  <select
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                    value={selectedEvent.taskType}
                    onChange={(e) =>
                      setSelectedEvent({
                        ...selectedEvent,
                        taskType: e.target.value,
                      })
                    }
                  >
                    <option value="planting">Planting</option>
                    <option value="harvesting">Harvesting</option>
                    <option value="fertilizing">Fertilizing</option>
                    <option value="irrigation">Irrigation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Field
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                    value={selectedEvent.field}
                    onChange={(e) =>
                      setSelectedEvent({
                        ...selectedEvent,
                        field: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Crop
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                    value={selectedEvent.crop}
                    onChange={(e) =>
                      setSelectedEvent({
                        ...selectedEvent,
                        crop: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Staff
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                    value={selectedEvent.staff}
                    onChange={(e) =>
                      setSelectedEvent({
                        ...selectedEvent,
                        staff: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleUpdateEvent}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Update
                  </button>
                  <button
                    onClick={handleDeleteEvent}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold mb-4">Add New Schedule</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Task Title
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                    value={newEvent.title}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, title: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Start Date
                    </label>
                    <input
                      type="datetime-local"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                      value={newEvent.start}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, start: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      End Date
                    </label>
                    <input
                      type="datetime-local"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                      value={newEvent.end}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, end: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Task Type
                  </label>
                  <select
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                    value={newEvent.taskType}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, taskType: e.target.value })
                    }
                  >
                    <option value="planting">Planting</option>
                    <option value="harvesting">Harvesting</option>
                    <option value="fertilizing">Fertilizing</option>
                    <option value="irrigation">Irrigation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Field
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                    value={newEvent.field}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, field: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Crop
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                    value={newEvent.crop}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, crop: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Staff
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                    value={newEvent.staff}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, staff: e.target.value })
                    }
                  />
                </div>
                <button
                  onClick={handleAddEvent}
                  className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Add Schedule
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmingSchedules;
