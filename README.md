# intercom-lead-creator
Chrome browser extension that allows you to manually create new lead accounts in Intercom.

<a href="https://chrome.google.com/webstore/detail/intercom-lead-creator/pipblbgebpmphicjdbdlcadahpgglbef">Link to Web Store</a>

# Description
This Chrome extension is a proof of concept that uses Intercom's OAuth on the client side to get an Access Token for your Intercom workspace. The extension then stores the Access Token in Chrome's local storage and provides you with an interface to create leads through Intercom's Rest API using the token.

A Boilerplate repo for how to integrate Intercom's OAuth flow into your extension can be found here:
https://github.com/alamarcpsc/intercom-chrome-boilerplate

# How To Use
After you install the extension it will appear in your tool bar:

<img width="135" alt="Tool Bar" src="https://user-images.githubusercontent.com/15332721/59629753-660e1980-90f8-11e9-8cdf-118a447ed5e3.png">

Clicking the icon will open up the options page if Chrome can't find the Access Token in your local storage. From their you can initiate the OAuth process, check what standard attributes you'd like displayed, and save any custom attributes you'd want to use:

<img width="393" alt="Options Page" src="https://user-images.githubusercontent.com/15332721/59629431-a325dc00-90f7-11e9-9e51-cbaa275d6752.png">

Once you've successfully gone through the OAuth process you should be able to start using the lead creator interface by clicking on the extension is the tool bar. From here you can fill in the fields with the attributes you'd want your new lead to have:

<img width="159" alt="Popup Panel" src="https://user-images.githubusercontent.com/15332721/59629621-1e878d80-90f8-11e9-814b-bcc974c6c4d9.png">

# Custom Attribute value type
All custom attributes are sent over as a string of text. If you want to change the type of the attribute then you can do that in the settings of your Intercom workspace:

<img width="476" alt="People data settings" src="https://user-images.githubusercontent.com/15332721/59630508-50015880-90fa-11e9-9842-6ab0f3ef8915.png">

# Intercom product change
After this project was released, Intercom added the ability to manually create users and leads through their UI:
https://www.intercom.com/changes/en/manually-add-new-leads-and-users-without-needing-to-import-

At the moment, the only benefit this extension has over the native feature is that you can add custom attributes and a phone number to your manually created leads.
