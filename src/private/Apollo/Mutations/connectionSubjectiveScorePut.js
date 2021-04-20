import gql from "graphql-tag";
import { connectionExtendedFragments } from "Apollo/Fragments";

export default gql`
  mutation connectionSubjectiveScorePut($id: ID!, $score: Int!) {
    connectionSubjectiveScorePut(id: $id, score: $score) {
      ...connectionExtendedFields
    }
  }
  ${connectionExtendedFragments}
`;
