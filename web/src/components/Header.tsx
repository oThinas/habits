import { useContext } from 'react';

import { Modal } from './Modal';

import { ModalContext } from '../context/ModalContext';

import logoImage from '../assets/logo.svg';

export function Header() {
  const { isModalOpen, toggleModalOpenState } = useContext(ModalContext);

  return (
    <div className='w-full max-w-3xl mx-auto flex items-center justify-between'>
      <img src={logoImage} alt='Habits logo' draggable={false} />

      <Modal open={isModalOpen} onOpenChange={() => toggleModalOpenState()}/>
    </div>
  );
}
