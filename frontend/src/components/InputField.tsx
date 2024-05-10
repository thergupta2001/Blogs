interface InputFieldProps {
    value: string;
    onChange: (value: string) => void;
    type: string;
    label: string;
    id: string;
}

export const InputField: React.FC<InputFieldProps> = ({value, onChange, type, label, id}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium leading-6 text-gray-900">
                {label}
            </label>
            <div className="mt-2">
                <input
                    name={value}
                    type={type}
                    value={value}
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    onChange={handleChange}
                />
            </div>
        </div>
    )
}
