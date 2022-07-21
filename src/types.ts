export type AnyObject = {
	[key: PropertyKey]: any;
}

export type Options = {
	deep?: boolean | number;

	allowedKeys?: RegExp | (PropertyKey | RegExp)[];

	defaultObject?: () => AnyObject;
}
