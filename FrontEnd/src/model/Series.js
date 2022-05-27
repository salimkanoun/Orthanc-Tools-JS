export default class Series {

    BodyPartExamined = ''
    ImageOrientation = ''
    Manufacturer = ''
    Modality = ''
    SeriesDate = ''
    SeriesDescription = ''
    SeriesInstanceUID = ''
    SeriesNumber = ''
    SeriesOrthancID = ''
    SeriesTime = ''
    InstancesOrthancIds = []

    fillFromOrthanc = (orthancId, mainDicomTags, instancesOrthancIds) => {
        this.BodyPartExamined = mainDicomTags.BodyPartExamined
        this.ImageOrientation = mainDicomTags.ImageOrientation
        this.Manufacturer = mainDicomTags.Manufacturer
        this.Modality = mainDicomTags.Modality
        this.SeriesDate = mainDicomTags.SeriesDate
        this.SeriesTime = mainDicomTags.SeriesTime
        this.SeriesDescription = mainDicomTags.SeriesDescription
        this.SeriesInstanceUID = mainDicomTags.SeriesInstanceUID
        this.SeriesNumber = mainDicomTags.SeriesNumber

        this.SeriesOrthancID = orthancId
        this.InstancesOrthancIds = instancesOrthancIds
    }

    getNumberOfInstance = () => {
        return this.InstancesOrthancIds.length
    }

    getBodyPartExamined = () => {
        return this.BodyPartExamined
    }

    setBodyPartExamined = (bodyPartExamined) => {
        this.BodyPartExamined = bodyPartExamined
    }

    getImageOrientation = () => {
        return this.ImageOrientation
    }

    setImageOrientation = (imageOrientation) => {
        this.ImageOrientation = imageOrientation
    }

    getManufacturer = () => {
        return this.Manufacturer
    }

    setManufacturer = (manufacturer) => {
        this.Manufacturer = manufacturer
    }

    getModality = () => {
        return this.Modality
    }

    setModality = (modality) => {
        this.Modality = modality
    }

    getSeriesDate = () => {
        return this.SeriesDate
    }

    setSeriesDate = (seriesDate) => {
        this.SeriesDate = seriesDate
    }

    getSeriesDescription = () => {
        return this.SeriesDescription
    }

    setSeriesDescription = (seriesDescription) => {
        this.SeriesDescription = seriesDescription
    }

    getSeriesInstanceUID = () => {
        return this.SeriesInstanceUID
    }

    setSeriesInstanceUID = (seriesInstanceUID) => {
        this.SeriesInstanceUID = seriesInstanceUID
    }

    getSeriesNumber = () => {
        return this.SeriesNumber
    }

    setSeriesNumber = (seriesNumber) => {
        this.SeriesNumber = seriesNumber
    }

    getSeriesOrthancID = () => {
        return this.SeriesOrthancID
    }

    setSeriesOrthancID = (seriesOrthancID) => {
        this.SeriesOrthancID = seriesOrthancID
    }

    getSeriesTime = () => {
        return this.SeriesTime
    }

    setSeriesTime = (seriesTime) => {
        this.SeriesTime = seriesTime
    }

    serialize = () => {
        return {
            Manufacturer: this.Manufacturer,
            Modality: this.Modality,
            SeriesDate: this.SeriesDate,
            SeriesDescription: this.SeriesDescription,
            SeriesInstanceUID: this.SeriesInstanceUID,
            SeriesNumber: this.SeriesNumber,
            SeriesOrthancID: this.SeriesOrthancID,
            SeriesTime: this.SeriesTime,
            NumberOfInstance: this.getNumberOfInstance()
        }
    }

}