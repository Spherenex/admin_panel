import React, { useState, useEffect } from 'react';
import { getDatabase, ref, push, set, onValue } from 'firebase/database';
import { useAuth } from '../../context/AuthContext';

const PetDetailsForm = ({ onClose }) => {
  const { currentUser } = useAuth();
  const [petName, setPetName] = useState('');
  const [petAge, setPetAge] = useState('');
  const [petType, setPetType] = useState('dog');
  const [breed, setBreed] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ show: false, type: '', text: '' });
  const [pets, setPets] = useState([]);
  const [showForm, setShowForm] = useState(false);

  // Load pets from localStorage on initial render
  useEffect(() => {
    loadPetsFromLocalStorage();
    
    // Also set up Firebase listener to keep data in sync
    if (currentUser) {
      const db = getDatabase();
      const petsRef = ref(db, `pets/${currentUser.uid}`);
      
      onValue(petsRef, (snapshot) => {
        let petsData = [];
        snapshot.forEach((childSnapshot) => {
          const pet = childSnapshot.val();
          const petId = childSnapshot.key;
          
          // Get image from localStorage
          const imageKey = `pet_image_${currentUser.uid}_${petId}`;
          const imageData = localStorage.getItem(imageKey);
          
          petsData.push({
            id: petId,
            ...pet,
            photoURL: imageData || null
          });
        });
        
        // Update state
        setPets(petsData);
        
        // Update localStorage with the complete data
        saveCompleteDataToLocalStorage(petsData);
      });
    }
  }, [currentUser]);
  
  // Load pets from localStorage
  const loadPetsFromLocalStorage = () => {
    try {
      const petsKey = currentUser ? `pets_${currentUser.uid}` : null;
      if (petsKey) {
        const storedPets = localStorage.getItem(petsKey);
        if (storedPets) {
          setPets(JSON.parse(storedPets));
        }
      }
    } catch (error) {
      console.error('Error loading pets from localStorage:', error);
    }
  };
  
  // Save complete pet data to localStorage
  const saveCompleteDataToLocalStorage = (petsData) => {
    try {
      const petsKey = `pets_${currentUser.uid}`;
      localStorage.setItem(petsKey, JSON.stringify(petsData));
    } catch (error) {
      console.error('Error saving pets to localStorage:', error);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Convert to base64 string for localStorage
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setPhotoPreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!petName.trim() || !petAge.trim()) {
      setMessage({
        show: true,
        type: 'error',
        text: 'Please fill in all required fields'
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // First add to Firebase without the image
      const db = getDatabase();
      const petsRef = ref(db, `pets/${currentUser.uid}`);
      const newPetRef = push(petsRef);
      const petId = newPetRef.key;
      
      // If we have an image, save it to localStorage
      if (photoPreview) {
        const imageKey = `pet_image_${currentUser.uid}_${petId}`;
        localStorage.setItem(imageKey, photoPreview);
      }
      
      // Create pet data without the actual image
      const petData = {
        name: petName,
        age: petAge,
        type: petType,
        breed: breed || 'Not specified',
        hasImage: !!photoPreview, // Flag indicating if there's an image
        createdAt: new Date().toISOString()
      };
      
      // Save to Firebase
      await set(newPetRef, petData);
      
      // Add the new pet to our local state with the image URL
      const newPet = {
        id: petId,
        ...petData,
        photoURL: photoPreview
      };
      
      const updatedPets = [...pets, newPet];
      setPets(updatedPets);
      
      // Update the complete data in localStorage
      saveCompleteDataToLocalStorage(updatedPets);
      
      // Reset form
      setPetName('');
      setPetAge('');
      setPetType('dog');
      setBreed('');
      setPhotoPreview(null);
      
      setMessage({
        show: true,
        type: 'success',
        text: 'Pet added successfully!'
      });
      
      setTimeout(() => {
        setMessage({ show: false, type: '', text: '' });
        setShowForm(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error adding pet:', error);
      setMessage({
        show: true,
        type: 'error',
        text: 'Failed to add pet. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    // Reset form and message when toggling
    if (!showForm) {
      setPetName('');
      setPetAge('');
      setPetType('dog');
      setBreed('');
      setPhotoPreview(null);
      setMessage({ show: false, type: '', text: '' });
    }
  };

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">My Pets</h3>
        <button
          onClick={toggleForm}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          {showForm ? 'Cancel' : 'Add New Pet'}
        </button>
      </div>

      {/* Pet list */}
      {pets.length > 0 && !showForm && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {pets.map((pet) => (
            <div key={pet.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200 relative">
                {pet.photoURL ? (
                  <img 
                    src={pet.photoURL} 
                    alt={pet.name} 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      // Fallback if image fails to load
                      e.target.onerror = null;
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23cccccc' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'/%3E%3C/svg%3E";
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-lg">{pet.name}</h4>
                <div className="text-sm text-gray-600 mt-1">
                  <p>Age: {pet.age}</p>
                  <p>Type: {pet.type.charAt(0).toUpperCase() + pet.type.slice(1)}</p>
                  <p>Breed: {pet.breed}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No pets message */}
      {pets.length === 0 && !showForm && (
        <div className="text-center py-6 bg-gray-50 rounded-lg mb-6">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h4 className="text-lg font-medium text-gray-900 mb-1">No Pets Added Yet</h4>
          <p className="text-gray-500 mb-4">Add your first pet to keep track of their health records</p>
        </div>
      )}

      {/* Add pet form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {message.show && (
            <div className={`mb-4 p-3 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message.text}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Pet Photo</label>
              <div className="flex items-center">
                <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden mr-4">
                  {photoPreview ? (
                    <img 
                      src={photoPreview} 
                      alt="Pet preview" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <label className="bg-white border border-gray-300 rounded-md px-3 py-1.5 cursor-pointer hover:bg-gray-50">
                  <span className="text-sm font-medium text-gray-700">Choose File</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="sr-only" 
                    onChange={handlePhotoChange} 
                  />
                </label>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pet Name *
                </label>
                <input
                  type="text"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter pet name"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pet Age *
                </label>
                <input
                  type="text"
                  value={petAge}
                  onChange={(e) => setPetAge(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 2 years"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pet Type
                </label>
                <select
                  value={petType}
                  onChange={(e) => setPetType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="dog">Dog</option>
                  <option value="cat">Cat</option>
                  <option value="bird">Bird</option>
                  <option value="fish">Fish</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Breed
                </label>
                <input
                  type="text"
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter breed (optional)"
                />
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={toggleForm}
                className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}`}
              >
                {loading ? 'Saving...' : 'Save Pet Details'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default PetDetailsForm;