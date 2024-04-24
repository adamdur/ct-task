import { Model, ModelStatic, Optional } from 'sequelize';
import { ICache } from '../types';

interface IBaseRepository<TModel extends Model> {
  findById(id: number): Promise<TModel | null>;
  findAll(filter?: any): Promise<TModel[]>;
  create(item: Optional<TModel['_creationAttributes'], TModel['_attributes']>): Promise<TModel>;
  update(id: number, item: Partial<TModel['_attributes']>): Promise<TModel | null>;
  delete(id: number): Promise<boolean>;
}

export class BaseRepository<T extends Model> implements IBaseRepository<T> {
  private model: ModelStatic<T>;
  private cache: ICache;

  constructor(model: ModelStatic<T>, cache: ICache) {
    this.model = model;
    this.cache = cache;
  }

  protected async withCache<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    const cached = await this.cache.get<T>(key);
    if (cached) {
      return cached;
    }

    const data = await fetcher();
    if (data) {
      await this.cache.set(key, data, this.cache.ttl());
    }
    return data;
  }

  async findById(id: number): Promise<T | null> {
    return this.withCache(`model:${this.model.name}:id:${id}`, () => this.model.findByPk(id));
  }

  async findAll(filter?: any): Promise<T[]> {
    return await this.model.findAll({ where: filter });
  }

  async create(item: T['_creationAttributes']): Promise<T> {
    return await this.model.create(item);
  }

  async update(id: number, item: Partial<T['_attributes']>): Promise<T | null> {
    const cacheKey = `model:${this.model.name}:id:${id}`;
    const instance = await this.model.findByPk(id);
    if (!instance) {
      return null;
    }
    const updatedInstance = await instance.update(item);
    await this.cache.set(cacheKey, updatedInstance, this.cache.ttl()); // Update the cache with the new data
    return updatedInstance;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.model.destroy({ where: { id: id as unknown as T['_attributes']['id'] } });
    if (result > 0) {
      await this.cache.del(`model:${this.model.name}:id:${id}`);
    }
    return result > 0;
  }
}
