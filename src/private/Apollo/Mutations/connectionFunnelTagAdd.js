import gql from "graphql-tag";
import { connectionExtendedFragments } from "Apollo/Fragments";

export default gql`
  mutation connectionFunnelTagAdd($connectionId: ID!, $funnelTagId: String!) {
    connectionFunnelTagAdd(
      connectionId: $connectionId
      funnelTagId: $funnelTagId
    ) {
      ...connectionExtendedFields
    }
  }
  ${connectionExtendedFragments}
`;
