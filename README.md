# NestJS Service Locator

The service locator package allow you to define "service tags". Service tags can be used to create a collection of services
that can be retreived using a service locator. This can be helpful when implementing certain design patterns (e.g. strategy),
where a service uses a collection of different implementations.

## Defining a tag

To define a new tag, you need to call the defineTag function:

```typescript
import { defineTag } from '@riotbyte/nest-service-locator'

export const MyTag = defineTag('my-tag-name')
```

> NOTE: You can define a tag with the same name, mulitple times. Keep in mind that each individual instance is
> a different tag, and tags with the same name, will not conflict with eachother.

This tag can now be applied using the decorator method on the defined tag:

```typescript
@MyTag.decorator({})
class MyTaggedClass {}
```

> NOTE: The empty object passed to the decorator function is used to supply the tag with metadata. By default, metadata
> can be an empty object, but you can specify the type of metadata for each tag induvidually.

### Providing metadata

Tags can provide additional information about the class that it has been applied to. You can define the type of the metadata when defining a tag:

```typescript
export const MyTag = defineTag<{ name: string }>('my-tag-name')
```

This example now requires an object with the name property when applying the tag:

```typescript
@MyTag.decorator({ name: 'my-tagged-class' })
class MyTaggedClass {}
```

### Restricting the tag

By default, the tag can be applied to any class. If a tag is expected to only be applied to a specific interface or type, you can define a tag like this:

```typescript
import { defineTag } from '@riotbyte/nest-service-locator'

export const MyTag = defineTag<object, MyInterface>('my-tag-name')
```

Now the compiler will show an error when the class the tag is being applied to is not an instance of MyInterface:

```typescript
// This is allowed since X is a valid implementation of MyInterface
@MyTag.decorator({})
class X implements MyInterface {
  myInterfacedFunction() {}
}

// This is not allowed since Y is not a valid implementation of MyInterface
@MyTag.decorator({})
class Y {}
```

## Retreiving tagged services

Tagged services and their metadata can be retrieved using the service locator:

```typescript
import { ServiceLocator, TaggedService } from '@riotbyte/nest-service-locator'

class GroupGreeter {
  constructor(private readonly locator: ServiceLocator) {}

  greet(greeterName: string): void {
    this.locator
      .tagged(GreeterTag)
      .find((tagged) => tagged.metadata.name === greeterName)
      ?.greet()
  }
}
```
