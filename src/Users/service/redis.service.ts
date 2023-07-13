// import { ClusterService,InjectCluster, DEFAULT_CLUSTER_NAMESPACE } from '@liaoliaots/nestjs-redis';
// import { Injectable } from '@nestjs/common';
// import { Cluster } from 'ioredis';

// @Injectable()
// export class RedisService {
//     private readonly defaultClusterClient: Cluster
//   constructor(
//         private readonly clusterService: ClusterService
//   ) {
//     this.defaultClusterClient = this.clusterService.getClient()
//   }

//   async ping(): Promise<string> {
//      // ioredis 에서 사용하듯이 사용하면 된다 !
//      return await this.defaultClusterClient.ping()
//    }
// }
