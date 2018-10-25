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

const inputTypes = {
  string: (p) => <input type="text" {...p} />,
  boolean: (p) => <BooleanInput {...p} />,
  number: (p) => <input type="number" {...p} />
}

const ObjectFieldTemplate = ({ TitleField, properties, title, uiSchema }) => {
  const uiTitle = uiSchema["ui:title"]
  return (
    <div className="object-container">
      {title ? <TitleField title={uiTitle === false ? '' : uiTitle ? uiTitle : title} /> : ''}
      {properties.map(prop => prop.content)}
    </div>
  )
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
        autoComplete="nope"
      />
      <label htmlFor={name}>{inputTitle}</label>
    </div>
  )
}

class BaseContainer extends Component {
  constructor(props) {
    super(props)
    this.change = this.change.bind(this)
  }
  change(e, key, f) {
    const { target: { value, type } } = e
    const res = type === "number" ? parseInt(value, 10) : value
    const data = this.props.formData
    key === "name" ? data[key] = res : data[key][f] = res
    this.setState(data)
    this.props.onChange(data)
  }
  render() {
    const { name, formData, schema, uiSchema } = this.props
    const nameTitle = uiSchema && uiSchema.name && uiSchema.name["ui:title"]
      ? uiSchema.name["ui:title"]
      : schema.properties.name.title || "name"
    const detailsInput = Object.keys(schema.properties.details.properties).map(k => {
      return (
        <div className={`custom-input-field details-${k}`} key={`details-${k}`}>
          <input
            className={`character-details-${k}-input`}
            id={`details-${k}`}
            type={schema.properties.details.properties[k].type}
            name={`${name}-${k}`}
            value={formData.details[k]}
            onChange={e => this.change(e, "details", k)}
            data-lpignore={true}
          />
          <label htmlFor={`details-${k}`}>{schema.properties.details.properties[k].title || k}</label>
        </div>
      )
    })
    return (
      <div className="character-base-container" id={name}>
        <div className="custom-input-field name" key="name">
          <input
            className="character-name-input"
            id="base-name"
            type={schema.properties.name.type}
            name="base-name"
            value={formData.name}
            onChange={(e) => this.change(e, "name")}
            autoComplete="off"
            data-lpignore={true}
          />
          <label htmlFor="base-name">{nameTitle}</label>
        </div>
        <div className="character-details-container">
          {detailsInput}
        </div>
      </div>
    )
  }
}

class StatContainer extends Component {
  constructor(props) {
    super(props)
    this.change = this.change.bind(this)
  }
  change(f, key) {
    const data = this.props.formData
    data[key] = f
    this.setState(data)
    this.props.onChange(data)
  }
  render() {
    const { name, formData, schema, uiSchema } = this.props
    const inputs = Object.keys(formData).map(k => {
      return schema.properties[k].type === "object"
      ? ''
      : (
        <CustomInput
          key={k}
          name={k}
          formData={formData[k]}
          onChange={f => this.change(f, k)}
          schema={schema.properties[k]}
          uiSchema={uiSchema[k] || {}}
        />
      )
    })
    return (
      <div className="character-stat-container" id={name}>
        <AbilityContainer
          onChange={f => this.change(f, "abilities")}
          name="abilities"
          formData={formData.abilities}
          schema={schema.properties.abilities}
          uiSchema={uiSchema.abilities}
        />
        <SaveContainer
          onChange={f => this.change(f, "saves")}
          name="saves"
          formData={formData.saves}
          schema={schema.properties.saves}
          uiSchema={uiSchema.saves}
        />
        <SaveContainer
          onChange={f => this.change(f, "skills")}
          name="skills"
          formData={formData.skills}
          schema={schema.properties.skills}
          uiSchema={uiSchema.skills}
        />
        {inputs}
      </div>
    )
  }
}

const AbilityContainer = ({ name, formData, schema, uiSchema, onChange }) => {
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

class CombatContainer extends Component {
  constructor(props) {
    super(props)
    this.change = this.change.bind(this)
  }
  change(f, key) {
    const data = this.props.formData
    data[key] = f
    this.setState(data)
    this.props.onChange(data)
  }
  render() {
    const { name, formData, schema, uiSchema, registry } = this.props
    const inputs = Object.keys(formData).map(k => {
      return schema.properties[k].type === "object" || schema.properties[k].type === "array"
      ? ''
      : (
        <CustomInput
          key={k}
          name={k}
          formData={formData[k]}
          onChange={f => this.change(f, k)}
          schema={schema.properties[k]}
          uiSchema={uiSchema[k] || {}}
        />
      )
    })
    return (
      <div className="character-combat-container" id={name}>
        {inputs}
        <HealthContainer
          name="health"
          onChange={f => this.change(f, "health")}
          formData={formData.health}
          schema={schema.properties.health}
        />
        <AttacksContainer
          name="attacks"
          onChange={f => this.change(f, "attacks")}
          formData={formData.attacks || []}
          schema={schema.properties.attacks}
          def={registry.definitions.attack}
        />
      </div>
    )
  }
}

class HealthContainer extends Component {
  constructor(props) {
    super(props)
    this.change = this.change.bind(this)
  }
  change(e, key, field) {
    const { target: { value, type } } = e
    const data = this.props.formData
    data[key][field] = type === "number" ? parseInt(value, 10) : value
    this.setState(data)
    this.props.onChange(data)
  }
  render() {
    const { name, formData, schema } = this.props
    const hpInputs = Object.keys(formData.hp).map(k => {
      const title = k
      return (
        <div className={`custom-input-field hp-${k}`} key={k}>
          <input
            className={`character-hp-${k}-input`}
            id={`hp-${k}`}
            type="number"
            name={`hp-${k}`}
            value={formData.hp[k]}
            onChange={(e) => this.change(e, "hp", k)}
            data-lpignore={true}
            min={0}
            max={k === "current" ? formData.hp.max : 999}
          />
          <label htmlFor={`hp-${k}`}>{title}</label>
        </div>
      )
    })
    const hdInputs = Object.keys(formData.hd).map(k => {
      const title = k
      return (
        <div className={`custom-input-field hd-${k}`} key={k}>
          <input
            className={`character-hd-${k}-input`}
            id={`hd-${k}`}
            type={schema.properties.hd.properties[k].type}
            name={`hd-${k}`}
            value={formData.hd[k]}
            onChange={(e) => this.change(e, "hd", k)}
            data-lpignore={true}
            min={0}
            max={k === "used" ? formData.hd.total : 99}
          />
          <label htmlFor={`hd-${k}`}>{title}</label>
        </div>
      )
    })
    const deathSaveInputs = Object.keys(formData.deathSaves).map(k => {
      const title = k
      const num = formData.deathSaves[k] || 0
      const boolChange = (e) => {
        const res = e
        res.target.value = res.target.value
          ? num + 1
          : num - 1
        this.change(res, "deathSaves", k)
      }
      return (
        <div className={`custom-input-field hd-${k}`} key={k}>
          <BooleanInput boolType="radio" value={1 <= num} onChange={boolChange} />
          <BooleanInput boolType="radio" value={2 <= num} onChange={boolChange} />
          <BooleanInput boolType="radio" value={3 <= num} onChange={boolChange} />
          <label htmlFor={`hd-${k}`}>{title}</label>
        </div>
      )
    })
    return (
      <div className="character-health-container" id={name}>
        <div className="character-hp">
          <legend>Hit Points</legend>
          {hpInputs}
        </div>
        <div className="character-hd">
          <legend>HD</legend>
          {hdInputs}
        </div>
        <div className="character-death-saves">
          <legend>Death Saves</legend>
          {deathSaveInputs}
        </div>
      </div>
    )
  }
}

class AttacksContainer extends Component {
  constructor(props) {
    super(props)
    this.change = this.change.bind(this)
  }
  change(v, i, k) {
    const data = this.props.formData
    data[i][k] = v
    this.setState({attacks: data})
    this.props.onChange(data)
  }
  render() {
    const { name, def, formData } = this.props
    const data = formData
    const num = data.length
    if (data.length < 6) for (let i = 0; i < 6 - num; i++) { data.push({name: "", bonus: "", damage: "", damageType: ""}) }
    const attacks = data.map((atk, i) => {
      const inputs = Object.keys(atk).map(k => {
        return k === "_id" ? '' : (
          <CustomInput
            key={`attack-${i}-${k}`}
            name={`attack-${i}-${k}`}
            formData={atk[k]}
            onChange={v => this.change(v, i, k)}
            schema={def.properties[k]}
            uiSchema={{}}
          />
       )
      })
      return <div className="attack-container" key={`attack-${i}`}>{inputs}</div>
    })
    return (
      <div className="character-attacks-container" id={name}>
        <legend>Attacks</legend>
        {attacks}
      </div>
    )
  }
}

class GearContainer extends Component {
  constructor(props) {
    super(props)
    this.change = this.change.bind(this)
  }
  change(f, key) {
    const data = this.props.formData
    data[key] = f
    this.setState(data)
    this.props.onChange(data)
  }
  render() {
    const { name, formData, schema } = this.props
    return (
      <div className="character-gear-container" id={name}>
        <ItemsContainer
          name="equipment"
          formData={formData.equipment}
          schema={schema.properties.equipment}
          onChange={f => this.change(f, "equipment")}
          min={16}
        />
        <GoldContainer
          name="gold"
          formData={formData.gold}
          onChange={f => this.change(f, "gold")}
        />
        <ItemsContainer
          name="treasure"
          formData={formData.treasure || []}
          schema={schema.properties.treasure}
          onChange={f => this.change(f, "treasure")}
          min={10}
        />
      </div>
    )
  }
}

class ItemsContainer extends Component {
  constructor(props) {
    super(props)
    this.change = this.change.bind(this)
  }
  change(v, i) {
    const data = this.props.formData
    data[i] = v
    this.props.onChange(data)
  }
  render() {
    const { name, min, schema, formData } = this.props
    const title = schema.title || name.charAt(0).toUpperCase() + name.slice(1)
    const data = formData
    const num = data.length
    for (let i = 0; i < min - num; i++) { data.push("") }
    const items = data.map((item, index) => {
      return (
        <CustomInput
          key={`${name}-${index}`}
          name={`${name}-${index}`}
          formData={item}
          onChange={v => this.change(v, index)}
          schema={{type: "string"}}
          uiSchema={{"ui:title": false}}
        />
      )
    })
    return (
      <div className={`character-${name}-container items-container`} id={name}>
        <legend>{title}</legend>
        {items}
      </div>
    )
  }
}

class GoldContainer extends Component {
  constructor(props) {
    super(props)
    this.change = this.change.bind(this)
  }
  change(f, k) {
    const data = this.props.formData
    data[k] = f
    this.setState(data)
    this.props.onChange(data)
  }
  render() {
    const { name, formData } = this.props
    const coins = Object.keys(formData).map(k => {
      return (
        <CustomInput
          key={`${name}-${k}`}
          name={`${name}-${k}`}
          formData={formData[k]}
          onChange={f => this.change(f, k)}
          schema={{type: "number", title: k.toUpperCase()}}
          uiSchema={{}}
        />
      )
    })
    return (
      <div className={`character-${name}-container`} id={name}>
        {coins}
      </div>
    )
  }
}

class InfoContainer extends Component {
  constructor(props) {
    super(props)
    this.change = this.change.bind(this)
  }
  change(form, key, field) {
    const data = this.props.formData
    field ? data[key][field] = form : data[key] = form
    this.setState(data)
    this.props.onChange(data)
  }
  render() {
    const { name, formData, schema } = this.props
    const descriptionInputs = Object.keys(formData.description).map(k => {
      return (
        <div className={`custom-input-field description-${k}`} key={`description-${k}`}>
          <input
            className={`character-description-${k}-input`}
            id={`description-${k}`}
            type="string"
            name={`${name}-${k}`}
            value={formData.description[k]}
            onChange={e => this.change(e.target.value, "description", k)}
            data-lpignore={true}
            autoComplete="none"
          />
          <label htmlFor={`details-${k}`}>{schema.properties.description.properties[k].title || k}</label>
        </div>
      )
    })
    const characteristics = Object.keys(formData.characteristics).map(k => {
      return (
        <ItemsContainer
          key={`characteristics-${k}`}
          name={k}
          formData={formData.characteristics[k] || []}
          schema={schema.properties.characteristics.properties[k]}
          onChange={f => this.change(f, "characteristics", k)}
          min={4}
        />
      )
    })
    return (
      <div className="character-gear-container" id={name}>
        <div id="description">
          {descriptionInputs}
        </div>
        <ItemsContainer
          name="proficiencies"
          formData={formData.proficiencies || []}
          schema={schema.properties.proficiencies}
          onChange={f => this.change(f, "proficiencies")}
          min={8}
        />
        <ItemsContainer
          name="languages"
          formData={formData.languages || []}
          schema={schema.properties.languages}
          onChange={f => this.change(f, "languages")}
          min={8}
        />
        <div id="characteristics">
          {characteristics}
        </div>
        <ItemsContainer
          name="features"
          formData={formData.features || []}
          schema={schema.properties.features}
          onChange={f => this.change(f, "features")}
          min={16}
        />
        <ItemsContainer
          name="allies"
          formData={formData.allies || []}
          schema={schema.properties.allies}
          onChange={f => this.change(f, "allies")}
          min={10}
        />
      </div>
    )
  }
}

class MagicContainer extends Component {
  constructor(props) {
    super(props)
    this.change = this.change.bind(this)
  }
  change(form, key, field) {
    const data = this.props.formData
    const type = this.props.schema.properties[key].properties[field].type
    const value = type === "number" ? parseInt(form, 10) : form
    field ? data[key][field] = value : data[key] = value
    this.setState(data)
    this.props.onChange(data)
  }
  render() {
    const { name, formData, schema } = this.props
    const spellcastingInputs = Object.keys(formData.spellcasting).map(k => {
      const { type, title } = schema.properties.spellcasting.properties[k]
      const value = formData.spellcasting[k]
      return (
        <div className={`custom-input-field spellcasting-${k}`} key={`spellcasting-${k}`}>
          <input
            className={`character-spellcasting-${k}-input`}
            id={`spellcasting-${k}`}
            type={type}
            name={`spellcasting-${k}`}
            value={value ? value : type === "number" ? 0 : ""}
            onChange={e => this.change(e.target.value, "spellcasting", k)}
            data-lpignore={true}
            autoComplete="none"
          />
          <label htmlFor={`spellcasting-${k}`}>{title || k}</label>
        </div>
      )
    })
    const spells = Object.keys(formData.spells).map(k => {
      const level = k === "0" ? "cantrips" : `level-${k}`
      return (
        <SpellsContainer
          key={`spell-${level}-container`}
          name={level}
          formData={formData.spells[k]}
          onChange={f => this.change(f, "spells", k)}
          min={k > 0 && k < 5 ? 13 : 8}
        />
      )
    })
    return (
      <div className="character-magic-container" id={name}>
        <div id="spellcasting">
          {spellcastingInputs}
        </div>
        <div id="spells">
          {spells}
        </div>
      </div>
    )
  }
}

class SpellsContainer extends Component {
  constructor(props) {
    super(props)
    this.changeSpell = this.changeSpell.bind(this)
    this.changeSlots = this.changeSlots.bind(this)
  }
  changeSpell(v, i, f) {
    const data = this.props.formData
    f ? data.spells[i] ? data.spells[i][f] = v : data.spells[i] = {[f]: v} : data.spells[i] = v
    this.setState(data)
    this.props.onChange(data)
  }
  changeSlots(v, k) {
    const data = this.props.formData
    data.slots[k] = v
    this.setState(data)
    this.props.onChange(data)
  }
  render() {
    const { name, min, formData } = this.props
    const data = formData.spells || []
    const num = data.length
    for (let i = 0; i < min - num; i++) { data.push(name === "cantrips" ? "" : { prepared: false, name: "" }) }
    const items = data.map((item, index) => {
      return (
        <div className="spell-input" key={`${name}-${index}-container`}>
          { name === "cantrips"
            ? ''
            : (
              <BooleanInput
                value={item.prepared}
                onChange={e => this.changeSpell(e.target.value, index, "prepared")}
                boolType="radio"
              />
            )
          }
          <CustomInput
            key={`${name}-${index}-name`}
            name={`${name}-${index}-name`}
            formData={name === "cantrips" ? item : item.name}
            onChange={v => this.changeSpell(v, index, name === "cantrips" ? false : "name")}
            schema={{type: "string"}}
            uiSchema={{"ui:title": false}}
          />
        </div>
      )
    })
    return (
      <div className={`character-spells-${name} spells-container`} id={name}>
        <div className="spell-title-field">
          <legend>{name.charAt(0).toUpperCase() + name.slice(1).split('-').join(' ')}</legend>
          {name === "cantrips"
            ? ''
            : (
              <div className="spell-slots-container">
                <CustomInput
                  name={`${name}-slots-total`}
                  formData={formData.slots.total}
                  onChange={v => this.changeSlots(v, "total")}
                  schema={{type: "number", title: "Spell Slots"}}
                  uiSchema={{"ui:inline": true}}
                />
                <CustomInput
                  name={`${name}-slots-used`}
                  formData={formData.slots.used}
                  onChange={v => this.changeSlots(v, "used")}
                  schema={{type: "number", title: "Used"}}
                  uiSchema={{"ui:inline": true}}
                />
              </div>
            )
          }
        </div>
        {items}
      </div>
    )
  }
}

const uiSchema = {
  classNames: "character-sheet",
  stats: {
    "ui:title": false,
    skills: {
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
    inspiration: { "ui:inline": true },
    proficiency: { "ui:inline": true },
    passivePerception: { "ui:inline": true }
  }
}

const fields = {
  baseContainer: BaseContainer,
  statContainer: StatContainer,
  combatContainer: CombatContainer,
  gearContainer: GearContainer,
  infoContainer: InfoContainer,
  magicContainer: MagicContainer
}

export default class CharacterPage extends Component {
  constructor() {
    super()
    this.state = {
      character: {
        base: { name: "", details: { class: "", level: 0, background: "", player: "", race: "", alignment: "", xp: 0 } },
        stats: {
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
          passivePerception: 0
        },
        combat: {
          initiative: 0, ac: 0, speed: 0, health: { hp: { max: 0, current: 0, temporary: 0 }, hd: { total: "", used: "" }, deathSaves: { success: 0, failure: 0 } }, attacks: []
        },
        gear: { equipment: [], gold: { cp: 0, sp: 0, gp: 0, pp: 0 }, treasure: [] },
        info: { description: { age: "", height: "", weight: "", eyes: "", skin: "", hair: "" }, characteristics: { traits: [], ideals: [], bonds: [], flaws: [] }, proficiencies: [], languages: [], features: [], allies: [] },
        magic: {
          spellcasting: { class: "", ability: "", dc: 0, bonus: 0 },
          spells: {
            0: { spells: [] },
            1: { slots: { total: 0, used: 0 }, spells: [] },
            2: { slots: { total: 0, used: 0 }, spells: [] },
            3: { slots: { total: 0, used: 0 }, spells: [] },
            4: { slots: { total: 0, used: 0 }, spells: [] },
            5: { slots: { total: 0, used: 0 }, spells: [] },
            6: { slots: { total: 0, used: 0 }, spells: [] },
            7: { slots: { total: 0, used: 0 }, spells: [] },
            8: { slots: { total: 0, used: 0 }, spells: [] },
            9: { slots: { total: 0, used: 0 }, spells: [] }
          }
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
      console.log('get')
      fetch(`http://localhost:1268/api/characters/${this.props.match.params.id}`)
      .then(res => res.json()).then(res => {
        this.setState({character: res})
      })
    }
  }

  updateCharacter(character) {
    console.log('put')
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
    console.log('post')
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
          ObjectFieldTemplate={ObjectFieldTemplate}
          showErrorList={false}
        >
          <button type="submit" id="character-save">SAVE</button>
        </Form>
      </div>
    )
  }
}