import gql from "graphql-tag";

export default gql`
  mutation impactGoalsPut($id: ID!, $input: ImpactGoalsInput!) {
    impactGoalsPut(id: $id, input: $input) {
      id
      goals {
        key
        val
      }
    }
  }
`;
