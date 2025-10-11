import { Router } from 'express';

const router =  Router();

import { addDemoHeaders } from '../middleware/demo/headers.js';
import { catalogPage, courseDetailPage } from './catalog/catalog.js';
import { homePage, aboutPage, demoPage, testErrorPage } from './index.js';
import { facultyListPage, facultyDetailPage } from './faculty/faculty.js';

router.get('/', homePage);
router.get('/about', aboutPage);

router.get('/catalog', catalogPage);
router.get('/catalog/:courseId', courseDetailPage);

router.get('/faculty', facultyListPage);
router.get('/faculty/:facultyId', facultyDetailPage);

router.get('/demo', addDemoHeaders, demoPage);
router.get('/error', testErrorPage);

export default router;