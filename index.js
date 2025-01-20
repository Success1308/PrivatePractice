import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const path = "./data.json";

// Function to mark a commit
const markCommit = (x, y) => {
  // Set the date to be within January 2024
  const date = moment()
    .year(2024) // Set the year to 2024
    .month(5) // January (0 represents January)
    .date(random.int(1, 31)) // Random day in January
    .hour(random.int(0, 23)) // Random hour of the day
    .minute(random.int(0, 59)) // Random minute
    .second(random.int(0, 59)) // Random second
    .format();

  const data = { date: date };

  // Only commit if the date is before or equal to today
  if (
    moment(date).isBefore(moment(), "day") ||
    moment(date).isSame(moment(), "day")
  ) {
    jsonfile.writeFile(path, data, () => {
      simpleGit().add([path]).commit(date, { "--date": date }).push();
    });
  }
};

// Function to create multiple commits
const makeCommits = (n) => {
  if (n === 0) return simpleGit().push();

  // Set the date to be within January 2024
  const date = moment()
    .year(2024) // Set the year to 2024
    .month(5) // January (0 represents January)
    .date(random.int(1, 31)) // Random day in January
    .hour(random.int(0, 23)) // Random hour of the day
    .minute(random.int(0, 59)) // Random minute
    .second(random.int(0, 59)) // Random second
    .format();

  const data = { date: date };

  console.log(date);

  // Only proceed if the date is before or equal to today
  if (
    moment(date).isBefore(moment(), "day") ||
    moment(date).isSame(moment(), "day")
  ) {
    jsonfile.writeFile(path, data, () => {
      simpleGit()
        .add([path])
        .commit(date, { "--date": date }, makeCommits.bind(this, --n));
    });
  } else {
    makeCommits(n); // Skip this commit if the date is beyond today
  }
};

// Start making commits
makeCommits(800);
