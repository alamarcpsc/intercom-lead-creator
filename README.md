# intercom-lead-creator
Chrome browser extension that allows you to create new lead accounts in Intercom.

<a href="https://chrome.google.com/webstore/detail/intercom-lead-creator/pipblbgebpmphicjdbdlcadahpgglbef">Link to Web Store</a>

# Description
This Chrome extension uses OAuth on the client side to get an Access Token for your Intercom workspace. The extension then stores the Access Token in Chrome's local storage and provides you with an interface to create leads using the token.

# How To Use
After you install the extension it will appear in your tool bar:

<img width="135" alt="Tool Bar" src="https://user-images.githubusercontent.com/15332721/59629753-660e1980-90f8-11e9-8cdf-118a447ed5e3.png">

Clicking the icon will open up the options page if Chrome can't find the Access Token in your local storage. From their you can initiate the OAuth process, check what standard attributes you'd like displayed, and save any custom attributes you'd want to use.

<img width="393" alt="Options Page" src="https://user-images.githubusercontent.com/15332721/59629431-a325dc00-90f7-11e9-9e51-cbaa275d6752.png">

Once you've successfully gone through the OAuth process you should be able to start using the lead creator interface by clicking on the extension is the tool bar. From here you can fill in the fields with the attriubtes you'd want your new lead to have:

<img width="159" alt="Popup Panel" src="https://user-images.githubusercontent.com/15332721/59629621-1e878d80-90f8-11e9-814b-bcc974c6c4d9.png">
