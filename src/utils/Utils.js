import { Redirect } from 'react-router-dom';

//url for production
export var url = "";
if (process.env.NODE_ENV === "development") {
  url = "";
} else {
  url = window.location.host.split("/")[1];
  if (url) {
    url = `/${window.location.host.split("/")[1]}`;
  } else url = process.env.PUBLIC_URL; /// ADD YOUR CPANEL SUB-URL
}

// Logs out user
export const handleSignout = () => {
  localStorage.removeItem("accessToken");
};

//Function to validate and return errors for a form
export const checkForm = (formData) => {
  let errorState = {};
  Object.keys(formData).forEach((item) => {
    if (formData[item] === null || formData[item] === "") {
      errorState[item] = "This field is required";
    }
  });
  return errorState;
};

//Function that returns the first or first two letters from a name
export const findUpper = (string) => {
  if(string === undefined || "")
    return "";
  if(string === null)
    return "";
  let extractedString = [];

  for (var i = 0; i < string.length; i++) {
    if (string.charAt(i) === string.charAt(i).toUpperCase() && string.charAt(i) !== " ") {
      extractedString.push(string.charAt(i));
    }
  }
  if (extractedString.length > 1) {
    return extractedString[0] + extractedString[1];
  } else {
    return extractedString[0];
  }
};

//Function that calculates the from current date
export const setDeadline = (days) => {
  let todayDate = new Date();
  var newDate = new Date(todayDate);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
};

// Function to structure date ex : Jun 4, 2011;
export const getDateStructured = (date) => {
  let d = date.getUTCDate();
  let m = date.getMonth();
  let y = date.getFullYear();
  let final = monthNames[m] + " " + d + ", " + y;
  return final;
};

// Function to structure date ex: YYYY-MM-DD
export const setDateForPicker = (rdate) => {
  let d = rdate.getUTCDate();
  d < 10 && (d = "0" + d);
  let m = rdate.getMonth() + 1;
  m < 10 && (m = "0" + m);
  let y = rdate.getFullYear();
  rdate = y + "-" + m + "-" + d;

  return rdate;
};

// Set deadlines for projects
export const setDeadlineDays = (deadline) => {
  var currentDate = new Date();
  var difference = deadline.getTime() - currentDate.getTime();
  var days = Math.ceil(difference / (1000 * 3600 * 24));
  return days;
};

//Date formatter function
export const dateFormatterAlt = (date, reverse) => {
  if (date === null || date === undefined) return "";
  let d = date.getDate();
  d = d < 10 ? "0" + d : d;
  let m = date.getMonth() + 1;
  m = m < 10 ? "0" + m : m;
  let y = date.getFullYear();
  let hh = date.getHours();
  if (hh < 10)
    hh = "0"+hh;
  let mm = date.getMinutes();
  reverse ? (date =  d + "/" + m + "/" + y + " " + hh + ":" + mm) : (date = y + "/" + m + "/" + d);
  return date;
};
export const dateCompare = (d1, d2) => {
  var dateformat1 = d1.split("/");
  var dateformat2 = d2.split("/");
  if (dateformat1[2] > dateformat2[2]) {
    return true;
  }
  if (dateformat1[2] == dateformat2[2]) {
    if (dateformat1[1] > dateformat2[1]) {
      return true;
    }
    if (dateformat1[1] == dateformat2[1]) {
      if (dateformat1[0] > dateformat2[0]) {
        return true;
      }
    }
  }
  return false;
 
}
//Date formatter function
export const dateFormatter = (date, reverse, string) => {
  var dateformat = date.split("-");
  //var date = dateformat[1]+"-"+dateformat[2]+"-"+dateformat[0];
  reverse
    ? (date = dateformat[2] + "-" + dateformat[0] + "-" + dateformat[1])
    : (date = dateformat[1] + "-" + dateformat[2] + "-" + dateformat[0]);

  return date;
};
export const fromStringTodateFormatter = (date, reverse, string) => {
  if (date === undefined) return "";
  date = date.split(" ");
  date = date[0].split("T");

  var dateformat = date[0].split("-");
  if(dateformat.length < 2)
    return date;
  //var date = dateformat[1]+"-"+dateformat[2]+"-"+dateformat[0];
  reverse
    ? (date = dateformat[2] + "/" + dateformat[1] + "/" + dateformat[0])
    : (date = dateformat[1] + "/" + dateformat[2] + "/" + dateformat[0]);

  return date;
};
export const fromStringTodatetimeFormatter = (date, reverse, string) => {
  if (date === null || date === undefined) return "";
  date = new Date(date);
  let d = date.getDate();
  d = d < 10 ? "0" + d : d;
  let m = date.getMonth() + 1;
  m = m < 10 ? "0" + m : m;
  let y = date.getFullYear();
  let hh = date.getHours();
  if (hh < 10)
    hh = "0"+hh;
  let mm = date.getMinutes();
  reverse ? (date =  d + "/" + m + "/" + y + " " + hh + ":" + mm) : (date = y + "/" + m + "/" + d);
  return date;
};


//todays Date
export const todaysDate = new Date();

//current Time
export const currentTime = () => {
  var hours = todaysDate.getHours();
  var minutes = todaysDate.getMinutes();
  var ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
};

//Percentage calculation
export const calcPercentage = (str1, str2) => {
  let result = Number(str2) / Number(str1);
  result = result * 100;
  return Math.floor(result);
};

export const truncate = (str, n) => {
  return str.length > n ? str.substr(0, n - 1) + " " + truncate(str.substr(n - 1, str.length), n) : str;
};

export const RedirectAs404 = ({ location }) => (
  <Redirect to={Object.assign({}, location, { state: { is404: true } })} />
);

// returns upload url
export const getUploadParams = () => {
  return { url: "https://httpbin.org/post" };
};

export const bulkActionOptions = [
  { value: "delete", label: "Delete User" },
];

export const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const addDays = (date, days) => {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Returns Currency based value for invest panel
export const returnCurrency = (currency, data, upperCase) => {
  if (currency === "usd") {
    return { value: data.usd.toFixed(2), label: upperCase ? "USD" : "$" };
  } else if (currency === "eur") {
    return { value: data.euro.toFixed(2), label: upperCase ? "EUR" : "euro" };
  } else if (currency === "btc") {
    return { value: data.BTC.toFixed(6), label: "BTC" };
  } else {
    return { value: data.ETH.toFixed(2), label: "ETH" };
  }
};

// Returns levels
export const returnLevel = (currency, data, upperCase) => {
  if (currency === "usd") {
    return data.usd;
  } else if (currency === "eur") {
    return data.euro;
  } else if (currency === "btc") {
    let amount = data.BTC.map((item) => {
      return item.toFixed(6);
    });
    return amount;
  } else {
    return data.ETH;
  }
};
export const hideEmail = function(email) {
  return email.replace(/(.{1})(.*)(?=@)/,
    function(gp1, gp2, gp3) { 
      for(let i = 0; i < gp3.length; i++) { 
        gp2+= "*"; 
      } return gp2; 
    });
};
