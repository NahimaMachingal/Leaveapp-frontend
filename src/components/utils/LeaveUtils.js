
//LeaveUtils.js

export const getLeaveTileClassName = ({ date, view, employeeLeaves }) => {
    if (view === 'month') {
      const leaveDays = getLeaveDays(employeeLeaves);
      const formattedDate = date.toISOString().split('T')[0];
      console.log("Processing Date:", formattedDate); // Log every date being checked
  
      const leaveDay = leaveDays.find((leave) => leave.date === formattedDate);
  
      if (leaveDay) {
        console.log("Found Leave Day:", leaveDay); // Log only matching leave days
        switch (leaveDay.leaveType) {
          case 'annual':
            return 'bg-yellow-400 rounded-full';
          case 'sick':
            return 'bg-red-500 rounded-full';
          case 'casual':
            return 'bg-green-400 rounded-full';
          default:
            return 'bg-blue-500 rounded-full';
        }
      } else {
        console.log("No matching leave day for:", formattedDate);
      }
    }
    return null;
  };
  
  export const getLeaveDays = (employeeLeaves) => {
    if (!Array.isArray(employeeLeaves)) {
      console.log("Invalid employeeLeaves input:", employeeLeaves);
      return [];
    }
  
    let leaveDays = [];
    employeeLeaves.forEach((leave) => {
      if (!leave.start_date || !leave.end_date) {
        console.log("Skipping leave with missing dates:", leave);
        return;
      }
  
      let start = new Date(leave.start_date);
      let end = new Date(leave.end_date);
  
      if (isNaN(start) || isNaN(end)) {
        console.log("Skipping leave with invalid dates:", leave);
        return; // Skip invalid dates
      }
  
      console.log("Processing leave:", leave);
  
      while (start <= end) {
        const formattedDate = start.toISOString().split('T')[0];
        leaveDays.push({
          date: formattedDate,
          leaveType: leave.leave_type,
        });
        start.setDate(start.getDate() + 1); // Increment date
      }
    });
  
    console.log("Final Leave Days Array:", leaveDays);
    return leaveDays;
  };
  