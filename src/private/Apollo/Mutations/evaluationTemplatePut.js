import gql from "graphql-tag";
import {
  evaluationTemplateFragments,
  evaluationTemplateSectionFragments,
  evaluationTemplateQuestionFragments,
} from "Apollo/Fragments";

export default gql`
  mutation evaluationTemplatePut($id: ID, $input: EvaluationTemplateInput) {
    evaluationTemplatePut(id: $id, input: $input) {
      ...evaluationTemplateFields

      sections {
        ...evaluationTemplateSectionFields

        questions {
          ...evaluationTemplateQuestionFields
        }
      }
    }
  }
  ${evaluationTemplateFragments}
  ${evaluationTemplateSectionFragments}
  ${evaluationTemplateQuestionFragments}
`;
