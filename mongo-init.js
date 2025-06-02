
// MongoDB initialization script
db = db.getSiblingDB('qrcafe');

// Create sample cafe for testing
db.cafes.insertOne({
  name: "Sample Café",
  ownerEmail: "owner@example.com",
  address: "123 Main Street, City",
  phone: "+1-234-567-8900",
  menu: [
    {
      name: "Cappuccino",
      price: 120,
      description: "Rich espresso with steamed milk foam",
      category: "Beverage",
      available: true
    },
    {
      name: "Margherita Pizza",
      price: 350,
      description: "Classic pizza with tomato, mozzarella, and basil",
      category: "Food",
      available: true
    },
    {
      name: "Chocolate Cake",
      price: 180,
      description: "Decadent chocolate cake with rich frosting",
      category: "Dessert",
      available: true
    }
  ],
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

console.log("Sample cafe created successfully!");
