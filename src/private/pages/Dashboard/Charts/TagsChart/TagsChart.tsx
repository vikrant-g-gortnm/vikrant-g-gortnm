import React from "react";
import Select, { components } from "react-select";
import { cloneDeep } from "lodash";
import { Tag, ChartData } from "../../Connections/types";
import PieChart from "../PieChart";
import BarChart from "../BarChart";
import { ChartType } from "../ChartBlock";

const Placeholder = (props: any) => {
  return (
    <>
      <svg height={20} width={20} viewBox="0 0 1024 1024">
        <path d="M715.8 493.5L335 165.1c-14.2-12.2-35-1.2-35 18.5v656.8c0 19.7 20.8 30.7 35 18.5l380.8-328.4c10.9-9.4 10.9-27.6 0-37z" />
      </svg>
      <components.Placeholder {...props} />
    </>
  );
};

const SingleValue = (props: any) => {
  return (
    <>
      <svg height={20} width={20} viewBox="0 0 1024 1024">
        <path d="M715.8 493.5L335 165.1c-14.2-12.2-35-1.2-35 18.5v656.8c0 19.7 20.8 30.7 35 18.5l380.8-328.4c10.9-9.4 10.9-27.6 0-37z" />
      </svg>
      <components.SingleValue {...props} />
    </>
  );
};

const customStyles = {
  menu: (provided: any) => ({
    ...provided,
    width: 240,
  }),
  control: (base: any) => ({
    ...base,
    width: 140,
    border: 0,
    boxShadow: "none",
    background: "none",
  }),
  container: (provided: any) => ({
    ...provided,
    width: 140,
  }),
  placeholder: (base: any) => ({
    ...base,
    fontSize: "1em",
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  dropdownIndicator: () => ({
    display: "none",
  }),
  singleValue: (base: any) => ({
    ...base,
    paddingLeft: 20,
  }),
};

const TagsChart = ({
  tags,
  tagGroups,
  groupsTags,
  chartType,
  lengthFilter,
  widthState,
  dataType,
  setDataType,
}: {
  tags: Tag[];
  tagGroups: any;
  groupsTags: Map<string, Map<string, ChartData>>;
  chartType?: ChartType;
  lengthFilter?: number;
  widthState?: string;
  dataType?: any;
  setDataType?: Function;
}) => {
  let groupTags = cloneDeep(groupsTags.get(dataType)!);

  tags.forEach(tag => {
    if (groupTags?.has(tag.id)) groupTags.get(tag.id)!.value++;
  });

  let data: ChartData[] = groupTags ? Array.from(groupTags.values()) : [];
  if (lengthFilter && lengthFilter > 0)
    data = data.filter(group => group.value >= lengthFilter);
  data.sort((a, b) => b.value - a.value);

  return (
    <>
      <Select
        options={tagGroups}
        defaultValue={tagGroups.find((group: any) => group.id === dataType)}
        onChange={val => setDataType!(val.id)}
        components={{ Placeholder, SingleValue }}
        getOptionLabel={option => option.name}
        isOptionSelected={option => option.id === dataType.id}
        placeholder={"Choose"}
        isSearchable={false}
        styles={customStyles}
      />
      {chartType === ChartType.PIE ? (
        <PieChart
          data={data}
          widthState={widthState}
          selectedTags={groupsTags.get(dataType)!}
        />
      ) : (
        <BarChart data={data} selectedTags={groupsTags.get(dataType)!} />
      )}
    </>
  );
};

export default TagsChart;
