import { DefaultRoute } from '../router/routes';
import {
  consultationTypes,
  familySituationOptions,
  staticGenderOptions,
} from './Static';

// ** Checks if an object is empty (returns boolean)
export const isObjEmpty = (obj) => Object.keys(obj).length === 0;

// ** Returns K format from a number
export const kFormatter = (num) =>
  num > 999 ? `${(num / 1000).toFixed(1)}k` : num;

// ** Converts HTML to string
export const htmlToString = (html) => html.replace(/<\/?[^>]+(>|$)/g, "");

// ** Checks if the passed date is today
export const isToday = (date) => {
  const today = new Date();
  return (
    /* eslint-disable operator-linebreak */
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
    /* eslint-enable */
  );
};

/**
 ** Format and return date in Humanize format
 ** Intl docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format
 ** Intl Constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @param {String} value date to format
 * @param {Object} formatting Intl object to format with
 */
export const formatDate = (
  value,
  formatting = { month: "short", day: "numeric", year: "numeric" }
) => {
  if (!value) return value;
  return new Intl.DateTimeFormat("en-US", formatting).format(new Date(value));
};

// ** Returns short month of passed date
export const formatDateToMonthShort = (value, toTimeForCurrentDay = true) => {
  const date = new Date(value);
  let formatting = { month: "short", day: "numeric" };

  if (toTimeForCurrentDay && isToday(date)) {
    formatting = { hour: "numeric", minute: "numeric" };
  }

  return new Intl.DateTimeFormat("en-US", formatting).format(new Date(value));
};

/**
 ** Return if user is logged in
 ** This is completely up to you and how you want to store the token in your frontend application
 *  ? e.g. If you are using cookies to store the application please update this function
 */
export const isUserLoggedIn = () =>
  localStorage.getItem(process.env.REACT_APP_TOKEN_NAME);

export const getUserData = () =>
  JSON.parse(localStorage.getItem(process.env.REACT_APP_USER_DATA));

/**
 ** This function is used for demo purpose route navigation
 ** In real app you won't need this function because your app will navigate to same route for each users regardless of ability
 ** Please note role field is just for showing purpose it's not used by anything in frontend
 ** We are checking role just for ease
 * ? NOTE: If you have different pages to navigate based on user ability then this function can be useful. However, you need to update it.
 * @param {String} userRole Role of user
 */
export const getHomeRouteForLoggedInUser = (userRole) => {
  if (userRole === "admin") return DefaultRoute;
  if (userRole === "client") return "/access-control";
  return "/login";
};

// ** React Select Theme Colors
export const selectThemeColors = (theme) => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary25: "#7367f01a", // for option hover bg-color
    primary: "#7367f0", // for selected option bg-color
    neutral10: "#7367f0", // for tags bg-color
    neutral20: "#ededed", // for input border-color
    neutral30: "#ededed", // for input hover border-color
  },
});

export const getFullName = (gender, firstName, lastName) => {
  return `${
    gender === "mr." ? "Mr." : gender === "mmr." ? "Mme." : ""
  } ${firstName} ${lastName}`;
};

const getGender = (value) => {
  const gender = value.toLowerCase();
  switch (gender) {
    case "m":
      return "Mr.";
      break;
    case "f":
      return "Mme.";
      break;
    case "o":
      return "";
      break;
    default:
      return "";
  }
};

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export const getCapitalizedFullName = (gender, firstName, lastName) => {
  const a = capitalizeFirstLetter(getGender(gender));
  const b = capitalizeFirstLetter(firstName);
  const c = capitalizeFirstLetter(lastName);
  return `${a} ${b} ${c}`;
};

export const generateTitle = (patient, type) => {
  if (patient !== null && type.value !== null) {
    return `${type.value} appointment with ${patient}`.toLowerCase();
  }
  return "";
};

export const getFamilySituation = (situation) => {
  switch (situation) {
    case "m":
      return "Married";
      break;
    case "s":
      return "Single";
      break;
    case "d":
      return "Divorced";
      break;
    case "w":
      return "Widow";
      break;
    default:
      return "";
  }
};

export const getFullGender = (value) => {
  const gender = value.toLowerCase();
  switch (gender) {
    case "m":
      return "male";
      break;
    case "f":
      return "female";
      break;
    case "o":
      return "";
      break;
    default:
      return "";
  }
};

export const getGenderColor = (value) => {
  const gender = value.toLowerCase();
  switch (gender) {
    case "m":
      return "info";
      break;
    case "f":
      return "primary";
      break;
    case "o":
      return "secondary";
      break;
    default:
      return "secondary";
  }
};
// ** calculate age
export const calculateAge = (birthDate) => {
  const birthday = new Date(birthDate);
  const ageDifMs = Date.now() - birthday.getTime();
  const ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

export const defaultBirthDate = () => {
  const today = new Date();
  return new Date(today.getFullYear() - 11, today.getMonth(), today.getDate());
};

export const getWhichConsultation = (value) => {
  const consultation = String(value).toLowerCase();
  switch (consultation) {
    case "consultation":
      return consultationTypes[0];
    case "control":
      return consultationTypes[1];
    default:
      return {
        value: null,
        label: "Select",
        color: "",
      };
  }
};

export const getWhichGender = (value) => {
  const gender = String(value).toLowerCase();
  switch (gender) {
    case "m":
      return staticGenderOptions[1];
    case "f":
      return staticGenderOptions[0];
    case "o":
      return staticGenderOptions[2];
    case "":
      return staticGenderOptions[3];
    default:
      return staticGenderOptions[3];
  }
};

export const getWhichFamilySituation = (value) => {
  const familySituation = String(value).toLowerCase();
  switch (familySituation) {
    case "s":
      return familySituationOptions[0];
    case "m":
      return familySituationOptions[1];
    case "d":
      return familySituationOptions[2];
    case "w":
      return familySituationOptions[3];
    case "o":
      return familySituationOptions[4];
    case "":
      return familySituationOptions[5];
    default:
      return familySituationOptions[5];
  }
};

export const countProfitPatient = (consultation) => {
  let profit = 0;
  consultation?.map((item) => {
    profit += item?.fees;
  });
  return profit || 0;
};

// ** calculate end date
export const calculateEndDate = (start = null, duration = 30) => {
  if (start) {
    const date = new Date(start);
    const end = new Date(date.setMinutes(date.getMinutes() + duration));
    return end;
  }
  return null;
};

// ** disable all dates after today
export const disableDatesAfterToday = (date) => {
  const today = new Date();
  return date > today;
};

// ** disable dates before today
export const disableDatesBeforeToday = (date) => {
  const today = new Date();
  return date > today || date.getTime() === today.getTime();
};

// ** enable dates after today
export const enableDatesBeforeToday = (date) => {
  const minDate = new Date("2000-01-01"); // set the minimum selectable date to January 1, 2000
  return date >= minDate;
};

// **disable dates before jan 2021
export const disableDatesBeforeJan2021 = (date) => {
  const jan2021 = new Date(2021, 0, 1);
  return date < jan2021;
};

// ** calculate the child birth date
export const addDaysIntoDate = (date, days) => {
  const currentDate = new Date(date);
  currentDate.setDate(currentDate.getDate() + days);
  return currentDate;
};
// ** calculate bmi
export const calculateBMI = (height, weight) => {
  const heightInMeters = height / 100; // Convert height from cm to meters
  const bmi = weight / (heightInMeters * heightInMeters);
  return bmi.toFixed(2); // Round BMI to two decimal places
};
