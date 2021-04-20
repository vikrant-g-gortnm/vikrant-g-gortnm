import gql from "graphql-tag";

import {
  // groupFragments,
  tagFragments,
  funnelTagFragments,
  creativeFragments,
  connectionFragments,
} from "Apollo/Fragments";

export default gql`
  query groupGetListOfStartups($creativeId: ID) {
    groupGetListOfStartups(creativeId: $creativeId) {
      connectionId
      creativeId
      sharedBy
      createdAt
      comments
      evaluations
      subjective_score
      tags
      groupName
      groupId

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
      }

      members {
        email
        role
        joinedDate
        latestActivity
      }
    }
  }
  ${tagFragments}
  ${funnelTagFragments}
  ${creativeFragments}
  ${connectionFragments}
`;
