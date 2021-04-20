import gql from "graphql-tag";

export default gql`
  mutation evaluationTemplateDelete($id: ID!) {
    evaluationTemplateDelete(id: $id) {
      message
    }
  }
`;
