const User = require('./User');
const Store = require('./Store');
const Rating = require('./Rating');
const OtpToken = require('./OtpToken');


Store.belongsTo(User, { as: 'ownerInfo', foreignKey: 'owner' });
User.hasMany(Store, { foreignKey: 'owner' });

Rating.belongsTo(User, { as: 'userInfo', foreignKey: 'user' });
User.hasMany(Rating, { foreignKey: 'user' });

Rating.belongsTo(Store, { as: 'storeInfo', foreignKey: 'store' });
Store.hasMany(Rating, { foreignKey: 'store' });

module.exports = {
  User,
  Store,
  Rating,
  OtpToken
};
