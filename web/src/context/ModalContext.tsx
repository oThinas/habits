import { createContext, useState } from 'react';

interface IModalContext {
  isModalOpen: boolean;
  toggleModalOpenState: () => void;
}

export const ModalContext = createContext({} as IModalContext);

export function ModalContextProvider(props: { children: React.ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  function toggleModalOpenState() {
    setIsModalOpen(!isModalOpen);
  }

  return (
    <ModalContext.Provider value={{ isModalOpen, toggleModalOpenState }}>
      {props.children}
    </ModalContext.Provider>
  );
}
