// import gql from "graphql-tag";
// import { groupFragments } from "Apollo/Fragments";

// export default gql`
//   mutation groupPut($id: ID, $input: GroupInput) {
//     groupPut(id: $id, input: $input) {
//       ...groupFields
//     }
//   }
//   ${groupFragments}
// `;

import gql from "graphql-tag";

import {
  groupFragments,
  tagFragments,
  funnelTagFragments,
  creativeFragments,
  connectionFragments,
  evaluationFragments,
} from "Apollo/Fragments";

export default gql`
  mutation groupPut($id: ID, $input: GroupInput) {
    groupPut(id: $id, input: $input) {
      ...groupFields

      evaluationTemplates {
        id
        name
        description
        sections {
          id
          name
        }
      }

      startups {
        connectionId
        creativeId
        sharedBy
        createdAt
        comments
        evaluations
        subjective_score
        tags
        seen

        connection {
          ...connectionFields

          creative {
            ...creativeFields
          }

          tags {
            ...tagFields
          }

          funnelTags {
            ...funnelTagFields
          }

          evaluations {
            ...evaluationFields
          }
        }
      }
    }
  }
  ${groupFragments}
  ${tagFragments}
  ${funnelTagFragments}
  ${creativeFragments}
  ${connectionFragments}
  ${evaluationFragments}
`;
