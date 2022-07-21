import type { AnyObject, Options } from './types';
import { disallowed } from './disallowed';

const defaultObject = () => Object.create(null);

const chainset = (
	object: AnyObject = defaultObject(),
	options: Options = {},
): AnyObject => new Proxy(object, {
	get(targetObject, keyName) {
		if (keyName in targetObject) {
			return targetObject[keyName];
		}

		if (disallowed.has(keyName)) {
			return;
		}

		const { allowedKeys } = options;
		if (allowedKeys) {
			if (typeof allowedKeys === 'function') {
				if (!allowedKeys(keyName, targetObject)) {
					return;
				}
			} else if (allowedKeys instanceof RegExp) {
				if (typeof keyName === 'string' && !allowedKeys.test(keyName)) {
					return;
				}
			} else if (Array.isArray(allowedKeys)) {
				const found = allowedKeys.find(pattern => (
					pattern instanceof RegExp
						? typeof keyName === 'string' && pattern.test(keyName)
						: keyName === pattern
				));

				if (!found) {
					return;
				}
			}
		}

		let newObject = (options.defaultObject || defaultObject)(keyName);
		const { deep = true } = options;
		if (deep) {
			const newOptions = {
				...options,
				deep: (typeof deep === 'number') ? deep - 1 : deep,
			};

			newObject = chainset(newObject, newOptions);
		}

		targetObject[keyName] = newObject;

		return newObject;
	},
});

export default chainset;
