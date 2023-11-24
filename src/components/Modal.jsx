const Modal = ({ isVisible, onClose }) => {
  if (!isVisible) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
      <div className="w-[600px] flex flex-col">
        <div className="relative bg-white p-2 rounded">
          <button
            className="absolute right-5 text-black text-xl place-self-end"
            onClick={() => onClose()}
          >
            X
          </button>
          <div className="py-6 px-6 lg:px8 text-left">
            <h3 className="mb-4 text-xl font-medium text-gray-900">
              Add Friend
            </h3>
            <form className="space-y-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900">
                  Friend Code
                </label>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="#"
                  required
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
