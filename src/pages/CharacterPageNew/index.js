import React, { Component } from 'react'
import Form from 'react-jsonschema-form'
import styled from 'styled-components'

import './style.css'
const schema = require('./schema.json')

const Checkbox = styled.div`
  background: white;
  border: 1px solid #aaa;
  border-radius: ${p => p.boolType === "radio" ? "14px" : "4px"};
  height: ${p => p.boolType === "radio" ? "14px" : "24px"};
  margin: ${p => p.boolType === "radio" ? "5px 0" : "0"};
  padding: 1px;
  width: ${p => p.boolType === "radio" ? "14px" : "24px"};
  min-width: ${p => p.boolType === "radio" ? "14px" : "24px"};

  &[value=true] {
    background: radial-gradient(#444 40%, white 45%);
  }
`

const BooleanInput = (p) => <Checkbox onClick={() => p.onChange({target: {value: !p.value}})} {...p} />

const ObjectFieldTemplate = ({ TitleField, properties, title, uiSchema }) => {
  const uiTitle = uiSchema["ui:title"]
  return (
    <div className="object-container">
      {title ? <TitleField title={uiTitle === false ? '' : uiTitle ? uiTitle : title} /> : ''}
      {properties.map(prop => prop.content)}
    </div>
  )
}

const CustomFieldTemplate = (p) => {
  return (
    <div className={p.classNames}>
      {p.children}
    </div>
  );
}

const inputTypes = {
  string: (p) => <input type="text" {...p} />,
  boolean: (p) => <BooleanInput {...p} />,
  number: (p) => <input type="number" {...p} />
}

const CustomInput = ({ name, formData, onChange, schema, uiSchema }) => {
  const { type, title } = schema
  const inputTitle = uiSchema
    ? uiSchema["ui:title"] === false
      ? ''
      : uiSchema["ui:title"]
        ? uiSchema["ui:title"]
        : title
          ? title
          : name
    : name
  const Input = inputTypes[type]
  const inline = uiSchema["ui:inline"]
  const change = e => {
    const { value, type } = e.target
    const data = type === "number" ? value === "" ? 0 : parseInt(value, 10) : value
    onChange(data)
  }
  return (
    <div className={`custom-input-field ${name} ${inline ? 'inline' : ''}`}>
      <Input
        className={`character-${name}-input`}
        id={name}
        name={name}
        value={formData ? formData : formData === 0 ? 0 : ""}
        onChange={change}
        data-lpignore={true}
        autoComplete="off"
      />
      <label htmlFor={name}>{inputTitle}</label>
    </div>
  )
}

const AbilitiesContainer = ({ name, formData, schema, uiSchema, onChange }) => {
  const change = (e, key) => {
    const { target: { value, type } } = e
    const data = formData
    data[key] = type === "number" ? parseInt(value, 10) : value
    onChange(data)
  }
  const inputs = Object.keys(formData).map(k => {
    const title = uiSchema && uiSchema[k] && uiSchema[k]["ui:title"]
      ? uiSchema[k]["ui:title"]
      : schema.properties[k].title || k
    const bonus = Math.floor((formData[k] - 10) / 2)
    return (
      <div className={`custom-input-field ${k}`} key={k}>
        <div className="ability-score-display">
          <input
            className={`character-${k}-input ability-score`}
            id={`${name}-${k}`}
            type="number"
            name={`${name}-${k}`}
            value={formData[k]}
            onChange={(e) => change(e, k)}
            data-lpignore={true}
          />
          <div className={`character-${k}-bonus ability-bonus`}>
            {bonus ? `${bonus > 0 ? '+' : ''}${bonus}` : 0}
          </div>
        </div>
        <label htmlFor={`${name}-${k}`}>{title}</label>
      </div>
    )}
  )
  return (
    <div className="character-abilities-container" id={name}>
      {inputs}
    </div>
  )
}

class SaveContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ...props.formData
    }
    this.change = this.change.bind(this)
  }
  change(e, key, field) {
    const { target: { value, type } } = e
    const data = this.props.formData
    data[key][field] = type === "number" ? parseInt(value, 10) : value
    // this.setState(data)
    this.props.onChange(data)
  }
  render() {
    const { name, formData, schema, uiSchema } = this.props
    const inputs = Object.keys(formData).map(k => {
      const title = uiSchema && uiSchema[k] && uiSchema[k]["ui:title"]
        ? uiSchema[k]["ui:title"]
        : schema.properties[k].title
        ? schema.properties[k].title
        : k.length === 3 ? k.toUpperCase() : k
      return (
        <div className={`custom-input-field ${k} inline`} key={k}>
          <BooleanInput
            className={`character-${k}-boolean-input`}
            value={formData[k].proficient}
            onChange={(e) => this.change(e, k, "proficient")}
            boolType="radio"
            data-lpignore={true}
          />
          <input
            className={`character-${k}-bonus-input`}
            id={`${name}-${k}`}
            type="number"
            name={`${name}-${k}`}
            value={formData[k].bonus}
            onChange={(e) => this.change(e, k, "bonus")}
            data-lpignore={true}
          />
          <label htmlFor={`${name}-${k}`}>{title}</label>
        </div>
      )}
    )
    return (
      <div className="character-saves-container" id={name}>
        <legend>{this.props.schema.title}</legend>
        {inputs}
      </div>
    )
  }
}

const uiSchema = {
  classNames: "character-sheet-new",
  stats: {
    "ui:title": false,
    classNames: "stats",
    name: { classNames: "name" },
    class: { classNames: "class" },
    level: { classNames: "level" },
    background: { classNames: "background" },
    player: { classNames: "player" },
    race: { classNames: "race" },
    alignment: { classNames: "alignment" },
    xp: { classNames: "xp" },
    abilities: {
      classNames: "abilities",
      "ui:field": "abilitiesContainer",
    },
    saves: {
      classNames: "saves",
      "ui:field": "saveContainer"
    },
    skills: {
      classNames: "skills",
      "ui:field": "saveContainer",
      acrobatics: { "ui:title": "Acrobatics\xa0\xa0(Dex)" },
      animalHandling: { "ui:title": "Animal Handling\xa0\xa0(Wis)" },
      arcana: { "ui:title": "Arcana\xa0\xa0(Int)" },
      athletics: { "ui:title": "Athletics\xa0\xa0(Str)" },
      deception: { "ui:title": "Deception\xa0\xa0(Cha)" },
      history: { "ui:title": "History\xa0\xa0(Int)" },
      insight: { "ui:title": "Insight\xa0\xa0(Wis)" },
      intimidation: { "ui:title": "Intimidation\xa0\xa0(Cha)" },
      investigation: { "ui:title": "Investigation\xa0\xa0(Int)" },
      medicine: { "ui:title": "Medicine\xa0\xa0(Wis)" },
      nature: { "ui:title": "Nature\xa0\xa0(Int)" },
      perception: { "ui:title": "Perception\xa0\xa0(Wis)" },
      performance: { "ui:title": "Performance\xa0\xa0(Cha)" },
      persuasion: { "ui:title": "Persuasion\xa0\xa0(Cha)" },
      religion: { "ui:title": "Religion\xa0\xa0(Int)" },
      sleightOfHand: { "ui:title": "Sleight of Hand\xa0\xa0(Dex)" },
      stealth: { "ui:title": "Stealth\xa0\xa0(Dex)" },
      survival: { "ui:title": "Survival\xa0\xa0(Wis)" }
    },
    inspiration: {
      classNames: "inspiration",
      "ui:inline": true
    },
    proficiency: {
      classNames: "proficiency",
      "ui:inline": true
    },
    passivePerception: {
      classNames: "passivePerception",
      "ui:inline": true
    },
    initiative: {
      classNames: "initiative",
    },
    ac: {
      classNames: "ac",
    },
    speed: {
      classNames: "speed",
    },
    hp: {
      classNames: "hp",
    },
    hd: {
      classNames: "hd",
    },
    deathSaves: {
      classNames: "deathSaves",
    }
  }
}

const fields = {
  abilitiesContainer: AbilitiesContainer,
  saveContainer: SaveContainer,
  custom: CustomInput,
  StringField: CustomInput,
  NumberField: CustomInput,
  BooleanField: CustomInput
}

export default class NewCharacterPage extends Component {
  constructor() {
    super()
    this.state = {
      character: {
        stats: {
          name: "",
          class: "",
          level: 0,
          background: "",
          player: "",
          race: "",
          alignment: "",
          xp: 0,
          abilities: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
          saves: { str: { proficient: false, bonus: 0 }, dex: { proficient: false, bonus: 0 }, con: { proficient: false, bonus: 0 }, int: { proficient: false, bonus: 0 }, wis: { proficient: false, bonus: 0 }, cha: { proficient: false, bonus: 0 } },
          skills: {
            acrobatics: { proficient: false, bonus: 0 },
            animalHandling: { proficient: false, bonus: 0 },
            arcana: { proficient: false, bonus: 0 },
            athletics: { proficient: false, bonus: 0 },
            deception: { proficient: false, bonus: 0 },
            history: { proficient: false, bonus: 0 },
            insight: { proficient: false, bonus: 0 },
            intimidation: { proficient: false, bonus: 0 },
            investigation: { proficient: false, bonus: 0 },
            medicine: { proficient: false, bonus: 0 },
            nature: { proficient: false, bonus: 0 },
            perception: { proficient: false, bonus: 0 },
            performance: { proficient: false, bonus: 0 },
            persuasion: { proficient: false, bonus: 0 },
            religion: { proficient: false, bonus: 0 },
            sleightOfHand: { proficient: false, bonus: 0 },
            stealth: { proficient: false, bonus: 0 },
            survival: { proficient: false, bonus: 0 }
          },
          inspiration: false,
          proficiency: 0,
          passivePerception: 0,
          initiative: 0,
          ac: 0,
          speed: 0,
          hp: { max: 0, current: 0, temporary: 0 },
          hd: { total: "", used: "" },
          deathSaves: { success: 0, failure: 0 },
          attacks: [],
          equipment: [],
          gold: { cp: 0, sp: 0, gp: 0, pp: 0 },
          treasure: [],
          description: { age: "", height: "", weight: "", eyes: "", skin: "", hair: "" },
          characteristics: { traits: [], ideals: [], bonds: [], flaws: [] },
          proficiencies: [],
          languages: [],
          features: [],
          allies: [],
        }
      }
    }
    this.submit = this.submit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.createCharacter = this.createCharacter.bind(this)
    this.updateCharacter = this.updateCharacter.bind(this)
  }

  componentDidMount() {
    if (this.props.match.params.id !== "new") {
      console.log('get', this.state.character)
    //   fetch(`http://localhost:1268/api/characters/${this.props.match.params.id}`)
    //   .then(res => res.json()).then(res => {
    //     this.setState({character: res})
    //   })
    }
  }

  updateCharacter(character) {
    console.log('put', this.state.character)
    // fetch(`http://localhost:1268/api/characters/${this.props.match.params.id}`, {
    //   method: "PUT",
    //   body: JSON.stringify({character}),
    //   headers:{
    //     'Content-Type': 'application/json'
    //   }
    // }).then(res => res.json()).then(res => {
    //   this.setState({character: res})
    // })
  }

  createCharacter(character) {
    console.log('post', this.state.character)
    // fetch(`http://localhost:1268/api/characters`, {
    //   method: "POST",
    //   body: JSON.stringify(character),
    //   headers:{
    //     'Content-Type': 'application/json'
    //   }
    // }).then(res => res.json()).then(res => this.props.history.push(`./${res._id}`))
  }

  submit() {
    const { character } = this.state
    const { match: { params: { id } } } = this.props
    id === "new"
      ? this.createCharacter(character)
      : this.updateCharacter(character)
  }

  onChange(editor) {
    const { formData: character } = editor
    this.setState({ character })
  }

  render() {
    return (
      <div id="character-page">
        <Form
          schema={schema}
          uiSchema={uiSchema}
          formData={this.state.character}
          onChange={this.onChange}
          onSubmit={this.submit}
          fields={fields}
          FieldTemplate={CustomFieldTemplate}
          ObjectFieldTemplate={ObjectFieldTemplate}
          showErrorList={false}
        >
          <button type="submit" id="character-save">SAVE</button>
        </Form>
      </div>
    )
  }
}