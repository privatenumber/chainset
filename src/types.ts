export type AnyObject = {
	[key: PropertyKey]: any;
}

export type Options = {
	deep?: boolean | number;

	allowedKeys?:
		RegExp
		| (PropertyKey | RegExp)[]
		| ((key: PropertyKey, object: AnyObject) => boolean);

	defaultObject?: () => AnyObject;
}
