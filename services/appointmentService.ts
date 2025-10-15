/**
 * Appointment Service
 *
 * This service provides an abstraction layer for accessing appointment data.
 * It's your data access layer - implement the methods to fetch and filter appointments.
 *
 * TODO for candidates:
 * 1. Implement getAppointmentsByDoctor
 * 2. Implement getAppointmentsByDoctorAndDate
 * 3. Implement getAppointmentsByDoctorAndDateRange (for week view)
 * 4. Consider adding helper methods for filtering, sorting, etc.
 * 5. Think about how to structure this for testability
 */

import type { Appointment, Doctor, Patient, PopulatedAppointment } from '@/types';
import {
  MOCK_APPOINTMENTS,
  MOCK_DOCTORS,
  MOCK_PATIENTS,
  getDoctorById,
  getPatientById,
} from '@/data/mockData';

/**
 * AppointmentService class
 *
 * Provides methods to access and manipulate appointment data.
 * This is where you abstract data access from your components.
 */
export class AppointmentService {
  /**
   * Get all appointments for a specific doctor
   *
   * TODO: Implement this method
   */
  getAppointmentsByDoctor(doctorId: string): Appointment[] {
    return MOCK_APPOINTMENTS.filter(apt => apt.doctorId === doctorId);
  }

  /**
   * Get appointments for a specific doctor on a specific date
   *
   * TODO: Implement this method
   * @param doctorId - The doctor's ID
   * @param date - The date to filter by
   * @returns Array of appointments for that doctor on that date
   */
  getAppointmentsByDoctorAndDate(doctorId: string, date: Date): Appointment[] {
    // TODO: Implement - filter by doctor AND date
    // Hint: You'll need to compare dates properly (same day, ignoring time)
    const doctorAppointments = this.getAppointmentsByDoctor(doctorId);
    // Create start and end of day boundaries
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    // Filter appointments that fall on this specific date
    return doctorAppointments.filter(apt => {
      const aptStart = new Date(apt.startTime);
      return aptStart >= startOfDay && aptStart <= endOfDay;
    });
  }


  /**
   * Get appointments for a specific doctor within a date range (for week view)
   *
   * TODO: Implement this method
   * @param doctorId - The doctor's ID
   * @param startDate - Start of the date range
   * @param endDate - End of the date range
   * @returns Array of appointments within the date range
   */
  getAppointmentsByDoctorAndDateRange(
    doctorId: string,
    startDate: Date,
    endDate: Date
  ): Appointment[] {
    // TODO: Implement - filter by doctor AND date range
   const doctorAppointments = this.getAppointmentsByDoctor(doctorId);
    
    // Set time boundaries
    const rangeStart = new Date(startDate);
    rangeStart.setHours(0, 0, 0, 0);
    
    const rangeEnd = new Date(endDate);
    rangeEnd.setHours(23, 59, 59, 999);
    
    // Filter appointments within the date range
    return doctorAppointments.filter(apt => {
      const aptStart = new Date(apt.startTime);
      return aptStart >= rangeStart && aptStart <= rangeEnd;
    });
  
  }

  /**
   * Get a populated appointment (with patient and doctor objects)
   *
   * This is useful for display purposes where you need patient/doctor details
   *
   * TODO: Implement this helper method
   */
  getPopulatedAppointment(appointment: Appointment): PopulatedAppointment | null {
    // TODO: Implement - merge appointment with patient and doctor data
    // Hint: Use getDoctorById and getPatientById from mockData
    const doctor = getDoctorById(appointment.doctorId);
    const patient = getPatientById(appointment.patientId);
    
    // If either doctor or patient is not found, return null
    if (!doctor || !patient) {
      return null;
    }
    
    // Return appointment with populated data
    return {
      ...appointment,
      doctor,
      patient
    };
  
  }

  /**
   * Get all doctors
   *
   * TODO: Implement this method
   */
  getAllDoctors(): Doctor[] {
    // TODO: Implement - return all doctors
    return MOCK_DOCTORS;
  }

  /**
   * Get doctor by ID
   *
   * TODO: Implement this method
   */
  getDoctorById(id: string): Doctor | undefined {
    // TODO: Implement - find doctor by ID
      return getDoctorById(id);

  }

  /**
   * BONUS: Add any other helper methods you think would be useful
   * Examples:
   * - Sort appointments by time
   * - Check for overlapping appointments
   * - Get appointments by type
   * - etc.
   */

  /**
   * Get all patients
   */
  getAllPatients(): Patient[] {
    return MOCK_PATIENTS;
  }

  /**
   * Get patient by ID
   */
  getPatientById(id: string): Patient | undefined {
    return getPatientById(id);
  }

  /**
   * BONUS: Sort appointments by start time
   */
  sortAppointmentsByTime(appointments: Appointment[]): Appointment[] {
    return [...appointments].sort((a, b) => {
      const timeA = new Date(a.startTime).getTime();
      const timeB = new Date(b.startTime).getTime();
      return timeA - timeB;
    });
  }

  /**
   * BONUS: Check for overlapping appointments
   */
  checkOverlap(apt1: Appointment, apt2: Appointment): boolean {
    const start1 = new Date(apt1.startTime);
    const end1 = new Date(apt1.endTime);
    const start2 = new Date(apt2.startTime);
    const end2 = new Date(apt2.endTime);

    return (
      (start1 >= start2 && start1 < end2) ||
      (end1 > start2 && end1 <= end2) ||
      (start1 <= start2 && end1 >= end2)
    );
  }

  /**
   * BONUS: Get appointments by type
   */
  getAppointmentsByType(appointments: Appointment[], type: string): Appointment[] {
    return appointments.filter(apt => apt.type === type);
  }

  /**
   * BONUS: Get appointments by status
   */
  getAppointmentsByStatus(appointments: Appointment[], status: string): Appointment[] {
    return appointments.filter(apt => apt.status === status);
  }

  /**
   * BONUS: Get populated appointments (batch operation)
   * Returns appointments with patient and doctor data
   */
  getPopulatedAppointments(appointments: Appointment[]): PopulatedAppointment[] {
    return appointments
      .map(apt => this.getPopulatedAppointment(apt))
      .filter((apt): apt is PopulatedAppointment => apt !== null);
  }

  /**
   * BONUS: Get appointment duration in minutes
   */
  getAppointmentDuration(appointment: Appointment): number {
    const start = new Date(appointment.startTime);
    const end = new Date(appointment.endTime);
    return (end.getTime() - start.getTime()) / (1000 * 60);
  }

  /**
   * BONUS: Find overlapping appointments for a specific time slot
   */
  findOverlappingAppointments(
    appointments: Appointment[],
    timeStart: Date,
    timeEnd: Date
  ): Appointment[] {
    return appointments.filter(apt => {
      const aptStart = new Date(apt.startTime);
      const aptEnd = new Date(apt.endTime);

      return (
        (aptStart >= timeStart && aptStart < timeEnd) ||
        (aptEnd > timeStart && aptEnd <= timeEnd) ||
        (aptStart <= timeStart && aptEnd >= timeEnd)
      );
    });
  }

  /**
   * BONUS: Get appointments count by doctor
   */
  getAppointmentsCountByDoctor(): Record<string, number> {
    const counts: Record<string, number> = {};
    
    MOCK_APPOINTMENTS.forEach(apt => {
      counts[apt.doctorId] = (counts[apt.doctorId] || 0) + 1;
    });
    
    return counts;
  }

  /**
   * BONUS: Get available time slots for a doctor on a specific date
   * This is useful for future appointment booking functionality
   */
  getAvailableTimeSlots(
    doctorId: string,
    date: Date,
    slotDuration: number = 30
  ): Date[] {
    const doctor = this.getDoctorById(doctorId);
    if (!doctor) return [];

    const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][date.getDay()] as keyof typeof doctor.workingHours;
    const workingHours = doctor.workingHours[dayOfWeek];
    
    if (!workingHours) return [];

    // Get existing appointments for this day
    const appointments = this.getAppointmentsByDoctorAndDate(doctorId, date);

    // Parse working hours
    const [startHour, startMin] = workingHours.start.split(':').map(Number);
    const [endHour, endMin] = workingHours.end.split(':').map(Number);

    const availableSlots: Date[] = [];
    const current = new Date(date);
    current.setHours(startHour, startMin, 0, 0);

    const endTime = new Date(date);
    endTime.setHours(endHour, endMin, 0, 0);

    // Generate all possible time slots
    while (current < endTime) {
      const slotEnd = new Date(current);
      slotEnd.setMinutes(current.getMinutes() + slotDuration);

      // Check if this slot overlaps with any existing appointment
      const hasOverlap = appointments.some(apt => {
        const aptStart = new Date(apt.startTime);
        const aptEnd = new Date(apt.endTime);
        return (
          (current >= aptStart && current < aptEnd) ||
          (slotEnd > aptStart && slotEnd <= aptEnd) ||
          (current <= aptStart && slotEnd >= aptEnd)
        );
      });

      if (!hasOverlap) {
        availableSlots.push(new Date(current));
      }

      current.setMinutes(current.getMinutes() + slotDuration);
    }

    return availableSlots;
  }


/**
 * Singleton instance (optional pattern)
 *
 * You can either:
 * 1. Export a singleton instance: export const appointmentService = new AppointmentService();
 * 2. Or let consumers create their own instances: new AppointmentService()
 *
 * Consider which is better for your architecture and testing needs.
 */
}
export const appointmentService = new AppointmentService();
