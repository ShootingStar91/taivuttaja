import React from "react";

export const FullModal = ({
  content,
  closeButtonText,
  closeModal,
}: {
  content: JSX.Element;
  closeButtonText: string;
  closeModal: (() => void) | undefined;
}) => {
  return (
    <div className="bg-bg-color fixed top-0 left-0 w-screen h-screen z-40 overflow-auto">
      <div className="mx-auto mt-12 w-[910px] shadow-2xl">
        <div className="bg-content-color ">
          <div className="flex flex-auto justify-end pt-6 pr-6">
            {closeModal && (
              <button className="btn" onClick={() => closeModal()}>
                {closeButtonText}
              </button>
            )}
          </div>

          <div className="p-8">{content}</div>
        </div>
      </div>
    </div>
  );
};
