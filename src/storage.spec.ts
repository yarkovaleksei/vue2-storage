import 'jest-localstorage-mock';
import { StorageDriver } from './types';

const Vue = require('vue');

const drivers = [
  {name: 'Local', value: StorageDriver.LOCAL},
  {name: 'Session', value: StorageDriver.SESSION},
  {name: 'Memory', value: StorageDriver.MEMORY},
];

drivers.forEach((driver) => {
  describe(`${driver.name} Storage`, () => {
    let vm;

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
        expect(prefix === 'app_').toEqual(true);
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
        expect(item.a && item.a === 1).toEqual(true);
        done();
      });

      it('Set Array', (done) => {
        const data = [1, 2];
        vm.$storage.set('test', data);
        const item = vm.$storage.get('test');
        expect(Array.isArray(item) && item.length === 2).toEqual(true);
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
        expect(item === true).toEqual(true);
        done();
      });

      it('Set Boolean [false]', (done) => {
        const data = false;
        vm.$storage.set('test', data);
        const item = vm.$storage.get('test');
        expect(item === false).toEqual(true);
        done();
      });
    });

    describe('Set item with TTL 3 seconds', () => {
      it('Set item', async (done) => {
        const data = { a: 1 };
        vm.$storage.set('test', data, { ttl: 3000 });

        await new Promise((resolve) => setTimeout(resolve, 4000));

        expect(vm.$storage.get('test') === null).toEqual(true);
        done();
      });
    });

    describe('Get item with default value', () => {
      it('Get item', (done) => {
        const value = vm.$storage.get('fallback', 'fallback');
        expect(value === 'fallback').toEqual(true);
        done();
      });
    });

    describe('Remove item by key', () => {
      it('Remove item', (done) => {
        const data = 'test';
        vm.$storage.set('test', data);
        vm.$storage.remove('test');
        const item = vm.$storage.get('test');
        expect(item === null).toEqual(true);
        done();
      });
    });

    describe('Has key', () => {
      it('Has key by name', (done) => {
        vm.$storage.set('test', 'test');
        const key = vm.$storage.has('test');
        expect(typeof key === 'boolean' && key).toEqual(true);
        done();
      });
    });

    describe('Get value by key index', () => {
      it('Get key', (done) => {
        vm.$storage.set('test', 'test');
        const value = vm.$storage.key(0);
        const test = vm.$storage.get('test');
        expect(value === test).toEqual(true);
        done();
      });
    });

    describe('Get keys', () => {
      it('Get keys array', (done) => {
        vm.$storage.set('test1', 'test1');
        vm.$storage.set('test2', 'test2');
        const keys = vm.$storage.keys();
        expect(Array.isArray(keys) && keys.length === 2).toEqual(true);
        done();
      });
    });

    describe('Get length', () => {
      it('Get keys length', (done) => {
        vm.$storage.set('test1', 'test1');
        vm.$storage.set('test2', 'test2');
        const length = vm.$storage.length;
        expect(length === 2).toEqual(true);
        done();
      });
    });

    describe('Clear storage', () => {
      it('Clear storage', (done) => {
        vm.$storage.set('test', 'test');
        vm.$storage.set('test1', [1, 2]);
        vm.$storage.set('test2', 2);
        vm.$storage.clear();
        expect(vm.$storage.get('test') === null).toEqual(true);
        expect(vm.$storage.get('test1') === null).toEqual(true);
        expect(vm.$storage.get('test2') === null).toEqual(true);
        done();
      });
    });

    describe('Remember items', () => {
      it('Retrieve from callable and set item', async (done) => {
        const returned = await vm.$storage.remember('test', async () => {
          return 'success';
        });
        expect(vm.$storage.get('test') === 'success').toEqual(true);
        expect(returned === 'success').toEqual(true);
        done();
      });
    });

    describe('Pull items', () => {
      it('Retrieve item and make sure it gets removed', (done) => {
        vm.$storage.set('test', 'test');
        const returned = vm.$storage.pull('test');
        expect(returned === 'test').toEqual(true);
        expect(vm.$storage.get('test', null) === null).toEqual(true);
        done();
      });

      it('Try to fetch inexistent item and check fallback', (done) => {
        const returned = vm.$storage.pull('nonexistent', 'fallback');
        expect(returned === 'fallback').toEqual(true);
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
          expect(error.name === 'StorageError').toEqual(true);
          expect(error.message === '__NAME__[__VERSION__]: Remember error').toEqual(true);
        }
        done();
      });
    });
  });
});
