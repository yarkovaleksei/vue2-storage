import 'jest-localstorage-mock';
import Vue2Storage from '.';
import { StorageDriver } from './storage';
import { sleep } from '../test/utils';

const drivers = [
  {name: 'Local', value: StorageDriver.LOCAL},
  {name: 'Session', value: StorageDriver.SESSION},
  {name: 'Memory', value: StorageDriver.MEMORY},
];

drivers.forEach((driver) => {
  describe(`${driver.name} Storage [vanilla]`, () => {
    let storage: Vue2Storage;

    beforeEach(() => {
      storage = new Vue2Storage();
      storage.setOptions({
        prefix: 'app_',
        driver: driver.value,
      });
      storage.clear(true);
    });

    describe('Prefix', () => {
      it('Accept prefix', (done) => {
        const prefix = storage.prefix;
        expect(prefix).toEqual('app_');
        done();
      });
    });

    describe('Set item', () => {
      beforeEach(() => {
        storage.clear(true);
      });

      it('Set Object', (done) => {
        const data = { a: 1 };
        storage.set('test', data);
        const item = storage.get('test');
        expect(item.a).toEqual(1);
        done();
      });

      it('Set Array', (done) => {
        const data = [1, 2];
        storage.set('test', data);
        const item = storage.get('test');
        expect(Array.isArray(item)).toEqual(true);
        expect(item.length).toEqual(2);
        done();
      });

      it('Set String', (done) => {
        const data = 'test';
        storage.set('test', data);
        const item = storage.get('test');
        expect(typeof item === 'string').toEqual(true);
        done();
      });

      it('Set Number', (done) => {
        const data = 1;
        storage.set('test', data);
        const item = storage.get('test');
        expect(typeof item === 'number').toEqual(true);
        done();
      });

      it('Set Boolean [true]', (done) => {
        const data = true;
        storage.set('test', data);
        const item = storage.get('test');
        expect(item).toEqual(true);
        done();
      });

      it('Set Boolean [false]', (done) => {
        const data = false;
        storage.set('test', data);
        const item = storage.get('test');
        expect(item).toEqual(false);
        done();
      });
    });

    describe('Set item with TTL 3 seconds', () => {
      it('Set item', async (done) => {
        const data = { a: 1 };
        storage.set('test', data, { ttl: 1000 });
        await sleep(2);
        expect(storage.get('test')).toEqual(null);
        done();
      });
    });

    describe('Get item with default value', () => {
      it('Get item', (done) => {
        const value = storage.get('fallback', 'fallback');
        expect(value).toEqual('fallback');
        done();
      });
    });

    describe('Remove item by key', () => {
      it('Remove item', (done) => {
        const data = 'test';
        storage.set('test', data);
        storage.remove('test');
        const item = storage.get('test');
        expect(item).toEqual(null);
        done();
      });
    });

    describe('Has key', () => {
      it('Has key by name', (done) => {
        storage.set('test', 'test');
        const key = storage.has('test');
        expect(key).toEqual(true);
        done();
      });

      it('Has key by name with considering logic', async (done) => {
        storage.set('test', 'test', { ttl: 1000 });
        await sleep(2);
        const key = storage.has('test');
        expect(key).toEqual(false);
        done();
      });
    });

    describe('Get value by key index', () => {
      it('Get key', (done) => {
        storage.set('test', 'test');
        const value = storage.key(0);
        const test = storage.get('test');
        expect(value).toEqual(test);
        done();
      });
    });

    describe('Get value by keys element', () => {
      it('Get key', (done) => {
        storage.set('key', 'value');
        const keys = storage.keys();
        const value = storage.get(keys[0]);
        expect(value).toEqual('value');
        done();
      });
    });

    describe('Get keys', () => {
      it('Get keys array', (done) => {
        storage.set('test1', 'test1');
        storage.set('test2', 'test2');
        const keys = storage.keys();
        expect(Array.isArray(keys) && keys.length).toEqual(2);
        done();
      });

      it('Get keys array considering ttl', async (done) => {
        storage.set('test1', 'test1', { ttl: 1000 });
        await sleep(2);
        const keys = storage.keys();
        expect(Array.isArray(keys) && keys.length).toEqual(0);
        done();
      });
    });

    describe('Get length', () => {
      it('Get keys length', (done) => {
        storage.set('test1', 'test1');
        storage.set('test2', 'test2');
        expect(storage.length).toEqual(2);
        done();
      });

      it('Get keys length with considering logic', async (done) => {
        storage.set('test1', 'test1', { ttl: 1000 });
        await sleep(2);
        expect(storage.length).toEqual(0);
        done();
      });
    });

    describe('Clear storage', () => {
      it('Clear storage', (done) => {
        storage.set('test', 'test');
        storage.set('test1', [1, 2]);
        storage.set('test2', 2);
        storage.clear();
        expect(storage.get('test')).toEqual(null);
        expect(storage.get('test1')).toEqual(null);
        expect(storage.get('test2')).toEqual(null);
        done();
      });
    });

    describe('Remember items', () => {
      it('Retrieve from callable and set item', async (done) => {
        const returned = await storage.remember<string>('test', async () => 'success');
        expect(storage.get('test')).toEqual('success');
        expect(returned).toEqual('success');
        done();
      });
    });

    describe('Pull items', () => {
      it('Retrieve item and make sure it gets removed', (done) => {
        storage.set('test', 'test');
        const returned = storage.pull('test');
        expect(returned).toEqual('test');
        expect(storage.get('test', null)).toEqual(null);
        done();
      });

      it('Try to fetch inexistent item and check fallback', (done) => {
        const returned = storage.pull('nonexistent', 'fallback');
        expect(returned).toEqual('fallback');
        done();
      });
    });

    describe('Error', () => {
      it('Remember error', async (done) => {
        try {
          await storage.remember('test', async () => {
            throw new Error('Remember error');
          });
        } catch (error) {
          expect(error.name).toEqual('StorageError');
          expect(error.message).toEqual('__NAME__[__VERSION__]: Remember error');
        }
        done();
      });
    });

    describe('Replacer', () => {
      beforeEach(() => {
        storage.clear(true);
      });

      it('Not transform data by default', (done) => {
        storage.set('test', 'test');
        expect(storage.get('test')).toEqual('test');
        done();
      });

      describe('If replacer is function', () => {
        it('Transform data if set "object"', (done) => {
          storage.setOptions({
            replacer: (_key: string, value: any) => ({ ...value, b: 2 }),
          });
          storage.set('key', { a: 1 });
          expect(storage.get('key')).toEqual({ a: 1, b: 2 });
          done();
        });

        it('Transform data if set "array"', (done) => {
          storage.setOptions({
            replacer: (_key: string, value: number[]): number[] => value.map((v: number) => v + 1),
          });
          storage.set('key', [1, 2, 3]);
          expect(storage.get('key')).toEqual([2, 3, 4]);
          done();
        });

        it('Transform data if set "string"', (done) => {
          storage.setOptions({
            replacer: (_key: string, value: string) => String(value).repeat(2),
          });
          storage.set('key', 'repeat');
          expect(storage.get('key')).toEqual('repeatrepeat');
          done();
        });

        it('Transform data if set "number"', (done) => {
          storage.setOptions({
            replacer: (_key: string, value: number) => value * 2,
          });
          storage.set('key', 2);
          expect(storage.get('key')).toEqual(4);
          done();
        });

        it('Transform data if set "boolean"', (done) => {
          storage.setOptions({
            replacer: (_key: string, value: boolean) => !value,
          });
          storage.set('key', true);
          expect(storage.get('key')).toEqual(false);
          done();
        });
      });
    });
  });
});
