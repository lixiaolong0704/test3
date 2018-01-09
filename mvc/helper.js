var reflectMetadata = require("reflect-metadata")
const PREFIX = '$$route_'

function destruct(args) {


    const hasPath = typeof args[0] === 'string'
    const path = hasPath ? args[0] : ''
    const middleware = hasPath ? args.slice(1) : args

    if (middleware.some(m => typeof m !== 'function')) {
        throw new Error('Middleware must be function')
    }

    return [path, middleware]
}

// @route(method, path: optional, ...middleware: optional)
export function route(method, ...args) {
    if (typeof method !== 'string') {
        throw new Error('The first argument must be an HTTP method')
    }

    const [path, middleware] = destruct(args)

    return function (target, name) {
        // target[`${PREFIX}${name}`] = {method, path, middleware}
        Reflect.defineMetadata(`${PREFIX}${name}`, {method, path, middleware}, target, name);
    }
}

// @[method](...args) === @route(method, ...args)
const methods = ['head', 'options', 'get', 'post', 'put', 'patch', 'del', 'delete', 'all']
methods.forEach(method => exports[method] = route.bind(null, method))


//
// exports.test=function () {
//
// }

// @controller(path: optional, ...middleware: optional)
export function controller(...args) {
    const [ctrlPath, ctrlMiddleware] = destruct(args)

    return function (target) {
        const proto = target.prototype
        proto.$routes = Object.getOwnPropertyNames(proto)
            .filter(prop => prop.indexOf(PREFIX) === 0)
            .map(prop => {
                const {method, path, middleware: actionMiddleware} = proto[prop]
                const url = `${ctrlPath}${path}`
                const middleware = ctrlMiddleware.concat(actionMiddleware)
                const fnName = prop.substring(PREFIX.length)
                return {method: method === 'del' ? 'delete' : method, url, middleware, fnName}
            })
    }
}


// export function method(m) {

// return function(target, name, descriptor) {
//
//     // obtain the original function
//     let fn = descriptor.value;
//
//     // create a new function that sandwiches
//     // the call to our original function between
//     // two logging statements
//
//     // let newFn  = function() {
//     //     console.log(startMsg, name);
//     //     fn.apply(target, arguments);
//     //     console.log(endMsg, name);
//     // };
//
//     // we then overwrite the origin descriptor value
//     // and return the new descriptor
//     // descriptor.value = newFn;
//     return descriptor;
// }
// }