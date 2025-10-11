import { getFacultyById, getSortedFaculty } from "../../models/faculty/faculty.js";

const facultyListPage = (req, res) => {
    //TODO: Render the faculty list page with sorted faculty members
    const sortBy = req.query.sort || 'department';
    const facultyMembers = getSortedFaculty(sortBy);
    res.render('faculty/list', { title: 'Faculty List', faculty: facultyMembers, sortBy });
}

const facultyDetailPage = (req, res, next) => {
    //TODO: gets route parameters to look up individual faculty
    const facultyId = req.params.facultyId;
    const facultyMember = getFacultyById(facultyId);

    if (!facultyMember) {
        const err = new Error(`Faculty member ${facultyId} not found`);
        err.status = 404;
        return next(err);
    }

    res.render('faculty/detail', { title: `${facultyMember.name}`, faculty: facultyMember});
}

export { facultyListPage, facultyDetailPage };
