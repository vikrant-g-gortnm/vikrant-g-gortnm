import gql from "graphql-tag";
import { tagFragments } from "Apollo/Fragments";

export default gql`
  mutation tagPut($id: ID, $tagGroupId: ID, $input: TagInput) {
    tagPut(id: $id, tagGroupId: $tagGroupId, input: $input) {
      ...tagFields
    }
  }
  ${tagFragments}
`;
