import React from 'react';


export const Modal = ({ content, closeButtonText, closeModal }: { content: JSX.Element, closeButtonText: string, closeModal: (() => void) | undefined }) => {


  return (
    <div className='bg-white overflow-visible absolute ml-8 self-center rounded shadow-2xl min-w-[720px] md:w-[960px] z-30
      h-content p-8'>
      {closeModal && <button className='btn absolute right-5' onClick={() => closeModal()}>{closeButtonText}</button>}

      <div className='m-16'>
        {content}
      </div>
    </div>
  );

};


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