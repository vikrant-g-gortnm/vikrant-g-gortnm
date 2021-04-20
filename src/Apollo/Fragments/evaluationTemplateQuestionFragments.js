import gql from "graphql-tag";

export default gql`
  fragment evaluationTemplateQuestionFields on EvaluationTemplateQuestion {
    id
    createdBy
    accountId
    createdAt
    updatedAt
    name
    description
    inputType
    options {
      val
      score
      index
      sid
    }
  }
`;
