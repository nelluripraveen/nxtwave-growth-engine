// ─── Central Workshop Configuration ────────────────────────────────────────────
// Change this single value to update the workshop date/time everywhere.
// All countdown timers, calendar events, and displays will use this.

export const WORKSHOP_CONFIG = {
  title: 'Build Your First AI Project in 60 Minutes',
  // Workshop date in ISO format (IST: UTC+5:30)
  // To change the workshop date, update ONLY this value.
  date: '2026-10-11T14:00:00+05:30',
  durationMinutes: 60,
  timezone: 'Asia/Kolkata',
  description:
    'A free, beginner-friendly workshop where you will build a real AI project from scratch in 60 minutes. Perfect for final-year engineering students preparing for placements.',
  organizer: 'NxtWave',
};

// ─── Derived helpers ───────────────────────────────────────────────────────────

export function getWorkshopStartDate(): Date {
  return new Date(WORKSHOP_CONFIG.date);
}

export function getWorkshopEndDate(): Date {
  const start = getWorkshopStartDate();
  return new Date(start.getTime() + WORKSHOP_CONFIG.durationMinutes * 60 * 1000);
}

/** Returns true when the current time is past the workshop start. */
export function isWorkshopLive(): boolean {
  return new Date() >= getWorkshopStartDate();
}

/** Returns true when the current time is past the workshop end. */
export function isWorkshopOver(): boolean {
  return new Date() >= getWorkshopEndDate();
}

/** Format a Date to a readable string: "Oct 11, 2026 • 2:00 PM IST" */
export function formatWorkshopDate(d: Date): string {
  return d.toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatWorkshopTime(d: Date): string {
  return d.toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

// ─── Google Calendar URL ───────────────────────────────────────────────────────
function toGoogleCalendarDateStr(d: Date): string {
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

export function getGoogleCalendarURL(): string {
  const start = toGoogleCalendarDateStr(getWorkshopStartDate());
  const end = toGoogleCalendarDateStr(getWorkshopEndDate());
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: WORKSHOP_CONFIG.title,
    dates: `${start}/${end}`,
    details: WORKSHOP_CONFIG.description,
    location: 'Online',
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// ─── ICS File Download ─────────────────────────────────────────────────────────
function toICSDate(d: Date): string {
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

export function downloadICSFile(): void {
  const start = toICSDate(getWorkshopStartDate());
  const end = toICSDate(getWorkshopEndDate());
  const uid = `nxtwave-workshop-${Date.now()}@nxtwave.com`;
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//NxtWave//Workshop//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${WORKSHOP_CONFIG.title}`,
    `DESCRIPTION:${WORKSHOP_CONFIG.description}`,
    'LOCATION:Online',
    `UID:${uid}`,
    'STATUS:CONFIRMED',
    `ORGANIZER:${WORKSHOP_CONFIG.organizer}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'nxtwave-ai-workshop.ics';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
