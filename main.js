console.log('main.js loaded');

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

// Thêm hàm kiểm tra session
function checkLoginSession() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const loginTime = localStorage.getItem('loginTime');
    
    // Nếu không có thông tin đăng nhập hoặc thời gian đăng nhập
    if (!currentUser || !loginTime) {
        handleLogout();
        return false;
    }

    // Kiểm tra thời gian session (ví dụ: 24 giờ)
    const now = new Date().getTime();
    const sessionDuration = 24 * 60 * 60 * 1000; // 24 giờ
    
    if (now - parseInt(loginTime) > sessionDuration) {
        handleLogout();
        return false;
    }

    return true;
}

// Xóa tất cả event listener cũ liên quan đến login và thêm hàm mới
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        Swal.fire({
            icon: 'error',
            title: 'Lỗi!',
            text: 'Vui lòng nhập đầy đủ email và mật khẩu',
            confirmButtonColor: '#6366f1'
        });
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // Lưu thông tin người dùng và thời gian đăng nhập
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('loginTime', new Date().getTime().toString());
        
        Swal.fire({
            icon: 'success',
            title: 'Đăng nhập thành công!',
            text: 'Chào mừng bạn trở lại',
            showConfirmButton: false,
            timer: 1500
        }).then(() => {
            window.location.href = 'index.html';
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Đăng nhập thất bại!',
            text: 'Email hoặc mật khẩu không chính xác',
            confirmButtonColor: '#6366f1'
        });
    }
}

// Cập nhật hàm handleLogout
function handleLogout() {
    // Xóa tất cả thông tin đăng nhập
    localStorage.removeItem('currentUser');
    localStorage.removeItem('loginTime');
    
    // Cập nhật UI
    updateUserDisplay();
    
    // Chuyển về trang đăng nhập
    window.location.href = 'login.html';
}

// Cập nhật hàm updateUserDisplay
function updateUserDisplay() {
    if (!checkLoginSession()) return;

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const loginButton = document.getElementById('login-button');
    const userInfo = document.getElementById('user-info');
    const userName = document.getElementById('user-name');
    const mobileLoginButton = document.getElementById('mobile-login-button');
    const mobileUserInfo = document.getElementById('mobile-user-info');
    const mobileUserName = document.getElementById('mobile-user-name');

    if (currentUser) {
        // Desktop
        if (loginButton) loginButton.classList.add('hidden');
        if (userInfo) userInfo.classList.remove('hidden');
        if (userName) userName.textContent = currentUser.fullname || currentUser.email;

        // Mobile
        if (mobileLoginButton) mobileLoginButton.classList.add('hidden');
        if (mobileUserInfo) mobileUserInfo.classList.remove('hidden');
        if (mobileUserName) mobileUserName.textContent = currentUser.fullname || currentUser.email;
    } else {
        // Desktop
        if (loginButton) loginButton.classList.remove('hidden');
        if (userInfo) userInfo.classList.add('hidden');

        // Mobile
        if (mobileLoginButton) mobileLoginButton.classList.remove('hidden');
        if (mobileUserInfo) mobileUserInfo.classList.add('hidden');
    }
}

// Xóa event listener cũ trong DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // Chỉ thực hiện các chức năng chung
    updateUserDisplay();
    updateCartCount();
});

// Thêm kiểm tra session khi trang được tải
document.addEventListener('DOMContentLoaded', () => {
    checkLoginSession();
    updateUserDisplay();
    
    // Thêm event listener cho form đăng nhập nếu đang ở trang login
    const loginForm = document.querySelector('form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

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
        
        if (leftBtn) {
            leftBtn.addEventListener('click', () => {
                container.scrollBy({
                    left: -300,
                    behavior: 'smooth'
                });
            });
        }
        
        if (rightBtn) {
            rightBtn.addEventListener('click', () => {
                container.scrollBy({
                    left: 300,
                    behavior: 'smooth'
                });
            });
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    // Lấy số lượng gi hàng từ localStorage của user hiện tại
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

// Thêm biến để theo dõi các sản phẩm được chọn (đặt ở đầu file hoặc cùng vị trí với biến cart)
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
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
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
    
    if (!cartItemsContainer) {
        console.error('Không tìm thấy container gi hàng');
        return;
    }

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '';
        if (cartSummary) cartSummary.style.display = 'none';
        return;
    }

    if (cartSummary) cartSummary.style.display = 'block';

    // Reset selectedItems khi hiển thị lại giỏ hàng
    selectedItems = [];

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
                   data-id="${item.id}">
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
            deleteSelectedBtn.disabled = selectedItems.length === 0;
            updateCartSummary();
        });
    });

    // Xử lý nút "Chọn tất cả"
    selectAllBtn.addEventListener('click', function() {
        const allChecked = selectedItems.length === cart.length;
        
        // Nếu tất cả đã được chọn, bỏ chọn hết
        if (allChecked) {
            selectedItems = [];
            checkboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
        } 
        // Ngược lại, chọn tất cả
        else {
            selectedItems = cart.map(item => item.id);
            checkboxes.forEach(checkbox => {
                checkbox.checked = true;
            });
        }
        
        // Cập nhật trạng thái nút xóa và tổng tiền
        deleteSelectedBtn.disabled = selectedItems.length === 0;
        updateCartSummary();
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
    console.log('Updating cart summary. Selected items:', selectedItems); // Thêm log để debug
    const subtotal = cart.reduce((total, item) => {
        if (selectedItems.includes(item.id)) {
            const price = parseInt(item.price.replace(/[^\d]/g, ''));
            return total + (price * item.quantity);
        }
        return total;
    }, 0);

    const summaryElement = document.querySelector('.bg-gray-800.rounded-lg.p-6.h-fit');
    if (summaryElement) {
        const subtotalElement = summaryElement.querySelector('.space-y-2 .flex:first-child span:last-child');
        const totalElement = summaryElement.querySelector('.font-bold span:last-child');
        
        const displayAmount = selectedItems.length > 0 ? subtotal.toLocaleString() : '0';
        console.log('Display amount:', displayAmount); // Thêm log để debug
        subtotalElement.textContent = `${displayAmount} VNĐ`;
        totalElement.textContent = `${displayAmount} VNĐ`;
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
document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.platform-tab');
    const contents = document.querySelectorAll('.platform-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active', 'bg-purple-600'));
            // Add active class to clicked tab
            tab.classList.add('active', 'bg-purple-600');
            
            // Hide all content
            contents.forEach(content => content.classList.add('hidden'));
            // Show selected content
            document.getElementById(`${tab.dataset.platform}-games`).classList.remove('hidden');
        });
    });
});
// Mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

// Thêm hàm này vào cuối file main.js
function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    
    // Tạo danh sách games từ các section game
    function getAllGames() {
        const games = [];
        // Lấy tất cả các section game (các div có chứa h3)
        const gameSections = document.querySelectorAll('.bg-gray-800');
        
        gameSections.forEach(section => {
            const categoryElement = section.querySelector('h3');
            if (!categoryElement) return;
            
            const category = categoryElement.textContent;
            // Lấy tất cả game cards trong section này
            const gameCards = section.querySelectorAll('.bg-gray-900');
            
            gameCards.forEach(card => {
                const nameElement = card.querySelector('h4');
                const priceElement = card.querySelector('.text-red-600');
                const imageElement = card.querySelector('img');
                
                if (nameElement && priceElement && imageElement) {
                    games.push({
                        category: category,
                        name: nameElement.textContent,
                        price: priceElement.textContent,
                        image: imageElement.src
                    });
                }
            });
        });
        
        console.log('Found games:', games); // Để debug
        return games;
    }

    // Hàm tìm kiếm và lọc games
    function searchGames(query) {
        const games = getAllGames();
        const results = games.filter(game => 
            game.name.toLowerCase().includes(query.toLowerCase()) ||
            game.category.toLowerCase().includes(query.toLowerCase())
        );
        console.log('Search results:', results); // Để debug
        return results;
    }

    // Hiển thị kết quả tìm kiếm theo nhóm thể loại
    function displayResults(results) {
        if (results.length === 0) {
            searchResults.innerHTML = `
                <div class="p-4 text-gray-400">
                    Không tìm thấy game nào
                </div>
            `;
            return;
        }

        // Nhóm kết quả theo category
        const groupedResults = results.reduce((acc, game) => {
            if (!acc[game.category]) {
                acc[game.category] = [];
            }
            acc[game.category].push(game);
            return acc;
        }, {});

        // Hiển thị kết quả theo nhóm
        searchResults.innerHTML = Object.entries(groupedResults).map(([category, games]) => `
            <div class="p-2">
                <div class="text-purple-500 font-semibold px-4 py-2">${category}</div>
                ${games.map(game => `
                    <div class="p-4 hover:bg-gray-700 cursor-pointer flex items-center gap-4">
                        <img src="${game.image}" alt="${game.name}" class="w-12 h-12 object-cover rounded">
                        <div>
                            <div class="text-white">${game.name}</div>
                            <div class="text-red-600">${game.price}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `).join('<div class="border-b border-gray-700"></div>');
    }

    // Xử lý sự kiện input
    let debounceTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimeout);
        const query = e.target.value.trim();
        
        if (query.length === 0) {
            searchResults.classList.add('hidden');
            return;
        }

        debounceTimeout = setTimeout(() => {
            const results = searchGames(query);
            displayResults(results);
            searchResults.classList.remove('hidden');
        }, 300);
    });

    // Ẩn kết quả khi click ra ngoài
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.add('hidden');
        }
    });

    // Hiển thị lại kết quả khi focus vào input
    searchInput.addEventListener('focus', () => {
        if (searchInput.value.trim().length > 0) {
            searchResults.classList.remove('hidden');
        }
    });

    // Xử lý khi click vào kết quả tìm kiếm
    searchResults.addEventListener('click', (e) => {
        const resultItem = e.target.closest('.p-4');
        if (resultItem) {
            const gameName = resultItem.querySelector('.text-white').textContent;
            searchInput.value = gameName;
            searchResults.classList.add('hidden');
        }
    });
}

// Thêm vào phần khởi tạo
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('store.html')) {
        console.log('Initializing search...'); // Để debug
        initializeSearch();
    }
});

// Hàm tạo mã đơn hàng ngẫu nhiên
function generateOrderId() {
    return `GW${Date.now()}`;
}

// Hàm tạo URL thanh toán VNPAY
function createPaymentUrl(amount) {
    // Thông tin cấu hình VNPAY
    const vnp_TmnCode = "NJM5JGYT";
    const vnp_HashSecret = "4YM921XSJBRML153A58O2MOPYSAPB5X5";
    const vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    const vnp_ReturnUrl = "http://127.0.0.1:5500/vnpay-return.html"; // Trang xử lý kết quả

    // Tạo đối tượng chứa thông tin thanh toán
    const inputData = {
        vnp_Version: "2.1.0",
        vnp_TmnCode: vnp_TmnCode,
        vnp_Amount: amount * 100, // Số tiền * 100
        vnp_Command: "pay",
        vnp_CreateDate: moment().format('YYYYMMDDHHmmss'),
        vnp_CurrCode: "VND",
        vnp_IpAddr: "127.0.0.1", // IP của khách
        vnp_Locale: "vn",
        vnp_OrderInfo: "Thanh toan don hang GameWorlds",
        vnp_OrderType: "billpayment",
        vnp_ReturnUrl: vnp_ReturnUrl,
        vnp_TxnRef: generateOrderId(),
    };

    // Sắp xếp các tham số theo thứ tự a-z
    const sortedParams = Object.keys(inputData)
        .sort()
        .reduce((acc, key) => {
            acc[key] = inputData[key];
            return acc;
        }, {});

    // Tạo chuỗi query từ object params
    const queryString = new URLSearchParams(sortedParams).toString();
    
    // Tạo chuỗi hash
    const hmac = CryptoJS.HmacSHA512(queryString, vnp_HashSecret);
    const secureHash = hmac.toString(CryptoJS.enc.Hex);

    // Tạo URL thanh toán hoàn chỉnh
    const paymentUrl = `${vnp_Url}?${queryString}&vnp_SecureHash=${secureHash}`;
    
    return paymentUrl;
}

// Xử lý khi click thanh toán
document.addEventListener('DOMContentLoaded', function() {
    const paymentMethods = document.querySelectorAll('.payment-method');
    let selectedMethod = null;

    paymentMethods.forEach(method => {
        method.addEventListener('click', () => {
            paymentMethods.forEach(m => {
                m.style.border = 'none';
                m.classList.remove('border-2');
            });
            
            method.style.border = '2px solid rgb(147, 51, 234)';
            method.classList.add('border-2');
            selectedMethod = method.dataset.method;
        });
    });

    const payButton = document.querySelector('button.bg-purple-600.w-full');
    if (payButton) {
        payButton.addEventListener('click', () => {
            if (!selectedMethod) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Oops...',
                    text: 'Vui lòng chọn phương thức thanh toán',
                    confirmButtonColor: '#9333ea'
                });
                return;
            }

            if (selectedMethod === 'banking') {
                // Lưu selectedItems vào localStorage trước khi chuyển hướng
                if (currentUser) {
                    localStorage.setItem(`selectedItems_${currentUser.email}`, JSON.stringify(selectedItems));
                }

                // Lấy tổng tiền từ các sản phẩm được chọn
                const amount = cart.reduce((total, item) => {
                    if (selectedItems.includes(item.id)) {
                        const price = parseInt(item.price.replace(/[^\d]/g, ''));
                        return total + (price * item.quantity);
                    }
                    return total;
                }, 0);

                const paymentUrl = createPaymentUrl(amount);
                window.location.href = paymentUrl;
            } else {
                alert('Chức năng đang được phát triển cho phương thức thanh toán này');
            }
        });
    }
});

// Thêm hàm xử lý đơn hàng thành công
function handleSuccessfulPayment(orderId, amount) {
    if (!currentUser) return;
    
    // Lấy các sản phẩm đã chọn để thanh toán
    const purchasedItems = cart.filter(item => selectedItems.includes(item.id));
    
    // Tạo đơn hàng mới
    const order = {
        orderId: orderId,
        items: purchasedItems,
        totalAmount: amount,
        purchaseDate: new Date().toISOString(),
        status: 'Đã thanh toán'
    };
    
    // Lưu vào lịch sử mua hàng
    const orderHistory = JSON.parse(localStorage.getItem(`orderHistory_${currentUser.email}`) || '[]');
    orderHistory.push(order);
    localStorage.setItem(`orderHistory_${currentUser.email}`, JSON.stringify(orderHistory));
    
    // Xóa các sản phẩm đã mua khỏi giỏ hàng
    cart = cart.filter(item => !selectedItems.includes(item.id));
    localStorage.setItem(`cart_${currentUser.email}`, JSON.stringify(cart));
    
    // Reset selectedItems
    selectedItems = [];
    
    // Cập nhật UI
    updateCartCount();
    if (window.location.pathname.includes('cart.html')) {
        displayCart();
    }
}

// Thêm hàm hiển thị lịch sử mua hàng
function displayOrderHistory() {
    const orderHistoryContainer = document.getElementById('order-history');
    if (!orderHistoryContainer || !currentUser) return;

    const orderHistory = JSON.parse(localStorage.getItem(`orderHistory_${currentUser.email}`)) || [];

    if (orderHistory.length === 0) {
        orderHistoryContainer.innerHTML = `
            <div class="text-center p-8 text-gray-400">
                Bạn chưa có đơn hàng nào
            </div>
        `;
        return;
    }

    orderHistoryContainer.innerHTML = orderHistory.map(order => `
        <div class="bg-gray-800 rounded-lg p-4 mb-4">
            <div class="flex justify-between items-center mb-4">
                <div>
                    <h3 class="font-bold">Đơn hàng #${order.orderId}</h3>
                    <p class="text-gray-400">${new Date(order.purchaseDate).toLocaleDateString('vi-VN')}</p>
                </div>
                <span class="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                    ${order.status}
                </span>
            </div>
            <div class="space-y-2">
                ${order.items.map(item => `
                    <div class="flex items-center space-x-4">
                        <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded">
                        <div>
                            <h4 class="font-semibold">${item.name}</h4>
                            <p class="text-purple-500">Số lượng: ${item.quantity}</p>
                            <p class="text-gray-400">${item.price}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="mt-4 pt-4 border-t border-gray-700">
                <p class="text-gray-400">Ngân hàng: ${order.bankCode}</p>
                <p class="text-right font-bold">
                    Tổng tiền: ${order.totalAmount.toLocaleString()} VNĐ
                </p>
            </div>
        </div>
    `).join('');
}

// Cập nhật hàm displayUserProfile
function displayUserProfile() {
    const profileContainer = document.getElementById('user-profile');
    const totalGamesElement = document.getElementById('total-games');
    const totalSpentElement = document.getElementById('total-spent');
    
    if (!profileContainer || !currentUser) return;

    // Lấy lịch sử đơn hàng
    const orderHistory = JSON.parse(localStorage.getItem(`orderHistory_${currentUser.email}`)) || [];
    
    // Tính tổng số game và tổng chi tiêu
    let totalGames = 0;
    let totalSpent = 0;
    
    orderHistory.forEach(order => {
        // Tính tổng số game
        totalGames += order.items.reduce((sum, item) => sum + item.quantity, 0);
        
        // Tính tổng chi tiêu
        totalSpent += order.totalAmount;
    });

    // Hiển thị thông tin profile
    profileContainer.innerHTML = `
        <div class="bg-gray-800 rounded-lg p-6">
            <div class="flex items-center space-x-4 mb-6">
                <div class="bg-purple-600 rounded-full p-4">
                    <i class="fas fa-user text-2xl text-white"></i>
                </div>
                <div>
                    <h2 class="text-xl font-bold">${currentUser.fullname}</h2>
                    <p class="text-gray-400">${currentUser.email}</p>
                </div>
            </div>
            <div class="space-y-4">
                <div class="flex justify-between items-center p-4 bg-gray-700 rounded-lg">
                    <span>Tổng số đơn hàng</span>
                    <span class="font-bold">${orderHistory.length}</span>
                </div>
                <button onclick="handleLogout()" class="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600">
                    Đăng xuất
                </button>
            </div>
        </div>
    `;

    // Cập nhật thống kê
    if (totalGamesElement) {
        totalGamesElement.textContent = totalGames;
    }
    
    if (totalSpentElement) {
        totalSpentElement.textContent = `${totalSpent.toLocaleString('vi-VN')} VNĐ`;
    }
}

// Đảm bảo gọi hàm khi trang profile được tải
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('profile.html')) {
        displayUserProfile();
    }
});

// Thêm hàm đăng xuất
function handleLogout() {
    // Xóa tất cả thông tin đăng nhập
    localStorage.removeItem('currentUser');
    localStorage.removeItem('loginTime');
    
    // Cập nhật UI
    updateUserDisplay();
    
    // Chuyển về trang đăng nhập
    window.location.href = 'login.html';
}

// Cập nhật event listener cho DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    // ... existing code ...

    // Hiển thị lịch sử mua hàng nếu đang ở trang history.html
    if (window.location.pathname.includes('history.html')) {
        displayOrderHistory();
    }

    // Hiển thị hồ sơ cá nhân nếu đang ở trang profile.html
    if (window.location.pathname.includes('profile.html')) {
        displayUserProfile();
    }
});

// Thêm vào main.js
function updateUserDisplay() {
    if (!checkLoginSession()) return;

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const loginButton = document.getElementById('login-button');
    const userInfo = document.getElementById('user-info');
    const userName = document.getElementById('user-name');
    const mobileLoginButton = document.getElementById('mobile-login-button');
    const mobileUserInfo = document.getElementById('mobile-user-info');
    const mobileUserName = document.getElementById('mobile-user-name');

    if (currentUser) {
        // Desktop
        if (loginButton) loginButton.classList.add('hidden');
        if (userInfo) userInfo.classList.remove('hidden');
        if (userName) userName.textContent = currentUser.fullname || currentUser.email;

        // Mobile
        if (mobileLoginButton) mobileLoginButton.classList.add('hidden');
        if (mobileUserInfo) mobileUserInfo.classList.remove('hidden');
        if (mobileUserName) mobileUserName.textContent = currentUser.fullname || currentUser.email;
    } else {
        // Desktop
        if (loginButton) loginButton.classList.remove('hidden');
        if (userInfo) userInfo.classList.add('hidden');

        // Mobile
        if (mobileLoginButton) mobileLoginButton.classList.remove('hidden');
        if (mobileUserInfo) mobileUserInfo.classList.add('hidden');
    }
}

// Thêm vào event listener
document.addEventListener('DOMContentLoaded', () => {
    updateUserDisplay();
    // ... other initialization code ...
});

// Hàm đăng xuất
function handleLogout() {
    localStorage.removeItem('currentUser');
    updateUserDisplay();
    window.location.href = 'login.html';
}

// Cập nhật event listener cho form đăng nhập
document.addEventListener('DOMContentLoaded', function() {
    // Chỉ thêm event listener nếu đang ở trang login
    if (window.location.pathname.includes('login.html')) {
        const loginForm = document.querySelector('form');
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault(); // Ngăn form submit mặc định
                handleLogin(e);
            });
        }
    }
    
    // Các event listener khác...
    updateUserDisplay();
});

// Xóa hoặc sửa đổi các event listener khác có thể gây xung đột
// Ví dụ: nếu có event listener cho nút thanh toán, hãy đảm bảo nó chỉ hoạt động ở trang cart
document.addEventListener('DOMContentLoaded', function() {
    // Chỉ thêm event listener cho nút thanh toán nếu đang ở trang cart
    if (window.location.pathname.includes('cart.html')) {
        const payButton = document.querySelector('button.bg-purple-600.w-full');
        if (payButton) {
            payButton.addEventListener('click', handlePayment);
        }
    }
});

// Tách riêng xử lý thanh toán
function handlePayment(event) {
    // Chỉ xử lý thanh toán khi ở trang cart.html
    if (window.location.pathname.includes('cart.html')) {
        // Code xử lý thanh toán ở đây
    }
}

// Xử lý sự kiện thêm vào giỏ hàng
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        // Lấy thông tin sản phẩm
        const productCard = button.closest('.bg-gray-900');
        const productName = productCard.querySelector('h4').textContent;
        const productPrice = productCard.querySelector('.text-red-600').textContent;

        // Cập nhật số lượng trong giỏ hàng
        const cartCount = document.getElementById('cart-count');
        cartCount.textContent = parseInt(cartCount.textContent) + 1;

        // Hiển thị thông báo thành công
        Swal.fire({
            title: 'Thành công!',
            text: `Đã thêm ${productName} vào giỏ hàng`,
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#9333ea' // Màu purple-600
        });
    });
});