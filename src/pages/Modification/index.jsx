import React, { useState } from 'react';

const Modification= () => {
  const [modificationType, setModificationType] = useState(null);
  const [scopeType, setScopeType] = useState(null);

  const handleModificationType = (type) => {
    setModificationType(type);
    setScopeType(null); // Reset scope type when modification type changes
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-semibold mb-6">Modification</h2>

        <div className="flex justify-center space-x-4 mb-4">
          <button
            className={`px-4 py-2 rounded ${
              modificationType === 'increase'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => handleModificationType('increase')}
          >
            Increase in Scope
          </button>
          <button
            className={`px-4 py-2 rounded ${
              modificationType === 'decrease'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => handleModificationType('decrease')}
          >
            Decrease in Scope
          </button>
        </div>

        {modificationType && (
          <div className="flex justify-center space-x-4 mb-4">
            {modificationType === 'increase' && (
              <>
                <button
                  className={`px-4 py-2 rounded ${
                    scopeType === 'leaseTermIncrease'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                  onClick={() => setScopeType('leaseTermIncrease')}
                >
                  Lease term increase
                </button>
                <button
                  className={`px-4 py-2 rounded ${
                    scopeType === 'assetValueIncrease'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                  onClick={() => setScopeType('assetValueIncrease')}
                >
                  Asset value increase
                </button>
              </>
            )}

            {modificationType === 'decrease' && (
              <>
                <button
                  className={`px-4 py-2 rounded ${
                    scopeType === 'leaseTermDecrease'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                  onClick={() => setScopeType('leaseTermDecrease')}
                >
                  Lease term decrease
                </button>
                <button
                  className={`px-4 py-2 rounded ${
                    scopeType === 'assetValueDecrease'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                  onClick={() => setScopeType('assetValueDecrease')}
                >
                  Asset value decrease
                </button>
              </>
            )}
          </div>
        )}

        {scopeType && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">
              {scopeType === 'leaseTermIncrease'
                ? 'Lease Term Increase Details'
                : scopeType === 'assetValueIncrease'
                ? 'Asset Value Increase Details'
                : scopeType === 'leaseTermDecrease'
                ? 'Lease Term Decrease Details'
                : 'Asset Value Decrease Details'}
            </h3>

            <form>
              <div className="mb-4">
                <label
                  htmlFor="newIBR"
                  className="block text-sm font-medium text-gray-700"
                >
                  New IBR
                </label>
                <input
                  type="text"
                  id="newIBR"
                  className="mt-1 p-2 border rounded w-full"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="newEndDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  New End Date
                </label>
                <input
                  type="date"
                  id="newEndDate"
                  className="mt-1 p-2 border rounded w-full"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="modificationDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Modification Date
                </label>
                <input
                  type="date"
                  id="modificationDate"
                  className="mt-1 p-2 border rounded w-full"
                />
              </div>

              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Submit
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modification;