import { Listbox, Transition, Disclosure } from '@headlessui/react';
import { Fragment, useState } from 'react';

type LabeledOption = {
    label: string;
    value: string | number;
};
type Option = LabeledOption | string | number;
type Options = Array<Option>;

export interface OnChange {
    (newValue: string): void;
}

type Props = {
    options: Options;
    onChange: OnChange;
    className?: string;
};

const isLabeledOption = (option: Option): option is LabeledOption => {
    return option instanceof Object && 'label' in option && 'value' in option;
};

export const Select = ({ options, onChange, className = '' }: Props) => {
    const [selectedOption, setSelectedOption] = useState(options[0]);
    const onChangeHandler = (option: Option) => {
        setSelectedOption(option);
        onChange(isLabeledOption(option) ? `${option.value}` : `${option}`);
    };
    return (
        <Listbox value={selectedOption} onChange={onChangeHandler}>
            <Listbox.Button className={`font-squash-h6 relative bg-transparent font-flex hover:opacity-60`}>
                {(v => (v === '' ? 'ALL' : `${v}`))(
                    isLabeledOption(selectedOption) ? selectedOption.label : `${selectedOption}`
                )}
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
                    className={`absolute top-[35px] left-0 w-fit rounded-sm bg-v-soft-black/70 py-1 drop-shadow-md backdrop-blur-sm duration-[400ms] hover:bg-black/70 focus:outline-none md:left-[7em]`}
                >
                    {options.map((option, i) => {
                        const [value, label] = isLabeledOption(option)
                            ? [option.value, option.label]
                            : [option, option];
                        return (
                            <Listbox.Option
                                className={`relative cursor-pointer select-none whitespace-nowrap py-2 px-6 hover:opacity-60`}
                                key={`${label}-${i}`}
                                value={value}
                            >
                                <Disclosure.Button className={`font-squash-h6 font-flex`}>
                                    {label === '' ? 'ALL' : label}
                                </Disclosure.Button>
                            </Listbox.Option>
                        );
                    })}
                </Listbox.Options>
            </Transition>
        </Listbox>
    );
};
