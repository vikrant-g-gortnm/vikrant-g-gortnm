import gql from "graphql-tag";
import { logItemFragments } from "Apollo/Fragments";

export default gql`
  mutation logUpdate($id: ID!, $input: LogItemInput!) {
    logUpdate(id: $id, input: $input) {
      ...logItemFields
    }
  }
  ${logItemFragments}
`;
