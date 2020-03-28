// Description:
//   calculates clean time
//
// Dependencies:
//   xml2js
//
// Configuration:
//   GOOGLE_API_TOKEN
//   VIRTUAL_YAP_SERVER
//
// Commands:
//   hubot ct <date> - Returns time clean. (example: %ct 09/22/11)
//
// Author:
//   radius314

var moment = require("moment");
var monthDay = [ 31, -1, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

module.exports = function(robot) {
  var calculate = function(year, month, day) {
    // calculate the time
    var fromDate, toDate, daysBetween, monthsBetween, yearsBetween;
    var startDate = moment([year, (month - 1), day]);
    var endDate = moment();

    if (startDate > endDate) {
      fromDate = endDate;
      toDate = startDate;
    } else {
      fromDate = startDate;
      toDate = endDate;
    }

    var increment = 0;

    if (fromDate.date() > toDate.date()) {
      increment = monthDay[fromDate.month()];
    }

    if (increment == -1) {
      increment = fromDate.isLeapYear() ? 29 : 28;
    }

    if (increment !== 0) {
      daysBetween = (toDate.date() + increment) - fromDate.date();
      increment = 1;
    } else {
      daysBetween = toDate.date() - fromDate.date();
    }

    if ((fromDate.month() + increment) > toDate.month()) {
      monthsBetween = (toDate.month() + 12) - (fromDate.month() + increment);
      increment = 1;
    } else {
      monthsBetween = (toDate.month() - (fromDate.month() + increment));
      increment = 0;
    }

    yearsBetween = toDate.year() - (fromDate.year() + increment);

    var totaldaysDiff = endDate.diff(startDate, 'days');

    return {
      "years" : yearsBetween,
      "months" : monthsBetween,
      "days" : daysBetween,
      "totalDays" : totaldaysDiff
    };
  };

  robot.respond(/ct (.*)/i, (msg) => {
    let parsed = moment(Date.parse(msg.match[1]));
    let calculated = calculate(parsed.year(), parsed.month() + 1, parsed.date());
    if (isNaN(calculated.totalDays)) {
      msg.send("Clean Date entered incorrectly.  Check your entry, here is a example: `%ct 09-22-2011`.");
    } else {
      msg.send(`You have ${calculated.years} years, ${calculated.months} months, ${calculated.days} days, or ${calculated.totalDays} total days.`);

      // Milestones
      if (calculated.years > 1 && calculated.months === 0 && calculated.days === 0) {
        msg.send("Congratulations on " + calculated.years + " years clean! :keymoji-my:");
      } else if (calculated.years === 1 && calculated.months === 6 && calculated.days < 7) {
        msg.send("Congratulations on 18 months clean! :keymoji-18m:");
      } else if (calculated.years === 1 && calculated.months === 0 && calculated.days < 7) {
        msg.send("Congratulations on 1 year clean! :keymoji-1y:");
      } else if (calculated.years === 0 && calculated.months === 9 && calculated.days < 7) {
        msg.send("Congratulations on 1 year clean! :keymoji-9m:");
      } else if (calculated.years === 0 && calculated.months === 9 && calculated.days < 7) {
        msg.send("Congratulations on 9 months clean! :keymoji-9m:");
      } else if (calculated.years === 0 && calculated.months === 6 && calculated.days < 7) {
        msg.send("Congratulations on 6 months clean! :keymoji-6m:");
      } else if (calculated.years === 0 && calculated.months === 0 && calculated.days < 97) {
        msg.send("Congratulations on 90 days clean! :keymoji-90d:");
      } else if (calculated.years === 0 && calculated.months === 0 && calculated.days < 67) {
        msg.send("Congratulations on 60 days clean! :keymoji-60d:");
      } else if (calculated.years === 0 && calculated.months === 0 && calculated.days < 37) {
        msg.send("Congratulations on 30 days clean! :keymoji-30d:");
      } else if (calculated.years === 0 && calculated.months === 0 && calculated.days < 7) {
        msg.send("Welcome, keep coming back! :keymoji-white:");
      }
    }
  });
};
