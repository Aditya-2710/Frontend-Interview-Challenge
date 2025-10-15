# Hospital Appointment Scheduler - Frontend Challenge

## Implementation Summary

### Architecture Decisions

#### Service Layer
- Created `AppointmentService` class to abstract data access
- Provides clean API for fetching appointments, doctors, and patients
- Used singleton pattern for easy import and consistent state
- Easy to replace with real API calls in the future

#### Custom Hooks (Headless Pattern)
- `useAppointments`: Manages day view state and data fetching
- `useWeekAppointments`: Manages week view state with date ranges
- `useDoctors`: Fetches and manages doctors list
- Separates business logic from UI components
- Enables reusability and easier testing

#### Domain Models
- `TimeSlot` class encapsulates time slot logic
- Provides reusable methods for overlap detection
- `generateTimeSlots` utility creates 30-minute intervals from 8 AM to 6 PM

#### Component Structure
```
ScheduleView (Container)
├── DoctorSelector (Doctor selection dropdown)
├── Controls (Date picker, View toggle)
└── Calendar Views
├── DayView (Single day timeline)
│ └── Appointment Cards (30-min slots)
└── WeekView (7-day grid)
└── Compact Appointment Cards
```

### Features Implemented

#### Core Features
- ✅ Day view with 30-minute time slots (8 AM - 6 PM)
- ✅ Week view with 7-day grid (Monday - Sunday)
- ✅ Doctor selector dropdown with specialty info
- ✅ Date picker for navigation
- ✅ View toggle (Day/Week)
- ✅ Color-coded appointments by type
- ✅ Responsive design
- ✅ Loading states
- ✅ Empty states

#### Technical Implementation
- ✅ Service layer for data access
- ✅ Custom hooks for business logic
- ✅ TypeScript throughout (no `any` types)
- ✅ Domain models for time slot logic
- ✅ Proper date handling with `date-fns`
- ✅ Clean component composition

### Trade-offs & Future Improvements

With more time, I would implement:

1. **Drag-and-Drop**: Allow rescheduling appointments by dragging
2. **Appointment Details Modal**: Show full appointment details on click
3. **Filtering & Search**: Filter by appointment type, search patients
4. **Current Time Indicator**: Red line showing current time on timeline
5. **Print View**: Printer-friendly schedule format
6. **Dark Mode**: Theme toggle for dark mode
7. **Accessibility**: Full ARIA labels, keyboard navigation
8. **Optimistic Updates**: Instant UI updates before server confirmation
9. **Unit Tests**: Comprehensive testing for service layer and hooks
10. **Multiple Doctor View**: Side-by-side comparison of schedules

### Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Date Utilities**: date-fns
- **State Management**: React hooks (useState, useEffect, useMemo)
- **Architecture Patterns**: 
  - Service Layer Pattern
  - Headless Component Pattern
  - Domain Model Pattern
  - Singleton Pattern

### Running the Project
```
Install dependencies
npm install

Run development server
npm run dev

Build for production
npm run build

Run production build
npm start
```

Visit `http://localhost:3000/schedule` to view the application.

---

## Author Notes

This implementation demonstrates:
- Clean architecture with separation of concerns
- Modern React patterns (custom hooks, composition)
- Type-safe TypeScript throughout
- Responsive UI with Tailwind CSS
- Scalable structure ready for future features

The codebase is structured to be maintainable, testable, and easy to extend.
