import { GoogleInfos } from '@golf-planning/api-interfaces';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Db, MongoClient } from 'mongodb';
import { PushSubscription } from 'web-push';

@Injectable()
export class DbService {
  readonly logger = new Logger(DbService.name);

  private mongoDb: Db;

  constructor(private _configService: ConfigService) {
    // this.logger.debug("DbService");

    this._getMongoDb();
  }

  private _getMongoDb(): Db {
    if (!this.mongoDb) {
      const uri = this._configService.get('MONGO_URL');
      this.mongoDb = new MongoClient(uri).db();
      this.logger.debug(`Connected to Mongo`);
    }

    return this.mongoDb;
  }

  async getGoogleTokens(): Promise<{ [user_name: string]: GoogleInfos }> {
    // this.logger.debug("getGoogleTokens");

    const all = this._getMongoDb().collection('tokens').find({});

    const ret: { [user_name: string]: GoogleInfos } = {};
    for await (const info of all) {
      ret[info.userName] = info.googleInfos;
    }

    return Promise.resolve(ret);
  }
  async setGoogleTokens(users: { [user_name: string]: GoogleInfos }): Promise<void> {
    // this.logger.debug("setGoogleTokens");

    Object.entries(users).forEach(async ([userName, googleInfos]) => {
      const query = { userName: userName };
      const update = { $set: { userName: userName, googleInfos: googleInfos } };
      const options = { upsert: true };
      await this._getMongoDb().collection('tokens').updateOne(query, update, options);
      // this.logger.debug(`User updated : ${userName}`);
    });

    const all = await this.getGoogleTokens();
    Object.keys(all).forEach(async (userName) => {
      if (!users[userName]) {
        const query = { userName: userName };
        await this._getMongoDb().collection('tokens').deleteOne(query);
        // this.logger.debug(`User deleted : ${userName}`);
      }
    });

    return Promise.resolve();
    // throw new Error('Method not implemented.');
  }

  pushSubscription(sub: PushSubscription) {
    const query = { endpoint: sub.endpoint };
    const update = { $set: sub };
    const options = { upsert: true };

    return this._getMongoDb().collection('push-subscription').updateOne(query, update, options);
  }
  getSubscriptions(): Promise<PushSubscription[]> {
    return this._getMongoDb().collection<PushSubscription>('push-subscription').find({}).toArray();
  }
  deleteSubscription(sub: PushSubscription) {
    const query = { endpoint: sub.endpoint };
    return this._getMongoDb().collection<PushSubscription>('push-subscription').deleteOne(query);
  }
}
