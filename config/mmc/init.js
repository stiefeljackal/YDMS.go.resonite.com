import { readdirSync, readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

/** @type Map<string, MmcConfig> */
export const mmcCompetitionFullDataMap = new Map(crawlConfigs());
/** @type Set<string> */
export const validCompetitionTags = new Set(mmcCompetitionFullDataMap.keys());

function* crawlConfigs() {
  const mmcDirPath = dirname(fileURLToPath(import.meta.url));
  const mmcConfigFilePaths = readdirSync(mmcDirPath)
    .filter((filename) => filename.endsWith(".json"))
    .map((filename) => join(mmcDirPath, filename))
    .sort()

  for (const fullpath of mmcConfigFilePaths) {
    /** @type MmcConfig */
    const config = JSON.parse(readFileSync(fullpath), (key, value) => {
      switch (key) {
        case "startDate":
        case "endDate":
          return new Date(value);
        case "categories":
          return captureCategories(value);
        default:
          return value;
      }
    })

    const { competitionTag, competitionOtherTag } = config;

    yield [competitionTag, config];

    if (competitionOtherTag) {
      yield [competitionOtherTag, config];
    }
  }
}

function captureCategories(value, capturedCategories = [], parent = null) {
  for (const [tag, categoryConfigValue] of Object.entries(value)) {
    const categoryNode = {
      parent,
      requiredTags: [...(parent?.requiredTags ?? []), tag]
    };

    if (String(categoryConfigValue) === categoryConfigValue) {
      capturedCategories.push(Object.freeze({
        title: categoryConfigValue,
        ...categoryNode,
        tagKey: categoryNode.requiredTags.join(':').toLowerCase()
      }));
    } else {
      captureCategories(categoryConfigValue, capturedCategories, categoryNode);
    }
  }
  return capturedCategories;
}
