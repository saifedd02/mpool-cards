import { randomUUID } from "crypto";
import { readJson, storagePaths, writeJson } from "./storage";

export interface ContactEvent {
  id: string;
  timestamp: string;
  employeeSlug: string;
  visitorName: string;
  visitorEmail: string;
  visitorPhone: string;
  message: string;
}

export async function getEvents(): Promise<ContactEvent[]> {
  return readJson<ContactEvent[]>(storagePaths.events, []);
}

export async function addEvent(
  data: Omit<ContactEvent, "id" | "timestamp">
): Promise<ContactEvent> {
  const events = await getEvents();
  const event: ContactEvent = {
    id: randomUUID(),
    timestamp: new Date().toISOString(),
    ...data,
  };
  events.push(event);
  await writeJson(storagePaths.events, events);
  return event;
}

export async function getEventsByTimeframe(
  timeframe: "week" | "month" | "quarter" | "year" | "all"
): Promise<ContactEvent[]> {
  const events = await getEvents();
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
