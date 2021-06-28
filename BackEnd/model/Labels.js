const Label = require('../repository/Label')
const {OTJSConflictException} = require('../Exceptions/OTJSErrors')

class Labels{

  /**
   * Create a label
   * @param {String} label_name name of the label
   * @returns 
   */
  static async createLabels(label_name){
    const labels = await Label.getLabel(label_name)

    if(labels){
      throw new OTJSConflictException('This labels already exist');
    }

    return Label.create(label_name)
  }

  /**
   * Get all labels
   * @returns 
   */
  static async getAllLabels(){
    return Label.getAllLabel()
  } 

  /**
   * Delete a label
   * @param {String} label_name name of the label to delete
   * @returns 
   */
  static async deleteLabels(label_name){
    return Label.delete(label_name)
  }

  /**
   * Modify a label
   * @param {String} label_name old label name to modify
   * @param {String} new_label_name modified label name
   * @returns 
   */
  static async modifyLabels(label_name,new_label_name){
      return Label.update(label_name,new_label_name)
  }

}

module.exports = Labels