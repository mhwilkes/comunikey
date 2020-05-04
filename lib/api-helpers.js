/* eslint-disable import/prefer-default-export */

// take only needed user fields to avoid sensitive ones (such as password)
export function extractUser(req) {
    if (!req.user) return null;
    const {
        first_name, last_name, email, bio, profilePicture, emailVerified, contact
    } = req.user;
    return {
        first_name, last_name, email, bio, profilePicture, emailVerified, contact
    };
}
