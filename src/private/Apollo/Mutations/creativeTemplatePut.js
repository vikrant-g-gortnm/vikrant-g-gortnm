import gql from "graphql-tag";

export default gql`
  mutation creativeTemplatePut($id: ID, $input: CreativeTemplateInput) {
    creativeTemplatePut(id: $id, input: $input) {
      id
      name
      description
      headerMessageInvited
      headerMessageWebForm
      successMessageInvited
      successMessageWebForm
      sections {
        id
        index
        noEdit
        name
        description
        questions {
          id
          index
          noEdit
          name
          description
          inputType
          options {
            index
            noEdit
            val
            sid
          }
        }
      }
    }
  }
`;
