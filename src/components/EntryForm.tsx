import React, { useState } from 'react';
import type { TimelineEntry } from '../types/timeline';

interface EntryFormProps {
  entry?: TimelineEntry;
  onSave: (entry: Omit<TimelineEntry, 'id'>) => void;
  onCancel: () => void;
}

export const EntryForm: React.FC<EntryFormProps> = ({ entry, onSave, onCancel }) => {
  const [name, setName] = useState(entry?.name || '');
  const [note, setNote] = useState(entry?.note || '');
  const [color, setColor] = useState(entry?.color || '#3B82F6');
  const [labels, setLabels] = useState(entry?.labels?.join(', ') || '');
  const [startDate, setStartDate] = useState(
    entry?.startDate ? `${entry.startDate.getFullYear()}-${String(entry.startDate.getMonth() + 1).padStart(2, '0')}` : ''
  );
  const [endDate, setEndDate] = useState(
    entry?.endDate ? `${entry.endDate.getFullYear()}-${String(entry.endDate.getMonth() + 1).padStart(2, '0')}` : ''
  );
  const [isPresent, setIsPresent] = useState(!entry?.endDate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !startDate) {
      alert('Name and start month/year are required');
      return;
    }

    const [startYear, startMonth] = startDate.split('-').map(Number);
    const parsedStartDate = new Date(startYear, startMonth - 1, 1);
    
    let parsedEndDate = null;
    if (!isPresent) {
      const [endYear, endMonth] = (endDate || startDate).split('-').map(Number);
      parsedEndDate = new Date(endYear, endMonth, 0); // Last day of the month
    }

    if (parsedEndDate && parsedEndDate < parsedStartDate) {
      alert('End month/year cannot be before start month/year');
      return;
    }

    const processedLabels = labels.trim() 
      ? labels.split(',').map(label => label.trim()).filter(label => label)
      : [];

    onSave({
      name: name.trim(),
      note: note.trim(),
      color,
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      labels: processedLabels
    });
  };

  const colorOptions = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
    '#8B5CF6', '#F97316', '#06B6D4', '#84CC16',
    '#EC4899', '#6B7280'
  ];

  return (
    <div className="entry-form-overlay">
      <div className="entry-form">
        <h3>{entry ? 'Edit Entry' : 'Add New Entry'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Entry name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="note">Note</label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional note"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="labels">Labels</label>
            <input
              type="text"
              id="labels"
              value={labels}
              onChange={(e) => setLabels(e.target.value)}
              placeholder="e.g. work, project, milestone (comma-separated)"
            />
            <small className="form-help">Separate multiple labels with commas</small>
          </div>

          <div className="form-group">
            <label>Color</label>
            <div className="color-picker">
              {colorOptions.map(colorOption => (
                <button
                  key={colorOption}
                  type="button"
                  className={`color-option ${color === colorOption ? 'selected' : ''}`}
                  style={{ backgroundColor: colorOption }}
                  onClick={() => setColor(colorOption)}
                />
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="startDate">Start Month/Year *</label>
            <input
              type="month"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={isPresent}
                onChange={(e) => setIsPresent(e.target.checked)}
              />
              Ongoing (present)
            </label>
          </div>

          {!isPresent && (
            <div className="form-group">
              <label htmlFor="endDate">End Month/Year</label>
              <input
                type="month"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
              />
            </div>
          )}

          <div className="form-actions">
            <button type="button" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="primary">
              {entry ? 'Update' : 'Add'} Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};