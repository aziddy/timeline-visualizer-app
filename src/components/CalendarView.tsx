import React from 'react';
import type { TimelineEntry } from '../types/timeline';
import { calculateDuration } from '../utils/dateUtils';

interface CalendarViewProps {
  entries: TimelineEntry[];
  onEditEntry: (entry: TimelineEntry) => void;
  onDeleteEntry: (entryId: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ entries, onEditEntry, onDeleteEntry }) => {
  const getYearRange = () => {
    if (entries.length === 0) {
      const currentYear = new Date().getFullYear();
      return { start: currentYear, end: currentYear };
    }

    const dates = entries.flatMap(entry => [
      entry.startDate,
      entry.endDate || new Date()
    ]);
    
    const years = dates.map(date => date.getFullYear());
    return {
      start: Math.min(...years),
      end: Math.max(...years)
    };
  };

  const { start: startYear, end: endYear } = getYearRange();
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const getEntryPosition = (entry: TimelineEntry, year: number, month: number) => {
    const entryStart = entry.startDate;
    const entryEnd = entry.endDate || new Date();
    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 0);

    if (entryEnd < monthStart || entryStart > monthEnd) {
      return null;
    }

    const totalDays = monthEnd.getDate();
    const startDay = entryStart <= monthStart ? 1 : entryStart.getDate();
    const endDay = entryEnd >= monthEnd ? totalDays : entryEnd.getDate();

    return {
      left: ((startDay - 1) / totalDays) * 100,
      width: ((endDay - startDay + 1) / totalDays) * 100
    };
  };

  const getStackedEntries = (year: number, monthIndex: number) => {
    const monthEntries = entries
      .map(entry => {
        const position = getEntryPosition(entry, year, monthIndex);
        return position ? { entry, position } : null;
      })
      .filter(Boolean) as Array<{ entry: TimelineEntry; position: { left: number; width: number } }>;

    if (monthEntries.length === 0) return [];

    // Sort by start position, then by duration (longer entries first)
    monthEntries.sort((a, b) => {
      if (a.position.left !== b.position.left) {
        return a.position.left - b.position.left;
      }
      return b.position.width - a.position.width;
    });

    // Calculate vertical stacking with proper overlap detection
    const stackedEntries: Array<{ entry: TimelineEntry; position: { left: number; width: number }; row: number }> = [];
    
    for (const item of monthEntries) {
      let row = 0;
      const itemStart = item.position.left;
      const itemEnd = item.position.left + item.position.width;
      
      // Check each row until we find one without overlaps
      while (true) {
        const hasOverlap = stackedEntries.some(placed => {
          if (placed.row !== row) return false;
          
          const placedStart = placed.position.left;
          const placedEnd = placed.position.left + placed.position.width;
          
          // Check if there's any overlap
          return !(itemEnd <= placedStart || itemStart >= placedEnd);
        });
        
        if (!hasOverlap) {
          break;
        }
        row++;
      }
      
      stackedEntries.push({ ...item, row });
    }

    return stackedEntries;
  };

  return (
    <div className="calendar-view">
      {years.map(year => (
        <div key={year} className="year-section">
          <div className="year-header">{year}</div>
          <div className="months-grid">
            {months.map((month, monthIndex) => {
              const stackedEntries = getStackedEntries(year, monthIndex);
              const maxRows = Math.max(0, ...stackedEntries.map(item => item.row)) + 1;
              
              return (
                <div key={`${year}-${monthIndex}`} className="month-cell">
                  <div className="month-header">{month}</div>
                  <div 
                    className="month-content"
                    style={{ 
                      height: Math.max(100, maxRows * 26 + 8) + 'px' 
                    }}
                  >
                    {stackedEntries.map(({ entry, position, row }) => (
                      <div
                        key={`${entry.id}-${year}-${monthIndex}`}
                        className="timeline-entry calendar-entry"
                        style={{
                          backgroundColor: entry.color,
                          left: `${position.left}%`,
                          width: `${position.width}%`,
                          top: `${row * 26 + 4}px`,
                          zIndex: 10 + row
                        }}
                        title={`${entry.name}${entry.labels && entry.labels.length > 0 ? ' [' + entry.labels.join(', ') + ']' : ''}${entry.note ? ': ' + entry.note : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditEntry(entry);
                        }}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          onDeleteEntry(entry.id);
                        }}
                      >
                        <span className="entry-name">
                          {entry.name} ({calculateDuration(entry.startDate, entry.endDate)})
                        </span>
                        <div className="entry-actions">
                          <button
                            className="action-btn edit-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditEntry(entry);
                            }}
                            title="Edit entry"
                          >
                            ✏️
                          </button>
                          <button
                            className="action-btn delete-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteEntry(entry.id);
                            }}
                            title="Delete entry"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};