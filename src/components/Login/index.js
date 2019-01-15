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

const Login = ({ onSubmit }) => {
  return (
    <Form
      schema={loginSchema}
      uiSchema={loginUiSchema}
      onSubmit={e => onSubmit(e.formData)}
    />
  )
}

export default Login
