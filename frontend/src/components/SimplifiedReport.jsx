import React from "react";

const SimplifiedReport = ({ report }) => {
  if (!report) return null;

  return (
    <div className="w-full max-w-4xl bg-gray-900 text-gray-100 p-6 rounded-xl shadow-xl mt-6">
      <h2 className="text-2xl font-bold text-indigo-400 mb-4">
        Simplified Report
      </h2>

 
      <div className="mb-4">
  <h3 className="font-semibold text-gray-300 mb-2">Summary:</h3>
  <p>{report.summary}</p>


  {report.explanation && <p className="mt-2">{report.explanation}</p>}

  {report.explanations && report.explanations.length > 0 && (
    <ul className="list-disc ml-5 mt-2 space-y-1">
      {report.explanations.map((exp, i) => (
        <li key={i}>{exp}</li>
      ))}
    </ul>
  )}
</div>

      {/* Test Results */}
      {report.tests && report.tests.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold text-gray-300 mb-2">Test Results:</h3>
          <ul className="space-y-2">
            {report.tests.map((test, i) => (
              <li
                key={i}
                className={`p-2 rounded ${
                  test.status === "high"
                    ? "bg-red-700/30 text-red-200"
                    : test.status === "low"
                    ? "bg-yellow-600/30 text-yellow-200"
                    : "bg-green-700/30 text-green-200"
                }`}
              >
                <span className="font-medium">{test.name}:</span> {test.value}{" "}
                {test.unit} ({test.status})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SimplifiedReport;
