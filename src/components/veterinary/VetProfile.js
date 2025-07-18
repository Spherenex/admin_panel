// src/pages/vet/VetProfile.jsx
import React, { useState } from "react";


const VetProfile = () => {
  const [profile, setProfile] = useState({
    name: "",
    specialization: "",
    experience: "",
    photo: "",
    documents: null,
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit profile to backend
    console.log("Profile submitted:", profile);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Vet Profile Setup</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={profile.name}
          onChange={handleChange}
          className="w-full p-2 border"
        />
        <input
          type="text"
          name="specialization"
          placeholder="Specialization"
          value={profile.specialization}
          onChange={handleChange}
          className="w-full p-2 border"
        />
        <input
          type="text"
          name="experience"
          placeholder="Years of Experience"
          value={profile.experience}
          onChange={handleChange}
          className="w-full p-2 border"
        />
        <input
          type="file"
          name="photo"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full p-2 border"
        />
        <input
          type="file"
          name="documents"
          accept="application/pdf,image/*"
          onChange={handleFileChange}
          className="w-full p-2 border"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Submit Profile
        </button>
      </form>
    </div>
  );
};

export default VetProfile;


