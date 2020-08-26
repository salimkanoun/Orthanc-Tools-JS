'use strict'
module.exports = (sequelize, DataTypes) => {
  const Option = sequelize.define('Option', {
    hour: DataTypes.INTEGER,
    min: DataTypes.INTEGER,
    ldap: DataTypes.BOOLEAN,
    date_format:DataTypes.STRING,
    burner_label_file:DataTypes.STRING,
    burner_monitoring_level:DataTypes.STRING,
    burner_burner_manifacturer:DataTypes.STRING,
    burner_monitored_folder:DataTypes.STRING,
    burner_delete_study_after_sent:DataTypes.BOOLEAN,
    burner_viewer_path:DataTypes.STRING,

  }, {})
  Option.associate = function (models) {
    // associations can be defined here
  }
  return Option
}
