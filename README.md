# intercom-lead-creator
Chrome browser extension that allows you to create new lead accounts in Intercom.

# Description
This Chrome extension uses OAuth on the client side to get an Access Token for your Intercom workspace. The extension then stores the Access Token in Chrome's local storage and provides you with an interface to create leads using the token.

# How To Use
After you install the extension it will appear in your tool bar:

![Tool Bar](https://user-images.githubusercontent.com/15332721/57656469-3f0a7800-758d-11e9-8efc-a5ebbbbcc72b.png)

Clicking the icon will open up the options page if Chrome can't find the Access Token in your local storage. From their you can initiate the OAuth process, check what standard attributes you'd like displayed, and save any custom attributes you'd want to use.

![Options Page](https://user-images.githubusercontent.com/15332721/57656761-2b134600-758e-11e9-9559-1c121c6cda93.png)

Once you've successfully gone through the OAuth process you should be able to start using the lead creator interface by clicking on the extension is the tool bar. From here you can fill in the fields with the attriubtes you'd want your new lead to have:

![Popup Panel](https://user-images.githubusercontent.com/15332721/57658154-ae369b00-7592-11e9-9564-61d679200db4.png)
