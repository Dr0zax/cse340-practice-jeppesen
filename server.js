import {fileURLToPath} from 'url';
import path from 'path';
import express from 'express';

// Course data - place this after imports, before routes
const courses = {
    'CS121': {
        id: 'CS121',
        title: 'Introduction to Programming',
        description: 'Learn programming fundamentals using JavaScript and basic web development concepts.',
        credits: 3,
        sections: [
            { time: '9:00 AM', room: 'STC 392', professor: 'Brother Jack' },
            { time: '2:00 PM', room: 'STC 394', professor: 'Sister Enkey' },
            { time: '11:00 AM', room: 'STC 390', professor: 'Brother Keers' }
        ]
    },
    'MATH110': {
        id: 'MATH110',
        title: 'College Algebra',
        description: 'Fundamental algebraic concepts including functions, graphing, and problem solving.',
        credits: 4,
        sections: [
            { time: '8:00 AM', room: 'MC 301', professor: 'Sister Anderson' },
            { time: '1:00 PM', room: 'MC 305', professor: 'Brother Miller' },
            { time: '3:00 PM', room: 'MC 307', professor: 'Brother Thompson' }
        ]
    },
    'ENG101': {
        id: 'ENG101',
        title: 'Academic Writing',
        description: 'Develop writing skills for academic and professional communication.',
        credits: 3,
        sections: [
            { time: '10:00 AM', room: 'GEB 201', professor: 'Sister Anderson' },
            { time: '12:00 PM', room: 'GEB 205', professor: 'Brother Davis' },
            { time: '4:00 PM', room: 'GEB 203', professor: 'Sister Enkey' }
        ]
    }
};

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "production";

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    res.locals.NODE_ENV = NODE_ENV.toLowerCase() || 'production';
    next();
});

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use((req, res, next) => {
    res.locals.currentYear = new Date().getFullYear();
    next();
});

app.use((req, res, next) => {
    const currentHour = new Date().getHours();

    if (currentHour <= 12) { res.locals.greeting = "Good Morning!" } // Before Noon
    else if (currentHour >= 17) { res.locals.greeting = "Good Evening!" } // Evening
    else { res.locals.greeting = "Good Afternoon!" } // Afternoon

    next();
});

app.use((req, res, next) => {
    const themes = ['light-blue-theme', 'purple-theme', "green-theme"];

    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    console.log(randomTheme);
    
    res.locals.bodyClass = randomTheme;
    next();
});

app.use((req, res, next) => {
    let params = req.query;
    res.locals.queryParams = params;
    next();
});

const addDemoHeader = (req, res, next) => {
    res.set('X-Demo-Header', true);
    res.set('X-Middleware-Demo', "This request passed through the middleware");
    next();
};

app.get('/', (req, res) => {
    const title = "Welcome!";
    res.render('home', { title });
})

app.get('/about', (req, res) => {
    const title = "About Me";
    res.render('about', { title });
})

app.get('/catalog', (req, res) => {
    res.render('catalog', { title: "Course Catalog", courses: courses });
});

app.get('/demo', (req, res) => {
    res.render('demo', { title: "Middleware Demo Page" });
})

app.get('/catalog/:courseId', (req, res, next) => {
    const courseId = req.params.courseId;
    const course = courses[courseId];

    if (!course) {
        const err = new Error(`Course ${courseId} not found`);
        err.status = 404;
        return next(err);
    }

    const sortBy = req.query.sort || 'time';
    let sortedSections = [...course.sections];

    switch (sortBy) {
        case 'professor':
            sortedSections.sort((a, b) => a.professor.localeCompare(b.professor));
            break;
        case 'room':
            sortedSections.sort((a, b) => a.room.localeCompare(b.room));
            break;
        case 'time':
            break;
        default:
            break;
    }

    console.log(`Viewing course: ${courseId}`);

    res.render('course-detail', {
        title: `${courseId} - ${course.title}`,
        course: {...course, sections: sortedSections},
        currentSort: sortBy
    })
    

});

app.get('/test-error', (req, res, next) => {
    const err = new Error("This is a test error");
    err.status = 500;
    next(err);
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

app.use((req, res, next) => {
    const error = new Error("Page Not Found");
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    console.error("Error occurred: ", err.message);
    console.error("Stack Trace: ", err.stack);

    const status = err.status || 500;
    const template = status === 500 ? '500' : '404';

    const context = {
        title: status === 500 ? "Server Error" : "Page Not Found",
        error: err.message,
        stack: NODE_ENV.includes('dev') ? err.stack : undefined
    };

    res.status(status).render(`errors/${template}`, context);
});

if (NODE_ENV.includes('dev')) {
    const ws = await import('ws');

    try {
        const wsPort = parseInt(PORT) + 1;
        const wsServer = new ws.WebSocketServer({ port: wsPort });
        wsServer.on('listening', () => {
            console.log(`Websocket running on port ${wsPort}`);
        })

        wsServer.on('error', (error) => {
            console.error('Websocket server error:', error);
        })
    } catch (error) {
        console.error("Failed to start WebSocket server", error);
    }
}

app.listen(PORT, () => {
    console.log(`Server, is running on http://127.0.0.1:${PORT}`);
})