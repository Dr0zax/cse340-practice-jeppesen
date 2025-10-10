const getCurrentGreeting = () => {
    const currentHour = new Date().getHours();

    if (currentHour <= 12) { return "Good Morning!" } // Before Noon
    else if (currentHour >= 17) { return "Good Evening!" } // Evening
    else { return "Good Afternoon!" } // Afternoon
}

const addImportantLocalVariables = (req, res, next) => {
    res.locals.currentYear = new Date().getFullYear();

    res.locals.NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';

    let params = req.query;
    res.locals.queryParams = {...params};

    next();
}

const addAdditionalVariables = (req, res, next) => {
    res.locals.greeting = getCurrentGreeting();

    const themes = ['light-blue-theme', 'purple-theme', "green-theme"];

    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    res.locals.bodyClass = randomTheme;

    next();
}

export { addImportantLocalVariables, addAdditionalVariables };
