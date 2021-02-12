'use strict'
module.exports = (sequelize, DataTypes) => {
  const Option = sequelize.define('Option', {
    hour_start: DataTypes.INTEGER,
    min_start: DataTypes.INTEGER,
    hour_stop: DataTypes.INTEGER,
    min_stop: DataTypes.INTEGER,
    ldap: DataTypes.BOOLEAN,
    burner_date_format:DataTypes.STRING,
    burner_label_path:DataTypes.STRING,
    burner_monitoring_level:DataTypes.STRING,
    burner_manifacturer:DataTypes.STRING,
    burner_monitored_path:DataTypes.STRING,
    burner_delete_study_after_sent:DataTypes.BOOLEAN,
    burner_viewer_path:DataTypes.STRING,
    burner_support_type:DataTypes.STRING,
    burner_transfer_syntax : DataTypes.STRING,
    monitoring_rate: DataTypes.INTEGER,
    burner_started : DataTypes.BOOLEAN
  }, {})
  Option.associate = function (models) {
    // associations can be defined here
  }
  return Option
}
