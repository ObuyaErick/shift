const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

type Weekday = (typeof days)[number];

type TimetableSlot = {
  start: number;
  end: number;
  activity?: string;
};

type ClassTimetable = Record<Weekday, TimetableSlot[]>;
