#ifndef ITEM_HPP_INCLUDED
#define ITEM_HPP_INCLUDED

#include <iostream>
#include <string>

using namespace std;

// Class item representing a priced item in the ordering system.
class Item
{
    public:

        //=====================================================================================
        // Constructors.

        // Parameterized constructor for the item.
        // Requires: Name, Cost, Quantity
        Item(string name, double cost, int quantity)
           : _name(name), _cost(cost), _quantity(quantity)
        { }

        Item(const Item& item)
        {
            _name = item._name;
            _cost = item._cost;
            _quantity = item._quantity;
        }

        //=====================================================================================
        // Getters and setters.

        string getName()
        {
            return _name;
        }

        void setName(string name)
        {
            _name = name;
        }

        double getCost()
        {
            return _cost;
        }

        void setCost(double cost)
        {
            _cost = cost;
        }

        int getQuantity()
        {
            return _quantity;
        }

        void setQuantity(int quantity)
        {
            _quantity = quantity;
        }

        //=====================================================================================
        // A method to print the item's details.
        void printItem()
        {
            cout << _name << " " << _cost << " " << _quantity << endl;
        }

    private:

        string _name;
        double _cost;
        int _quantity;
};

#endif // ITEM_HPP_INCLUDED
