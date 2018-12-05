# MerryMen

The idea behind the merry men hackaton team was to offer the possibility to a customer to make a donation for a given cause at checkout time.

We modified the checkout process in spartacus storefront to add a form that takes an amount to be donated.
Then Kyma lambda is catching order placed event and gets the donation information to store them into a redis instance.

We then exposed couple of services such as:
* Sending an email with a thank you note
* Expose a function to retrieve a donation by the order ID
* Expose a function to return the total amount of donation worldwide
* Expose a function to return the total amount of donation for a given country
* Expose a function which returns a map of donation amount per country

We also created an angular application that displays the donation on a world map as well as the global total and the list of donation per country in plain text.

Finally, we provided an alexa skill which is calling some of the exposed APIs in Kyma in order to get a voice user interface.