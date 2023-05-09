import React from "react"
import MyRobotTable from "../../AutoQuery/MyRobot/MyRobotTable"
import { useCustomQuery } from "../../../services/ReactQuery/hooks"
import { errorMessage } from "../../../tools/toastify"
import { keys } from "../../../model/Constant"
import Spinner from "../../CommonComponents/Spinner"
import apis from "../../../services/apis"

export default ({ robotId }) => {

    const { data, isLoading } = useCustomQuery(
        [keys.ROBOTS_KEY, robotId],
        () => robotId ? apis.task.getTask(robotId) : null,
        (error) => errorMessage(error?.data?.errorMessage),
        (response) => response?.details?.items.map(item => ({
            //Merge Modalities (study level) to modality column
            Modality: item.ModalitiesInStudy,
            id: item.AnswerNumber + ":" + item.AnswerId,
            ...item
        }))
    )

    if (isLoading) return <Spinner />

    return (
        <MyRobotTable robotId={robotId} rows={data} />
    )
}