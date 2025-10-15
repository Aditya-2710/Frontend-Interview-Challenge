/**
 * WeekView Component
 *
 * Displays appointments for a week (Monday - Sunday) in a grid format.
 *
 * TODO for candidates:
 * 1. Generate a 7-day grid (Monday through Sunday)
 * 2. Generate time slots for each day
 * 3. Position appointments in the correct day and time
 * 4. Make it responsive (may need horizontal scroll on mobile)
 * 5. Color-code appointments by type
 * 6. Handle overlapping appointments
 */

'use client';

import { getPatientById } from '@/data/mockData';
import type { Appointment, Doctor, TimeSlot } from '@/types';

interface WeekViewProps {
  appointments: Appointment[];
  doctor: Doctor | undefined;
  weekStartDate: Date; // Should be a Monday
}

/**
 * WeekView Component
 *
 * Renders a weekly calendar grid with appointments.
 *
 * TODO: Implement this component
 *
 * Architecture suggestions:
 * 1. Generate an array of 7 dates (Mon-Sun) from weekStartDate
 * 2. Generate time slots (same as DayView: 8 AM - 6 PM)
 * 3. Create a grid: rows = time slots, columns = days
 * 4. Position appointments in the correct cell (day + time)
 *
 * Consider:
 * - How to make the grid scrollable horizontally on mobile?
 * - How to show day names and dates in headers?
 * - How to handle appointments that span multiple hours?
 * - Should you reuse logic from DayView?
 */

function generateTimeSlots(date: Date): TimeSlot[] {
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
}

/**
 * Check if two dates are the same day
 */
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Compact AppointmentCard for Week View
 */
interface CompactAppointmentCardProps {
  appointment: Appointment;
  isFirstSlot: boolean;
}

function CompactAppointmentCard({ appointment, isFirstSlot }: CompactAppointmentCardProps) {
  // Only render on the first slot
  if (!isFirstSlot) return null;
  
  const patient = getPatientById(appointment.patientId);
  const start = new Date(appointment.startTime);
  const end = new Date(appointment.endTime);
  
  // Calculate duration for height
  const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
  const slots = durationMinutes / 30;
  const height = slots * 50; // Each slot is 50px in week view
  
  // Color mapping for appointment types
  const typeColors = {
    checkup: 'bg-blue-500 text-white',
    consultation: 'bg-green-500 text-white',
    'follow-up': 'bg-orange-500 text-white',
    procedure: 'bg-purple-500 text-white'
  };
  
  const colorClass = typeColors[appointment.type as keyof typeof typeColors] || typeColors.checkup;
  
  return (
    <div
      className={`${colorClass} rounded px-1.5 py-1 mb-1 text-xs cursor-pointer hover:opacity-90 transition-opacity overflow-hidden`}
      style={{ minHeight: `${height}px` }}
      title={`${patient?.name || 'Unknown'}\n${appointment.type}\n${start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} - ${end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`}
    >
      <div className="font-semibold truncate">
        {patient?.name?.split(' ')[0] || 'Unknown'}
      </div>
      <div className="text-[10px] truncate">
        {start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
      </div>
    </div>
  );
}

export function WeekView({ appointments, doctor, weekStartDate }: WeekViewProps) {
  /**
   * TODO: Generate array of 7 dates (Monday through Sunday)
   *
   * Starting from weekStartDate, create an array of the next 7 days
   */
  function getWeekDays(): Date[] {
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStartDate);
      day.setDate(weekStartDate.getDate() + i);
      days.push(day);
    }
    return days;
  }

  /**
   * TODO: Get appointments for a specific day
   */
  function getAppointmentsForDay(date: Date): Appointment[] {
    return appointments.filter(apt => {
      const aptStart = new Date(apt.startTime);
      return isSameDay(aptStart, date);
    });
  }

  /**
   * TODO: Get appointments for a specific day and time slot
   */
  function getAppointmentsForDayAndSlot(date: Date, slot: TimeSlot): Appointment[] {
     return appointments.filter(apt => {
      const aptStart = new Date(apt.startTime);
      const aptEnd = new Date(apt.endTime);
      
      // Check if appointment is on this day
      if (!isSameDay(aptStart, date)) return false;
      
      // Check if appointment overlaps with this time slot
      return (
        (aptStart >= slot.start && aptStart < slot.end) ||
        (aptEnd > slot.start && aptEnd <= slot.end) ||
        (aptStart <= slot.start && aptEnd >= slot.end)
      );
    });
  }

  /**
   * Check if appointment starts in this slot
   */
  function isFirstSlotOfAppointment(apt: Appointment, slotStart: Date): boolean {
    const aptStart = new Date(apt.startTime);
    return (
      aptStart.getHours() === slotStart.getHours() &&
      aptStart.getMinutes() === slotStart.getMinutes()
    );
  }

  const weekDays = getWeekDays();
  const timeSlots = generateTimeSlots(weekStartDate);
   // Format week range for header
  const weekEnd = weekDays[6];
  const weekRangeText = `${weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  
  // Get today's date for highlighting
  const today = new Date();

 return (
    <div className="week-view">
      {/* Week header */}
      <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <h3 className="text-xl font-bold text-gray-900">
          Week of {weekRangeText}
        </h3>
        {doctor && (
          <p className="text-sm text-gray-700 mt-1">
            <span className="font-semibold"> {doctor.name}</span> - {doctor.specialty.charAt(0).toUpperCase() + doctor.specialty.slice(1)}
          </p>
        )}
        {appointments.length > 0 && (
          <p className="text-xs text-gray-600 mt-2">
            {appointments.length} appointment{appointments.length !== 1 ? 's' : ''} scheduled this week
          </p>
        )}
      </div>

      {/* Week grid - horizontal scroll on mobile */}
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 sticky top-0 z-10">
                <th className="w-20 p-2 text-xs font-semibold text-gray-700 border-r border-b">
                  Time
                </th>
                {weekDays.map((day, index) => {
                  const isToday = isSameDay(day, today);
                  const dayAppointments = getAppointmentsForDay(day);
                  
                  return (
                    <th
                      key={index}
                      className={`p-2 text-xs font-semibold border-l border-b min-w-[120px] ${
                        isToday ? 'bg-blue-100' : ''
                      }`}
                    >
                      <div className={`${isToday ? 'text-blue-700' : 'text-gray-900'}`}>
                        {day.toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                      <div className={`text-[10px] ${isToday ? 'text-blue-600' : 'text-gray-600'} mt-0.5`}>
                        {day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                      {dayAppointments.length > 0 && (
                        <div className="text-[10px] text-gray-500 mt-0.5">
                          {dayAppointments.length} apt{dayAppointments.length !== 1 ? 's' : ''}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {timeSlots.map((slot, slotIndex) => {
                const now = new Date();
                const isCurrentHour = 
                  now.getHours() === slot.start.getHours() &&
                  isSameDay(now, weekStartDate);
                
                return (
                  <tr
                    key={slotIndex}
                    className={`hover:bg-gray-50 transition-colors ${
                      isCurrentHour ? 'bg-yellow-50' : ''
                    }`}
                  >
                    {/* Time column */}
                    <td className={`p-2 text-xs text-gray-600 border-r align-top ${
                      isCurrentHour ? 'bg-yellow-100 font-semibold' : 'bg-gray-50'
                    }`}>
                      <div>{slot.label}</div>
                      {isCurrentHour && (
                        <div className="text-[10px] text-yellow-700 mt-0.5">Now</div>
                      )}
                    </td>
                    
                    {/* Day columns */}
                    {weekDays.map((day, dayIndex) => {
                      const isToday = isSameDay(day, today);
                      const daySlotAppointments = getAppointmentsForDayAndSlot(day, slot);
                      
                      return (
                        <td
                          key={dayIndex}
                          className={`p-1.5 border-l align-top ${
                            isToday ? 'bg-blue-50' : ''
                          }`}
                          style={{ minHeight: '50px', maxWidth: '150px' }}
                        >
                          {daySlotAppointments.map((apt) => (
                            <CompactAppointmentCard
                              key={apt.id}
                              appointment={apt}
                              isFirstSlot={isFirstSlotOfAppointment(apt, slot.start)}
                            />
                          ))}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
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
            This week is free
          </p>
        </div>
      )}

      {/* Legend */}
      {appointments.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-xs font-semibold text-gray-700 mb-2">
            Appointment Types
          </h4>
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-gray-700">Checkup</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-gray-700">Consultation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <span className="text-gray-700">Follow-up</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-purple-500 rounded"></div>
              <span className="text-gray-700">Procedure</span>
            </div>
          </div>
        </div>
      )}

      {/* Mobile scroll hint */}
      <div className="mt-2 text-center text-xs text-gray-500 md:hidden">
        ← Swipe to see more days →
      </div>
    </div>
  );
}

/**
 * TODO: Consider reusing the AppointmentCard component from DayView
 *
 * You might want to add a "compact" prop to make it smaller for week view
 */
