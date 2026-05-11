const mysql = require('mysql2');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sikko_db',
    port: 3307
});

const usersToCreate = [
    { employee_id: 'EMP-001', username: 'trupti_admin', password: 'password123', role: 'Admin' },
    { employee_id: 'EMP-002', username: 'trupti_sales', password: 'password123', role: 'Sales' }
];

usersToCreate.forEach(u => {
    db.query("INSERT IGNORE INTO users (employee_id, username, password, role) VALUES (?, ?, ?, ?)", 
    [u.employee_id, u.username, u.password, u.role], (err, res) => {
        if (err) console.error(err);
        else console.log(`User ${u.username} checked/created.`);
    });
});

setTimeout(() => db.end(), 2000);
