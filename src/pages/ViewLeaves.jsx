import { useEffect, useState } from "react";
import { getLeaves, deleteLeave, updateLeave } from "../services/api";
 
function ViewLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [filter, setFilter] = useState("All");
  const [editData, setEditData] =useState(null);
  const [search,SetSearch] = useState("");
  const [role,setRole] = useState("employee")
  
  // Fetch data
  const fetchData = async () => {
    const res = await getLeaves();
setLeaves(res.data);
  };
 
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);
 
  // Delete
  const handleDelete = async (id) => {
    await deleteLeave(id);
    fetchData();
  };
 
  // Approve / Reject
  const updateStatus = async (id, status) => {
    await updateLeave(id, { status });
    fetchData();
  };
 
  const handleEdit= (leave)=>{

    setEditData(leave)
  };

  const handleEditChange = (e) => {
  setEditData({
    ...editData,
[e.target.name]: e.target.value,
  });
  }
  const updateLeaves = async () => {
await fetch(`https://leave-backend-jziu.onrender.com/api/leaves/${editData._id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(editData),
  });
 
  alert("Leave updated");
  setEditData(null);
  window.location.reload(); // simple refresh
};

  // Filter logic
  const filteredLeaves = leaves.filter((l)=>
    filter === "All"
      ? true
      : l.status === filter).filter((l)=>l.name.toLowerCase().includes(search.toLowerCase())
);

    const sortedLeaves=[...filteredLeaves].sort((a,b)=>new Date(b.fromDate)- new Date(a.fromDate));

  return (
   <div className="container">
  <div className="nav">
    <a href="/">Add Leave</a>
    <a href="/leaves">View Leaves</a>
  </div>
 
 <div className="header">
  <h2>Leave Dashboard</h2>
  <select className="role-dropdown" value={role} onChange={(e)=>setRole(e.target.value)}>  
        <option value="employee">Employee</option>  
        <option value="manager">Manager</option></select>
        </div>
  {/* Summary */}
  <div className="summary">
    <p>Total: {leaves.length}</p>
    <p>Pending: {leaves.filter(l => l.status === "Pending").length}</p>
    <p>Approved: {leaves.filter(l => l.status === "Approved").length}</p>
    <p>Rejected: {leaves.filter(l => l.status === "Rejected").length}</p>
  </div>

    <input type="text"
    placeholder="Search by Employee name" 
    value={search}
    onChange={(e)=>SetSearch(e.target.value)}
    style={{marginBottom:"15px",padding:"6px", width:"250px"}}
    />

  {/* Filters */}
  <div>
    {["All", "Pending", "Approved", "Rejected"].map((f) => (
      <button
        key={f}
        className={`filter-btn ${filter === f ? "active" : ""}`}
        onClick={() => setFilter(f)}
      >
        {f}
      </button>
    ))}
  </div>
 
  {/* Cards */}
{sortedLeaves.map((l) => (
    <div key={l._id} className="card">
    <p><b>Name: </b> {l.name}</p>
      <p><b>Type:</b> {l.leaveType}</p>
      <p><b>Dates:</b> {l.fromDate?.slice(0,10)} → {l.toDate?.slice(0,10)}</p>
 
      <p>
        <b>Status:</b>{" "}
        <span className={`status ${l.status}`}>
          {l.status}
        </span>
      </p>
 
      
        {role==="employee" && l.status === "Pending" && (
        <button 
            className="btn btn-edit"
        onClick={()=>handleEdit(l)}>Edit</button>)}


          {role==="manager" && l.status === "Pending" && (
            <>
          <button
            className="btn btn-approve"
            onClick={() => updateStatus(l._id, "Approved")}
          >
            Approve
          </button>
 
          <button
            className="btn btn-reject"
            onClick={() => updateStatus(l._id, "Rejected")}
          >
            Reject
          </button>
        </>)}
    
      
      <button
        disabled={l.status !=="Pending"}
        className="btn btn-delete"
        onClick={() => handleDelete(l._id)}
      >
        Delete
      </button>

      {editData && (
  <div className="modal">
    <div className="modal-box">
      <h3>Edit Leave</h3>
 
      <input
        name="name"
value={editData.name}
        onChange={handleEditChange}
      />
 
      <input
        name="leaveType"
        value={editData.leaveType}
        onChange={handleEditChange}
      />
 
      <input
        type="date"
        name="fromDate"
        value={editData.fromDate}
        onChange={handleEditChange}
      />
 
      <input
        type="date"
        name="toDate"
        value={editData.toDate}
        onChange={handleEditChange}
      />
 
      <div style={{ marginTop: "10px" }}>
        <button onClick={updateLeaves}>Save</button>
        <button onClick={() => setEditData(null)}>Cancel</button>
      </div>
    </div>
  </div>
)}
    </div>
  ))}
</div>
)}

export default ViewLeaves