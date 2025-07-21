export interface TimelineEntry {
  id: string;
  name: string;
  note: string;
  color: string;
  startDate: Date;
  endDate: Date | null; // null represents "present"
}

export interface TimelineData {
  name: string;
  entries: TimelineEntry[];
}

export type ViewMode = 'calendar' | 'line-horizontal' | 'line-vertical' | 'list';