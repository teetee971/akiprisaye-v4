import React from 'react'

export function lazyPage<T extends React.ComponentType<unknown>>(
  factory: () => Promise<{ default: T }>
) {
  return React.lazy(factory)
}

