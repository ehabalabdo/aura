/**
 * Setup script to create admin user in Firebase
 * Run: node setupAdmin.js
 */

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const FIREBASE_API_KEY = process.env.VITE_FIREBASE_API_KEY;

if (!FIREBASE_API_KEY) {
  console.error('❌ Error: VITE_FIREBASE_API_KEY not found in .env');
  console.log('Make sure Firebase config is set in .env file');
  process.exit(1);
}

function createUser(email, password) {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`;
  
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
      returnSecureToken: true
    })
  }).then(res => res.json());
}

console.log('🔧 Firebase Admin Setup\n');

rl.question('Enter admin email: ', (email) => {
  rl.question('Enter admin password (min 6 chars): ', (password) => {
    
    if (password.length < 6) {
      console.error('❌ Password must be at least 6 characters');
      rl.close();
      process.exit(1);
    }

    console.log('\n⏳ Creating admin user...');
    
    createUser(email, password)
      .then(data => {
        if (data.error) {
          console.error(`❌ Error: ${data.error.message}`);
        } else {
          console.log('✅ Admin user created successfully!');
          console.log(`📧 Email: ${email}`);
          console.log('\n📝 Next steps:');
          console.log(`1. Add to .env: VITE_ADMIN_EMAIL=${email}`);
          console.log('2. Restart dev server: npm run dev');
          console.log('3. Login using the email/password you just created');
        }
        rl.close();
      })
      .catch(err => {
        console.error('❌ Failed to create user:', err.message);
        rl.close();
      });
  });
});
