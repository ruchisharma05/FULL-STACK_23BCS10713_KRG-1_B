// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import { useState } from 'react';
import './index.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import "tailwindcss";
// import Form from './Form.jsx';
import React, {createContext, useContext} from 'react';

function App(){
  const [count, setCount]= useState(0);

  const increment=()=>{
    if(count<10){
      setCount(count+1);
    }
    else{
      alert("Maximum limit reached");
    }
  }

  const decrement=()=>{
    if(count>0){
      setCount(count-1);
    }
  }

  const reset=()=>{
    setCount(0);
  }

  return(
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='font-bold mb-6'>Counter: {count}</h1>
      <div className='space-x-4'>
        <button onClick={decrement} className='bg-gray-500 text-white'>Decrement</button>
        <button onClick={reset} className='bg-gray-500 text-white'>Reset</button>
        <button onClick={increment} className='bg-gray-500 text-white'>Increment</button>
      </div>
    </div>
  )
}

// function App(){
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [course, setCourse] = useState("");
//   const [submissions, setSubmissions] = useState([]);

//   return (
//     <div className="p-4">
//       <form
//         onSubmit={(e) => {
//           e.preventDefault();
//           setSubmissions([...submissions, { name, email, course }]);
//           setName(""); setEmail(""); setCourse("");
//         }}
        
//         >
//         <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} className="border p-1 w-full" />
//         <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="border p-1 w-full" />
//         <input placeholder="Course" value={course} onChange={e => setCourse(e.target.value)} className="border p-1 w-full" />
//         <button type="submit" className="bg-blue-500 text-white px-2 py-1">Submit</button>
//       </form>

//       <table className="border border-gray-300 w-full border-collapse">
//         <thead>
//           <tr>
//             <th className="border px-2 py-1">Name</th>
//             <th className="border px-2 py-1">Email</th>
//             <th className="border px-2 py-1">Course</th>
//           </tr>
//         </thead>
//         <tbody>
//           {submissions.map((student, index) => (
//             <tr key={index}>
//               <td className="border px-2 py-1">{student.name}</td>
//               <td className="border px-2 py-1">{student.email}</td>
//               <td className="border px-2 py-1">{student.course}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

export default App;
