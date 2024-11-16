const VNPAY_CONFIG = {
    vnp_TmnCode: "NJM5JGYT",
    vnp_HashSecret: "4YM921XSJBRML153A58O2MOPYSAPB5X5",
    vnp_Url: "https://pay.vnpay.vn/vpcpay.html",
    vnp_ReturnUrl: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"
};

function createPaymentUrl(amount, orderInfo) {
    const vnp_Params = {
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TmnCode: VNPAY_CONFIG.vnp_TmnCode,
        vnp_Amount: amount * 100,
        vnp_CreateDate: moment().format('YYYYMMDDHHmmss'),
        vnp_CurrCode: 'VND',
        vnp_IpAddr: '127.0.0.1',
        vnp_Locale: 'vn',
        vnp_OrderInfo: orderInfo,
        vnp_OrderType: 'billpayment',
        vnp_ReturnUrl: VNPAY_CONFIG.vnp_ReturnUrl,
        vnp_TxnRef: `GW${Date.now()}`, // Mã đơn hàng
        vnp_BankCode: 'NCB'
    };

    // Sắp xếp params theo thứ tự a-z
    const sortedParams = Object.keys(vnp_Params)
        .sort()
        .reduce((acc, key) => {
            acc[key] = vnp_Params[key];
            return acc;
        }, {});

    // Tạo chuỗi query
    const queryString = new URLSearchParams(sortedParams).toString();
    
    // Tạo chuỗi hash
    const hmac = CryptoJS.HmacSHA512(queryString, VNPAY_CONFIG.vnp_HashSecret);
    const secureHash = hmac.toString(CryptoJS.enc.Hex);

    // Tạo URL thanh toán hoàn chỉnh
    return `${VNPAY_CONFIG.vnp_Url}?${queryString}&vnp_SecureHash=${secureHash}`;
} 