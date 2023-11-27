import { DiscoveryService, Reflector } from '@nestjs/core'
import { Tag, TagDefinition } from './tag'
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper'
import { TAG_METADATA_KEY } from './metadata'
import { Injectable } from '@nestjs/common'

export type TaggedService<TTarget extends object, TMetadata extends object> = {
  service: TTarget
  metadata: TMetadata
}

@Injectable()
export class ServiceLocator {
  constructor(
    private readonly discovery: DiscoveryService,
    private readonly reflector: Reflector,
  ) {}

  tagged<TTarget extends object, TMetadata extends object>(
    tag: TagDefinition<TTarget, TMetadata>,
  ): TaggedService<TTarget, TMetadata>[] {
    return this.discovery
      .getProviders()
      .map<TaggedService<TTarget, TMetadata>[]>((wrapper) => {
        return this.getTaggedService(tag, wrapper)
      })
      .flat()
  }

  private getTaggedService<TTarget extends object, TMetadata extends object>(
    tag: TagDefinition<TTarget, TMetadata>,
    wrapper: InstanceWrapper,
  ): TaggedService<TTarget, TMetadata>[] {
    const tags = wrapper.metatype
      ? this.reflector.get<Tag<object>[]>(TAG_METADATA_KEY, wrapper.metatype)
      : undefined

    return (
      tags?.reduce<TaggedService<TTarget, TMetadata>[]>(
        (taggedServices, found) => {
          if (tag.name === found.name) {
            taggedServices.push({
              service: wrapper.instance as TTarget,
              metadata: found.metadata as TMetadata,
            })
          }
          return taggedServices
        },
        [],
      ) ?? []
    )
  }
}
