import React from "react"

import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';

export default ({ tags }) => {

    const renderTree = (array) => {
        let rows = []
        if (Array.isArray(array)) {
            array.forEach(nodes => {
                rows.push(
                    <TreeItem key={nodes.name} nodeId={nodes.name} label={nodes.dicomTag + " "+ nodes.name}>
                        {Array.isArray(nodes.value) ? nodes.value.map((node) => renderTree(node)) :  nodes.value}
                    </TreeItem>
                )
            })

        }
        return rows
    }

    return (
        <TreeView
            defaultExpanded={['root']}
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}>
            {renderTree(tags)}
        </TreeView>
    )
}