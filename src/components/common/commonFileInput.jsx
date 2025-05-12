export function CommonFileInput({ content, handleFileChange, fileName, acceptableFileType }) {
    return (
        <>
            <div className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center space-y-3"></div>
                <label
                    className={`cursor-pointer flex items-center space-x-2 bg-yellow-600 text-white text-sm px-3 py-1 rounded-sm shadow-lg hover:bg-yellow-700 transition-all duration-300`}
                >
                    <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                        <span className="text-yellow-700 font-bold">↑</span>
                    </div>
                    <span>{fileName || content}</span>
                    <input
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept={acceptableFileType}
                    />
                </label>
            </div>
        </>
    )
}
