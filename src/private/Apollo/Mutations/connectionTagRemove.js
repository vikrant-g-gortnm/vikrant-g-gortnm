import gql from "graphql-tag";
import { connectionExtendedFragments } from "Apollo/Fragments";

export default gql`
  mutation connectionTagRemove($connectionId: ID!, $tagId: String!) {
    connectionTagRemove(connectionId: $connectionId, tagId: $tagId) {
      ...connectionExtendedFields
    }
  }
  ${connectionExtendedFragments}
`;
