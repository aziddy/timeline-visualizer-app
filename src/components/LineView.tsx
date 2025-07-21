import React from 'react';
import type { TimelineEntry } from '../types/timeline';
import { calculateDuration } from '../utils/dateUtils';

interface LineViewProps {
  entries: TimelineEntry[];
  mode: 'horizontal' | 'vertical';
  onEditEntry: (entry: TimelineEntry) => void;
  onDeleteEntry: (entryId: string) => void;
}

export const LineView: React.FC<LineViewProps> = ({ entries, mode, onEditEntry, onDeleteEntry }) => {
  const getDateRange = () => {
    if (entries.length === 0) {
      const now = new Date();
      return { 
        start: new Date(now.getFullYear(), 0, 1), 
        end: new Date(now.getFullYear(), 11, 31) 
      };
    }

    const dates = entries.flatMap(entry => [
      entry.startDate,
      entry.endDate || new Date()
    ]);
    
    const sortedDates = dates.sort((a, b) => a.getTime() - b.getTime());
    return {
      start: sortedDates[0],
      end: sortedDates[sortedDates.length - 1]
    };
  };

  const { start: startDate, end: endDate } = getDateRange();
  const totalMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                     (endDate.getMonth() - startDate.getMonth()) + 1;

  const getMonthMarkers = () => {
    const markers = [];
    let currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    
    for (let i = 0; i < totalMonths; i++) {
      markers.push({
        date: new Date(currentDate),
        position: (i / totalMonths) * 100,
        isYear: currentDate.getMonth() === 0
      });
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    
    return markers;
  };

  const getEntryPosition = (entry: TimelineEntry) => {
    const entryStart = entry.startDate;
    const entryEnd = entry.endDate || new Date();
    
    const startMonths = (entryStart.getFullYear() - startDate.getFullYear()) * 12 + 
                       (entryStart.getMonth() - startDate.getMonth());
    const endMonths = (entryEnd.getFullYear() - startDate.getFullYear()) * 12 + 
                     (entryEnd.getMonth() - startDate.getMonth());
    
    return {
      left: (startMonths / totalMonths) * 100,
      width: ((endMonths - startMonths + 1) / totalMonths) * 100
    };
  };

  const monthMarkers = getMonthMarkers();

  if (mode === 'horizontal') {
    const containerHeight = Math.max(400, entries.length * 30 + 120);
    
    return (
      <div className="line-view horizontal">
        <div className="timeline-container" style={{ height: `${containerHeight}px` }}>
          <div className="timeline-line">
            {monthMarkers.map((marker, index) => (
              <div
                key={index}
                className={`month-marker ${marker.isYear ? 'year-marker' : ''}`}
                style={{ left: `${marker.position}%` }}
              >
                <div className="marker-tick" />
                <div className="marker-label">
                  {marker.isYear ? 
                    marker.date.getFullYear() : 
                    marker.date.toLocaleDateString('en', { month: 'short' })
                  }
                </div>
              </div>
            ))}
            {entries.map((entry, index) => {
              const position = getEntryPosition(entry);
              return (
                <div
                  key={entry.id}
                  className="timeline-entry-line"
                  style={{
                    backgroundColor: entry.color,
                    left: `${position.left}%`,
                    width: `${position.width}%`,
                    top: `${(index * 30) + 60}px`
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
                  <span className="entry-label">
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
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const containerWidth = 800;
  const entriesPerRow = Math.floor(containerWidth / 200);
  const rows = Math.ceil(totalMonths / entriesPerRow);

  return (
    <div className="line-view vertical">
      {Array.from({ length: rows }).map((_, rowIndex) => {
        const startMonth = rowIndex * entriesPerRow;
        const endMonth = Math.min(startMonth + entriesPerRow, totalMonths);
        const rowMonths = endMonth - startMonth;
        
        return (
          <div key={rowIndex} className="timeline-row">
            <div className="timeline-line">
              {monthMarkers
                .slice(startMonth, endMonth)
                .map((marker, index) => (
                  <div
                    key={`${rowIndex}-${index}`}
                    className={`month-marker ${marker.isYear ? 'year-marker' : ''}`}
                    style={{ left: `${(index / rowMonths) * 100}%` }}
                  >
                    <div className="marker-tick" />
                    <div className="marker-label">
                      {marker.isYear ? 
                        marker.date.getFullYear() : 
                        marker.date.toLocaleDateString('en', { month: 'short' })
                      }
                    </div>
                  </div>
                ))}
              {entries.map((entry, entryIndex) => {
                const position = getEntryPosition(entry);
                const entryStartMonth = (position.left / 100) * totalMonths;
                const entryEndMonth = entryStartMonth + (position.width / 100) * totalMonths;
                
                if (entryEndMonth < startMonth || entryStartMonth >= endMonth) {
                  return null;
                }
                
                const adjustedStart = Math.max(0, entryStartMonth - startMonth);
                const adjustedEnd = Math.min(rowMonths, entryEndMonth - startMonth);
                
                return (
                  <div
                    key={`${entry.id}-${rowIndex}`}
                    className="timeline-entry-line"
                    style={{
                      backgroundColor: entry.color,
                      left: `${(adjustedStart / rowMonths) * 100}%`,
                      width: `${((adjustedEnd - adjustedStart) / rowMonths) * 100}%`,
                      top: `${(entryIndex * 30) + 60}px`
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
                    <span className="entry-label">
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
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};