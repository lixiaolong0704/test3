function treeTraverser(tree) {
    var parts = [];
    var proxy = new Proxy(function () {
        let node = tree; // start the node at the root
        for (let part of parts) {
            if (!node.props || !node.props.children || node.props.children.length === 0) {
                throw new Error(`Node ${node.tagName} has no more children`);
            }
            // If the part is a child tag, drill down into that child for the next traversal step
            let index = node.props.children.findIndex((child) => child.tagName == part);
            if (index === -1) {
                throw new Error(`Cannot find child: ${part} in ${node.tagName}`);
            }
            node = node.props.children[index];
        }
        return node.props;
    }, {
        has: function () {
            return true;
        },
        get: function () {
            // parts.push(prop);
            return proxy;
        }
    });
    return proxy;
}

var myDomIsh = treeTraverser({
    tagName: 'body',
    props: {
        children: [
            {
                tagName: 'div',
                props: {
                    className: 'main',
                    children: [
                        {
                            tagName: 'span',
                            props: {
                                className: 'extra',
                                children: [
                                    {tagName: 'i', props: {textContent: 'Hello'}},
                                    {tagName: 'b', props: {textContent: 'World'}},
                                ]
                            }
                        }
                    ]
                }
            }
        ]
    }
});
// console.log(myDomIsh.div.span.i());
//
// console.log(myDomIsh.div.span.i().textContent === 'Hello');
// console.log(myDomIsh.div.span.b().textContent === 'World');
var getReply = function (msg){
    //...
    return new Promise((r)=>{

        r("abc");
    })

}

var a =    getReply();
console.log(a);