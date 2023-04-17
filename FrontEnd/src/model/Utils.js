export const filterProperties = (object, keysToKeep) => {
    let newObject = {}
    for (let tag in object) {
        if (keysToKeep.includes(tag)) {
            newObject[tag] = object[tag]
        }
    }
    return newObject;
}