const Cart = {
  key: "nox-cart",

  get() {
    try {
      const raw = localStorage.getItem(this.key);
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      return [];
    }
  },

  set(items) {
    localStorage.setItem(this.key, JSON.stringify(items));
    document.dispatchEvent(new CustomEvent("cart:change"));
  },

  add(id, qty) {
    const quantity = qty || 1;
    const items = this.get();
    const existing = items.find((item) => item.id === id);
    if (existing) {
      existing.qty += quantity;
    } else {
      items.push({ id: id, qty: quantity });
    }
    this.set(items);
  },

  update(id, qty) {
    const quantity = Math.max(1, Number(qty) || 1);
    const items = this.get().map((item) =>
      item.id === id ? { id: id, qty: quantity } : item
    );
    this.set(items);
  },

  remove(id) {
    this.set(this.get().filter((item) => item.id !== id));
  },

  clear() {
    this.set([]);
  },

  count() {
    return this.get().reduce((sum, item) => sum + item.qty, 0);
  },

  lines() {
    return this.get()
      .map((item) => {
        const product = getProduct(item.id);
        if (!product) return null;
        return {
          ...product,
          qty: item.qty,
          lineTotal: product.price * item.qty
        };
      })
      .filter(Boolean);
  },

  total() {
    return this.lines().reduce((sum, line) => sum + line.lineTotal, 0);
  }
};
