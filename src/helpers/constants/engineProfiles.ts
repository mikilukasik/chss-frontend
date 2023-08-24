export const engineProfiles: Record<string, Record<string, unknown>> = {
  "AI + minimax (3sec)": {
    timeout: 3000,
    moveSorters: [{ cutoff: 0.01 }],
    moveScoreRario: 2,
  },
  "AI only": {
    maxDepth: 0,
  },
};

export const defaultEngineProfile = "AI + minimax (3sec)";

export const engineProfileNames = Object.keys(engineProfiles);
