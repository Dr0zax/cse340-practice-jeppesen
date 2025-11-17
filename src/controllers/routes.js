import { Router } from "express";
import { addDemoHeaders } from "../middleware/demo/headers.js";
import { catalogPage, courseDetailPage } from "./catalog/catalog.js";
import { homePage, aboutPage, demoPage, testErrorPage } from "./index.js";
import { facultyListPage, facultyDetailPage } from "./faculty/faculty.js";
import {
  showContactForm,
  processContactForm,
  showContactResponses,
} from "./forms/contact.js";
import {
  showRegistrationForm,
  processRegistration,
  showAllUsers,
  showEditAccountForm,
  processEditAccount,
  processDeleteAccount,
} from "./forms/registration.js";
import { requireLogin, requireRole } from "../middleware/auth.js";
import {
  showLoginForm,
  processLogin,
  processLogout,
  showDashboard,
} from "./forms/login.js";
import {
  contactValidation,
  updateAccountValidation,
  loginValidation,
  registrationValidation,
} from "../middleware/validation/forms.js";

const router = Router();

router.get("/", homePage);
router.get("/about", aboutPage);

router.get("/catalog", catalogPage);
router.get("/catalog/:courseId", courseDetailPage);

router.get("/faculty", facultyListPage);
router.get("/faculty/:facultyId", facultyDetailPage);

router.get("/demo", addDemoHeaders, demoPage);
router.get("/error", testErrorPage);

router.get("/contact", showContactForm);
router.post("/contact", contactValidation, processContactForm);
router.get("/contact/responses", showContactResponses);

router.get("/register", showRegistrationForm);
router.post("/register", registrationValidation, processRegistration);
router.get("/users", showAllUsers);

router.get("/login", showLoginForm);
router.post("/login", loginValidation, processLogin);
router.get("/logout", processLogout);

router.get("/dashboard", requireLogin, showDashboard);

router.get("/users/:id/edit", requireLogin, showEditAccountForm);
router.post(
  "/users/:id/update",
  requireLogin,
  updateAccountValidation,
  processEditAccount
);
router.post("/users/:id/delete", requireRole("admin"), processDeleteAccount);

export default router;
