const Label = require('../repository/Label')
const { OTJSConflictException } = require('../Exceptions/OTJSErrors')

class Labels {

  /**
   * Create a label
   * @param {String} labelName name of the label
   * @returns 
   */
  static async createLabels(labelName) {
    const labels = await Label.getLabel(labelName)

    if (labels) {
      throw new OTJSConflictException('This labels already exist');
    }

    return Label.create(labelName)
  }

  /**
   * Get all labels
   * @returns 
   */
  static async getAllLabels() {
    return Label.getAllLabel()
  }

  /**
   * Delete a label
   * @param {String} labelName name of the label to delete
   * @returns 
   */
  static async deleteLabels(labelName) {
    return Label.delete(labelName)
  }

  /**
   * Modify a label
   * @param {String} labelName old label name to modify
   * @param {String} newLabelName modified label name
   * @returns 
   */
  static async modifyLabels(labelName, newLabelName) {
    return Label.update(labelName, newLabelName)
  }

}

module.exports = Labels