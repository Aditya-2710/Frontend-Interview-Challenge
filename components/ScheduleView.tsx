/**
 * ScheduleView Component
 *
 * Main component that orchestrates the schedule display.
 * This component should compose smaller components together.
 *
 * TODO for candidates:
 * 1. Create the component structure (header, controls, calendar)
 * 2. Compose DoctorSelector, DayView, WeekView together
 * 3. Handle view switching (day vs week)
 * 4. Manage state or use the useAppointments hook
 * 5. Think about component composition and reusability
 */

'use client';

import { useState } from 'react';
import type { CalendarView } from '@/types';
import { DoctorSelector } from './DoctorSelector';
import { DayView } from './DayView';
import { WeekView } from './WeekView';
import { useAppointments } from '@/hooks/useAppointments';
import { appointmentService } from '@/services/appointmentService';

// TODO: Import your components
// import { DoctorSelector } from './DoctorSelector';
// import { DayView } from './DayView';
// import { WeekView } from './WeekView';

interface ScheduleViewProps {
  selectedDoctorId: string;
  selectedDate: Date;
  view: CalendarView;
  onDoctorChange: (doctorId: string) => void;
  onDateChange: (date: Date) => void;
  onViewChange: (view: CalendarView) => void;
}


function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  const monday = new Date(d.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
}

/**
 * ScheduleView Component
 *
 * This is the main container component for the schedule interface.
 *
 * TODO: Implement this component
 *
 * Consider:
 * - How to structure the layout (header, controls, calendar)
 * - How to compose smaller components
 * - How to pass data down to child components
 * - How to handle user interactions (view switching, date changes)
 */
export function ScheduleView({
  selectedDoctorId,
  selectedDate,
  view,
  onDoctorChange,
  onDateChange,
  onViewChange,
}: ScheduleViewProps) {
  // TODO: Use the useAppointments hook to fetch data
   const weekStartDate = getWeekStart(selectedDate);
  
  // Calculate week end date for data fetching
  const weekEndDate = new Date(weekStartDate);
  weekEndDate.setDate(weekEndDate.getDate() + 6);
  weekEndDate.setHours(23, 59, 59, 999);

  // Fetch appointments using the useAppointments hook
  const { appointments, doctor, loading, error } = useAppointments({
    doctorId: selectedDoctorId,
    date: selectedDate,
    startDate: view === 'week' ? weekStartDate : undefined,
    endDate: view === 'week' ? weekEndDate : undefined,
  });

  // Get all doctors for the selector
  const allDoctors = appointmentService.getAllDoctors();

  // Format date for display
  const formattedDate = selectedDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // const { appointments, doctor, loading, error } = useAppointments({
  //   doctorId: selectedDoctorId,
  //   date: selectedDate,
  // });

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* TODO: Implement the component structure */}
 <div className="border-b border-gray-200 p-6 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="space-y-4">
          {/* Title and Doctor Info */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Doctor Schedule</h2>
            {doctor && (
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-semibold">Dr. {doctor.name}</span> - {' '}
                {doctor.specialty.charAt(0).toUpperCase() + doctor.specialty.slice(1)}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {view === 'day' ? formattedDate : `Week of ${weekStartDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
            </p>
          </div>

          {/* Controls Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Doctor Selector */}
            <div>
              <DoctorSelector
                selectedDoctorId={selectedDoctorId}
                onDoctorChange={onDoctorChange}
              />
            </div>

            {/* Date Picker */}
            <div>
              <label htmlFor="date-picker" className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
              </label>
              <input
                id="date-picker"
                type="date"
                value={selectedDate.toISOString().split('T')[0]}
                onChange={(e) => {
                  const newDate = new Date(e.target.value + 'T00:00:00');
                  onDateChange(newDate);
                }}
                className="block w-full px-4 py-2 text-sm border text-gray-500 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* View Toggle Buttons */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                View Mode
              </label>
              <div className="flex gap-2">
                <button
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    view === 'day'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  onClick={() => onViewChange('day')}
                >
                  Day View
                </button>
                <button
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    view === 'week'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  onClick={() => onViewChange('week')}
                >
                  Week View
                </button>
              </div>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => {
                const prevDate = new Date(selectedDate);
                prevDate.setDate(prevDate.getDate() - (view === 'week' ? 7 : 1));
                onDateChange(prevDate);
              }}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Previous {view === 'week' ? 'Week' : 'Day'}
            </button>
            
            <button
              onClick={() => onDateChange(new Date())}
              className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-300 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Today
            </button>
            
            <button
              onClick={() => {
                const nextDate = new Date(selectedDate);
                nextDate.setDate(nextDate.getDate() + (view === 'week' ? 7 : 1));
                onDateChange(nextDate);
              }}
              className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Next {view === 'week' ? 'Week' : 'Day'} →
            </button>
          </div>
        </div>
      </div>

      {/* Calendar View */}
      <div className="p-6">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-sm text-gray-600">Loading appointments...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <svg
              className="w-12 h-12 text-red-400 mx-auto mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-red-700 font-medium">Error loading appointments</p>
            <p className="text-red-600 text-sm mt-1">{error.message}</p>
          </div>
        )}

        {/* Calendar Views */}
        {!loading && !error && (
          <>
            {view === 'day' ? (
              <DayView
                appointments={appointments}
                doctor={doctor}
                date={selectedDate}
              />
            ) : (
              <WeekView
                appointments={appointments}
                doctor={doctor}
                weekStartDate={weekStartDate}
              />
            )}
          </>
        )}
      </div>

      {/* Footer with stats */}
      {!loading && !error && appointments.length > 0 && (
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex flex-wrap gap-6 text-sm">
            <div>
              <span className="text-gray-600">Total Appointments:</span>
              <span className="ml-2 font-semibold text-gray-900">{appointments.length}</span>
            </div>
            
            <div>
              <span className="text-gray-600">Checkups:</span>
              <span className="ml-2 font-semibold text-blue-700">
                {appointments.filter(a => a.type === 'checkup').length}
              </span>
            </div>
            
            <div>
              <span className="text-gray-600">Consultations:</span>
              <span className="ml-2 font-semibold text-green-700">
                {appointments.filter(a => a.type === 'consultation').length}
              </span>
            </div>
            
            <div>
              <span className="text-gray-600">Follow-ups:</span>
              <span className="ml-2 font-semibold text-orange-700">
                {appointments.filter(a => a.type === 'follow-up').length}
              </span>
            </div>
            
            <div>
              <span className="text-gray-600">Procedures:</span>
              <span className="ml-2 font-semibold text-purple-700">
                {appointments.filter(a => a.type === 'procedure').length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}