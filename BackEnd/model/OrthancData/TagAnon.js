class TagAnon {
  constructor (tag, choice, newValue = '') {
    this.tagNumber = tag
    this.choice = choice
    this.newValue = newValue
  }
}

TagAnon.keep = 'Keep'
TagAnon.replace = 'Replace'
TagAnon.remove = 'Remove'

module.exports = TagAnon
