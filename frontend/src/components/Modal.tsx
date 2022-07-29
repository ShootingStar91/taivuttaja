import React from 'react';



export const FullModal = ({ content, closeButtonText, closeModal }: { content: JSX.Element, closeButtonText: string, closeModal: (() => void) | undefined }) => {


  return (
    <div className='bg-bg-color fixed sm:top-12 left-0 w-screen h-screen z-30'>
      <div className='mx-auto min-w-[512px] lg:max-w-[972px] px-8'>

        <div className='bg-content-color'>
          <div className='flex flex-auto justify-end pt-6 pr-6'>
            {closeModal && <button className='btn' onClick={() => closeModal()}>{closeButtonText}</button>}
          </div>

          <div className='p-8'>

            {content}
          </div>
        </div>
      </div>
    </div>
  );

};