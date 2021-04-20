import gql from "graphql-tag";

export default gql`
  mutation externalResourcePut(
    $id: ID
    $connectionId: String
    $input: ExternalResourceInput
  ) {
    externalResourcePut(id: $id, connectionId: $connectionId, input: $input) {
      id
      connectionId
      createdAt
      createdBy
      url
      label
      iconClass
    }
  }
`;
