class LabelEntity {
    name
}

LabelEntity.createRolefromDB = (dbEntity) => {
    let label = new LabelEntity()
    label.name = dbEntity.label_name
    return label
}

module.exports = LabelEntity