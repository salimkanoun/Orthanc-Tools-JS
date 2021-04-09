const label = require('../repository/Label')
const {OTJSConflictException} = require('../Exceptions/OTJSErrors')

class Labels{

  static async createLabels(label_name){
    const labels = await label.findOne(label_name)

    if(labels){
      throw new OTJSConflictException('This labels already exist');
    }

    return label.create(label_name)
  }

  static async getAllLabels(){
    return label.findAll()
  } 

  static async deleteLabels(label_name){
    return label.destroy(label_name)
  }

  static async modifyLabels(label_name,payload){
      return label.update(label_name,payload)
  }

}

module.exports = Labels