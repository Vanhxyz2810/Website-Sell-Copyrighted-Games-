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

// Chỉ thêm event listener cho form login
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}); 