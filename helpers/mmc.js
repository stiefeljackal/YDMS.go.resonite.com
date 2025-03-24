var competitionTag = "mmc25"; //TODO: handle years.

var categories = [
  {
    title: "World Social",
    requiredTags: ["world", "social"]
  },
  {
    title: "World Game",
    requiredTags: ["world", "game"]
  },
  {
    title: "World Misc",
    requiredTags: ["world", "misc"]
  },
  // Avatars
  {
    title: "Avatars",
    requiredTags: ["avatar", "avatars"]
  },
  {
    title: "Avatar Miscellaneous",
    requiredTags: ["avatar", "misc"]
  },
  // Other
  {
    title: "Other: Tools, Apps & Utilities",
    requiredTags: ["other", "tau"]
  },
  {
    title: "Other: Miscellaneous",
    requiredTags: ["other", "misc"]
  },
  // Single tag categories
  {
    title: "Art",
    requiredTags: ["art"]
  },
  {
    title: "Education, Science and Data Visualization",
    requiredTags: ["esd"]
  },
  {
    title: "Meme",
    requiredTags: ["meme"]
  },
  {
    title: "Narrative",
    requiredTags: ["narrative"]
  }
]

function matchCategories(tags) {
  var cats = [];
  for(const category of categories) {
    var entered = category.requiredTags.every(tag => tags.includes(tag));

    if (!entered)
      continue;

    cats.push(category);
  }

  return cats;
}

export function addMMC(worldRecord) {
    if (!worldRecord.tags.includes(competitionTag)) {
        if (worldRecord.tags.includes(competitionTag.toUpperCase())) {
            worldRecord.mmc = {
                entered: false,
                error: "Invalid Competition Tag"
            }
        }
        return worldRecord;
    }

    var categories = matchCategories(worldRecord.tags);

    worldRecord.mmc = {
        entered:true,
        categories
    }

    return worldRecord;
}