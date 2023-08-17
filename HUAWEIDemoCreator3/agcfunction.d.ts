declare const cc: any;
declare const JavascriptJavaBridge: any;
declare namespace huawei {
    namespace agc {
        namespace func {
            /**
             * @en Refer to https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/TimeUnit.html
             * @zh 参考 https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/TimeUnit.html
             */
            enum TimeUnit {
                NANOSECONDS = 1,
                MICROSECONDS = 2,
                MILLISECONDS = 3,
                SECONDS = 4,
                MINUTES = 5,
                HOURS = 6,
                DAYS = 7
            }
            /**
             * @en Function result callback.
             * @zh 函数结果回调函数。
             */
            interface FunctionCallback {
                (err: any, data: any): void;
            }
            /**
             * @en Calls a cloud function that has been set or sets a timeout interval for it.
             * @zh 设置需要调用的云函数后，可以通过此类的方法调用云函数或设置超时时间。
             */
            class AGCFunctionCallable {
                private funcId;
                /**
                 * @internal
                 */
                constructor(funcId: string);
                /**
                 * @en Sets a timeout interval of a function.
                 * @zh 设置函数执行的超时时间。
                 * @param timeout  Timeout interval of a function. The unit is defined by the units parameter.
                 * @param timeUnit TimeUnit object defining the time unit.
                 * @returns Returns a AGCFunctionCallable instance that can be used to call a function.
                 */
                setTimeout(timeout: number, timeUnit?: TimeUnit): AGCFunctionCallable;
                /**
                 * @en Obtains the timeout interval of a function.
                 * @zh 获取函数执行的超时时间。
                 * @returns Returns the timeout interval of a function. You can customize the unit of the timeout interval.
                 */
                getTimeout(): number;
                /**
                 * @en Calls a function.
                 * @zh 调用函数。
                 * @param cb    Callback of function
                 * @param param Custom object that contains input parameter values of the function, which can be of Object type.
                 *              The sequence of the input parameter values contained in the object must be the same as that of the input parameters set during cloud function creation.
                 */
                call(cb: FunctionCallback, param?: any): void;
            }
            class AGCFunctionService {
                private funcCallbackMap;
                /**
                 * @internal
                 */
                putCallback(funcId: string, cb: FunctionCallback): void;
                /**
                 * @en Sets the cloud function to be called using the NOPATHHTTP trigger identifier of the function.
                 * @zh 通过函数的NOPATHHTTP触发器的URL设置调用哪个云函数。
                 * @param trigger NOPATHHTTP trigger identifier of the cloud function to be called. For details about how to query the NOPATHHTTP trigger identifier.
                 * @returns Returns a AGCFunctionCallable instance that can be used to call a function.
                 */
                wrap(trigger: string): AGCFunctionCallable;
                /**
                 * @internal
                 */
                onFunctionResult(funcId: string, result: string, err: string): void;
            }
            const funcService: AGCFunctionService;
        }
    }
}
