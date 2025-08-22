class GuestWishlistService {
  constructor() {
    this.storageKey = 'guest_wishlist';
  }

  // Get guest wishlist from localStorage
  getWishlist() {
    try {
      const wishlist = localStorage.getItem(this.storageKey);
      return wishlist ? JSON.parse(wishlist) : [];
    } catch (error) {
      console.error('Error getting guest wishlist:', error);
      return [];
    }
  }

  // Add product to guest wishlist
  addToWishlist(productId) {
    try {
      const wishlist = this.getWishlist();
      
      // Check if already exists
      if (wishlist.includes(productId)) {
        return false; // Already in wishlist
      }
      
      wishlist.push(productId);
      localStorage.setItem(this.storageKey, JSON.stringify(wishlist));
      return true;
    } catch (error) {
      console.error('Error adding to guest wishlist:', error);
      return false;
    }
  }

  // Remove product from guest wishlist
  removeFromWishlist(productId) {
    try {
      const wishlist = this.getWishlist();
      const updatedWishlist = wishlist.filter(id => id !== productId);
      localStorage.setItem(this.storageKey, JSON.stringify(updatedWishlist));
      return true;
    } catch (error) {
      console.error('Error removing from guest wishlist:', error);
      return false;
    }
  }

  // Check if product is in wishlist
  isInWishlist(productId) {
    const wishlist = this.getWishlist();
    return wishlist.includes(productId);
  }

  // Get wishlist count
  getWishlistCount() {
    return this.getWishlist().length;
  }

  // Clear guest wishlist
  clearWishlist() {
    localStorage.removeItem(this.storageKey);
  }
}

export default new GuestWishlistService();
