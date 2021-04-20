import gql from "graphql-tag";

export default gql`
  query creativeTemplateGet($id: ID) {
    creativeTemplateGet(id: $id) {
      id
      name
      description
      headerMessageInvited
      headerMessageWebForm
      successMessageInvited
      successMessageWebForm
      sections {
        id
        noEdit
        index
        name
        description
        questions {
          id
          noEdit
          index
          name
          description
          inputType
          options {
            noEdit
            index
            val
            sid
          }
        }
      }
    }
  }
`;
