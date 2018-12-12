import React from 'react'
import './style.css'

import Form from "react-jsonschema-form"

const signupSchema = {
  title: "User Signup",
  type: "object",
  required: ["username", "password", "passwordConf"],
  properties: {
    username: { title: "Username", type: "string" },
    email: { title: "Email", type: "string" },
    password: { title: "Password", type: "string" },
    passwordConf: { title: "Confirm Password", type: "string" }
  }
}

const signupUiSchema = {
  username: { "ui:placeholder": "username" },
  email: { "ui:placeholder": "email" },
  password: { "ui:widget": "password" },
  passwordConf: { "ui:widget": "password" }
}

const validate = (formData, errors) => {
  if (formData.password !== formData.passwordConf) {
    errors.passwordConf.addError("Passwords don't match")
  }
  return errors
}

const submit = user => {
  const { username, email, password } = user
  fetch(`http://localhost:1268/api/user`, {
    method: "POST",
    body: JSON.stringify({ username, email, password }),
    headers:{
      'Content-Type': 'application/json'
    }
  }).then(res => {
    return res.json()
  }).then(res => console.log(res))
}

const Signup = () => {
  return (
    <Form
      schema={signupSchema}
      uiSchema={signupUiSchema}
      onSubmit={e => submit(e.formData)}
      validate={validate}
    />
  )
}

export default Signup