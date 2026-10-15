(function () {
  const STORAGE_PREFIX = "prepai:performance:v1:";
  const MAX_ATTEMPTS = 300;

  function storageKey(userId) {
    return `${STORAGE_PREFIX}${encodeURIComponent(userId)}`;
  }

  function list(userId) {
    if (!userId) return [];
    try {
      const records = JSON.parse(localStorage.getItem(storageKey(userId)) || "[]");
      return Array.isArray(records) ? records : [];
    } catch (error) {
      console.warn("Could not read the performance portfolio:", error);
      return [];
    }
  }

  function record(userId, attempt) {
    if (!userId) throw new Error("A signed-in user is required to save performance.");
    const score = Number(attempt.score);
    const total = Number(attempt.total);
    if (!attempt.component || !Number.isFinite(score) || !Number.isFinite(total) || total < 1 || score < 0 || score > total) {
      throw new Error("This performance result is not valid.");
    }

    const saved = {
      id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
      component: String(attempt.component),
      topic: String(attempt.topic || "Practice"),
      difficulty: String(attempt.difficulty || ""),
      score,
      total,
      completedAt: new Date().toISOString()
    };
    const records = [saved, ...list(userId)].slice(0, MAX_ATTEMPTS);
    localStorage.setItem(storageKey(userId), JSON.stringify(records));
    if (window.parent !== window) {
      window.parent.postMessage({ type: "prepai:performance-updated" }, window.location.origin);
    }
    return saved;
  }

  window.PrepAIPerformance = { list, record };
})();
