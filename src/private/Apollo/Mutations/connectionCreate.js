import gql from "graphql-tag";
import { connectionExtendedFragments } from "Apollo/Fragments";

export default gql`
  mutation connectionCreate($creativeId: String!, $input: ConnectionInput) {
    connectionCreate(creativeId: $creativeId, input: $input) {
      ...connectionExtendedFields
    }
  }
  ${connectionExtendedFragments}
`;
