var cache: Array<any> = [];
export default function safeStringify(key: any, value: any) {
    if (typeof value === 'object' && value !== null) {
        // Duplicate reference found, discard key
        if (cache.includes(value))
            return value._id;

        // Store value in our collection
        cache.push(value._id);
    }
    return value;
}