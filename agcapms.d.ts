declare namespace huawei {
    namespace AGC {
        namespace apms {
            /**
           * APM service switch
           * @param enable enable
           */
            function enableCollection(enable: boolean): void;
            /**
             * Start custom tracking records.
             * @param name Record name
             */
            function startCustomTrace(name: String): void;
            /**
             * Stop custom tracking records.
             * @param name Record name
             */
            function stopCustomTrace(name: String): void;
            /**
             * Set custom trace record attribute name and attribute value. Each CustomTrace instance can only set up to 5 custom attributes.
             * @param name          Record name
             * @param propertyName  Custom attribute name can only be composed of Chinese, letters (not case sensitive), numbers and underscores, and the length is not more than 40 characters
             * @param propertyValue Custom attribute values can only be composed of Chinese, letters (not case sensitive), numbers, and underscores, and the length does not exceed 100 characters
             */
            function putCustomTraceProperty(name: String, propertyName: String, propertyValue: String): void;
            /**
             * Remove the existing attribute from the CustomTrace instance.
             * @param name         Record name
             * @param propertyName The name of the attribute to be removed
             */
            function removeCustomTraceProperty(name: String, propertyName: String): void;
            /**
             * Get custom attribute values.
             * @param name         Record name
             * @param propertyName Custom attribute name
             * @returns            Custom attribute value
             */
            function getCustomTraceProperty(name: String, propertyName: String): String;
            /**
             * Increase the index value of the custom tracking index. If the indicator does not exist, a new indicator will be created. If the custom tracking record is not started or stopped, the interface does not take effect.
             * @param name         Record name
             * @param measureName  The name of the custom tracking indicator to increase the value of the indicator
             * @param measureValue Increased index value
             */
            function incrementCustomTraceMeasure(name: String, measureName: String, measureValue: number): void;
            /**
             * Get custom tracking index values.
             * @param name        Record name
             * @param measureName Custom record tracking indicator name
             * @returns Custom tracking index value。
             */
            function getCustomTraceMeasure(name: String, measureName: String): String;
            /**
             * Add custom tracking metrics. If the indicator already exists, update the value of the indicator.
             * @param name         Record name
             * @param measureName  Custom record tracking metric name
             * @param measureValue Custom tracking index value
             */
            function putCustomTraceMeasure(name: String, measureName: String, measureValue: number): void;
            /**
             * Get all the attributes of the custom tracking record.
             * @param name Record name
             * @returns    Store all attribute key-value pairs
             */
            function getCustomTraceProperties(name: String): any;
            /**
             * Create a network request indicator instance for collecting network performance data.
             * @param url        Network request URL address.
             * @param httpMethod Request method, only supports GET, PUT, POST, DELETE, HEAD, PATCH, OPTIONS, TRACE or CONNECT methods.
             * @returns          Current network request id
             */
            function initNetworkMeasure(url: String, httpMethod: String): String;
            /**
             * Set the request start time.
             * @param id Network request id
             */
            function startNetworkMeasure(id: String): void;
            /**
             * Set the request end time, and report the network request indicators and custom attribute data.
             * @param id Network request id
             */
            function stopNetworkMeasure(id: String): void;
            /**
             * Set the response code of the request.
             * @param id         Network request id
             * @param statusCode Request response status code
             */
            function setNetworkMeasureStatusCode(id: String, statusCode: number): void;
            /**
             * Set the request body size.
             * @param id     Network request id
             * @param length Request body size
             */
            function setNetworkMeasureBytesSent(id: String, length: number): void;
            /**
             * Set the response body size.
             * @param id     Network request id
             * @param length Response body size
             */
            function setNetworkMeasureBytesReceived(id: String, length: number): void;
            /**
             * Set the response body contentType type.
             * @param id          Network request id
             * @param contentType Response body contentType
             */
            function setNetworkMeasureContentType(id: String, contentType: String): void;
            /**
             * Set the custom attribute name and attribute value of the network request. Each NetworkMeasure instance can only set up to 5 custom attributes.
             * @param id            Network request id
             * @param propertyName  Custom attribute names can only be composed of Chinese, letters (not case sensitive), numbers, and underscores, and the length cannot exceed 40 characters
             * @param propertyValue Custom attribute values can only be composed of Chinese, letters (not case sensitive), numbers, and underscores, and the length cannot exceed 100 characters
             */
            function putNetworkMeasureProperty(id: String, propertyName: String, propertyValue: String): void;
            /**
             * Remove the existing attribute from the NetworkMeasure instance.
             * @param id           Network request id
             * @param propertyName The name of the attribute to be removed
             */
            function removeNetworkMeasureProperty(id: String, propertyName: String): void;
            /**
             *
             * @param id           Network request id
             * @param propertyName Custom attribute name
             * @returns            Custom attribute value
             */
            function getNetworkMeasureProperty(id: String, propertyName: String): String;
            /**
             * Get all attributes from the NetworkMeasure instance.
             * @param id Network request id
             * @returns  Store all attribute key-value pairs
             */
            function getNetworkMeasureProperties(id: String): any;
        }
    }
}
