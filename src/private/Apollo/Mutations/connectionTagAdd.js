import gql from "graphql-tag";
import { connectionExtendedFragments } from "Apollo/Fragments";

export default gql`
  mutation connectionTagAdd($connectionId: ID!, $tagId: String!) {
    connectionTagAdd(connectionId: $connectionId, tagId: $tagId) {
      ...connectionExtendedFields
    }
  }
  ${connectionExtendedFragments}
`;
