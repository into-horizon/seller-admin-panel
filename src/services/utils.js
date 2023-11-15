import _ from "lodash";
import * as _history from "history";

export const getSearchParamsObject = (searchParams) => {
  let data = {};
  searchParams.forEach(
    (value, key) => !_.isEmpty(value) && (data[key] = value)
  );
  return data;
};

export const updateSearchParams = (
  key,
  value,
  searchParams,
  setSearchParams
) => {
  let data = {};
  for (const name of searchParams.keys()) {
    if (!_.isEmpty(searchParams.get(name))) {
      data[name] = searchParams.get(name);
    }
  }
  data[key] = value;
  setSearchParams(data);
};

export const history = _history.createBrowserHistory();

export const mainStatues = {
  delivered: "DELIVERED",
  rejected: "REJECTED",
  accepted: "ACCEPTED",
  canceled: "CANCELED",
  transferred: "TRANSFERRED",
  released: "RELEASED",
  pending: "PENDING",
};

const localizations = {
  ar: "ar-eg",
  en: "en-US",
};
export const localizedDate = (date, language) =>
  Intl.DateTimeFormat(localizations[language], {
    day: "2-digit",
    year: "numeric",
    month: "2-digit",
  }).format(date);

export const localizedNumber = (number, language) =>
  Intl.NumberFormat(localizations[language]).format(number);

export const formatLocalizationKey = (key) => {
  if (typeof key === "string") {
    return key.toUpperCase().replaceAll(" ", "_");
  } else {
    throw new Error(`Invalid Key ${key}`);
  }
};

export const validateMobileNumber = (number) => {
  const regex = /^(078|079|077)\d{7}$/;
  return regex.test(number);
};

export const validateEmail = email =>{
  const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
return regex.test(email)
}
