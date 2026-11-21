const filterButtons = document.querySelectorAll(".nav-filter");
const productCards = document.querySelectorAll(".product-card");
const filterStatus = document.getElementById("filterStatus");

filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        filterButtons.forEach((item) => item.classList.remove("active"));
        btn.classList.add("active");

        const selectedCategory = btn.dataset.category;
        let visibleCount = 0;

        productCards.forEach((card) => {
            const cardCategory = card.dataset.category;
            if (selectedCategory === "SEMUA" || cardCategory === selectedCategory) {
                card.style.display = "flex";
                visibleCount += 1;
            } else {
                card.style.display = "none";
            }
        });

        filterStatus.textContent =
            selectedCategory === "SEMUA"
                ? `Menampilkan semua produk (${visibleCount})`
                : `Kategori ${selectedCategory} (${visibleCount} produk)`;
    });
});

const footerCategoryLinks = document.querySelectorAll(".footer-cat-link");

footerCategoryLinks.forEach((link) => {
    link.addEventListener("click", () => {
        const targetCategory = link.dataset.category;
        const matchingBtn = Array.from(filterButtons).find(
            (btn) => btn.dataset.category === targetCategory
        );
        if (matchingBtn) {
            matchingBtn.click();
        }
    });
});

let cart = [];
let selectedDetailProduct = null;

const cartModal = document.getElementById("cartModal");
const openCartBtn = document.getElementById("openCartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartItemsContainer = document.getElementById("cartItemsContainer");
const cartTotalPrice = document.getElementById("cartTotalPrice");
const cartCount = document.getElementById("cartCount");
const checkoutBtn = document.getElementById("checkoutBtn");
const checkoutMsg = document.getElementById("checkoutMsg");

function formatRupiah(amount) {
    return "Rp " + amount.toLocaleString("id-ID");
}

function addToCart(product) {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    checkoutMsg.textContent = "";
    renderCart();
}

function updateQty(id, delta) {
    const target = cart.find((item) => item.id === id);
    if (!target) return;

    target.qty += delta;
    if (target.qty <= 0) {
        cart = cart.filter((item) => item.id !== id);
    }
    renderCart();
}

function removeFromCart(id) {
    cart = cart.filter((item) => item.id !== id);
    renderCart();
}

function renderCart() {
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    cartCount.textContent = totalQty;
    cartTotalPrice.textContent = formatRupiah(totalPrice);

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p class="cart-empty">Keranjang masih kosong.</p>`;
        return;
    }

    cartItemsContainer.innerHTML = cart
        .map(
            (item) => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.brand} - ${formatRupiah(item.price)}</p>
                </div>
                <div class="cart-item-actions">
                    <button type="button" class="qty-btn" onclick="updateQty('${item.id}', -1)" aria-label="Kurangi jumlah">-</button>
                    <span class="qty-value">${item.qty}</span>
                    <button type="button" class="qty-btn" onclick="updateQty('${item.id}', 1)" aria-label="Tambah jumlah">+</button>
                    <button type="button" class="remove-item-btn" onclick="removeFromCart('${item.id}')" aria-label="Hapus item">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        `
        )
        .join("");
}

openCartBtn.addEventListener("click", (e) => {
    e.preventDefault();
    checkoutMsg.textContent = "";
    renderCart();
    cartModal.style.display = "flex";
});

closeCartBtn.addEventListener("click", () => {
    cartModal.style.display = "none";
});

checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
        checkoutMsg.style.color = "#e31c25";
        checkoutMsg.textContent = "Tambahkan minimal 1 produk sebelum checkout.";
        return;
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    checkoutMsg.style.color = "#198754";
    checkoutMsg.textContent = `Pesanan dibuat. Total bayar: ${formatRupiah(total)}.`;
    cart = [];
    renderCart();
});

const productModal = document.getElementById("productModal");
const closeProductBtn = document.getElementById("closeProductBtn");
const modalBuyBtn = document.getElementById("modalBuyBtn");

productCards.forEach((card) => {
    const productData = {
        id: card.dataset.id,
        brand: card.dataset.brand,
        name: card.dataset.name,
        price: Number(card.dataset.price),
        img: card.dataset.img,
    };

    const buyBtn = card.querySelector(".btn-add-cart");
    buyBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        addToCart(productData);
        cartModal.style.display = "flex";
    });

    card.addEventListener("click", () => {
        selectedDetailProduct = productData;
        document.getElementById("modalImg").src = productData.img;
        document.getElementById("modalBrand").textContent = productData.brand;
        document.getElementById("modalTitle").textContent = productData.name;
        document.getElementById("modalPrice").textContent = formatRupiah(productData.price);
        productModal.style.display = "flex";
    });
});

modalBuyBtn.addEventListener("click", () => {
    if (!selectedDetailProduct) return;
    addToCart(selectedDetailProduct);
    productModal.style.display = "none";
    cartModal.style.display = "flex";
});

closeProductBtn.addEventListener("click", () => {
    productModal.style.display = "none";
});

const loginModal = document.getElementById("loginModal");
const openLoginBtn = document.getElementById("openLoginBtn");
const closeLoginBtn = document.getElementById("closeLoginBtn");
const loginForm = document.getElementById("loginForm");

const nameInput = document.getElementById("fullName");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const passwordInput = document.getElementById("password");
const notRobotInput = document.getElementById("notRobot");

const nameBox = document.getElementById("nameBox");
const emailBox = document.getElementById("emailBox");
const phoneBox = document.getElementById("phoneBox");
const passwordBox = document.getElementById("passwordBox");
const robotBox = document.getElementById("robotBox");

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const phoneError = document.getElementById("phoneError");
const passwordError = document.getElementById("passwordError");
const robotError = document.getElementById("robotError");
const loginSuccessMsg = document.getElementById("loginSuccessMsg");

const togglePassword = document.getElementById("togglePassword");

openLoginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    loginSuccessMsg.textContent = "";
    loginModal.style.display = "flex";
});

closeLoginBtn.addEventListener("click", () => {
    loginModal.style.display = "none";
});

togglePassword.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
    togglePassword.classList.toggle("fa-eye", isPassword);
    togglePassword.classList.toggle("fa-eye-slash", !isPassword);
});

function validateName() {
    const val = nameInput.value.trim();
    nameBox.classList.remove("valid", "invalid");

    if (val === "") {
        nameError.textContent = "Nama lengkap wajib diisi.";
        nameBox.classList.add("invalid");
        return false;
    }

    if (val.length < 6) {
        nameError.textContent = "Nama lengkap minimal 6 karakter.";
        nameBox.classList.add("invalid");
        return false;
    }

    if (!/^[A-Za-zÀ-ÿ\s'.-]+$/.test(val)) {
        nameError.textContent = "Nama hanya boleh berisi huruf dan spasi.";
        nameBox.classList.add("invalid");
        return false;
    }

    nameError.textContent = "";
    nameBox.classList.add("valid");
    return true;
}

function validateEmail() {
    const val = emailInput.value.trim();
    emailBox.classList.remove("valid", "invalid");

    if (val === "") {
        emailError.textContent = "Email wajib diisi.";
        emailBox.classList.add("invalid");
        return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val)) {
        emailError.textContent = "Masukkan alamat email yang valid (contoh: nama@email.com).";
        emailBox.classList.add("invalid");
        return false;
    }

    emailError.textContent = "";
    emailBox.classList.add("valid");
    return true;
}

function validatePhone() {
    const rawValue = phoneInput.value.trim();
    const cleaned = rawValue.startsWith("0") ? rawValue.slice(1) : rawValue;

    phoneBox.classList.remove("valid", "invalid");

    if (rawValue === "") {
        phoneError.textContent = "Nomor telepon wajib diisi.";
        phoneBox.classList.add("invalid");
        return false;
    }

    if (!/^[0-9]+$/.test(rawValue)) {
        phoneError.textContent = "Nomor telepon hanya boleh berisi angka.";
        phoneBox.classList.add("invalid");
        return false;
    }

    if (!/^8[1-9][0-9]{7,11}$/.test(cleaned)) {
        phoneError.textContent = "Format nomor tidak valid (contoh: 81234567890, 9-13 digit).";
        phoneBox.classList.add("invalid");
        return false;
    }

    phoneError.textContent = "";
    phoneBox.classList.add("valid");
    return true;
}

function validatePassword() {
    const val = passwordInput.value;
    passwordBox.classList.remove("valid", "invalid");

    if (val.trim() === "") {
        passwordError.textContent = "Kata sandi wajib diisi.";
        passwordBox.classList.add("invalid");
        return false;
    }

    if (val.length < 8) {
        passwordError.textContent = "Kata sandi minimal 8 karakter.";
        passwordBox.classList.add("invalid");
        return false;
    }

    if (!/[A-Za-z]/.test(val) || !/[0-9]/.test(val)) {
        passwordError.textContent = "Kata sandi harus mengandung kombinasi huruf dan angka.";
        passwordBox.classList.add("invalid");
        return false;
    }

    if (/\s/.test(val)) {
        passwordError.textContent = "Kata sandi tidak boleh mengandung spasi.";
        passwordBox.classList.add("invalid");
        return false;
    }

    passwordError.textContent = "";
    passwordBox.classList.add("valid");
    return true;
}

function validateRobot() {
    robotBox.classList.remove("invalid");

    if (!notRobotInput.checked) {
        robotError.textContent = "Centang 'Saya bukan robot' untuk melanjutkan.";
        robotBox.classList.add("invalid");
        return false;
    }

    robotError.textContent = "";
    return true;
}

nameInput.addEventListener("input", validateName);
emailInput.addEventListener("input", validateEmail);
phoneInput.addEventListener("input", validatePhone);
passwordInput.addEventListener("input", validatePassword);
notRobotInput.addEventListener("change", validateRobot);

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    loginSuccessMsg.textContent = "";

    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const isPasswordValid = validatePassword();
    const isRobotValid = validateRobot();

    if (isNameValid && isEmailValid && isPhoneValid && isPasswordValid && isRobotValid) {
        const cleanName = nameInput.value.trim();
        const cleanEmail = emailInput.value.trim();
        loginSuccessMsg.textContent = `Data valid. Selamat datang, ${cleanName} (${cleanEmail}).`;
        loginForm.reset();
        [nameBox, emailBox, phoneBox, passwordBox].forEach((box) => {
            box.classList.remove("valid", "invalid");
        });
        robotBox.classList.remove("invalid");
    }
});

const newsletterForm = document.getElementById("newsletterForm");
const newsletterEmail = document.getElementById("newsletterEmail");
const newsletterBox = document.getElementById("newsletterBox");
const newsletterFeedback = document.getElementById("newsletterFeedback");

if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const val = newsletterEmail.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

        if (!emailRegex.test(val)) {
            newsletterBox.classList.remove("valid");
            newsletterBox.classList.add("invalid");
            newsletterFeedback.classList.remove("success");
            newsletterFeedback.classList.add("error");
            newsletterFeedback.textContent = "Masukkan email yang valid.";
            return;
        }

        newsletterBox.classList.remove("invalid");
        newsletterBox.classList.add("valid");
        newsletterFeedback.classList.remove("error");
        newsletterFeedback.classList.add("success");
        newsletterFeedback.textContent = "Terima kasih sudah berlangganan newsletter.";
        newsletterEmail.value = "";
    });
}

window.addEventListener("click", (e) => {
    if (e.target === loginModal) loginModal.style.display = "none";
    if (e.target === cartModal) cartModal.style.display = "none";
    if (e.target === productModal) productModal.style.display = "none";
});

renderCart();