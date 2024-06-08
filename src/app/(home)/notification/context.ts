import { Dispatch, SetStateAction, createContext } from 'react';

interface IContextProps {
  setSelectedTab: Dispatch<SetStateAction<string>>;
}

const TabsContext = createContext({} as IContextProps);

export default TabsContext;
