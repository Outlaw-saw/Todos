export function makeDueDate(dueTime: string, now: number): Date {
  const [h, m] = dueTime.split(':').map(Number);
  const d = new Date(now);
  const due = new Date(d.getFullYear(), d.getMonth(), d.getDate(), h, m);
  if (due.getTime() <= now) due.setDate(due.getDate() + 1);
  return due;
}

export function isOverdue(
  dueTime: string | null,
  completed: boolean,
  now: number,
): boolean {
  if (!dueTime || completed) return false;
  return now > makeDueDate(dueTime, now).getTime();
}

export function isDueSoon(
  dueTime: string | null,
  completed: boolean,
  now: number,
): boolean {
  if (!dueTime || completed) return false;
  const diff = makeDueDate(dueTime, now).getTime() - now;
  return diff > 0 && diff <= 3600000;
}

export function priority(
  dueTime: string | null,
  completed: boolean,
  now: number,
): number {
  if (!dueTime || completed) return 2;
  const due = makeDueDate(dueTime, now);
  const diff = due.getTime() - now;
  if (diff <= 0) return 0;
  if (diff <= 3600000) return 1;
  return 2;
}
