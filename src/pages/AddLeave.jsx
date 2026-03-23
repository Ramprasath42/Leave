import { useState } from "react";
import { createLeave } from "../services/api";
 
function AddLeave() {
  const [form, setForm] = useState({
    name: "",
    leaveType: "",
    fromDate: "",
    toDate: "",
    reason: ""
  });

  
 
  const handleChange = (e) => {
setForm({ ...form, [e.target.name]: e.target.value });
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!form.name||!form.leaveType){
      alert("All fields required");
      return;
    }
    if(form.fromDate>form.toDate){
      alert("Invalid dates");
      return;
    }
    await createLeave(form);
    alert("Leave Added");

    setForm({
      name:"",
      leaveType:"",
      fromDate:"",
      toDate:"",
      reason:""
    })
  };
 
  return (
    <div className="container">

  <div className="nav">
    <a href="/">Add Leave</a>
    <a href="/leaves">View Leaves</a>
  </div>
 
  <h2>Add Leave</h2>
 
  <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
  <input name="leaveType" placeholder="Type" value={form.leaveType} onChange={handleChange} />
  <input name="fromDate" type="date" value={form.fromDate} onChange={handleChange} />
  <input name="toDate" type="date" value={form.toDate} onChange={handleChange} />
  <input name="reason" placeholder="Reason (Optional)" value={form.reason} onChange={handleChange} />
 
  <button onClick={handleSubmit}>Submit</button>
</div>
  );
}
 
export default AddLeave;