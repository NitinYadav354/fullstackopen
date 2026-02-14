
const Notification = ({ name, isVisible }) => {
    if (name === null) {
      console.log('Notification: name is null, returning null')
      return null
    }

    const notstyle = {
      color: 'green',
      background: 'lightgrey',
      border: '2px solid green',
      padding: '10px',
      borderRadius: '5px',
      display: isVisible ? 'block' : 'none'
    
  }
    return (
      <div className="notification" style={notstyle}>
        added {name}
      </div>
    )
  }

export default Notification
