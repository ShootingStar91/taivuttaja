import React from "react";
import { useAppSelector } from "../reducers/hooks";
import { selectUser } from "../reducers/user";


export const Modal = ({ content, closeButtonText, closeModal }: { content: JSX.Element, closeButtonText: string, closeModal: (() => void) | undefined }) => {

  const user = useAppSelector(selectUser);

  if (!user) {
    return null;
  }



  return (
      <div className='bg-white overflow-visible absolute ml-8 top-5 self-center rounded shadow-2xl min-w-[720px] md:w-[960px] z-40
      h-content p-8'>
        {closeModal && <button className='btn absolute right-5' onClick={() => closeModal()}>{closeButtonText}</button>}

        <div className='m-16'>
          {content}
        </div>
      </div>
  );

};