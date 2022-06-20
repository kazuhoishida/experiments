import type { ChangeEvent } from 'react'
type LabeledOption = {
  label: string
  value: string | number
}
type Option = LabeledOption | string | number
type Options = Array<Option>

export interface OnChange {
  (newValue: string): void
}

type Props = {
  options: Options
  onChange: OnChange
}

const isLabeledOption = (option: Option): option is LabeledOption => {
  return option instanceof Object && 'label' in option && 'value' in option;
}

export const Select = ({options, onChange}: Props) => {
  const onChangeHandler = (e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)
  return(
    <select onChange={onChangeHandler}>
      <option value=""></option>
      {options.map(option => {
        if( isLabeledOption(option) ) {
          return <option value={option.value} key={option.value}>{option.label}</option>
        }
        return <option value={option} key={option}>{option}</option>
      })}
    </select>
  )
}
