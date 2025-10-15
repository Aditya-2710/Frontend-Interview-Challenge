/**
 * TimeSlot Domain Model
 * Represents a time slot in the calendar and provides utility methods
 */

export class TimeSlot {
  constructor(
    public start: Date,
    public end: Date,
    public label: string
  ) {}

  /**
   * Check if an appointment overlaps with this time slot
   */
  overlaps(appointmentStart: Date, appointmentEnd: Date): boolean {
    return (
      (appointmentStart >= this.start && appointmentStart < this.end) ||
      (appointmentEnd > this.start && appointmentEnd <= this.end) ||
      (appointmentStart <= this.start && appointmentEnd >= this.end)
    );
  }

  /**
   * Check if this slot contains a specific time
   */
  contains(time: Date): boolean {
    return time >= this.start && time < this.end;
  }

  /**
   * Get the duration of this slot in minutes
   */
  getDurationMinutes(): number {
    return (this.end.getTime() - this.start.getTime()) / (1000 * 60);
  }
}

/**
 * Generate time slots for a day (8 AM - 6 PM, 30-minute intervals)
 * @param date - The date to generate slots for
 * @returns Array of TimeSlot objects
 */
export function generateTimeSlots(date: Date): TimeSlot[] {
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
      
      slots.push(new TimeSlot(start, end, label));
    }
  }
  
  return slots;
}

/**
 * Generate time slots for multiple days
 */
export function generateTimeSlotsForDays(dates: Date[]): Map<string, TimeSlot[]> {
  const slotsMap = new Map<string, TimeSlot[]>();
  
  dates.forEach(date => {
    const dateKey = date.toISOString().split('T')[0];
    slotsMap.set(dateKey, generateTimeSlots(date));
  });
  
  return slotsMap;
}
