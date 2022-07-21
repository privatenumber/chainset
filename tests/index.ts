import { describe, expect } from 'manten';
import chainset from '#chainset';

describe('chainset', ({ test, describe }) => {
	test('chainable set', async () => {
		const object = chainset();
		expect(object).toEqual({});

		object.a.b.c.d = 1;
		expect(object).toEqual({
			a: { b: { c: { d: 1 } } },
		});
	});

	test('chain with symbol', async () => {
		const object = chainset();
		const a = Symbol('a');
		const b = Symbol('b');
		const c = Symbol('c');
		const d = Symbol('d');
		object[a][b][c][d] = 1;

		expect(object).toEqual({
			[a]: { [b]: { [c]: { [d]: 1 } } },
		});
	});

	test('JSON.stringify', async () => {
		const object = chainset({ helloworld: 1 });
		expect(JSON.stringify(object)).toBe('{"helloworld":1}');
	});

	describe('deep', ({ test }) => {
		test('deep = false', async () => {
			const object = chainset({ a: 1 }, { deep: false });

			expect(() => {
				object.aa.b.c = 1;
			}).toThrow('Cannot set properties of undefined (setting \'c\')');
		});

		test('deep = 3', async () => {
			const object = chainset({}, { deep: 2 });
			object.a.b.c = 1;
			expect(() => {
				object.aa.b.c.d.e = 1;
			}).toThrow('Cannot set properties of undefined (setting \'e\')');
		});
	});

	describe('defaultObject', ({ test }) => {
		test('use null prototype', () => {
			const objectNullPrototype = chainset();

			expect('hasOwnProperty' in objectNullPrototype).toBe(false);

			objectNullPrototype.a.b = 2;

			expect('hasOwnProperty' in objectNullPrototype.a).toBe(false);

			const objectNormal = chainset({}, {
				defaultObject: () => ({}),
			});

			objectNormal.a.b = 2;

			expect('hasOwnProperty' in objectNormal.a).toBe(true);
		});

		test('conditional by path', () => {
			const object = chainset({}, {
				defaultObject: (key) => {
					// eslint-disable-next-line @typescript-eslint/no-empty-function
					function constructor() {}
					Object.defineProperty(constructor, 'name', { value: key });

					// @ts-expect-error fake constructor
					return new constructor();
				},
			});

			expect(object.a.constructor.name).toBe('a');
			expect(object.a.b.constructor.name).toBe('b');
		});
	});

	describe('allowedKeys', ({ test }) => {
		test('regex', () => {
			const object = chainset({}, {
				allowedKeys: /^prefix/,
			});

			object.prefixA.b = 1;

			expect(object).toEqual({
				prefixA: { b: 1 },
			});

			expect(() => {
				object.b.c = 1;
			}).toThrow('Cannot set properties of undefined (setting \'c\')');
		});

		test('array', () => {
			const object = chainset({}, {
				allowedKeys: [/^prefix/, /Suffix$/, 'specific'],
			});

			object.prefixA.b = 1;
			object.aSuffix.b = 1;
			object.specific.specific.b = 1;

			expect(object).toEqual({
				prefixA: { b: 1 },
				aSuffix: { b: 1 },
				specific: {
					specific: { b: 1 },
				},
			});

			expect(() => {
				object.b.c = 1;
			}).toThrow('Cannot set properties of undefined (setting \'c\')');
		});

		test('function', () => {
			const object = chainset({}, {
				allowedKeys: key => key === 'specific',
			});

			object.specific.specific.b = 1;

			expect(object).toEqual({
				specific: {
					specific: { b: 1 },
				},
			});
			expect(() => {
				object.b.c = 1;
			}).toThrow('Cannot set properties of undefined (setting \'c\')');
		});
	});
});
