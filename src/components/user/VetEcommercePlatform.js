import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Filter, Star, Plus, Minus, Heart } from 'lucide-react';

const VetEcommercePlatform = () => {
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState([]);

const products = [
  // Tablets
  {
    id: 1,
    name: "Amoxicillin 500mg",
    category: "tablets",
    price: 2099,
    image: "https://5.imimg.com/data5/SELLER/Default/2023/7/330128876/NZ/RO/SC/8264044/ricmox-500-mg.jpg",
    description: "Broad-spectrum antibiotic for bacterial infections",
    rating: 4.5,
    stock: 45
  },
  {
    id: 2,
    name: "Metacam 1.5mg",
    category: "tablets",
    price: 2730,
    image: "https://www.yourpetpa.co.nz/cdn/shop/products/400_400_METCO10__89822.jpg?v=1658103608",
    description: "Anti-inflammatory pain relief for dogs and cats",
    rating: 4.8,
    stock: 32
  },
  {
    id: 3,
    name: "Prednisone 20mg",
    category: "tablets",
    price: 1575,
    image: "https://cdn4.volusion.store/qxyca-qbdtq/v/vspfiles/photos/10058-2.jpg?v-cache=1657699370",
    description: "Corticosteroid for inflammation and allergies",
    rating: 4.3,
    stock: 28
  },
  {
    id: 4,
    name: "Tramadol 50mg",
    category: "tablets",
    price: 2520,
    image: "https://ryvispharma.com/wp-content/uploads/2020/12/R10.jpg",
    description: "Pain management medication for moderate to severe pain",
    rating: 4.6,
    stock: 22
  },
  {
    id: 5,
    name: "Doxycycline 100mg",
    category: "tablets",
    price: 1785,
    image: "https://www.doctorfox.co.uk/imgs-products/sd/16x9/doxycycline.jpg",
    description: "Antibiotic for tick-borne diseases and infections",
    rating: 4.4,
    stock: 38
  },
  {
    id: 6,
    name: "Gabapentin 300mg",
    category: "tablets",
    price: 2940,
    image: "https://mcareexports.com/wp-content/uploads/2021/06/neurontin-300mg-cps.jpg",
    description: "Nerve pain and seizure medication",
    rating: 4.7,
    stock: 19
  },
  {
    id: 7,
    name: "Carprofen 75mg",
    category: "tablets",
    price: 2251,
    image: "https://5.imimg.com/data5/SELLER/Default/2022/5/TG/SI/VY/43751278/70mg-carprofen-chewable-tablets.png",
    description: "NSAID for arthritis and post-operative pain",
    rating: 4.5,
    stock: 41
  },
  // Bandages
  {
    id: 8,
    name: "Elastic Cohesive Bandage",
    category: "bandages",
    price: 755,
    image: "https://m.media-amazon.com/images/I/41g2ekB-7mL.jpg",
    description: "Self-adhesive bandage for wound care and support",
    rating: 4.2,
    stock: 67
  },
  {
    id: 9,
    name: "Gauze Padding Roll",
    category: "bandages",
    price: 546,
    image: "https://m.media-amazon.com/images/I/81Gb3BwmkdL.jpg",
    description: "Soft padding for wound dressing and protection",
    rating: 4.1,
    stock: 84
  },
  {
    id: 10,
    name: "Waterproof Bandage Tape",
    category: "bandages",
    price: 1071,
    image: "https://images-cdn.ubuy.co.in/67566cace75ca6790d3a1121-nexcare-flexible-clear-tape-waterproof.jpg",
    description: "Waterproof adhesive tape for secure wound closure",
    rating: 4.4,
    stock: 53
  },
  {
    id: 11,
    name: "Sterile Gauze Pads",
    category: "bandages",
    price: 777,
    image: "https://5.imimg.com/data5/SELLER/Default/2025/1/481261091/VK/NV/DZ/3117153/sterile-gauze-pads-500x500.jpg",
    description: "Sterile absorbent pads for wound care",
    rating: 4.6,
    stock: 76
  },
  {
    id: 12,
    name: "Compression Bandage",
    category: "bandages",
    price: 1260,
    image: "https://klinion.com/-/media/Project/KlinionCOM/Images/Resized-images/Product-images/long-stretch-compression-bandage-with-box-square.jpg?h=1200&iar=0&w=1200&hash=1FF5218F3FB075174F28AAC61C03115E",
    description: "Elastic compression bandage for swelling control",
    rating: 4.3,
    stock: 29
  },
  {
    id: 13,
    name: "Non-Stick Wound Dressing",
    category: "bandages",
    price: 966,
    image: "https://m.media-amazon.com/images/I/81Hta786TdL._UF1000,1000_QL80_.jpg",
    description: "Non-adherent dressing for sensitive wounds",
    rating: 4.5,
    stock: 42
  },
  // Food
  {
    id: 14,
    name: "Hill's Prescription Diet i/d",
    category: "food",
    price: 5460,
    image: "https://m.media-amazon.com/images/I/71jswnpFrCL._UF1000,1000_QL80_.jpg",
    description: "Digestive care dry dog food for sensitive stomachs",
    rating: 4.7,
    stock: 18
  },
  {
    id: 15,
    name: "Royal Canin Renal Support",
    category: "food",
    price: 6090,
    image: "https://cdn.royalcanin-weshare-online.io/FD83vYcBRYZmsWpcevhM/v9/center-front-hero-image-1341-030111978844-dog-01-jpg",
    description: "Kidney support formula for dogs with renal issues",
    rating: 4.8,
    stock: 14
  },
  {
    id: 16,
    name: "Purina Pro Plan Veterinary Diets",
    category: "food",
    price: 4893,
    image: "https://images-cdn.ubuy.co.in/66386b602d6f5d0afe6a6ff1-gentle-snackers-hydrolyzed-plus-low-fat.jpg",
    description: "Weight management formula for overweight pets",
    rating: 4.4,
    stock: 26
  },
  {
    id: 17,
    name: "Science Diet Urinary Care",
    category: "food",
    price: 5880,
    image: "https://m.media-amazon.com/images/I/71M55FDh6vL._AC_UF894,1000_QL80_.jpg",
    description: "Urinary health support for cats and dogs",
    rating: 4.6,
    stock: 21
  },
  {
    id: 18,
    name: "Blue Buffalo Prescription Diet",
    category: "food",
    price: 5187,
    image: "https://image.chewy.com/catalog/general/images/blue-buffalo-natural-veterinary-diet-gi-gastrointestinal-support-grain-free-dry-cat-food-7lb-bag/img-584382._AC_SL600_V1_.jpg",
    description: "Natural ingredients for sensitive skin allergies",
    rating: 4.5,
    stock: 16
  },
  {
    id: 19,
    name: "Iams Veterinary Formula",
    category: "food",
    price: 4620,
    image: "https://image.influenster.com/eyJidWNrZXQiOiJpbmZsdWVuc3Rlcl9wcm9kdWN0aW9uIiwia2V5IjoibWVkaWEvcHJvZHVjdC9pbWFnZS84NWFiMTI3YTkxYWRhZGM1ZTEyMWFhMmZkYTQ2YmNhMzAuanBnIiwicmVzaXplIjp7IndpZHRoIjo1MDB9fQ==",
    description: "Joint health support for senior dogs",
    rating: 4.3,
    stock: 23
  },
  {
    id: 20,
    name: "Wellness Core Digestive Health",
    category: "food",
    price: 5670,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxmn-PUDILepEgn2EMRTU1PkzY3aW1a5LA0g&s",
    description: "Probiotic-rich formula for digestive wellness",
    rating: 4.7,
    stock: 19
  }
];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const toggleFavorite = (productId) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleImageError = (e, productName) => {
    // Create a simple colored placeholder
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
    const colorIndex = Math.abs(productName.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % colors.length;
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    
    // Fill background
    ctx.fillStyle = colors[colorIndex];
    ctx.fillRect(0, 0, 300, 300);
    
    // Add text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Split text into multiple lines if needed
    const words = productName.split(' ');
    const lines = [];
    let currentLine = '';
    
    for (let word of words) {
      const testLine = currentLine + word + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > 250 && currentLine !== '') {
        lines.push(currentLine.trim());
        currentLine = word + ' ';
      } else {
        currentLine = testLine;
      }
    }
    lines.push(currentLine.trim());
    
    const lineHeight = 20;
    const startY = 150 - (lines.length * lineHeight) / 2;
    
    lines.forEach((line, index) => {
      ctx.fillText(line, 150, startY + index * lineHeight);
    });
    
    e.target.src = canvas.toDataURL();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">VetMed Store</h1>
            </div>
            
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search medicines, bandages, food..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors">
                <ShoppingCart className="w-6 h-6" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {['all', 'tablets', 'bandages', 'food'].map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-2 rounded-md capitalize transition-colors ${
                      selectedCategory === category
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {category === 'all' ? 'All Products' : category}
                  </button>
                ))}
              </div>
            </div>

            {/* Cart Summary */}
            {cart.length > 0 && (
              <div>
                {/* <h3 className="text-lg font-semibold mb-4">Cart Summary</h3>
                <div className="space-y-3">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <span className="truncate">{item.name}</span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between font-semibold">
                      <span>Total: ₹{getTotalPrice()}</span>
                    </div>
                    <button className="w-full mt-3 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                      Checkout
                    </button>
                  </div>
                </div> */}
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                      onError={(e) => handleImageError(e, product.name)}
                    />
                    <button
                      onClick={() => toggleFavorite(product.id)}
                      className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${
                        favorites.includes(product.id)
                          ? 'bg-red-500 text-white'
                          : 'bg-white text-gray-600 hover:text-red-500'
                      }`}
                    >
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                    
                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">
                        {product.rating} ({product.stock} in stock)
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-indigo-600">
                        ₹{product.price}
                      </span>
                      <button
                        onClick={() => addToCart(product)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VetEcommercePlatform;