"use client"

import { createContext, useState, FC, ReactNode, useContext } from 'react';

interface Session {
  tvId: string;
  accessToken: string;
  refreshToken: string;
  // Add other session fields as necessary
}

interface SessionContextProps {
  session: Session | null;
  setSession: (session: Session | null) => void;
}

const defaultSessionContextProps: SessionContextProps = {
  session: null,
  setSession: () => {}
};

export const SessionContext = createContext<SessionContextProps>(defaultSessionContextProps);

export const SessionProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);

  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
