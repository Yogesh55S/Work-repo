import { v4 as uuidv4 } from 'uuid';

class GuestCartService {
  static GUEST_ID_KEY = 'nidas_guest_id';
  static GUEST_CART_KEY = 'nidas_guest_cart';

  /**
   * Get or generate a guest user ID
   * @returns {string} Guest user ID
   */
  static getGuestId() {
    let guestId = localStorage.getItem(this.GUEST_ID_KEY);
    if (!guestId) {
      guestId = uuidv4();
      localStorage.setItem(this.GUEST_ID_KEY, guestId);
    }
    return guestId;
  }

  /**
   * Check if current user is a guest (not logged in)
   * @returns {boolean}
   */
  static isGuest() {
    return !localStorage.getItem('token');
  }

  /**
   * Get the guest cart items from localStorage
   * @returns {Array} Cart items
   */
  static getCart() {
    const cartJson = localStorage.getItem(this.GUEST_CART_KEY);
    return cartJson ? JSON.parse(cartJson) : [];
  }

  /**
   * Add product to guest cart
   * @param {Object} product - Product object
   * @param {number} quantity - Quantity to add
   * @returns {boolean} Success status
   */
  static addToCart(product, quantity = 1) {
    try {
      const cart = this.getCart();

      // Check if product already exists in cart
      const existingItemIndex = cart.findIndex(
        (item) => item.productId === product._id
      );

      if (existingItemIndex !== -1) {
        // Update quantity if product already in cart
        cart[existingItemIndex].quantity += quantity;
      } else {
        // Add new product to cart
        cart.push({
          productId: product._id,
          quantity,
          productDetails: {
            ...product,
          },
          addedAt: new Date().toISOString(),
        });
      }

      localStorage.setItem(this.GUEST_CART_KEY, JSON.stringify(cart));
      return true;
    } catch (error) {
      console.error('Error adding to guest cart:', error);
      return false;
    }
  }

  /**
   * Update quantity of a product in guest cart
   * @param {string} productId - Product ID to update
   * @param {number} quantity - New quantity
   * @returns {boolean} Success status
   */
  static updateQuantity(productId, quantity) {
    try {
      const cart = this.getCart();
      const itemIndex = cart.findIndex((item) => item.productId === productId);

      if (itemIndex === -1) return false;

      cart[itemIndex].quantity = quantity;
      localStorage.setItem(this.GUEST_CART_KEY, JSON.stringify(cart));
      return true;
    } catch (error) {
      console.error('Failed to update product quantity in guest cart:', error);
      return false;
    }
  }

  /**
   * Remove a product from guest cart
   * @param {string} productId - Product ID to remove
   * @returns {boolean} Success status
   */
  static removeFromCart(productId) {
    try {
      const cart = this.getCart();
      const updatedCart = cart.filter((item) => item.productId !== productId);

      localStorage.setItem(this.GUEST_CART_KEY, JSON.stringify(updatedCart));
      return true;
    } catch (error) {
      console.error('Failed to remove product from guest cart:', error);
      return false;
    }
  }

  /**
   * Clear the entire guest cart
   */
  static clearCart() {
    localStorage.removeItem(this.GUEST_CART_KEY);
  }

  /**
   * Get total count of items in guest cart
   * @returns {number} Total quantity of items
   */
  static getCartCount() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
  }

  /**
   * Calculate total amount of items in guest cart
   * @returns {number} Total amount
   */
  static getCartTotal() {
    const cart = this.getCart();
    return cart.reduce(
      (total, item) =>
        total + (item.productDetails?.price || 0) * item.quantity,
      0
    );
  }

  /**
   * Transfer guest cart to logged-in user
   * @param {string} userId - User ID to transfer cart to
   * @param {string} token - Authentication token
   * @param {string} apiUrl - API URL
   * @returns {Promise<boolean>} Success status
   */
  static async transferCartToUser(userId, token, apiUrl) {
    try {
      const guestCart = this.getCart();

      if (!guestCart || guestCart.length === 0) return true; // No items to transfer

      console.log(
        'Transferring guest cart to user account:',
        userId,
        guestCart
      );

      // Only send necessary data to the API
      const cartItems = guestCart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      const response = await fetch(`${apiUrl}/cart/${userId}/merge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items: cartItems }),
      });

      if (response.ok) {
        // Clear guest cart after successful transfer
        this.clearCart();
        console.log('Guest cart transferred successfully');
        return true;
      }

      console.error('Failed to transfer guest cart:', response.status);
      return false;
    } catch (error) {
      console.error('Failed to transfer guest cart:', error);
      return false;
    }
  }
}

export default GuestCartService;
