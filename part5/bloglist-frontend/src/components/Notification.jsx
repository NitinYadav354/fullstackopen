

const Notification = ({ message }) => {
  const notificationStyle = {
    color: 'Black',
    background: 'lightgrey',
    border: '2px solid black',
    padding: '10px',
    marginBottom: '10px'
  }


  if (message === null) {
    return null
  }

  return (
    <div className="notification" style={notificationStyle}>
      {message}
    </div>
  )
}

export default Notification