export const delay = (time = 2000) =>
  new Promise((res) => setTimeout(res, time));

export const timeAgo = (timestamp) => {
  const currentTime = new Date().getTime();
  const timeDifference = currentTime - timestamp;

  // Convert the time difference from milliseconds to minutes, hours, and days
  const differenceInMinutes = Math.floor(timeDifference / 1000 / 60);
  const differenceInHours = Math.floor(differenceInMinutes / 60);
  const differenceInDays = Math.floor(differenceInHours / 24);

  if (differenceInDays >= 1) {
    const date = new Date(timestamp);
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${
      monthNames[date.getMonth()]
    } ${date.getDate()}, ${date.getFullYear()}`;
  } else if (differenceInHours >= 1) {
    return `${differenceInHours} hours ago`;
  } else {
    return "less than 1 hour ago";
  }
};
