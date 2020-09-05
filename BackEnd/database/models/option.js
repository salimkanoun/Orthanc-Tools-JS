'use strict'
module.exports = (sequelize, DataTypes) => {
  const Option = sequelize.define('Option', {
    hour: DataTypes.INTEGER,
    min: DataTypes.INTEGER,
    ldap: DataTypes.BOOLEAN,
    date_format:DataTypes.STRING,
    burner_label_path:DataTypes.STRING,
    burner_monitoring_level:DataTypes.STRING,
    burner_manifacturer:DataTypes.STRING,
    burner_monitored_path:DataTypes.STRING,
    burner_delete_study_after_sent:DataTypes.BOOLEAN,
    burner_viewer_path:DataTypes.STRING,
    burner_support_type:DataTypes.STRING,
    burner_transfer_syntax : DataTypes.STRING
  }, {})
  Option.associate = function (models) {
    // associations can be defined here
  }
  return Option
}
