import React, { useState } from "react";
import TagSelector from "Components/TagSelector/TagSelector";
import { Tag, Modal } from "Components/elements/";
import DateRangeSelector from "Components/elements/NotataComponents/DateRangeSelector";

import { funnelGroupGet, tagGroupsGet } from "private/Apollo/Queries";
import { useQuery } from "@apollo/client";
import { cloneDeep } from "lodash";
import classnames from "classnames";

import moment from "moment";

import {
  container,
  container_mini,
  content,
  footer,
  filter_star,
  filter_icon_container,
  filter_icon,
  tag_each,
  tag_kill,
  filter_container,
  filter_content,
  funnel_tag_container,
  funnel_tag,
  funnel_tag_active,
} from "./Filters.module.scss";
import {
  clear_filters,
  counter,
  small_text_flex,
} from "./Connections/Connections.module.css";

const Tags = ({ filters, tagGroups, setFilters }) => {
  const [show, setShow] = useState(false);

  return (
    <div className={filter_icon_container}>
      <div className={filter_icon} onClick={() => setShow(!show)}>
        <i className={`${filters.tags?.length ? "fas" : "fal"} fa-tag`} />
      </div>

      <TagSelector
        show={show}
        close={() => setShow(false)}
        tagGroups={tagGroups}
        checkedTags={filters.tags}
        addTag={tag => {
          setFilters({
            ...filters,
            tags: [...filters.tags, tag],
          });
        }}
        deleteTag={tag => {
          setFilters({
            ...filters,
            tags: filters.tags.filter(({ id }) => id !== tag.id),
          });
        }}
      />
    </div>
  );
};

const Funnels = ({ filters, setFilters }) => {
  const { data, error, loading } = useQuery(funnelGroupGet);

  const [show, setShow] = useState(false);

  let funnelGroups = [];
  if (data && !error && !loading) {
    funnelGroups = data.accountGet.funnelGroups;
  }

  const addFunnelTag = funnelTag => {
    // let group = funnelGroups.find(({ id }) => funnelTag.funnelGroupId === id);

    if (filters.funnelTags.some(({ id }) => id === funnelTag.id)) {
      return setFilters([]);
    }

    setFilters([funnelTag]);
  };

  return (
    <div className={filter_icon_container}>
      <div className={filter_icon} onClick={() => setShow(!show)}>
        <i
          className={`${filters.funnelTags?.length ? "fas" : "fal"} fa-filter`}
        />
      </div>

      {show && (
        <Modal title="FUNNEL" close={() => setShow(false)}>
          {funnelGroups.map(funnelGroup => {
            let funnelTags = cloneDeep(funnelGroup.funnelTags);
            funnelTags = funnelTags.sort((a, b) => a.index - b.index);
            return (
              <div key={funnelGroup.id}>
                <div className={funnel_tag_container}>
                  {funnelTags.map((funnelTag, i) => (
                    <div
                      key={funnelTag.id}
                      className={classnames(
                        funnel_tag,
                        (filters.funnelTags || []).some(
                          ({ id }) => id === funnelTag.id
                        ) && funnel_tag_active
                      )}
                      style={{ width: `${100 - i * 10}%` }}
                      onClick={() => addFunnelTag(funnelTag)}
                    >
                      {funnelTag.name}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </Modal>
      )}
    </div>
  );
};

const DateSelector = ({ filters, setFilters }) => {
  const [show, setShow] = useState(false);

  const setDateFilter = dateRange => {
    setFilters({
      ...filters,
      dateRange: dateRange,
    });
  };

  return (
    <div className={filter_icon_container}>
      <div className={filter_icon}>
        <i
          className={`${
            filters.dateRange[0] || filters.dateRange[1] ? "fas" : "fal"
          } fa-calendar`}
          onClick={() => setShow(!show)}
        />
        {show && (
          <Modal title="DATE" close={() => setShow(false)}>
            <DateRangeSelector
              value={filters.dateRange}
              onValueChange={setDateFilter}
            />
          </Modal>
        )}
      </div>
    </div>
  );
};

function getHasFilters(filters) {
  const hasFilters =
    filters.tags.length ||
    filters.funnelTags.length ||
    filters.search ||
    filters.starred ||
    (filters.dateRange.length &&
      (filters.dateRange[0] || filters.dateRange[1]));
  return hasFilters;
}

export default function Filters({ filters, setFilters, fullFilter }) {
  const tagGroupsQuery = useQuery(tagGroupsGet);
  const tagGroups = tagGroupsQuery?.data?.tagGroupsGet || [];

  const formatDateTag = range => {
    let result = "";
    if (range[0]) {
      result += ` From ${moment(range[0]).format("MM-DD-YYYY")}`;
    }
    if (range[1]) {
      result += ` To ${moment(range[1]).format("MM-DD-YYYY")}`;
    }
    return result;
  };

  let hasFilters = getHasFilters(filters);

  return (
    <div>
      <div className={small_text_flex}>
        {!!hasFilters && (
          <div
            className={clear_filters}
            onClick={() => {
              setFilters({
                search: "",
                tags: [],
                funnelTags: [],
                dateRange: [null, null],
              });
            }}
          >
            clear all filters
          </div>
        )}
      </div>

      <div className={fullFilter ? container : container_mini}>
        <div className={footer}>
          <div className={filter_container}>
            {/*STAR*/}
            {fullFilter && (
              <div className={filter_content}>
                <div
                  className={filter_star}
                  onClick={() => {
                    setFilters({
                      ...filters,
                      starred: !filters.starred,
                    });
                  }}
                >
                  {(filters.starred && (
                    <i
                      className="fas fa-star"
                      style={{ color: "var(--color-orange)" }}
                    />
                  )) || (
                    <i
                      className="fal fa-star"
                      style={{ color: "var(--color-gray-light)" }}
                    />
                  )}
                </div>
              </div>
            )}

            {/*SEARCH*/}
            {fullFilter && (
              <div className={filter_content} style={{ width: "100%" }}>
                <div className="notata_form" style={{ width: "100%" }}>
                  <input
                    style={{
                      marginBottom: "6px",
                      width: "100%",
                    }}
                    type="text"
                    value={filters.search}
                    onChange={e =>
                      setFilters({ ...filters, search: e.target.value })
                    }
                    placeholder="Filter list..."
                  />
                </div>
              </div>
            )}

            {/*FUNNEL*/}
            <div className={filter_content}>
              <Funnels
                filters={filters}
                setFilters={funnelTags =>
                  setFilters({ ...filters, funnelTags })
                }
              />
            </div>

            {/*TAG*/}
            <div className={filter_content}>
              <Tags
                setFilters={setFilters}
                tagGroups={tagGroups}
                filters={filters}
              />
            </div>

            {/*CALENDAR*/}
            <div className={filter_content}>
              <DateSelector setFilters={setFilters} filters={filters} />
            </div>
          </div>
        </div>

        {(!!filters.tags.length ||
          !!filters.funnelTags.length ||
          filters.dateRange[0] ||
          filters.dateRange[1]) && (
          <div className={content}>
            <div>
              {filters.funnelTags.map(funnelTag => {
                return (
                  <Tag key={funnelTag.id}>
                    <div className={tag_each}>
                      <div>
                        <i className="fal fa-filter" /> {funnelTag.name}
                      </div>
                      <div
                        className={tag_kill}
                        onClick={() => {
                          setFilters({
                            ...filters,
                            funnelTags: [],
                          });
                        }}
                      >
                        <i className="fal fa-times" />
                      </div>
                    </div>
                  </Tag>
                );
              })}

              {filters.tags.map(tag => {
                const group =
                  tagGroups.find(({ id }) => id === tag.tagGroupId) || {};
                return (
                  <Tag key={tag.id}>
                    <div className={tag_each}>
                      <div>
                        <i className="fal fa-tag" /> {group.name}: {tag.name}
                      </div>
                      <div
                        className={tag_kill}
                        onClick={() => {
                          setFilters({
                            ...filters,
                            tags: filters.tags.filter(
                              ({ id }) => id !== tag.id
                            ),
                          });
                        }}
                      >
                        <i className="fal fa-times" />
                      </div>
                    </div>
                  </Tag>
                );
              })}

              {(filters.dateRange[0] || filters.dateRange[1]) && (
                <Tag key="dateFilterTag">
                  <div className={tag_each}>
                    <div>
                      <i className="fal fa-calendar" /> Date:{" "}
                      {formatDateTag(filters.dateRange)}
                    </div>
                    <div
                      className={tag_kill}
                      onClick={() => {
                        setFilters({
                          ...filters,
                          dateRange: [null, null],
                        });
                      }}
                    >
                      <i className="fal fa-times" />
                    </div>
                  </div>
                </Tag>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
