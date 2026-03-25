/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState ,useCallback} from "react";
import { getLeaves, deleteLeave, updateLeave } from "../services/api";
 
function ViewLeaves() {
 
  const [leaves, setLeaves] = useState([]);
  const [filter, setFilter] = useState("All");
  const [editData, setEditData] = useState(null);
  const [search, SetSearch] = useState("");
  const [role, setRole] = useState("employee");
 
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalpages, setTotalpages] = useState(1);
  const [totalCount,setTotalcount]=useState(0);
  const [debouncedSearch, setDebouncedSearch]=useState("");
 

  const fetchData = useCallback(async () => {
    try {
      const res = await getLeaves({
        page,
        search: debouncedSearch,
        status,
      });
 
setLeaves(res.data.data);              
setTotalpages(res.data.totalpages); 
setTotalcount(res.data.totalCount);   

      if (page>res.data.totalpages){
        setPage(res.data.totalpages||1)
      }
 
    } catch (err) {
      console.log(err);
    }
  },[page, debouncedSearch, status]);
 
  useEffect(() => {
    
    fetchData();
  }, [fetchData]);

  useEffect(()=>{
    const timer=setTimeout(()=>{
      setDebouncedSearch(search);
    },500);
    return ()=>clearTimeout(timer);
  },[search]);
 
  // Delete
  const handleDelete = async (id) => {
    await deleteLeave(id);
    fetchData();
  };
 
  // Approve
  const updateStatus = async (id, status) => {
    await updateLeave(id, { status });
    fetchData();
  };
 
  // Edit
  const handleEdit = (leave) => {
    setEditData(leave);
  };
 
  const handleEditChange = (e) => {
    setEditData({
      ...editData,
    [e.target.name]: e.target.value,
    });
  };
 

  const updateLeaves = async () => {
    await updateLeave(editData._id, editData);
 
    alert("Leave updated");
    setEditData(null);
    fetchData()
  };
 

  const filteredLeaves = leaves.filter((l) =>
    filter === "All" ? true : l.status === filter
  );
 
  const sortedLeaves = [...filteredLeaves].sort(
    (a, b) => new Date(b.fromDate) - new Date(a.fromDate)
  );
 
    const getPageNumbers = () => {
  const pages = [];
 if(!totalpages||totalpages<1)
  return [];

  if (totalpages <= 3) {
    // show all pages if small
    for (let i = 1; i <= totalpages; i++) {
      pages.push(i);
    }
    
  return pages;
  
  }    // always include first page
    pages.push(1);
 
    if (page > 3) {
      pages.push("...");
    }
 
    // middle pages
    const start = Math.max(2, page - 1);
    const end = Math.min(totalpages - 1, page + 1);
 
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
 
    if (page < totalpages - 2) {
      pages.push("...");
    }
 
    
    pages.push(totalpages);
  

  return pages;
};

  return (
    <div className="container">
 
      <div className="nav">
        <a href="/">Add Leave</a>
        <a href="/leaves">View Leaves</a>
      </div>
 
      <div className="header">
        <h2>Leave Dashboard</h2>
 
        <select
          className="role-dropdown"
          value={role}
        onChange={(e) => setRole(e.target.value)}
        >
          <option value="employee">Employee</option>
          <option value="manager">Manager</option>
        </select>
      </div>
 
      {/* Summary */}
      <div className="summary">
        <p>Total: {totalCount}</p>
        <p>Pending (page{page}): {leaves.filter(l => l.status === "Pending").length}</p>
        <p>Approved (page{page}): {leaves.filter(l => l.status === "Approved").length}</p>
        <p>Rejected (page{page}): {leaves.filter(l => l.status === "Rejected").length}</p>
      </div>
 
      
      <input
        type="text"
        placeholder="Search by Employee name"
        value={search}
        onChange={(e) => {
SetSearch(e.target.value);
          setPage(1);
        }}
        style={{ marginBottom: "15px", padding: "6px", width: "250px" }}
      />
 
      
      <div>
        {["All", "Pending", "Approved", "Rejected"].map((f) => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? "active" : ""}`}
            onClick={() => {
              setFilter(f);
              setStatus(f === "All" ? "" : f); 
              setPage(1);
            }}
          >
            {f}
          </button>
        ))}
      </div>
 
      {/* Cards */}
{sortedLeaves.map((l) => (
        <div key={l._id} className="card">
 
          <p>Name: {l.name}</p>
          <p><b>Type:</b> {l.leaveType}</p>
          <p>
            <b>Dates:</b>{" "}
            {l.fromDate?.slice(0, 10)} → {l.toDate?.slice(0, 10)}
          </p>
 
          <p>
            <b>Status:</b>{" "}
            <span className={`status ${l.status}`}>
              {l.status}
            </span>
          </p>
 
          {/* Employee Edit */}
          {role === "employee" && l.status === "Pending" && (
            <button
              className="btn btn-edit"
              onClick={() => handleEdit(l)}
            >
              Edit
            </button>
          )}
 
          {/* Manager Actions */}
          {role === "manager" && l.status === "Pending" && (
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
            </>
          )}
 
          {/* Delete */}
          <button
            disabled={l.status !== "Pending"}
            className="btn btn-delete"
            onClick={() => handleDelete(l._id)}
          >
            Delete
          </button>
 
          {/* Edit Modal */}
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
                  value={editData.fromDate?.slice(0, 10)}
                  onChange={handleEditChange}
                />
 
                <input
                  type="date"
                  name="toDate"
                  value={editData.toDate?.slice(0, 10)}
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
 
      <div className="pagination">
 
  {/* Prev */}
  <button
    disabled={page === 1}
    onClick={() => setPage(page - 1)}
  >
    Prev
  </button>
 
  {/* Page Numbers */}
  {getPageNumbers().map((p, index) => (
    <button
      key={index}
      disabled={p === "..."}
      onClick={() =>{if(typeof p === "number" && p<=totalpages){ setPage(p)}}}
      style={{
        margin: "0 5px",
        fontWeight: page === p ? "bold" : "normal",
        backgroundColor: page === p ? "#007bff" : "",
        color: page === p ? "white" : "",
        cursor: p === "..." ? "default" : "pointer"
      }}
    >
      {p}
    </button>
  ))}
 
  {/* Next */}
  <button
    disabled={page >= totalpages}
    onClick={() => setPage(page + 1)}
  >
    Next
  </button>
 
</div>
 
    </div>
  );
}
 
export default ViewLeaves;