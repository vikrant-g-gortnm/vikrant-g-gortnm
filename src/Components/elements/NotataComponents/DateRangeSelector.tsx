import * as React from "react";
import TextField from "@material-ui/core/TextField";
import {
  DateRangePicker,
  DateRange,
  DateRangeDelimiter,
  LocalizationProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@material-ui/pickers/adapter/date-fns";
import { Button } from "Components/elements";
import moment from "moment";
import { useEffect } from "react";
import { ThemeProvider } from "@material-ui/core/styles";
import { materialTheme } from "index";

interface DateRangeIntervals {
  label: string;
  range: DateRange<Date>;
}

interface Props {
  value: DateRange<Date>;
  onValueChange: (dateRange: DateRange<Date>) => void;
}

export default function DateRangeSelector(props: Props) {
  const [value, setValue] = React.useState<DateRange<Date>>([null, null]);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  const setRange = (range: DateRange<Date>) => {
    if (range[1]) {
      range[1] = moment(range[1]).endOf("day").toDate();
    }
    setValue(range);
    props.onValueChange(range);
  };

  const presetDateValues = () => {
    const toDate: Date = moment().endOf("day").toDate();
    const selectDateRange: DateRangeIntervals[] = [
      // { label: "Last Week", range: [moment().startOf("week").toDate(), toDate] },
      // { label: "Last Two Weeks", range: [moment().subtract(1, "week").startOf("week").toDate(), toDate] },
      // { label: "Last Month", range: [moment().startOf("month").toDate(), toDate] },
      // { label: "Last Three Months", range: [moment().subtract(2, "month").startOf("month").toDate(), toDate] },
      {
        label: "Last 7 Days",
        range: [moment().subtract(7, "day").startOf("day").toDate(), toDate],
      },
      {
        label: "Last 14 Days",
        range: [moment().subtract(14, "day").startOf("day").toDate(), toDate],
      },
      {
        label: "Last 30 Days",
        range: [moment().subtract(30, "day").startOf("day").toDate(), toDate],
      },
      {
        label: "Last 90 Days",
        range: [moment().subtract(90, "day").startOf("day").toDate(), toDate],
      },
      {
        label: "Last Year",
        range: [moment().startOf("year").toDate(), toDate],
      },
    ];

    return selectDateRange.map((value: DateRangeIntervals, index: number) => {
      return (
        <Button
          key={index}
          onClick={() => setRange(value.range)}
          size="medium"
          type="just_text"
        >
          {value.label}
        </Button>
      );
    });
  };

  return (
    <ThemeProvider theme={materialTheme}>
      <LocalizationProvider dateAdapter={DateFnsUtils}>
        <DateRangePicker
          startText="From"
          endText="To"
          value={value}
          onChange={(newValue: DateRange<Date>) => setRange(newValue)}
          renderInput={(startProps: any, endProps: any) => (
            <React.Fragment>
              <TextField {...startProps} />
              <DateRangeDelimiter> to </DateRangeDelimiter>
              <TextField {...endProps} />
            </React.Fragment>
          )}
        />
        {presetDateValues()}
      </LocalizationProvider>
    </ThemeProvider>
  );
}
