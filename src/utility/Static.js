// ** Fitler options for patient management
export const filterOptions = [
  { value: "all", label: "All patient" },
  { value: "new", label: "Patients visiting for first time" },
  { value: "old", label: "Patientd who already visited" },
];
// ** paginations options
export const paginationOptions = [10, 20, 30, 40, 50];
// ** search options
export const searchOptions = [
  { label: "Select", value: "" },
  { label: "Gender", value: "gender" },
  { label: "Full Name", value: "name" },
  { label: "Phone number", value: "phoneNumber" },
  { label: "E-mail", value: "email" },
];
// ** gender options
export const genderOptions = [
  { label: "Select" },
  { label: "Male", value: "m" },
  { label: "Female", value: "f" },
  { label: "Other", value: "o" },
];
// ** sorting options
export const sortingOptions = [
  { name: "Default", value: "default" },
  { name: "A - Z", value: "desc" },
  { name: "Z - A", value: "asc" },
  { name: "Newest", value: "new" },
  { name: "Oldest", value: "old" },
];
// ** consultation types
export const consultationTypes = [
  { value: "consultation", label: "Consultation", color: "primary" },
  { value: "control", label: "Control", color: "info" },
];
// ** gender options
export const staticGenderOptions = [
  {
    value: "f",
    label: "Female",
    color: "primary",
  },
  {
    value: "m",
    label: "Male",
    color: "info",
  },
  {
    value: "o",
    label: "Other",
    color: "warning",
  },
  {
    value: "",
    label: "Prefer not to say",
    color: "danger",
  },
];
// ** family situation options
export const familySituationOptions = [
  { label: "Single", value: "s", color: "primary" },
  { label: "Married", value: "m", color: "success" },
  { label: "Divorced", value: "d", color: "warning" },
  { label: "Widow", value: "w", color: "info" },
  { label: "Other", value: "o", color: "secondary" },
  { label: "Prefer not to say", value: "", color: "danger" },
];

// ** Fitler options
export const waitingRoomFilters = [
  { value: "all", label: "All appointments", color: "info" },
  { value: "remaining", label: "Remaining Appointments", color: "primary" },
  { value: "waiting", label: "Waiting", color: "warning" },
  { value: "late", label: "Hasn't arrive yet", color: "secondary" },
  { value: "canceled", label: "Canceled Appointments", color: "danger" },
  { value: "valid", label: "Validated appointments", color: "success" },
];
// ** consultation sorting options
export const consultationsSortingOptions = [
  { name: "Default", value: "default" },
  { name: "Old - New", value: "old" },
  { name: "New - old", value: "new" },
];

// ** consultation visit types
export const visitsTypeFilter = [
  { label: "All", value: "all", color: "primary" },
  { label: "Consultation", value: "consultation", color: "success" },
  { label: "Control", value: "control", color: "warning" },
];

export const yesOrNoSelectOption = [
  {
    label: "Select",
    value: "",
  },
  { label: "Oui", value: true },
  { label: "Non", value: false },
];

// ** protocoles list
export const protocoles = [
  { label: "Select", value: "#", color: "primary" },
  { label: "Long Protocol", value: "long", color: "success" },
  { label: "Short Protocol", value: "short", color: "warning" },
  { label: "Antagonist Protocol", value: "antagonist", color: "danger" },
];

export const protocolResult = [
  { label: "Select", value: "", color: "primary" },
  { label: "Avec Succès", value: true, color: "success" },
  { label: "Echoué", value: false, color: "danger" },
];

// ** cancer presence yes or no
export const cancerPresenceOptions = [
  { label: "Select", value: "", color: "primary" },
  { label: "Oui", value: true, color: "danger" },
  {
    label: "Non",
    value: false,
    color: "success",
  },
];

// ** cancer types
export const cancerTypes = [
  { label: "Select", value: "", color: "primary" },
  { label: "Cancer du sein", value: "breast", color: "success" },
  { label: "Cancer du d'ovarian", value: "ovarian", color: "warning" },
  { label: "Cancer de l'endometre", value: "endometrial", color: "danger" },
  { label: "Cancer du col", value: "cervical", color: "secondary" },
];

export const treatmentOptionsFilters = [
  { label: "All", value: "all", color: "primary" },
  { label: "OBS", value: "obs", color: "success" },
  { label: "GYN", value: "gyn", color: "warning" },
  { label: "PMA", value: "pma", color: "danger" },
  { label: "Nothing", value: "#", color: "info" },
];
