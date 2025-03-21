import { type ReactPortal, Fragment, StrictMode, type SuspenseProps, type ProfilerProps, type PropsWithChildren, type DOMAttributes, type ProviderProps, } from "react";

export type Children = Pick<ReactPortal, 'children'> &
  Pick<ProviderProps<unknown>, 'children'> &
  Parameters<typeof Fragment>[0] &
  Parameters<typeof StrictMode>[0] &
  Pick<SuspenseProps, 'children'> &
  Pick<ProfilerProps, 'children'> &
  PropsWithChildren &
  Pick<DOMAttributes<unknown>, 'children'> &
  JSX.ElementChildrenAttribute;