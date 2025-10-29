import { getAllCourses, getCourseBySlug } from "../../models/catalog/courses.js";
import { getSortedSections } from "../../models/catalog/catalog.js";

const catalogPage = async (req, res, next) => {
    const courses = await getAllCourses();

    addCatalogSpecificStyles(res);
    res.render('catalog/list', {
        title: `Course Catalog`,
        courses: courses
    });
};

const courseDetailPage = async (req, res, next) => {
    const courseSlug = req.params.courseId;
    const course = await getCourseBySlug(courseSlug);

    if (!course || Object.keys(course).length === 0) {
        const err = new Error(`Course ${courseSlug} not found`);
        err.status = 404;
        return next(err);
    }

    const sortBy = req.query.sort || 'time';
    const sections = await getSortedSections(courseSlug, sortBy);

    addCatalogSpecificStyles(res);
    res.render('catalog/detail', {
        title: `${course.courseCode} - ${course.name}`,
        course: course,
        sections: sections,
        currentSort: sortBy
    });
};

    const addCatalogSpecificStyles = (res) => {
        res.addStyle('<link rel="stylesheet" href="/css/catalog.css">')
    }

export { catalogPage, courseDetailPage };
