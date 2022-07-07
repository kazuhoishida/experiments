import { Listbox, Transition, } from '@headlessui/react'
import { Fragment, ChangeEvent, useState } from 'react'

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
  className?: string
}

const isLabeledOption = (option: Option): option is LabeledOption => {
  return option instanceof Object && 'label' in option && 'value' in option;
}

export const Select = ({options, onChange, className = ''}: Props) => {
  const [selectedOption, setSelectedOption] = useState(options[0])
  const onChangeHandler = (option: Option) => {
    setSelectedOption(option)
    onChange(isLabeledOption(option) ? `${option.value}` : `${option}`)
  }
  return(
    <Listbox value={selectedOption} onChange={onChangeHandler}>
      <Listbox.Button className={`font-flex font-squash-h6 bg-transparent relative hover:opacity-60`}>
        { ((v) => v === '' ? ': ALL' : `: ${v}`)(isLabeledOption(selectedOption) ? selectedOption.label : `${selectedOption}`) }
      </Listbox.Button>
      <Transition
        as={Fragment}
        enter="transition duration-300 ease-out"
        enterFrom="transform origin-top scale-y-0  opacity-0"
        enterTo="transform origin-top scale-y-100 opacity-100"
        leave="transition duration-200 ease-out"
        leaveFrom="transform origin-top scale-y-100 opacity-100"
        leaveTo="transform origin-top scale-y-[40%] opacity-0"
      >
        <Listbox.Options
          className={`font-flex font-squash-h6 bg-v-soft-black/70 backdrop-blur-sm drop-shadow-md py-1 rounded-sm focus:outline-none top-[35px] left-0 md:left-20 w-fit absolute`}
        >
          {options.map((option, i) => {
            const [value, label] = isLabeledOption(option) ? [option.value, option.label] : [option, option]
            return (
              <Listbox.Option
                className={`relative cursor-pointer select-none py-2 px-6 whitespace-nowrap hover:opacity-60`}
                key={`${label}-${i}`}
                value={value}
              >
                {label === '' ? 'ALL' : label}
              </Listbox.Option>
            )
          })}
        </Listbox.Options>
      </Transition>
    </Listbox>
  )
}
