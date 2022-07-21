export const disallowed = new Set([
	// primitives
	'toString',
	'valueOf',
	'name',
	'constructor',

	// Symbols
	Symbol.iterator,
	Symbol.asyncIterator,
	Symbol.toStringTag,
	Symbol.toPrimitive,

	// JSON.stringify
	'toJSON',

	// DOM
	'nodeType',
	'tagName',
	'hasAttribute',

	// jest serializer
	'asymmetricMatch',

	// immutable
	'$$typeof',
	'@@__IMMUTABLE_RECORD__@@',
	'@@__IMMUTABLE_ITERABLE__@@',
]);
