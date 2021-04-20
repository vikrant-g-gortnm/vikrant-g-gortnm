import gql from "graphql-tag";

export default gql`
  mutation evaluationTemplateQuestionDelete($id: ID!) {
    evaluationTemplateQuestionDelete(id: $id) {
      message
    }
  }
`;
