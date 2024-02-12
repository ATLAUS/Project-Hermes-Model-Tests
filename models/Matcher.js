const { db, DataTypes } = require('../db/connection')

const Matcher = db.define(
  'Matcher',
  {
    gameName: DataTypes.STRING,
    platform: DataTypes.STRING,
    objective: DataTypes.STRING,
    partySize: DataTypes.INTEGER,
    activeParty: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    note: DataTypes.STRING
  },
  {
    timestamps: true
  }
)

module.exports = {
  Matcher
}
