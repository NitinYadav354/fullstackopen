
const Filter = (props) => {
    return (
        <input value = {props.search} onChange={props.handleSearchChange} />
    )
}

export default Filter