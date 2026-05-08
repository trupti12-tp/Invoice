const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sikko_db',
    port: 3307
});

db.connect(err => {
    if (err) console.error('Error:', err);
    else {
        console.log('MySQL Connected on port 3306');

        // Helper to add columns if they don't exist
        const addColumn = (table, col, definition) => {
            db.query(`SHOW COLUMNS FROM ${table} LIKE '${col}'`, (err, results) => {
                if (!err && results && results.length === 0) {
                    db.query(`ALTER TABLE ${table} ADD COLUMN ${col} ${definition}`, (err2) => {
                        if (err2) console.error(`Error adding ${col} to ${table}:`, err2);
                        else console.log(`Added column ${col} to ${table}`);
                    });
                }
            });
        };

        addColumn('invoices', 'created_by', "VARCHAR(255) DEFAULT 'Admin'");
        addColumn('products_master', 'unit', "VARCHAR(50) DEFAULT ''");
        addColumn('products_master', 'cat', "VARCHAR(255) DEFAULT ''");
        addColumn('products_master', 'stock', "INT DEFAULT 0");
        addColumn('products_master', 'subproducts', "TEXT");
        addColumn('users', 'role', "VARCHAR(50) DEFAULT 'Admin'");
        addColumn('users', 'password', "VARCHAR(255) DEFAULT ''");
        
        // Force create/update tables
        const createTables = [
            `CREATE TABLE IF NOT EXISTS invoices (
                id INT AUTO_INCREMENT PRIMARY KEY,
                pi_number VARCHAR(100),
                client_name VARCHAR(255),
                total_amount DECIMAL(15,2),
                status VARCHAR(50) DEFAULT 'PAID',
                created_by VARCHAR(255) DEFAULT 'Admin',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,
            `CREATE TABLE IF NOT EXISTS invoice_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                invoice_id INT,
                product_name VARCHAR(255),
                qty DECIMAL(15,2),
                price DECIMAL(15,2),
                FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
            )`,
            `CREATE TABLE IF NOT EXISTS customers (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255),
                company VARCHAR(255),
                phone VARCHAR(20),
                email VARCHAR(255),
                gst VARCHAR(50),
                city VARCHAR(100),
                contact VARCHAR(20),
                address TEXT,
                person VARCHAR(255)
            )`,
            `CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) UNIQUE,
                password VARCHAR(255),
                role VARCHAR(50) DEFAULT 'Admin'
            )`
        ];

        createTables.forEach(sql => {
            db.query(sql, (err) => {
                if (err) console.error("Error creating table:", err);
            });
        });

        // Seed initial data if missing
        const seedData = () => {
            const demoCustomers = [
                ['Suresh Patel', 'Sardar Agro', '9825011223', 'suresh.agro@gmail.com', '24AAAAA0000A1Z5', 'Rajkot', '9825011223', 'Rajkot, Gujarat', 'Suresh Patel'],
                ['Amit Desai', 'Desai Fertilisers', '9426012345', 'amit.desai@yahoo.com', '24BBBBB1111B1Z8', 'Surat', '9426012345', 'Surat, Gujarat', 'Amit Desai'],
                ['Vikram Singh', 'Royal Seeds', '9904056789', 'vikram.royal@outlook.com', '24CCCCC2222C1Z4', 'Mehsana', '9904056789', 'Mehsana, Gujarat', 'Vikram Singh'],
                ['Deepak Mehta', 'Mehta Chemicals', '9879067890', 'deepak.mehta@gmail.com', '24DDDDD3333D1Z2', 'Vadodara', '9879067890', 'Vadodara, Gujarat', 'Deepak Mehta'],
                ['Rajesh Varma', 'Varma Sprayers', '9723045678', 'rajesh.sprayers@gmail.com', '24EEEEE4444E1Z1', 'Bhavnagar', '9723045678', 'Bhavnagar, Gujarat', 'Rajesh Varma']
            ];

            demoCustomers.forEach(c => {
                db.query("SELECT id FROM customers WHERE name = ?", [c[0]], (err, res) => {
                    if (!err && res.length === 0) {
                        db.query("INSERT INTO customers (name, company, phone, email, gst, city, contact, address, person) VALUES (?,?,?,?,?,?,?,?,?)", c);
                    }
                });
            });

            const demoProducts = [
                // 1. ORGANIC CERT. AGRO CHEMICALS
                ['Neem Oil', '3808', '1 Ltr', 450, 'Ltr', 'ORGANIC CERT. AGRO CHEMICALS', 500, '[{"id":11, "pack":"500ml", "price":250}, {"id":12, "pack":"1Ltr", "price":450}]'],
                ['Vermicompost', '3101', '50 Kg', 15, 'Kg', 'ORGANIC CERT. AGRO CHEMICALS', 1000, '[]'],
                ['Bio Fertilizer', '3101', '1 Kg', 120, 'Kg', 'ORGANIC CERT. AGRO CHEMICALS', 800, '[]'],
                ['Organic Pesticides', '3808', '1 Ltr', 550, 'Ltr', 'ORGANIC CERT. AGRO CHEMICALS', 400, '[]'],
                ['Seaweed Extract', '3101', '1 Ltr', 850, 'Ltr', 'ORGANIC CERT. AGRO CHEMICALS', 300, '[]'],
                // 2. ORGANIC AGRO CHEMICALS
                ['Bio Insecticide', '3808', '1 Ltr', 650, 'Ltr', 'ORGANIC AGRO CHEMICALS', 300, '[]'],
                ['Bio Fungicide', '3808', '1 Ltr', 720, 'Ltr', 'ORGANIC AGRO CHEMICALS', 250, '[]'],
                ['Plant Growth Promoter', '3808', '1 Ltr', 900, 'Ltr', 'ORGANIC AGRO CHEMICALS', 200, '[]'],
                ['Trichoderma', '3808', '1 Kg', 380, 'Kg', 'ORGANIC AGRO CHEMICALS', 500, '[]'],
                ['Azotobacter', '3808', '1 Kg', 420, 'Kg', 'ORGANIC AGRO CHEMICALS', 450, '[]'],
                // 3. AGRO CHEMICALS
                ['Insecticides', '3808', '1 Ltr', 800, 'Ltr', 'AGRO CHEMICALS', 600, '[]'],
                ['Fungicides', '3808', '1 Ltr', 750, 'Ltr', 'AGRO CHEMICALS', 550, '[]'],
                ['Herbicides', '3808', '1 Ltr', 680, 'Ltr', 'AGRO CHEMICALS', 400, '[]'],
                ['Pesticides', '3808', '1 Ltr', 950, 'Ltr', 'AGRO CHEMICALS', 350, '[]'],
                ['Plant Regulators', '3808', '1 Ltr', 1100, 'Ltr', 'AGRO CHEMICALS', 200, '[]'],
                // 4. FERTILIZERS
                ['Urea', '3102', '50 Kg', 266.5, 'Bag', 'FERTILIZERS', 2000, '[]'],
                ['DAP', '3105', '50 Kg', 1350, 'Bag', 'FERTILIZERS', 1500, '[]'],
                ['NPK Fertilizer', '3105', '50 Kg', 1470, 'Bag', 'FERTILIZERS', 1200, '[]'],
                ['Potash', '3104', '50 Kg', 1700, 'Bag', 'FERTILIZERS', 1000, '[]'],
                ['Micronutrients', '3824', '1 Kg', 450, 'Kg', 'FERTILIZERS', 800, '[]'],
                // 5. SEEDS
                ['Wheat Seeds', '1001', '30 Kg', 2500, 'Bag', 'SEEDS', 5000, '[]'],
                ['Rice Seeds', '1006', '25 Kg', 3200, 'Bag', 'SEEDS', 4000, '[]'],
                ['Vegetable Seeds', '1209', '100 gm', 50, 'Pkt', 'SEEDS', 10000, '[]'],
                ['Hybrid Seeds', '1209', '1 Kg', 500, 'Kg', 'SEEDS', 2000, '[]'],
                ['Cotton Seeds', '1207', '450 gm', 850, 'Pkt', 'SEEDS', 3000, '[]'],
                // 6. SPRAYERS
                ['Hand Sprayer', '8424', '1 Pc', 350, 'Pc', 'SPRAYERS', 100, '[]'],
                ['Battery Sprayer', '8424', '1 Pc', 2800, 'Pc', 'SPRAYERS', 80, '[]'],
                ['Knapsack Sprayer', '8424', '1 Pc', 1200, 'Pc', 'SPRAYERS', 150, '[]'],
                ['Power Sprayer', '8424', '1 Pc', 8500, 'Pc', 'SPRAYERS', 50, '[]'],
                // 7. FMCG PRODUCTS
                ['Soap', '3401', '1 Pc', 45, 'Pc', 'FMCG PRODUCTS', 1000, '[]'],
                ['Shampoo', '3305', '1 Pc', 120, 'Pc', 'FMCG PRODUCTS', 800, '[]'],
                ['Detergent', '3402', '1 Kg', 150, 'Kg', 'FMCG PRODUCTS', 600, '[]'],
                ['Oil', '1512', '1 Ltr', 180, 'Ltr', 'FMCG PRODUCTS', 500, '[]'],
                ['Packaged Food', '2106', '1 Pc', 90, 'Pc', 'FMCG PRODUCTS', 1200, '[]'],
                // 8. HOUSEHOLD PRODUCTS
                ['Cleaning Liquid', '3402', '1 Pc', 110, 'Pc', 'HOUSEHOLD PRODUCTS', 400, '[]'],
                ['Phenyl', '3808', '1 Ltr', 85, 'Ltr', 'HOUSEHOLD PRODUCTS', 600, '[]'],
                ['Dish Wash', '3402', '1 Pc', 45, 'Pc', 'HOUSEHOLD PRODUCTS', 800, '[]'],
                ['Floor Cleaner', '3402', '1 Pc', 130, 'Pc', 'HOUSEHOLD PRODUCTS', 500, '[]']
            ];

            demoProducts.forEach(p => {
                db.query("SELECT id FROM products_master WHERE name = ?", [p[0]], (err, res) => {
                    if (!err && res.length === 0) {
                        db.query("INSERT INTO products_master (name, hsn, pack, price, unit, cat, stock, subproducts) VALUES (?,?,?,?,?,?,?,?)", p);
                    } else if (!err && res.length > 0) {
                        // Update existing ones to have the new fields if they are missing
                        db.query("UPDATE products_master SET cat=?, stock=?, subproducts=? WHERE name=?", [p[5], p[6], p[7], p[0]]);
                    }
                });
            });
            
            console.log("Database seeding check complete.");
        };
        
        // Wait a bit for tables to be ready then seed
        setTimeout(seedData, 2000);
    }
});

// --- Auth API ---
app.post('/api/signup', (req, res) => {
    const { username, password, role } = req.body;
    db.query("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", [username, password, role || 'Admin'], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ success: false, message: "Username already exists" });
            }
            return res.status(500).json({ error: err.message });
        }
        res.json({ success: true, user: { id: result.insertId, username, role: role || 'Admin' } });
    });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    db.query("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length > 0) {
            res.json({ success: true, user: results[0] });
        } else {
            res.status(401).json({ success: false, message: "Invalid username or password" });
        }
    });
});

app.get('/api/users', (req, res) => {
    db.query("SELECT * FROM users", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// --- Customers API ---
app.get('/api/customers', (req, res) => {
    db.query("SELECT * FROM customers", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.post('/api/customers', (req, res) => {
    const { name, company, phone, email, gst, city, contact, address, person } = req.body;
    db.query("INSERT INTO customers (name, company, phone, email, gst, city, contact, address, person) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", 
    [name, company, phone, email, gst, city, contact || phone, address || '', person || name], (err, result) => {
        if (err) {
            console.error("Database error while saving customer:", err);
            return res.status(500).json({ error: err.message });
        }
        console.log("Customer saved successfully, ID:", result.insertId);
        res.json({ success: true, id: result.insertId });
    });
});

app.put('/api/customers/:id', (req, res) => {
    const { id } = req.params;
    const { name, company, phone, email, gst, city } = req.body;
    db.query("UPDATE customers SET name=?, company=?, phone=?, email=?, gst=?, city=? WHERE id=?", 
    [name, company, phone, email, gst, city, id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// --- Invoices API ---
app.post('/api/save-invoice', (req, res) => {
    const { formData, products, finalAmt, created_by } = req.body;
    const sql = "INSERT INTO invoices (pi_number, client_name, total_amount, created_by) VALUES (?, ?, ?, ?)";
    db.query(sql, [formData.piNumber, formData.consigneeName, finalAmt, created_by || 'Admin'], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        const invoiceId = result.insertId;
        const itemValues = products.map(p => [invoiceId, p.name, p.qty, p.price]);
        const itemSql = "INSERT INTO invoice_items (invoice_id, product_name, qty, price) VALUES ?";
        db.query(itemSql, [itemValues], (err2) => {
            if (err2) return res.status(500).json({ error: err2.message });
            res.json({ message: "Success", id: invoiceId });
        });
    });
});

app.get('/api/invoices', (req, res) => {
    db.query("SELECT * FROM invoices ORDER BY created_at DESC", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// --- Products Master API ---
app.get('/api/products', (req, res) => {
    db.query("CREATE TABLE IF NOT EXISTS products_master (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), hsn VARCHAR(50), pack VARCHAR(50), price DECIMAL(10,2), unit VARCHAR(50), cat VARCHAR(255), stock INT, subproducts TEXT)", () => {
        db.query("SELECT * FROM products_master", (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            
            const parsedResults = results.map(row => {
                let parsedSub = [];
                try {
                    if (row.subproducts) parsedSub = JSON.parse(row.subproducts);
                } catch(e){}
                return { ...row, subproducts: parsedSub };
            });
            res.json(parsedResults);
        });
    });
});

app.post('/api/products', (req, res) => {
    const { name, hsn, pack, price, cat } = req.body;
    db.query("INSERT INTO products_master (name, hsn, pack, price, cat) VALUES (?, ?, ?, ?, ?)", [name, hsn, pack, price, cat], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, id: result.insertId });
    });
});

app.put('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const { name, hsn, pack, price, cat, subproducts } = req.body;
    db.query("UPDATE products_master SET name=?, hsn=?, pack=?, price=?, cat=?, subproducts=? WHERE id=?", 
    [name, hsn, pack, price, cat, JSON.stringify(subproducts || []), id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

app.put('/api/invoices/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    db.query("UPDATE invoices SET status=? WHERE id=?", [status, id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
