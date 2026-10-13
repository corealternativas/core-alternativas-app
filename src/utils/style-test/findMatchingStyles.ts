import { normalize } from "./normalize";
import { estilosAdjetivos } from "./styleData";

const MAX_RESULTS = 3;

/**
 * Ranks archetypes by count first, then by count / archetype adjective total
 * as a tiebreaker, and returns the top 3 keys.
 */
export function findMatchingStyles(
  inputString: string,
  estilosAdjetivosMap: typeof estilosAdjetivos = estilosAdjetivos
): string[] {
  const inputAdjectives = inputString
    .split(",")
    .map((a) => normalize(a.trim()));

  const matches = Object.entries(estilosAdjetivosMap).map(
    ([style, adjectives]) => {
      const count = adjectives.filter((adj) =>
        inputAdjectives.includes(normalize(adj))
      ).length;
      const score = adjectives.length > 0 ? count / adjectives.length : 0;
      return { style, count, score };
    }
  );

  return matches
    .filter((m) => m.count > 0)
    .sort((a, b) => b.count - a.count || b.score - a.score)
    .slice(0, MAX_RESULTS)
    .map((m) => m.style);
}
