export const calculateDuration = (startDate: Date, endDate: Date | null): string => {
  const end = endDate || new Date();
  
  // Calculate the difference in months
  let months = (end.getFullYear() - startDate.getFullYear()) * 12;
  months += end.getMonth() - startDate.getMonth();
  
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