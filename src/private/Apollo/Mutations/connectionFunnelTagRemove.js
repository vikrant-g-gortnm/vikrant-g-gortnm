import gql from "graphql-tag";
import { connectionExtendedFragments } from "Apollo/Fragments";

export default gql`
  mutation connectionFunnelTagRemove(
    $connectionId: ID!
    $funnelTagId: String!
  ) {
    connectionFunnelTagRemove(
      connectionId: $connectionId
      funnelTagId: $funnelTagId
    ) {
      ...connectionExtendedFields
    }
  }
  ${connectionExtendedFragments}
`;
