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
        // Chuyển hướng đến trang index
        window.location.href = 'index.html';
    } else {
        alert('Email hoặc mật khẩu không đúng!');
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