import React from 'react';

import { CircularProgressbar, CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';

export default ({ success, failures, numberOfItems }) => {

    const getSuccessPercent = () => {
        if (numberOfItems === 0) return 0
        return 100 * (success / numberOfItems)
    }

    const getFailuresPercent = () => {
        if (numberOfItems === 0) return 0
        return 100 * (failures / numberOfItems)
    }

    const getItemProgression = () => {
        return success + failures
    }

    return (
        <CircularProgressbarWithChildren
            value={getSuccessPercent()}
            text={'Studies Done : ' + getItemProgression() + '/' + numberOfItems}
            styles={buildStyles({
                textSize: '8px'
            })}>

            <CircularProgressbar
                value={getFailuresPercent()}
                styles={buildStyles({
                    pathColor: "#f00",
                    trailColor: "transparent"
                })}
            />
        </CircularProgressbarWithChildren>
    )
}