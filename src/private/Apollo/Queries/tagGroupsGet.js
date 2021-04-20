import gql from "graphql-tag";

import { tagGroupFragments, tagFragments } from "Apollo/Fragments";

export default gql`
  query tagGroupsGet {
    tagGroupsGet {
      ...tagGroupFields
      tags {
        ...tagFields
      }
    }
  }
  ${tagGroupFragments}
  ${tagFragments}
`;
