import gql from "graphql-tag";
import { creativeFragments } from "Apollo/Fragments";

export default gql`
  mutation creativePut($id: ID, $input: CreativeInput!) {
    creativePut(id: $id, input: $input) {
      ...creativeFields
    }
  }
  ${creativeFragments}
`;
