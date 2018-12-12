import React from 'react'
import './style.css'

const handleLogout = user => {
  fetch(`http://localhost:1268/api/user/logout`).then(res => console.log(res.ok))
}

const Logout = () => {
  return (
    <button type="button" onClick={handleLogout}>Logout</button>
  )
}

export default Logout
