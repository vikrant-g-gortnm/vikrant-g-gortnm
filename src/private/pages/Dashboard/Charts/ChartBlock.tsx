import React, { useState } from "react";
import styles from "./ChartBlock.module.scss";

export enum ChartType {
  PIE = "PIE",
  BAR = "BAR",
}

export enum WidthState {
  HALF = "HALF",
  FULL = "FULL",
}

export const ChartBlock = ({
  header,
  showSelector,
  initialWidthState = WidthState.HALF,
  onDeleteBlock,
  onChangeDataType,
  groupsTags,
  dataType,
  ...props
}: any) => {
  const [chartType, setChartType] = useState<ChartType>(ChartType.PIE);
  const [widthState, setWidthState] = useState<WidthState>(initialWidthState);
  const [lengthFilter, setlengthFilter] = useState(0);

  return (
    <div
      className={`${styles.content} ${
        widthState === WidthState.FULL ? styles.flex_100 : styles.flex_50
      }`}
    >
      <div className={styles.header_text}>{header}</div>

      {showSelector && (
        <div className={styles.block_controls}>
          <div className={styles.input_filter}>
            <div>
              <i className="fas fa-filter" />
            </div>
            <input
              onChange={e => setlengthFilter(parseInt(e.target.value))}
              className={styles.button_filter}
            />
          </div>
          <button
            onClick={() =>
              setWidthState(
                widthState === WidthState.HALF
                  ? WidthState.FULL
                  : WidthState.HALF
              )
            }
            className={styles.button_width}
          >
            <i
              className={`fas ${
                widthState === WidthState.HALF
                  ? "fa-expand-alt"
                  : "fa-compress-alt"
              }`}
            />
          </button>

          <button
            className={styles.button_chart_type}
            onClick={() =>
              setChartType(
                chartType === ChartType.PIE ? ChartType.BAR : ChartType.PIE
              )
            }
          >
            <i
              className={`fas ${
                chartType === ChartType.PIE ? "fa-chart-pie" : "fa-chart-bar"
              }`}
            />
          </button>

          <button
            className={styles.button_width}
            onClick={() => onDeleteBlock(dataType)}
          >
            <i className="fas fa-trash-alt" />
          </button>
        </div>
      )}

      <div>
        {React.cloneElement(props.children, {
          chartType,
          widthState,
          dataType,
          setDataType: onChangeDataType,
          lengthFilter,
        })}
      </div>
    </div>
  );
};
