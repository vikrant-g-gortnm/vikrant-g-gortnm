import { CONNECTIONS_ACTIONS } from "./index";

export const setChartFilters = payload => {
  return {
    type: CONNECTIONS_ACTIONS.SET_CHART_FILTERS,
    payload,
  };
};
