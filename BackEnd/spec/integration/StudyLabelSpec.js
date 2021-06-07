const StudyLabel = require('../../repository/StudyLabel')
const Label = require('../../repository/Label')
const {OTJSDBEntityNotFoundException} = require('../../Exceptions/OTJSErrors')

describe('Testing the study label table', function () {

//To run the test : npm test spec/integration/StudyLabelSpec.js
    beforeEach(async function () {
        var l = await Label.getLabel('test_study_label')
        const study_instance_uid = 'ABCDEFG'
        if (l == null) {
            l = await Label.create('test_study_label')
        }
        var sl = await StudyLabel.getStudyLabel(study_instance_uid, l.label_name)
        if (sl == null) {
            await StudyLabel.create(study_instance_uid, l.label_name,'a','a','a')
        }
    })

    afterEach(async function () {
        var l = await Label.getLabel('test_study_label')
        const study_instance_uid = 'ABCDEFG'
        var sl = await StudyLabel.getStudyLabel(study_instance_uid, l.label_name)
        if ((!(l == null)) && (!(sl == null))) {
            await StudyLabel.delete(study_instance_uid, l.label_name)
        }
        if (!(l == null)) {
            await Label.delete('test_study_label')
        }
    })


    describe('Testing StudyLabel Table', () => {
        it('should create and get a StudyLabel', async () => {
            const study_instance_uid = 'ABCDEFG'
            let schedule = await StudyLabel.getStudyLabel(study_instance_uid, 'test_study_label')
            expect(schedule).not.toBeNull()
            expect(schedule.study_instance_uid).toBe('ABCDEFG')
            expect(schedule.label_name).toBe('test_study_label')
            expect(schedule.patient_id).toBe('a')
            expect(schedule.patient_orthanc_id).toBe('a')
            expect(schedule.study_orthanc_id).toBe('a')
        })

        it('should not get a StudyLabel', async () => {
            let schedule = await StudyLabel.getStudyLabel('undefined study instance uid', 'undefined label test')
            expect(schedule).toBeNull()
        })

        it('should delete a StudyLabel', async () => {
            await StudyLabel.delete('ABCDEFG', 'test_study_label')
            let schedule = await StudyLabel.getStudyLabel('ABCDEFG', 'test_study_label')

            expect(schedule).toBeNull()
        })

        it('should throw an error when deleting', async () => {
            try {
                await StudyLabel.delete('unknown', 'test_study_label unknown')
            } catch (e) {
                expect(e).toBeInstanceOf(OTJSDBEntityNotFoundException)
            }
        })
    })

});