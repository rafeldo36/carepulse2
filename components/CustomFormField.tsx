"use client"

import { Input } from "@/components/ui/input"
import React from 'react'
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from './ui/form'
import { Control } from "react-hook-form"
import { FormFieldType } from "./forms/PatientForm"
import Image from "next/image"
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import { E164Number } from 'libphonenumber-js/core'
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { Select, SelectContent, SelectTrigger, SelectValue } from "./ui/select"
import { Textarea } from "./ui/textarea"
import { Checkbox } from "./ui/checkbox"


interface CustomProps {
    control: Control<any>,
    fieldType: FormFieldType,
    label?: string,
    name: string,
    placeholder?: string,
    iconSrc?: string,
    iconAlt?: string,
    children?: React.ReactNode,
    renderSkeleton?: (field: any) => React.ReactNode,
    disabled?: boolean,
    dateFormat?: string,
    showTimeSelect?: boolean
}

const RenderField = ({ field, props }: { field: any, props: CustomProps }) => {
    const { placeholder, fieldType, iconSrc, iconAlt, showTimeSelect, dateFormat, renderSkeleton } = props
    switch (fieldType) {
        case FormFieldType.INPUT:
            return (
                <div className="flex rounded-md border border-dark-500 bg-dark-400">
                    {iconSrc && (
                        <Image
                            src={iconSrc}
                            alt={iconAlt || "icon"}
                            width={20}
                            height={20}
                            className="ml-2"
                        />)}
                    <FormControl>
                        <Input
                            {...field}
                            placeholder={placeholder}
                            className="shad-input border-0"
                        />
                    </FormControl>
                </div>
            )
        case FormFieldType.TEXTAREA:
            return (
                <FormControl>
                    <Textarea
                        {...field}
                        placeholder={placeholder}
                        className="shad-textArea"
                        disabled={props.disabled}
                    />
                </FormControl>
            )
        case FormFieldType.PHONE_INPUT:
            return (
                <FormControl>
                    <PhoneInput
                        defaultCountry="IN"
                        placeholder={placeholder}
                        international
                        withCountryCallingCode
                        value={field.value as E164Number | undefined}
                        onChange={field.onChange}
                        className="input-phone"
                    />
                </FormControl>
            )
        case FormFieldType.DATE_PICKER:
            return (
                <div className="flex rounded-md border border-dark-500 bg-dark-400">
                    <Image
                        src="/assets/icons/calendar.svg"
                        alt="calendar"
                        width={24}
                        height={24}
                        className="ml-2"
                    />
                    <DatePicker
                        selected={field.value}
                        onChange={(date) => field.onChange(date)}
                        dateFormat={dateFormat ?? 'MM/dd/yyyy'}
                        showTimeSelect={showTimeSelect ?? false}
                        timeInputLabel="Time:"
                        wrapperClassName="date-picker"
                    />
                </div>
            )
        case FormFieldType.SELECT:
            return (
                <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger className="shad-select-trigger">
                                <SelectValue placeholder={placeholder} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent className="shad-select-content">
                            {props.children}
                        </SelectContent>
                    </Select>
                </FormControl>
            )
        case FormFieldType.SKELETON:
            return renderSkeleton ? renderSkeleton(field) : null
        case FormFieldType.CHECKBOX:
            return (
                <FormControl>
                    <div className="flex items-center gap-4">
                        <Checkbox
                            id={props.name}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                        <label htmlFor={props.name} className="checkbox-label">
                            {props.label}
                        </label>
                    </div>
                </FormControl>
            )
        default:
            break;
    }
}

const CustomFormField = (props: CustomProps) => {
    const { control, fieldType, name, label } = props
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex-1">
                    {fieldType !== FormFieldType.CHECKBOX && label && (
                        <FormLabel>{label}</FormLabel>
                    )}
                    <RenderField field={field} props={props} />

                    <FormMessage className="shad-error" />
                </FormItem>
            )}
        />
    )
}

export default CustomFormField