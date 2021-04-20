import gql from "graphql-tag";

import { grouplogItemFragments } from "Apollo/Fragments";

interface DataValue {
  key: string;
  val: string;
}

export interface LogItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  createdByUser: {
    email: string;
    given_name: string;
    family_name: string;
  };
  logType: string;
  dataPairs: DataValue[];
}

export default gql`
  query groupLogGet($groupId: String) {
    groupLogGet(groupId: $groupId) {
      ...grouplogItemFragments
    }
  }
  ${grouplogItemFragments}
`;
