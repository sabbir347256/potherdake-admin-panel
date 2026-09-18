
const DynamicTable = ({ headers, data, showCheckbox }) => {
console.log(data)

  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {showCheckbox && <th className="px-6 py-3 text-left"></th>}
            {headers.map((header, index) => (
              <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data?.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {showCheckbox && <td className="px-6 py-4"><input type="checkbox" /></td>}
              {headers.map((header, colIndex) => (
                <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {header.type === "badge" && (
                    <button
                      onClick={() => header.onClick(row)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold uppercase transition-colors ${row[header.key] === "active"
                          ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                          : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                        }`}
                    >
                      {row[header.key] || "active"}
                    </button>
                  )}

                  {header.type === "button" && (
                    <button
                      onClick={() => header.onClick(row)}
                      className="text-red-600 hover:text-red-900 font-medium text-sm transition-colors"
                    >
                      {header.buttonLabel}
                    </button>
                  )}

                  {!header.type && (row[header.key] || "-")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

};

export default DynamicTable;
