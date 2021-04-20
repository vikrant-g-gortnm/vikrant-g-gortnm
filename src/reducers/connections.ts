import { CONNECTIONS_ACTIONS } from "actions";

const DEFAULT_STATE = {
  chartFilters: {
    tags: [],
  },
};

export default (state = DEFAULT_STATE, action: any) => {
  const { type, payload } = action;

  switch (type) {
    case CONNECTIONS_ACTIONS.SET_CHART_FILTERS:
      return {
        ...state,
        chartFilters: {
          ...state.chartFilters,
          ...payload,
        },
      };
    default:
      return state;
  }
};
