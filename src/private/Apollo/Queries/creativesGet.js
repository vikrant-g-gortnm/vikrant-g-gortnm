import gql from "graphql-tag";

import { creativeFragments } from "Apollo/Fragments";

export default gql`
  query creativesGet {
    creativesGet {
      ...creativeFields
    }
  }
  ${creativeFragments}
`;
