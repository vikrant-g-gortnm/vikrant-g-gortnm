import gql from "graphql-tag";
import {
  evaluationTemplateSectionFragments,
  evaluationTemplateQuestionFragments,
} from "Apollo/Fragments";

export default gql`
  mutation evaluationTemplateSectionPut(
    $id: ID
    $templateId: ID
    $input: EvaluationTemplateSectionInput
  ) {
    evaluationTemplateSectionPut(
      id: $id
      templateId: $templateId
      input: $input
    ) {
      ...evaluationTemplateSectionFields

      questions {
        ...evaluationTemplateQuestionFields
      }
    }
  }
  ${evaluationTemplateSectionFragments}
  ${evaluationTemplateQuestionFragments}
`;

// import {
//   evaluationTemplateFragments,
//   evaluationTemplateSectionFragments,
//   evaluationTemplateQuestionFragments
// } from "Apollo/Fragments";

// export default gql`
//   mutation evaluationTemplateSectionPut($id: ID, $templateId: ID, $input: EvaluationTemplateSectionInput) {
//     evaluationTemplateSectionPut(id: $id, templateId: $templateId, input: $input) {

//       ...evaluationTemplateFields

//       sections {

//         ...evaluationTemplateSectionFields

//         questions {

//           ...evaluationTemplateQuestionFields

//         }

//       }

//     }
//   }
//   ${evaluationTemplateFragments}
//   ${evaluationTemplateSectionFragments}
//   ${evaluationTemplateQuestionFragments}
// `;
