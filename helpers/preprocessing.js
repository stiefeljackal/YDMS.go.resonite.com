import DOMPurify from 'isomorphic-dompurify';

/**
 * Converts the world or session name to its HTML equivalent.
 * 
 * @param {string} name The name of the world or session to sanitize.
 * @returns The processed world or session name that was sanitized.
 */
function preProcessName(name) {
    const start = /<color="?(.+?)"?>/gi;
    const end = /<\/color>/gi
    return name.replace(start, "<span style=\"color: $1;\">").replace(end, "</span>");
}

/**
 * Preprocesses the session information returned from SkyFrost to a format suitable for viewing.
 * 
 * @param {SessionInfo} json The session object from SkyFrost to transform.
 * @returns The transformed session object for viewing.
 */
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

/**
 * Preprocesses the session list and returns an array of the top X sessions to display on the webpage.
 * 
 * @param {SessionsList} json object of the full session API endpoint
 * @param {SessionCount} int number of sessions to return for the page
 * @returns The transformed sessions object for viewing.
 */
function preProcessSessionList(json, count){
    const sessions = json
        .sort((a, b) => b.totalJoinedUsers - a.totalJoinedUsers)
        .slice(0, count);

    json.sessions = sessions.map((session) => {
        // We convert the name here since the JSON format for
        // this is different from the other responses
        session.name = preProcessName(session.name);
        return preProcessSession(session);
    });

    return json;
}

/**
 * Preprocesses the world information return from SkyFrost to a format suitable for viewing.
 * 
 * @param {WorldInfo} json The world object from SkyFrost to transform.
 * @returns The preprocessed world information for viewing.
 */
function preProcessWorld(json) {
    if (json.thumbnailUri) {
        json.thumbnailUri = json.thumbnailUri.replace("resdb:///", "https://assets.resonite.com/").replace(".webp", "");
    } else {
        json.thumbnailUri = "/images/noThumbnail.png";
    }

    return json;
}

/**
 * Preprocesses the world or session information returned from SkyFrost
 * to make it suitable for Web viewing.
 * 
 * @param {BaseWorldSessionInfo} json The world or session object from SkyFrost to transform.
 * @param {('world'|'session')} type The type of information this is whether it is a world or session.
 * @returns The preprocessed world or session object for viewing.
 */
export function preProcess(json, type) {

    if (type != "sessionList"){
        // ensure page title
        json.title = DOMPurify.sanitize(json.name);
        json.name = preProcessName(json.name);
    }

    switch (type) {
        case "session":
        json = preProcessSession(json);
        break;
        case "world":
        json = preProcessWorld(json);
        break;
        case "sessionList":
        json = preProcessSessionList(json, 15);
        break;
    }

    return json;
}
