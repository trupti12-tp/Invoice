import { useState, useEffect } from 'react'
import './App.css'

function App() {
  // --- State Management ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeView, setActiveView] = useState('invoiceView');
  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    companyName: 'SIKKO INDUSTRIES LTD',
    piNumber: '',
    piDate: new Date().toISOString().split('T')[0],
    companyAddress: 'Reg. Office: 508, ISCON ELEGANCE, NR. JAIN TEMPLE...\nDispatch Address: 55 A & B...',
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
    termsConditions: `1. Ones this proforma Invoice is confirmed by the consignee, it can not be changed OR cancelled.
2. Payment Terms : 100% Advanced
3. All good sent outstation is at buyer's risk.
4. All dispute will be settled at court of law- Ahmedabad (Gujarat) Jurisdiction.
5. Above quoted prices are all exfactory (Ahmedabad-Gujarat).
6. Goods sold once will not be taken back at any circumstances.
7. Material will dispatch WITHIN 15 days after payment procedure.`,
    logoImg: '/logo.png',
    signImg: '',
    stampImg: ''
  });

  const [products, setProducts] = useState([
    { id: Date.now(), name: 'SIKKO FERT', hsn: '3105', pack: '200', unit: 'Ltr', qt: 1, qty: 200, price: 500, cgst: 9, sgst: 9, igst: 0 }
  ]);

  const [newClient, setNewClient] = useState({ name: '', gst: '', contact: '', address: '', person: '' });

  // --- Effects ---
  useEffect(() => {
    const savedLoginStatus = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(savedLoginStatus);

    const savedInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    const savedClients = JSON.parse(localStorage.getItem('clients') || '[]');
    
    setInvoices(savedInvoices);

    if (savedClients.length === 0) {
      const dummyClients = [
        { name: "MAHAVEER AGRO CARE", gst: "21DWPPD1549P1Z6", contact: "9337027856", address: "Khatano. 182/110, PlotNo... ODISHA", person: "Mr. Manas Ranjan Das" },
        { name: "SIKKO", gst: "24BBSDF9834J1Z2", contact: "9898989898", address: "Ahmedabad, Gujarat", person: "Admin" }
      ];
      setClients(dummyClients);
      localStorage.setItem('clients', JSON.stringify(dummyClients));
    } else {
      setClients(savedClients);
    }
  }, []);

  // --- Smooth View Switching ---
  const changeView = (view) => {
    if (view === activeView) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveView(view);
      setIsTransitioning(false);
    }, 300);
  };

  // --- Calculations ---
  const calculateTotals = () => {
    let totalQty = 0;
    let totalTaxable = 0;
    let totalGstAmt = 0;

    products.forEach(p => {
      const taxable = (parseFloat(p.qty) || 0) * (parseFloat(p.price) || 0);
      const gstRate = (parseFloat(p.cgst) || 0) + (parseFloat(p.sgst) || 0) + (parseFloat(p.igst) || 0);
      const gstAmt = taxable * (gstRate / 100);
      totalQty += parseFloat(p.qty) || 0;
      totalTaxable += taxable;
      totalGstAmt += gstAmt;
    });

    const subTotal = totalTaxable + totalGstAmt;
    const finalAmt = subTotal + (parseFloat(formData.freightCharges) || 0) + (parseFloat(formData.roundOff) || 0) - (parseFloat(formData.prevCrAmt) || 0);

    return { totalQty, totalTaxable, totalGstAmt, subTotal, finalAmt };
  };

  const { totalQty, totalTaxable, totalGstAmt, subTotal, finalAmt } = calculateTotals();

  // --- Helpers ---
  const numberToWords = (num) => {
    if (num === 0) return 'ZERO ONLY';
    const a = ['','ONE ','TWO ','THREE ','FOUR ', 'FIVE ','SIX ','SEVEN ','EIGHT ','NINE ','TEN ','ELEVEN ','TWELVE ','THIRTEEN ','FOURTEEN ','FIFTEEN ','SIXTEEN ','SEVENTEEN ','EIGHTEEN ','NINETEEN '];
    const b = ['', '', 'TWENTY','THIRTY','FORTY','FIFTY', 'SIXTY','SEVENTY','EIGHTY','NINETY'];
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
    
    let parts = num.toString().split('.');
    let rupees = getWords(parseInt(parts[0]));
    let paise = parts[1] ? getWords(parseInt(parts[1].padEnd(2, '0'))) : '';
    
    let res = rupees;
    if (paise) res += 'AND ' + paise + 'PAISE ';
    return res + 'ONLY';
  };

  // --- Handlers ---
  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleClientSelect = (e) => {
    const clientName = e.target.value;
    if (!clientName) return;
    const client = clients.find(c => c.name === clientName);
    if (client) {
      setFormData(prev => ({
        ...prev,
        consigneeName: client.name,
        consigneeGst: client.gst || '',
        consigneeContact: client.contact || '',
        consigneeAddress: client.address || '',
        consigneePerson: client.person || ''
      }));
    }
  };

  const handleImageUpload = (e, key) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setFormData(prev => ({ ...prev, [key]: ev.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addProduct = () => {
    setProducts([...products, { id: Date.now(), name: 'SIKKO FERT', hsn: '3105', pack: '200', unit: 'Ltr', qt: 1, qty: 200, price: 500, cgst: 9, sgst: 9, igst: 0 }]);
  };

  const updateProduct = (id, field, value) => {
    setProducts(products.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const removeProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const saveInvoice = () => {
    const piNumber = formData.piNumber || 'INV-' + Date.now();
    const newInv = {
      id: piNumber,
      client: formData.consigneeName || 'Unknown Client',
      amount: finalAmt,
      date: new Date().toISOString()
    };

    const updatedInvoices = [...invoices, newInv];
    setInvoices(updatedInvoices);
    localStorage.setItem('invoices', JSON.stringify(updatedInvoices));

    if (formData.consigneeName && !clients.find(c => c.name === formData.consigneeName)) {
      const newCl = { 
        name: formData.consigneeName, 
        gst: formData.consigneeGst, 
        contact: formData.consigneeContact,
        address: formData.consigneeAddress,
        person: formData.consigneePerson
      };
      const updatedClients = [...clients, newCl];
      setClients(updatedClients);
      localStorage.setItem('clients', JSON.stringify(updatedClients));
    }

    alert('Invoice Saved Successfully!');
  };

  const generatePDF = () => {
    const element = document.getElementById('invoiceA4');
    const opt = {
      margin: 0,
      filename: `Invoice_${formData.piNumber || '001'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    if (!showPreviewModal) {
       setShowPreviewModal(true);
       setTimeout(() => {
         window.html2pdf().set(opt).from(element).save().then(() => {
           saveInvoice();
         });
       }, 500);
    } else {
      window.html2pdf().set(opt).from(element).save().then(() => {
        saveInvoice();
      });
    }
  };

  const handleAddClientSubmit = (e) => {
    e.preventDefault();
    if (newClient.name) {
      const updatedClients = [...clients, newClient];
      setClients(updatedClients);
      localStorage.setItem('clients', JSON.stringify(updatedClients));
      setShowAddClientModal(false);
      setNewClient({ name: '', gst: '', contact: '', address: '', person: '' });
      alert('Client Added Successfully!');
    }
  };

  // --- Render Login ---
  if (!isLoggedIn) {
    return (
      <div className="login-body">
        <div className="login-wrapper">
          <div className="login-left">
            <div className="login-logo">
              <img src="/logo.png" alt="Logo" style={{ height: '40px', borderRadius: '50%' }} />
              <span>SIKKO</span>
            </div>
            <h1>Welcome Back!</h1>
            <p>Log in to your account to manage invoices, clients, and reports seamlessly.</p>
            <div className="login-illustration">
              <i className="fa-solid fa-file-invoice-dollar" style={{ fontSize: '8rem', color: 'rgba(255,255,255,0.2)' }}></i>
            </div>
          </div>
          <div className="login-right">
            <div className="login-form-container">
              <h2>Sign In</h2>
              <p className="text-muted">Enter your credentials to access the dashboard</p>
              <form onSubmit={handleLogin} className="mt-2">
                <div className="input-group">
                  <label>Email Address</label>
                  <div className="input-with-icon">
                    <i className="fa-regular fa-envelope"></i>
                    <input type="email" placeholder="admin@sikko.com" required />
                  </div>
                </div>
                <div className="input-group mt-2">
                  <label>Password</label>
                  <div className="input-with-icon">
                    <i className="fa-solid fa-lock"></i>
                    <input type="password" placeholder="••••••••" required />
                  </div>
                </div>
                <div className="login-options mt-2">
                  <label className="remember-me">
                    <input type="checkbox" defaultChecked />
                    <span>Remember me</span>
                  </label>
                  <a href="#" className="forgot-password">Forgot Password?</a>
                </div>
                <button type="submit" className="btn btn-primary login-btn mt-2">
                  <span>Log In</span> <i className="fa-solid fa-arrow-right"></i>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Render Dashboard ---
  return (
    <div className="app-container" style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src="/logo.png" alt="Sikko Logo" style={{ height: '40px', marginRight: '10px', borderRadius: '50%' }} />
          <span className="logo-text">SIKKO</span>
        </div>
        <ul className="sidebar-nav">
          <li>
            <a href="#" className={`nav-link ${activeView === 'dashboardView' ? 'active' : ''}`} onClick={() => changeView('dashboardView')}>
              <i className="fa-solid fa-chart-pie"></i> Dashboard
            </a>
          </li>
          <li>
            <a href="#" className={`nav-link ${activeView === 'invoiceView' ? 'active' : ''}`} onClick={() => changeView('invoiceView')}>
              <i className="fa-solid fa-file-invoice"></i> Invoices
            </a>
          </li>
          <li>
            <a href="#" className={`nav-link ${activeView === 'clientsView' ? 'active' : ''}`} onClick={() => changeView('clientsView')}>
              <i className="fa-solid fa-users"></i> Clients
            </a>
          </li>
          <li>
            <a href="#" className={`nav-link ${activeView === 'reportsView' ? 'active' : ''}`} onClick={() => changeView('reportsView')}>
              <i className="fa-solid fa-chart-line"></i> Reports
            </a>
          </li>
        </ul>
        <div style={{ marginTop: 'auto', padding: '1rem' }}>
          <button className="nav-link" style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer' }} onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket"></i> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        
        <div className={`view-transition-wrapper ${isTransitioning ? 'fading' : ''}`}>
          {/* DASHBOARD VIEW */}
          {activeView === 'dashboardView' && (
            <section id="dashboardView" className="view-section">
              <header className="top-header">
                <h2>Dashboard Overview</h2>
              </header>
              <div className="view-body">
                <div className="grid-3 mt-2">
                  <div className="stat-card">
                    <i className="fa-solid fa-file-invoice" style={{ color: 'var(--primary)', fontSize: '2rem' }}></i>
                    <div>
                      <h3>Total Invoices</h3>
                      <p>{invoices.length}</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <i className="fa-solid fa-users" style={{ color: '#10b981', fontSize: '2rem' }}></i>
                    <div>
                      <h3>Total Clients</h3>
                      <p>{clients.length}</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <i className="fa-solid fa-wallet" style={{ color: '#f59e0b', fontSize: '2rem' }}></i>
                    <div>
                      <h3>Revenue</h3>
                      <p>₹ {invoices.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                    </div>
                  </div>
                </div>
                <div className="form-card mt-2">
                  <h3>Recent Activity</h3>
                  <div id="dashRecentActivity">
                    {invoices.length > 0 ? (
                      invoices.slice(-5).reverse().map((inv, i) => (
                        <p key={i} className="text-muted mt-2">Invoice #{inv.id} generated for {inv.client}.</p>
                      ))
                    ) : (
                      <p className="text-muted mt-2">No activity yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* CLIENTS VIEW */}
          {activeView === 'clientsView' && (
            <section id="clientsView" className="view-section">
              <header className="top-header">
                <h2>Manage Clients</h2>
                <button className="btn btn-primary" onClick={() => setShowAddClientModal(true)}>
                  <i className="fa-solid fa-plus"></i> Add Client
                </button>
              </header>
              <div className="view-body">
                <div className="form-card mt-2">
                  <h3>Client Directory</h3>
                  <div className="table-responsive">
                    <table className="form-table mt-2">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>GST No.</th>
                          <th>Contact</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clients.length > 0 ? (
                          clients.map((c, i) => (
                            <tr key={i}>
                              <td>{c.name}</td>
                              <td>{c.gst}</td>
                              <td>{c.contact}</td>
                              <td><button className="btn btn-secondary">Edit</button></td>
                            </tr>
                          ))
                        ) : (
                          <tr><td colSpan="4" className="text-center text-muted">No clients added yet.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* REPORTS VIEW */}
          {activeView === 'reportsView' && (
            <section id="reportsView" className="view-section">
              <header className="top-header">
                <h2>Reports & Analytics</h2>
                <button className="btn btn-secondary"><i className="fa-solid fa-download"></i> Export Data (CSV)</button>
              </header>
              <div className="view-body">
                <div className="form-card mt-2">
                  <h3>Monthly Tax Report (GST)</h3>
                  <div className="table-responsive">
                    <table className="form-table mt-2">
                      <thead>
                        <tr>
                          <th>Client</th>
                          <th>Invoices</th>
                          <th>Taxable Amount</th>
                          <th>Total GST</th>
                          <th>Grand Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoices.length > 0 ? (
                          Object.entries(invoices.reduce((acc, inv) => {
                            if (!acc[inv.client]) acc[inv.client] = { count: 0, revenue: 0 };
                            acc[inv.client].count++;
                            acc[inv.client].revenue += inv.amount;
                            return acc;
                          }, {})).map(([name, stat], i) => (
                            <tr key={i}>
                              <td>{name}</td>
                              <td>{stat.count}</td>
                              <td>-</td>
                              <td>-</td>
                              <td>₹ {stat.revenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                            </tr>
                          ))
                        ) : (
                          <tr><td colSpan="5" className="text-center text-muted">No data available.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* INVOICE GENERATOR VIEW */}
          {activeView === 'invoiceView' && (
            <section id="invoiceView" className="view-section">
              <header className="top-header">
                <h2>Invoice Generator</h2>
                <div className="header-actions" style={{ display: 'flex', gap: '10px' }}>
                  <button className="btn btn-secondary" onClick={saveInvoice}><i className="fa-solid fa-floppy-disk"></i> Save Data</button>
                  <button className="btn btn-secondary" onClick={() => setShowPreviewModal(true)}><i className="fa-solid fa-eye"></i> Preview</button>
                  <button className="btn btn-primary" onClick={generatePDF}><i className="fa-solid fa-file-pdf"></i> Generate PDF</button>
                </div>
              </header>

              <div className="form-section">
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="form-card card-hover">
                    <h3><i className="fa-solid fa-building"></i> Company Info</h3>
                    <div className="grid-3">
                      <div className="input-group">
                        <label>Company Name</label>
                        <input type="text" id="companyName" value={formData.companyName} onChange={handleInputChange} />
                      </div>
                      <div className="input-group">
                        <label>PI Number</label>
                        <input type="text" id="piNumber" placeholder="Enter PI Number" value={formData.piNumber} onChange={handleInputChange} />
                      </div>
                      <div className="input-group">
                        <label>PI Date</label>
                        <input type="date" id="piDate" value={formData.piDate} onChange={handleInputChange} />
                      </div>
                      <div className="input-group full-width">
                        <label>Reg. & Dispatch Address</label>
                        <textarea id="companyAddress" rows="2" value={formData.companyAddress} onChange={handleInputChange}></textarea>
                      </div>
                      <div className="input-group">
                        <label>GST No.</label>
                        <input type="text" id="companyGst" value={formData.companyGst} onChange={handleInputChange} />
                      </div>
                      <div className="input-group">
                        <label>Concerned Person</label>
                        <input type="text" id="companyPerson" value={formData.companyPerson} onChange={handleInputChange} />
                      </div>
                      <div className="input-group">
                        <label>Contact No.</label>
                        <input type="text" id="companyContact" value={formData.companyContact} onChange={handleInputChange} />
                      </div>
                      <div className="input-group full-width">
                        <label>Upload Company Logo</label>
                        <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'logoImg')} />
                      </div>
                    </div>
                  </div>

                  <div className="form-card card-hover">
                    <h3><i className="fa-solid fa-user-tie"></i> Bill To & Ship To (Consignee)</h3>
                    <div className="grid-3">
                      <div className="input-group full-width">
                        <label>Select Existing Client (Auto-fill)</label>
                        <select onChange={handleClientSelect} style={{ background: '#f0f4ff', borderColor: '#6366f1' }}>
                          <option value="">-- Choose a Client --</option>
                          {clients.map((c, i) => <option key={i} value={c.name}>{c.name}</option>)}
                        </select>
                      </div>
                      <div className="input-group full-width">
                        <label>Consignee Name</label>
                        <input type="text" id="consigneeName" placeholder="Enter Customer Name" value={formData.consigneeName} onChange={handleInputChange} />
                      </div>
                      <div className="input-group full-width">
                        <label>Address</label>
                        <textarea id="consigneeAddress" rows="2" placeholder="Enter Full Address" value={formData.consigneeAddress} onChange={handleInputChange}></textarea>
                      </div>
                      <div className="input-group">
                        <label>GST No.</label>
                        <input type="text" id="consigneeGst" placeholder="Enter GST Number" value={formData.consigneeGst} onChange={handleInputChange} />
                      </div>
                      <div className="input-group">
                        <label>Concerned Person</label>
                        <input type="text" id="consigneePerson" placeholder="Enter Contact Person" value={formData.consigneePerson} onChange={handleInputChange} />
                      </div>
                      <div className="input-group">
                        <label>Contact No.</label>
                        <input type="text" id="consigneeContact" placeholder="Enter Phone Number" value={formData.consigneeContact} onChange={handleInputChange} />
                      </div>
                      <div className="input-group">
                        <label>Transporter Name</label>
                        <input type="text" id="transporterName" placeholder="e.g. TCI Freight" value={formData.transporterName} onChange={handleInputChange} />
                      </div>
                      <div className="input-group">
                        <label>Delivery Location</label>
                        <input type="text" id="deliveryLocation" placeholder="e.g. Ahmedabad" value={formData.deliveryLocation} onChange={handleInputChange} />
                      </div>
                    </div>
                  </div>

                  <div className="form-card card-hover">
                    <h3><i className="fa-solid fa-box"></i> Products</h3>
                    <div className="table-responsive">
                      <table className="form-table">
                        <thead>
                          <tr>
                            <th>Product Name</th>
                            <th>HSN Code</th>
                            <th>Packing Size</th>
                            <th>Qty Unit</th>
                            <th>Qt. C/S</th>
                            <th>Total Qty</th>
                            <th>Price/Unit</th>
                            <th>CGST%</th>
                            <th>SGST%</th>
                            <th>IGST%</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.map(p => (
                            <tr key={p.id}>
                              <td><input type="text" placeholder="Product" value={p.name} onChange={(e) => updateProduct(p.id, 'name', e.target.value)} /></td>
                              <td><input type="text" value={p.hsn} style={{ width: '80px' }} onChange={(e) => updateProduct(p.id, 'hsn', e.target.value)} /></td>
                              <td><input type="text" placeholder="Size" value={p.pack} style={{ width: '80px' }} onChange={(e) => updateProduct(p.id, 'pack', e.target.value)} /></td>
                              <td>
                                <select value={p.unit} onChange={(e) => updateProduct(p.id, 'unit', e.target.value)} style={{ width: '70px' }}>
                                  <option value="Ltr">Ltr</option><option value="ml">ml</option><option value="kg">kg</option><option value="gm">gm</option>
                                </select>
                              </td>
                              <td><input type="number" value={p.qt} style={{ width: '60px' }} onChange={(e) => updateProduct(p.id, 'qt', e.target.value)} /></td>
                              <td><input type="number" value={p.qty} style={{ width: '80px' }} onChange={(e) => updateProduct(p.id, 'qty', e.target.value)} /></td>
                              <td><input type="number" value={p.price} style={{ width: '90px' }} onChange={(e) => updateProduct(p.id, 'price', e.target.value)} /></td>
                              <td><input type="number" value={p.cgst} style={{ width: '60px' }} onChange={(e) => updateProduct(p.id, 'cgst', e.target.value)} /></td>
                              <td><input type="number" value={p.sgst} style={{ width: '60px' }} onChange={(e) => updateProduct(p.id, 'sgst', e.target.value)} /></td>
                              <td><input type="number" value={p.igst} style={{ width: '60px' }} onChange={(e) => updateProduct(p.id, 'igst', e.target.value)} /></td>
                              <td><button className="btn btn-danger" style={{ padding: '8px' }} onClick={() => removeProduct(p.id)}><i className="fa-solid fa-trash"></i></button></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <button type="button" className="btn btn-secondary mt-2 btn-smooth" onClick={addProduct}><i className="fa-solid fa-plus"></i> Add Product</button>
                  </div>

                  <div className="form-card card-hover">
                    <h3><i className="fa-solid fa-calculator"></i> Totals & Footer</h3>
                    <div className="grid-3">
                      <div className="input-group">
                        <label>Freight Charges</label>
                        <input type="number" id="freightCharges" value={formData.freightCharges} onChange={handleInputChange} />
                      </div>
                      <div className="input-group">
                        <label>Round Off</label>
                        <input type="number" id="roundOff" value={formData.roundOff} onChange={handleInputChange} />
                      </div>
                      <div className="input-group">
                        <label>Prev Cr. Amt.</label>
                        <input type="number" id="prevCrAmt" value={formData.prevCrAmt} onChange={handleInputChange} />
                      </div>
                    </div>
                    <div className="input-group full-width mt-2">
                      <label>Terms & Conditions</label>
                      <textarea id="termsConditions" rows="5" value={formData.termsConditions} onChange={handleInputChange}></textarea>
                    </div>
                    <div className="grid-3 mt-2">
                      <div className="input-group">
                        <label>Consignor Signature</label>
                        <input type="file" onChange={(e) => handleImageUpload(e, 'signImg')} />
                      </div>
                      <div className="input-group">
                        <label>Consignee Stamp</label>
                        <input type="file" onChange={(e) => handleImageUpload(e, 'stampImg')} />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Preview Modal */}
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
                <div className="inv-top-bar">PROFORMA INVOICE</div>
                <div className="inv-header">
                  <div className="inv-logo">
                    <img src={formData.logoImg} alt="Logo" style={{ maxWidth: '100%', maxHeight: '80px', objectFit: 'contain' }} />
                  </div>
                  <div className="inv-company">
                    <h1>{formData.companyName}</h1>
                    <p dangerouslySetInnerHTML={{ __html: formData.companyAddress.replace(/\n/g, '<br>') }}></p>
                  </div>
                  <div className="inv-meta">
                    <div className="meta-grid">
                      <div className="m-label">PI Number:</div><div className="m-val">{formData.piNumber}</div>
                      <div className="m-label">PI Date:</div><div className="m-val">{formData.piDate}</div>
                      <div className="m-label">GST No:</div><div className="m-val fw-bold">{formData.companyGst}</div>
                      <div className="m-label">Concerned:</div><div className="m-val">{formData.companyPerson}</div>
                    </div>
                  </div>
                </div>

                <div className="inv-section-title">
                  <div className="left-title">Bill To & Ship To Address</div>
                  <div className="right-title">Bank Details</div>
                </div>

                <div className="inv-details">
                  <div className="inv-bill-to">
                    <div className="dt-row"><strong>Consignee:</strong> {formData.consigneeName}</div>
                    <div className="dt-row"><strong>Address:</strong> {formData.consigneeAddress}</div>
                    <div className="dt-row"><strong>GST No.</strong> {formData.consigneeGst}</div>
                    <div className="dt-grid">
                      <div className="dt-col"><strong>Concerned:</strong> {formData.consigneePerson}</div>
                      <div className="dt-col border-left"><strong>Transporter:</strong> <span className="text-red">{formData.transporterName}</span></div>
                    </div>
                  </div>
                  <div className="inv-bank">
                    <div className="bank-top-title">A/C Details</div>
                    <div className="bank-content">
                      <div className="bank-text">
                        <p><strong>Bank:</strong> <span className="text-red">{formData.bankName}</span></p>
                        <p><strong>A/C:</strong> <span className="text-red">{formData.acName}</span></p>
                        <p><strong>No:</strong> <span className="text-red">{formData.acNo}</span></p>
                        <p><strong>IFSC:</strong> <span className="text-red">{formData.ifscCode}</span></p>
                      </div>
                    </div>
                  </div>
                </div>

                <table className="inv-table">
                  <thead>
                    <tr>
                      <th>SL.</th>
                      <th>Product</th>
                      <th>HSN Code</th>
                      <th>Packing Size</th>
                      <th>Qt. C/S</th>
                      <th>Total Qty</th>
                      <th>Price/Unit</th>
                      <th>Taxable</th>
                      <th>GST%</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p, i) => {
                      const taxable = (parseFloat(p.qty) || 0) * (parseFloat(p.price) || 0);
                      const gstRate = (parseFloat(p.cgst) || 0) + (parseFloat(p.sgst) || 0) + (parseFloat(p.igst) || 0);
                      const total = taxable * (1 + gstRate / 100);
                      return (
                        <tr key={p.id}>
                          <td>{i + 1}</td>
                          <td>{p.name}</td>
                          <td>{p.hsn}</td>
                          <td>{p.pack} {p.unit}</td>
                          <td>{p.qt}</td>
                          <td>{p.qty}</td>
                          <td>{p.price}</td>
                          <td>{taxable.toFixed(2)}</td>
                          <td>{gstRate}%</td>
                          <td>{total.toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="fw-bold bg-light">
                      <td colSpan="5">Total</td><td>{totalQty}</td><td></td><td>{totalTaxable.toFixed(2)}</td><td></td><td>{subTotal.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>

                <div className="inv-footer-totals">
                  <div className="amt-words-section">
                    <div className="words-label">Amt. in Word</div>
                    <div className="words-val">{numberToWords(finalAmt.toFixed(2))}</div>
                  </div>
                  <div className="totals-section">
                    <div className="t-row"><div className="t-label">Sub Total</div><div className="t-val">{subTotal.toFixed(2)}</div></div>
                    <div className="t-row"><div className="t-label">Freight</div><div className="t-val">{formData.freightCharges}</div></div>
                    <div className="t-row final-amt-row"><div className="t-label">Final Amt.</div><div className="t-val">{finalAmt.toFixed(2)}</div></div>
                    <div className="sign-area">
                      <p>For {formData.companyName}</p>
                      {formData.signImg && <img src={formData.signImg} style={{ maxHeight: '50px' }} />}
                      <p>Trade Executive</p>
                      <p>({formData.companyPerson})</p>
                    </div>
                  </div>
                </div>

                <div className="inv-terms-area">
                  <div className="terms-box">
                    <div className="terms-title text-red">TERMS & CONDITIONS:</div>
                    <div className="terms-list">
                      {formData.termsConditions.split('\n').map((t, i) => <div key={i}>{t}</div>)}
                    </div>
                  </div>
                  <div className="consignee-sign">
                    <p>Accepted by Consignee</p>
                    {formData.stampImg && <img src={formData.stampImg} style={{ maxHeight: '50px' }} />}
                    <p className="fw-bold">{formData.consigneePerson}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Client Modal */}
      {showAddClientModal && (
        <div className="modal show modal-fade">
          <div className="modal-content modal-slide" style={{ maxWidth: '500px', height: 'auto' }}>
            <div className="modal-header">
              <h2>Add New Client</h2>
              <button className="btn btn-secondary btn-smooth" onClick={() => setShowAddClientModal(false)}><i className="fa-solid fa-times"></i></button>
            </div>
            <div className="modal-body" style={{ display: 'block' }}>
              <form onSubmit={handleAddClientSubmit}>
                <div className="input-group">
                  <label>Client Name *</label>
                  <input type="text" required value={newClient.name} onChange={(e) => setNewClient({ ...newClient, name: e.target.value })} />
                </div>
                <div className="input-group mt-2">
                  <label>GST No.</label>
                  <input type="text" value={newClient.gst} onChange={(e) => setNewClient({ ...newClient, gst: e.target.value })} />
                </div>
                <div className="input-group mt-2">
                  <label>Contact No.</label>
                  <input type="text" value={newClient.contact} onChange={(e) => setNewClient({ ...newClient, contact: e.target.value })} />
                </div>
                <div className="input-group mt-2">
                  <label>Full Address</label>
                  <textarea value={newClient.address} onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}></textarea>
                </div>
                <div className="input-group mt-2">
                  <label>Concerned Person</label>
                  <input type="text" value={newClient.person} onChange={(e) => setNewClient({ ...newClient, person: e.target.value })} />
                </div>
                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                  <button type="button" className="btn btn-secondary btn-smooth" onClick={() => setShowAddClientModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary btn-smooth">Save Client</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
