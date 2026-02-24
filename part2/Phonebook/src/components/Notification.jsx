
const Notification = ({ notification }) => {
  if (!notification) {
    return null
  }

  const baseStyle = {
    background: 'lightgrey',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '10px'
  }

  const successStyle = {
    color: 'green',
    border: '2px solid green'
  }

  const errorStyle = {
    color: 'red',
    border: '2px solid red'
  }

  const style = {
    ...baseStyle,
    ...(notification.type === 'error' ? errorStyle : successStyle)
  }

  return (
    <div className="notification" style={style}>
      {notification.message}
    </div>
  )
}

export default Notification
