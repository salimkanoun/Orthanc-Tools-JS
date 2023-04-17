export default class Series {

    BodyPartExamined = null
    ImageOrientation = null
    Manufacturer = null
    Modality = null
    SeriesDate = null
    SeriesDescription = null
    SeriesInstanceUID = null
    SeriesNumber = null
    SeriesOrthancID = null
    SeriesTime = null
    InstancesOrthancIds = []
    StudyOrthancID = null

    fillFromOrthanc = (orthancId, mainDicomTags, instancesOrthancIds, studyOrthancID) => {
        this.BodyPartExamined = mainDicomTags?.BodyPartExamined ?? null
        this.ImageOrientation = mainDicomTags?.ImageOrientation ?? null
        this.Manufacturer = mainDicomTags?.Manufacturer ?? null
        this.Modality = mainDicomTags?.Modality ?? null
        this.SeriesDate = mainDicomTags?.SeriesDate ?? null
        this.SeriesTime = mainDicomTags?.SeriesTime ?? null
        this.SeriesDescription = mainDicomTags?.SeriesDescription ?? null
        this.SeriesInstanceUID = mainDicomTags?.SeriesInstanceUID ?? null
        this.SeriesNumber = mainDicomTags?.SeriesNumber ?? null

        this.SeriesOrthancID = orthancId
        this.InstancesOrthancIds = instancesOrthancIds
        this.StudyOrthancID = studyOrthancID
    }

    getNumberOfInstances = () => {
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
            StudyOrthancID: this.StudyOrthancID,
            NumberOfInstances: this.getNumberOfInstances()
        }
    }

}