/**
 * DayView Component
 *
 * Displays appointments for a single day in a timeline format.
 *
 * TODO for candidates:
 * 1. Generate time slots (8 AM - 6 PM, 30-minute intervals)
 * 2. Position appointments in their correct time slots
 * 3. Handle appointments that span multiple slots
 * 4. Display appointment details (patient, type, duration)
 * 5. Color-code appointments by type
 * 6. Handle overlapping appointments gracefully
 */

'use client';

import type { Appointment, Doctor, TimeSlot } from '@/types';
import { appointmentService } from '@/services/appointmentService';
import { getPatientById } from '@/data/mockData';

interface DayViewProps {
  appointments: Appointment[];
  doctor: Doctor | undefined;
  date: Date;
}

/**
 * DayView Component
 *
 * Renders a daily timeline view with appointments.
 *
 * TODO: Implement this component
 *
 * Architecture suggestions:
 * 1. Create a helper function to generate time slots
 * 2. Create a TimeSlotRow component for each time slot
 * 3. Create an AppointmentCard component for each appointment
 * 4. Calculate appointment positioning based on start/end times
 *
 * Consider:
 * - How to handle appointments that span multiple 30-min slots?
 * - How to show overlapping appointments?
 * - How to make the timeline scrollable if needed?
 * - How to highlight the current time?
 */
export function DayView({ appointments, doctor, date }: DayViewProps) {
  /**
   * TODO: Generate time slots
   *
   * Create an array of TimeSlot objects from 8 AM to 6 PM
   * with 30-minute intervals
   *
   * Hint: You can use a loop or date-fns utilities
   */
  function generateTimeSlots(): TimeSlot[] {
    // TODO: Implement time slot generation
     const slots: TimeSlot[] = [];
  
  for (let hour = 8; hour < 18; hour++) {
    for (let minute of [0, 30]) {
      const start = new Date(date);
      start.setHours(hour, minute, 0, 0);
      
      const end = new Date(start);
      end.setMinutes(start.getMinutes() + 30);
      
      // Format label (e.g., "9:00 AM", "9:30 AM")
      const label = start.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      
      slots.push({ start, end, label });
    }
  }
  
  return slots;
    // Example structure:
    // return [
    //   { start: new Date(...8:00), end: new Date(...8:30), label: '8:00 AM' },
    //   { start: new Date(...8:30), end: new Date(...9:00), label: '8:30 AM' },
    //   ...
    // ];
  
  }

  /**
   * TODO: Find appointments for a specific time slot
   *
   * Given a time slot, find all appointments that overlap with it
   */
  function getAppointmentsForSlot(slot: TimeSlot): Appointment[] {
    // TODO: Implement appointment filtering
    return appointments.filter(apt => {
      const aptStart = new Date(apt.startTime);
      const aptEnd = new Date(apt.endTime);
      
      // Check if appointment overlaps with this slot
      return (
        (aptStart >= slot.start && aptStart < slot.end) ||
        (aptEnd > slot.start && aptEnd <= slot.end) ||
        (aptStart <= slot.start && aptEnd >= slot.end)
      );
    });
    // Check if appointment.startTime or appointment.endTime falls within the slot
    return [];
  }

    function isFirstSlotOfAppointment(apt: Appointment, slotStart: Date): boolean {
    const aptStart = new Date(apt.startTime);
    return (
      aptStart.getHours() === slotStart.getHours() &&
      aptStart.getMinutes() === slotStart.getMinutes()
    );
  }

  const timeSlots = generateTimeSlots();

    const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="day-view">
      {/* Day header */}
      <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <h3 className="text-xl font-bold text-gray-900">
          {formattedDate}
        </h3>
        {doctor && (
          <p className="text-sm text-gray-700 mt-1">
            <span className="font-semibold"> {doctor.name}</span> - {doctor.specialty.charAt(0).toUpperCase() + doctor.specialty.slice(1)}
          </p>
        )}
        {appointments.length > 0 && (
          <p className="text-xs text-gray-600 mt-2">
            {appointments.length} appointment{appointments.length !== 1 ? 's' : ''} scheduled
          </p>
        )}
      </div>

      {/* Timeline grid */}
     <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow">
        <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
          {timeSlots.map((slot, index) => {
            const slotAppointments = getAppointmentsForSlot(slot);
            const now = new Date();
            const isCurrentSlot = 
              now >= slot.start && 
              now < slot.end && 
              now.toDateString() === date.toDateString();
            
            return (
              <div
                key={index}
                className={`flex hover:bg-gray-50 transition-colors ${
                  isCurrentSlot ? 'bg-yellow-50' : ''
                }`}
                style={{ minHeight: '60px' }}
              >
                {/* Time Label */}
                <div className={`w-24 flex-shrink-0 p-3 text-sm font-medium border-r ${
                  isCurrentSlot ? 'bg-yellow-100 text-yellow-900' : 'bg-gray-50 text-gray-600'
                }`}>
                  {slot.label}
                  {isCurrentSlot && (
                    <div className="text-xs text-yellow-700 mt-1">Now</div>
                  )}
                </div>

                {/* Appointment Area */}
                <div className="flex-1 p-2 relative">
                  {slotAppointments.map((apt, aptIndex) => (
                    <AppointmentCard
                      key={apt.id}
                      appointment={apt}
                      isFirstSlot={isFirstSlotOfAppointment(apt, slot.start)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Empty state */}
      {appointments.length === 0 && (
        <div className="mt-6 text-center bg-gray-50 rounded-lg p-8 border-2 border-dashed border-gray-300">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-gray-500 text-lg font-medium">
            No appointments scheduled
          </p>
          <p className="text-gray-400 text-sm mt-1">
            This day is free
          </p>
        </div>
      )}

      {/* Legend */}
      {appointments.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-xs font-semibold text-gray-700 mb-2 ">
            Appointment Types
          </h4>
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-100 border-l-4 border-blue-500 rounded"></div>
              <span className="text-gray-700">Checkup</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 border-l-4 border-green-500 rounded"></div>
              <span className="text-gray-700">Consultation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-100 border-l-4 border-orange-500 rounded"></div>
              <span className="text-gray-700">Follow-up</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-100 border-l-4 border-purple-500 rounded"></div>
              <span className="text-gray-700">Procedure</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface AppointmentCardProps {
  appointment: Appointment;
  isFirstSlot: boolean;
}

function AppointmentCard({ appointment, isFirstSlot }: AppointmentCardProps) {
  // Get patient data
  const patient = getPatientById(appointment.patientId);
  
  // Calculate appointment duration and height
  const start = new Date(appointment.startTime);
  const end = new Date(appointment.endTime);
  const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
  const slots = durationMinutes / 30;
  const height = slots * 60; // Each slot is 60px
  
  // Color mapping for appointment types
  const typeColors = {
    checkup: 'bg-blue-100 border-blue-500 text-blue-900',
    consultation: 'bg-green-100 border-green-500 text-green-900',
    'follow-up': 'bg-orange-100 border-orange-500 text-orange-900',
    procedure: 'bg-purple-100 border-purple-500 text-purple-900'
  };
  
  const colorClass = typeColors[appointment.type as keyof typeof typeColors] || typeColors.checkup;
  
  // Only render card on the first slot it occupies
  if (!isFirstSlot) return null;
  
  return (
    <div
      className={`absolute left-2 right-2 p-2 rounded-lg border-l-4 ${colorClass} shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden`}
      style={{ height: `${height}px`, zIndex: 10 }}
      title={`${patient?.name || 'Unknown'} - ${appointment.type}\n${start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - ${end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`}
    >
      <div className="text-sm font-semibold truncate">
        {patient?.name || 'Unknown Patient'}
      </div>
      <div className="text-xs capitalize mt-1 font-medium">
        {appointment.type.replace('-', ' ')}
      </div>
      <div className="text-xs text-gray-600 mt-1">
        {start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} - 
        {end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
      </div>
      <div className="text-xs text-gray-500 mt-1">
        {durationMinutes} min
      </div>
      {appointment.notes && (
        <div className="text-xs text-gray-500 mt-1 truncate">
          Note: {appointment.notes}
        </div>
      )}
    </div>
  );
}


        {/* TODO: Replace above with actual timeline implementation */}
        {/* Example structure:
        <div className="divide-y divide-gray-100">
          {timeSlots.map((slot, index) => (
            <div key={index} className="flex">
              <div className="w-24 p-2 text-sm text-gray-600">
                {slot.label}
              </div>
              <div className="flex-1 p-2 min-h-[60px] relative">
                {getAppointmentsForSlot(slot).map(appointment => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))}
              </div>
            </div>
          ))}
        </div>
        */}
      

/**
 * TODO: Create an AppointmentCard component
 *
 *
 * This should be a small, reusable component that displays
 * a single appointment with appropriate styling.
 *
 * Consider:
 * - Show patient name
 * - Show appointment type
 * - Show duration
 * - Color-code by appointment type (use APPOINTMENT_TYPE_CONFIG from types)
 * - Make it visually clear when appointments span multiple slots
 */
