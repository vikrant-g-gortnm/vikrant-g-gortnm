import gql from "graphql-tag";
import { logItemFragments } from "Apollo/Fragments";

export default gql`
  mutation logCreate($connectionId: String!, $input: LogItemInput!) {
    logCreate(connectionId: $connectionId, input: $input) {
      ...logItemFields
    }
  }
  ${logItemFragments}
`;
