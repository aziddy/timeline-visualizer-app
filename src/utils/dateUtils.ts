import type { TimelineEntry } from '../types/timeline';

export const calculateDuration = (startDate: Date, endDate: Date | null): string => {
  const end = endDate || new Date();
  
  // Calculate the difference in months (inclusive)
  let months = (end.getFullYear() - startDate.getFullYear()) * 12;
  months += end.getMonth() - startDate.getMonth() + 1; // +1 for inclusive calculation
  
  // Adjust for partial months (if end day is before start day)
  if (end.getDate() < startDate.getDate()) {
    months--;
  }
  
  // Ensure minimum of 1 month
  months = Math.max(1, months);
  
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  if (years === 0) {
    return `${remainingMonths}m`;
  } else if (remainingMonths === 0) {
    return `${years}y`;
  } else {
    return `${years}y${remainingMonths}m`;
  }
};

// Calculate duration in months (numeric value)
export const calculateDurationInMonths = (startDate: Date, endDate: Date | null): number => {
  const end = endDate || new Date();
  
  let months = (end.getFullYear() - startDate.getFullYear()) * 12;
  months += end.getMonth() - startDate.getMonth() + 1; // +1 for inclusive calculation
  
  if (end.getDate() < startDate.getDate()) {
    months--;
  }
  
  return Math.max(1, months);
};



// Calculate non-overlapping duration for entries with specific labels
export const calculateLabelDurations = (entries: TimelineEntry[]): Record<string, number> => {
  const labelDurations: Record<string, number> = {};
  
  // First, get all unique labels and their total durations
  const labelEntries: Record<string, TimelineEntry[]> = {};
  
  entries.forEach(entry => {
    if (entry.labels && entry.labels.length > 0) {
      entry.labels.forEach(label => {
        if (!labelEntries[label]) {
          labelEntries[label] = [];
        }
        labelEntries[label].push(entry);
      });
    }
  });
  
  // For each label, calculate non-overlapping duration
  Object.entries(labelEntries).forEach(([label, labelEntriesList]) => {
    let totalNonOverlappingMonths = 0;
    
    // Create periods for this label
    const periods = labelEntriesList.map(entry => ({
      start: entry.startDate,
      end: entry.endDate || new Date()
    }));
    
    // Sort periods by start date
    periods.sort((a, b) => a.start.getTime() - b.start.getTime());
    
    // Merge overlapping periods to get non-overlapping total
    const mergedPeriods: Array<{ start: Date; end: Date }> = [];
    
    periods.forEach(period => {
      if (mergedPeriods.length === 0) {
        mergedPeriods.push(period);
      } else {
        const lastPeriod = mergedPeriods[mergedPeriods.length - 1];
        
        if (period.start <= lastPeriod.end) {
          // Overlapping or adjacent - merge them
          lastPeriod.end = period.end > lastPeriod.end ? period.end : lastPeriod.end;
        } else {
          // No overlap - add as new period
          mergedPeriods.push(period);
        }
      }
    });
    
    // Sum up all merged periods
    totalNonOverlappingMonths = mergedPeriods.reduce((sum, period) => {
      return sum + calculateDurationInMonths(period.start, period.end);
    }, 0);
    
    labelDurations[label] = totalNonOverlappingMonths;
  });
  
  return labelDurations;
};

// Format months into human-readable duration
export const formatMonthsDuration = (months: number): string => {
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  if (years === 0) {
    return `${remainingMonths}m`;
  } else if (remainingMonths === 0) {
    return `${years}y`;
  } else {
    return `${years}y${remainingMonths}m`;
  }
};