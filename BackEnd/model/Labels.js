const Label = require('../repository/Label')
const {OTJSConflictException} = require('../Exceptions/OTJSErrors')

class Labels{

  static async createLabels(label_name){
    const labels = await Label.getLabel(label_name)

    if(labels){
      throw new OTJSConflictException('This labels already exist');
    }

    return Label.create(label_name)
  }

  static async getAllLabels(){
    return Label.getAllLabel()
  } 

  static async deleteLabels(label_name){
    return Label.delete(label_name)
  }

  static async modifyLabels(label_name){
      return Label.update(label_name)
  }

}

module.exports = Labels