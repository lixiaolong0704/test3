const InspectorProxy = require('inspector-proxy');
const cfork = require('cfork');
const proxy = new InspectorProxy({ port: 9229 });

// use cfork to inspect file
cfork({
    exec: "bin/www",
    execArgv: [ '--inspect' ],
    count: 1,
    refork: true,
}).on('fork', worker => {
    let port;
    // match debug port from argv
    worker.process.spawnargs
        .some(arg => {
            let matches;
            // node-6: --inspect=9888
            // node-8: --inspect-port=9888
            if (arg.startsWith('--inspect') && (matches = arg.match(/\d+/))) {
                port = matches[0];
                return true;
            }
            return false;
        });

    proxy.start({ debugPort: port })
        .then(() => {
            console.log(`\nproxy url: ${proxy.url}\n`);
        });
});
