const addDemoHeaders = (req, res, next) => {
    res.set('X-Demo-Header', 'This is a demo header');
    res.set('X-Powered-By', 'Node.js & Express');
    next();
}

export { addDemoHeaders };