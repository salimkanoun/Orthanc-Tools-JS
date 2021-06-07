//Common filter for searching by a text on a Column (just removing spaces in our case)
export default function ColumnFilter({
  column: { filterValue, setFilter },
}) {
  return (
    <input
      value={filterValue || ''}
      className='form-control'
      onChange={e => {
        setFilter(e.target.value.replace(' ','') || undefined) // Set undefined to remove the filter entirely
      }}
    />
  )
}