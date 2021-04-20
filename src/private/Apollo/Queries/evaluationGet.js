import gql from "graphql-tag";

import { evaluationV2Fragments } from "Apollo/Fragments";

export default gql`
  query evaluationGet($id: ID!) {
    evaluationGet(id: $id) {
      ...evaluationV2Fields
    }
  }
  ${evaluationV2Fragments}
`;
