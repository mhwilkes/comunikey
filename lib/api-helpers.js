/* eslint-disable import/prefer-default-export */

// take only needed user fields to avoid sensitive ones (such as password)
export function extractUser(req) {
    if (!req.user) return null;
    const {
        _id, first_name, last_name, email, bio, profilePicture, emailVerified, contact
    } = req.user;
    return {
        _id, first_name, last_name, email, bio, profilePicture, emailVerified, contact
    };
}
