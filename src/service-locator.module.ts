import { Module } from '@nestjs/common'
import { DiscoveryModule } from '@nestjs/core'
import { ServiceLocator } from './service.locator'

@Module({
  imports: [DiscoveryModule],
  providers: [ServiceLocator],
  exports: [ServiceLocator],
})
export class ServiceLocatorModule {}
