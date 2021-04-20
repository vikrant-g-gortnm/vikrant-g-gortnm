import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";

import { tagGroupsGet, connectionGet } from "private/Apollo/Queries";
import {
  connectionTagAdd,
  connectionTagRemove,
} from "private/Apollo/Mutations";

import { Button, Tag, Card } from "Components/elements";

import { tag_each, tag_name, tag_kill } from "./Tags.module.css";

import TagSelector from "Components/TagSelector/TagSelector";

export function Tags({ connection, user, match }) {
  const [show, setShow] = useState(false);
  const { data, error, loading } = useQuery(tagGroupsGet);
  const [mutate] = useMutation(connectionTagAdd);
  const [mutateDelete] = useMutation(connectionTagRemove);

  if (error) {
    console.log(error);
    return <div>We are updating</div>;
  }

  if (!data && loading) return <span />;

  const tagGroups = data?.tagGroupsGet || [];

  function addTag(tag) {
    mutate({
      variables: {
        connectionId: connection.id,
        tagId: tag.id,
      },

      optimisticResponse: {
        __typename: "Mutation",
        connectionTagAdd: {
          tags: [
            ...connection.tags,
            {
              createdAt: new Date().getTime(),
              index: connection.tags.length,
              createdBy: "tmp",
              id: "tmp-id",
              description: null,
              name: tag.name,
              tagGroupId: tag.tagGroupId,
              __typename: "Tag",
            },
          ],
          __typename: "Connection",
        },
      },

      update: (proxy, { data: { connectionTagAdd } }) => {
        const data = proxy.readQuery({
          query: connectionGet,
          variables: { id: connection.id },
        });
        proxy.writeQuery({
          query: connectionGet,
          variables: { id: connection.id },
          data: {
            connectionGet: {
              ...data.connectionGet,
              tags: [...connectionTagAdd.tags],
            },
          },
        });
      },
    });
  }

  function deleteTag(tag) {
    mutateDelete({
      variables: {
        connectionId: connection.id,
        tagId: tag.id,
      },

      optimisticResponse: {
        __typename: "Mutation",
        connectionTagRemove: {
          tags: [...connection.tags.filter(({ id }) => id !== tag.id)],
          __typename: "Connection",
        },
      },

      update: (proxy, { data: { connectionTagRemove } }) => {
        const data = proxy.readQuery({
          query: connectionGet,
          variables: { id: connection.id },
        });
        proxy.writeQuery({
          query: connectionGet,
          variables: { id: connection.id },
          data: {
            connectionGet: {
              ...data.connectionGet,
              tags: [...connection.tags.filter(({ id }) => id !== tag.id)],
            },
          },
        });
      },
    });
  }

  return (
    <div>
      <Card label="TAGS" style={{ paddingBottom: "15px" }}>
        <div>
          {!connection.tags.length && (
            <div>
              <div style={{ fontSize: "18px" }}>Add tags</div>
              <div
                style={{
                  padding: "20px 0px",
                  color: "var(--color-gray-medium)",
                }}
              >
                You can add tags to make it easier to filter through your
                startups. Tags are also used to see the bigger picture in
                reports. We recommend that you spend some time getting your tags
                right, as it will make it easier for you to navigate in your
                data.
              </div>
            </div>
          )}

          {!!connection.tags.length && (
            <div style={{ paddingBottom: "10px" }}>
              {connection.tags.map(tag => {
                const group =
                  tagGroups.find(({ id }) => id === tag.tagGroupId) || {};
                return (
                  <Tag key={tag.id}>
                    <div className={tag_each}>
                      <div className={tag_name}>
                        {group.name}: {tag.name}
                      </div>
                      <div className={tag_kill} onClick={() => deleteTag(tag)}>
                        <i className="fal fa-times" />
                      </div>
                    </div>
                  </Tag>
                );
              })}
            </div>
          )}
        </div>
      </Card>

      <div
        style={{
          marginTop: "0px",
          display: "flex",
          justifyContent: "space-between",
          position: "relative",
          top: "-40px",
        }}
      >
        <span />
        <Button size="small" type="right_arrow" onClick={() => setShow(true)}>
          Add/remove tags
        </Button>
      </div>

      <TagSelector
        show={show}
        tagGroups={tagGroups}
        checkedTags={connection.tags}
        addTag={addTag}
        deleteTag={deleteTag}
        close={() => {
          setShow(false);
        }}
      />
    </div>
  );
}
