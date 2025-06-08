//For test why this doesn't work 

require('dotenv').config();
console.log("MONGO_URI:", process.env.MONGO_URI);


const prompt = require('prompt-sync')();

const username = prompt('What is your name? ');

console.log(`Your name is ${username}`);

require('dotenv').config();
const mongoose = require('mongoose');
const Customer = require('./models/customer');


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('connected to MongoDB');
  runApp();
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

//the main loop for the app 
async function runApp() {
  console.log("Welcome to the CRM");

  let running = true;

  while (running) {
    console.log(`
What would you like to do?
1. Create a customer
2. View all customers
3. Update a customer
4. Delete a customer
5. Quit
`);

    const choice = prompt('Enter a number (1-5): ');

    switch (choice) {
      case '1':
        await createCustomer();
        break;
      case '2':
        await viewCustomers();
        break;
      case '3':
        await updateCustomer();
        break;
      case '4':
        await deleteCustomer();
        break;
      case '5':
        console.log("Goodbye!");
        running = false;
        mongoose.disconnect();
        break;
      default:
        console.log("Invalid choice. Please enter a number from 1 to 5.");
    }
  }
}

async function createCustomer() {
  const name = prompt('Enter customer name: ');
  const age = prompt('Enter customer age: ');
  const customer = new Customer({ name, age });
  await customer.save();
  console.log("Customer created.");
}

async function viewCustomers() {
  const customers = await Customer.find();
  if (customers.length === 0) {
    console.log(" No customers found.");
  } else {
    customers.forEach(c => {
      console.log(`ID ${c._id} | Name ${c.name} | Age: ${c.age}`);
    });
  }
}


async function updateCustomer() {
  await viewCustomers();
  const id = prompt('Enter the ID of the customer to update: ');
  const name = prompt('New name: ');
  const age = prompt('New age: ');
  await Customer.findByIdAndUpdate(id, { name, age });
  console.log("Customer updated.");
}


async function deleteCustomer() {
  await viewCustomers();
  const id = prompt('Enter the ID of the customer to delete: ');
  await Customer.findByIdAndDelete(id);
  console.log("Customer deleted.");
}
