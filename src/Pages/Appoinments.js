import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';

function Appointments() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    counselor: '',
    date: '',
    time: '',
    resume: null  // Add state for uploaded resume
  });

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: name === 'resume' ? files[0] : value  // Handle file upload separately
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { name, email, phone, counselor, date, time, resume } = formData;

    const formDataToSend = new FormData();
    formDataToSend.append('name', name);
    formDataToSend.append('email', email);
    formDataToSend.append('phone', phone);
    formDataToSend.append('counselor', counselor);
    formDataToSend.append('date', date);
    formDataToSend.append('time', time);
    formDataToSend.append('resume', resume); // Append uploaded resume

    try {
      const response = await fetch('http://127.0.0.1:8000/book-appointment', {
        method: 'POST',
        body: formDataToSend
      });

      if (response.ok) {
        toast.success("Appointment booked successfully!");
      } else {
        toast.error('Failed to book appointment');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error('Error in connection');
    }
  };

  return (
    <div className="container mx-auto max-w-2xl p-5 shadow-lg rounded-lg bg-white mt-10">
      <Toaster />
      <h1 className="text-3xl font-bold text-center text-blue-800 mb-10">Book an Appointment</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block font-semibold text-gray-700">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="email" className="block font-semibold text-gray-700">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block font-semibold text-gray-700">Phone:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="counselor" className="block font-semibold text-gray-700">Select Counselor:</label>
          <select
            id="counselor"
            name="counselor"
            value={formData.counselor}
            onChange={handleChange}
            required
            className="form-select mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          >
            <option value="">-- Select --</option>
            <option value="counselor1">Counselor 1</option>
            <option value="counselor2">Counselor 2</option>
            {/* Additional options can be added here */}
          </select>
        </div>
        <div>
          <label htmlFor="date" className="block font-semibold text-gray-700">Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="time" className="block font-semibold text-gray-700">Time:</label>
          <input
            type="time"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
            className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="resume" className="block font-semibold text-gray-700">Upload Resume:</label>
          <input
            type="file"
            id="resume"
            name="resume"
            accept=".pdf,.doc,.docx" // Restrict file types to PDF, DOC, DOCX
            onChange={handleChange}
            className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
        >
          Book Appointment
        </button>
      </form>
    </div>
  );
}

export default Appointments;
