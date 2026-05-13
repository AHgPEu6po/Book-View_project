const cosineSimilarity = (a, b) => {

  let dot = 0;
  let normA = 0;
  let normB = 0;

  const keys = new Set([
    ...Object.keys(a),
    ...Object.keys(b),
  ]);

  for (const key of keys) {

    const valA = a[key] || 0;
    const valB = b[key] || 0;

    dot += valA * valB;

    normA += valA * valA;
    normB += valB * valB;
  }

  if (!normA || !normB) {
    return 0;
  }

  return dot / (
    Math.sqrt(normA) *
    Math.sqrt(normB)
  );
};

export { cosineSimilarity };