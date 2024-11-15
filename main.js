function handleSignup(event) {
    event.preventDefault();
    
    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // Kiểm tra mật khẩu xác nhận
    if (password !== confirmPassword) {
        alert('Mật khẩu xác nhận không khớp!');
        return;
    }
    
    // Tạo object user
    const user = {
        fullname,
        email,
        password
    };
    
    // Lấy danh sách users hiện có hoặc tạo mảng mới
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Kiểm tra email đã tồn tại
    if (users.some(u => u.email === email)) {
        alert('Email này đã được đăng ký!');
        return;
    }
    
    // Thêm user mới vào danh sách
    users.push(user);
    
    // Lưu vào localStorage
    localStorage.setItem('users', JSON.stringify(users));
    
    // Chuyển hướng đến trang login
    window.location.href = 'login.html';
}

function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Lấy danh sách users từ localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Tìm user với email và password khớp
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Lưu thông tin user đang đăng nhập
        localStorage.setItem('currentUser', JSON.stringify(user));
        Swal.fire({
            title: "Thành công!",
            text: "Đăng nhập thành công!",
            timer: 1000,
            icon: "success"
        });
        //load xong bảng thì mới chuyển hướng
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    } else {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Tài Khoản hoặc mật khẩu không đúng!",
          });
    }
}

// Thêm hàm này để kiểm tra và hiển thị tên người dùng trên trang index
function updateLoginButton() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const loginButton = document.querySelector('.login-button'); // Điều chỉnh selector theo HTML của bạn
    
    if (currentUser) {
        loginButton.textContent = `Hello ${currentUser.fullname}!`;
    }
}

// Gọi hàm updateLoginButton khi trang index.html được tải
document.addEventListener('DOMContentLoaded', updateLoginButton);

document.addEventListener('DOMContentLoaded', function() {
    const gameCategories = document.querySelectorAll('.bg-gray-800');
    
    gameCategories.forEach(category => {
        const container = category.querySelector('.overflow-x-auto');
        const leftBtn = category.querySelector('button:first-of-type');
        const rightBtn = category.querySelector('button:last-of-type');
        
        leftBtn.addEventListener('click', () => {
            container.scrollBy({
                left: -300,
                behavior: 'smooth'
            });
        });
        
        rightBtn.addEventListener('click', () => {
            container.scrollBy({
                left: 300,
                behavior: 'smooth'
            });
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    // Lấy số lượng giỏ hàng từ localStorage của user hiện tại
    let cartCount = currentUser ? (parseInt(localStorage.getItem(`cartCount_${currentUser.email}`)) || 0) : 0;
    const cartCountElement = document.getElementById('cart-count');
    
    // Cập nhật hiển thị số lượng ban đầu
    cartCountElement.textContent = cartCount;
    
    // Lấy tất cả các nút "Thêm vào giỏ hàng"
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    // Thêm sự kiện click cho mỗi nút
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (!currentUser) {
                alert('Vui lòng đăng nhập để thêm vào giỏ hàng!');
                return;
            }
            
            cartCount++;
            cartCountElement.textContent = cartCount;
            
            // Lưu số lượng giỏ hàng vào localStorage với key riêng cho từng user
            localStorage.setItem(`cartCount_${currentUser.email}`, cartCount);
            
            // Thêm hiệu ứng animation (tùy chọn)
            cartCountElement.classList.add('scale-125');
            setTimeout(() => {
                cartCountElement.classList.remove('scale-125');
            }, 200);
        });
    });
});

// Khởi tạo giỏ hàng từ localStorage hoặc mảng rỗng
let cart = [];
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (currentUser) {
    cart = JSON.parse(localStorage.getItem(`cart_${currentUser.email}`)) || [];
}

// Thêm biến để theo dõi các sản phẩm được chọn
let selectedItems = [];

// Cập nhật số lượng hiển thị trên icon giỏ hàng
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Thêm sản phẩm vào giỏ hàng
function addToCart(event) {
    if (event.target.classList.contains('add-to-cart')) {
        if (!currentUser) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Vui lòng đăng nhập để thêm vào giỏ hàng!",
            });
            return;
        }

        const productCard = event.target.closest('.bg-gray-900');
        const newProduct = {
            id: Date.now().toString(),
            image: productCard.querySelector('img').src,
            name: productCard.querySelector('h4').textContent,
            price: productCard.querySelector('p').textContent,
            quantity: 1
        };
        
        // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
        const existingProduct = cart.find(item => 
            item.name === newProduct.name && 
            item.price === newProduct.price
        );
        
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push(newProduct);
        }
        
        localStorage.setItem(`cart_${currentUser.email}`, JSON.stringify(cart));
        updateCartCount();
        Swal.fire({
            title: "Thành công!",
            text: "đã thêm " + newProduct.name + " vào giỏ hàng",
            timer: 1500,
            icon: "success"
        });
    }
}

// Cập nhật hàm displayCart để thêm checkbox và nút xóa hàng loạt
function displayCart() {
    const cartItemsContainer = document.querySelector('.lg\\:col-span-2 .space-y-4');
    const cartSummary = document.querySelector('.bg-gray-800.rounded-lg.p-6.h-fit');
    
    // Kiểm tra container giỏ hàng
    if (!cartItemsContainer) {
        console.error('Không tìm thấy container giỏ hàng');
        return;
    }

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '';
        if (cartSummary) cartSummary.style.display = 'none';
        return;
    }

    if (cartSummary) cartSummary.style.display = 'block';

    // Thêm nút xóa các mục đã chọn
    cartItemsContainer.innerHTML = `
        <div class="flex justify-between items-center mb-4">
            <button id="deleteSelected" class="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50" disabled>
                Xóa mục đã chọn
            </button>
            <button id="selectAll" class="bg-purple-500 text-white px-4 py-2 rounded">
                Chọn tất cả
            </button>
        </div>
    `;

    // Thêm các sản phẩm với checkbox
    cartItemsContainer.innerHTML += cart.map(item => `
        <div class="bg-gray-800 rounded-lg p-4 flex items-center space-x-4">
            <input type="checkbox" 
                   class="cart-item-checkbox w-5 h-5" 
                   data-id="${item.id}"
                   ${selectedItems.includes(item.id) ? 'checked' : ''}>
            <img src="${item.image}" alt="${item.name}" class="w-24 h-24 object-cover rounded">
            <div class="flex-1">
                <h3 class="font-bold">${item.name}</h3>
                <p class="text-purple-500 font-bold">${item.price}</p>
                <div class="flex items-center space-x-2 mt-2">
                    <button class="bg-gray-700 px-2 py-1 rounded" onclick="updateQuantity('${item.id}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="bg-gray-700 px-2 py-1 rounded" onclick="updateQuantity('${item.id}', 1)">+</button>
                    <button class="text-red-500 ml-4" onclick="removeFromCart('${item.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    updateCartSummary();
    setupCartEventListeners();
}

// Thêm hàm để thiết lập các event listener cho giỏ hàng
function setupCartEventListeners() {
    const deleteSelectedBtn = document.getElementById('deleteSelected');
    const selectAllBtn = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('.cart-item-checkbox');

    // Xử lý sự kiện cho từng checkbox
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const itemId = this.dataset.id;
            if (this.checked) {
                if (!selectedItems.includes(itemId)) {
                    selectedItems.push(itemId);
                }
            } else {
                selectedItems = selectedItems.filter(id => id !== itemId);
            }
            deleteSelectedBtn.disabled = selectedItems.length === 0;  // Cập nhật trạng thái nút xóa
        });
    });

    // Xử lý nút "Chọn tất cả"
    selectAllBtn.addEventListener('click', function() {
        const allChecked = selectedItems.length === cart.length;
        checkboxes.forEach(checkbox => {
            checkbox.checked = !allChecked;
            const itemId = checkbox.dataset.id;
            if (!allChecked && !selectedItems.includes(itemId)) {
                selectedItems.push(itemId);
            }
        });
        if (allChecked) {
            selectedItems = [];
        } else {
            selectedItems = cart.map(item => item.id);
        }
        deleteSelectedBtn.disabled = selectedItems.length === 0;  // Cập nhật trạng thái nút xóa
    });

    // Xử lý nút "Xóa mục đã chọn"
    deleteSelectedBtn.addEventListener('click', function() {
        if (selectedItems.length === 0) return;
        
        // Xóa các sản phẩm đã chọn
        selectedItems.forEach(id => {
            cart = cart.filter(item => item.id !== id);
        });
        
        // Reset mảng selectedItems
        selectedItems = [];
        
        // Cập nhật localStorage và UI
        localStorage.setItem(`cart_${currentUser.email}`, JSON.stringify(cart));
        displayCart();
        updateCartCount();
    });
}

// Cập nhật số lượng sản phẩm
function updateQuantity(id, change) {
    const itemIndex = cart.findIndex(item => item.id === id);
    if (itemIndex !== -1) {
        cart[itemIndex].quantity = Math.max(1, cart[itemIndex].quantity + change);
        if (currentUser) {
            localStorage.setItem(`cart_${currentUser.email}`, JSON.stringify(cart));
        }
        displayCart();
        updateCartCount();
    }
}

// Xóa sản phẩm khỏi giỏ hàng
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    selectedItems = selectedItems.filter(itemId => itemId !== id);
    if (currentUser) {
        localStorage.setItem(`cart_${currentUser.email}`, JSON.stringify(cart));
    }
    displayCart();
    updateCartCount();
}

// Cập nhật tổng tiền
function updateCartSummary() {
    const subtotal = cart.reduce((total, item) => {
        const price = parseInt(item.price.replace(/[^\d]/g, ''));
        return total + (price * item.quantity);
    }, 0);

    const summaryElement = document.querySelector('.bg-gray-800.rounded-lg.p-6.h-fit');
    if (summaryElement) {
        const subtotalElement = summaryElement.querySelector('.space-y-2 .flex:first-child span:last-child');
        const totalElement = summaryElement.querySelector('.font-bold span:last-child');
        
        subtotalElement.textContent = `${subtotal.toLocaleString()} VNĐ`;
        totalElement.textContent = `${subtotal.toLocaleString()} VNĐ`;
    }
}

// Khởi tạo các event listener
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    
    // Thêm sự kiện click cho nút "Thêm vào giỏ hàng" trong trang store
    document.addEventListener('click', addToCart);
    
    // Hiển thị giỏ hàng nếu đang ở trang cart.html
    if (window.location.pathname.includes('cart.html')) {
        displayCart();
    }
});