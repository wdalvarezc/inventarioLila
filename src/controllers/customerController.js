import Customer from "../models/Customer.js";

export const getCustomers = async (req, res) => {
  const customers = await Customer.findAll();
  res.json(customers);
};

export const createCustomer = async (req, res) => {
  const customer = await Customer.create(req.body);
  res.status(201).json(customer);
};