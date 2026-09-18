const DynamicHeader = ({ mainHeader, subHeaderName }) => {
    return (
        <div className="flex flex-col gap-1.5 border-b border-gray-100 shadow-md w-full p-4 rounded ">
            <h1 className="text-2xl font-bold tracking-tight text-gray-700">
                {mainHeader}
            </h1>
            {subHeaderName && (
                <p className="text-sm  text-gray-500 font-medium">
                    {subHeaderName}
                </p>
            )}
        </div>
    );
};

export default DynamicHeader;