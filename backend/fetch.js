const fetch = require('node-fetch');

async function test() {
    try {
        const res = await fetch('http://localhost:3000/api/resumes/1/build');
        const data = await res.json();
        console.log('Build result:', data);
    } catch (e) {
        console.error(e);
    }
}

test();