export const WASTE_ITEMS = [
  { label: "Recyclable", value: "recyclable" },
  { label: "Non-recyclable", value: "non_recyclable" },
];

export const CAR_ITEMS = [
  { label: "Subway", value: "subway" },
  { label: "Bus", value: "bus" },
  { label: "Car", value: "car" },
  { label: "Bike", value: "bike" },
  { label: "Walk", value: "walk" },
];

export const CAR_TYPE_ITEMS = [
  { label: "Electric", value: "car_electric" },
  { label: "Hybrid", value: "car_hybrid" },
  { label: "Compact", value: "car_compact" },
  { label: "Mid-size and above", value: "car_midsize" },
];

export const SERVING_ITEMS = [
  { label: "1 serving (65g)", value: "1" },
  { label: "2 servings (130g)", value: "2" },
  { label: "3 servings (195g)", value: "3" },
];

export const FOOD_ITEMS = [
  { label: "Heavy meat (beef, lamb)", value: "heavy_meat" },
  { label: "Moderate meat (chicken, pork)", value: "mod_meat" },
  { label: "Fish, seafood", value: "fish" },
  { label: "Vegetables, dairy", value: "veg_dairy" },
  { label: "Plant-based (vegan)", value: "vegan" },
];

export const HAIRLENGTHS = [
  { label: "Short hair", value: "hairdryer_short" },
  { label: "Medium hair", value: "hairdryer_med" },
  { label: "Long hair", value: "hairdryer_long" },
];

export const ELECTRICITY_CATEGORIES = [
  { label: "Entertainment", value: "entertainment" },
  { label: "Communication & Home Office", value: "comms" },
  { label: "Home Appliances", value: "home" },
  { label: "Personal Care", value: "personal" },
];

export const DEVICE_ITEMS = {
  entertainment: [
    { label: "Television", value: "tv" },
    { label: "Gaming console", value: "games" },
  ],
  comms: [
    { label: "Mobile Phone (when charging)", value: "mobile" },
    { label: "Laptop/Computer", value: "computer" },
    { label: "Tablet", value: "tablet" },
    { label: "Projector", value: "projector" },
    { label: "Printer", value: "printer" },
  ],
  home: [
    { label: "Air Conditioner (AC)", value: "ac" },
    { label: "Microwave", value: "microwave" },
    { label: "Washing machine", value: "washing_machine" },
    { label: "Coffee machine", value: "coffee_machine" },
  ],
  personal: [
    { label: "Hairdryer", value: "hairdryer" },
    { label: "Curling iron", value: "curling_iron" },
    { label: "Electric fan", value: "fan" },
    { label: "Space heater", value: "heater" },
  ],
};

export const DEVICE_UNITS = {
  tv: "hours",
  games: "hours",
  mobile: "hours",
  computer: "hours",
  tablet: "hours",
  projector: "hours",
  printer: "mins",
  ac: "hours",
  microwave: "mins",
  washing_machine: "hours",
  coffee_machine: "mins",
  hairdryer: "mins",
  curling_iron: "mins",
  fan: "hours",
  heater: "hours",
};

export const emissionLabels = {
  recyclable: "Recyclable Waste",
  non_recyclable: "Non-recyclable Waste",
  subway: "Ride subway",
  bus: "Ride bus",
  car_hybrid: "Ride hybrid car",
  car_electric: "Ride electric car",
  car_compact: "Ride compact cat",
  car_midsize: "Ride midsize car",
  bike: "Biking",
  walk: "Walking",
  heavy_meat: "Eat heavy meat (beef, lamb)",
  mod_meat: "Eat moderate meat (chicken, pork)",
  fish: "Each fish, seafood",
  veg_dairy: "Eat veggies, dairy",
  vegan: "Eat plant-based (vegan)",
  hairdryer_short: "Used hairdryer (short)",
  hairdryer_med: "Used hairdryer (mid)",
  hairdryer_long: "Used hairdryer (long)",
  tv: "Watched TV",
  games: "Played games",
  mobile: "Used phone",
  computer: "Used computer",
  tablet: "Used tablet",
  projector: "Used projector",
  printer: "Used printer",
  ac: "Used AC",
  microwave: "Used microwave",
  washing_machine: "Used washing machine",
  coffee_machine: "Used coffee machine",
  curling_iron: "Used curling iron",
  fan: "Used fan",
  heater: "Used heater",
};

export const offsetLabels = {
  recycling: "Recycling",
  green_gifting: "Green gifting",
  art_project: "Make eco-friendly art",
  energy_bulbs: "Switch to energy-efficient bulbs",
  reusable_bottles: "Use reusable water bottle",
  clean_neighborhood: "Clean your neighborhood",
  eco_bag: "Use eco bag",
  plant_tree: "Plant a tree",
};

export const EMISSION_CATEGORIES = [
  "Transportation",
  "Food",
  "Waste",
  "Electricity",
];

export const MONTH_NAMES = [
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
