import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Injectable, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager'
import { HttpService } from '@nestjs/axios';
import TokenDto from '../dto/token.dto';

@Injectable()
export class RedisService {
  constructor(
        //private readonly httpService: HttpService,
        @Inject(CACHE_MANAGER) private cacheManager : Cache
  ) {}

    async getRefresh() {
        const value = await this.cacheManager.get('key');
      return value
    }

    async getCode(code : string) {
      console.log('Service - code -- ',code)
      const value : TokenDto = await this.cacheManager.get(code);
      console.log('value -- value', value)
      return value 
  }

    async setRefresh(key : string, value : string) {
        await this.cacheManager.set(key,value)
    }

    async setCode(key : string, value : any) {
        await this.cacheManager.set(key,value)
        const result = await this.cacheManager.get(key)
        console.log(result, '--setCode')
    }
    
  
}
