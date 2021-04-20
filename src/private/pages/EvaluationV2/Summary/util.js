export function getPossibleScore(questions) {
  if (!questions || !questions.length) return {};

  return questions.reduce((acc, { inputType, options }) => {
    if (inputType === "TRAFFIC_LIGHTS") {
      return acc + 2;
    }

    if (inputType === "RADIO") {
      return (
        acc +
        Math.max.apply(
          Math,
          options.map(o => o.score || 0)
        )
      );
    }

    if (inputType === "CHECK") {
      return acc + options.reduce((acc, { score }) => acc + score, 0);
    }

    return acc;
  }, 0);
}

export function getScore(questions, answers) {
  if (!questions || !questions.length) return {};

  return questions.reduce((acc, { inputType, options, id }) => {
    const answer = answers.find(({ questionId }) => id === questionId);

    if (inputType === "TRAFFIC_LIGHTS") {
      if (answer) {
        switch (answer.val) {
          case "green":
            return acc + 2;
          case "yellow":
            return acc + 1;
          default:
            return acc;
        }
      }
    }

    if (inputType === "RADIO") {
      if (answer) {
        const option = options.find(({ sid }) => sid === answer.sid);

        if (option) {
          return acc + option.score;
        }
      }
    }

    if (inputType === "CHECK") {
      return (
        acc +
        answers
          .filter(({ questionId, val }) => id === questionId && val)
          .reduce((acc, filteredAnswer) => {
            const option = options.find(
              ({ sid }) => sid === filteredAnswer.sid
            );

            if (option) {
              return acc + option.score;
            }

            return acc;
          }, 0)
      );
    }

    return acc;
  }, 0);
}
