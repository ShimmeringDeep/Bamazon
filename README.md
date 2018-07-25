# Bamazon

Bamazon is a project that demonstrates my Master of inquirer and MySql. Although the App isn't yet complete, and doesn't completely utilize my SQL databases yet.
There are 4 databases in total, Transactions, Departments, Products, and Users. But the only Databases used currently are users and products.

## A Quick Walkthrough of What Works now



[This is the Bamazon launch menu. ](./pictures/launchMenu.png)
```
The Create User function should be relatively easy to implement, but isn't working just yet.


```
[I have validation built into every step of Bamazon](./pictures/invalidPass.png)
```
For simple validation If Else statements do just fine, but for more specific validation I ended up using RegEx.


```
[Here is an example of my RegEx at work](./pictures/invalid2.png)
```
Speaking of passwords, all input from the user is MD5 hashed and then compared against what we have stored in the database. No user passwords are ever stored in plaintext.


```
[Another example of validation](./pictures/invalidRedirect.png)

[And after the Redirect](./pictures/badPass.png)
```
In the case of a non-existing username or an incorrect password, the user in informed of the mistake and redirected to the launch menu after 5 seconds (ample time to read the still persistent error message).


```
[A user who has the clearance of both manager and supervisor](./pictures/sAndM.png)

[Here we have a user who is a Manager but not a Supervisor](./pictures/justM.png)

[And here is the login process for just a customer account](./pictures/actualJustCust.png)
```
Just a supervisor also works, but I didn't show it off as it is a pretty unlikely scenario.


```

[In the case a user chooses to 'Search for a Product'](./pictures/searchResult.png)
```
The user is able to look for a partial match of a string, so its easier to find all the shirts, or refine the search how ever the user sees fit.


```
[Time to buy something](./pictures/buying.png)
```
Looks like I have an easy to fix formatting issue here, but the purchase function works just fine, logs the total cost of purchase and properly updoots the database.


```
[What else do we have for sale?](./pictures/lookatall.png)
```
I might ought to add some more products to my store, it seems oddly niche.


```
[Bye now!](./pictures/lognexit.png)
```
GOODBYE!

```



### How can I use Bamazon?

Without the Databases you can't, but if you have Database seeds (coming in the next few days) you should be able to get it running relatively easily.

Just Run it in Node with the proper dependencies. They should be in the [package.json](./package.json)


## Guys

* **ShimmeringDeep** AKA Dan Randazzo

