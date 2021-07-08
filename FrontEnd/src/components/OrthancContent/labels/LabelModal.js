import React, {useState} from "react";
import {Modal} from "react-bootstrap";
import Select from "react-select";
import label from "../../../services/label";
import studylabel from "../../../services/studylabel";


const LabelModal = (prop) => {
    const [study, setStudy] = useState(null);
    const [options, setOptions] = useState([]);
    const [labels, setLabels] = useState([]);
    const handleClose = () => setStudy(null);
    const handleChange = (change) => {
        if (!study) return;

        let added = change.filter(label => !labels.includes(label));
        let removed = labels.filter(label => !change.includes(label));

        Promise.all(
            added.map(label =>
                studylabel.createStudyLabel(study.MainDicomTags.StudyInstanceUID, label.value, study.PatientMainDicomTags.PatientID, study.ID, study.ParentPatient)).concat(
                removed.map(label =>
                    studylabel.deleteStudyLabel(study.MainDicomTags.StudyInstanceUID, label.value)
                ))
        ).then(() => {
            setLabels(change)
        });
    };

    if (prop.fwRef) prop.fwRef.open = (study) => {
        label.getAllLabels().then(res => {
            setOptions(res.map(label => ({
                value: label.label_name, label: label.label_name
            })));
        });
        setStudy(study);
        studylabel.getStudyLabels(study.MainDicomTags.StudyInstanceUID).then(studyLabels => {
            setLabels(studyLabels.map(label => ({
                value: label.label_name, label: label.label_name
            })));
        })
    };

    return (<Modal show={study !== null} onHide={handleClose} backdrop={"static"}>
        <Modal.Header closeButton>
            <Modal.Title>Modal title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Select
                closeMenuOnSelect={false}
                isMulti
                options={options}
                onChange={handleChange}
                value={labels}
            />
        </Modal.Body>
    </Modal>)
}

export default LabelModal;