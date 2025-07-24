import React, { useEffect, useState } from 'react';
import {
  getTaxProfiles,
  addTaxProfile,
  updateTaxProfile,
  deleteTaxProfile
} from '../api/taxProfileApi';
import './TaxProfile.css';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for charts and analytics
const pieData = [
  { year: 2023, value: 87, color: '#1976d2' },
  { year: 2022, value: 75, color: '#00b894' },
  { year: 2021, value: 70, color: '#fdcb6e' },
];
const yearlyStats = [
  { year: 2023, onTime: 7200, late: 300, due: 320, overdue: 420, completed: 5000, logged: 75, total: 120 },
  { year: 2022, onTime: 4566, late: 567, due: 634, overdue: 357, completed: 6899, logged: 32, total: 64 },
  { year: 2021, onTime: 3200, late: 865, due: 754, overdue: 752, completed: 5467, logged: 76, total: 98 },
];
const barData = [
  { month: 'Jan', '2023': 42, '2022': 39, '2021': 36 },
  { month: 'Feb', '2023': 39, '2022': 36, '2021': 33 },
  { month: 'Mar', '2023': 41, '2022': 38, '2021': 34 },
  { month: 'Apr', '2023': 38, '2022': 35, '2021': 32 },
  { month: 'May', '2023': 40, '2022': 37, '2021': 34 },
  { month: 'Jun', '2023': 37, '2022': 34, '2021': 31 },
  { month: 'Jul', '2023': 42, '2022': 39, '2021': 36 },
  { month: 'Aug', '2023': 39, '2022': 36, '2021': 33 },
  { month: 'Sep', '2023': 41, '2022': 38, '2021': 34 },
  { month: 'Oct', '2023': 38, '2022': 35, '2021': 32 },
  { month: 'Nov', '2023': 40, '2022': 37, '2021': 34 },
  { month: 'Dec', '2023': 37, '2022': 34, '2021': 31 },
];
const outstandingReports = [
  { label: 'READY FOR LODGEMENT', value: 4620 },
  { label: 'TOTAL OVER DUE', value: 25000 },
  { label: 'OVER ALL NOT STARTED', value: 780 },
  { label: 'TOTAL DUE', value: 250 },
];
const communications = [
  { name: 'MR CONNELLS NAME', tfn: '123 199 555 911', category: 'Category', date: '11/11/2023', type: 'View', action: 'Go to Profile' },
  { name: 'MS CONNELLS NAME', tfn: '199 599 911', category: 'Category', date: '11/11/2023', type: 'Email', action: 'Go to Profile' },
];
const reconciliation = [
  { name: 'MR CONNELLS NAME', tfn: '123 199 555 911', refund: '$20,550', date: '11/11/2023' },
  { name: 'MS ELIZABETH METH', tfn: '199 599 911', refund: '$2,387', date: '11/11/2023' },
  { name: 'MR CONN CITE', tfn: '199 599 911', refund: '$1,200', date: '11/11/2023' },
  { name: 'MISS BENNETTTE', tfn: '199 599 911', refund: '$1,068', date: '11/11/2023' },
];
const pieColors = ['#1976d2', '#00b894', '#fdcb6e'];

const initialForm = {
  annualIncome: '',
  deductions: '',
  employer: '',
  filingStatus: '',
  financialYear: '',
  panNumber: '',
  taxPaid: ''
};

export default function TaxProfile() {
  const [profiles, setProfiles] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchProfiles = () => {
    getTaxProfiles()
      .then(res => setProfiles(res.data))
      .catch(() => setProfiles([]));
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    const payload = { ...form }; // No userId, no user: { id: ... }
    addTaxProfile(payload)
      .then(() => {
        setSuccess('Tax profile added.');
        setForm(initialForm);
        fetchProfiles();
      })
      .catch(() => setError('Failed to add tax profile.'));
  };

  const handleEdit = (profile) => {
    setEditId(profile.id);
    setEditForm({
      annualIncome: profile.annualIncome,
      deductions: profile.deductions,
      employer: profile.employer,
      filingStatus: profile.filingStatus,
      financialYear: profile.financialYear,
      panNumber: profile.panNumber,
      taxPaid: profile.taxPaid
    });
  };

  const handleEditSave = (id) => {
    // Ensure all fields are present and valid before sending
    const { annualIncome, deductions, employer, filingStatus, financialYear, panNumber, taxPaid } = editForm;
    if (
      annualIncome === '' ||
      deductions === '' ||
      filingStatus === '' ||
      financialYear === '' ||
      panNumber === '' ||
      taxPaid === ''
    ) {
      setError('All fields except employer are required.');
      setSuccess('');
      return;
    }
    const payload = { annualIncome, deductions, employer, filingStatus, financialYear, panNumber, taxPaid };
    updateTaxProfile(id, payload)
      .then(() => {
        setSuccess('Tax profile updated.');
        setError('');
        setEditId(null);
        fetchProfiles();
      })
      .catch(() => {
        setError('Failed to update tax profile.');
        setSuccess('');
      });
  };

  const handleEditCancel = () => {
    setEditId(null);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this tax profile?')) return;
    deleteTaxProfile(id)
      .then(() => {
        setSuccess('Tax profile deleted.');
        fetchProfiles();
      })
      .catch(() => setError('Failed to delete tax profile.'));
  };

  // Pie chart for filing status distribution
  const filedCount = profiles.filter(p => p.filingStatus === 'FILED').length;
  const pendingCount = profiles.filter(p => p.filingStatus === 'PENDING').length;
  const reviewCount = profiles.filter(p => p.filingStatus === 'REVIEW').length;
  const total = profiles.length;
  const pieData = [
    { name: 'Filed', value: filedCount, color: '#00b894' },
    { name: 'Pending', value: pendingCount, color: '#1976d2' },
    { name: 'Review', value: reviewCount, color: '#fdcb6e' },
  ];

  // Yearly stats from profiles
  const yearlyStats = [];
  const years = [...new Set(profiles.map(p => p.financialYear))];
  years.forEach(year => {
    const yearProfiles = profiles.filter(p => p.financialYear === year);
    yearlyStats.push({
      year,
      filed: yearProfiles.filter(p => p.filingStatus === 'FILED').length,
      pending: yearProfiles.filter(p => p.filingStatus === 'PENDING').length,
      review: yearProfiles.filter(p => p.filingStatus === 'REVIEW').length,
      total: yearProfiles.length
    });
  });

  // Bar chart: total tax paid per year
  const barData = years
    .filter(year => year && year.trim() !== "") // Only use valid years
    .map(year => {
      const yearProfiles = profiles.filter(p => p.financialYear === year);
      return {
        year,
        taxPaid: yearProfiles.reduce((sum, p) => sum + Number(p.taxPaid), 0)
      };
    });

  // Compute progress for each year
  const yearProgress = years.map(year => {
    const yearProfiles = profiles.filter(p => p.financialYear === year);
    const filed = yearProfiles.filter(p => p.filingStatus === 'FILED').length;
    const percent = yearProfiles.length ? Math.round((filed / yearProfiles.length) * 100) : 0;
    return { year, percent };
  });
  const mostRecent = yearProgress[yearProgress.length - 1] || { year: '', percent: 0 };

  // Outstanding Reports based on real data
  const readyForLodgement = profiles.filter(p => p.filingStatus === 'REVIEW').length;
  const totalOverDue = profiles.filter(p => p.filingStatus === 'PENDING').length;
  const notStarted = profiles.filter(p => Number(p.annualIncome) === 0).length;
  const totalDue = profiles.filter(p => Number(p.taxPaid) === 0).length;

  // ATD Client Communications from real data
  const communications = profiles.map(p => ({
    name: p.employer,
    tfn: p.panNumber,
    category: p.filingStatus,
    date: p.financialYear,
    type: p.filingStatus === 'FILED' ? 'Filed' : 'Pending',
    action: 'Go to Profile'
  }));

  // EFT Reconciliation Statement from real data
  const reconciliation = profiles.map(p => ({
    name: p.employer,
    tfn: p.panNumber,
    refund: `₹${Number(p.taxPaid).toLocaleString('en-IN')}`,
    date: p.financialYear
  }));

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', width: '100%', padding: '32px 0' }}>
      {/* Top Section: Pie Charts and Yearly Stats */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 24, padding: '0 24px', flexWrap: 'wrap' }}>
        {/* Large Pie Chart */}
        <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px #0001', padding: 24, minWidth: 220, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 12, textAlign: 'center' }}>{mostRecent.year} Progress</div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', width: 120, height: 120 }}>
            <PieChart width={120} height={120} style={{ position: 'absolute', top: 0, left: 0 }}>
              <Pie
                data={[
                  { value: mostRecent.percent },
                  { value: 100 - mostRecent.percent }
                ]}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                startAngle={90}
                endAngle={-270}
              >
                <Cell fill="#1976d2" />
                <Cell fill="#e3eafc" />
              </Pie>
            </PieChart>
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontWeight: 900,
                fontSize: 32,
                color: '#1976d2',
                textAlign: 'center',
                width: '100%'
              }}
            >
              {mostRecent.percent}%
            </div>
          </div>
        </div>
        {/* Small pie charts: all other years (except most recent) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, justifyContent: 'center' }}>
          {yearProgress.slice(0, -1).map((yp, idx) => (
            <div key={yp.year} style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px #0001', padding: 18, minWidth: 120, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>{yp.year} Progress</div>
              <PieChart width={60} height={60}>
                <Pie
                  data={[
                    { value: yp.percent },
                    { value: 100 - yp.percent }
                  ]}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={18}
                  outerRadius={28}
                  startAngle={90}
                  endAngle={-270}
                >
                  <Cell fill={['#1976d2', '#00b894', '#fdcb6e'][idx % 3]} />
                  <Cell fill="#e3eafc" />
                </Pie>
              </PieChart>
              <div style={{ fontWeight: 800, fontSize: 18, color: ['#1976d2', '#00b894', '#fdcb6e'][idx % 3], marginTop: -10 }}>{yp.percent}%</div>
            </div>
          ))}
        </div>
        {/* Yearly Stats Table */}
        <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px #0001', padding: 18, minWidth: 320, flex: 2 }}>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 12 }}>Yearly Stats</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
            <thead>
              <tr style={{ color: '#888', fontWeight: 600, textAlign: 'left' }}>
                <th>Year</th><th>Filed</th><th>Pending</th><th>Review</th><th>Total</th>
              </tr>
            </thead>
            <tbody>
              {yearlyStats.map((row, idx) => (
                <tr key={row.year} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td>{row.year}</td>
                  <td>{row.filed}</td>
                  <td>{row.pending}</td>
                  <td>{row.review}</td>
                  <td>{row.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Bar Chart: Tax Paid by Year */}
        <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px #0001', padding: 18, minWidth: 320, flex: 2 }}>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 12 }}>Tax Trends by Month</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="taxPaid" fill="#1976d2" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Bottom Section: Cards and Tables */}
      <div style={{ display: 'flex', gap: 24, padding: '0 24px', flexWrap: 'wrap' }}>
        {/* Outstanding Reports Cards */}
        <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px #0001', padding: 24, minWidth: 220, flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 12 }}>Outstanding Reports</div>
          <div style={{ marginBottom: 10, fontWeight: 600, fontSize: 16, color: '#1976d2' }}>READY FOR LODGEMENT: <span style={{ fontWeight: 900, fontSize: 20 }}>{readyForLodgement}</span></div>
          <div style={{ marginBottom: 10, fontWeight: 600, fontSize: 16, color: '#d63031' }}>TOTAL OVER DUE: <span style={{ fontWeight: 900, fontSize: 20 }}>{totalOverDue}</span></div>
          <div style={{ marginBottom: 10, fontWeight: 600, fontSize: 16, color: '#1976d2' }}>OVER ALL NOT STARTED: <span style={{ fontWeight: 900, fontSize: 20 }}>{notStarted}</span></div>
          <div style={{ marginBottom: 10, fontWeight: 600, fontSize: 16, color: '#1976d2' }}>TOTAL DUE: <span style={{ fontWeight: 900, fontSize: 20 }}>{totalDue}</span></div>
        </div>
        {/* Communications Table */}
        <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px #0001', padding: 24, minWidth: 320, flex: 2 }}>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 12 }}>ATD Client Communications</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
            <thead>
              <tr style={{ color: '#888', fontWeight: 600, textAlign: 'left' }}>
                <th>Name</th><th>TFN / ABN</th><th>Category</th><th>Date</th><th>Type</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {communications.map((row, idx) => (
                <tr key={row.tfn + row.date + idx} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td>{row.name}</td>
                  <td>{row.tfn}</td>
                  <td>{row.category}</td>
                  <td>{row.date}</td>
                  <td>{row.type}</td>
                  <td>{row.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Reconciliation Table */}
        <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px #0001', padding: 24, minWidth: 320, flex: 2 }}>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 12 }}>EFT Reconciliation Statement</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
            <thead>
              <tr style={{ color: '#888', fontWeight: 600, textAlign: 'left' }}>
                <th>Name</th><th>TFN / ABN</th><th>Refund Amount</th><th>Date</th>
              </tr>
            </thead>
            <tbody>
              {reconciliation.map((row, idx) => (
                <tr key={row.tfn + row.date + idx} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td>{row.name}</td>
                  <td>{row.tfn}</td>
                  <td>{row.refund}</td>
                  <td>{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Tax Profile CRUD Table and Form Below Analytics */}
      <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 12px #0001', padding: 32, maxWidth: 1200, margin: '24px auto' }}>
        <h2 style={{ fontWeight: 700, fontSize: 22, marginBottom: 18, color: '#1976d2' }}>Tax Profiles</h2>
        <form onSubmit={handleAdd} style={{ marginBottom: 24, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <input name="annualIncome" type="number" placeholder="Annual Income" value={form.annualIncome} onChange={handleInputChange} required style={{ padding: 8, borderRadius: 8, border: '1px solid #e3eafc', minWidth: 120 }} />
          <input name="deductions" type="number" placeholder="Deductions" value={form.deductions} onChange={handleInputChange} required style={{ padding: 8, borderRadius: 8, border: '1px solid #e3eafc', minWidth: 100 }} />
          <input name="employer" type="text" placeholder="Employer" value={form.employer} onChange={handleInputChange} required style={{ padding: 8, borderRadius: 8, border: '1px solid #e3eafc', minWidth: 100 }} />
          <input name="filingStatus" type="text" placeholder="Filing Status" value={form.filingStatus} onChange={handleInputChange} required style={{ padding: 8, borderRadius: 8, border: '1px solid #e3eafc', minWidth: 100 }} />
          <input name="financialYear" type="text" placeholder="Financial Year" value={form.financialYear} onChange={handleInputChange} required style={{ padding: 8, borderRadius: 8, border: '1px solid #e3eafc', minWidth: 100 }} />
          <input name="panNumber" type="text" placeholder="PAN Number" value={form.panNumber} onChange={handleInputChange} required style={{ padding: 8, borderRadius: 8, border: '1px solid #e3eafc', minWidth: 100 }} />
          <input name="taxPaid" type="number" placeholder="Tax Paid" value={form.taxPaid} onChange={handleInputChange} required style={{ padding: 8, borderRadius: 8, border: '1px solid #e3eafc', minWidth: 100 }} />
          <button type="submit" style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 700, cursor: 'pointer' }}>Add</button>
        </form>
        {success && <div style={{ color: '#00b894', marginBottom: 8 }}>{success}</div>}
        {error && <div style={{ color: '#d63031', marginBottom: 8 }}>{error}</div>}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
          <thead>
            <tr style={{ background: '#f3f8fa' }}>
              <th style={{ padding: 8, textAlign: 'left' }}>Annual Income</th>
              <th style={{ padding: 8, textAlign: 'left' }}>Deductions</th>
              <th style={{ padding: 8, textAlign: 'left' }}>Employer</th>
              <th style={{ padding: 8, textAlign: 'left' }}>Filing Status</th>
              <th style={{ padding: 8, textAlign: 'left' }}>Financial Year</th>
              <th style={{ padding: 8, textAlign: 'left' }}>PAN Number</th>
              <th style={{ padding: 8, textAlign: 'left' }}>Tax Paid</th>
              <th style={{ padding: 8, textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map(profile => (
              <tr key={profile.id} style={{ borderBottom: '1px solid #e3eafc', background: editId === profile.id ? '#eafaf1' : undefined }}>
                {editId === profile.id ? (
                  <>
                    <td><input name="annualIncome" type="number" value={editForm.annualIncome} onChange={handleEditChange} style={{ padding: 4, borderRadius: 6, border: '1px solid #e3eafc', width: 100 }} /></td>
                    <td><input name="deductions" type="number" value={editForm.deductions} onChange={handleEditChange} style={{ padding: 4, borderRadius: 6, border: '1px solid #e3eafc', width: 80 }} /></td>
                    <td><input name="employer" type="text" value={editForm.employer} onChange={handleEditChange} style={{ padding: 4, borderRadius: 6, border: '1px solid #e3eafc', width: 80 }} /></td>
                    <td><input name="filingStatus" type="text" value={editForm.filingStatus} onChange={handleEditChange} style={{ padding: 4, borderRadius: 6, border: '1px solid #e3eafc', width: 80 }} /></td>
                    <td><input name="financialYear" type="text" value={editForm.financialYear} onChange={handleEditChange} style={{ padding: 4, borderRadius: 6, border: '1px solid #e3eafc', width: 80 }} /></td>
                    <td><input name="panNumber" type="text" value={editForm.panNumber} onChange={handleEditChange} style={{ padding: 4, borderRadius: 6, border: '1px solid #e3eafc', width: 80 }} /></td>
                    <td><input name="taxPaid" type="number" value={editForm.taxPaid} onChange={handleEditChange} style={{ padding: 4, borderRadius: 6, border: '1px solid #e3eafc', width: 80 }} /></td>
                    <td>
                      <button onClick={() => handleEditSave(profile.id)} style={{ background: '#00b894', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', fontWeight: 700, cursor: 'pointer', marginRight: 4 }}>Save</button>
                      <button onClick={handleEditCancel} style={{ background: '#e3eafc', color: '#1976d2', border: 'none', borderRadius: 6, padding: '4px 12px', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{profile.annualIncome}</td>
                    <td>{profile.deductions}</td>
                    <td>{profile.employer}</td>
                    <td>{profile.filingStatus}</td>
                    <td>{profile.financialYear}</td>
                    <td>{profile.panNumber}</td>
                    <td>{profile.taxPaid}</td>
                    <td>
                      <button onClick={() => handleEdit(profile)} style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', fontWeight: 700, cursor: 'pointer', marginRight: 4 }}>Edit</button>
                      <button onClick={() => handleDelete(profile.id)} style={{ background: '#d63031', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', fontWeight: 700, cursor: 'pointer' }}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}