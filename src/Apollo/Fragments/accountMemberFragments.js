import gql from "graphql-tag";

export default gql`
  fragment accountMemberFields on AccountMember {
    email
    given_name
    family_name
    role
    latestActivity
  }
`;
