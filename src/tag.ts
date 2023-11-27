import { applyDecorators, Injectable, SetMetadata } from '@nestjs/common'
import { TAG_METADATA_KEY } from './metadata'

export type Tag<TMetadata extends object> = {
  name: symbol
  metadata: TMetadata
}

export type TagDefinition<TTarget extends object, TMetadata extends object> = {
  name: symbol
  make(metadata: TMetadata): Tag<TMetadata>
  decorator(
    metadata: TMetadata,
  ): (target: new (...args: unknown[]) => TTarget) => void
}

export function defineTag<
  TMetadata extends object,
  TTarget extends object = object,
>(name: string): TagDefinition<TTarget, TMetadata> {
  const nameSymbol = Symbol(name)

  const make = (metadata: TMetadata): Tag<TMetadata> => ({
    name: nameSymbol,
    metadata,
  })

  const decorator = (metadata: TMetadata) =>
    applyDecorators(
      Injectable(),
      SetMetadata(TAG_METADATA_KEY, [make(metadata)]),
    )

  return { name: nameSymbol, make, decorator }
}
