import gql from "graphql-tag";
import { userFragments } from "Apollo/Fragments";

export interface User {
  cognitoIdentityId: string;
  email: string;
  given_name: string;
  family_name: string;
  phone_number: string;
  company: string;
}
export default gql`
  query userGet {
    userGet {
      ...userFields
    }
  }
  ${userFragments}
`;
