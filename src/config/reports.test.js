export function generateRandomNumbers(fromDate, toDate) {
  // Helper function to format date as YYYY-MM-DD
  function formatDate(date) {
    let d = new Date(date);
    let month = "" + (d.getMonth() + 1);
    let day = "" + d.getDate();
    let year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  // Parse input dates
  let startDate = new Date(fromDate);
  let endDate = new Date(toDate);

  // Calculate the number of days between the two dates
  let delta = (endDate - startDate) / (1000 * 60 * 60 * 24);

  // Initialize totals
  let dailyTotals = {};
  let weeklyTotals = {};
  let monthlyTotals = {};

  // Generate random numbers for each day in the range
  for (let i = 0; i <= delta; i++) {
    let currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + i);
    let randomNumber = Math.floor(Math.random() * 249859) + 100000;

    // Daily total
    let currentDateString = formatDate(currentDate);
    dailyTotals[currentDateString] = randomNumber;

    // Weekly total
    let weekStart = new Date(currentDate);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    let weekStartString = formatDate(weekStart);
    if (!weeklyTotals[weekStartString]) {
      weeklyTotals[weekStartString] = 0;
    }
    weeklyTotals[weekStartString] += randomNumber;

    // Monthly total
    let monthStartString = currentDateString.slice(0, 7); // YYYY-MM
    if (!monthlyTotals[monthStartString]) {
      monthlyTotals[monthStartString] = 0;
    }
    monthlyTotals[monthStartString] += randomNumber;
  }

  // Prepare JSON output
  let output = {
    daily: Object.entries(dailyTotals).map(([date, total]) => ({
      date: date,
      impressions: total,
    })),
    weekly: Object.entries(weeklyTotals).map(([date, total]) => ({
      date: date,
      impressions: total,
    })),
    monthly: Object.entries(monthlyTotals).map(([date, total]) => ({
      date: date,
      impressions: total,
    })),
  };

  // Print the JSON output
  return output;
}
