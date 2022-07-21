import type { AnyObject, Options } from './types';
import { disallowed } from './disallowed';

const defaultObject = () => Object.create(null);

const chainset = (
	object: AnyObject = defaultObject(),
	options: Options = {},
): AnyObject => new Proxy(object, {
	get(target, prop) {
		if (prop in target) {
			return target[prop];
		}

		if (disallowed.has(prop)) {
			return;
		}

		const { allowedKeys } = options;
		if (allowedKeys) {
			if (allowedKeys instanceof RegExp) {
				if (typeof prop === 'string' && !allowedKeys.test(prop)) {
					return;
				}
			} else if (Array.isArray(allowedKeys)) {
				const found = allowedKeys.find(pattern => (
					pattern instanceof RegExp
						? typeof prop === 'string' && pattern.test(prop)
						: prop === pattern
				));

				if (!found) {
					return;
				}
			}
		}

		let newObject = (options.defaultObject || defaultObject)();
		const { deep = true } = options;
		if (deep) {
			const newOptions = {
				...options,
				deep: (typeof deep === 'number') ? deep - 1 : deep,
			};

			newObject = chainset(newObject, newOptions);
		}

		target[prop] = newObject;

		return newObject;
	},
});

export default chainset;
