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
