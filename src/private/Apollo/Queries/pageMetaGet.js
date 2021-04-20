import gql from "graphql-tag";
import { pageMetaFragments } from "Apollo/Fragments";
export default gql`
  query getPageMeta($url: String!) {
    getPageMeta(url: $url) {
      ...pageMetaFields
    }
  }
  ${pageMetaFragments}
`;
