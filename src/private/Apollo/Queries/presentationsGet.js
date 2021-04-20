import gql from "graphql-tag";
import { presentationFragments } from "Apollo/Fragments";

export default gql`
  query presentationsGet($connectionId: ID) {
    presentationsGet(connectionId: $connectionId) {
      ...presentationFields
    }
  }
  ${presentationFragments}
`;
