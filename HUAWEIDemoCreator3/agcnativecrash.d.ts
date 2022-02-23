declare namespace agcnativecrash {
    /**
    * @en
    * This method is used to trigger a native crash for testing an app. This method can be used to test the Crash service of your app during debugging. Do not use it in any formally released app.
    * @zh
    * 此方法用于创造测试用的原生崩溃。仅供开发者在测试崩溃实现时使用，**正式发布的应用中请勿使用**。
    * @example
    * ```
    * agcnativecrash.crashTest();
    * ```
    */
    export function crashTest(): void;
}
