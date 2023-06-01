export const signIn = (adminPassword) => {
    if (adminPassword == "password") {
        return true;
    } else {
        return false;
    }
}

export const stringToSlug = (str) => {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes
}