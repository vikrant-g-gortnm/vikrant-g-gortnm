import gql from "graphql-tag";

import { groupFragments } from "Apollo/Fragments";

interface EvaluationTemplates {
  id: string;
  name: string;
  description: string;
  sections: {
    id: string;
    name: string;
  };
}
export interface Startups {
  connectionId: string;
  creativeId: string;
  sharedBy: string;
  createdAt: string;
  comments: string;
  evaluations: string;
  subjective_score: string;
  tags: string;
  seen: string;

  connection: {
    id: string;
    creative: {
      id: string;
      name: string;
    };
  };
}

export interface Member {
  email: string;
  role: string;
  joinedDate: string;
  latestActivity: string;
}
export interface Groups {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  createdByUser: {
    email: string;
    given_name: string;
    family_name: string;
  };
  members: Member[];
  settings: {
    chat: string;
    public: boolean;
    showUsers: string;
    showScores: string;
    addStartup: string;
    addUser: string;
  };
  evaluationTemplates: EvaluationTemplates;
  startups: Startups[];
}

export default gql`
  query groupsGet {
    groupsGet {
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
          id
          creative {
            id
            name
          }
        }
      }
    }
  }
  ${groupFragments}
`;
