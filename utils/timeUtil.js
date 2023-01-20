const SECOND_MILLIS = 1000;
const  MINUTE_MILLIS = 60 * SECOND_MILLIS;
const HOUR_MILLIS = 60 * MINUTE_MILLIS;
const  DAY_MILLIS = 24 * HOUR_MILLIS;


function getTimeAgo(time) {
    if (time < 1000000000000) {
        // if timestamp given in seconds, convert to millis
        time *= 1000;
    }

    const now = Date.now();
    if (time > now || time <= 0) {
        return null;
    }

    // TODO: localize
    const diff = now - time;
    if (diff < MINUTE_MILLIS) {
        return "Just finished";
    } else if (diff < 2 * MINUTE_MILLIS) {
        return "a minute ago";
    } else if (diff <= 60 * MINUTE_MILLIS) {
        return Math.floor(diff / MINUTE_MILLIS) + " minutes ago";
    } else if (diff <= 120 * MINUTE_MILLIS) {
        return "an hour ago";
    } else if (diff <= 24 * HOUR_MILLIS) {
        return Math.floor(diff / HOUR_MILLIS) + " hours ago";
    } else if (diff < 48 * HOUR_MILLIS) {
        return "yesterday";
    } else {
        return Math.floor(diff / DAY_MILLIS) + " days ago";
    }
}

export {
    getTimeAgo
}