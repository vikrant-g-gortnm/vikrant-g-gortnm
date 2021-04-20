import gql from "graphql-tag";

import { funnelGroupFragments, funnelTagFragments } from "Apollo/Fragments";

export default gql`
  query funnelGroupGet {
    accountGet {
      funnelGroups {
        ...funnelGroupFields
        funnelTags {
          ...funnelTagFields
        }
      }
    }
  }
  ${funnelGroupFragments}
  ${funnelTagFragments}
`;
