import React, { useMemo, useState } from "react";
import { Button, Dropdown } from "react-bootstrap";
import { useDispatch } from "react-redux";

import CommonTableV8 from "../../CommonComponents/RessourcesDisplay/ReactTableV8/CommonTableV8";
import OhifLink from "../../Viewers/OhifLink";
import StoneLink from "../../Viewers/StoneLink";

import { ReactComponent as CheckedSVG } from "../../../assets/images/check-circle.svg";
import { ReactComponent as XSVG } from "../../../assets/images/x-circle.svg";
import { ReactComponent as PendingSVG } from "../../../assets/images/pending.svg";
import { ReactComponent as RepeatSVG } from "../../../assets/images/arrow-repeat.svg";
import { ITEM_SUCCESS } from "./MyRobotRoot";
import ExportDeleteSendButton from "../../CommonComponents/RessourcesDisplay/ExportDeleteSendButton";
import apis from "../../../services/apis";
import Study from "../../../model/Study";
import { addSeriesToExportList, addStudiesToExportList } from "../../../actions/ExportList";
import { addStudiesToDeleteList } from "../../../actions/DeleteList";
import { addStudiesToAnonList } from "../../../actions/AnonList";

export default ({ rows = [], onRetryItem, onDeleteItem }) => {
  const dispatch = useDispatch();

  const [selectedRowIds, setSelectedRowIds] = useState([]);

  const columns = [
    {
      accessorKey: "id",
      enableHiding: true,
    },
    {
      accessorKey: "Level",
      header: "Level",
    },
    {
      accessorKey: "PatientName",
      header: "Patient Name",
    },
    {
      accessorKey: "PatientID",
      header: "Patient ID",
    },
    {
      accessorKey: "AccessionNumber",
      header: "Accession Number",
    },
    {
      accessorKey: "StudyDate",
      header: "Study Date",
    },
    {
      accessorKey: "StudyDescription",
      header: "Study Description",
    },
    {
      accessorKey: "ModalitiesInStudy",
      header: "Modalities",
    },
    {
      accessorKey: "OriginAET",
      header: "AET",
    },
    {
      accessorKey: "Validated",
      header: "Validated",
      cell: ({ getValue }) => {
        let value = getValue();
        if (value == null)
          return (
            <div className="text-center">
              <PendingSVG />
            </div>
          );
        return value === true ? (
          <div className="text-center">
            <CheckedSVG />
          </div>
        ) : (
          <div className="text-center">
            <XSVG />
          </div>
        );
      },
    },
    {
      accessorKey: "Status",
      header: "Status",
    },
    {
      accessorKey: "Actions",
      header: "Actions",
      cell: ({ row }) => {
        const status = row.original.Status;
        return (
          <>
            <Button
              disabled={status !== "failed"}
              onClick={() => onRetryItem(row.original.id)}
            >
              <RepeatSVG />
            </Button>
            <Button
              className="otjs-button otjs-button-red"
              disabled={status !== "waiting"}
              onClick={() => onDeleteItem(row.original.id)}
            >
              Remove
            </Button>
          </>
        );
      },
    },
    {
      accessorKey: "Viewers",
      header: "Viewers",
      cell: ({ row }) => {
        return row.original.Status === ITEM_SUCCESS ? (
          <>
            <Dropdown drop="left">
              <Dropdown.Toggle
                variant="button-dropdown-green"
                id="dropdown-basic"
                className="button-dropdown button-dropdown-green"
              >
                Viewers
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <OhifLink
                  className="dropdown-item bg-green"
                  StudyInstanceUID={row.original.StudyInstanceUID}
                />
                <StoneLink
                  className="dropdown-item bg-green"
                  StudyInstanceUID={row.original.StudyInstanceUID}
                />
              </Dropdown.Menu>
            </Dropdown>
          </>
        ) : null;
      },
    },
    {
      accessorKey: "RetrievedOrthancId",
      enableHiding: true,
    },
  ];

  const sendToAnon = async () => {
    let studyArray = await getSelectedItemsStudiesDetails();
    dispatch(addStudiesToAnonList(studyArray));
  };

  const sendToExport = async () => {
    let studyArray = await getSelectedItemsStudiesDetails();
    dispatch(addStudiesToExportList(studyArray));
  };

  const sendToDelete = async () => {
    let studyArray = await getSelectedItemsStudiesDetails();
    dispatch(addStudiesToDeleteList(studyArray));
  };

  const getSelectedItemsStudiesDetails = async () => {
    let studyDataRetrieved = [];
    //Loop each item to retrieve study level
    for (let orthancId of selectedRowIds) {
      await apis.content
        .getStudiesDetails(orthancId)
        .then((studyDetails) => {
          let study = new Study();
          study.fillFromOrthanc(
            studyDetails.ID,
            studyDetails.MainDicomTags,
            studyDetails.Series
          );
          study.fillParentPatient(
            studyDetails.ParentPatient,
            studyDetails.PatientMainDicomTags
          );
          studyDataRetrieved.push(study.serialize());
        })
        .catch((error) => {
          console.error(error);
        });
    }

    return studyDataRetrieved;
  };

  const onSelectRowHandler = (rowIds) => {
    let selectedRows = rows.filter((row) => rowIds.includes(row.id));
    let retrievedOrthancIds = [];
    for (const row of selectedRows) {
      if (row?.RetrievedOrthancId && row.Level === "study") {
        retrievedOrthancIds.push(row.RetrievedOrthancId);
      }
    }
    setSelectedRowIds(retrievedOrthancIds);
  };

  const selectedRowKey = useMemo(() => {
    let selectedRows = rows.filter((row) =>
      selectedRowIds.includes(row.RetrievedOrthancId)
    );
    return selectedRows.map((selectedRow) => selectedRow.id);
  }, [selectedRowIds.length]);


  return (
    <>
      <CommonTableV8
        id={"id"}
        canSelect
        canSort
        selectedRowsIds={selectedRowKey}
        columns={columns}
        data={rows}
        onSelectRow={onSelectRowHandler}
        paginated
      />
      <div>
        <ExportDeleteSendButton
          onAnonClick={sendToAnon}
          onExportClick={sendToExport}
          onDeleteClick={sendToDelete}
        />
      </div>
    </>
  );
};
