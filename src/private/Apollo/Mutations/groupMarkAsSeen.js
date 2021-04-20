import gql from "graphql-tag";

export default gql`
  mutation groupMarkAsSeen(
    $markAll: Boolean
    $groupId: ID
    $connectionId: ID
    $sharedBy: String
  ) {
    groupMarkAsSeen(
      markAll: $markAll
      groupId: $groupId
      connectionId: $connectionId
      sharedBy: $sharedBy
    ) {
      message
    }
  }
`;
