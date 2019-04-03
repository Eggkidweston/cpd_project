//
//  main.cpp
//  Software Project
//
//  Created by James Hodgkinson on 02/05/2018.
//  Copyright © 2018 James Hodgkinson. All rights reserved.
//

/*
 James Hodgkinson 1st Year C++ Project
 Sales management tool
 */

#include <iostream>
#include <fstream>
#include <string>
#include <cstdio>


using namespace std;


// List of globaly used vairables throught to project
void input();
void search();
void maths();
void displayAll();
void printTextWithLineReturn(string);
double price;
int sold;
string name;
char yn;
int choice;
string fileLocation;



int menu()
{
    printTextWithLineReturn("what is the path to your file?");
    cin >> fileLocation;
}


//main() consits of the menu selction and allows users to navigate to desired location using
int menu()
{
    printTextWithLineReturn("------------------------");
    printTextWithLineReturn("WELCOME");
    printTextWithLineReturn("------------------------");
    printTextWithLineReturn("Please input a number to make your selection");
    printTextWithLineReturn("------------------------");
    printTextWithLineReturn("1. Input new product");
    printTextWithLineReturn("2. Sales Number");
    printTextWithLineReturn("3. Search Procucts");
    printTextWithLineReturn("4. Show all products");
    printTextWithLineReturn("5. Exit");
    printTextWithLineReturn("------------------------");
    printTextWithLineReturn("Make selection below");
    
    
    
    /* User selects which function is chosen by input of int between 1 and
     The case selected by a user should call the function assigne to the case
     */
    
    cin >> choice;
    if (choice > 0 && choice <= 5 ) {
        switch (choice){
            case 1:
                input();
                break;
            case 2:
                maths();
                break;
            case 3:
                search();
                break;
            case 4:
                displayAll();
                break;
                
        }
        
        //Defines if an invalid number is entered and prompts the user to try again
        if (choice > 5 || choice <= 0){
            cout << "PLEASE ENTER A VAILD NUMBER" << endl << endl;
            main();
        }
        
        
        
    }
}



/*
 input() function controls input of new products allowing
 */
void input ()
{
    ofstream newProduct(fileLocation, ios::app); //Opens or creates a new text file to be written to and read from
    cout << "Input product name:" ;
    cin >> name;
    cout << name << endl;
    cout << "Input item price:";
    cin >> price;
    cout << "Input amaount sold:";
    cin >> sold;
    
    newProduct << name << " " << price << " " << sold << " " << endl;
    newProduct.close();
    
    cout << "Do you want to add another product? use y for yes and n for no" << endl << endl;
    cin>> yn;
    
    if ( yn == 'y' || yn == 'Y' ) //If 'y' or 'Y' selected return to input
        input();
    
    else if ( yn == 'n'|| yn == 'N' ) //If 'n' or 'N' selected return to  main
        main();
    
}





/*
 search() functions controls the ability to search the text file
 for a specific product using the product name
 */

void search ()
{
    ifstream itemSearch ("/Users/james.hodgkinson/Newproduct.txt");
    
    
    string searchName;
    
    
    cout << "Enter item name:";
    cin >> searchName;
    
    //Loops through text document
    while (itemSearch >> name >> price >> sold) {
        
        
        //If name searhed by user found display product info
        if (searchName == name){
            cout << "Product found" << endl << endl;
            cout << "Name" << " " << "Price" << " " << "Sold" << endl;
            cout << "-------------------------" << endl;
            cout << name << ' ' << price << ' ' <<  sold << endl << endl;
        }
        
        
    }
    
    cout << "No more matching products found" << endl << endl;
    
    
    cout << "Do you want to search for another item? (y/n)";
    cin>> yn;
    
    if ( yn == 'y' || yn == 'Y' )
        search();
    
    else if ( yn == 'n'|| yn == 'N' )
        main();
    
}










/*
 maths() function is responsible for the sums that are
 needed to output the sales numbers
 */
void maths ()
{
    //Assigns the text file to the variable itemSearch
    ifstream itemSearch ("/Users/james.hodgkinson/Newproduct.txt");
    
    
    
    double totalIncome = 0;
    double totalSold = 0;
    double operationalCosts = 0;
    double taxPaid = 0;
    double profit = 0;
    double largest = 0;
    double smallest = 0;
    string mostSold;
    string leastSold;
    double warning;
    double difference = 0.0;
    
    while (itemSearch >> name >> price >> sold) {
        
        
        //Calulations for the sales numbers
        totalIncome += (price * sold);
        totalSold += sold;
        operationalCosts = totalIncome * 0.5;
        taxPaid = totalIncome * 0.2;
        profit = totalIncome - operationalCosts - taxPaid;
        warning = totalSold / 100 * 5 ;
        
        //Calculations for flagged products
        if (warning > sold){
            
            //Store flagged product into array and output array outside the while loop
            cout << "Flagged Products:" << " " << endl;
            cout << name <<  endl;
            
        }
        
        //Most and least sold
        if (sold > largest)
        {
            largest = sold;
            mostSold = name;
        }
        
        if (sold < smallest || smallest == 0)
        { smallest = sold;
            leastSold = name;
        }
        
        difference = largest - smallest;
        
    }
    
    // Output the list of sales numbers
    cout << "Total income: " << " " << totalIncome << endl << endl;
    cout << "Total sales: " << totalSold << endl << endl;
    cout << "Operational costs: "  << operationalCosts << endl << endl;
    cout << "Tax paid: "  << taxPaid << endl << endl;
    cout << "Profit: " << profit << endl << endl;
    cout << "Most sold: " << mostSold << " " << largest  << endl << endl;
    cout << "Least sold: " << leastSold << " " << smallest << endl << endl;
    cout << "Difference between most and least sold: " << difference << endl << endl;
    
    
    
    
    
    
    main();
}



/*
 displayAll() functions displays all producst within the text file
 */
void displayAll()
{
    
    cout << "Entire Product database" << endl;
    cout << "------------------------" << endl;
    cout << "Name" << " " << "Price" << " " << "Sold" << endl;
    cout << "------------------------" << endl;
    
    //Open and display all products from the text file
    ifstream itemSearch ("/Users/james.hodgkinson/Newproduct.txt");
    while (itemSearch >> name >> price >> sold){
        cout << name << " " << price << " " << sold << endl << endl;
    }
    main();
    
}


// function to easily print text with line return
void printTextWithLineReturn(string text) {
    cout << text << endl;
}




