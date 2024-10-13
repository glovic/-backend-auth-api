const bcrypt = require('bcrypt');

// Raw password to test
const rawPassword = 'password123';

// Hashed password from your database (ensure this matches the stored hashed password)
const hashedPassword = '$2b$10$NIaIJxdAVY4Csv7Wr.vyiehQE4goglTOyOjm1t8mmke9QvRlhiItq';

// Function to compare passwords
async function testPassword() {
    try {
        const isMatch = await bcrypt.compare(rawPassword, hashedPassword);
        console.log('Password match result:', isMatch);
    } catch (error) {
        console.error('Error comparing passwords:', error);
    }
}

// Run the test
testPassword();

