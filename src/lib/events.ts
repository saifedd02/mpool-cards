import { randomUUID } from "crypto";
import { readJsonWithFallback, storagePaths, writeJsonAtomically } from "./storage";

export interface ContactEvent {
  id: string;
  timestamp: string;
  employeeSlug: string;
  visitorName: string;
  visitorEmail: string;
  visitorPhone: string;
  message: string;
}

export function getEvents(): ContactEvent[] {
  return readJsonWithFallback<ContactEvent[]>(
    storagePaths.events,
    [storagePaths.legacyEvents],
    []
  );
}

export function addEvent(
  data: Omit<ContactEvent, "id" | "timestamp">
): ContactEvent {
  const events = getEvents();
  const event: ContactEvent = {
    id: randomUUID(),
    timestamp: new Date().toISOString(),
    ...data,
  };
  events.push(event);
  writeJsonAtomically(storagePaths.events, events);
  return event;
}

export function getEventsByTimeframe(
  timeframe: "week" | "month" | "quarter" | "year" | "all"
): ContactEvent[] {
  const events = getEvents();
  if (timeframe === "all") return events;

  const now = new Date();
  const cutoff = new Date();

  switch (timeframe) {
    case "week":
      cutoff.setDate(now.getDate() - 7);
      break;
    case "month":
      cutoff.setMonth(now.getMonth() - 1);
      break;
    case "quarter":
      cutoff.setMonth(now.getMonth() - 3);
      break;
    case "year":
      cutoff.setFullYear(now.getFullYear() - 1);
      break;
  }

  return events.filter((e) => new Date(e.timestamp) >= cutoff);
}
