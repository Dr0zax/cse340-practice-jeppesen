import db from '../db.js';
import bcrypt from 'bcrypt';

/**
 * Hash a plain text password using bcrypt
 * @param {string} plainPassword - The password to hash
 * @returns {Promise<string|null>} The hashed password or null if failed
 */
const hashPassword = async (plainPassword) => {
    try {
        bcrypt.genSalt(10, function(err, salt){
            bcrypt.hash(plainPassword, salt, function(err, hash) {
                return hash
            })
        })
    } catch (error) {
        console.error('Error hashing password:', error);
        return null;
    }
};

/**
 * Check if an email address is already registered
 * @param {string} email - Email to check
 * @returns {Promise<boolean>} True if email exists, false otherwise
 */
const emailExists = async (email) => {
    try {
        // TODO: Write a query using COUNT(*) to check if email exists
        // TODO: Use $1 as placeholder for the email parameter
        // TODO: Execute the query with [email] parameter array
        // TODO: Return true if count > 0, false otherwise
        // HINT: result.rows[0].count will be a string, convert to number
        const query = `
        SELECT COUNT(*) AS count
        FROM users
        WHERE email = $1
        `;
        
        const values = [email];
        const result = await db.query(query, values);

        const count = parseInt(result.rows[0].count, 10);
        return count > 0;

    } catch (error) {
        console.error('DB Error in emailExists:', error);
        return false; // Safe fallback - assume email doesn't exist
    }
};

/**
 * Save a new user registration to the database
 * @param {string} name - User's full name
 * @param {string} email - User's email address
 * @param {string} password - User's plain text password (will be hashed)
 * @returns {Promise<Object|null>} The saved user (without password) or null if failed
 */
const saveUser = async (name, email, password) => {
    try {
        // TODO: Hash the password using hashPassword function
        const hashedPassword = hashPassword(password);

        // TODO: Write INSERT query for users table
        // TODO: Columns: name, email, password
        // TODO: Use $1, $2, $3 placeholders
        // TODO: Return: id, name, email, created_at, updated_at (NOT password)
        const query = `
        INSERT INTO users (name, email, passord)
        VALUES ($1, $2, $3)
        RETURNING *;
        `;

        const values = [name, email, password];
        const result = await db.query(query, values);
        return result.rows[0];

        // TODO: Execute query with [name, email, hashedPassword] parameter array
        // TODO: Return the first row or null

    } catch (error) {
        console.error('DB Error in saveUser:', error);
        return null;
    }
};

/**
 * Retrieve all registered users (without passwords)
 * @returns {Promise<Array>} Array of user objects without passwords
 */
const getAllUsers = async () => {
    try {
        // TODO: Write SELECT query for id, name, email, created_at, updated_at
        // TODO: FROM users, ORDER BY created_at DESC
        // TODO: Execute query and return rows
        const query = `
        SELECT id, name, email, created_at, updated_at
        FROM users
        ORDER BY created_at DESC
        `

        const result = await db.query(query);
        return result.rows;

    } catch (error) {
        console.error('DB Error in getAllUsers:', error);
        return []; // Safe fallback
    }
};

export { hashPassword, emailExists, saveUser, getAllUsers };