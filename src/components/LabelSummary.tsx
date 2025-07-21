import React from 'react';
import type { TimelineEntry } from '../types/timeline';
import { calculateLabelDurations, formatMonthsDuration } from '../utils/dateUtils';

interface LabelSummaryProps {
  entries: TimelineEntry[];
}

export const LabelSummary: React.FC<LabelSummaryProps> = ({ entries }) => {
  const labelDurations = calculateLabelDurations(entries);
  const labelEntries = Object.entries(labelDurations);

  if (labelEntries.length === 0) {
    return null;
  }

  // Sort labels by duration (descending)
  const sortedLabels = labelEntries.sort(([, a], [, b]) => b - a);

  return (
    <div className="label-summary">
      <h3 className="summary-title">Label Summary</h3>
      <div className="summary-list">
        {sortedLabels.map(([label, months]) => (
          <div key={label} className="summary-item">
            <span className="summary-label">{label}</span>
            <span className="summary-duration">{formatMonthsDuration(months)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};