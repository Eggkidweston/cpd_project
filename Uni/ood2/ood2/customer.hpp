#ifndef CUSTOMER_HPP_INCLUDED
#define CUSTOMER_HPP_INCLUDED

#include <iostream>
#include <string>

using namespace std;

// Basic enumeration type for genders.
enum GenderType { MALE, FEMALE, OTHER };

// A function to display all possible genders.
void printGenders()
{
    cout << "0. Male" << endl
         << "1. Female" << endl
         << "2. Other" << endl;
}

// This function returns a gender based on the passed index.
// 0 - MALE
// 1 - FEMALE
// 2 - OTHER
GenderType getGenderByIndex(int index)
{
    switch(index)
    {
        case 0: return MALE;
        case 1: return FEMALE;
        case 2: return OTHER;
    }

    return OTHER;
}

// This function returns the string equivalent of a passed gender.
string getGenderAsString(GenderType gender)
{
    switch(gender)
    {
        case MALE: return "Male";
        case FEMALE: return "Female";
        case OTHER: return "Other";
    }

    return "Other";
}

// Class Customer representing a, well, Customer.
class Customer
{
    public:

        //=====================================================================================
        // Constructors.

        // Parameterized constructor that makes a Customer out of the following:
        // Name, Email, Phone, Age, Gender.
        Customer(string name, string email, string phone, int age, GenderType gender)
               : _name(name), _email(email), _phone(phone), _age(age), _gender(gender)
        { }

        // Customer copy constructor.
        Customer(const Customer& customer)
        {
            _name = customer._name;
            _email = customer._email;
            _phone = customer._phone;
            _age = customer._age;
            _gender = customer._gender;
        }

        //====================================================================================
        // Various getters and setters.

        string getName()
        {
            return _name;
        }

        void setName(string name)
        {
            _name = name;
        }

        string getEmail()
        {
            return _email;
        }

        void setEmail(string email)
        {
            _email = email;
        }

        string getPhone()
        {
            return _phone;
        }

        void setPhone(string phone)
        {
            _phone = phone;
        }

        int getAge()
        {
            return _age;
        }

        void setAge(int age)
        {
            _age = age;
        }

        GenderType getGender()
        {
            return _gender;
        }

        void setGender(GenderType gender)
        {
            _gender = gender;
        }

        //=================================================================================
        // A method to print all the Customer's details to the terminal.
        void printCustomer()
        {
            cout << _name << " " << _email << " " << _phone << " " << _age << " ";
            cout << getGenderAsString(_gender);
            cout << endl;
        }

    private:

        string _name, _email, _phone;
        int _age;
        GenderType _gender;
};

#endif // CUSTOMER_HPP_INCLUDED
