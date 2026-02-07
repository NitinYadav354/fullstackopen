const ShowPerson = (props) => {
    return (
        <ul>
        {props.persons.filter(person => person.name.toLowerCase().includes(props.search.toLowerCase())).map((person, index) => (
          <li key={index}>{person.name} {person.number}</li>
        ))}
      </ul>
    )
}

export default ShowPerson