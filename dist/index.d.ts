declare type AnyObject = {
    [key: PropertyKey]: any;
};
declare type Options = {
    deep?: boolean | number;
    allowedKeys?: RegExp | (PropertyKey | RegExp)[] | ((key: PropertyKey, object: AnyObject) => boolean);
    defaultObject?: (key?: PropertyKey) => AnyObject;
};

declare const chainset: (object?: AnyObject, options?: Options) => AnyObject;

export { chainset as default };
