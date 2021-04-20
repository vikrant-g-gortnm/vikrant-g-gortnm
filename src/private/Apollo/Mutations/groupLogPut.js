import gql from "graphql-tag";
import { grouplogItemFragments } from "Apollo/Fragments";

export default gql`
  mutation groupLogPut($groupId: String!, $input: GroupLogInput!) {
    groupLogPut(groupId: $groupId, input: $input) {
      ...grouplogItemFragments
    }
  }
  ${grouplogItemFragments}
`;
