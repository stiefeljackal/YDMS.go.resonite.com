function preProcessName(name) {
    const start = /<color="?(.+?)"?>/gi;
    const end = /<\/color>/gi
    return name.replace(start, "<span style=\"color: $1;\">").replace(end, "</span>");
}

function preProcessSession(json) {
    if (!json.thumbnailUrl || json.thumbnailUrl === "")
    {
        json.thumbnailUrl = "/images/noThumbnail.png";
    }

    json.description = `Host: ${json.hostUsername}.\n` +
        `Users ${json.totalJoinedUsers}/${json.maxUsers}:${json.sessionUsers.map(user => user.username).join(", ")}.\n`+
        `Version: ${json.appVersion}`;

    return json;
}

function preProcessWorld(json) {
    if (json.thumbnailUri) {
        json.thumbnailUri = json.thumbnailUri.replace("resdb:///", "https://assets.resonite.com/").replace(".webp", "");
    } else {
        json.thumbnailUri = "/images/noThumbnail.png";
    }

    return json;
}

function preProcess(json, type) {

    // ensure page title
    json.title = DOMPurify.sanitize(json.name);
    json.name = preProcessName(json.name);

    switch (type) {
        case "session":
        json = preProcessSession(json);
        break;
        case "world":
        json = preProcessWorld(json);
        break;
    }

    return json;
}

module.exports.preProcess = preProcess;