import gql from "graphql-tag";
import { evaluationV2Fragments } from "Apollo/Fragments";

export default gql`
  mutation evaluationCreate(
    $connectionId: String!
    $templateId: String!
    $answers: [EvaluationV2AnswerInput]
  ) {
    evaluationCreate(
      connectionId: $connectionId
      templateId: $templateId
      answers: $answers
    ) {
      ...evaluationV2Fields
    }
  }
  ${evaluationV2Fragments}
`;
