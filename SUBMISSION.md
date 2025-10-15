# Frontend Challenge Submission

**Candidate Name:** [Aditya Singh]
**Date:** [161/10/2025]
**Time Spent:** [3hrs]

---

## ✅ Completed Features

Mark which features you completed:

### Core Features
- [✅] Day View calendar (time slots 8 AM - 6 PM)
- [✅] Week View calendar (7-day grid)
- [✅] Doctor selector dropdown
- [✅] Appointment rendering with correct positioning
- [✅] Color-coding by appointment type
- [✅] Service layer implementation
- [✅] Custom hooks (headless pattern)
- [✅] Component composition

### Bonus Features (if any)
- [✅] Current time indicator
- [✅] Responsive design (mobile-friendly)
- [✅] Empty states
- [✅] Loading states
- [✅] Error handling
- [ ] Appointment search/filter
- [ ] Dark mode
- [✅] Accessibility improvements
- [✅] Other: _________________

---

## 🏗️ Architecture Decisions

### Component Structure

Describe your component hierarchy:

```
SchedulePage (State Management Layer)
└── ScheduleView (Orchestration Layer)
├── Header Section
│ ├── Title & Doctor Info
│ ├── DoctorSelector (Dropdown Component)
│ ├── DatePicker (Native Input)
│ ├── ViewToggle (Day/Week Buttons)
│ └── QuickNavigation (Prev/Today/Next)
│
├── Loading State (Conditional)
│ └── Spinner + Message
│
├── Error State (Conditional)
│ └── Error Display
│
├── Calendar Views (Conditional Rendering)
│ ├── DayView (Day Calendar)
│ │ ├── Day Header
│ │ ├── Timeline Grid
│ │ │ ├── TimeSlot Rows (x20)
│ │ │ │ ├── Time Label
│ │ │ │ └── Appointment Area
│ │ │ │ └── AppointmentCard
│ │ │ └── Empty State
│ │ └── Legend
│ │
│ └── WeekView (Week Calendar)
│ ├── Week Header
│ ├── Table Grid
│ │ ├── Header Row (Days)
│ │ └── Body Rows (Time Slots)
│ │ ├── Time Cell
│ │ └── Day Cells (x7)
│ │ └── CompactAppointmentCard
│ └── Legend
│
└── Statistics Footer (Conditional)
└── Appointment Counts by Type
```

**Your structure:**
```
I used a layered architecture with clear separation of concerns:
 1. State Management Layer (SchedulePage): Owns all state and passes down via props, implementing the controlled component pattern.
 2. Orchestration Layer (ScheduleView): Composes all child components together, handles data fetching via hooks, and manages conditional rendering.
 3. Presentation Layer (DayView, WeekView, etc.): Purely presentational components that receive data via props and focus on UI rendering.


```

**Why did you structure it this way?**

[Explain your reasoning - what patterns did you use? Why?]

 This structure provides:
- Maintainability: Easy to modify individual components
- Testability: Each layer can be tested independently
- Reusability: Components like AppointmentCard can be reused
- Scalability: Easy to add new views or features

---

### State Management

**What state management approach did you use?**
- [✅] useState + useEffect only
- [✅] Custom hooks (headless pattern)
- [ ] React Context
- [ ] External library (Redux, Zustand, etc.)
- [ ] Other: _________________

**Why did you choose this approach?**

[Explain your reasoning]

I chose **useState with custom hooks** because:

1. Appropriate Scale: The application has simple, local state that doesn't need global state management. Three main state variables (doctorId, date, view) are sufficient.

2. Headless Pattern: Custom hooks (`useAppointments`, `useDayViewAppointments`, `useWeekViewAppointments`) encapsulate all business logic and data fetching, keeping components clean and focused on presentation.

3. Performance: React's built-in hooks are lightweight and efficient for this use case. No need for additional libraries.

---

### Service Layer

**How did you structure your data access?**

[Describe your service layer architecture - did you use a class, functions, or something else?]

I implemented a **class-based service layer** pattern with the `AppointmentService` class:

export class AppointmentService {
// Core methods
getAppointmentsByDoctor(doctorId: string): Appointment[]
getAppointmentsByDoctorAndDate(doctorId: string, date: Date): Appointment[]
getAppointmentsByDoctorAndDateRange(doctorId, startDate, endDate): Appointment[]

// Helper methods
getAllDoctors(): Doctor[]
getDoctorById(id: string): Doctor | undefined
getPatientById(id: string): Patient | undefined
getPopulatedAppointments(appointments): EnrichedAppointment[]

// Utility methods
sortAppointmentsByTime(appointments): Appointment[]
checkOverlap(apt1, apt2): boolean
getAppointmentDuration(appointment): number
}

// Singleton export
export const appointmentService = new AppointmentService();

**What methods did you implement in AppointmentService?**

- [✅] getAppointmentsByDoctor
- [✅] getAppointmentsByDoctorAndDate
- [✅] getAppointmentsByDoctorAndDateRange
- [✅] getPopulatedAppointment
- [✅] getAllDoctors
- [✅] Other: _________________

---

### Custom Hooks

**What custom hooks did you create?**

1. `useAppointments` - [ Flexible hook that handles both day and week views
   - Accepts doctorId, date, and optional startDate/endDate
   - Automatically fetches correct data based on parameters
   - Returns: appointments, doctor, loading, error
   - Implements headless pattern by handling all data fetching logic]
2. `useDayViewAppointments(doctorId, date)` - Specialized hook for day view
   - Optimized for single-day queries
   - Returns populated appointments with patient data
   - Memoizes expensive operations
   - Returns: appointments, populatedAppointments, doctor, loading, error

3. `useWeekViewAppointments(doctorId, weekStartDate)` - Specialized hook for week view
   - Calculates week end date automatically
   - Generates array of 7 week days
   - Fetches date range efficiently
   - Returns: appointments, populatedAppointments, doctor, weekDays, weekStartDate, weekEndDate, loading, error

4. `useDoctors()` - Hook for fetching all doctors
   - Used by DoctorSelector component
   - Groups doctors by specialty
   - Returns: doctors, doctorsBySpecialty, loading, error


**How do they demonstrate the headless pattern?**

These hooks perfectly demonstrate the **headless component pattern** by:

1. **Separation of Concerns**: All business logic (data fetching, state management, calculations) lives in hooks, while components only handle presentation

2. **Reusability**: Hooks can be used by any component that needs appointment data

3. **No UI Dependencies**: Hooks return only data and state, no JSX or styling

4. **Composability**: Hooks can be composed together if needed

---

## 🎨 UI/UX Decisions

### Calendar Rendering

**How did you generate time slots?**

I created a `generateTimeSlots(date)` function that:
1. Loops from 8 AM (hour 8) to 6 PM (hour 18)
2. Creates slots at 0 and 30 minutes of each hour (30-minute intervals)
3. Generates Date objects for start and end times
4. Formats labels in 12-hour format (e.g., "9:00 AM", "9:30 AM")
5. Returns array of TimeSlot objects: `{ start: Date, end: Date, label: string }`

Result: 20 time slots covering 10 hours (8 AM - 6 PM)

**How did you position appointments in time slots?**

I used a **relative/absolute positioning strategy**:

1. Each time slot row is a flex container with `position: relative`
2. Appointment cards use `position: absolute` within their slot
3. Calculate height based on duration: `(duration / 30) * 60px`
4. Only render card in its first slot using `isFirstSlotOfAppointment()` check
5. Card automatically spans multiple slots via calculated height

Benefits:
- Appointments can span multiple 30-min slots
- Visual representation matches actual duration


**How did you handle overlapping appointments?**


Current implementation:
- Appointments stack vertically (z-index: 10)
- Last appointment in DOM appears on top
- Both appointments visible but may overlap
- Hover effect helps identify individual appointments
- Tooltips show full details on hover

Future improvement:
- Could implement side-by-side positioning
- Could add visual indicator for conflicts
- Could adjust width to show multiple appointments in one slot

---

### Responsive Design

**Is your calendar mobile-friendly?**
- [✅] Yes, fully responsive
- [ ] Partially (some responsive elements)
- [ ] No (desktop only)

**What responsive strategies did you use?**

1. Responsive Grid Layout:
   - Controls section uses `grid grid-cols-1 md:grid-cols-3`
   - Stacks vertically on mobile, 3 columns on desktop

2. Horizontal Scroll for Week View:
   - `overflow-x-auto` on week grid container
   - Table maintains structure while scrolling horizontally
   - Mobile scroll hint: "← Swipe to see more days →"

3. Flexible Containers:
   - Max-width constraints: `max-w-7xl mx-auto`
   - Padding adjustments: `px-4 sm:px-6 lg:px-8`
   - Responsive spacing with Tailwind breakpoints

4. Mobile-Optimized Components:
   - CompactAppointmentCard for week view uses smaller text sizes
   - Truncated text to fit mobile screens
   - Touch-friendly button sizes (minimum 44px tap targets)

5. Vertical Scrolling:
   - Day view timeline: `max-h-[600px] overflow-y-auto`
   - Prevents page from being too tall on mobile

6. Responsive Typography:
   - Header sizes adjust: `text-2xl md:text-3xl`
   - Compact fonts in week view: `text-xs` and `text-[10px]`


---

## 🧪 Testing & Quality

### Code Quality

**Did you run these checks?**
- [✅] `npm run lint` - No errors
- [✅] `npm run type-check` - No TypeScript errors
- [✅] `npm run build` - Builds successfully
- [✅] Manual testing - All features work

### Testing Approach

**Did you write any tests?**
- [] Yes (describe below)
- [✅] No (ran out of time)

**If yes, what did you test?**

[List what you tested]

---

## 🤔 Assumptions Made

List any assumptions you made while implementing:

1. **Working Hours**: Assumed all appointments fall within 8 AM - 6 PM time window
2. **30-Minute Slots**: Assumed 30-minute time slot granularity is sufficient
3. **Monday Start Week**: Assumed weeks start on Monday (not Sunday)
4. **Same-Day Appointments**: Assumed no appointments span multiple days
5. **Time Zones**: Assumed all times are in local timezone
6. **Data Structure**: Assumed mock data structure matches TypeScript interfaces exactly
---

## ⚠️ Known Issues / Limitations

Be honest about any bugs or incomplete features:

1. **Overlapping Appointments**: In Day View, overlapping appointments stack on top of each other rather than displaying side-by-side. This makes it hard to see multiple appointments in the same time slot.

2. **Long Patient Names**: Very long patient names get truncated with ellipsis. Full name only visible in tooltip.

3. **Week View Time Indicator**: Current time indicator only highlights the hour slot, not the specific day in week view.

---

## 🚀 Future Improvements

What would you add/improve given more time?

1. **Side-by-Side Overlapping Appointments**: Implement algorithm to position overlapping appointments horizontally so both are fully visible.

2. **Drag-and-Drop Rescheduling**: Allow clicking and dragging appointments to different time slots or days to reschedule.

3. **Virtualization**: Implement virtual scrolling for better performance with large datasets.

4. **Print View**: Add print-optimized layout for physical schedules.

5. **Dark Mode**: Implement dark theme with theme toggle.

6. **Export Functionality**: Export schedule to PDF, iCal, or CSV formats.


---

## 💭 Challenges & Learnings

### Biggest Challenge

What was the most challenging part of this project?

The most challenging part was **implementing the time slot positioning logic** for appointments that span multiple slots in the Day View. 

Specifically:
- Calculating the correct height based on appointment duration
- Ensuring appointments render only once but span multiple time slots
- Handling the math for converting duration in minutes to pixel heights

The solution required:
1. Creating an `isFirstSlotOfAppointment()` function to render only in the first slot
2. Calculating height: `(durationMinutes / 30) * 60px`
3. Using absolute positioning within relative containers

This taught me the importance of breaking down complex problems into smaller, testable functions.

### What Did You Learn?

Did you learn anything new while building this?

Yes! Several things:

1. **Headless Component Pattern**: Deepened understanding of separating business logic from presentation using custom hooks.

2. **Date Manipulation**: Better grasp of JavaScript Date object quirks and best practices for date comparisons (using getTime(), setHours(), etc.).

3. **Calendar Math**: How to calculate week boundaries, generate time ranges, and handle edge cases like Sunday week starts.

4. **TypeScript Best Practices**: Proper interface design, generic types, and avoiding `any` types.


### What Are You Most Proud Of?

What aspect of your implementation are you most proud of?

I'm most proud of the **clean architecture and separation of concerns**:

1. **Service Layer**: The `AppointmentService` class provides a clean abstraction over data access, making it trivial to swap mock data for real API calls.

2. **Headless Hooks**: The custom hooks (`useAppointments`, `useDayViewAppointments`, etc.) perfectly demonstrate the headless pattern, with zero UI logic mixed in.

3. **Component Reusability**: `AppointmentCard` and `CompactAppointmentCard` are reusable and easily testable.

---

## 🎯 Trade-offs

### Time vs. Features

**Where did you spend most of your time?**

- [✅] Architecture/planning
- [✅] Day view implementation
- [✅] Week view implementation
- [✅] Styling/polish
- [ ] Refactoring
- [✅] Other: _________________

**What did you prioritize and why?**

I spent the most time on **Day View implementation** because:

1. **Core Functionality**: It's the primary view users interact with and demonstrates the most complex logic (time slot generation, appointment positioning).

2. **Foundation for Week View**: Once Day View logic was solid, Week View could reuse many concepts (time slots, appointment filtering, positioning).

I prioritized getting the core functionality working correctly over adding bonus features, then added polish and extras as time allowed.

### Technical Trade-offs

**What technical trade-offs did you make?**

1. **Array Filtering vs. Optimized Data Structures**:
   - **Chose**: Simple array `.filter()` methods
   - **Alternative**: Hash maps, indexes, or binary search
   - **Reason**: With current dataset size (50 appointments), performance difference is negligible. Simpler code is more maintainable. Can optimize later if needed.

2. **Table vs. CSS Grid for Week View**:
   - **Chose**: HTML `<table>` structure
   - **Alternative**: CSS Grid or Flexbox
   - **Reason**: Tables provide semantic meaning, natural alignment, and sticky headers work better. Trade-off is less flexibility for complex layouts.

3. **Client-Side Rendering vs. Server Components**:
   - **Chose**: Client-side with 'use client'
   - **Alternative**: Next.js Server Components
   - **Reason**: Interactive features require client-side state. Trade-off is slightly slower initial load, but better for this use case.

4. **Singleton Service vs. Dependency Injection**:
   - **Chose**: Singleton `appointmentService` instance
   - **Alternative**: Pass service instance via props/context
   - **Reason**: Simpler for this scale. Trade-off is harder to mock for testing, but acceptable for demo project.

---

## 📚 Libraries & Tools Used

### Third-Party Libraries
Did you use any additional libraries beyond what was provided?

**Calendar/UI Libraries:**
- [ ] react-big-calendar
- [ ] FullCalendar
- [ ] shadcn/ui
- [ ] Radix UI
- [ ] Headless UI
- [✅] Other: ___none , built from scratch______________

**Utility Libraries:**
- [ ] lodash
- [ ] ramda
- [✅] Other: ________date fns_________

**Why did you choose these libraries?**

[Explain your library selection and how they helped]
**date-fns**: Used for date manipulation utilities:
- `isSameDay()`: Compare dates ignoring time
- `isWithinInterval()`: Check if date falls in range
- `format()`: Format dates for display

**Why date-fns?**
- Lightweight (modular, tree-shakeable)
- Immutable (doesn't modify original dates)
- TypeScript support

**No calendar library**: Chose to build calendar from scratch to demonstrate:
- Deep understanding of calendar logic
- Component composition skills

---

### AI Tools & Documentation

**AI Coding Assistants:**
- [ ] GitHub Copilot
- [✅] ChatGPT
- [ ] Claude
- [✅] Other: _________________

**How did you use AI tools?**

[Be honest - we understand AI is a normal part of modern development. What we want to know:
- What tasks did you use AI for? (boilerplate, debugging, architecture advice, etc.)
I used AI tools strategically throughout the development process:

**Tasks AI helped with:**

1. **Architecture Design**:
   - Discussed component structure and separation of concerns
   - Validated architecture decisions (service layer, hooks pattern)
   - Got feedback on TypeScript interface design

2. **Boilerplate Generation**:
   - Generated initial component scaffolding
   - Created repetitive TypeScript interfaces
   - Set up service layer class structure

3. **Problem-Solving**:
   - Debugging date manipulation edge cases (week start calculation, timezone handling)
   - Resolving TypeScript errors and type mismatches
   - Finding optimal solutions for time slot positioning

- How did you validate and understand AI-generated code?

1. **Understanding First**: Never copied code without understanding every line
2. **TypeScript Verification**: Ensured all types were correct and no `any` types
3. **Manual Testing**: Tested every feature thoroughly in browser

- What did you modify or customize from AI suggestions?]

 Simplified overly complex solutions
- Adjusted naming conventions for consistency
- Reorganized code structure to match project patterns
- Added additional error handling

**Documentation & Resources:**
- [✅] React documentation
- [✅] Next.js documentation
- [✅] date-fns documentation
- [✅] TypeScript documentation
- [✅] Tailwind CSS documentation
- [ ] Library-specific documentation
- [ ] Stack Overflow / GitHub Issues
- [ ] Other: _________________

---

## 📝 Additional Notes

Any other comments or information you'd like to share?

Throughout this project, I prioritized:

1. **Type Safety**: 100% TypeScript with no `any` types
2. **Clean Code**: Descriptive names, single responsibility, DRY principles
3. **Performance**: Memoization where needed, efficient filtering

---

## ✨ Screenshots (Optional)

If you'd like, you can add screenshots of your implementation here.

---

**Thank you for your submission! We'll review it and get back to you soon.**
