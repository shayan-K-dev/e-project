AOS.init();



// User state
let currentUser = null;

// Products database
const products = [
  { name: 'Vasanti Bangle', price: 1250, image: 'IMAGES/Vasanti Bangle.webp' },
  { name: 'Spiritual Plaque', price: 1150, image: 'IMAGES/Spiritual Plaque.avif' },
  { name: 'Regal Diamond Set', price: 2450, image: 'IMAGES/Classic Mangalsutra.jpg' },
  { name: 'Midnight Elegance Set', price: 1850, image: 'IMAGES/Nose Rings.webp' },
  { name: 'Celestial Drape Nath', price: 1850, image: 'IMAGES/Celestial Drape Nath.webp' },
  { name: 'Kavya Karaa', price: 1550, image: 'IMAGES/Kavya Bangle.webp' },
  { name: 'Irha Bangle', price: 2250, image: 'IMAGES/Irha Bangle.webp' },
  { name: 'Alaara Bangle', price: 1750, image: 'IMAGES/Alaara Bangle.webp' },
  { name: 'Zirconia Allah Pendant', price: 1450, image: 'IMAGES/Zirconia Allah Pendant.webp' },
  { name: 'Allah Name Locket Pedant', price: 2000, image: 'IMAGES/Allah Name Locket Pedant.webp' },
  { name: 'Pendant of Allah', price: 2550, image: 'IMAGES/Pendant of Allah.webp' },
  { name: 'Bloom Necklace', price: 1650, image: 'IMAGES/Bloom Necklace.webp' },
  { name: 'Flower Necklace', price: 1000, image: 'IMAGES/Flower Necklace.jpg' },
  { name: 'Heart Necklace', price: 1000, image: 'IMAGES/Heart Necklace.jpg' },
  { name: 'Blush Bloom Nose Ring', price: 1350, image: 'IMAGES/Blush Bloom Nose Ring.webp' },
  { name: 'Moonlit Grace Nath', price: 1350, image: 'IMAGES/Moonlit Grace Nath.webp' },
  { name: 'Anklets', price: 1250, image: 'IMAGES/Anklets.webp' },


];

// Cart array with localStorage persistence
let cart = JSON.parse(localStorage.getItem('pascalCart')) || [];

// Add to cart function
function addToCart(name, price, image) {
  const existingItem = cart.find(item => item.name === name);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: Date.now(),
      name: name,
      price: price,
      image: image,
      quantity: 1
    });
  }
  
  saveCartToStorage();
  updateCart();
  showNotification('Item added to cart!');
}

// Remove from cart
function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCartToStorage();
  updateCart();
}
// Update item quantity in cart
function updateQuantity(id, change) {
  const item = cart.find(item => item.id === id);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      removeFromCart(id);
    } else {
      saveCartToStorage();
      updateCart();
    }
  }
}

// Save cart to localStorage
function saveCartToStorage() {
  localStorage.setItem('pascalCart', JSON.stringify(cart));
}

// Update cart initialization
document.addEventListener('DOMContentLoaded', function() {
  // Load cart from localStorage
  cart = JSON.parse(localStorage.getItem('pascalCart')) || [];
  updateCart();
  updateUserUI();
});

// Update cart display
function updateCart() {
  const cartItemsContainer = document.getElementById('cartItems');
  const cartBadge = document.getElementById('cartBadge');
  const cartTotal = document.getElementById('cartTotal');
  
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartBadge.textContent = totalItems;
  cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
  
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="empty-cart">
        <i class="bi bi-bag-x"></i>
        <h5>Your cart is empty</h5>
        <p>Add some jewelry to get started!</p>
      </div>
    `;
    cartTotal.style.display = 'none';
  } else {

cartItemsContainer.innerHTML = cart.map(item => `
  <div class="cart-item d-flex align-items-center">
    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
    <div class="cart-item-details flex-grow-1">
      <div class="cart-item-title">${item.name}</div>
      <div class="cart-item-price">$${item.price.toLocaleString()}</div>
      <div class="quantity-controls d-flex align-items-center mt-2">
        <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${item.id}, -1)">-</button>
        <span class="mx-3 fw-bold">${item.quantity}</span>
        <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${item.id}, 1)">+</button>
      </div>
    </div>
    <button class="remove-btn ms-2" onclick="removeFromCart(${item.id})">
      <i class="bi bi-trash"></i>
    </button>
  </div>
`).join('');
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('subtotalAmount').textContent = `$${subtotal.toLocaleString()}`;
    document.getElementById('totalAmount').textContent = `$${subtotal.toLocaleString()}`;
    cartTotal.style.display = 'block';
  }
}

// Open cart
function openCart() {
  const cartOffcanvas = new bootstrap.Offcanvas(document.getElementById('cartOffcanvas'));
  cartOffcanvas.show();
}

// Show notification
function showNotification(message) {
  const toast = document.createElement('div');
  toast.className = 'position-fixed top-0 end-0 p-3';
  toast.style.zIndex = '9999';
  toast.innerHTML = `
    <div class="toast show" role="alert">
      <div class="toast-body bg-success text-white rounded">
        <i class="bi bi-check-circle me-2"></i>${message}
      </div>
    </div>
  `;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 2000);
}

// Login functionality
function openLogin() {
  const loginModal = document.getElementById('loginModal');
  loginModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLogin() {
  const loginModal = document.getElementById('loginModal');
  loginModal.classList.remove('active');
  document.getElementById('loginForm').reset();
  document.body.style.overflow = 'auto';
}

function togglePassword() {
  const passwordInput = document.getElementById('password');
  const eyeIcon = document.getElementById('eyeIcon');
  
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    eyeIcon.classList.remove('bi-eye');
    eyeIcon.classList.add('bi-eye-slash');
  } else {
    passwordInput.type = 'password';
    eyeIcon.classList.remove('bi-eye-slash');
    eyeIcon.classList.add('bi-eye');
  }
}

function handleLogin(event) {
  event.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  // Simulate login (in real app, this would be an API call)
  if (email && password) {
    const name = email.split('@')[0];
    currentUser = {
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email: email
    };
    
    updateUserUI();
    closeLogin();
    showNotification(`Welcome back, ${currentUser.name}!`);
  }
}

function updateUserUI() {
  const loginIcon = document.getElementById('loginIcon');
  const userProfile = document.getElementById('userProfile');
  const userName = document.getElementById('userName');
  const userAvatar = document.getElementById('userAvatar');
  
  if (currentUser) {
    loginIcon.style.display = 'none';
    userProfile.style.display = 'flex';
    userName.textContent = currentUser.name;
    userAvatar.textContent = currentUser.name.charAt(0).toUpperCase();
  } else {
    loginIcon.style.display = 'block';
    userProfile.style.display = 'none';
  }
}

function toggleProfileMenu() {
  const options = ['View Profile', 'My Orders', 'Wishlist', 'Settings', 'Logout'];
  
  // Create dropdown menu
  const existingMenu = document.getElementById('profileDropdown');
  if (existingMenu) {
    existingMenu.remove();
    return;
  }
  
  const dropdown = document.createElement('div');
  dropdown.id = 'profileDropdown';
  dropdown.style.cssText = `
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 10px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    min-width: 200px;
    z-index: 1000;
    overflow: hidden;
  `;
  
  dropdown.innerHTML = options.map((option, index) => `
    <div onclick="handleProfileOption('${option}')" style="
      padding: 12px 20px;
      cursor: pointer;
      transition: background-color 0.2s ease;
      border-bottom: ${index < options.length - 1 ? '1px solid #f0f0f0' : 'none'};
      font-size: 1rem;
    " onmouseover="this.style.backgroundColor='#f8f9fa'" onmouseout="this.style.backgroundColor='white'">
      ${option === 'Logout' ? '<i class="bi bi-box-arrow-right me-2"></i>' : ''}${option}
    </div>
  `).join('');
  
  const userProfile = document.getElementById('userProfile');
  userProfile.style.position = 'relative';
  userProfile.appendChild(dropdown);
  
  // Close dropdown when clicking outside
  setTimeout(() => {
    document.addEventListener('click', function closeDropdown(e) {
      if (!userProfile.contains(e.target)) {
        const menu = document.getElementById('profileDropdown');
        if (menu) menu.remove();
        document.removeEventListener('click', closeDropdown);
      }
    });
  }, 0);
}

function handleProfileOption(option) {
  const menu = document.getElementById('profileDropdown');
  if (menu) menu.remove();
  
  if (option === 'Logout') {
    currentUser = null;
    updateUserUI();
    showNotification('Logged out successfully!');
  } else {
    showNotification(`${option} - Coming soon!`);
  }
}

function socialLogin(provider) {
  showNotification(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login - Coming soon!`);
}

function showSignup(event) {
  event.preventDefault();
  closeLogin();
  showNotification('Sign up feature - Coming soon!');
}

// Search functionality
function openSearch() {
  const searchModal = document.getElementById('searchModal');
  searchModal.classList.add('active');
  document.getElementById('searchInput').focus();
  document.body.style.overflow = 'hidden';
}

function closeSearch() {
  const searchModal = document.getElementById('searchModal');
  searchModal.classList.remove('active');
  document.getElementById('searchInput').value = '';
  document.getElementById('searchResults').innerHTML = '';
  document.body.style.overflow = 'auto';
}

function selectSearchResult(name, price, image) {
  addToCart(name, price, image);
  closeSearch();
}

// Real-time search
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('searchInput');
  
  if (searchInput) {
    searchInput.addEventListener('input', function(e) {
      const searchTerm = e.target.value.toLowerCase().trim();
      const searchResults = document.getElementById('searchResults');
      
      if (searchTerm === '') {
        searchResults.innerHTML = '';
        return;
      }
      
      const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm)
      );
      
      if (filteredProducts.length === 0) {
        searchResults.innerHTML = `
          <div class="no-results">
            <i class="bi bi-search mb-3" style="font-size: 3rem; display: block;"></i>
            <p>No products found matching "${searchTerm}"</p>
          </div>
        `;
      } else {
searchResults.innerHTML = filteredProducts.map(product => `
  <div class="search-result-item">
    <img src="${product.image}" alt="${product.name}" class="search-result-image">
    <div class="search-result-details">
      <div class="search-result-title">${product.name}</div>
      <div class="search-result-price">$${product.price.toLocaleString()}</div>
      <a href="${getCategoryLink(product.name)}" class="view-product-link">View Product</a>
    </div>
    <i class="bi bi-plus-circle" onclick="selectSearchResult('${product.name}', ${product.price}, '${product.image}')" style="font-size: 1.5rem; color: #000; cursor: pointer;"></i>
  </div>
`).join('');      }
    });
    
    document.getElementById('searchModal').addEventListener('click', function(e) {
      if (e.target === this) {
        closeSearch();
      }
    });
    
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeSearch();
        closeLogin();
      }
    });
  }
  
  // Close login modal when clicking outside
  document.getElementById('loginModal').addEventListener('click', function(e) {
    if (e.target === this) {
      closeLogin();
    }
  });
  
  // Initialize
  updateCart();
  updateUserUI();
});
// Checkout Button Functionality with SweetAlert
document.addEventListener('DOMContentLoaded', function() {
  
  // Function to handle checkout
  function handleCheckout() {
    const checkoutBtn = document.querySelector('.checkout-btn');
    
    if (checkoutBtn) {
      // Remove any existing event listeners by cloning the button
      const newCheckoutBtn = checkoutBtn.cloneNode(true);
      checkoutBtn.parentNode.replaceChild(newCheckoutBtn, checkoutBtn);
      
      newCheckoutBtn.addEventListener('click', function() {
        // Check if cart is empty (cart is the global variable, not localStorage)
        if (cart.length === 0) {
          Swal.fire({
            icon: 'warning',
            title: 'Cart is Empty!',
            text: 'Please add items to your cart before checkout.',
            confirmButtonColor: '#343a40',
            confirmButtonText: 'Close'
          });
          return;
        }
        
        // Show success message with the same style as feedback form
        Swal.fire({
          icon: 'success',
          title: 'Congratulations!',
          text: 'Thank you for shopping your order has been placed!',
          confirmButtonColor: '#343a40',
          confirmButtonText: 'Close'
        }).then(() => {
          // Clear the cart after successful order
          cart = [];
          
          // Update cart display
          updateCart();
          
          // Close the cart offcanvas
          const cartOffcanvasElement = document.getElementById('cartOffcanvas');
          if (cartOffcanvasElement) {
            const cartOffcanvas = bootstrap.Offcanvas.getInstance(cartOffcanvasElement);
            if (cartOffcanvas) {
              cartOffcanvas.hide();
            }
          }
        });
      });
    }
  }
  
  // Call the function when page loads
  handleCheckout();
  
  // Re-attach event listener when cart is updated
  const originalUpdateCart = updateCart;
  window.updateCart = function() {
    originalUpdateCart();
    handleCheckout();
  };
});

// Make sure SweetAlert2 is loaded
if (typeof Swal === 'undefined') {
  console.error('SweetAlert2 is not loaded. Please add the SweetAlert2 CDN links to your HTML file.');
}

// --- Comparison Feature Variables ---
const MAX_COMPARISON_PRODUCTS = 3;
let comparisonList = [];

// --- Mock Product Attributes (Since your current product list is simple) ---
// For a proper comparison, products need more attributes. 
// This object provides mock data for products that don't have these details in the main 'products' array.
const productAttributes = {
    // Attributes for the products you recently created
    'Diamond Chain Bracelet': { material: 'Gold-Plated Alloy', type: 'Bracelet', warranty: '1 Year', availability: 'In Stock' },
    'Classic Gold Bangle': { material: 'Gold-Plated Brass', type: 'Bangle', warranty: '1 Year', availability: 'In Stock' },
    'Pearl and Crystal Cuff': { material: 'Rhodium-Plated Silver', type: 'Cuff', warranty: '2 Years', availability: 'Limited Stock' },
    'Minimalist Charm Bracelet': { material: 'Sterling Silver', type: 'Bracelet', warranty: '1 Year', availability: 'In Stock' },
    'Simple Stud Nose Pin': { material: 'Gold', type: 'Nose Pin', warranty: 'Lifetime', availability: 'In Stock' },
    'The Eternal Diamond Band': { material: 'Gold-Plated Alloy', type: 'Ring', warranty: '1 Year', availability: 'In Stock' },
    'Classic Minimalist Ring': { material: 'Gold-Plated Brass', type: 'Ring', warranty: '1 Year', availability: 'In Stock' },
    'The Regal Pearl Ring': { material: 'Rhodium-Plated Silver', type: 'Ring', warranty: '2 Years', availability: 'Limited Stock' },
    
    // Default for other products if they don't have explicit entries
    'default': { material: 'Fine Alloy', type: 'Jewelry', warranty: '6 Months', availability: 'In Stock' }
};

// --- Comparison Search Modal Functions ---

function toggleComparisonSearch(show) {
    const modal = document.getElementById('comparisonSearchModal');
    if (show) {
        modal.classList.add('active');
        document.getElementById('comparisonModalInput').focus();
        document.body.style.overflow = 'hidden';
    } else {
        modal.classList.remove('active');
        document.getElementById('comparisonModalInput').value = '';
        document.getElementById('comparisonModalResults').innerHTML = '<p class="text-muted mt-3 text-center">Start typing to see product suggestions.</p>';
        document.body.style.overflow = 'auto';
    }
}

// Real-time comparison search handler
document.addEventListener('DOMContentLoaded', function() {
    const comparisonModalInput = document.getElementById('comparisonModalInput');

    if (comparisonModalInput) {
        comparisonModalInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase().trim();
            const searchResults = document.getElementById('comparisonModalResults');

            if (searchTerm === '') {
                searchResults.innerHTML = '<p class="text-muted mt-3 text-center">Start typing to see product suggestions.</p>';
                return;
            }

            const filteredProducts = products.filter(product =>
                product.name.toLowerCase().includes(searchTerm) &&
                !comparisonList.some(item => item.name === product.name) // Don't show products already in list
            );

            if (filteredProducts.length === 0) {
                searchResults.innerHTML = `<div class="no-results p-3 text-center"><p>No available products match your search or they are already in the list.</p></div>`;
            } else {
                searchResults.innerHTML = filteredProducts.map(product => `
                    <div class="search-result-item" onclick="addProductToComparison('${product.name}')">
                        <img src="${product.image}" alt="${product.name}" class="search-result-image">
                        <div class="search-result-details">
                            <div class="search-result-title">${product.name}</div>
                            <div class="search-result-price">$${product.price.toLocaleString()}</div>
                        </div>
                        <i class="bi bi-plus-circle" style="font-size: 1.5rem; color: #000;"></i>
                    </div>
                `).join('');
            }
        });
    }
});


// --- Comparison Logic ---

function addProductToComparison(productName) {
    if (comparisonList.length >= MAX_COMPARISON_PRODUCTS) {
        showNotification('Comparison list is full (Max 3 products)!');
        return;
    }

    const product = products.find(p => p.name === productName);
    if (!product) {
        showNotification('Product not found!', 'bg-danger');
        return;
    }
    
    // Add default/mock attributes
    const attributes = productAttributes[productName] || productAttributes['default'];

    comparisonList.push({ ...product, ...attributes });
    updateComparisonTable();
    showNotification(`${productName} added for comparison!`);
    toggleComparisonSearch(false); // Close the modal
}

function removeProductFromComparison(productName) {
    comparisonList = comparisonList.filter(item => item.name !== productName);
    updateComparisonTable();
    showNotification(`${productName} removed from comparison.`);
}

function updateComparisonTable() {
    // Clear all placeholders first
    for (let i = 1; i <= MAX_COMPARISON_PRODUCTS; i++) {
        document.getElementById(`productColPlaceholder${i}`).style.display = 'flex';
        document.getElementById(`imgRow${i}`).innerHTML = '';
        document.getElementById(`nameRow${i}`).innerHTML = '';
        document.getElementById(`priceRow${i}`).innerHTML = '';
        document.getElementById(`materialRow${i}`).textContent = 'N/A';
        document.getElementById(`typeRow${i}`).textContent = 'N/A';
        document.getElementById(`warrantyRow${i}`).innerHTML = 'N/A';
        document.getElementById(`availabilityRow${i}`).innerHTML = 'N/A';
        document.getElementById(`actionRow${i}`).innerHTML = '';
    }
    
    // Populate columns based on comparisonList
    comparisonList.forEach((product, index) => {
        const colIndex = index + 1; // 1, 2, or 3
        
        // Hide placeholder and populate header (product name/remove button)
        const headerPlaceholder = document.getElementById(`productColPlaceholder${colIndex}`);
        if (headerPlaceholder) {
            headerPlaceholder.style.display = 'none';
        }
        
        // Product Name (in header row)
        const headerRow = document.querySelector('.comparison-header');
        let nameCol = headerRow.querySelector(`#productColPlaceholder${colIndex}`);
        if (!nameCol) {
            // Re-use the placeholder columns for the actual product name/remove button
            nameCol = document.createElement('div');
            nameCol.className = 'product-col';
            nameCol.id = `productColPlaceholder${colIndex}`;
            headerRow.appendChild(nameCol);
        }

        nameCol.innerHTML = `
            <span style="position: relative; padding-top: 20px;">
                ${product.name}
                <button class="remove-comparison-btn" onclick="removeProductFromComparison('${product.name}')" title="Remove Product">
                    <i class="bi bi-x-circle-fill"></i>
                </button>
            </span>
        `;
        nameCol.style.display = 'flex';
        nameCol.style.position = 'relative'; 

        // Image Row
        document.getElementById(`imgRow${colIndex}`).innerHTML = `<img src="${product.image}" alt="${product.name}">`;
        
        // Name Row (optional, kept for symmetry)
        document.getElementById(`nameRow${colIndex}`).textContent = product.name; 
        
        // Price Row
        document.getElementById(`priceRow${colIndex}`).textContent = `$${product.price.toLocaleString()}`;
        
        // Material Row
        document.getElementById(`materialRow${colIndex}`).textContent = product.material || 'N/A';
        
        // Type Row
        document.getElementById(`typeRow${colIndex}`).textContent = product.type || 'N/A';

        // Warranty Row
        const warrantyIcon = product.warranty.includes('N/A') ? 'bi-x-circle-fill text-danger' : 'bi-check-circle-fill text-success';
        document.getElementById(`warrantyRow${colIndex}`).innerHTML = `<i class="bi ${warrantyIcon}"></i> ${product.warranty || 'N/A'}`;

        // Availability Row
        const availabilityBadge = product.availability === 'In Stock' ? 'bg-success' : 'bg-warning text-dark';
        document.getElementById(`availabilityRow${colIndex}`).innerHTML = `<span class="badge ${availabilityBadge}" style="font-size: 0.9rem;">${product.availability}</span>`;

        // Action Row
        document.getElementById(`actionRow${colIndex}`).innerHTML = `
            <button class="btn btn-dark btn-sm px-4" onclick="addToCart('${product.name}', ${product.price}, '${product.image}')" style="border-radius: 20px;">
                Add to Cart
            </button>
        `;
    });
}

// --- Initialize Comparison Table (Optional: to load a default comparison) ---
document.addEventListener('DOMContentLoaded', function() {
    // You can optionally add a few default products here when the page loads
    // addProductToComparison('Diamond Chain Bracelet'); 
    // addProductToComparison('Simple Stud Nose Pin');
    updateComparisonTable();
});
// Function to get category link for products
function getCategoryLink(productName) {
  const categoryMap = {
    'Vasanti Bangle': 'bangles.html',
    'Spiritual Plaque': 'calligraphy.html',
    'Classic Mangalsutra': 'necklaces.html',
    'Midnight Elegance Set': 'nosering.html',
    'Kavya Karaa': 'bangles.html',
    'Irha Bangle': 'bangles.html',
    'Alaara Bangle': 'bangles.html',
    'Zirconia Allah Pendant': 'calligraphy.html',
    'Allah Name Locket Pedant': 'calligraphy.html',
    'Pendant of Allah': 'calligraphy.html',
    'Bloom Necklace': 'necklaces.html',
    'Flower Necklace': 'necklaces.html',
    'Heart Necklace': 'necklaces.html',
    'Blush Bloom Nose Ring': 'nosering.html',
    'Moonlit Grace Nath': 'nosering.html'
  };
  return categoryMap[productName] || 'categories.html';
}