// script.js - Light Theme Dashboard with Exact Format Modal Preview

document.addEventListener('DOMContentLoaded', () => {

  // --- Sidebar Navigation & View Switching ---
  const navLinks = document.querySelectorAll('.nav-link');
  const views = document.querySelectorAll('.view-section');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Update active nav state
      navLinks.forEach(l => l.classList.remove('active'));
      e.currentTarget.classList.add('active');
      
      // Switch Views smoothly
      const targetId = e.currentTarget.getAttribute('data-target');
      
      views.forEach(view => {
        if(view.id === targetId) {
          view.classList.remove('hidden');
          // small delay to allow display:block to apply before animating opacity
          setTimeout(() => {
            view.style.opacity = '1';
            view.style.transform = 'translateY(0)';
          }, 50);
        } else {
          view.style.opacity = '0';
          view.style.transform = 'translateY(10px)';
          setTimeout(() => {
            if(view.style.opacity === '0') {
              view.classList.add('hidden');
            }
          }, 400); // match transition duration
        }
      });
    });
  });

  // --- Modal Logic ---
  const modal = document.getElementById('previewModal');
  const previewBtn = document.getElementById('previewBtn');
  const closeBtn = document.getElementById('closePreviewBtn');

  previewBtn.addEventListener('click', () => {
    updatePreview();
    modal.classList.add('show');
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('show');
  });

  // Close when clicking outside
  modal.addEventListener('click', (e) => {
    if(e.target === modal) modal.classList.remove('show');
  });

  // --- Products Dynamic Rows ---
  const productRows = document.getElementById('productRows');
  const addProductBtn = document.getElementById('addProductBtn');
  let rowCount = 0;

  const addRow = () => {
    rowCount++;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input type="text" class="p-name" placeholder="Product Name" value="SIKKO FERTILIZER"></td>
      <td><input type="text" class="p-hsn" placeholder="HSN" value="3105"></td>
      <td><input type="number" class="p-pack" placeholder="Size" value="200"></td>
      <td>
        <select class="p-unit">
          <option value="Ltr" selected>Ltr</option>
          <option value="ml">ml</option>
          <option value="kg">kg</option>
          <option value="gm">gm</option>
        </select>
      </td>
      <td><input type="number" class="p-qt" placeholder="Qt." value="1"></td>
      <td><input type="number" class="p-qty" placeholder="Total Qty" value="200"></td>
      <td><input type="number" class="p-price" placeholder="Price" value="500"></td>
      <td><input type="number" class="p-cgst" placeholder="CGST%" value="9"></td>
      <td><input type="number" class="p-sgst" placeholder="SGST%" value="9"></td>
      <td><input type="number" class="p-igst" placeholder="IGST%" value="0"></td>
      <td><button type="button" class="btn btn-danger remove-btn"><i class="fa-solid fa-trash"></i></button></td>
    `;
    productRows.appendChild(tr);

    tr.querySelector('.remove-btn').addEventListener('click', () => {
      tr.remove();
    });
  };

  addProductBtn.addEventListener('click', addRow);
  
  // Add initial row
  addRow();

  // --- Number to Words ---
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

  // --- Update Preview Logic ---
  const updatePreview = () => {
    // Top Info
    document.getElementById('p_companyName').textContent = document.getElementById('companyName').value;
    document.getElementById('p_piNumber').textContent = document.getElementById('piNumber').value;
    
    // Format date nicely (DD.MM.YYYY)
    const dVal = document.getElementById('piDate').value;
    if(dVal) {
        const [y,m,d] = dVal.split('-');
        document.getElementById('p_piDate').textContent = `${d}.${m}.${y}`;
    } else {
        document.getElementById('p_piDate').textContent = '';
    }

    // Company format exactly like image
    document.getElementById('p_companyAddress').innerHTML = document.getElementById('companyAddress').value.replace(/\n/g, '<br>');
    document.getElementById('p_companyGst').textContent = document.getElementById('companyGst').value;
    document.getElementById('p_companyPerson').textContent = document.getElementById('companyPerson').value;
    document.getElementById('p_companyContact').textContent = document.getElementById('companyContact').value;
    document.getElementById('p_signCompany').textContent = document.getElementById('companyName').value;
    document.getElementById('p_signPerson').textContent = document.getElementById('companyPerson').value;

    // Consignee
    document.getElementById('p_consigneeName').textContent = document.getElementById('consigneeName').value;
    document.getElementById('p_consigneeAddress').textContent = document.getElementById('consigneeAddress').value;
    document.getElementById('p_consigneeGst').textContent = document.getElementById('consigneeGst').value;
    document.getElementById('p_consigneePerson').textContent = document.getElementById('consigneePerson').value;
    document.getElementById('p_consigneeContact').textContent = document.getElementById('consigneeContact').value;
    document.getElementById('p_transporterName').textContent = document.getElementById('transporterName').value;
    document.getElementById('p_deliveryLocation').textContent = document.getElementById('deliveryLocation').value;
    document.getElementById('p_consigneeSignName').textContent = document.getElementById('consigneePerson').value;

    // Bank
    document.getElementById('p_bankName').textContent = document.getElementById('bankName').value;
    document.getElementById('p_acName').textContent = document.getElementById('acName').value;
    document.getElementById('p_acNo').textContent = document.getElementById('acNo').value;
    document.getElementById('p_ifscCode').textContent = document.getElementById('ifscCode').value;
    document.getElementById('p_branch').textContent = document.getElementById('branch').value;

    // Products
    const tbody = document.getElementById('p_tableBody');
    tbody.innerHTML = '';
    let totalQty = 0, totalTaxable = 0, totalGstAmt = 0;

    const rows = productRows.querySelectorAll('tr');
    rows.forEach((tr, index) => {
      const name = tr.querySelector('.p-name').value;
      const hsn = tr.querySelector('.p-hsn').value;
      const packStr = tr.querySelector('.p-pack').value + ' ' + tr.querySelector('.p-unit').value;
      const qt = tr.querySelector('.p-qt').value;
      const qty = parseFloat(tr.querySelector('.p-qty').value) || 0;
      const price = parseFloat(tr.querySelector('.p-price').value) || 0;
      const cgst = parseFloat(tr.querySelector('.p-cgst').value) || 0;
      const sgst = parseFloat(tr.querySelector('.p-sgst').value) || 0;
      const igst = parseFloat(tr.querySelector('.p-igst').value) || 0;

      const taxable = qty * price;
      const gstRate = cgst + sgst + igst;
      const gstAmt = taxable * (gstRate / 100);
      const rowTotal = taxable + gstAmt;

      totalQty += qty;
      totalTaxable += taxable;
      totalGstAmt += gstAmt;

      // Make product name bold and red if needed? The image had subtext in red, but we just output the name here.
      // We will allow basic HTML in the product name if user wants to add styling later, but simple text is safe.
      tbody.insertAdjacentHTML('beforeend', `
        <tr>
          <td>${index + 1}</td>
          <td>${name}</td>
          <td>${hsn}</td>
          <td>${packStr}</td>
          <td>${qt}</td>
          <td>${qty}</td>
          <td>${price}</td>
          <td>${taxable.toFixed(2)}</td>
          <td>${cgst ? cgst + '%' : ''}</td>
          <td>${sgst ? sgst + '%' : ''}</td>
          <td>${igst ? igst + '%' : ''}</td>
          <td>${gstAmt.toFixed(2)}</td>
          <td>${rowTotal.toFixed(2)}</td>
        </tr>
      `);
    });

    // Fill Totals
    document.getElementById('p_totalQty').textContent = totalQty;
    document.getElementById('p_totalTaxable').textContent = totalTaxable.toFixed(2);
    document.getElementById('p_totalGstAmt').textContent = totalGstAmt.toFixed(2);
    
    const subTotal = totalTaxable + totalGstAmt;
    document.getElementById('p_totalAmt').textContent = subTotal.toFixed(2);
    
    const freight = parseFloat(document.getElementById('freightCharges').value) || 0;
    const roundOff = parseFloat(document.getElementById('roundOff').value) || 0;
    const prevCr = parseFloat(document.getElementById('prevCrAmt').value) || 0;

    document.getElementById('p_freight').textContent = freight.toFixed(2);
    document.getElementById('p_roundOff').textContent = roundOff.toFixed(2);
    document.getElementById('p_prevCr').textContent = prevCr.toFixed(2);

    const finalAmt = subTotal + freight + roundOff - prevCr;
    document.getElementById('p_finalAmt').textContent = finalAmt.toFixed(2);
    document.getElementById('p_totalAmtWithGst').textContent = finalAmt.toFixed(2);

    document.getElementById('p_amtInWords').textContent = numberToWords(finalAmt.toFixed(2));

    // Terms
    const terms = document.getElementById('termsConditions').value.split('\n').filter(t => t.trim() !== '');
    const termsDiv = document.getElementById('p_termsList');
    termsDiv.innerHTML = terms.map(t => `<div>${t}</div>`).join('');

    // Make preview fields editable directly
    const editableElements = document.querySelectorAll('#invoiceA4 span, #invoiceA4 p, #invoiceA4 td, #invoiceA4 div.m-val, #invoiceA4 h1, #invoiceA4 .dt-row strong, #invoiceA4 .terms-list div, #invoiceA4 .words-val');
    editableElements.forEach(el => {
      // Don't make the total calculated spans completely uneditable if the user wants to override, 
      // but generally we just add contenteditable="true" to everything text-based in the invoice.
      el.setAttribute('contenteditable', 'true');
      el.style.outline = 'none'; // prevent ugly blue border when clicking
    });
  };

  // --- Image Upload Handlers ---
  const handleImageUpload = (inputId, imgId, placeholderId = null) => {
    const input = document.getElementById(inputId);
    const img = document.getElementById(imgId);
    if(input && img) {
      input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if(file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            img.src = e.target.result;
            img.style.display = 'block';
            if(placeholderId) {
              const placeholder = document.getElementById(placeholderId);
              if(placeholder) placeholder.style.display = 'none';
            }
          };
          reader.readAsDataURL(file);
        } else {
          img.style.display = 'none';
          img.src = '';
          if(placeholderId) {
            const placeholder = document.getElementById(placeholderId);
            if(placeholder) placeholder.style.display = 'flex';
          }
        }
      });
    }
  };

  handleImageUpload('logoUpload', 'p_logoImg', 'p_logoPlaceholder');
  handleImageUpload('signUpload', 'p_signImg');
  handleImageUpload('stampUpload', 'p_stampImg');

  // --- PDF Generation ---
  const generatePDF = (shouldUpdateFirst = false) => {
    // Only update from form if explicitly requested (e.g. from main screen)
    // If generating from the modal, we keep the existing (potentially manually edited) state
    if(shouldUpdateFirst) {
        updatePreview();
    }
    
    // We target the actual A4 div inside the modal
    const element = document.getElementById('invoiceA4');
    
    // Setup html2pdf options
    const opt = {
      margin:       0,
      filename:     `Invoice_${document.getElementById('piNumber').value || '001'}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Make modal temporarily visible but off-screen if it's hidden so html2canvas can read it
    const wasHidden = !modal.classList.contains('show');
    if(wasHidden) {
        modal.style.opacity = '0';
        modal.classList.add('show');
    }

    html2pdf().set(opt).from(element).save().then(() => {
        if(wasHidden) {
            modal.classList.remove('show');
            modal.style.opacity = '1';
        }
        // Save to Local Storage and Update Dashboards
        saveInvoice();
    });
  };

  document.getElementById('generatePdfBtn').addEventListener('click', () => generatePDF(true));
  document.getElementById('downloadPdfModalBtn').addEventListener('click', () => generatePDF(false));

  // --- Export Report as CSV ---
  const exportReportBtn = document.getElementById('exportReportBtn');
  if(exportReportBtn) {
    exportReportBtn.addEventListener('click', () => {
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "Month,Total Invoices,Taxable Amount,Total GST,Grand Total\n";
      csvContent += "April 2025,45,850000,153000,1003000\n";
      csvContent += "May 2025,12,235150,40507,275657\n";
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "Monthly_Tax_Report.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // --- LocalStorage & Dynamic Dashboard Logic ---
  const saveInvoice = () => {
    // Ensure math is calculated by updating preview first behind the scenes
    updatePreview();

    let invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    let clients = JSON.parse(localStorage.getItem('clients') || '[]');

    const piNumber = document.getElementById('piNumber').value || 'INV-' + Date.now();
    const clientName = document.getElementById('consigneeName').value || 'Unknown Client';
    const clientGst = document.getElementById('consigneeGst').value || '---';
    const clientContact = document.getElementById('consigneeContact').value || '---';
    const totalAmt = document.getElementById('p_finalAmt').innerText || '0';
    
    // Save Client
    if(clientName !== 'Unknown Client') {
      const existingClient = clients.find(c => c.name === clientName);
      if(!existingClient) {
        clients.push({ name: clientName, gst: clientGst, contact: clientContact });
        localStorage.setItem('clients', JSON.stringify(clients));
      }
    }

    // Save Invoice
    invoices.push({
      id: piNumber,
      client: clientName,
      amount: parseFloat(totalAmt.replace(/,/g, '')) || 0,
      date: new Date().toISOString()
    });
    localStorage.setItem('invoices', JSON.stringify(invoices));

    renderDashboard();
  };

  const saveBtn = document.getElementById('saveBtn');
  if(saveBtn) {
    saveBtn.addEventListener('click', () => {
        saveInvoice();
        alert('Data Saved! The dashboard, clients, and reports have been updated immediately.');
    });
  }

  const renderDashboard = () => {
    let invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    let clients = JSON.parse(localStorage.getItem('clients') || '[]');

    // Update Dashboard Stats
    document.getElementById('dashTotalInvoices').innerText = invoices.length;
    document.getElementById('dashTotalClients').innerText = clients.length;
    const totalRev = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    document.getElementById('dashTotalRevenue').innerText = '₹ ' + totalRev.toLocaleString('en-IN', {minimumFractionDigits: 2});

    // Update Recent Activity
    const activityDiv = document.getElementById('dashRecentActivity');
    if(invoices.length > 0) {
      activityDiv.innerHTML = invoices.slice(-5).reverse().map(inv => 
        `<p class="text-muted mt-2">Invoice #${inv.id} generated for ${inv.client}.</p>`
      ).join('');
    }

    // Update Clients Table
    const clientsBody = document.getElementById('clientsTableBody');
    if(clients.length > 0) {
      clientsBody.innerHTML = clients.map(c => `
        <tr>
          <td>${c.name}</td>
          <td>${c.gst}</td>
          <td>${c.contact}</td>
          <td><button class="btn btn-secondary">Edit</button></td>
        </tr>
      `).join('');
    }

    // Update Reports Table (Aggregated per client)
    const reportsBody = document.getElementById('reportTableBody');
    if(invoices.length > 0) {
      const clientStats = {};
      invoices.forEach(inv => {
        if(!clientStats[inv.client]) {
            clientStats[inv.client] = { count: 0, revenue: 0 };
        }
        clientStats[inv.client].count++;
        clientStats[inv.client].revenue += inv.amount;
      });
      
      reportsBody.innerHTML = Object.keys(clientStats).map(clientName => `
        <tr>
          <td>${clientName}</td>
          <td>${clientStats[clientName].count}</td>
          <td>-</td>
          <td>-</td>
          <td>₹ ${clientStats[clientName].revenue.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
        </tr>
      `).join('');
    } else {
      reportsBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No data available.</td></tr>`;
    }
  };

  // Pre-populate some dummy data if empty so the UI doesn't look blank
  if(!localStorage.getItem('invoices') || JSON.parse(localStorage.getItem('invoices')).length === 0) {
      const dummyClients = [
          { name: "MAHAVEER AGRO CARE", gst: "21DWPPD1549P1Z6", contact: "9337027856" },
          { name: "SIKKO", gst: "24BBSDF9834J1Z2", contact: "9898989898" }
      ];
      const dummyInvoices = [
          { id: "INV-6051", client: "SIKKO", amount: 25000, date: new Date().toISOString() },
          { id: "INV-6052", client: "MAHAVEER AGRO CARE", amount: 153000, date: new Date().toISOString() }
      ];
      localStorage.setItem('clients', JSON.stringify(dummyClients));
      localStorage.setItem('invoices', JSON.stringify(dummyInvoices));
  }

  // Run render on load
  renderDashboard();

  // Add Client Modal Logic
  const addClientBtn = document.getElementById('openAddClientBtn');
  const addClientModal = document.getElementById('addClientModal');
  const closeAddClientBtn = document.getElementById('closeAddClientBtn');
  const cancelAddClientBtn = document.getElementById('cancelAddClientBtn');
  const addClientForm = document.getElementById('addClientForm');

  if(addClientBtn && addClientModal) {
    const closeClientModal = () => {
      addClientModal.classList.remove('show');
      addClientForm.reset();
    };

    addClientBtn.addEventListener('click', () => {
      addClientModal.classList.add('show');
    });

    closeAddClientBtn.addEventListener('click', closeClientModal);
    cancelAddClientBtn.addEventListener('click', closeClientModal);

    addClientModal.addEventListener('click', (e) => {
      if(e.target === addClientModal) closeClientModal();
    });

    addClientForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('newClientName').value.trim();
      const gst = document.getElementById('newClientGst').value.trim() || "---";
      const contact = document.getElementById('newClientContact').value.trim() || "---";
      
      if(name) {
        let clients = JSON.parse(localStorage.getItem('clients') || '[]');
        clients.push({ name, gst, contact });
        localStorage.setItem('clients', JSON.stringify(clients));
        renderDashboard();
        closeClientModal();
        alert("Client Added Successfully!");
      }
    });
  }

});
