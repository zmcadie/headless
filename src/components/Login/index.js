import React from 'react'
import './style.css'

import Form from "react-jsonschema-form"

const loginSchema = {
  title: "User Login",
  type: "object",
  required: ["username", "password"],
  properties: {
    username: { title: "Username", type: "string" },
    password: { title: "Password", type: "string" }
  }
}

const loginUiSchema = {
  username: { "ui:placeholder": "username" },
  password: { "ui:widget": "password" }
}

const submit = user => {
  fetch(`http://localhost:1268/api/user/login`, {
    method: "POST",
    body: JSON.stringify(user),
    headers:{
      'Content-Type': 'application/json'
    }
  }).then(res => {
    return res.json()
  }).then(res => console.log(res))
}

const Login = () => {
  return (
    <Form
      schema={loginSchema}
      uiSchema={loginUiSchema}
      onSubmit={e => submit(e.formData)}
    />
  )
}

export default Login
