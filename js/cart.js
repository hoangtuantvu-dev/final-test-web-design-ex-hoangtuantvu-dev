function getCart() {
  try {
    return JSON.parse(localStorage.getItem('phoneShopCart') || '[]');
  } catch(e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem('phoneShopCart', JSON.stringify(cart));
  updateCartCount();
}

function addToCart(productId, qty) {
  qty = qty || 1;
  var cart = getCart();
  var existing = cart.find(function(item) { return item.id === productId; });
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: productId, qty: qty });
  }
  saveCart(cart);
  showToast('Đã thêm vào giỏ hàng!', 'success');

  if (window.renderCartPage) renderCartPage();
  if (window.renderCheckoutItems) renderCheckoutItems();
}

function removeFromCart(productId) {
  var cart = getCart().filter(function(item) { return item.id !== productId; });
  saveCart(cart);
  showToast('Đã xóa sản phẩm khỏi giỏ hàng.', 'info');

  if (window.renderCartPage) renderCartPage();
  if (window.renderCheckoutItems) renderCheckoutItems();
}

function updateCartQty(productId, qty) {
  if (qty <= 0) {
    removeFromCart(productId);
    return;
  }
  var cart = getCart();
  var item = cart.find(function(i) { return i.id === productId; });
  if (item) {
    item.qty = qty;
    saveCart(cart);
  }
  if (window.renderCartPage) renderCartPage();
  if (window.renderCheckoutItems) renderCheckoutItems();
}

function clearCart() {
  saveCart([]);
}

function updateCartCount() {
  var el = document.getElementById('cartCount');
  if (!el) return;
  var cart = getCart();
  var count = cart.reduce(function(s, item) { return s + item.qty; }, 0);
  el.textContent = count;
  el.style.display = count > 0 ? 'flex' : 'none';
}
