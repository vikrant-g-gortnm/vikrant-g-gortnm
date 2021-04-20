import gql from "graphql-tag";
import { evaluationV2Fragments } from "Apollo/Fragments";

export default gql`
  mutation evaluationUpdate($id: String!, $answers: [EvaluationV2AnswerInput]) {
    evaluationUpdate(id: $id, answers: $answers) {
      ...evaluationV2Fields
    }
  }
  ${evaluationV2Fragments}
`;
