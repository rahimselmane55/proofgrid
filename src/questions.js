export function buildSellerQuestions(claims = []) {
  const questions = [];
  const concerns = [];

  for (const claim of claims) {
    if (claim.status === 'evidence_seen') continue;

    if (claim.status === 'concern') {
      concerns.push({
        id: claim.id,
        label: claim.label,
        sourceText: claim.sourceText,
        question: claim.sellerQuestion,
      });
      continue;
    }

    questions.push({
      id: claim.id,
      label: claim.label,
      question: claim.sellerQuestion,
    });
  }

  return { questions, concerns };
}

export function formatSellerQuestions(items = []) {
  if (!items.length) return '';
  return items.map((item, index) => `${index + 1}. ${item.question}`).join('\n');
}
