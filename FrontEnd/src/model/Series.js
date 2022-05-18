export default class Series {

    bodyPartExamined = ''
    imageOrientation = ''
    manufacturer = ''
    modality = ''
    seriesDate = ''
    seriesDescription = ''
    seriesInstanceUID = ''
    seriesNumber = ''
    seriesOrthancID = ''
    seriesTime = ''
    instancesOrthancIds = []

    fillFromOrthanc = (orthancId, mainDicomTags, instancesOrthancIds) => {
        console.log(mainDicomTags)
        this.bodyPartExamined = mainDicomTags.BodyPartExamined
        this.imageOrientation = mainDicomTags.ImageOrientation
        this.manufacturer = mainDicomTags.Manufacturer
        this.modality = mainDicomTags.Modality
        this.seriesDate = mainDicomTags.SeriesDate
        this.seriesTime = mainDicomTags.SeriesTime
        this.seriesDescription = mainDicomTags.SeriesDescription
        this.seriesInstanceUID = mainDicomTags.SeriesInstanceUID
        this.seriesNumber = mainDicomTags.SeriesNumber

        this.seriesOrthancID = orthancId
        this.instancesOrthancIds = instancesOrthancIds
    }

    getNumberOfInstance = () => {
        return this.instancesOrthancIds.length
    }

    getBodyPartExamined = () => {
        return this.bodyPartExamined
    }

    setBodyPartExamined = (bodyPartExamined) => {
        this.bodyPartExamined = bodyPartExamined
    }

    getImageOrientation = () => {
        return this.imageOrientation
    }

    setImageOrientation = (imageOrientation) => {
        this.imageOrientation = imageOrientation
    }

    getManufacturer = () => {
        return this.manufacturer
    }

    setManufacturer = (manufacturer) => {
        this.manufacturer = manufacturer
    }

    getModality = () => {
        return this.modality
    }

    setModality = (modality) => {
        this.modality = modality
    }

    getSeriesDate = () => {
        return this.seriesDate
    }

    setSeriesDate = (seriesDate) => {
        this.seriesDate = seriesDate
    }

    getSeriesDescription = () => {
        return this.seriesDescription
    }

    setSeriesDescription = (seriesDescription) => {
        this.seriesDescription = seriesDescription
    }

    getSeriesInstanceUID = () => {
        return this.seriesInstanceUID
    }

    setSeriesInstanceUID = (seriesInstanceUID) => {
        this.seriesInstanceUID = seriesInstanceUID
    }

    getSeriesNumber = () => {
        return this.seriesNumber
    }

    setSeriesNumber = (seriesNumber) => {
        this.seriesNumber = seriesNumber
    }

    getSeriesOrthancID = () => {
        return this.seriesOrthancID
    }

    setSeriesOrthancID = (seriesOrthancID) => {
        this.seriesOrthancID = seriesOrthancID
    }

    getSeriesTime = () => {
        return this.seriesTime
    }

    setSeriesTime = (seriesTime) => {
        this.seriesTime = seriesTime
    }

    serialize = () => {
        return {
            Manufacturer: this.manufacturer,
            Modality: this.modality,
            SeriesDate: this.seriesDate,
            SeriesDescription: this.seriesDescription,
            SeriesInstanceUID: this.seriesInstanceUID,
            SeriesNumber: this.seriesNumber,
            SeriesOrthancID: this.seriesOrthancID,
            SeriesTime: this.seriesTime,
            NumberOfInstance: this.getNumberOfInstance()
        }
    }

}