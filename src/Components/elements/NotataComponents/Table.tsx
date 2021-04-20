import React, { useEffect } from "react";

import styles from "./Table.module.css";
const classnames = require("classnames");

let responsive_map: { [key: string]: any } = {
  sm: styles.responsive_sm,
  md: styles.responsive_md,
  lg: styles.responsive_lg,
};

interface Props {
  dataSource: any[];
  columns: any[];
  cell_content?: string;
  loading?: boolean;
  disableHead?: boolean;
  noMargin?: boolean;
  paginateAt?: number;
  allowSorting?: boolean;
  label?: string;
  emptyLabel?: string;
  // rowLinkFn: (arg0: string) => string;
}

enum DataType {
  DATE = "date",
  NUMBER = "number",
  STRING = "string",
  BOOLEAN = "boolean",
}

enum SortType {
  NONE = "none",
  ASC = "asc",
  DESC = "desc",
}

const sortValues: { [key: number]: SortType } = {
  0: SortType.NONE,
  1: SortType.ASC,
  2: SortType.DESC,
};

export const Table = ({
  dataSource,
  columns,
  cell_content,
  loading,
  disableHead,
  noMargin,
  paginateAt,
  allowSorting,
  emptyLabel,
}: Props) => {

  const [sort, setSort] = React.useState<Map<number, SortType>>(
    new Map<number, SortType>()
  );

  let [dataSourceProcessed, setDataSourceProcessed] = React.useState<any[]>([]);

  useEffect(() => {
    const sortKey = [...sort]
      .filter(([key, val]) => val === SortType.ASC || val === SortType.DESC)
      .map(([key, val]) => key)[0];
    if (sortKey == null) {
      const sortMap: Map<number, SortType> = sort;
      columns.forEach((column: any, index: number) => {
        if (allowSorting && column.allowSorting !== false) {
          sortMap.set(index, SortType.NONE);
        }
        setSort(sort);
      });
      setDataSourceProcessed(dataSource);
    } else {
      applySorting(sortKey);
    }
  }, [dataSource]);

  const setNextSortValue = (index: number): void => {
    const currentValue = sort.get(index);
    const currentIndex = Object.values(sortValues).indexOf(
      currentValue || SortType.NONE
    );
    sort.forEach((value: SortType, key: number) => {
      sort.set(key, SortType.NONE);
    });
    currentIndex < 2
      ? sort.set(index, sortValues[currentIndex + 1])
      : sort.set(index, SortType.NONE);
    setSort(new Map(sort));
    applySorting(index);
  };

  function applySorting(index: number): void {
    const columnSettings = columns[index];
    const dataType: DataType = columnSettings?.type;
    const sortingField = columns[index].key ? columns[index].key : "";
    const sortValue = sort.get(index) || SortType.NONE;

    if (sortValue && sortValue !== SortType.NONE) {
      if (sortingField && !columnSettings.valueExpr) {
        switch (dataType) {
          case DataType.STRING:
            dataSourceProcessed = dataSource
              .slice()
              .sort((a: any, b: any) =>
                sortValue === SortType.ASC
                  ? resolveField(sortingField, a).localeCompare(
                      resolveField(sortingField, b)
                    )
                  : resolveField(sortingField, b).localeCompare(
                      resolveField(sortingField, a)
                    )
              );
            break;
          case DataType.DATE:
            dataSourceProcessed = dataSource
              .slice()
              .sort((a: any, b: any) =>
                sortValue === SortType.ASC
                  ? new Date(resolveField(sortingField, b)).getTime() -
                    new Date(resolveField(sortingField, a)).getTime()
                  : new Date(resolveField(sortingField, a)).getTime() -
                    new Date(resolveField(sortingField, b)).getTime()
              );
            break;
          case DataType.BOOLEAN || DataType.NUMBER:
            dataSourceProcessed = dataSource
              .slice()
              .sort((a: any, b: any) =>
                sortValue === SortType.ASC
                  ? resolveField(sortingField, b) -
                    resolveField(sortingField, a)
                  : resolveField(sortingField, a) -
                    resolveField(sortingField, b)
              );
            break;
        }
      } else if (columnSettings.valueExpr) {
        dataSourceProcessed = dataSource
          .slice()
          .sort((a: any, b: any) =>
            sortValue === SortType.ASC
              ? columnSettings.valueExpr(b) - columnSettings.valueExpr(a)
              : columnSettings.valueExpr(a) - columnSettings.valueExpr(b)
          );
      }
    } else {
      dataSourceProcessed = dataSource.slice();
    }
    setDataSourceProcessed(dataSourceProcessed);
  }

  function resolveField(field: string, obj: any): any {
    return field.split(".").reduce((p, c) => p?.[c], obj);
  }

  // endregion

  return (
    <div>
      <table
        className={classnames(
          styles.container,
          disableHead && styles.no_head,
          noMargin && styles.no_margin
        )}
      >
        {!disableHead && (
          <thead>
            <tr>
              {columns.map((c, i) => {
                return (
                  <td
                    key={`head-${i}`}
                    style={{ width: c.width ? `${c.width}px` : "auto" }}
                    className={classnames(
                      c.responsive && responsive_map[c.responsive]
                    )}
                  >
                    <div
                      className={classnames(
                        c.className && c.className,
                        cell_content
                      )}
                      style={{
                        textAlign: c.centered ? "center" : "left",
                      }}
                    >
                      <span>{c.title}</span>
                      <span
                        className={styles.sort_icon}
                        onClick={() => setNextSortValue(i)}
                      >
                        <i
                          // style={{opacity: sort.get(i) === SortType.NONE ? 0.5 : 1}}
                          className={classnames({
                            "fal fa-sort-alt": sort.get(i) === SortType.NONE,
                            "fal fa-sort-amount-down":
                              sort.get(i) === SortType.ASC,
                            "fal fa-sort-amount-up":
                              sort.get(i) === SortType.DESC,
                          })}
                        />
                      </span>
                    </div>
                  </td>
                );
              })}
            </tr>
          </thead>
        )}

        <tbody>
          {dataSourceProcessed.map((d, i) => (
            <tr
              key={`t-${i}`}
              // onClick={() => rowLinkFn(d)}
            >
              {columns.map((c, ii) => {
                return (
                  <td
                    key={`${i}-${ii}`}
                    style={{ width: c.width ? `${c.width}px` : "auto" }}
                    className={classnames(
                      c.responsive && responsive_map[c.responsive]
                    )}
                  >
                    <div
                      className={classnames(
                        c.className && c.className,
                        cell_content
                      )}
                      style={{
                        textAlign: c.centered ? "center" : "left",
                      }}
                    >
                      {c.render(c.dataIndex ? d[c.dataIndex] : d, i)}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {loading && (
        <div className={styles.loader}>
          <i className={"fa fa-spinner fa-spin"} />
        </div>
      )}

      {!dataSourceProcessed.length && (
        <div className={styles.empty_list}>
          {emptyLabel || "This list is empty"}
        </div>
      )}
    </div>
  );
};
