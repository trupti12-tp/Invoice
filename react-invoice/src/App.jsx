import { useState, useEffect, Fragment } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import natureBg from './assets/nature_bg.png'
import sikkoLogo from './assets/sikko_logo_hq.jpg'
import loginBg from './assets/login_bg.png'
import bannerVideo from './assets/banner-vedio.mp4'
import upiQr from './assets/upi_qr.png'
import './App.css'

function App() {
  // --- State Management ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeView, setActiveView] = useState('invoiceView');
  const [reportTab, setReportTab] = useState('invoices'); // 'invoices' or 'purchases'
  const [invoices, setInvoices] = useState([
    { id: 1, pi_number: 'SI-2026-001', created_at: '2026-04-15', client_name: 'Suresh Patel', total_amount: 154500.00, status: 'PAID', created_by: 'Admin' },
    { id: 2, pi_number: 'SI-2026-002', created_at: '2026-04-20', client_name: 'Amit Desai', total_amount: 89000.50, status: 'PAID', created_by: 'SalesUser1' },
    { id: 3, pi_number: 'SI-2026-003', created_at: '2026-05-02', client_name: 'Vikram Singh', total_amount: 45600.00, status: 'PENDING', created_by: 'Admin' },
    { id: 4, pi_number: 'SI-2026-004', created_at: '2026-05-05', client_name: 'Deepak Mehta', total_amount: 12500.00, status: 'DRAFT', created_by: 'SalesUser2' },
    { id: 5, pi_number: 'SI-2026-005', created_at: '2026-05-06', client_name: 'Rajesh Varma', total_amount: 67800.00, status: 'PAID', created_by: 'Admin' },
    { id: 6, pi_number: 'SI-2026-006', created_at: '2026-05-10', client_name: 'Suresh Patel', total_amount: 22400.00, status: 'PENDING', created_by: 'SalesUser1' }
  ]);
  const [purchases, setPurchases] = useState([
    { id: 1, bill_no: 'PUR/26/101', date: '2026-04-10', vendor: 'Reliance Petro', amount: 550000.00, status: 'RECEIVED' },
    { id: 2, bill_no: 'PUR/26/102', date: '2026-04-18', vendor: 'Gujarat Fertilizers', amount: 245000.00, status: 'RECEIVED' },
    { id: 3, bill_no: 'PUR/26/103', date: '2026-04-25', vendor: 'Indo Seeds Ltd', amount: 120000.00, status: 'PENDING' },
    { id: 4, bill_no: 'PUR/26/104', date: '2026-05-01', vendor: 'Bharat Chemicals', amount: 89000.00, status: 'RECEIVED' },
    { id: 5, bill_no: 'PUR/26/105', date: '2026-05-04', vendor: 'Zydus Agro', amount: 310000.00, status: 'CANCELLED' }
  ]);
  const [customers, setCustomers] = useState([
    { id: 'd1', name: 'Suresh Patel', company: 'Sardar Agro', phone: '9825011223', email: 'suresh.agro@gmail.com', gst: '24AAAAA0000A1Z5', city: 'Rajkot' },
    { id: 'd2', name: 'Amit Desai', company: 'Desai Fertilisers', phone: '9426012345', email: 'amit.desai@yahoo.com', gst: '24BBBBB1111B1Z8', city: 'Surat' },
    { id: 'd3', name: 'Vikram Singh', company: 'Royal Seeds', phone: '9904056789', email: 'vikram.royal@outlook.com', gst: '24CCCCC2222C1Z4', city: 'Mehsana' },
    { id: 'd4', name: 'Deepak Mehta', company: 'Mehta Chemicals', phone: '9879067890', email: 'deepak.mehta@gmail.com', gst: '24DDDDD3333D1Z2', city: 'Vadodara' },
    { id: 'd5', name: 'Rajesh Varma', company: 'Varma Sprayers', phone: '9723045678', email: 'rajesh.sprayers@gmail.com', gst: '24EEEEE4444E1Z1', city: 'Bhavnagar' }
  ]);
  const [masterProducts, setMasterProducts] = useState([
    // 1. ORGANIC CERT. AGRO CHEMICALS
    { id: 1, name: 'Neem Oil', hsn: '3808', price: 450.00, unit: 'Ltr', cat: 'ORGANIC CERT. AGRO CHEMICALS', stock: 500, subproducts: [{ id: 11, pack: '500ml', price: 250 }, { id: 12, pack: '1Ltr', price: 450 }] },
    { id: 2, name: 'Vermicompost', hsn: '3101', price: 15.00, unit: 'Kg', cat: 'ORGANIC CERT. AGRO CHEMICALS', stock: 1000, subproducts: [] },
    { id: 3, name: 'Bio Fertilizer', hsn: '3101', price: 120.00, unit: 'Kg', cat: 'ORGANIC CERT. AGRO CHEMICALS', stock: 800, subproducts: [] },
    { id: 4, name: 'Organic Pesticides', hsn: '3808', price: 550.00, unit: 'Ltr', cat: 'ORGANIC CERT. AGRO CHEMICALS', stock: 400, subproducts: [] },
    { id: 5, name: 'Seaweed Extract', hsn: '3101', price: 850.00, unit: 'Ltr', cat: 'ORGANIC CERT. AGRO CHEMICALS', stock: 300, subproducts: [] },

    // 2. ORGANIC AGRO CHEMICALS
    { id: 6, name: 'Bio Insecticide', hsn: '3808', price: 650.00, unit: 'Ltr', cat: 'ORGANIC AGRO CHEMICALS', stock: 300, subproducts: [] },
    { id: 7, name: 'Bio Fungicide', hsn: '3808', price: 720.00, unit: 'Ltr', cat: 'ORGANIC AGRO CHEMICALS', stock: 250, subproducts: [] },
    { id: 8, name: 'Plant Growth Promoter', hsn: '3808', price: 900.00, unit: 'Ltr', cat: 'ORGANIC AGRO CHEMICALS', stock: 200, subproducts: [] },
    { id: 9, name: 'Trichoderma', hsn: '3808', price: 380.00, unit: 'Kg', cat: 'ORGANIC AGRO CHEMICALS', stock: 500, subproducts: [] },
    { id: 10, name: 'Azotobacter', hsn: '3808', price: 420.00, unit: 'Kg', cat: 'ORGANIC AGRO CHEMICALS', stock: 450, subproducts: [] },

    // 3. AGRO CHEMICALS
    { id: 11, name: 'Insecticides', hsn: '3808', price: 800.00, unit: 'Ltr', cat: 'AGRO CHEMICALS', stock: 600, subproducts: [] },
    { id: 12, name: 'Fungicides', hsn: '3808', price: 750.00, unit: 'Ltr', cat: 'AGRO CHEMICALS', stock: 550, subproducts: [] },
    { id: 13, name: 'Herbicides', hsn: '3808', price: 680.00, unit: 'Ltr', cat: 'AGRO CHEMICALS', stock: 400, subproducts: [] },
    { id: 14, name: 'Pesticides', hsn: '3808', price: 950.00, unit: 'Ltr', cat: 'AGRO CHEMICALS', stock: 350, subproducts: [] },
    { id: 15, name: 'Plant Regulators', hsn: '3808', price: 1100.00, unit: 'Ltr', cat: 'AGRO CHEMICALS', stock: 200, subproducts: [] },

    // 4. FERTILIZERS
    { id: 16, name: 'Urea', hsn: '3102', price: 266.50, unit: 'Bag', cat: 'FERTILIZERS', stock: 2000, subproducts: [] },
    { id: 17, name: 'DAP', hsn: '3105', price: 1350.00, unit: 'Bag', cat: 'FERTILIZERS', stock: 1500, subproducts: [] },
    { id: 18, name: 'NPK Fertilizer', hsn: '3105', price: 1470.00, unit: 'Bag', cat: 'FERTILIZERS', stock: 1200, subproducts: [] },
    { id: 19, name: 'Potash', hsn: '3104', price: 1700.00, unit: 'Bag', cat: 'FERTILIZERS', stock: 1000, subproducts: [] },
    { id: 20, name: 'Micronutrients', hsn: '3824', price: 450.00, unit: 'Kg', cat: 'FERTILIZERS', stock: 800, subproducts: [] },

    // 5. SEEDS
    { id: 21, name: 'Wheat Seeds', hsn: '1001', price: 2500.00, unit: 'Bag', cat: 'SEEDS', stock: 5000, subproducts: [] },
    { id: 22, name: 'Rice Seeds', hsn: '1006', price: 3200.00, unit: 'Bag', cat: 'SEEDS', stock: 4000, subproducts: [] },
    { id: 23, name: 'Vegetable Seeds', hsn: '1209', price: 50.00, unit: 'Pkt', cat: 'SEEDS', stock: 10000, subproducts: [] },
    { id: 24, name: 'Hybrid Seeds', hsn: '1209', price: 500.00, unit: 'Kg', cat: 'SEEDS', stock: 2000, subproducts: [] },
    { id: 25, name: 'Cotton Seeds', hsn: '1207', price: 850.00, unit: 'Pkt', cat: 'SEEDS', stock: 3000, subproducts: [] },

    // 6. SPRAYERS
    { id: 26, name: 'Hand Sprayer', hsn: '8424', price: 350.00, unit: 'Pc', cat: 'SPRAYERS', stock: 100, subproducts: [] },
    { id: 27, name: 'Battery Sprayer', hsn: '8424', price: 2800.00, unit: 'Pc', cat: 'SPRAYERS', stock: 80, subproducts: [] },
    { id: 28, name: 'Knapsack Sprayer', hsn: '8424', price: 1200.00, unit: 'Pc', cat: 'SPRAYERS', stock: 150, subproducts: [] },
    { id: 29, name: 'Power Sprayer', hsn: '8424', price: 8500.00, unit: 'Pc', cat: 'SPRAYERS', stock: 50, subproducts: [] },

    // 7. FMCG PRODUCTS
    { id: 30, name: 'Soap', hsn: '3401', price: 45.00, unit: 'Pc', cat: 'FMCG PRODUCTS', stock: 1000, subproducts: [] },
    { id: 31, name: 'Shampoo', hsn: '3305', price: 120.00, unit: 'Pc', cat: 'FMCG PRODUCTS', stock: 800, subproducts: [] },
    { id: 32, name: 'Detergent', hsn: '3402', price: 150.00, unit: 'Kg', cat: 'FMCG PRODUCTS', stock: 600, subproducts: [] },
    { id: 33, name: 'Oil', hsn: '1512', price: 180.00, unit: 'Ltr', cat: 'FMCG PRODUCTS', stock: 500, subproducts: [] },
    { id: 34, name: 'Packaged Food', hsn: '2106', price: 90.00, unit: 'Pc', cat: 'FMCG PRODUCTS', stock: 1200, subproducts: [] },

    // 8. HOUSEHOLD PRODUCTS
    { id: 35, name: 'Cleaning Liquid', hsn: '3402', price: 110.00, unit: 'Pc', cat: 'HOUSEHOLD PRODUCTS', stock: 400, subproducts: [] },
    { id: 36, name: 'Phenyl', hsn: '3808', price: 85.00, unit: 'Ltr', cat: 'HOUSEHOLD PRODUCTS', stock: 600, subproducts: [] },
    { id: 37, name: 'Dish Wash', hsn: '3402', price: 45.00, unit: 'Pc', cat: 'HOUSEHOLD PRODUCTS', stock: 800, subproducts: [] },
    { id: 38, name: 'Floor Cleaner', hsn: '3402', price: 130.00, unit: 'Pc', cat: 'HOUSEHOLD PRODUCTS', stock: 500, subproducts: [] }
  ]);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', company: '', phone: '', email: '', gst: '', city: '' });
  const [showEditCustomerModal, setShowEditCustomerModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [expandedProductId, setExpandedProductId] = useState(null);
  const [productListViewMode, setProductListViewMode] = useState('table');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [currentUser, setCurrentUser] = useState({ name: '', email: '', username: '', role: 'Admin', employeeId: '' });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [companyInfo, setCompanyInfo] = useState({
    name: 'SIKKO INDUSTRIES LTD',
    address: 'Reg. Office: 508, ISCON ELEGANCE, NR. JAIN TEMPLE, PRAHLADNAGAR, S.G. HIGHWAY, AHMEDABAD-380015 (GUJARAT)',
    gst: '24AAGCS0629C1ZT',
    bank_name: 'ICICI BANK LTD.',
    account_no: '423551000001',
    ifsc: 'ICIC0004235',
    branch: 'Makarba Ahmedabad (Gujarat)',
    contact: '7069026163'
  });

  const inputStyle = {
    width: '100%', padding: '12px 12px 12px 50px', borderRadius: '12px', border: '2px solid #e2e8f0',
    background: '#f8fafc', outline: 'none', fontSize: '0.95rem', transition: 'all 0.2s'
  };
  const btnStyle = {
    marginTop: '10px', padding: '14px', borderRadius: '12px', border: 'none',
    background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)', color: '#fff',
    fontWeight: '800', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3)', transition: 'all 0.3s'
  };
  const handleFocus = e => { e.target.style.borderColor = '#2563eb'; e.target.style.background = '#fff'; };
  const handleBlur = e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; };
  const handleBtnHover = e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 15px 25px -5px rgba(37, 99, 235, 0.5)'; };
  const handleBtnOut = e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(37, 99, 235, 0.3)'; };

  // Fetch data on load
  useEffect(() => {
    if (isLoggedIn) {
      fetchInvoices();
      fetchCustomers();
      fetchProducts();
      fetchUsers();
      fetchCompanyInfo();
    }
  }, [isLoggedIn]);

  const fetchCompanyInfo = async () => {
    try {
      const res = await fetch('http://127.0.0.1:5001/api/company-info');
      const data = await res.json();
      if (data.name) setCompanyInfo(data);
    } catch (e) { console.error('Error fetching company info:', e); }
  };

  useEffect(() => {
    if (activeView === 'employeesView') fetchUsers();
  }, [activeView]);

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://127.0.0.1:5001/api/users');
      const data = await res.json();
      if (Array.isArray(data)) setAllUsers(data);
    } catch (e) { console.error('Error fetching users:', e); }
  };

  useEffect(() => {
    if (companyInfo.name) {
      setFormData(prev => ({
        ...prev,
        companyName: companyInfo.name,
        companyAddress: companyInfo.address,
        companyGst: companyInfo.gst,
        bankName: companyInfo.bank_name,
        acNo: companyInfo.account_no,
        ifscCode: companyInfo.ifsc,
        branch: companyInfo.branch,
        companyContact: companyInfo.contact
      }));
    }
  }, [companyInfo]);

  const [invoiceSearch, setInvoiceSearch] = useState('');
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState('All');

  const filteredHistoryInvoices = (currentUser.role === 'Admin' || currentUser.role === 'Accountant' ? invoices : invoices.filter(inv => inv.created_by === currentUser.username))
    .filter(inv => {
      const matchesSearch = inv.pi_number.toLowerCase().includes(invoiceSearch.toLowerCase()) ||
        inv.client_name.toLowerCase().includes(invoiceSearch.toLowerCase());
      const currentStatus = inv.status || 'Pending';
      const matchesStatus = invoiceStatusFilter === 'All' || currentStatus.toLowerCase() === invoiceStatusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });

  const handleEditUser = (user) => {
    setEditingUser({ ...user });
    setShowEditUserModal(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://127.0.0.1:5001/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingUser)
      });
      if (res.ok) {
        alert('Employee updated successfully!');
        fetchUsers();
        setShowEditUserModal(false);
      } else {
        const errorData = await res.json();
        alert('Error: ' + (errorData.error || 'Unknown error'));
      }
    } catch (err) {
      console.error(err);
      alert('Network error: ' + err.message + '. Please ensure the backend server is running.');
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        const res = await fetch(`http://127.0.0.1:5001/api/users/${id}`, { method: 'DELETE' });
        if (res.ok) fetchUsers();
      } catch (err) { console.error(err); }
    }
  };

  const fetchInvoices = async () => {
    try {
      console.log('Fetching invoices...');
      const res = await fetch('http://127.0.0.1:5001/api/invoices');
      const data = await res.json();
      console.log('Invoices received:', data);
      if (Array.isArray(data)) {
        setInvoices(data);
      } else if (data.error) {
        console.error('Server error fetching invoices:', data.error);
      }
    } catch (e) { console.error('Error fetching invoices:', e); }
  };

  const handleDeleteCustomer = (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      setCustomers(customers.filter(c => c.id !== id));
    }
  };

  const handleEditCustomer = (cust) => {
    setEditingCustomer(cust);
    setShowEditCustomerModal(true);
  };

  const handleUpdateCustomer = async (e) => {
    e.preventDefault();
    try {
      if (editingCustomer.id) {
        await fetch(`http://127.0.0.1:5001/api/customers/${editingCustomer.id}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editingCustomer)
        });
      }
      setCustomers(customers.map(c => c.id === editingCustomer.id ? editingCustomer : c));
      setShowEditCustomerModal(false);
    } catch (err) { console.error(err); }
  };
  const fetchCustomers = async () => {
    try {
      const res = await fetch('http://127.0.0.1:5001/api/customers');
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setCustomers(prev => {
          // Merge and keep unique names
          const existingNames = new Set(prev.map(c => c.name));
          const newOnes = data.filter(c => !existingNames.has(c.name));
          return [...prev, ...newOnes];
        });
      }
    } catch (e) { console.error('Error fetching customers:', e); }
  };

  const fetchProducts = async () => {
    try {
      console.log('Fetching products...');
      const res = await fetch('http://127.0.0.1:5001/api/products');
      const data = await res.json();
      console.log('Products received:', data);
      if (Array.isArray(data)) {
        if (data.length > 0) setMasterProducts(data);
      }
    } catch (e) { console.error('Error fetching products:', e); }
  };

  // --- Form State exactly matching original ---
  const [formData, setFormData] = useState({
    companyName: 'SIKKO INDUSTRIES LTD',
    piNumber: `PI-${Math.floor(1000 + Math.random() * 9000)}`,
    piDate: new Date().toISOString().split('T')[0],
    companyAddress: 'Reg. Office: 508, ISCON ELEGANCE, NR. JAIN TEMPLE, PRAHLADNAGAR, S.G. HIGHWAY, AHMEDABAD-380015 (GUJARAT)\nDispatch Address: 55 A & B, AMBICA ESTATE, SANAND-VIRAMGAM HIGHWAY, VILLAGE : IYAVA, TAL : SANAND, DIST: AHMEDABAD.',
    companyGst: '24AAGCS0629C1ZT',
    companyPerson: 'Ms. Manisha Chavada',
    companyContact: '7069026163',
    consigneeName: '',
    consigneeAddress: '',
    consigneeGst: '',
    consigneePerson: '',
    consigneeContact: '',
    transporterName: '',
    deliveryLocation: '',
    bankName: 'ICICI BANK LTD.',
    acName: 'Sikko Industries Ltd.',
    acNo: '423551000001',
    ifscCode: 'ICIC0004235',
    branch: 'Makarba Ahmedabad (Gujarat)',
    freightCharges: 0,
    roundOff: 0,
    prevCrAmt: 0,
    termsConditions: `1. Ones this proforma Invoice is confirmed by the consignee, it can not be changed OR cancelled.\n2. Payment Terms : 100% Advanced\n3. All good sent outstation is at buyer's risk.\n4. All dispute will be settled at court of law- Ahmedabad (Gujarat) Jurisdiction.\n5. Above quoted prices are all exfactory (Ahmedabad-Gujarat).\n6. Goods sold once will not be taken back at any circumstances.\n7. Material will dispatch WITHIN 15 days after payment procedure.`,
    logoImg: sikkoLogo,
    signImg: '',
    stampImg: ''
  });

  const [products, setProducts] = useState([
    { id: Date.now(), name: 'SIKKO FERT', hsn: '3105', pack: '200', unit: 'Ltr', qt: 1, qty: 200, price: 500, cgst: 9, sgst: 9, igst: 0 }
  ]);

  const [newProductMaster, setNewProductMaster] = useState({ name: '', hsn: '', pack: '', price: '', cat: '' });
  const [loginData, setLoginData] = useState({ employeeId: '', username: '', password: '' });

  // --- Calculations ---
  const calculateTotals = () => {
    let totalQty = 0;
    let totalTaxable = 0;
    let totalGstAmt = 0;

    products.forEach(p => {
      const q = parseFloat(p.qty) || 0;
      const pr = parseFloat(p.price) || 0;
      const taxable = q * pr;
      const gstRate = (parseFloat(p.cgst) || 0) + (parseFloat(p.sgst) || 0) + (parseFloat(p.igst) || 0);
      const gstAmt = taxable * (gstRate / 100);
      totalQty += q;
      totalTaxable += taxable;
      totalGstAmt += gstAmt;
    });

    const subTotal = totalTaxable + totalGstAmt;
    const finalAmt = subTotal + (parseFloat(formData.freightCharges) || 0) + (parseFloat(formData.roundOff) || 0) - (parseFloat(formData.prevCrAmt) || 0);

    return { totalQty, totalTaxable, totalGstAmt, subTotal, finalAmt };
  };

  const { totalQty, totalTaxable, totalGstAmt, subTotal, finalAmt } = calculateTotals();

  const filteredInvoices = currentUser.role === 'Admin'
    ? invoices
    : invoices.filter(inv => inv.created_by === currentUser.username);

  const numberToWords = (num) => {
    const a = ['', 'ONE ', 'TWO ', 'THREE ', 'FOUR ', 'FIVE ', 'SIX ', 'SEVEN ', 'EIGHT ', 'NINE ', 'TEN ', 'ELEVEN ', 'TWELVE ', 'THIRTEEN ', 'FOURTEEN ', 'FIFTEEN ', 'SIXTEEN ', 'SEVENTEEN ', 'EIGHTEEN ', 'NINETEEN '];
    const b = ['', '', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY'];
    const regex = /^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/;
    const getWords = (n) => {
      let numStr = ('000000000' + n).substr(-9);
      let match = numStr.match(regex);
      if (!match) return '';
      let str = '';
      str += (match[1] != 0) ? (a[Number(match[1])] || b[match[1][0]] + ' ' + a[match[1][1]]) + 'CRORE ' : '';
      str += (match[2] != 0) ? (a[Number(match[2])] || b[match[2][0]] + ' ' + a[match[2][1]]) + 'LAKH ' : '';
      str += (match[3] != 0) ? (a[Number(match[3])] || b[match[3][0]] + ' ' + a[match[3][1]]) + 'THOUSAND ' : '';
      str += (match[4] != 0) ? (a[Number(match[4])] || b[match[4][0]] + ' ' + a[match[4][1]]) + 'HUNDRED ' : '';
      str += (match[5] != 0) ? ((str != '') ? 'AND ' : '') + (a[Number(match[5])] || b[match[5][0]] + ' ' + a[match[5][1]]) : '';
      return str;
    };
    let parts = num.toFixed(2).toString().split('.');
    let rupees = getWords(parseInt(parts[0]));
    let paise = parseInt(parts[1]) > 0 ? ' AND ' + getWords(parseInt(parts[1])) + 'PAISE' : '';
    return (rupees || 'ZERO ') + paise + ' ONLY';
  };

  // --- Handlers ---
  const handleLogin = async (e) => {
    e.preventDefault();
    const formDataObj = new FormData(e.target);
    const name = formDataObj.get('name');
    const employeeId = formDataObj.get('employeeId');
    const usernameInput = formDataObj.get('username');
    const password = formDataObj.get('password');
    const role = formDataObj.get('role');

    const endpoint = authMode === 'login' ? '/api/login' : '/api/signup';

    try {
      const res = await fetch(`http://127.0.0.1:5001${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          employeeId,
          username: usernameInput,
          email: usernameInput, // Backend expects 'email' for login (even if it's a username)
          password,
          role
        })
      });

      const data = await res.json();

      if (data.success) {
        setCurrentUser({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          username: data.user.username,
          role: data.user.role,
          employeeId: data.user.employee_id
        });
        setIsLoggedIn(true);
        setActiveView('dashboardView');
      } else {
        alert(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Auth error:', err);
      alert('Connection error. Is the server running?');
    }
  };

  const handleLogout = () => setIsLoggedIn(false);

  const changeView = (view) => {
    setIsTransitioning(true);
    setTimeout(() => { setActiveView(view); setIsTransitioning(false); }, 300);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleCustomerSelect = (e) => {
    const customer = customers.find(c => c.name === e.target.value);
    if (customer) {
      setFormData(prev => ({
        ...prev,
        consigneeName: customer.name,
        consigneeGst: customer.gst || '',
        consigneeContact: customer.contact || customer.phone || '',
        consigneeAddress: customer.address || '',
        consigneePerson: customer.person || customer.name || ''
      }));
    }
  };

  const handleImageUpload = (e, key) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setFormData(prev => ({ ...prev, [key]: ev.target.result }));
      reader.readAsDataURL(file);
    }
  };

  const addProduct = () => setProducts([...products, { id: Date.now(), name: 'SIKKO FERT', hsn: '3105', pack: '200', unit: 'Ltr', qt: 1, qty: 200, price: 500, cgst: 9, sgst: 9, igst: 0 }]);

  const updateProduct = (id, field, value) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const updateProductRow = (id, newValues) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...newValues } : p));
  };

  const removeProduct = (id) => setProducts(products.filter(p => p.id !== id));

  const handleDeleteProductMaster = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setMasterProducts(masterProducts.filter(p => p.id !== id));
    }
  };

  const handleEditProductMaster = (product) => {
    setEditingProduct({ ...product });
    setShowEditProductModal(true);
  };

  const handleUpdateProductMaster = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct.id) {
        await fetch(`http://127.0.0.1:5001/api/products/${editingProduct.id}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editingProduct)
        });
      }
      setMasterProducts(masterProducts.map(p => p.id === editingProduct.id ? editingProduct : p));
      setShowEditProductModal(false);
    } catch (err) { console.error(err); }
  };

  const loadInvoiceForView = async (id) => {
    try {
      const res = await fetch(`http://127.0.0.1:5001/api/invoices/${id}`);
      if (!res.ok) throw new Error('Failed to fetch invoice');
      const data = await res.json();
      
      // Map data to formData structure
      setFormData({
        ...formData,
        piNumber: data.pi_number,
        consigneeName: data.client_name,
        // Other fields might need to be fetched from a more complex table, 
        // but for now we'll load what we have.
      });
      
      // Map items to products structure
      const loadedProducts = data.items.map(item => ({
        id: item.id,
        name: item.product_name,
        qty: item.qty,
        price: item.price,
        total: item.qty * item.price
      }));
      setProducts(loadedProducts);
      setFinalAmt(data.total_amount);
      
      // Switch view
      setActiveView('invoiceView');
    } catch (err) {
      console.error('Error loading invoice:', err);
      alert('Could not load invoice details');
    }
  };

  const saveInvoice = async () => {
    try {
      const res = await fetch('http://127.0.0.1:5001/api/save-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formData, products, finalAmt, created_by: currentUser.username })
      });
      const data = await res.json();
      if (data.message === 'Success') {
        if (typeof fetchInvoices === 'function') fetchInvoices();
      }
    } catch (e) { console.error('Error saving invoice to MySQL'); }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const res = await fetch(`http://127.0.0.1:5001/api/invoices/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: newStatus } : inv));
      }
    } catch (err) { console.error('Error updating status:', err); }
  };

  const generatePDF = () => {
    const doPDF = () => {
      const element = document.getElementById('invoiceA4');
      if (!element) return;
      const opt = {
        margin: 0,
        filename: `Invoice_${formData.piNumber || '001'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };
      window.html2pdf().set(opt).from(element).save().then(() => {
        saveInvoice();
      });
    };

    if (!showPreviewModal) {
      setShowPreviewModal(true);
      setTimeout(doPDF, 500); // wait for modal render
    } else {
      doPDF();
    }
  };

  // --- Render Login ---
  if (!isLoggedIn) {
    return (
      <div style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'var(--sans)'
      }}>
        {/* Background Image with Overlay */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 0,
          overflow: 'hidden'
        }}>
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          >
            <source src={bannerVideo} type="video/mp4" />
          </video>
        </div>
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.4) 0%, rgba(15, 23, 42, 0.2) 100%)',
          zIndex: 1
        }}></div>

        <div style={{
          width: '100%',
          maxWidth: '480px',
          background: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          padding: '40px 40px',
          borderRadius: '24px',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          animation: 'fadeInUp 0.6s ease-out',
          zIndex: 2,
          position: 'relative'
        }}>
          {/* Logo Section */}
          <div style={{ marginBottom: '25px' }}>
            <img
              src={sikkoLogo}
              alt="Sikko Logo"
              style={{ height: '100px', width: '100px', objectFit: 'contain', borderRadius: '50%', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
            />
          </div>

          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px', letterSpacing: '-0.5px' }}>
            {authMode === 'login' ? 'Welcome' : 'Create Account'}
          </h2>
          <p style={{ color: '#0f172a', fontSize: '0.95rem', marginBottom: '30px', fontWeight: '500' }}>SIKKO INDUSTRIES LTD - ERP Access</p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>

            {authMode === 'signup' && (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ color: '#0f172a', fontSize: '0.85rem', fontWeight: '700' }}>Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <i className="fa-solid fa-user-tag" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
                    <input type="text" name="name" placeholder="Enter Full Name" required style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ color: '#0f172a', fontSize: '0.85rem', fontWeight: '700' }}>Employee ID</label>
                  <div style={{ position: 'relative' }}>
                    <i className="fa-solid fa-id-card" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
                    <input type="text" name="employeeId" placeholder="EMP-XXXX" required style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                  </div>
                </div>
              </>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: '#0f172a', fontSize: '0.85rem', fontWeight: '700' }}>{authMode === 'login' ? 'Username' : 'Email Address'}</label>
              <div style={{ position: 'relative' }}>
                <i className={`fa-solid ${authMode === 'login' ? 'fa-user' : 'fa-envelope'}`} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
                <input name="username" type={authMode === 'login' ? 'text' : 'email'} placeholder={authMode === 'login' ? 'Enter Username' : 'Enter Email Address'} required style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ color: '#0f172a', fontSize: '0.85rem', fontWeight: '700' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <i className="fa-solid fa-lock" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
                <input name="password" type="password" placeholder="••••••••" required style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
              </div>
            </div>

            {authMode === 'signup' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ color: '#0f172a', fontSize: '0.85rem', fontWeight: '700' }}>Assigned Role</label>
                <div style={{ position: 'relative' }}>
                  <i className="fa-solid fa-user-tag" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
                  <select name="role" required style={inputStyle} onFocus={handleFocus} onBlur={handleBlur}>
                    <option value="">Select Role</option>
                    <option value="Admin">Admin</option>
                    <option value="Sales">Sales</option>
                    <option value="Accountant">Accountant</option>
                  </select>
                </div>
              </div>
            )}

            <button type="submit" style={btnStyle} onMouseOver={handleBtnHover} onMouseOut={handleBtnOut}>
              {authMode === 'login' ? 'Login' : 'Create & Sign In'}
            </button>
          </form>

          <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
            <p style={{ color: '#0f172a', fontSize: '0.9rem', marginBottom: '10px' }}>
              {authMode === 'login' ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: '700', cursor: 'pointer', marginLeft: '8px' }}
              >
                {authMode === 'login' ? 'Sign Up' : 'Log In'}
              </button>
            </p>
            <p style={{ color: '#0f172a', fontSize: '0.8rem' }}>&copy; 2026 Sikko Industries Ltd. ERP</p>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="app-container" style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      <aside className="sidebar">
        <div className="sidebar-logo" style={{ padding: '1.5rem 1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src={sikkoLogo} alt="SIKKO Logo" style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
          <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#1e293b', lineHeight: '1.2' }}>SIKKO <br /> INDUSTRIES LTD</span>
        </div>
        <ul className="sidebar-nav">
          <li><a href="#" className={`nav-link ${activeView === 'dashboardView' ? 'active' : ''}`} onClick={() => changeView('dashboardView')}><i className="fa-solid fa-chart-pie"></i> Dashboard</a></li>
          <li><a href="#" className={`nav-link ${activeView === 'invoiceView' ? 'active' : ''}`} onClick={() => changeView('invoiceView')}><i className="fa-solid fa-file-invoice"></i> Create Invoice</a></li>
          {currentUser.role === 'Accountant' && (
            <li><a href="#" className={`nav-link ${activeView === 'accountantInvoicesView' ? 'active' : ''}`} onClick={() => changeView('accountantInvoicesView')}><i className="fa-solid fa-file-shield"></i> Manage Invoices</a></li>
          )}
          <li><a href="#" className={`nav-link ${activeView === 'invoiceHistoryView' ? 'active' : ''}`} onClick={() => changeView('invoiceHistoryView')}><i className="fa-solid fa-clock-rotate-left"></i> Invoice History</a></li>
          {currentUser.role === 'Admin' && (
            <>
              <li><a href="#" className={`nav-link ${activeView === 'customersView' ? 'active' : ''}`} onClick={() => changeView('customersView')}><i className="fa-solid fa-users"></i> Customers</a></li>
              <li><a href="#" className={`nav-link ${activeView === 'productsView' ? 'active' : ''}`} onClick={() => changeView('productsView')}><i className="fa-solid fa-box"></i> Products</a></li>
              <li><a href="#" className={`nav-link ${activeView === 'employeesView' ? 'active' : ''}`} onClick={() => changeView('employeesView')}><i className="fa-solid fa-user-gear"></i> Employees</a></li>
            </>
          )}
          <li><a href="#" className={`nav-link ${activeView === 'reportsView' ? 'active' : ''}`} onClick={() => changeView('reportsView')}><i className="fa-solid fa-chart-line"></i> Reports</a></li>
          <li><a href="#" className={`nav-link ${activeView === 'settingsView' ? 'active' : ''}`} onClick={() => changeView('settingsView')}><i className="fa-solid fa-gear"></i> Settings</a></li>
        </ul>
        <div className="sidebar-footer" style={{ marginTop: 'auto', padding: '1rem', borderTop: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f8fafc', padding: '10px', borderRadius: '12px' }}>
            <div style={{
              width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: '700', fontSize: '0.9rem',
              boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)'
            }}>
              {currentUser.username ? currentUser.username.charAt(0).toUpperCase() : 'A'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentUser.username || 'Admin User'}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '500' }}>
                {currentUser.role}
              </div>
            </div>
            <button
              className="logout-btn-minimal"
              onClick={handleLogout}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '5px', transition: 'all 0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.color = '#ef4444'}
              onMouseOut={(e) => e.currentTarget.style.color = '#94a3b8'}
              title="Sign Out"
            >
              <i className="fa-solid fa-right-from-bracket"></i>
            </button>
          </div>
        </div>
      </aside>

      <main className="main-content" style={{ flex: 1, overflowY: 'auto' }}>
        <div className={`view-transition-wrapper ${isTransitioning ? 'fading' : ''}`}>
          {activeView === 'dashboardView' && (
            <section className="view-section">
              <header className="top-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>{currentUser.role} Dashboard</h2>
                  <span style={{ background: '#f1f5f9', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600', color: '#64748b' }}>
                    Welcome, {currentUser.username}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="btn btn-primary" onClick={() => changeView('invoiceView')}><i className="fa-solid fa-plus"></i> Generate New Invoice</button>
                </div>
              </header>
              <div className="view-body" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                {/* Quick Actions */}
                <div className="quick-actions-grid" style={{ display: 'grid', gridTemplateColumns: currentUser.role === 'Admin' ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)', gap: '1.5rem', marginTop: '1rem' }}>
                  {currentUser.role === 'Admin' && (
                    <div className="action-card card-hover" onClick={() => setShowAddCustomerModal(true)} style={{ background: 'var(--bg)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div style={{ background: '#e0e7ff', color: '#4f46e5', padding: '15px', borderRadius: '50%' }}><i className="fa-solid fa-user-plus fa-lg"></i></div>
                      <div><h4 style={{ margin: 0, fontSize: '1.1rem' }}>Add Customer</h4><p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Add a new client to your directory</p></div>
                    </div>
                  )}
                  <div className="action-card card-hover" onClick={() => changeView('invoiceView')} style={{ background: 'var(--bg)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ background: '#fef3c7', color: '#d97706', padding: '15px', borderRadius: '50%' }}><i className="fa-solid fa-file-invoice fa-lg"></i></div>
                    <div><h4 style={{ margin: 0, fontSize: '1.1rem' }}>Create Invoice</h4><p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Generate a new proforma invoice</p></div>
                  </div>
                  <div className="action-card card-hover" onClick={() => changeView('reportsView')} style={{ background: 'var(--bg)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ background: '#d1fae5', color: '#059669', padding: '15px', borderRadius: '50%' }}><i className="fa-solid fa-chart-line fa-lg"></i></div>
                    <div><h4 style={{ margin: 0, fontSize: '1.1rem' }}>View Reports</h4><p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Check sales & payment reports</p></div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="stats-grid" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1.5rem'
                }}>
                  {currentUser.role === 'Admin' && (
                    <div className="stat-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><i className="fa-solid fa-user-tie" style={{ color: '#6366f1', fontSize: '1.5rem' }}></i></div>
                      <h3 style={{ fontSize: '1.8rem', margin: 0 }}>{allUsers.length}</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, textTransform: 'uppercase', fontWeight: '600' }}>Total Users</p>
                    </div>
                  )}
                  {(currentUser.role === 'Admin' || currentUser.role === 'Accountant' || currentUser.role === 'Sales') && (
                    <div className="stat-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><i className="fa-solid fa-users" style={{ color: '#3b82f6', fontSize: '1.5rem' }}></i></div>
                      <h3 style={{ fontSize: '1.8rem', margin: 0 }}>{customers.length}</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, textTransform: 'uppercase', fontWeight: '600' }}>Total Clients</p>
                    </div>
                  )}
                  {(currentUser.role === 'Admin' || currentUser.role === 'Accountant') && (
                    <div className="stat-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><i className="fa-solid fa-box-open" style={{ color: '#d97706', fontSize: '1.5rem' }}></i></div>
                      <h3 style={{ fontSize: '1.8rem', margin: 0 }}>{masterProducts.length}</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, textTransform: 'uppercase', fontWeight: '600' }}>Total Products</p>
                    </div>
                  )}
                  {currentUser.role === 'Sales' && (
                    <div className="stat-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><i className="fa-solid fa-cart-shopping" style={{ color: '#d97706', fontSize: '1.5rem' }}></i></div>
                      <h3 style={{ fontSize: '1.8rem', margin: 0 }}>{invoices.filter(i => i.created_by === currentUser.username).length}</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, textTransform: 'uppercase', fontWeight: '600' }}>Products Sold</p>
                    </div>
                  )}
                  <div className="stat-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><i className="fa-solid fa-file-invoice" style={{ color: '#8b5cf6', fontSize: '1.5rem' }}></i></div>
                    <h3 style={{ fontSize: '1.8rem', margin: 0 }}>{currentUser.role === 'Admin' || currentUser.role === 'Accountant' ? invoices.length : invoices.filter(i => i.created_by === currentUser.username).length}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, textTransform: 'uppercase', fontWeight: '600' }}>Total Invoices</p>
                  </div>
                  <div className="stat-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><i className="fa-solid fa-sack-dollar" style={{ color: '#10b981', fontSize: '1.5rem' }}></i></div>
                    <h3 style={{ fontSize: '1.8rem', margin: 0 }}>₹ {(currentUser.role === 'Admin' || currentUser.role === 'Accountant' ? invoices : invoices.filter(i => i.created_by === currentUser.username)).reduce((s, i) => s + parseFloat(i.total_amount), 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, textTransform: 'uppercase', fontWeight: '600' }}>Total Revenue</p>
                  </div>
                </div>

                {/* Dashboard Charts Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
                  {/* Sales Trend Bar Chart */}
                  <div className="form-card" style={{ padding: '1.5rem', minHeight: '350px' }}>
                    <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.1rem' }}>
                      <i className="fa-solid fa-chart-simple" style={{ color: '#6366f1', marginRight: '10px' }}></i> Monthly Sales Trend
                    </h3>
                    <div style={{ width: '100%', height: '250px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { name: 'Jan', sales: 4000 },
                          { name: 'Feb', sales: 3000 },
                          { name: 'Mar', sales: 5000 },
                          { name: 'Apr', sales: 8000 },
                          { name: 'May', sales: 6000 },
                          { name: 'Jun', sales: 9000 },
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                          <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                            cursor={{ fill: '#f1f5f9' }}
                          />
                          <Bar dataKey="sales" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={35} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Category Pie Chart */}
                  <div className="form-card" style={{ padding: '1.5rem', minHeight: '350px' }}>
                    <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.1rem' }}>
                      <i className="fa-solid fa-chart-pie" style={{ color: '#ec4899', marginRight: '10px' }}></i> Product Distribution
                    </h3>
                    <div style={{ width: '100%', height: '250px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Agro Chem', value: 400 },
                              { name: 'Fertilizers', value: 300 },
                              { name: 'Seeds', value: 200 },
                              { name: 'FMCG', value: 100 },
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {['#6366f1', '#10b981', '#f59e0b', '#ef4444'].map((color, index) => (
                              <Cell key={`cell-${index}`} fill={color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Recent Invoices Table */}
                <div className="form-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}><i className="fa-regular fa-clock" style={{ marginRight: '8px', color: '#64748b' }}></i>Recent Invoices</h3>
                    <button className="btn btn-secondary" style={{ padding: '5px 15px', fontSize: '0.85rem' }} onClick={() => changeView('reportsView')}>View All</button>
                  </div>
                  <div className="table-responsive">
                    <table className="clean-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.85rem', textAlign: 'left', textTransform: 'uppercase' }}>
                          <th style={{ padding: '1rem', fontWeight: '600' }}>Invoice No.</th>
                          <th style={{ padding: '1rem', fontWeight: '600' }}>Date</th>
                          <th style={{ padding: '1rem', fontWeight: '600' }}>Customer</th>
                          <th style={{ padding: '1rem', fontWeight: '600' }}>Amount</th>
                          <th style={{ padding: '1rem', fontWeight: '600' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredInvoices.slice(0, 5).map(inv => (
                          <tr key={inv.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '1rem', fontWeight: '500' }}>{inv.pi_number}</td>
                            <td style={{ padding: '1rem', color: '#64748b' }}>{new Date(inv.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                            <td style={{ padding: '1rem' }}>{inv.client_name}</td>
                            <td style={{ padding: '1rem', fontWeight: '600' }}>₹ {parseFloat(inv.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                            <td style={{ padding: '1rem' }}>
                              <span style={{
                                background: (inv.status || 'PAID').toUpperCase() === 'PAID' ? '#dcfce7' : (inv.status || '').toUpperCase() === 'PENDING' ? '#fef3c7' : '#f1f5f9',
                                color: (inv.status || 'PAID').toUpperCase() === 'PAID' ? '#166534' : (inv.status || '').toUpperCase() === 'PENDING' ? '#92400e' : '#475569',
                                padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600'
                              }}>
                                {(inv.status || 'PAID').toUpperCase()}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {invoices.length === 0 && <tr><td colSpan="5" className="text-center text-muted" style={{ padding: '2rem' }}>No recent invoices found.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </section>
          )}

          {activeView === 'invoiceHistoryView' && (
            <section className="view-section">
              <header className="top-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}><i className="fa-solid fa-clock-rotate-left" style={{ marginRight: '10px', color: '#6366f1' }}></i>Invoice History</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <div style={{ position: 'relative' }}>
                    <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}></i>
                    <input type="text" placeholder="Search Invoices..." value={invoiceSearch} onChange={e => setInvoiceSearch(e.target.value)} style={{ padding: '8px 12px 8px 35px', borderRadius: '8px', border: '1px solid #e2e8f0', width: '250px' }} />
                  </div>
                  <select value={invoiceStatusFilter} onChange={e => setInvoiceStatusFilter(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff' }}>
                    <option value="All">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Declined">Declined</option>
                  </select>
                </div>
              </header>
              <div className="view-body">
                <div className="form-card">
                  <div className="table-responsive">
                    <table className="clean-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.85rem', textAlign: 'left', textTransform: 'uppercase' }}>
                          <th style={{ padding: '1rem', fontWeight: '600' }}>Invoice No.</th>
                          <th style={{ padding: '1rem', fontWeight: '600' }}>Date</th>
                          <th style={{ padding: '1rem', fontWeight: '600' }}>Customer</th>
                          <th style={{ padding: '1rem', fontWeight: '600' }}>Amount</th>
                          <th style={{ padding: '1rem', fontWeight: '600' }}>Created By</th>
                          <th style={{ padding: '1rem', fontWeight: '600' }}>Status</th>
                          <th style={{ padding: '1rem', fontWeight: '600' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredHistoryInvoices.map(inv => (
                          <tr key={inv.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '1rem', fontWeight: '500' }}>{inv.pi_number}</td>
                            <td style={{ padding: '1rem', color: '#64748b' }}>{new Date(inv.created_at).toLocaleDateString('en-GB')}</td>
                            <td style={{ padding: '1rem' }}>{inv.client_name}</td>
                            <td style={{ padding: '1rem', fontWeight: '600' }}>₹ {parseFloat(inv.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                            <td style={{ padding: '1rem', fontSize: '0.85rem' }}>{inv.created_by}</td>
                            <td style={{ padding: '1rem' }}>
                              <span style={{
                                background: inv.status === 'Approved' ? '#dcfce7' : inv.status === 'Declined' ? '#fee2e2' : '#fef3c7',
                                color: inv.status === 'Approved' ? '#166534' : inv.status === 'Declined' ? '#991b1b' : '#92400e',
                                padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600'
                              }}>
                                {inv.status || 'Pending'}
                              </span>
                            </td>
                            <td style={{ padding: '1rem' }}>
                              {inv.status === 'Approved' && (
                                <button className="btn btn-secondary" style={{ padding: '5px 10px', fontSize: '0.8rem', background: '#eff6ff', color: '#2563eb', border: '1px solid #dbeafe' }} onClick={() => {
                                  setFormData({ ...formData, piNumber: inv.pi_number, consigneeName: inv.client_name });
                                  setShowPreviewModal(true);
                                }}>
                                  <i className="fa-solid fa-download"></i> PDF
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeView === 'accountantInvoicesView' && (
            <section className="view-section">
              <header className="top-header">
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}><i className="fa-solid fa-file-shield" style={{ marginRight: '10px', color: '#0ea5e9' }}></i>Invoice Management (Accountant Review)</h2>
              </header>
              <div className="view-body">
                <div className="form-card">
                  <div className="table-responsive">
                    <table className="clean-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.85rem', textAlign: 'left', textTransform: 'uppercase' }}>
                          <th style={{ padding: '1rem', fontWeight: '600' }}>Invoice No.</th>
                          <th style={{ padding: '1rem', fontWeight: '600' }}>Date</th>
                          <th style={{ padding: '1rem', fontWeight: '600' }}>Customer</th>
                          <th style={{ padding: '1rem', fontWeight: '600' }}>Amount</th>
                          <th style={{ padding: '1rem', fontWeight: '600' }}>Sales Person</th>
                          <th style={{ padding: '1rem', fontWeight: '600' }}>Current Status</th>
                          <th style={{ padding: '1rem', fontWeight: '600' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoices.map(inv => (
                          <tr key={inv.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '1rem', fontWeight: '500' }}>{inv.pi_number}</td>
                            <td style={{ padding: '1rem', color: '#64748b' }}>{new Date(inv.created_at).toLocaleDateString('en-GB')}</td>
                            <td style={{ padding: '1rem' }}>{inv.client_name}</td>
                            <td style={{ padding: '1rem', fontWeight: '600' }}>₹ {parseFloat(inv.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                            <td style={{ padding: '1rem' }}>{inv.created_by}</td>
                            <td style={{ padding: '1rem' }}>
                              <span style={{
                                background: inv.status === 'Approved' ? '#dcfce7' : inv.status === 'Declined' ? '#fee2e2' : '#fef3c7',
                                color: inv.status === 'Approved' ? '#166534' : inv.status === 'Declined' ? '#991b1b' : '#92400e',
                                padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600'
                              }}>
                                {inv.status || 'Pending'}
                              </span>
                            </td>
                            <td style={{ padding: '1rem' }}>
                              {inv.status === 'Pending' && (
                                <div style={{ display: 'flex', gap: '5px' }}>
                                  <button className="btn btn-primary" style={{ padding: '5px 10px', fontSize: '0.75rem', background: '#059669' }} onClick={() => handleStatusUpdate(inv.id, 'Approved')}>Approve</button>
                                  <button className="btn btn-danger" style={{ padding: '5px 10px', fontSize: '0.75rem', background: '#dc2626' }} onClick={() => handleStatusUpdate(inv.id, 'Declined')}>Decline</button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>
          )}



          {activeView === 'customersView' && (
            <section className="view-section">
              <header className="top-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i className="fa-solid fa-users" style={{ color: '#2563eb', fontSize: '1.5rem' }}></i>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0, color: '#1e293b' }}>Customers</h2>
                </div>
                <button className="btn btn-primary" onClick={() => setShowAddCustomerModal(true)} style={{ background: '#2563eb', borderRadius: '10px', padding: '10px 20px', fontWeight: '600' }}>
                  <i className="fa-solid fa-plus" style={{ marginRight: '8px' }}></i> Add Customer
                </button>
              </header>
              <div className="view-body" style={{ marginTop: '1.5rem' }}>
                <div className="form-card" style={{ padding: 0, overflow: 'hidden' }}>
                  <div className="table-responsive">
                    <table className="clean-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', background: '#f8fafc' }}>
                          <th style={{ padding: '15px 20px', fontWeight: '600' }}>Name</th>
                          <th style={{ padding: '15px 20px', fontWeight: '600' }}>Company</th>
                          <th style={{ padding: '15px 20px', fontWeight: '600' }}>Phone</th>
                          <th style={{ padding: '15px 20px', fontWeight: '600' }}>Email</th>
                          <th style={{ padding: '15px 20px', fontWeight: '600' }}>Gst No.</th>
                          <th style={{ padding: '15px 20px', fontWeight: '600' }}>City</th>
                          <th style={{ padding: '15px 20px', fontWeight: '600', textAlign: 'center' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customers.map((cust) => (
                          <tr key={cust.id} style={{ borderBottom: '1px solid #f1f5f9', background: '#fff' }}>
                            <td style={{ padding: '15px 20px', fontWeight: '500', color: '#1e293b' }}>{cust.name}</td>
                            <td style={{ padding: '15px 20px', color: '#64748b' }}>{cust.company}</td>
                            <td style={{ padding: '15px 20px', color: '#64748b' }}>{cust.phone}</td>
                            <td style={{ padding: '15px 20px', color: '#64748b', fontSize: '0.9rem' }}>{cust.email}</td>
                            <td style={{ padding: '15px 20px', color: '#64748b' }}>{cust.gst}</td>
                            <td style={{ padding: '15px 20px', color: '#64748b' }}>{cust.city}</td>
                            <td style={{ padding: '15px 20px', textAlign: 'center' }}>
                              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                <button onClick={() => handleEditCustomer(cust)} className="btn-clean" style={{ color: '#2563eb', background: '#eff6ff', padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}><i className="fa-solid fa-pen" style={{ marginRight: '5px' }}></i> Edit</button>
                                <button onClick={() => handleDeleteCustomer(cust.id)} className="btn-clean" style={{ color: '#ef4444', background: '#fef2f2', padding: '6px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}><i className="fa-solid fa-trash-can"></i></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeView === 'productsView' && (
            <section className="view-section">
              <header className="top-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i className="fa-solid fa-box-open" style={{ color: '#d97706', fontSize: '1.5rem' }}></i>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '600', margin: 0, color: '#1e3a8a' }}>Products</h2>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <span style={{ color: '#64748b', fontSize: '0.9rem' }}>40 products</span>
                  <button className="btn btn-primary" onClick={() => setShowAddProductModal(true)} style={{ background: '#2563eb', border: 'none', borderRadius: '8px', padding: '10px 20px', fontWeight: '600' }}>
                    <i className="fa-solid fa-plus" style={{ marginRight: '8px' }}></i> Add Product
                  </button>
                </div>
              </header>
              <div className="view-body" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '1rem' }}>

                {/* Categories Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                  <div
                    onClick={() => setSelectedCategory('ALL')}
                    style={{ background: selectedCategory === 'ALL' ? '#f0f9ff' : 'var(--bg)', border: selectedCategory === 'ALL' ? '2px solid #0ea5e9' : '1px solid #e2e8f0', borderRadius: '12px', padding: '15px', display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}
                    className="card-hover"
                  >
                    <div style={{ color: '#64748b', fontSize: '1.2rem' }}><i className="fa-solid fa-list"></i></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#1e293b' }}>ALL PRODUCTS</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0f172a' }}>{masterProducts.length}</div>
                    </div>
                  </div>
                  {[
                    { title: 'ORGANIC CERT. AGRO CHEMICALS', icon: 'fa-leaf', color: '#65a30d' },
                    { title: 'ORGANIC AGRO CHEMICALS', icon: 'fa-vial', color: '#84cc16' },
                    { title: 'AGRO CHEMICALS', icon: 'fa-flask', color: '#0ea5e9' },
                    { title: 'FERTILIZERS', icon: 'fa-seedling', color: '#d97706' },
                    { title: 'SEEDS', icon: 'fa-wheat-awn', color: '#eab308' },
                    { title: 'SPRAYERS', icon: 'fa-droplet', color: '#3b82f6' },
                    { title: 'FMCG PRODUCTS', icon: 'fa-cart-shopping', color: '#9ca3af' },
                    { title: 'HOUSEHOLD PRODUCTS', icon: 'fa-house', color: '#d97706' }
                  ].map((cat, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedCategory(cat.title)}
                      style={{
                        background: selectedCategory === cat.title ? '#f0f9ff' : 'var(--bg)',
                        border: selectedCategory === cat.title ? `2px solid ${cat.color}` : '1px solid #e2e8f0',
                        borderRadius: '12px', padding: '15px', display: 'flex', alignItems: 'flex-start', gap: '15px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
                      }}
                      className="card-hover"
                    >
                      <div style={{ color: cat.color, fontSize: '1.2rem', marginTop: '2px' }}><i className={`fa-solid ${cat.icon}`}></i></div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#334155', marginBottom: '5px', lineHeight: '1.2' }}>{cat.title}</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0f172a' }}>{masterProducts.filter(p => p.cat === cat.title).length}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Search Bar & Toggle */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg)', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '10px 15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '300px' }}>
                    <i className="fa-solid fa-magnifying-glass" style={{ color: '#0ea5e9' }}></i>
                    <input
                      type="text"
                      placeholder="Search products by name or category..."
                      style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem', color: '#475569' }}
                      value={productSearchTerm}
                      onChange={e => setProductSearchTerm(e.target.value)}
                    />
                  </div>
                  <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '8px', padding: '4px' }}>
                    <button
                      onClick={() => setProductListViewMode('table')}
                      style={{ background: productListViewMode === 'table' ? '#fff' : 'transparent', border: 'none', padding: '5px 15px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '600', color: productListViewMode === 'table' ? '#334155' : '#64748b', boxShadow: productListViewMode === 'table' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', cursor: 'pointer' }}
                    >
                      <i className="fa-solid fa-table" style={{ marginRight: '5px' }}></i> Table
                    </button>
                    <button
                      onClick={() => setProductListViewMode('grid')}
                      style={{ background: productListViewMode === 'grid' ? '#fff' : 'transparent', border: 'none', padding: '5px 15px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '600', color: productListViewMode === 'grid' ? '#334155' : '#64748b', boxShadow: productListViewMode === 'grid' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', cursor: 'pointer' }}
                    >
                      <i className="fa-solid fa-grip" style={{ marginRight: '5px' }}></i> Cards
                    </button>
                  </div>
                </div>

                {/* Conditional View: Table or Grid */}
                {productListViewMode === 'table' ? (
                  <div className="form-card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div className="table-responsive">
                      <table className="clean-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', background: '#f8fafc' }}>
                            <th style={{ padding: '15px 20px', fontWeight: '600' }}>Product</th>
                            <th style={{ padding: '15px 20px', fontWeight: '600' }}>HSN</th>
                            <th style={{ padding: '15px 20px', fontWeight: '600' }}>Price</th>
                            <th style={{ padding: '15px 20px', fontWeight: '600' }}>Unit</th>
                            <th style={{ padding: '15px 20px', fontWeight: '600' }}>Category</th>
                            <th style={{ padding: '15px 20px', fontWeight: '600' }}>Stock</th>
                            <th style={{ padding: '15px 20px', fontWeight: '600', textAlign: 'right' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {masterProducts
                            .filter(p => {
                              const matchesCat = selectedCategory === 'ALL' || p.cat === selectedCategory;
                              const matchesSearch = p.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
                                p.cat.toLowerCase().includes(productSearchTerm.toLowerCase());
                              return matchesCat && matchesSearch;
                            })
                            .map((prod) => (
                              <Fragment key={prod.id}>
                                <tr style={{ borderBottom: '1px solid #f1f5f9', background: expandedProductId === prod.id ? '#f8faff' : '#fff', cursor: 'pointer' }} onClick={() => setExpandedProductId(expandedProductId === prod.id ? null : prod.id)}>
                                  <td style={{ padding: '15px 20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                      <i className={`fa-solid ${expandedProductId === prod.id ? 'fa-chevron-down' : 'fa-chevron-right'}`} style={{ color: '#64748b', fontSize: '0.8rem' }}></i>
                                      <i className="fa-solid fa-box" style={{ color: '#6366f1', fontSize: '1.2rem' }}></i>
                                      <div>
                                        <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '0.95rem' }}>{prod.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>{prod.desc || 'General Product'}</div>
                                      </div>
                                    </div>
                                  </td>
                                  <td style={{ padding: '15px 20px', color: '#64748b', fontSize: '0.9rem' }}>{prod.hsn}</td>
                                  <td style={{ padding: '15px 20px', fontWeight: '700', color: '#059669', fontSize: '0.95rem' }}>₹{Number(prod.price || 0).toFixed(2)}</td>
                                  <td style={{ padding: '15px 20px', color: '#64748b', fontSize: '0.9rem' }}>{prod.unit}</td>
                                  <td style={{ padding: '15px 20px', fontSize: '0.85rem' }}><span style={{ color: '#2563eb', fontWeight: '500' }}>{prod.cat}</span></td>
                                  <td style={{ padding: '15px 20px', color: '#475569', fontWeight: '500', fontSize: '0.95rem' }}>{prod.stock || 0}</td>
                                  <td style={{ padding: '15px 20px', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }} onClick={e => e.stopPropagation()}>
                                      <button onClick={() => handleEditProductMaster(prod)} style={{ background: '#f1f5f9', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}><i className="fa-solid fa-pen-to-square"></i> Edit</button>
                                      <button onClick={() => handleDeleteProductMaster(prod.id)} style={{ background: '#fee2e2', border: 'none', padding: '6px 10px', borderRadius: '6px', fontSize: '0.8rem', color: '#ef4444', cursor: 'pointer' }}><i className="fa-solid fa-trash-can"></i></button>
                                    </div>
                                  </td>
                                </tr>
                                {expandedProductId === prod.id && prod.subproducts && prod.subproducts.length > 0 && (
                                  <tr style={{ background: '#f8faff' }}>
                                    <td colSpan="7" style={{ padding: '0 20px 20px 60px' }}>
                                      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '15px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                                        <h4 style={{ margin: '0 0 15px 0', fontSize: '0.9rem', color: '#1e293b', fontWeight: '700' }}>Product Variations (Packing Options)</h4>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                                          {prod.subproducts.map(sub => (
                                            <div key={sub.id} style={{ border: '1px solid #f1f5f9', borderRadius: '10px', padding: '12px', background: '#f8fafc' }}>
                                              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>Size: {sub.pack}</div>
                                              <div style={{ fontSize: '1.1rem', color: '#059669', fontWeight: '800', marginTop: '5px' }}>₹{Number(sub.price || 0).toFixed(2)}</div>
                                              <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                                                <button className="btn-clean-delete" style={{ padding: '5px' }}><i className="fa-solid fa-trash-can"></i></button>
                                              </div>
                                            </div>
                                          ))}
                                          <div style={{ border: '2px dashed #e2e8f0', borderRadius: '10px', padding: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#94a3b8' }}>
                                            <i className="fa-solid fa-plus" style={{ marginBottom: '5px' }}></i>
                                            <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>Add Size</span>
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </Fragment>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {masterProducts
                      .filter(p => {
                        const matchesCat = selectedCategory === 'ALL' || p.cat === selectedCategory;
                        const matchesSearch = p.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
                          p.cat.toLowerCase().includes(productSearchTerm.toLowerCase());
                        return matchesCat && matchesSearch;
                      })
                      .map(prod => (
                        <div key={prod.id} className="form-card card-hover" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '15px', position: 'relative' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ background: '#f0f9ff', padding: '10px', borderRadius: '12px' }}>
                              <i className="fa-solid fa-box" style={{ color: '#0ea5e9', fontSize: '1.5rem' }}></i>
                            </div>
                            <div style={{ display: 'flex', gap: '5px' }}>
                              <button onClick={() => handleEditProductMaster(prod)} style={{ background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', color: '#475569' }}><i className="fa-solid fa-pen-to-square"></i></button>
                              <button onClick={() => handleDeleteProductMaster(prod.id)} style={{ background: '#fee2e2', border: 'none', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', color: '#ef4444' }}><i className="fa-solid fa-trash-can"></i></button>
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b' }}>{prod.name}</div>
                            <div style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '5px 0' }}>{prod.cat}</div>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                              <span style={{ background: '#f1f5f9', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600', color: '#475569' }}>HSN: {prod.hsn}</span>
                              <span style={{ background: '#dcfce7', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600', color: '#166534' }}>Stock: {prod.stock || 0}</span>
                            </div>
                          </div>
                          <div style={{ marginTop: 'auto', paddingTop: '15px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#059669' }}>₹{Number(prod.price || 0).toFixed(2)}</div>
                            <button
                              onClick={() => setExpandedProductId(expandedProductId === prod.id ? null : prod.id)}
                              style={{ background: 'transparent', border: 'none', color: '#2563eb', fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer' }}
                            >
                              {prod.subproducts?.length || 0} Variations <i className={`fa-solid ${expandedProductId === prod.id ? 'fa-chevron-up' : 'fa-chevron-down'}`} style={{ marginLeft: '5px' }}></i>
                            </button>
                          </div>
                          {expandedProductId === prod.id && prod.subproducts?.length > 0 && (
                            <div style={{ marginTop: '10px', background: '#f8fafc', borderRadius: '8px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                              {prod.subproducts.map(sub => (
                                <div key={sub.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '5px 0', borderBottom: '1px solid #e2e8f0' }}>
                                  <span style={{ color: '#475569' }}>{sub.pack}</span>
                                  <span style={{ fontWeight: '700', color: '#1e293b' }}>₹{Number(sub.price || 0).toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                )}

              </div>
            </section>
          )}

          {activeView === 'reportsView' && (
            <section className="view-section">
              <header className="top-header" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <i className="fa-solid fa-chart-line" style={{ color: '#6366f1', fontSize: '1.5rem' }}></i>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0, color: '#1e293b' }}>Reports</h2>
              </header>
              <div className="view-body" style={{ marginTop: '1.5rem' }}>

                {/* Stats Grid for Reports */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                  <div className="stat-card" style={{ padding: '1.5rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '15px' }}>
                    <div style={{ color: '#d97706', marginBottom: '10px' }}><i className="fa-solid fa-sack-dollar fa-xl"></i></div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b' }}>₹ {invoices.reduce((s, i) => s + parseFloat(i.total_amount), 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', marginTop: '5px' }}>Total Revenue</div>
                  </div>
                  <div className="stat-card" style={{ padding: '1.5rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '15px' }}>
                    <div style={{ color: '#64748b', marginBottom: '10px' }}><i className="fa-solid fa-file-invoice fa-xl"></i></div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b' }}>{invoices.length}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', marginTop: '5px' }}>Total Invoices</div>
                  </div>
                  <div className="stat-card" style={{ padding: '1.5rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '15px' }}>
                    <div style={{ color: '#10b981', marginBottom: '10px' }}><i className="fa-solid fa-square-check fa-xl"></i></div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b' }}>{invoices.filter(i => i.status === 'PAID').length}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', marginTop: '5px' }}>Paid</div>
                  </div>
                  <div className="stat-card" style={{ padding: '1.5rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '15px' }}>
                    <div style={{ color: '#f59e0b', marginBottom: '10px' }}><i className="fa-solid fa-hourglass-half fa-xl"></i></div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b' }}>{invoices.filter(i => i.status !== 'PAID').length}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', marginTop: '5px' }}>Pending</div>
                  </div>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '30px', borderBottom: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
                  <div
                    onClick={() => setReportTab('invoices')}
                    style={{
                      padding: '10px 5px',
                      color: reportTab === 'invoices' ? '#2563eb' : '#64748b',
                      fontWeight: reportTab === 'invoices' ? '700' : '500',
                      borderBottom: reportTab === 'invoices' ? '3px solid #2563eb' : 'none',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                      transition: 'all 0.3s'
                    }}
                  >
                    <i className="fa-solid fa-file-lines"></i> All Invoices
                  </div>
                  <div
                    onClick={() => setReportTab('purchases')}
                    style={{
                      padding: '10px 5px',
                      color: reportTab === 'purchases' ? '#2563eb' : '#64748b',
                      fontWeight: reportTab === 'purchases' ? '700' : '500',
                      borderBottom: reportTab === 'purchases' ? '3px solid #2563eb' : 'none',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                      transition: 'all 0.3s'
                    }}
                  >
                    <i className="fa-solid fa-truck-ramp-box"></i> All Purchases
                  </div>
                  <div
                    onClick={() => setReportTab('monthly')}
                    style={{
                      padding: '10px 5px',
                      color: reportTab === 'monthly' ? '#2563eb' : '#64748b',
                      fontWeight: reportTab === 'monthly' ? '700' : '500',
                      borderBottom: reportTab === 'monthly' ? '3px solid #2563eb' : 'none',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                      transition: 'all 0.3s'
                    }}
                  >
                    <i className="fa-solid fa-calendar-check"></i> Monthly GST Report
                  </div>
                </div>

                {/* Detailed Analytics Chart for Reports */}
                <div className="form-card" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
                  <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.1rem' }}>
                    <i className="fa-solid fa-chart-area" style={{ color: '#10b981', marginRight: '10px' }}></i> Performance Analytics
                  </h3>
                  <div style={{ width: '100%', height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={[
                        { name: 'Week 1', sales: 4000, profit: 2400 },
                        { name: 'Week 2', sales: 3000, profit: 1398 },
                        { name: 'Week 3', sales: 2000, profit: 9800 },
                        { name: 'Week 4', sales: 2780, profit: 3908 },
                        { name: 'Week 5', sales: 1890, profit: 4800 },
                        { name: 'Week 6', sales: 2390, profit: 3800 },
                        { name: 'Week 7', sales: 3490, profit: 4300 },
                      ]}>
                        <defs>
                          <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                        <Tooltip />
                        <Area type="monotone" dataKey="sales" stroke="#6366f1" fillOpacity={1} fill="url(#colorSales)" strokeWidth={3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="form-card" style={{ padding: 0, overflow: 'hidden' }}>
                  <div className="table-responsive">
                    {reportTab === 'invoices' ? (
                      <table className="clean-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', background: '#f8fafc' }}>
                            <th style={{ padding: '15px 20px', fontWeight: '600' }}>Invoice</th>
                            <th style={{ padding: '15px 20px', fontWeight: '600' }}>Date</th>
                            <th style={{ padding: '15px 20px', fontWeight: '600' }}>Client</th>
                            <th style={{ padding: '15px 20px', fontWeight: '600' }}>Amount</th>
                            <th style={{ padding: '15px 20px', fontWeight: '600' }}>Status</th>
                            <th style={{ padding: '15px 20px', fontWeight: '600', textAlign: 'center' }}>Change Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredInvoices.map((inv) => (
                            <tr key={inv.id} style={{ borderBottom: '1px solid #f1f5f9', background: '#fff' }}>
                              <td style={{ padding: '15px 20px', fontWeight: '600', color: '#1e293b' }}>{inv.pi_number}</td>
                              <td style={{ padding: '15px 20px', color: '#64748b' }}>{new Date(inv.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                              <td style={{ padding: '15px 20px', fontWeight: '500' }}>{inv.client_name}</td>
                              <td style={{ padding: '15px 20px', fontWeight: '700', color: '#1e293b' }}>₹ {parseFloat(inv.total_amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                              <td style={{ padding: '15px 20px' }}>
                                <span style={{
                                  background: (inv.status || 'PENDING').toUpperCase() === 'PAID' ? '#dcfce7' : (inv.status || '').toUpperCase() === 'PENDING' ? '#fef3c7' : '#f1f5f9',
                                  color: (inv.status || 'PENDING').toUpperCase() === 'PAID' ? '#166534' : (inv.status || '').toUpperCase() === 'PENDING' ? '#92400e' : '#475569',
                                  padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '700'
                                }}>
                                  {(inv.status || 'PENDING').toUpperCase()}
                                </span>
                              </td>
                              <td style={{ padding: '15px 20px', textAlign: 'center' }}>
                                <select
                                  value={inv.status || 'PENDING'}
                                  onChange={(e) => handleStatusUpdate(inv.id, e.target.value)}
                                  style={{ padding: '5px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.85rem', outline: 'none', background: '#f8fafc' }}
                                >
                                  <option value="PAID">Paid</option>
                                  <option value="PENDING">Pending</option>
                                  <option value="DRAFT">Draft</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                          {filteredInvoices.length === 0 && (
                            <tr>
                              <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                                <i className="fa-solid fa-folder-open" style={{ fontSize: '2rem', marginBottom: '10px', display: 'block' }}></i>
                                No invoices found.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    ) : reportTab === 'purchases' ? (
                      <table className="clean-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', background: '#f8fafc' }}>
                            <th style={{ padding: '15px 20px', fontWeight: '600' }}>Bill No.</th>
                            <th style={{ padding: '15px 20px', fontWeight: '600' }}>Date</th>
                            <th style={{ padding: '15px 20px', fontWeight: '600' }}>Vendor</th>
                            <th style={{ padding: '15px 20px', fontWeight: '600' }}>Amount</th>
                            <th style={{ padding: '15px 20px', fontWeight: '600' }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {purchases.map((pur) => (
                            <tr key={pur.id} style={{ borderBottom: '1px solid #f1f5f9', background: '#fff' }}>
                              <td style={{ padding: '15px 20px', fontWeight: '600', color: '#1e293b' }}>{pur.bill_no}</td>
                              <td style={{ padding: '15px 20px', color: '#64748b' }}>{new Date(pur.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                              <td style={{ padding: '15px 20px', fontWeight: '500' }}>{pur.vendor}</td>
                              <td style={{ padding: '15px 20px', fontWeight: '700', color: '#ef4444' }}>₹ {parseFloat(pur.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                              <td style={{ padding: '15px 20px' }}>
                                <span style={{
                                  background: pur.status === 'RECEIVED' ? '#dcfce7' : pur.status === 'PENDING' ? '#fef3c7' : '#fee2e2',
                                  color: pur.status === 'RECEIVED' ? '#166534' : pur.status === 'PENDING' ? '#92400e' : '#b91c1c',
                                  padding: '4px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '700'
                                }}>
                                  {pur.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <table className="clean-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', background: '#f8fafc' }}>
                            <th style={{ padding: '15px 20px', fontWeight: '600' }}>Month</th>
                            <th style={{ padding: '15px 20px', fontWeight: '600' }}>Invoices</th>
                            <th style={{ padding: '15px 20px', fontWeight: '600' }}>Taxable Amt</th>
                            <th style={{ padding: '15px 20px', fontWeight: '600' }}>Total GST</th>
                            <th style={{ padding: '15px 20px', fontWeight: '600' }}>Grand Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(() => {
                            const monthly = {};
                            invoices.forEach(inv => {
                              const d = new Date(inv.created_at);
                              const key = d.toLocaleString('en-GB', { month: 'long', year: 'numeric' });
                              if (!monthly[key]) monthly[key] = { month: key, count: 0, total: 0 };
                              monthly[key].count++;
                              monthly[key].total += parseFloat(inv.total_amount) || 0;
                            });
                            const data = Object.values(monthly);
                            return data.map((m, idx) => (
                              <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', background: '#fff' }}>
                                <td style={{ padding: '15px 20px', fontWeight: '700' }}>{m.month}</td>
                                <td style={{ padding: '15px 20px' }}>{m.count}</td>
                                <td style={{ padding: '15px 20px' }}>₹ {(m.total / 1.18).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                <td style={{ padding: '15px 20px' }}>₹ {(m.total - (m.total / 1.18)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                <td style={{ padding: '15px 20px', fontWeight: '700', color: '#2563eb' }}>₹ {m.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                              </tr>
                            ));
                          })()}
                          {invoices.length === 0 && (
                            <tr><td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>No monthly data available.</td></tr>
                          )}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeView === 'employeesView' && currentUser.role === 'Admin' && (
            <section className="view-section">
              <header className="top-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i className="fa-solid fa-user-gear" style={{ color: '#6366f1', fontSize: '1.5rem' }}></i>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0, color: '#1e293b' }}>Employees Management</h2>
                </div>
              </header>
              <div className="view-body" style={{ marginTop: '1.5rem' }}>
                <div className="form-card" style={{ padding: 0, overflow: 'hidden' }}>
                  <div className="table-responsive">
                    <table className="clean-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', background: '#f8fafc' }}>
                          <th style={{ padding: '15px 20px', fontWeight: '600' }}>Name</th>
                          <th style={{ padding: '15px 20px', fontWeight: '600' }}>Employee ID</th>
                          <th style={{ padding: '15px 20px', fontWeight: '600' }}>Email/Username</th>
                          <th style={{ padding: '15px 20px', fontWeight: '600' }}>Role</th>
                          <th style={{ padding: '15px 20px', fontWeight: '600', textAlign: 'center' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allUsers.map((user) => (
                          <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9', background: '#fff' }}>
                            <td style={{ padding: '15px 20px', fontWeight: '600', color: '#1e293b' }}>{user.name || 'N/A'}</td>
                            <td style={{ padding: '15px 20px', color: '#64748b' }}>{user.employee_id || 'N/A'}</td>
                            <td style={{ padding: '15px 20px', color: '#64748b' }}>{user.username}</td>
                            <td style={{ padding: '15px 20px' }}>
                              <span style={{
                                background: user.role === 'Admin' ? '#dcfce7' : user.role === 'Sales' ? '#eff6ff' : '#f1f5f9',
                                color: user.role === 'Admin' ? '#166534' : user.role === 'Sales' ? '#2563eb' : '#475569',
                                padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700'
                              }}>
                                {user.role}
                              </span>
                            </td>
                            <td style={{ padding: '15px 20px', textAlign: 'center' }}>
                              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                <button onClick={() => handleEditUser(user)} className="btn-clean" style={{ color: '#2563eb', background: '#eff6ff', padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>
                                  <i className="fa-solid fa-pen-to-square" style={{ marginRight: '5px' }}></i> Edit
                                </button>
                                <button onClick={() => handleDeleteUser(user.id)} className="btn-clean" style={{ color: '#ef4444', background: '#fef2f2', padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>
                                  <i className="fa-solid fa-trash-can" style={{ marginRight: '5px' }}></i> Delete
                                </button>
                              </div>
                            </td>
                          </tr>

                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeView === 'settingsView' && (
            <section className="view-section">
              <header className="top-header">
                <h2>System Settings</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <span style={{ background: '#ecfdf5', color: '#059669', padding: '5px 15px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600' }}>Active System</span>
                </div>
              </header>
              <div className="view-body">
                <div className="grid-3 mt-2">
                  {/* Logged in Employee Info */}
                  <div className="form-card" style={{ borderLeft: '4px solid #6366f1' }}>
                    <h3><i className="fa-solid fa-user-gear"></i> Logged-in Employee</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="text-muted">Employee ID:</span> <span style={{ fontWeight: '600' }}>{currentUser.id ? `EMP-${currentUser.id}` : 'EMP-101'}</span></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="text-muted">Name:</span> <span style={{ fontWeight: '600' }}>{currentUser.username || 'Admin User'}</span></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="text-muted">Role:</span> <span style={{ fontWeight: '600' }}>{currentUser.role}</span></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="text-muted">Status:</span> <span style={{ color: '#059669', fontWeight: '600' }}>Active</span></div>
                    </div>
                  </div>

                  {/* Company Details */}
                  <div className="form-card" style={{ borderLeft: '4px solid #10b981' }}>
                    <h3><i className="fa-solid fa-building"></i> Company Details</h3>
                    <div className="input-group mb-2"><label>Company Name</label><input type="text" id="companyName" value={formData.companyName} onChange={handleInputChange} disabled={currentUser.role !== 'Admin'} /></div>
                    <div className="input-group mb-2"><label>GST No.</label><input type="text" id="companyGst" value={formData.companyGst} onChange={handleInputChange} disabled={currentUser.role !== 'Admin'} /></div>
                    <div className="input-group mb-2"><label>Address</label><textarea id="companyAddress" rows="2" value={formData.companyAddress} onChange={handleInputChange} disabled={currentUser.role !== 'Admin'}></textarea></div>
                    <div className="input-group mb-2"><label>Contact</label><input type="text" id="companyContact" value={formData.companyContact} onChange={handleInputChange} maxLength="10" pattern="\d{10}" placeholder="10 Digit Mobile No." disabled={currentUser.role !== 'Admin'} /></div>
                  </div>

                  {/* Bank Details */}
                  <div className="form-card" style={{ borderLeft: '4px solid #f59e0b' }}>
                    <h3><i className="fa-solid fa-building-columns"></i> Bank Configuration</h3>
                    <div className="input-group mb-2"><label>Bank Name</label><input type="text" id="bankName" value={formData.bankName} onChange={handleInputChange} disabled={currentUser.role !== 'Admin'} /></div>
                    <div className="input-group mb-2"><label>A/C No.</label><input type="text" id="acNo" value={formData.acNo} onChange={handleInputChange} maxLength="12" pattern="\d{12}" placeholder="12 Digit Account No." disabled={currentUser.role !== 'Admin'} /></div>
                    <div className="input-group mb-2"><label>IFSC Code</label><input type="text" id="ifscCode" value={formData.ifscCode} onChange={handleInputChange} disabled={currentUser.role !== 'Admin'} /></div>
                    <div className="input-group mb-2"><label>Branch</label><input type="text" id="branch" value={formData.branch} onChange={handleInputChange} disabled={currentUser.role !== 'Admin'} /></div>
                  </div>
                </div>
              </div>
            </section>
          )}




          {activeView === 'invoiceView' && (
            <section className="view-section">
              <header className="top-header">
                <h2>Invoice Generator</h2>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button className="btn btn-secondary" style={{ background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', fontWeight: '600' }} onClick={saveInvoice}>
                    <i className="fa-solid fa-floppy-disk"></i> Save Data
                  </button>
                  <button className="btn btn-secondary" style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #dbeafe', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', fontWeight: '600' }} onClick={() => setShowPreviewModal(true)}>
                    <i className="fa-solid fa-eye"></i> Preview
                  </button>
                  <button className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)', border: 'none', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 22px', fontWeight: '600', boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)' }} onClick={generatePDF}>
                    <i className="fa-solid fa-file-pdf"></i> Generate PDF
                  </button>
                </div>
              </header>
              <div className="view-body">
                <form id="invoiceForm" onSubmit={e => e.preventDefault()}>
                  <div className="form-card">
                    <h3><i className="fa-solid fa-building"></i> Company Info</h3>
                    <div className="grid-3">
                      <div className="input-group"><label>Company Name</label><input type="text" id="companyName" value={formData.companyName} onChange={handleInputChange} /></div>
                      <div className="input-group"><label>PI Number</label><input type="text" id="piNumber" placeholder="Enter PI Number" value={formData.piNumber} onChange={handleInputChange} /></div>
                      <div className="input-group"><label>PI Date</label><input type="date" id="piDate" value={formData.piDate} onChange={handleInputChange} /></div>
                      <div className="input-group full-width"><label>Reg. & Dispatch Address</label><textarea id="companyAddress" rows="2" value={formData.companyAddress} onChange={handleInputChange}></textarea></div>
                      <div className="input-group"><label>GST No.</label><input type="text" id="companyGst" value={formData.companyGst} onChange={handleInputChange} /></div>
                      <div className="input-group"><label>Concerned Person</label><input type="text" id="companyPerson" value={formData.companyPerson} onChange={handleInputChange} /></div>
                      <div className="input-group"><label>Contact No.</label><input type="text" id="companyContact" value={formData.companyContact} onChange={handleInputChange} maxLength="10" pattern="\d{10}" placeholder="10 Digit Mobile No." /></div>
                    </div>
                  </div>

                  <div className="form-card mt-2">
                    <h3><i className="fa-solid fa-user-tie"></i> Bill To & Ship To (Consignee)</h3>
                    <div className="grid-3">
                      <div className="input-group full-width">
                        <label style={{ color: '#475569', fontWeight: '700', fontSize: '0.9rem', marginBottom: '8px', display: 'block' }}>
                          <i className="fa-solid fa-magnifying-glass-chart" style={{ marginRight: '8px', color: '#6366f1' }}></i>
                          Quick Select Customer (Auto-Fill Form)
                        </label>
                        <div style={{ position: 'relative' }}>
                          <select
                            value={formData.consigneeName || ''}
                            onChange={handleCustomerSelect}
                            style={{
                              width: '100%',
                              padding: '14px 16px',
                              paddingRight: '45px',
                              borderRadius: '14px',
                              border: '2px solid #e0e7ff',
                              background: '#ffffff',
                              color: '#1e293b',
                              fontSize: '1rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                              appearance: 'none',
                              backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236366f1' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                              backgroundRepeat: 'no-repeat',
                              backgroundPosition: 'right 16px center',
                              backgroundSize: '18px',
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                              outline: 'none'
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = '#6366f1';
                              e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.15)';
                              e.target.style.transform = 'translateY(-1px)';
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = '#e0e7ff';
                              e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)';
                              e.target.style.transform = 'translateY(0)';
                            }}
                          >
                            <option value="">-- Click to search & select a customer --</option>
                            {/* Show only unique names to avoid duplicates in the dropdown */}
                            {Array.from(new Set(customers.map(c => c.name))).map(name => {
                              const c = customers.find(cust => cust.name === name);
                              return <option key={c.id} value={c.name}>{c.name} ({c.city})</option>
                            })}
                          </select>
                        </div>
                      </div>

                      <div className="input-group full-width"><label>Consignee Name</label><input type="text" id="consigneeName" placeholder="Enter Consignee Name" value={formData.consigneeName} onChange={handleInputChange} /></div>
                      <div className="input-group full-width"><label>Address</label><textarea id="consigneeAddress" rows="2" placeholder="Enter Address" value={formData.consigneeAddress} onChange={handleInputChange}></textarea></div>
                      <div className="input-group"><label>GST No.</label><input type="text" id="consigneeGst" placeholder="Enter GST No." value={formData.consigneeGst} onChange={handleInputChange} /></div>
                      <div className="input-group"><label>Concerned Person</label><input type="text" id="consigneePerson" placeholder="Enter Person Name" value={formData.consigneePerson} onChange={handleInputChange} /></div>
                      <div className="input-group"><label>Contact No.</label><input type="text" id="consigneeContact" placeholder="10 Digit Mobile No." value={formData.consigneeContact} onChange={handleInputChange} maxLength="10" pattern="\d{10}" /></div>
                      <div className="input-group"><label>Transporter Name</label><input type="text" id="transporterName" placeholder="Enter Transporter" value={formData.transporterName} onChange={handleInputChange} /></div>
                      <div className="input-group"><label>Delivery Location</label><input type="text" id="deliveryLocation" placeholder="Enter Delivery Location" value={formData.deliveryLocation} onChange={handleInputChange} /></div>
                    </div>
                  </div>

                  <div className="form-card mt-2">
                    <h3><i className="fa-solid fa-building-columns"></i> Bank Details & Terms</h3>
                    <div className="grid-3">
                      <div className="input-group"><label>Bank Name</label><input type="text" id="bankName" value={formData.bankName} onChange={handleInputChange} /></div>
                      <div className="input-group"><label>A/C Name</label><input type="text" id="acName" value={formData.acName} onChange={handleInputChange} /></div>
                      <div className="input-group"><label>A/C No.</label><input type="text" id="acNo" value={formData.acNo} onChange={handleInputChange} maxLength="12" pattern="\d{12}" placeholder="12 Digit Account No." /></div>
                      <div className="input-group"><label>IFSC Code</label><input type="text" id="ifscCode" value={formData.ifscCode} onChange={handleInputChange} /></div>
                      <div className="input-group"><label>Branch</label><input type="text" id="branch" value={formData.branch} onChange={handleInputChange} /></div>
                    </div>
                    <div className="input-group full-width mt-2">
                      <label>Terms & Conditions (One per line)</label>
                      <textarea id="termsConditions" rows="5" value={formData.termsConditions} onChange={handleInputChange}></textarea>
                    </div>
                  </div>

                  <div className="form-card mt-3" style={{ padding: '2rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', margin: 0 }}>
                        <i className="fa-solid fa-layer-group" style={{ color: '#6366f1', marginRight: '10px' }}></i> Product Items
                      </h3>
                      <button type="button" className="btn btn-primary" onClick={addProduct} style={{
                        padding: '10px 25px',
                        borderRadius: '12px',
                        fontSize: '0.9rem',
                        background: '#1e293b',
                        color: '#fff',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}>
                        <i className="fa-solid fa-circle-plus"></i> Add New Product
                      </button>
                    </div>

                    <div className="table-responsive" style={{ borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                      <table className="clean-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ background: '#f8fafc', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', textAlign: 'left', borderBottom: '2px solid #f1f5f9' }}>
                            <th style={{ padding: '15px 10px', fontWeight: '700' }}>Product Details</th>
                            <th style={{ padding: '15px 10px', fontWeight: '700' }}>HSN</th>
                            <th style={{ padding: '15px 10px', fontWeight: '700' }}>Packing</th>
                            <th style={{ padding: '15px 10px', fontWeight: '700' }}>Qty (C/S)</th>
                            <th style={{ padding: '15px 10px', fontWeight: '700' }}>Rate</th>
                            <th style={{ padding: '15px 10px', fontWeight: '700', textAlign: 'center' }}>CGST %</th>
                            <th style={{ padding: '15px 10px', fontWeight: '700', textAlign: 'center' }}>SGST %</th>
                            <th style={{ padding: '15px 10px', fontWeight: '700', textAlign: 'center' }}>IGST %</th>
                            <th style={{ padding: '15px 10px', fontWeight: '700', textAlign: 'right' }}>Total</th>
                            <th style={{ padding: '15px 10px', textAlign: 'center' }}></th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.map((p, index) => {
                            const taxable = (parseFloat(p.qty) || 0) * (parseFloat(p.price) || 0);
                            const gstTotal = (parseFloat(p.cgst) || 0) + (parseFloat(p.sgst) || 0) + (parseFloat(p.igst) || 0);
                            const totalWithGst = taxable + (taxable * (gstTotal / 100));

                            return (
                              <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }} className="table-row-hover">
                                <td style={{ padding: '12px 10px' }}>
                                  <select
                                    value={p.name}
                                    onChange={e => {
                                      const selected = masterProducts.find(mp => mp.name === e.target.value);
                                      if (selected) {
                                        updateProductRow(p.id, {
                                          name: selected.name,
                                          hsn: selected.hsn,
                                          pack: selected.pack || '',
                                          price: selected.price,
                                          unit: selected.unit || 'Ltr'
                                        });
                                      } else {
                                        updateProduct(p.id, 'name', e.target.value);
                                      }
                                    }}
                                    className="styled-select" style={{ width: '100%', minWidth: '150px' }}
                                  >
                                    <option value="">-- Choose Product --</option>
                                    {masterProducts.map(mp => <option key={mp.id} value={mp.name}>{mp.name}</option>)}
                                  </select>
                                </td>
                                <td style={{ padding: '12px 10px' }}>
                                  <input type="text" value={p.hsn} className="styled-input" style={{ width: '60px' }} onChange={e => updateProduct(p.id, 'hsn', e.target.value)} />
                                </td>
                                <td style={{ padding: '12px 10px' }}>
                                  <div style={{ display: 'flex', gap: '5px' }}>
                                    <input type="text" value={p.pack} className="styled-input" style={{ width: '60px' }} onChange={e => updateProduct(p.id, 'pack', e.target.value)} />
                                    <select value={p.unit} onChange={e => updateProduct(p.id, 'unit', e.target.value)} className="styled-select" style={{ width: '55px', padding: '8px 5px' }}>
                                      <option value="Ltr">Ltr</option><option value="ml">ml</option><option value="kg">kg</option><option value="gm">gm</option>
                                    </select>
                                  </div>
                                </td>
                                <td style={{ padding: '12px 10px' }}>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <input type="number" placeholder="C/S" value={p.qt} className="styled-input" style={{ width: '50px' }} onChange={e => updateProduct(p.id, 'qt', e.target.value)} />
                                    <input type="number" placeholder="Units" value={p.qty} className="styled-input" style={{ width: '60px', fontSize: '0.75rem', color: '#64748b' }} onChange={e => updateProduct(p.id, 'qty', e.target.value)} />
                                  </div>
                                </td>
                                <td style={{ padding: '12px 10px' }}>
                                  <input type="number" value={p.price} className="styled-input" style={{ width: '85px', fontWeight: '700' }} onChange={e => updateProduct(p.id, 'price', e.target.value)} />
                                </td>
                                <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                                  <input type="number" value={p.cgst} className="styled-input" style={{ width: '45px', textAlign: 'center' }} onChange={e => updateProduct(p.id, 'cgst', e.target.value)} />
                                </td>
                                <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                                  <input type="number" value={p.sgst} className="styled-input" style={{ width: '45px', textAlign: 'center' }} onChange={e => updateProduct(p.id, 'sgst', e.target.value)} />
                                </td>
                                <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                                  <input type="number" value={p.igst} className="styled-input" style={{ width: '45px', textAlign: 'center' }} onChange={e => updateProduct(p.id, 'igst', e.target.value)} />
                                </td>
                                <td style={{ padding: '12px 10px', textAlign: 'right', fontWeight: '800', color: '#0f172a' }}>
                                  ₹ {totalWithGst.toFixed(2)}
                                </td>
                                <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                                  <button type="button" onClick={() => removeProduct(p.id)} style={{
                                    color: '#ef4444',
                                    background: '#fef2f2',
                                    border: '1px solid #fee2e2',
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s'
                                  }} className="btn-delete-hover">
                                    <i className="fa-solid fa-trash-can"></i>
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Order Summary */}
                    <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                      <div style={{ width: '300px', background: '#f8fafc', padding: '20px', borderRadius: '15px', border: '1px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                          <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Subtotal:</span>
                          <span style={{ fontWeight: '600' }}>₹ {products.reduce((acc, p) => acc + (parseFloat(p.qty) || 0) * (parseFloat(p.price) || 0), 0).toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px dashed #e2e8f0' }}>
                          <span style={{ color: '#64748b', fontSize: '0.85rem' }}>GST Amount:</span>
                          <span style={{ fontWeight: '600', color: '#6366f1' }}>₹ {products.reduce((acc, p) => {
                            const taxable = (parseFloat(p.qty) || 0) * (parseFloat(p.price) || 0);
                            const gstTotal = (parseFloat(p.cgst) || 0) + (parseFloat(p.sgst) || 0) + (parseFloat(p.igst) || 0);
                            return acc + (taxable * (gstTotal / 100));
                          }, 0).toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontWeight: '800', color: '#1e293b' }}>Grand Total:</span>
                          <span style={{ fontWeight: '800', color: '#059669', fontSize: '1.2rem' }}>
                            ₹ {products.reduce((acc, p) => {
                              const taxable = (parseFloat(p.qty) || 0) * (parseFloat(p.price) || 0);
                              const gstTotal = (parseFloat(p.cgst) || 0) + (parseFloat(p.sgst) || 0) + (parseFloat(p.igst) || 0);
                              return acc + (taxable + (taxable * (gstTotal / 100)));
                            }, 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                </form>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Preview Modal identical to original HTML structure */}
      {showPreviewModal && (
        <div className="modal show modal-fade">
          <div className="modal-content modal-slide">
            <div className="modal-header">
              <h2>Invoice Preview</h2>
              <div>
                <button className="btn btn-primary btn-smooth" onClick={generatePDF}><i className="fa-solid fa-file-pdf"></i> Download</button>
                <button className="btn btn-secondary btn-smooth" onClick={() => setShowPreviewModal(false)}><i className="fa-solid fa-times"></i> Close</button>
              </div>
            </div>
            <div className="modal-body">
              <div id="invoiceA4" className="invoice-a4">
                {/* Watermark */}
                <div style={{
                  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-30deg)',
                  opacity: '0.08', width: '80%', pointerEvents: 'none', zIndex: '0', display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}>
                  <img src={sikkoLogo} alt="Watermark" style={{ width: '100%', maxWidth: '500px' }} />
                </div>

                <div className="inv-top-bar" style={{ position: 'relative', zIndex: '1' }}>PROFORMA INVOICE</div>

                <div className="inv-header" style={{ position: 'relative', zIndex: '1' }}>
                  <div className="inv-logo">
                    <img src={sikkoLogo} alt="Logo" style={{ width: '100%', maxHeight: '80px', objectFit: 'contain' }} />
                  </div>
                  <div className="inv-company">
                    <h1>SIKKO INDUSTRIES LTD</h1>
                    <p>Reg. Office: 508, ISCON ELEGANCE, NR. JAIN TEMPLE, S.G. HIGHWAY, VEJALPUR, AHMEDABAD-51</p>
                    <p>Dispatch Address: 55 A & B, AMBICA INDUSTRIAL ESTATE, SANAND - VIRAMGAM HIGHWAY, AT. IYAVA,</p>
                    <p>TA. SANAND, DIST. AHMEDABAD - 382110, Gujarat</p>
                  </div>
                  <div className="inv-meta">
                    <table className="meta-table">
                      <tbody>
                        <tr><td>PI Number:</td><td>{formData.piNumber}</td></tr>
                        <tr><td>PI Date:</td><td>{formData.piDate}</td></tr>
                        <tr><td>Consignor's GST No:</td><td>{formData.companyGst}</td></tr>
                        <tr><td>Consignor's Concerned Person:</td><td>{formData.companyPerson}</td></tr>
                        <tr><td>Contact No:</td><td>{formData.companyContact}</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="inv-section-title">
                  <div className="left-title">Bill To & Ship To Address</div>
                  <div className="right-title">Bank Details</div>
                </div>

                <div className="inv-details">
                  <div className="inv-bill-to">
                    <div style={{ marginBottom: '5px' }}><strong>Consignee: {formData.consigneeName}</strong></div>
                    <div style={{ marginBottom: '5px' }}><strong>Address:</strong> {formData.consigneeAddress}</div>
                    <div style={{ marginBottom: '5px' }}><strong>GST No.</strong> {formData.consigneeGst}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderTop: '1px solid #000', marginTop: '10px' }}>
                      <div style={{ padding: '4px', borderRight: '1px solid #000' }}><strong>Concerned Person:</strong> {formData.consigneePerson}</div>
                      <div style={{ padding: '4px' }}><strong>Transporter Name:</strong> <span className="text-red">{formData.transporterName}</span></div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderTop: '1px solid #000' }}>
                      <div style={{ padding: '4px', borderRight: '1px solid #000' }}><strong>Contact No.</strong> {formData.consigneeContact}</div>
                      <div style={{ padding: '4px' }}><strong>Delivery Location:</strong> {formData.deliveryLocation}</div>
                    </div>
                  </div>
                  <div className="inv-bank">
                    <div className="bank-text">
                      <div className="text-center fw-bold" style={{ marginBottom: '5px' }}>A/C Details</div>
                      <p><strong>Bank Name:</strong> <span className="text-red">{formData.bankName}</span></p>
                      <p><strong>A/C Name:</strong> <span className="text-red">{formData.acName}</span></p>
                      <p><strong>A/C. No.</strong> <span className="text-red">{formData.acNo}</span></p>
                      <p><strong>IFSC Code -</strong> <span className="text-red">{formData.ifscCode}</span></p>
                      <p><strong>Branch -</strong> <span className="text-red">{formData.branch}</span></p>
                    </div>
                    <div className="bank-qr">
                      <div style={{ fontSize: '8px', fontWeight: 'bold' }}>Scan QR Code for UPI Transaction</div>
                      <div className="qr-box" style={{ background: '#fff', border: '1px solid #000' }}>
                        <img src={upiQr} alt="UPI QR" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      </div>
                    </div>
                  </div>
                </div>

                <table className="inv-table">
                  <thead>
                    <tr>
                      <th style={{ width: '4%' }}>SL. No.</th>
                      <th style={{ width: '25%' }}>Product Name</th>
                      <th style={{ width: '8%' }}>HSN Code</th>
                      <th style={{ width: '10%' }}>Packing Size</th>
                      <th style={{ width: '5%' }}>Qt. C/S</th>
                      <th style={{ width: '7%' }}>Quantity in Unit</th>
                      <th style={{ width: '8%' }}>Price Per Unit</th>
                      <th style={{ width: '8%' }}>Taxable Value</th>
                      <th style={{ width: '4%' }}>CGST %</th>
                      <th style={{ width: '4%' }}>SGST %</th>
                      <th style={{ width: '4%' }}>IGST %</th>
                      <th style={{ width: '8%' }}>GST Amt.</th>
                      <th style={{ width: '10%' }}>Total amt. with GST</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p, i) => {
                      const taxable = (parseFloat(p.qty) || 0) * (parseFloat(p.price) || 0);
                      const gstRate = (parseFloat(p.cgst) || 0) + (parseFloat(p.sgst) || 0) + (parseFloat(p.igst) || 0);
                      const gstAmt = taxable * (gstRate / 100);
                      const total = taxable + gstAmt;
                      return (
                        <tr key={p.id}>
                          <td>{i + 1}</td>
                          <td>
                            <div className="fw-bold">{p.name}</div>
                            {/* Variations/Labels could go here as seen in screenshot */}
                          </td>
                          <td>{p.hsn}</td>
                          <td>{p.pack} {p.unit}</td>
                          <td>{p.qt}</td>
                          <td>{p.qty}</td>
                          <td>{p.price}</td>
                          <td>{taxable.toFixed(0)}</td>
                          <td>{p.cgst ? p.cgst + '%' : ''}</td>
                          <td>{p.sgst ? p.sgst + '%' : ''}</td>
                          <td>{p.igst ? p.igst + '%' : ''}</td>
                          <td>{gstAmt.toFixed(0)}</td>
                          <td>{total.toFixed(0)}</td>
                        </tr>
                      );
                    })}
                    <tr className="fw-bold">
                      <td colSpan="7">Total</td>
                      <td>{totalTaxable.toFixed(0)}</td>
                      <td colSpan="3"></td>
                      <td>{totalGstAmt.toFixed(0)}</td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>

                <div className="inv-footer-summary">
                  <div className="words-area">
                    <span className="text-blue">Amt. in Word:</span> <span className="text-red" style={{ marginLeft: '10px' }}>{numberToWords(finalAmt)}</span>
                  </div>
                  <div className="totals-area">
                    <table className="totals-table">
                      <tbody>
                        <tr><td>Total Amt.</td><td className="text-blue">{finalAmt.toFixed(2)}</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bottom-section">
                  <div className="terms-side">
                    <div className="text-red fw-bold" style={{ textDecoration: 'underline', fontStyle: 'italic', marginBottom: '10px' }}>TERMS & CONDITIONS:</div>
                    <div style={{ fontSize: '9px', lineHeight: '1.4' }}>
                      {formData.termsConditions.split('\n').map((t, i) => (
                        <div key={i}>{i + 1}. {t}</div>
                      ))}
                    </div>
                  </div>
                  <div className="sign-side">
                    <div className="totals-area" style={{ width: '100%' }}>
                      <table className="totals-table">
                        <tbody>
                          <tr style={{ color: '#581c87' }}><td>Freight Charges</td><td style={{ textAlign: 'right' }}>0.00</td></tr>
                          <tr style={{ color: '#581c87' }}><td>Round Off.</td><td style={{ textAlign: 'right' }}></td></tr>
                          <tr style={{ color: '#581c87' }}><td>Previous Cr. Amt. (If Any)</td><td style={{ textAlign: 'right' }}></td></tr>
                          <tr style={{ height: '40px' }}><td className="text-purple" style={{ fontSize: '14px' }}>Final Amt.</td><td className="text-red" style={{ fontSize: '18px', textAlign: 'right' }}>{Math.round(finalAmt)}</td></tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="sign-box">
                      <div style={{ fontWeight: 'bold' }}>For Sikko Industries Ltd</div>
                      <div style={{ fontSize: '10px', marginTop: '20px' }}>Trade Executive<br />({formData.companyPerson})</div>
                    </div>
                    <div className="sign-box" style={{ background: '#f8fafc' }}>
                      <div style={{ fontSize: '10px', fontWeight: 'bold' }}>Proforma Confirmed & Accepted by Consignee</div>
                      <div style={{ fontSize: '9px', marginTop: '10px' }}>(Sign & Stamp)<br /><strong>{formData.consigneePerson}</strong></div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {showAddCustomerModal && (
        <div className="modal show modal-fade">
          <div className="modal-content modal-slide" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h2>Add New Customer</h2>
              <button className="btn btn-secondary" onClick={() => setShowAddCustomerModal(false)}><i className="fa-solid fa-times"></i></button>
            </div>
            <div className="modal-body">
              <form onSubmit={async e => {
                e.preventDefault();
                try {
                  console.log("Sending customer data:", newCustomer);
                  const res = await fetch('http://127.0.0.1:5001/api/customers', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newCustomer)
                  });
                  if (res.ok) {
                    alert("Customer Saved Successfully!");
                    fetchCustomers();
                    setShowAddCustomerModal(false);
                    setNewCustomer({ name: '', company: '', phone: '', email: '', gst: '', city: '' });
                  } else {
                    const errData = await res.json();
                    alert("Error Saving Customer: " + errData.error);
                  }
                } catch (err) {
                  console.error(err);
                  alert("Network Error: Could not connect to server.");
                }
              }}>
                <div className="grid-2">
                  <div className="input-group mb-2"><label>Customer Name</label><input type="text" required onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })} /></div>
                  <div className="input-group mb-2"><label>Company Name</label><input type="text" onChange={e => setNewCustomer({ ...newCustomer, company: e.target.value })} /></div>
                  <div className="input-group mb-2"><label>Phone Number</label><input type="text" required maxLength="10" pattern="\d{10}" placeholder="10 Digit Mobile No." onChange={e => setNewCustomer({ ...newCustomer, phone: e.target.value })} /></div>
                  <div className="input-group mb-2"><label>Email ID</label><input type="email" onChange={e => setNewCustomer({ ...newCustomer, email: e.target.value })} /></div>
                  <div className="input-group mb-2"><label>GST No.</label><input type="text" onChange={e => setNewCustomer({ ...newCustomer, gst: e.target.value })} /></div>
                  <div className="input-group mb-2"><label>City</label><input type="text" onChange={e => setNewCustomer({ ...newCustomer, city: e.target.value })} /></div>
                </div>
                <button type="submit" className="btn btn-primary mt-2" style={{ width: '100%', padding: '12px' }}>Save Customer</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Customer Modal */}
      {showEditCustomerModal && editingCustomer && (
        <div className="modal show modal-fade">
          <div className="modal-content modal-slide" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h2>Edit Customer</h2>
              <button className="btn btn-secondary" onClick={() => setShowEditCustomerModal(false)}><i className="fa-solid fa-times"></i></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleUpdateCustomer}>
                <div className="grid-2">
                  <div className="input-group mb-2"><label>Customer Name</label><input type="text" value={editingCustomer.name} required onChange={e => setEditingCustomer({ ...editingCustomer, name: e.target.value })} /></div>
                  <div className="input-group mb-2"><label>Company Name</label><input type="text" value={editingCustomer.company} onChange={e => setEditingCustomer({ ...editingCustomer, company: e.target.value })} /></div>
                  <div className="input-group mb-2"><label>Phone Number</label><input type="text" value={editingCustomer.phone} required maxLength="10" pattern="\d{10}" placeholder="10 Digit Mobile No." onChange={e => setEditingCustomer({ ...editingCustomer, phone: e.target.value })} /></div>
                  <div className="input-group mb-2"><label>Email ID</label><input type="email" value={editingCustomer.email} onChange={e => setEditingCustomer({ ...editingCustomer, email: e.target.value })} /></div>
                  <div className="input-group mb-2"><label>GST No.</label><input type="text" value={editingCustomer.gst} onChange={e => setEditingCustomer({ ...editingCustomer, gst: e.target.value })} /></div>
                  <div className="input-group mb-2"><label>City</label><input type="text" value={editingCustomer.city} onChange={e => setEditingCustomer({ ...editingCustomer, city: e.target.value })} /></div>
                </div>
                <button type="submit" className="btn btn-primary mt-2" style={{ width: '100%', padding: '12px' }}>Update Customer</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="modal show modal-fade">
          <div className="modal-content modal-slide" style={{ maxWidth: '500px' }}>
            <div className="modal-header"><h2>Add New Product</h2><button className="btn btn-secondary" onClick={() => setShowAddProductModal(false)}><i className="fa-solid fa-times"></i></button></div>
            <div className="modal-body">
              <form onSubmit={async e => {
                e.preventDefault();
                try {
                  await fetch('http://127.0.0.1:5001/api/products', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newProductMaster)
                  });
                  fetchProducts();
                  setShowAddProductModal(false);
                } catch (err) { console.error(err); }
              }}>
                <div className="input-group mb-2"><label>Product Name</label><input type="text" required onChange={e => setNewProductMaster({ ...newProductMaster, name: e.target.value })} /></div>
                <div className="input-group mb-2"><label>Category</label>
                  <select required onChange={e => setNewProductMaster({ ...newProductMaster, cat: e.target.value })} style={{ padding: '0.8rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <option value="">-- Select Category --</option>
                    <option value="ORGANIC CERT. AGRO CHEMICALS">ORGANIC CERT. AGRO CHEMICALS</option>
                    <option value="ORGANIC AGRO CHEMICALS">ORGANIC AGRO CHEMICALS</option>
                    <option value="AGRO CHEMICALS">AGRO CHEMICALS</option>
                    <option value="FERTILIZERS">FERTILIZERS</option>
                    <option value="SEEDS">SEEDS</option>
                    <option value="SPRAYERS">SPRAYERS</option>
                    <option value="FMCG PRODUCTS">FMCG PRODUCTS</option>
                    <option value="HOUSEHOLD PRODUCTS">HOUSEHOLD PRODUCTS</option>
                  </select>
                </div>
                <div className="input-group mb-2"><label>HSN Code</label><input type="text" required onChange={e => setNewProductMaster({ ...newProductMaster, hsn: e.target.value })} /></div>
                <div className="input-group mb-2"><label>Packing Size</label><input type="text" required onChange={e => setNewProductMaster({ ...newProductMaster, pack: e.target.value })} /></div>
                <div className="input-group mb-2"><label>Price Per Unit</label><input type="number" required onChange={e => setNewProductMaster({ ...newProductMaster, price: e.target.value })} /></div>
                <button type="submit" className="btn btn-primary mt-2">Save Product</button>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Edit Product Modal */}
      {showEditProductModal && editingProduct && (
        <div className="modal show modal-fade">
          <div className="modal-content modal-slide" style={{ maxWidth: '500px' }}>
            <div className="modal-header"><h2>Edit Product</h2><button className="btn btn-secondary" onClick={() => setShowEditProductModal(false)}><i className="fa-solid fa-times"></i></button></div>
            <div className="modal-body">
              <form onSubmit={handleUpdateProductMaster}>
                <div className="input-group mb-2"><label>Product Name</label><input type="text" value={editingProduct.name} required onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })} /></div>
                <div className="input-group mb-2"><label>Category</label>
                  <select required value={editingProduct.cat} onChange={e => setEditingProduct({ ...editingProduct, cat: e.target.value })} style={{ padding: '0.8rem', borderRadius: '12px', border: '1px solid var(--border-color)', width: '100%' }}>
                    <option value="">-- Select Category --</option>
                    <option value="ORGANIC CERT. AGRO CHEMICALS">ORGANIC CERT. AGRO CHEMICALS</option>
                    <option value="ORGANIC AGRO CHEMICALS">ORGANIC AGRO CHEMICALS</option>
                    <option value="AGRO CHEMICALS">AGRO CHEMICALS</option>
                    <option value="FERTILIZERS">FERTILIZERS</option>
                    <option value="SEEDS">SEEDS</option>
                    <option value="SPRAYERS">SPRAYERS</option>
                    <option value="FMCG PRODUCTS">FMCG PRODUCTS</option>
                    <option value="HOUSEHOLD PRODUCTS">HOUSEHOLD PRODUCTS</option>
                  </select>
                </div>
                <div className="input-group mb-2"><label>HSN Code</label><input type="text" value={editingProduct.hsn} required onChange={e => setEditingProduct({ ...editingProduct, hsn: e.target.value })} /></div>
                <div className="input-group mb-2"><label>Packing Size</label><input type="text" value={editingProduct.pack} required onChange={e => setEditingProduct({ ...editingProduct, pack: e.target.value })} /></div>
                <div className="input-group mb-2"><label>Price Per Unit</label><input type="number" value={editingProduct.price} required onChange={e => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })} /></div>

                {/* Variations Section in Edit Modal */}
                <div style={{ marginTop: '20px', borderTop: '1px solid #e2e8f0', paddingTop: '15px' }}>
                  <h4 style={{ fontSize: '0.9rem', color: '#1e293b', marginBottom: '10px' }}>Manage Variations</h4>
                  {(editingProduct.subproducts || []).map((sub, idx) => (
                    <div key={sub.id || idx} style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                      <input type="text" placeholder="Pack (e.g. 500ml)" value={sub.pack} style={{ flex: 2, padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0' }} onChange={e => {
                        const subs = [...editingProduct.subproducts];
                        subs[idx].pack = e.target.value;
                        setEditingProduct({ ...editingProduct, subproducts: subs });
                      }} />
                      <input type="number" placeholder="Price" value={sub.price} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0' }} onChange={e => {
                        const subs = [...editingProduct.subproducts];
                        subs[idx].price = parseFloat(e.target.value);
                        setEditingProduct({ ...editingProduct, subproducts: subs });
                      }} />
                      <button type="button" style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => {
                        const subs = editingProduct.subproducts.filter((_, i) => i !== idx);
                        setEditingProduct({ ...editingProduct, subproducts: subs });
                      }}><i className="fa-solid fa-trash"></i></button>
                    </div>
                  ))}
                  <button type="button" className="btn-clean-add" onClick={() => {
                    const subs = editingProduct.subproducts || [];
                    setEditingProduct({ ...editingProduct, subproducts: [...subs, { id: Date.now(), pack: '', price: 0 }] });
                  }}><i className="fa-solid fa-plus"></i> Add Another Variation</button>
                </div>

                <button type="submit" className="btn btn-primary mt-2" style={{ width: '100%', padding: '12px' }}>Save All Changes</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditUserModal && editingUser && (
        <div className="modal show modal-fade">
          <div className="modal-content modal-slide" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h2>Edit Employee</h2>
              <button className="btn btn-secondary" onClick={() => setShowEditUserModal(false)}><i className="fa-solid fa-times"></i></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleUpdateUser}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div className="input-group">
                    <label>Full Name</label>
                    <input type="text" value={editingUser.name || ''} required onChange={e => setEditingUser({ ...editingUser, name: e.target.value })} />
                  </div>
                  <div className="input-group">
                    <label>Employee ID</label>
                    <input type="text" value={editingUser.employee_id || ''} required onChange={e => setEditingUser({ ...editingUser, employee_id: e.target.value })} />
                  </div>
                  <div className="input-group">
                    <label>Email/Username</label>
                    <input type="text" value={editingUser.username || ''} required onChange={e => setEditingUser({ ...editingUser, username: e.target.value })} />
                  </div>
                  <div className="input-group">
                    <label>Assigned Role</label>
                    <select
                      value={editingUser.role || 'Sales'}
                      required
                      onChange={e => setEditingUser({ ...editingUser, role: e.target.value })}
                      style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '2px solid #e2e8f0', background: '#fff' }}
                    >
                      <option value="Admin">Administrator</option>
                      <option value="Sales">Sales Executive</option>
                      <option value="Account">Account</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary mt-3" style={{ width: '100%', padding: '12px', borderRadius: '12px' }}>Update Employee</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
