const search = (props) => {
    return (
        <div className="search">
            <input type="text" value={props.search} placeholder="Search for a country..." onChange={props.handleSearch} />
        </div>
    )
}

export default search