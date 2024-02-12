const { db, DataTypes } = require('../db/connection')

const Party = db.define(
  'Party',
  {
    gameName: DataTypes.STRING,
    status: {
      type: DataTypes.STRING,
      defaultValue: 'Open'
    }
  },
  {
    timestamps: true
  }
)

module.exports = {
  Party
}
