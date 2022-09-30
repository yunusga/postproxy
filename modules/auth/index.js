/**
 * Return default login and password or from CLI argements
 * @param {string} params <login>@<password>
 * @returns {array} [0] login [1] password
 */
module.exports = (params, login = 'postproxy') => (typeof params !== 'string' ? [login, false] : params.split('@'));
