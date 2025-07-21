import React from 'react';
import type { TimelineEntry } from '../types/timeline';
import { calculateDuration } from '../utils/dateUtils';

interface ListViewProps {
  entries: TimelineEntry[];
  onEditEntry: (entry: TimelineEntry) => void;
  onDeleteEntry: (entryId: string) => void;
}

export const ListView: React.FC<ListViewProps> = ({ entries, onEditEntry, onDeleteEntry }) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en', { 
      year: 'numeric', 
      month: 'short' 
    });
  };

  const formatDateRange = (startDate: Date, endDate: Date | null) => {
    const start = formatDate(startDate);
    if (!endDate) {
      return `${start} - Present`;
    }
    const end = formatDate(endDate);
    return start === end ? start : `${start} - ${end}`;
  };

  const sortedEntries = [...entries].sort((a, b) => {
    return a.startDate.getTime() - b.startDate.getTime();
  });

  return (
    <div className="list-view">
      {sortedEntries.length === 0 ? (
        <div className="empty-list">
          <p>No timeline entries yet. Click "Add Entry" to get started!</p>
        </div>
      ) : (
        <div className="entries-list">
          <div className="list-header">
            <div className="header-cell name-header">Name</div>
            <div className="header-cell period-header">Period</div>
            <div className="header-cell duration-header">Duration</div>
            <div className="header-cell labels-header">Labels</div>
            <div className="header-cell note-header">Note</div>
            <div className="header-cell actions-header">Actions</div>
          </div>
          {sortedEntries.map(entry => (
            <div key={entry.id} className="list-entry">
              <div className="entry-cell name-cell">
                <div 
                  className="color-indicator" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="entry-name">{entry.name}</span>
              </div>
              <div className="entry-cell period-cell">
                {formatDateRange(entry.startDate, entry.endDate)}
              </div>
              <div className="entry-cell duration-cell">
                {calculateDuration(entry.startDate, entry.endDate)}
              </div>
              <div className="entry-cell labels-cell">
                {entry.labels && entry.labels.length > 0 ? (
                  <div className="labels-container">
                    {entry.labels.map((label, index) => (
                      <span key={index} className="label-tag">
                        {label}
                      </span>
                    ))}
                  </div>
                ) : '—'}
              </div>
              <div className="entry-cell note-cell">
                {entry.note || '—'}
              </div>
              <div className="entry-cell actions-cell">
                <button
                  className="action-btn edit-btn"
                  onClick={() => onEditEntry(entry)}
                  title="Edit entry"
                >
                  ✏️
                </button>
                <button
                  className="action-btn delete-btn"
                  onClick={() => onDeleteEntry(entry.id)}
                  title="Delete entry"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};