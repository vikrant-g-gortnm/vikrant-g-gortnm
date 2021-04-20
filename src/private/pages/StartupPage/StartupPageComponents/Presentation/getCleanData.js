import { omit } from "lodash";

export default function getCleanData(dirty) {
  let clean = omit(dirty, "__typename");
  if (dirty?.creativeDetails) {
    clean.creativeDetails = omit(dirty.creativeDetails, "__typename");

    if (dirty?.creativeDetails?.externalLinks) {
      clean.creativeDetails.externalLinks = dirty?.creativeDetails?.externalLinks.map(
        ({ key, val }) => ({ key, val })
      );
    }

    if (dirty?.creativeDetails?.seeking) {
      clean.creativeDetails.seeking = omit(
        dirty?.creativeDetails?.seeking,
        "__typename"
      );
    }

    if (dirty?.creativeDetails?.valuation) {
      clean.creativeDetails.valuation = omit(
        dirty?.creativeDetails?.valuation,
        "__typename"
      );
    }

    if (dirty?.creativeDetails?.sections) {
      clean.creativeDetails.sections = dirty?.creativeDetails?.sections.map(
        section => {
          return {
            ...omit(section, ["__typename"]),
            answers: section.answers.map(answer => {
              let pageMeta;
              if (answer.pageMeta) {
                pageMeta = omit(answer.pageMeta, ["__typename"]);
              }

              return {
                ...omit(answer, ["__typename"]),
                pageMeta,
              };
            }),
          };
        }
      );
    }
  }

  return clean;
}
