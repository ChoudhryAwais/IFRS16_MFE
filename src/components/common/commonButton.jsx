import React from 'react'

export default function CommonButton(
    {
        handleValidateForm = () => { return false },
        onSubmit,
        extandedClass = "bg-indigo-600 hover:bg-indigo-700 hover:text-white text-xs",
        text
    }
) {
    return (
        <button
            disabled={handleValidateForm()}
            onClick={onSubmit}
            type="button"
            className={
                (handleValidateForm() ?
                    "cursor-no-drop " : " ") + extandedClass + " py-2 px-2 font-medium text-white focus:outline-none rounded-sm border border-gray-200 hover:text-white "
            }>
            {text}
        </button>
    )
}
