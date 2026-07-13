function initIcons() {
  var icons = document.querySelectorAll('[data-icon]');
  icons.forEach(function(el) {
    var iconName = el.getAttribute('data-icon');
    var fn = window['icon' + iconName.charAt(0).toUpperCase() + iconName.slice(1).replace(/-([a-z])/g, function(_, c) { return c.toUpperCase(); })];
    if (typeof fn === 'function') {
      var size = el.classList.contains('ico-sm') ? 16 : el.classList.contains('ico-lg') ? 32 : el.classList.contains('ico-xl') ? 48 : el.classList.contains('ico-2xl') ? 64 : el.classList.contains('ico-3xl') ? 96 : 24;
      if (el.style.width) size = parseInt(el.style.width);
      el.innerHTML = fn(size, 'currentColor');
    }
  });
}

function initShared() {
  var siteLogo = getSiteLogo();
  document.querySelectorAll('.logo').forEach(function(link) {
    if (link.dataset.logoDecorated === 'true') return;
    link.dataset.logoDecorated = 'true';
    link.innerHTML = '<img class="site-logo" src="' + siteLogo + '" alt="" aria-hidden="true"> <span>255 Shop</span>';
  });

  document.querySelectorAll('.footer-brand h3').forEach(function(heading) {
    if (heading.dataset.logoDecorated === 'true') return;
    heading.dataset.logoDecorated = 'true';
    heading.innerHTML = '<img class="footer-logo" src="' + siteLogo + '" alt="" aria-hidden="true"> <span>255 Shop</span>';
  });

  var menuToggle = document.getElementById('menuToggle');
  var nav = document.getElementById('mainNav');
  var overlay = document.getElementById('menuOverlay');
  if (menuToggle && nav && overlay) {
    menuToggle.addEventListener('click', function() {
      nav.classList.toggle('open');
      overlay.classList.toggle('active');
    });
    overlay.addEventListener('click', function() {
      nav.classList.remove('open');
      overlay.classList.remove('active');
    });
  }

  var btnSearch = document.getElementById('btnSearch');
  var searchOverlay = document.getElementById('searchOverlay');
  var searchInput = document.getElementById('searchInput');
  var searchResults = document.getElementById('searchResults');

  if (btnSearch && searchOverlay) {
    btnSearch.addEventListener('click', function() {
      searchOverlay.classList.add('active');
      setTimeout(function() { if (searchInput) searchInput.focus(); }, 100);
    });
    searchOverlay.addEventListener('click', function(e) {
      if (e.target === searchOverlay) { searchOverlay.classList.remove('active'); if (searchResults) searchResults.innerHTML = ''; }
    });
    if (searchInput) {
      searchInput.addEventListener('keyup', function() {
        var q = this.value.toLowerCase().trim();
        if (!searchResults) return;
        if (q.length < 2) { searchResults.innerHTML = ''; return; }
        var products = getProducts();
        var matches = products.filter(function(p) {
          return p.name.toLowerCase().indexOf(q) !== -1 || p.brand.toLowerCase().indexOf(q) !== -1;
        });
        searchResults.innerHTML = matches.map(function(p) {
          return '<a href="' + getProductDetailUrl(p.id) + '" class="search-item" onclick="document.getElementById(\'searchOverlay\').classList.remove(\'active\');">' +
            '<span class="si-icon">' + iconPhone(32, 'var(--gray-400)') + '</span>' +
            '<div><h4>' + p.name + '</h4><span class="si-price">' + formatPrice(p.price) + '</span></div>' +
          '</a>';
        }).join('');
      });
    }
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') { searchOverlay.classList.remove('active'); if (searchResults) searchResults.innerHTML = ''; }
    });
  }
}

function formatPrice(price) {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + 'd';
}

function getProducts() {
  var el = document.getElementById('productData');
  if (el) {
    try {
      return JSON.parse(el.textContent);
    } catch(e) {}
  }
  var xhr = new XMLHttpRequest();
  var dataPath = location.pathname.indexOf('/html/') !== -1 ? '../data/products.json' : 'data/products.json';
  xhr.open('GET', dataPath, false);
  try { xhr.send(); return JSON.parse(xhr.responseText); } catch(e) { return []; }
}

function getCategories() {
  return [
    { name: 'Apple', slug: 'apple', logo: 'assets/images/iphone.svg'  },
    { name: 'Samsung', slug: 'samsung', logo: 'assets/images/ss.png' },
    { name: 'Xiaomi', slug: 'xiaomi', logo: 'assets/images/xm.png' },
    { name: 'OPPO', slug: 'oppo', logo: 'assets/images/oppo.png'  },
    { name: 'Vivo', slug: 'vivo', logo: 'assets/images/vivo.svg' }
  ];
}

function getSiteLogo() {
  return location.pathname.indexOf('/html/') !== -1 ? '../assets/images/255logo.png' : 'assets/images/255logo.png';
}

function iconBrand(slug, size) {
  size = size || 48;
  var color = 'var(--primary)';
  if (slug === 'apple') return '<svg width="' + size + '" height="' + size + '" vFiewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.25-1.07 3.79-.91.65.03 2.46.26 3.63 1.96-.09.06-2.17 1.29-2.15 3.84.03 3.06 2.68 4.07 2.72 4.09-.03.07-.42 1.44-1.39 2.77zM13 3.5c.73-.87 1.94-1.52 2.95-1.57.14 1.11-.33 2.25-.97 3.06-.69.83-1.83 1.48-2.93 1.39-.16-1.13.38-2.25.95-2.88z"/></svg>';
  return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>';
}

function getProductImage(product) {
  return product.image || 'assets/images/apple-phone.svg';
}

function getProductDetailUrl(productId) {
  var detailPath = location.pathname.indexOf('/html/') !== -1 ? 'product.html' : 'html/product.html';
  return detailPath + '?id=' + productId;
}

function getShopUrl(brandSlug) {
  var shopPath = location.pathname.indexOf('/html/') !== -1 ? 'shop.html' : 'html/shop.html';
  return shopPath + '?brand=' + brandSlug;
}

function renderProductImage(imageSrc, altText, imageClass, iconSize) {
  iconSize = iconSize || 64;
  return '<img class="' + imageClass + '" src="' + imageSrc + '" alt="' + altText + '" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\';">' +
    '<span class="phone-icon" style="display:none;">' + iconPhone(iconSize, 'var(--gray-400)') + '</span>';
}

function renderCategoryMark(category) {
  if (category.logo) {
    return '<img class="brand-logo" src="' + category.logo + '" alt="" aria-hidden="true" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\';">' +
      '<span class="cat-icon-fallback" style="display:none;">' + iconBrand(category.slug, 48) + '</span>';
  }
  return '<span class="cat-icon-fallback">' + iconBrand(category.slug, 48) + '</span>';
}

function renderProductCard(product) {
  var badgeHtml = '';
  if (product.badge === 'hot') badgeHtml = '<span class="badge badge-hot">Hot</span>';
  else if (product.badge === 'new') badgeHtml = '<span class="badge badge-new">Mới</span>';
  else if (product.badge === 'sale') badgeHtml = '<span class="badge badge-sale">Giảm ' + product.discount + '%</span>';

  var priceHtml = '<span class="price">' + formatPrice(product.price) + '</span>';
  if (product.originalPrice > product.price) {
    priceHtml = '<span class="price"><del>' + formatPrice(product.originalPrice) + '</del> ' + formatPrice(product.price) + '</span>';
  }

  var starsHtml = '';
  for (var i = 1; i <= 5; i++) {
    starsHtml += iconStar(14, i <= Math.floor(product.rating));
  }

  return '<div class="product-card">' +
    '<div class="card-img">' +
      renderProductImage(getProductImage(product), product.name, 'card-product-image', 64) +
      '<div class="card-badges">' + badgeHtml + '</div>' +
      '<div class="card-actions">' +
        '<button onclick="addToCart(' + product.id + ')" title="Thêm vào giỏ">' + iconCart(18, 'currentColor') + '</button>' +
        '<button onclick="location.href=\'' + getProductDetailUrl(product.id) + '\'" title="Xem chi tiết">' + iconSearch(18, 'currentColor') + '</button>' +
      '</div>' +
    '</div>' +
    '<div class="card-body">' +
      '<div class="brand">' + product.brand + '</div>' +
      '<h3>' + product.name + '</h3>' +
      '<div class="rating">' + starsHtml + ' <span>(' + product.reviews + ')</span></div>' +
      priceHtml +
      '<a href="' + getProductDetailUrl(product.id) + '" class="btn btn-outline btn-block btn-sm">Xem chi tiết</a>' +
    '</div>' +
  '</div>';
}

function showToast(message, type) {
  type = type || 'info';
  var container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  var toast = document.createElement('div');
  toast.className = 'toast ' + type;
  var iconSvg = type === 'success' ? iconCheck(20, 'var(--success)') : type === 'error' ? iconX(20, 'var(--danger)') : iconPhone(20, 'var(--primary)');
  toast.innerHTML = iconSvg + ' <span>' + message + '</span>';
  container.appendChild(toast);
  setTimeout(function() {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = '0.3s';
    setTimeout(function() { toast.remove(); }, 300);
  }, 2500);
}

function getUrlParam(param) {
  var params = new URLSearchParams(window.location.search);
  return params.get(param);
}

function initHomePage() {
  var products = getProducts();
  var catGrid = document.getElementById('categoryGrid');
  var featuredGrid = document.getElementById('featuredProducts');

  if (catGrid) {
    var cats = getCategories();
    cats.forEach(function(cat) {
      catGrid.innerHTML += '<a href="' + getShopUrl(cat.slug) + '" class="category-card">' +
        '<div class="cat-icon">' + renderCategoryMark(cat) + '</div>' +
        '<h3>' + cat.name + '</h3>' +
      '</a>';
    });
  }

  if (featuredGrid) {
    var featured = products.filter(function(p) { return p.badge === 'hot' || p.badge === 'new'; });
    if (featured.length === 0) featured = products.slice(0, 4);
    featured.forEach(function(p) {
      featuredGrid.innerHTML += renderProductCard(p);
    });
  }
}

function initShop() {
  var products = getProducts();
  var urlBrand = getUrlParam('brand');

  var selectedBrands = ['apple','samsung','xiaomi','oppo','vivo'];
  if (urlBrand) {
    selectedBrands = [urlBrand];
    document.querySelectorAll('.brand-filter').forEach(function(cb) {
      cb.checked = (cb.value === urlBrand);
    });
  }

  function renderFiltered() {
    var maxPrice = parseInt(document.getElementById('priceRange').value);
    var sortBy = document.getElementById('sortSelect').value;

    var filtered = products.filter(function(p) {
      return selectedBrands.indexOf(p.category) !== -1 && p.price <= maxPrice;
    });

    if (sortBy === 'price-asc') filtered.sort(function(a, b) { return a.price - b.price; });
    else if (sortBy === 'price-desc') filtered.sort(function(a, b) { return b.price - a.price; });
    else if (sortBy === 'rating') filtered.sort(function(a, b) { return b.rating - a.rating; });

    var grid = document.getElementById('productGrid');
    grid.innerHTML = '';
    filtered.forEach(function(p) { grid.innerHTML += renderProductCard(p); });
    document.getElementById('resultCount').textContent = 'Hiển thị ' + filtered.length + ' sản phẩm';
  }

  document.getElementById('priceRange').addEventListener('input', function() {
    document.getElementById('priceMax').textContent = formatPrice(parseInt(this.value));
    renderFiltered();
  });

  document.querySelectorAll('.brand-filter').forEach(function(cb) {
    cb.addEventListener('change', function() {
      selectedBrands = [];
      document.querySelectorAll('.brand-filter:checked').forEach(function(c) { selectedBrands.push(c.value); });
      renderFiltered();
    });
  });

  document.getElementById('sortSelect').addEventListener('change', renderFiltered);
  document.getElementById('btnResetFilter').addEventListener('click', function() {
    selectedBrands = ['apple','samsung','xiaomi','oppo','vivo'];
    document.querySelectorAll('.brand-filter').forEach(function(cb) { cb.checked = true; });
    document.getElementById('priceRange').value = 35000000;
    document.getElementById('priceMax').textContent = '35,000,000d';
    renderFiltered();
  });

  document.getElementById('btnFilterToggle').addEventListener('click', function() {
    document.getElementById('filterPanel').classList.toggle('open');
  });

  renderFiltered();
}

function initProductDetail() {
  var productId = parseInt(getUrlParam('id')) || 1;
  var products = getProducts();
  var product = products.find(function(p) { return p.id === productId; });
  if (!product) product = products[0];
  var productImage = getProductImage(product);

  document.getElementById('breadcrumbProduct').textContent = product.name;
  document.querySelector('.product-gallery .main-image').innerHTML = renderProductImage(productImage, product.name, 'main-product-image', 128);
  document.getElementById('thumbnails').innerHTML = '<button type="button" class="thumb active" onclick="swapProductImage(\'' + productImage + '\', this)"><img src="' + productImage + '" alt="' + product.name + '"></button>';

  var info = document.getElementById('productInfo');

  var starsHtml = '';
  for (var i = 1; i <= 5; i++) {
    starsHtml += iconStar(18, i <= Math.floor(product.rating));
  }

  var badgeHtml = '';
  if (product.badge === 'hot') badgeHtml = '<span class="badge badge-hot">Hot</span>';
  else if (product.badge === 'new') badgeHtml = '<span class="badge badge-new">Mới</span>';
  else if (product.badge === 'sale') badgeHtml = '<span class="badge badge-sale">Giảm ' + product.discount + '%</span>';

  var colorsHtml = product.colors.map(function(c) { return '<span class="badge" style="background:var(--gray-200);color:var(--gray-800);">' + c + '</span>'; }).join(' ');

  info.innerHTML =
    '<h1>' + product.name + '</h1>' +
    '<div class="brand-name">' + product.brand + '</div>' +
    '<div class="info-rating">' +
      '<span class="stars">' + starsHtml + '</span>' +
      '<span class="count">' + product.rating + ' (' + product.reviews + ' đánh giá)</span>' +
      badgeHtml +
    '</div>' +
    '<div class="info-price">' +
      '<span class="current">' + formatPrice(product.price) + '</span>' +
      (product.originalPrice > product.price ? '<span class="original">' + formatPrice(product.originalPrice) + '</span>' : '') +
      (product.discount ? '<span class="discount">-' + product.discount + '%</span>' : '') +
    '</div>' +
    '<p class="info-desc">' + product.description + '</p>' +
    '<div class="info-actions">' +
      '<div class="qty">' +
        '<button onclick="changeQty(-1)">' + iconMinus(18, 'currentColor') + '</button>' +
        '<input type="number" id="qtyInput" value="1" min="1" max="' + product.stock + '">' +
        '<button onclick="changeQty(1)">' + iconPlus(18, 'currentColor') + '</button>' +
      '</div>' +
      '<button class="btn btn-primary btn-lg" onclick="addToCartDetail(' + product.id + ')">' + iconCart(20, 'currentColor') + ' Thêm vào giỏ</button>' +
    '</div>' +
    '<div class="info-meta">' +
      '<div class="meta-item"><span class="label">Màu sắc:</span> ' + colorsHtml + '</div>' +
      '<div class="meta-item"><span class="label">Tình trạng:</span> <span style="color:var(--success);">Còn hàng (' + product.stock + ' sản phẩm)</span></div>' +
      '<div class="meta-item"><span class="label">Bảo hành:</span> 12 tháng chính hãng</div>' +
    '</div>';

  var specsHtml = '<table class="specs-table">';
  for (var key in product.specs) {
    var label = key.charAt(0).toUpperCase() + key.slice(1);
    specsHtml += '<tr><td>' + label + '</td><td>' + product.specs[key] + '</td></tr>';
  }
  specsHtml += '</table>';
  document.getElementById('tabSpecs').innerHTML = specsHtml;

  document.getElementById('tabDesc').innerHTML =
    '<p style="margin-bottom:20px;">' + product.description + '</p>' +
    '<h3 style="margin-bottom:12px;">Tính năng nổi bật</h3>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">' +
      product.features.map(function(f) {
        return '<div style="display:flex;align-items:center;gap:8px;padding:10px;background:var(--gray-50);border-radius:var(--radius-sm);">' +
          iconCheck(16, 'var(--success)') + ' <span style="font-size:.9rem;">' + f + '</span></div>';
      }).join('') +
    '</div>';

  document.getElementById('tabReviews').innerHTML =
    '<div style="text-align:center;padding:40px;">' +
      '<div style="display:inline-flex;gap:2px;margin-bottom:12px;">' + iconStar(28, true) + iconStar(28, true) + iconStar(28, true) + iconStar(28, true) + iconStar(28, Math.floor(product.rating) >= 5) + '</div>' +
      '<p style="font-size:1.5rem;font-weight:700;margin-bottom:4px;">' + product.rating + '/5</p>' +
      '<p style="color:var(--gray-600);">Dựa trên <strong>' + product.reviews + '</strong> đánh giá</p>' +
    '</div>';

  var related = products.filter(function(p) { return p.category === product.category && p.id !== product.id; }).slice(0, 4);
  document.getElementById('relatedProducts').innerHTML = related.map(function(p) { return renderProductCard(p); }).join('');

  document.querySelectorAll('.tab-nav button').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.tab-nav button').forEach(function(b) { b.classList.remove('active'); });
      this.classList.add('active');
      var tabId = this.dataset.tab;
      document.querySelectorAll('.tab-content').forEach(function(t) { t.classList.remove('active'); });
      document.getElementById(tabId === 'specs' ? 'tabSpecs' : tabId === 'desc' ? 'tabDesc' : 'tabReviews').classList.add('active');
    });
  });
}

function swapProductImage(imageSrc, thumbButton) {
  var mainImage = document.querySelector('.product-gallery .main-image img');
  if (mainImage) mainImage.src = imageSrc;
  document.querySelectorAll('.product-gallery .thumbnails .thumb').forEach(function(thumb) {
    thumb.classList.remove('active');
  });
  if (thumbButton) thumbButton.classList.add('active');
}

function renderCartPage() {
  var cart = getCart();
  var cartContent = document.getElementById('cartContent');
  var cartEmpty = document.getElementById('cartEmpty');
  var cartItems = document.getElementById('cartItems');

  if (!cartContent) return;

  if (cart.length === 0) {
    cartContent.style.display = 'none';
    cartEmpty.style.display = 'block';
    return;
  }

  cartContent.style.display = 'grid';
  cartEmpty.style.display = 'none';

  var products = getProducts();
  cartItems.innerHTML = '';
  var subtotal = 0;

  cart.forEach(function(item) {
    var product = products.find(function(p) { return p.id === item.id; });
    if (!product) return;
    subtotal += product.price * item.qty;

    cartItems.innerHTML +=
      '<div class="cart-item">' +
        '<div class="item-img">' + renderProductImage(getProductImage(product), product.name, 'cart-product-image', 40) + '</div>' +
        '<div class="item-info">' +
          '<h3>' + product.name + '</h3>' +
          '<div class="item-meta">' + product.brand + ' | ' + formatPrice(product.price) + '</div>' +
        '</div>' +
        '<div class="item-qty">' +
          '<button onclick="updateCartQty(' + product.id + ', ' + (item.qty - 1) + ')">' + iconMinus(16, 'currentColor') + '</button>' +
          '<input type="number" value="' + item.qty + '" min="1" onchange="updateCartQty(' + product.id + ', parseInt(this.value) || 1)">' +
          '<button onclick="updateCartQty(' + product.id + ', ' + (item.qty + 1) + ')">' + iconPlus(16, 'currentColor') + '</button>' +
        '</div>' +
        '<div class="item-price">' + formatPrice(product.price * item.qty) + '</div>' +
        '<button class="item-remove" onclick="removeFromCart(' + product.id + ')" title="Xóa">' + iconTrash(18, 'currentColor') + '</button>' +
      '</div>';
  });

  var discount = Math.floor(subtotal * 0.05);
  var total = subtotal - discount;

  document.getElementById('subtotal').textContent = formatPrice(subtotal);
  document.getElementById('discount').textContent = '-' + formatPrice(discount);
  document.getElementById('total').textContent = formatPrice(total);
}

function renderCheckoutItems() {
  var cart = getCart();
  var products = getProducts();
  var itemsDiv = document.getElementById('checkoutItems');
  if (!itemsDiv) return;

  var subtotal = 0;
  itemsDiv.innerHTML = '';
  cart.forEach(function(item) {
    var product = products.find(function(p) { return p.id === item.id; });
    if (!product) return;
    subtotal += product.price * item.qty;
    itemsDiv.innerHTML += '<div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid var(--gray-100);">' +
      '<div style="font-size:.9rem;">' + product.name + ' x' + item.qty + '</div>' +
      '<div style="font-weight:600;">' + formatPrice(product.price * item.qty) + '</div>' +
    '</div>';
  });

  var discount = Math.floor(subtotal * 0.05);
  var total = subtotal - discount;

  document.getElementById('subtotal').textContent = formatPrice(subtotal);
  document.getElementById('discount').textContent = '-' + formatPrice(discount);
  document.getElementById('total').textContent = formatPrice(total);

  if (cart.length === 0) {
    window.location.href = 'cart.html';
  }
}

function addToCartDetail(productId) {
  var qty = parseInt(document.getElementById('qtyInput').value) || 1;
  addToCart(productId, qty);
}

function changeQty(delta) {
  var input = document.getElementById('qtyInput');
  var val = parseInt(input.value) + delta;
  if (val >= 1) input.value = val;
}
