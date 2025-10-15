/**
 * Schedule Page
 *
 * Main page for the appointment scheduler.
 * This is where candidates will implement the calendar views.
 *
 * TODO for candidates:
 * 1. Import and use the ScheduleView component
 * 2. Set up state for selected doctor and date
 * 3. Handle view switching (day/week)
 */

'use client';

import { useState } from 'react';
import { MOCK_DOCTORS } from '@/data/mockData';
import type { CalendarView } from '@/types';
import { ScheduleView } from '@/components/ScheduleView';

// TODO: Import your components here
// import { ScheduleView } from '@/components/ScheduleView';

export default function SchedulePage() {
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(MOCK_DOCTORS[0].id);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<CalendarView>('day');

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Hospital Appointment Scheduler
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              View and manage doctor appointments across the hospital
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ScheduleView Component */}
        <ScheduleView
          selectedDoctorId={selectedDoctorId}
          selectedDate={selectedDate}
          view={view}
          onDoctorChange={setSelectedDoctorId}
          onDateChange={setSelectedDate}
          onViewChange={setView}
        />
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Hospital Appointment Scheduler
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Built with Next.js 14, TypeScript, and Tailwind CSS
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
