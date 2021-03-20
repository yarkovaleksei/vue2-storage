import 'jest-localstorage-mock';
import Vue from 'vue';
import { StorageDriver } from './types';
import { sleep } from '../test/utils';

const drivers = [
  {name: 'Local', value: StorageDriver.LOCAL},
  {name: 'Session', value: StorageDriver.SESSION},
  {name: 'Memory', value: StorageDriver.MEMORY},
];

drivers.forEach((driver) => {
  describe(`${driver.name} Storage [vue plugin]`, () => {
    let vm: Vue;

    beforeEach(() => {
      vm = new Vue();
      vm.$storage.setOptions({
        prefix: 'app_',
        driver: driver.value,
      });
      vm.$storage.clear(true);
    });

    describe('Prefix', () => {
      it('Accept prefix', (done) => {
        const prefix = vm.$storage.prefix;
        expect(prefix).toEqual('app_');
        done();
      });
    });

    describe('Set item', () => {
      beforeEach(() => {
        vm.$storage.clear(true);
      });

      it('Set Object', (done) => {
        const data = { a: 1 };
        vm.$storage.set('test', data);
        const item = vm.$storage.get('test');
        expect(item.a).toEqual(1);
        done();
      });

      it('Set Array', (done) => {
        const data = [1, 2];
        vm.$storage.set('test', data);
        const item = vm.$storage.get('test');
        expect(Array.isArray(item)).toEqual(true);
        expect(item.length).toEqual(2);
        done();
      });

      it('Set String', (done) => {
        const data = 'test';
        vm.$storage.set('test', data);
        const item = vm.$storage.get('test');
        expect(typeof item === 'string').toEqual(true);
        done();
      });

      it('Set Number', (done) => {
        const data = 1;
        vm.$storage.set('test', data);
        const item = vm.$storage.get('test');
        expect(typeof item === 'number').toEqual(true);
        done();
      });

      it('Set Boolean [true]', (done) => {
        const data = true;
        vm.$storage.set('test', data);
        const item = vm.$storage.get('test');
        expect(item).toEqual(true);
        done();
      });

      it('Set Boolean [false]', (done) => {
        const data = false;
        vm.$storage.set('test', data);
        const item = vm.$storage.get('test');
        expect(item).toEqual(false);
        done();
      });
    });

    describe('Set item with TTL 3 seconds', () => {
      it('Set item', async (done) => {
        const data = { a: 1 };
        vm.$storage.set('test', data, { ttl: 1000 });
        await sleep(2);
        expect(vm.$storage.get('test')).toEqual(null);
        done();
      });
    });

    describe('Get item with default value', () => {
      it('Get item', (done) => {
        const value = vm.$storage.get('fallback', 'fallback');
        expect(value).toEqual('fallback');
        done();
      });
    });

    describe('Remove item by key', () => {
      it('Remove item', (done) => {
        const data = 'test';
        vm.$storage.set('test', data);
        vm.$storage.remove('test');
        const item = vm.$storage.get('test');
        expect(item).toEqual(null);
        done();
      });
    });

    describe('Has key', () => {
      it('Has key by name', (done) => {
        vm.$storage.set('test', 'test');
        const key = vm.$storage.has('test');
        expect(key).toEqual(true);
        done();
      });

      it('Has key by name with considering logic', async (done) => {
        vm.$storage.set('test', 'test', { ttl: 1000 });
        await sleep(2);
        const key = vm.$storage.has('test');
        expect(key).toEqual(false);
        done();
      });
    });

    describe('Get value by key index', () => {
      it('Get key', (done) => {
        vm.$storage.set('test', 'test');
        const value = vm.$storage.key(0);
        const test = vm.$storage.get('test');
        expect(value).toEqual(test);
        done();
      });
    });

    describe('Get keys', () => {
      it('Get keys array', (done) => {
        vm.$storage.set('test1', 'test1');
        vm.$storage.set('test2', 'test2');
        const keys = vm.$storage.keys();
        expect(Array.isArray(keys) && keys.length).toEqual(2);
        done();
      });

      it('Get keys array with considering logic', async (done) => {
        vm.$storage.set('test1', 'test1', { ttl: 1000 });
        await sleep(2);
        const keys = vm.$storage.keys();
        expect(Array.isArray(keys) && keys.length).toEqual(0);
        done();
      });
    });

    describe('Get length', () => {
      it('Get keys length', (done) => {
        vm.$storage.set('test1', 'test1');
        vm.$storage.set('test2', 'test2');
        expect(vm.$storage.length).toEqual(2);
        done();
      });

      it('Get keys length with considering logic', async (done) => {
        vm.$storage.set('test1', 'test1', { ttl: 1000 });
        await sleep(2);
        expect(vm.$storage.length).toEqual(0);
        done();
      });
    });

    describe('Clear storage', () => {
      it('Clear storage', (done) => {
        vm.$storage.set('test', 'test');
        vm.$storage.set('test1', [1, 2]);
        vm.$storage.set('test2', 2);
        vm.$storage.clear();
        expect(vm.$storage.get('test')).toEqual(null);
        expect(vm.$storage.get('test1')).toEqual(null);
        expect(vm.$storage.get('test2')).toEqual(null);
        done();
      });
    });

    describe('Remember items', () => {
      it('Retrieve from callable and set item', async (done) => {
        const returned = await vm.$storage.remember('test', async () => {
          return 'success';
        });
        expect(vm.$storage.get('test')).toEqual('success');
        expect(returned).toEqual('success');
        done();
      });
    });

    describe('Pull items', () => {
      it('Retrieve item and make sure it gets removed', (done) => {
        vm.$storage.set('test', 'test');
        const returned = vm.$storage.pull('test');
        expect(returned).toEqual('test');
        expect(vm.$storage.get('test', null)).toEqual(null);
        done();
      });

      it('Try to fetch inexistent item and check fallback', (done) => {
        const returned = vm.$storage.pull('nonexistent', 'fallback');
        expect(returned).toEqual('fallback');
        done();
      });
    });

    describe('Error', () => {
      it('Remember error', async (done) => {
        try {
          await vm.$storage.remember('test', async () => {
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
        vm.$storage.clear(true);
      });

      it('Not transform data by default', (done) => {
        vm.$storage.set('test', 'test');
        expect(vm.$storage.get('test')).toEqual('test');
        done();
      });

      describe('If replacer is function', () => {
        it('Transform data if set "object"', (done) => {
          vm.$storage.setOptions({
            replacer: (_key: string, value: any) => ({ ...value, b: 2 }),
          });
          vm.$storage.set('key', { a: 1 });
          expect(vm.$storage.get('key')).toEqual({ a: 1, b: 2 });
          done();
        });

        it('Transform data if set "array"', (done) => {
          vm.$storage.setOptions({
            replacer: (_key: string, value: number[]): number[] => value.map((v: number) => v + 1),
          });
          vm.$storage.set('key', [1, 2, 3]);
          expect(vm.$storage.get('key')).toEqual([2, 3, 4]);
          done();
        });

        it('Transform data if set "string"', (done) => {
          vm.$storage.setOptions({
            replacer: (_key: string, value: string) => String(value).repeat(2),
          });
          vm.$storage.set('key', 'repeat');
          expect(vm.$storage.get('key')).toEqual('repeatrepeat');
          done();
        });

        it('Transform data if set "number"', (done) => {
          vm.$storage.setOptions({
            replacer: (_key: string, value: number) => value * 2,
          });
          vm.$storage.set('key', 2);
          expect(vm.$storage.get('key')).toEqual(4);
          done();
        });

        it('Transform data if set "boolean"', (done) => {
          vm.$storage.setOptions({
            replacer: (_key: string, value: boolean) => !value,
          });
          vm.$storage.set('key', true);
          expect(vm.$storage.get('key')).toEqual(false);
          done();
        });
      });
    });
  });
});
