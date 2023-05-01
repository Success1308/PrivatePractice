import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";
import fs from "fs";

const path = "./data.json";

// Function to create a commit
const createCommit = async (date) => {
  const data = { date: date.format() };
  console.log(`Creating commit for date: ${date.format()}`);

  try {
    await jsonfile.writeFile(path, data);
    await simpleGit().add([path]);
    await simpleGit().commit(date.format(), { "--date": date.format() });
    console.log(`Commit created for date: ${date.format()}`);
  } catch (error) {
    if (error.message.includes("index.lock")) {
      console.error("Git lock detected. Removing lock file...");
      fs.unlinkSync(".git/index.lock");
      console.log("Lock file removed. Retrying...");
      return createCommit(date);
    } else {
      console.error(`Error during commit: ${error.message}`);
    }
  }
};

// Function to generate commits for a specific day
const generateDailyCommits = async (date, commitCount) => {
  console.log(
    `Generating ${commitCount} commit(s) for ${date.format("YYYY-MM-DD")}`
  );
  for (let i = 0; i < commitCount; i++) {
    const commitTime = date
      .clone()
      .hour(random.int(0, 23))
      .minute(random.int(0, 59))
      .second(random.int(0, 59));
    await createCommit(commitTime);
  }
};

// Main function to manage commits from Jan 2024 to today
const makeCommits = async () => {
  const startDate = moment("2024-01-01");
  const endDate = moment();

  // Randomly select up to 3 days for 17 commits
  const specialDays = new Set();
  while (specialDays.size < 3) {
    const randomDay = random.int(0, endDate.diff(startDate, "days"));
    specialDays.add(
      startDate.clone().add(randomDay, "days").format("YYYY-MM-DD")
    );
  }

  console.log("Special days for 17 commits:", Array.from(specialDays));

  let currentDate = startDate.clone();
  while (currentDate.isSameOrBefore(endDate, "day")) {
    const isSpecialDay = specialDays.has(currentDate.format("YYYY-MM-DD"));
    const commitCount = isSpecialDay ? 17 : random.int(1, 3);
    await generateDailyCommits(currentDate, commitCount);
    currentDate.add(1, "day");
  }

  console.log("Pushing all commits to the remote repository...");
  try {
    await simpleGit().push();
    console.log("All commits pushed successfully!");
  } catch (error) {
    console.error("Error pushing commits:", error.message);
  }
};

// Start making commits
makeCommits();
