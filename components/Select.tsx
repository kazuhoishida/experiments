import * as Select from '@radix-ui/react-select';
import * as Collapsible from '@radix-ui/react-collapsible';
import { useState } from 'react';

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

export const SelectComponent = ({ options, onChange, className = '' }: Props) => {
    const [selectedOption, setSelectedOption] = useState(options[0]);
    const [isOpen, setIsOpen] = useState(false);

    const onChangeHandler = (option: Option) => {
        setSelectedOption(option);
        onChange(isLabeledOption(option) ? `${option.value}` : `${option}`);
        setIsOpen(false);
    };

    return (
        <Collapsible.Root open={isOpen} onOpenChange={setIsOpen}>
            <Collapsible.Trigger className={`font-squash-h6 relative bg-transparent font-flex hover:opacity-60`}>
                {(v => (v === '' ? 'ALL' : `${v}`))(
                    isLabeledOption(selectedOption) ? selectedOption.label : `${selectedOption}`
                )}
            </Collapsible.Trigger>
            <Collapsible.Content
                className={`absolute top-[35px] left-0 w-fit rounded-sm bg-v-soft-black/70 py-1 drop-shadow-md backdrop-blur-sm duration-[400ms] hover:bg-black/70 focus:outline-none md:left-[7em]`}
            >
                {options.map((option, i) => {
                    const [value, label] = isLabeledOption(option) ? [option.value, option.label] : [option, option];
                    return (
                        <button
                            className={`relative cursor-pointer select-none whitespace-nowrap py-2 px-6 hover:opacity-60 w-full text-left`}
                            key={`${label}-${i}`}
                            onClick={() => onChangeHandler(option)}
                        >
                            <span className={`font-squash-h6 font-flex`}>{label === '' ? 'ALL' : label}</span>
                        </button>
                    );
                })}
            </Collapsible.Content>
        </Collapsible.Root>
    );
};
