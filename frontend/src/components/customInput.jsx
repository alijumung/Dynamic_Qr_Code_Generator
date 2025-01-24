import React from "react";

const CustomInput = ({ name, label, type, value, onChange, placeholder, required }) => {
    return (
        <div className="flex flex-col space-y-2">
            {label && <label className="text-textColor text-xl font-semibold text-gray-700">{label}</label>}
            <input
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full text-textColor p-3 border-2 border-textColor bg-transparent rounded-lg transition-all focus:outline-none focus:bg-backGround"
                required={required} // Pass the required prop to the input element
            />
        </div>
    );
};

export default CustomInput;
