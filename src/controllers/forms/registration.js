import { body, validationResult } from 'express-validator';
import { emailExists, saveUser, getAllUsers } from '../../models/forms/registration.js';
/**
 * Comprehensive validation rules for user registration
 */
const registrationValidation = [
    body('name')
        .trim()
        .isLength({ min: 7 })
        .withMessage('Name must be at least 7 characters long'),

    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),

    body('confirmEmail')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid confirmation email')
        .normalizeEmail()
        .custom((value, { req }) => {
            if (value !== req.body.email) {
                throw new Error('Email addresses do not match');
            }
            return true;
        }),

    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])/)
        .withMessage('Password must contain at least one number and one symbol (!@#$%^&*)'),

    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        })
];

/**
 * Display the registration form
 */
const showRegistrationForm = (req, res) => {
    // TODO: Add registration-specific styles using res.addStyle()
    addRegistrationSpecificStyles(res);
    // TODO: Render the registration form view (forms/registration/form)
    res.render('forms/registration/form', {
        title: "Register",
    })
};

/**
 * Process user registration submission
 */
const processRegistration = async (req, res) => {
    // TODO: Check for validation errors using validationResult(req)
    const errors = validationResult(req);
    // TODO: If errors exist, redirect back to registration form
    if (!errors.isEmpty()) {
        console.log('Validation Errors:', errors.array());
        return res.redirect('/register');
    }
    // TODO: Extract name, email, password from req.body
    const {name, email, password} = req.body;

    const emailCheck = await emailExists(email);    
    
    // TODO: Check if email already exiclsts using emailExists()
    // TODO: If email exists, log message and redirect back
    if (emailCheck) {
        console.log("Email Already Exists");
        return res.redirect('/register');
    }
    // TODO: Save the user using saveUser()
    const savedForm = await saveUser(name, email, password);
    // TODO: If save fails, log error and redirect back
    // TODO: If successful, log success and redirect to login
    if (!savedForm) {
        console.log('Failed to save registration form.');
        return res.redirect('/register');
    } else {
        // res.redirect('/login')
        console.log("Success");
    }
};

/**
 * Display all registered users
 */
const showAllUsers = async (req, res) => {
    // TODO: Get all users using getAllUsers()
    const users = await getAllUsers();
    // TODO: Add registration-specific styles
    addRegistrationSpecificStyles(res);
    // TODO: Render the users list view (forms/registration/list) with the user data
    res.render('forms/registration/list', {
        title: "All Registered Users",
        users: users
    })
};

const addRegistrationSpecificStyles = (res) => {
    res.addStyle('<link rel="stylesheet" href="/css/registration.css">')
}

export { showRegistrationForm, processRegistration, showAllUsers, registrationValidation };
