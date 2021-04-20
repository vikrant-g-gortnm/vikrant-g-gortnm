import gql from "graphql-tag";
import { funnelTagFragments } from "Apollo/Fragments";

export default gql`
  mutation funnelTagPut($id: ID, $funnelGroupId: ID, $input: FunnelTagInput) {
    funnelTagPut(id: $id, funnelGroupId: $funnelGroupId, input: $input) {
      ...funnelTagFields
    }
  }
  ${funnelTagFragments}
`;
