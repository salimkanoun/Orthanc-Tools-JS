const inFilterArray = (row, columnId, values) => {
    return values.length > 0 ? values.includes(row.getValue(columnId)) : true
}

export { inFilterArray }