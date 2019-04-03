#ifndef ORDER_HPP_INCLUDED
#define ORDER_HPP_INCLUDED

#include <vector>
#include <iostream>

#include "customer.hpp"

using namespace std;

// Class representing a customer's order.
class Order
{
    public:

        // Ordered items.
        vector<Item> Items;

        // Customers who ordered the items.
        vector<Customer> Customers;

        //=====================================================================================
        // Empty constructor.
        // All order parameters (the customers and the ordered items) are set during the execution
        // not during the construction of this object.
        Order() : Items(), Customers() { }

        //=====================================================================================
        // Used methods.

        // Method to add an item to the order.
        void addItem(Item item)
        {
            Items.push_back(item);
        }

        // Method to add a customer to the order.
        void addCustomer(Customer customer)
        {
            Customers.push_back(customer);
        }

        // Method to remove an item from the order at the index.
        void removeItem(int index)
        {
            if (index < 0 || index > Items.size() - 1) return;
            else Items.erase(Items.begin() + index);
        }

        // Method to remove a customer from the order at the index.
        void removeCustomer(int index)
        {
            if (index < 0 || index > Customers.size() - 1) return;
            else Customers.erase(Customers.begin() + index);
        }

        // Returns all items from the order.
        vector<Item>& getItems()
        {
            return Items;
        }

        // Returns all customers ordering.
        vector<Customer>& getCustomers()
        {
            return Customers;
        }

        // A method that prints the whole invoice to the terminal.
        // It lists the customers first, then the items.
        // At the end it lists 4 cost types: Actual cost, cost per person, cost without VAT and total VAT.
        void printInvoice()
        {
            cout << ":: Customers who ordered ::" << endl;
            for (int i = 0; i < Customers.size(); ++i)
            {
                cout << "Customer #" << (i + 1) << ":" << endl;
                cout << "Name >> " << Customers[i].getName() << endl;
                cout << "Email >> " << Customers[i].getEmail() << endl;
                cout << "Phone >> " << Customers[i].getPhone() << endl;
                cout << "Age >> " << Customers[i].getAge() << endl;
                cout << "Gender >> " << getGenderAsString(Customers[i].getGender()) << endl;
                cout << "-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-" << endl;
            }

            cout << ":: Items which are ordered ::" << endl;

            double totalCost = 0;
            for (int i = 0; i < Items.size() - 1; ++i)
            {
                totalCost += Items[i].getCost() * Items[i].getQuantity() * Customers.size();
                cout << Items[i].getName() << " x" << Items[i].getQuantity() << ", ";
            }
            totalCost += Items[Items.size() - 1].getCost() * Items[Items.size() - 1].getQuantity();
            cout << Items[Items.size() - 1].getName() << " x" << Items[Items.size() - 1].getQuantity();

            cout << " (x" << Customers.size() << " (No. customers))" << endl;

            cout << ":: Costs ::" << endl;
            cout << "Cost >> " << totalCost << endl;
            cout << "Cost per person >> " << totalCost / Customers.size() << endl;
            cout << "Cost before VAT (20%) >> " << totalCost - 0.2 * totalCost << endl;
            cout << "Total VAT (20%) >> " << totalCost * 0.2 << endl;
        }
};

#endif // ORDER_HPP_INCLUDED
