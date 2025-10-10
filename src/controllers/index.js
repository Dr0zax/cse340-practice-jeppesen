const homePage = (req, res) => {
    const title = "Welcome!";
    res.render('home', { title });
};

const aboutPage = (req, res) => {
    const title = "About Me";
    res.render('about', { title });
};

const demoPage = (req, res) => {
    res.render('demo', { title: "Middleware Demo Page" });
};

const testErrorPage = (req, res, next) => {
    const err = new Error("This is a test error");
    err.status = 500;
    next(err);
}

export { homePage, aboutPage, demoPage, testErrorPage };