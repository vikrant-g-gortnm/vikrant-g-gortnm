export function getDataForEvaluationsSharedInGroup({
  group,
  evaluations,
  hide,
}) {
  // Cluster evaluations by template ID
  // ––––––––––––––––––––––––––––––––––
  let evaluationsByTemplate = {};
  for (let evaluation of evaluations) {
    evaluationsByTemplate[evaluation.templateId] =
      evaluationsByTemplate[evaluation.templateId] || [];
    evaluationsByTemplate[evaluation.templateId].push(evaluation);
  }

  let data = [];

  for (let templateId in evaluationsByTemplate) {
    // Get all shared evaluations
    let evaluations = evaluationsByTemplate[templateId] || [];

    // Get possible score
    let possibleScore = evaluations[0]?.summary?.possibleScore;

    // Get template name
    let templateName = evaluations[0]?.summary?.templateName;

    // Get template sections
    let templateSections = evaluations[0]?.summary?.sections;

    // Get total score
    let totalScore = 0;
    let count = 0;

    let averagePerTemplateSection = {};
    for (let evaluation of evaluations) {
      if (!hide[evaluation.id]) {
        // Get averages for sections
        for (let section of evaluation.summary.sections) {
          averagePerTemplateSection[section.name] = averagePerTemplateSection[
            section.name
          ] || {
            totalScore: 0,
            count: 0,
            possibleScore: 0,
            scorePerAnswer: {},
          };
          averagePerTemplateSection[section.name].totalScore += section.score;
          averagePerTemplateSection[section.name].count += 1;

          averagePerTemplateSection[section.name].possibleScore =
            section.possibleScore;

          // Get average single answers for section
          for (let answer of section.scorePerAnswer) {
            averagePerTemplateSection[section.name].scorePerAnswer[
              answer.question
            ] = averagePerTemplateSection[section.name].scorePerAnswer[
              answer.question
            ] || {
              totalScore: 0,
              count: 0,
              possibleScore: 0,
            };
            averagePerTemplateSection[section.name].scorePerAnswer[
              answer.question
            ].count += 1;
            averagePerTemplateSection[section.name].scorePerAnswer[
              answer.question
            ].possibleScore = answer.possibleScore;
            averagePerTemplateSection[section.name].scorePerAnswer[
              answer.question
            ].totalScore += answer.score;
          }
        }

        totalScore += evaluation.summary?.totalScore || 0;
        count += 1;
      }
    }

    // console.log('averagePerTemplateSection', averagePerTemplateSection)

    // Get average score
    let averageScore = parseFloat((totalScore / count).toFixed(1));

    // Get average percentage score
    let averagePercentageScore =
      Math.round((averageScore / possibleScore) * 100) || 0;

    // Put it all together
    data.push({
      groupName: group.name,
      groupId: group.id,
      templateId: templateId,
      templateName: templateName,
      submissions: evaluations.length,
      averageScore: averageScore,
      possibleScore: possibleScore,
      averagePercentageScore: averagePercentageScore,
      templateSections: templateSections,
      evaluations: evaluations,
      averagePerTemplateSection: averagePerTemplateSection,
    });
  }

  return data;
}

export function getEvaluationSummaries({ connection, groups, hide }) {
  // Get all shared evaluations
  // ––––––––––––––––––––––––––
  let sharedEvaluations = [];
  for (let sharedItem of connection.sharedWithMe) {
    if (sharedItem.connection) {
      for (let sharedEvaluation of sharedItem.connection.evaluations) {
        if (sharedItem.evaluations) {
          sharedEvaluations.push({
            evaluation: sharedEvaluation,
            sharedItem,
          });
        }
      }
    }
  }

  // Cluster evaluations by groupId
  // ––––––––––––––––––––––––––––––
  let evaluationsByGroup = {};
  for (let { evaluation, sharedItem } of sharedEvaluations) {
    evaluationsByGroup[sharedItem.groupId] =
      evaluationsByGroup[sharedItem.groupId] || [];
    evaluationsByGroup[sharedItem.groupId].push({ evaluation, sharedItem });
  }

  let data = [];

  for (let groupId in evaluationsByGroup) {
    let thisGroup = groups.find(g => g.id === groupId) || {};
    let sharedEvaluationsInGroup = evaluationsByGroup[groupId];

    let data2 = getDataForEvaluationsSharedInGroup({
      group: thisGroup,
      evaluations: sharedEvaluationsInGroup.map(({ evaluation }) => evaluation),
      hide,
    });

    data.push(data2);
  }
  return data;
}
