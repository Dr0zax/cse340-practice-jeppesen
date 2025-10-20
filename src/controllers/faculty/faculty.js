import { getFacultyBySlug, getSortedFaculty } from "../../models/faculty/faculty.js";

const facultyListPage = async (req, res) => {
    const validSortOptions = ['name', 'department', 'title'];
    const sortBy = validSortOptions.includes(req.query.sort) ? req.query.sort : 'department';

    const facultyList = await getSortedFaculty(sortBy);

    addFacultySpecificStyles(res);
    res.render('faculty/list', { title: 'Faculty List', currentSort: sortBy, facultyList });
}

const facultyDetailPage = async (req, res, next) => {
    //TODO: gets route parameters to look up individual faculty
    const facultySlug = req.params.facultyId;
    const facultyMember = await getFacultyBySlug(facultySlug);

    if (!facultyMember || Object.keys(facultyMember).length === 0) {
        const err = new Error(`Faculty member ${facultySlug} not found`);
        err.status = 404;
        return next(err);
    }

    addFacultySpecificStyles(res);
    res.render('faculty/detail', { title: `${facultyMember.name}`, facultyMember});
}

const addFacultySpecificStyles = (res) => {
    res.addStyle('<link rel="stylesheet" href="/css/faculty.css">');
}

export { facultyListPage, facultyDetailPage };
