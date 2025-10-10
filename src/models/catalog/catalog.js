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

const getAllCourses = () => {
    return courses;
};

const getCourseById = (courseId) => {
    return courses[courseId] || null;
};

const getSortedSections = (sections, sortBy) => {
    // Ensure we have an array to avoid runtime errors when sections is undefined/null
    if (!Array.isArray(sections)) return [];

    const sortedSections = [...sections];

    switch (sortBy) {
        case 'professor':
            return sortedSections.sort((a, b) => a.professor.localeCompare(b.professor));
        case 'room':
            return sortedSections.sort((a, b) => a.room.localeCompare(b.room));
        case 'time':
        default:
            return sortedSections;
    }
};

const getCourseByDepartment = (department) => {
    const departments = {};

    Object.values(courses).forEach(course => {

        if (!departments[course.department]) {
            departments[course.department] = [];
        }

        departments[course.department].push(course);

    });
    return departments;    
};

export { getAllCourses, getCourseById, getSortedSections, getCourseByDepartment };
