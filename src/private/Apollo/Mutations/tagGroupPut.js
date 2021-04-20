import gql from "graphql-tag";
import { tagGroupFragments } from "Apollo/Fragments";

export default gql`
  mutation tagGroupPut($id: ID, $input: TagGroupInput, $delete: Boolean) {
    tagGroupPut(id: $id, input: $input, delete: $delete) {
      ...tagGroupFields
    }
  }
  ${tagGroupFragments}
`;
