import React, { useEffect, useState } from 'react';

import { CircularProgressbar, CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';

export default ({ success, failures, numberOfItems }) => {

    const [state, setState] = useState({
        successPercent: 0,
        failuresPercent: 0,
        itemProgression: 0
    })

    useEffect(() => {
        if (numberOfItems !== 0) {
            setState((state) => ({
                ['successPercent']: 100 * success / numberOfItems,
                ['failuresPercent']: 100 * failures / numberOfItems,
                ['itemProgression']: success + failures
            }))
        } else {
            setState((state) => ({
                ['successPercent']: 0,
                ['failuresPercent']: 0,
                ['itemProgression']: 0
            }))
        }
    }, [success, failures, numberOfItems])


    return (
        <CircularProgressbarWithChildren
            value={state.successPercent}
            text={'Studies Done : ' + state.itemProgression + '/' + numberOfItems}
            styles={buildStyles({
                textSize: '8px'
            })}>

            <CircularProgressbar
                value={state.failuresPercent}
                styles={buildStyles({
                    pathColor: "#f00",
                    trailColor: "transparent"
                })}
            />
        </CircularProgressbarWithChildren>
    )
}