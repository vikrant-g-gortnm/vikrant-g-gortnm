import gql from "graphql-tag";
import { pageScraperFragments } from "Apollo/Fragments";

export default gql`
  query pageScraper($url: String!) {
    pageScraper(url: $url) {
      ...pageScraperFields
    }
  }
  ${pageScraperFragments}
`;
