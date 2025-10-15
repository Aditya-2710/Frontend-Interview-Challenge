/**
 * useAppointments Hook
 *
 * This is a custom hook that encapsulates the business logic for fetching
 * and managing appointments. This is the "headless" pattern - separating
 * logic from presentation.
 *
 * TODO for candidates:
 * 1. Implement the hook to fetch appointments based on filters
 * 2. Add loading and error states
 * 3. Consider memoization for performance
 * 4. Think about how to make this reusable for both day and week views
 */

import { useState, useEffect, useMemo } from 'react';
import type { Appointment, Doctor } from '@/types';
import { appointmentService } from '@/services/appointmentService';

/**
 * Hook parameters
 */
interface UseAppointmentsParams {
  doctorId: string;
  date: Date;
  // For week view, you might want to pass a date range instead
  startDate?: Date;
  endDate?: Date;
}

/**
 * Hook return value
 */
interface UseAppointmentsReturn {
  appointments: Appointment[];
  doctor: Doctor | undefined;
  loading: boolean;
  error: Error | null;
  // Add any other useful data or functions
}

/**
 * useAppointments Hook
 *
 * Fetches and manages appointment data for a given doctor and date/date range.
 *
 * TODO: Implement this hook
 *
 * Tips:
 * - Use useState for loading and error states
 * - Use useEffect to fetch data when params change
 * - Use useMemo to memoize expensive computations
 * - Consider how to handle both single date (day view) and date range (week view)
 */
export function useAppointments(params: UseAppointmentsParams): UseAppointmentsReturn {
  const { doctorId, date, startDate, endDate } = params;

  // TODO: Add state for appointments, loading, error
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // TODO: Fetch doctor data
  const doctor = useMemo(() => {
    try {
      return appointmentService.getDoctorById(doctorId);
    } catch (err) {
      console.error('Error fetching doctor:', err);
    }
    // Implement: Get doctor by ID
    // return appointmentService.getDoctorById(doctorId);
    return undefined;
  }, [doctorId]);

  // TODO: Fetch appointments when dependencies change
  useEffect(() => {
    // Implement: Fetch appointments
    // Consider:
    // - If startDate and endDate are provided, use date range
    // - Otherwise, use single date
    // - Set loading state
    // - Handle errors
    // - Set appointments

    console.log('TODO: Fetch appointments for', { doctorId, date, startDate, endDate });

    // Placeholder - remove when implementing
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError(null);

        let fetchedAppointments: Appointment[];

        // If startDate and endDate are provided, use date range (for week view)
        if (startDate && endDate) {
          fetchedAppointments = appointmentService.getAppointmentsByDoctorAndDateRange(
            doctorId,
            startDate,
            endDate
          );
        } else {
          // Otherwise, use single date (for day view)
          fetchedAppointments = appointmentService.getAppointmentsByDoctorAndDate(
            doctorId,
            date
          );
        }

        // Sort appointments by start time for better display
        const sortedAppointments = appointmentService.sortAppointmentsByTime(fetchedAppointments);

        setAppointments(sortedAppointments);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [doctorId, date, startDate, endDate]);

  return {
    appointments,
    doctor,
    loading,
    error,
  };
}
export function useDayViewAppointments(doctorId: string, date: Date) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctor, setDoctor] = useState<Doctor | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      setLoading(true);
      setError(null);

      // Fetch doctor
      const fetchedDoctor = appointmentService.getDoctorById(doctorId);
      
      // Fetch appointments for the specific day
      const fetchedAppointments = appointmentService.getAppointmentsByDoctorAndDate(
        doctorId,
        date
      );

      // Sort by time
      const sortedAppointments = appointmentService.sortAppointmentsByTime(fetchedAppointments);

      setDoctor(fetchedDoctor);
      setAppointments(sortedAppointments);
    } catch (err) {
      console.error('Error in useDayViewAppointments:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [doctorId, date]);

  // Memoize populated appointments (with patient data)
  const populatedAppointments = useMemo(() => {
    return appointmentService.getPopulatedAppointments(appointments);
  }, [appointments]);

  return {
    appointments,
    populatedAppointments,
    doctor,
    loading,
    error,
  };
}

/**
 * BONUS: useWeekViewAppointments Hook
 * Specialized hook for week view - fetches appointments for a week
 */
export function useWeekViewAppointments(doctorId: string, weekStartDate: Date) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctor, setDoctor] = useState<Doctor | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Calculate week end date (6 days after start)
  const weekEndDate = useMemo(() => {
    const endDate = new Date(weekStartDate);
    endDate.setDate(endDate.getDate() + 6);
    endDate.setHours(23, 59, 59, 999);
    return endDate;
  }, [weekStartDate]);

  // Generate array of 7 dates for the week
  const weekDays = useMemo(() => {
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStartDate);
      day.setDate(weekStartDate.getDate() + i);
      days.push(day);
    }
    return days;
  }, [weekStartDate]);

  useEffect(() => {
    try {
      setLoading(true);
      setError(null);

      // Fetch doctor
      const fetchedDoctor = appointmentService.getDoctorById(doctorId);
      
      // Fetch appointments for the week range
      const fetchedAppointments = appointmentService.getAppointmentsByDoctorAndDateRange(
        doctorId,
        weekStartDate,
        weekEndDate
      );

      // Sort by time
      const sortedAppointments = appointmentService.sortAppointmentsByTime(fetchedAppointments);

      setDoctor(fetchedDoctor);
      setAppointments(sortedAppointments);
    } catch (err) {
      console.error('Error in useWeekViewAppointments:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [doctorId, weekStartDate, weekEndDate]);

  // Memoize populated appointments
  const populatedAppointments = useMemo(() => {
    return appointmentService.getPopulatedAppointments(appointments);
  }, [appointments]);

  return {
    appointments,
    populatedAppointments,
    doctor,
    weekDays,
    weekStartDate,
    weekEndDate,
    loading,
    error,
  };
}

/**
 * BONUS: useDoctors Hook
 * Hook to get all doctors - useful for doctor selector
 */
export function useDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all doctors
      const allDoctors = appointmentService.getAllDoctors();
      setDoctors(allDoctors);
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Memoize doctors by specialty
  const doctorsBySpecialty = useMemo(() => {
    const grouped: Record<string, Doctor[]> = {};
    doctors.forEach(doctor => {
      if (!grouped[doctor.specialty]) {
        grouped[doctor.specialty] = [];
      }
      grouped[doctor.specialty].push(doctor);
    });
    return grouped;
  }, [doctors]);

  return {
    doctors,
    doctorsBySpecialty,
    loading,
    error,
  };
}

/**
 * BONUS: useAppointmentStats Hook
 * Hook to get appointment statistics for a doctor
 */
export function useAppointmentStats(doctorId: string, date: Date) {
  const { appointments, loading } = useDayViewAppointments(doctorId, date);

  const stats = useMemo(() => {
    const total = appointments.length;
    
    // Count by type
    const byType = appointments.reduce((acc, apt) => {
      acc[apt.type] = (acc[apt.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Count by status
    const byStatus = appointments.reduce((acc, apt) => {
      acc[apt.status] = (acc[apt.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculate total duration
    const totalDuration = appointments.reduce((sum, apt) => {
      return sum + appointmentService.getAppointmentDuration(apt);
    }, 0);

    return {
      total,
      byType,
      byStatus,
      totalDuration,
      averageDuration: total > 0 ? totalDuration / total : 0,
    };
  }, [appointments]);

  return {
    stats,
    loading,
  };
}

/**
 * BONUS: Create additional hooks for specific use cases
 *
 * Examples:
 * - useDayViewAppointments(doctorId: string, date: Date)
 * - useWeekViewAppointments(doctorId: string, weekStartDate: Date)
 * - useDoctors() - hook to get all doctors
 */
