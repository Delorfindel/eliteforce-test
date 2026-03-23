import React from "react";

type GluestackUIProviderProps = {
  children: React.ReactNode;
};

export function GluestackUIProvider({
  children
}: GluestackUIProviderProps) {
  return <>{children}</>;
}
