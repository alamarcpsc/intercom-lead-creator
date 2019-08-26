var submitLead = document.getElementById('submitLead');
var openOptions = document.getElementById('openOptions');
var ACCESS_TOKEN = null;
var STANDARD_QUALIFICATION_DATA = {};
var CUSTOM_QUALIFICATION_DATA = {};

//get access token from storage on popup
chrome.storage.local.get(['token'], function(storage) {
  if (chrome.runtime.lastError) {
    console.log('Error: unable to retrieve access token');
    console.log(chrome.runtime.lastError);
    document.getElementById('content').innerHTML=
    "<p>Unable to retrieve data from Chrome storage.</p>";
  }
  else if (storage.token == null) {
    console.log('Error: no token stored');
    document.getElementById('content').innerHTML=
    "<p>It doesn't look like you've authenticated the extension yet with Intercom.</p>"+
    "<p>Authenticate through the extension's settings page.</p>";
    chrome.runtime.openOptionsPage();
  }
  else {
    console.log('successfully retrieved access token');
    ACCESS_TOKEN = storage.token;
  }
});

//retrieves saved standard qualification settings
chrome.storage.local.get(['standardQualificationData'], function(storage) {
  if (chrome.runtime.lastError) {
    console.log('Error: unable to retrieve standard qualification data');
    console.log(chrome.runtime.lastError);
    document.getElementById('content').innerHTML=
    "<p>Unable to retrieve data from Chrome storage.</p>";
  }
  else if (storage.standardQualificationData == null) {
    console.log('No standard qualification data stored');
    chrome.runtime.openOptionsPage();
  }
  else {
    console.log('successfully retrieved standard qualification settings');
    STANDARD_QUALIFICATION_DATA = storage.standardQualificationData;
    let standardAttributeArray = Object.keys(STANDARD_QUALIFICATION_DATA);
    for (let i = 0; i < standardAttributeArray.length; i++) {
      if (!(STANDARD_QUALIFICATION_DATA[standardAttributeArray[i]])) {
        delete STANDARD_QUALIFICATION_DATA[standardAttributeArray[i]]
      }
    }
    displayStandardAttributes();
  }
});

//retrieves saved custom qualification settings
chrome.storage.local.get(['customQualificationData'], function(storage) {
  if (chrome.runtime.lastError) {
    console.log('Error: unable to retrieve standard qualification data');
    console.log(chrome.runtime.lastError);
    document.getElementById('content').innerHTML=
    "<p>Unable to retrieve data from Chrome storage.</p>";
  }
  else if (storage.customQualificationData == null) {
    console.log('No custom qualification data stored');
  }
  else {
    console.log('successfully retrieved custom qualification settings');
    CUSTOM_QUALIFICATION_DATA = storage.customQualificationData;
    displayCustomAttributes();
  }
});

//displays standard attributes stored in STANDARD_QUALIFICATION_DATA
function displayStandardAttributes() {
  let standardAttributeArray = Object.keys(STANDARD_QUALIFICATION_DATA);
  let standardAttributeHtml = "";
  for (let i = 0; i < standardAttributeArray.length; i++) {
    standardAttributeHtml = standardAttributeHtml +
    standardAttributeArray[i]+":"+
    "<input type='text' id='standard"+standardAttributeArray[i]+"'>"+
    "<br>";
  }
  document.getElementById('standardAttributes').innerHTML = standardAttributeHtml;
};

//displays custom attributes stored in CUSTOM_QUALIFICATION_DATA
function displayCustomAttributes() {
  let customAttributeArray = Object.keys(CUSTOM_QUALIFICATION_DATA);
  let customAttributeHtml = "";
  for (let i = 0; i < customAttributeArray.length; i++) {
    customAttributeHtml = customAttributeHtml +
    customAttributeArray[i]+":"+
    "<input type='text' id='custom"+customAttributeArray[i]+"'>"+
    "<br>";
  }
  document.getElementById('customAttributes').innerHTML = customAttributeHtml;
};

submitLead.onclick = function(element) {
  if (ACCESS_TOKEN == null) {
    return;
  }
  const CONTACTS_URL='https://api.intercom.io/contacts';
  //add input values to data object
  let data = {};
  let standardAttributeArray = Object.keys(STANDARD_QUALIFICATION_DATA);
  for (let i = 0; i < standardAttributeArray.length; i++) {
    data[standardAttributeArray[i]] = document.getElementById('standard'+standardAttributeArray[i]).value;
  }
  let customData = {};
  let customAttributeArray = Object.keys(CUSTOM_QUALIFICATION_DATA);
  for (let i = 0; i < customAttributeArray.length; i++) {
    customData[customAttributeArray[i]] = document.getElementById('custom'+customAttributeArray[i]).value;
  }
  data.custom_attributes = customData;
  //convert JSON object to JSON string
  let requestBody = JSON.stringify(data);
  //Post request to contacts endpoint
  const HTTP = new XMLHttpRequest();
  HTTP.open("POST", CONTACTS_URL, true);
  HTTP.setRequestHeader("Accept", "application/json");
  HTTP.setRequestHeader("Content-type", "application/json");
  HTTP.setRequestHeader("Authorization", "Bearer " + ACCESS_TOKEN);
  HTTP.send(requestBody);
  HTTP.onreadystatechange=(e)=>{
    if (HTTP.readyState == 4 && HTTP.status == 200) {
      console.log('successfully created lead');
      document.getElementById('statusMessage').innerHTML=
      "<p>Successfully created lead!</p>";
    }
    else if (HTTP.status != 200) {
      console.log('Unexpected non 200 response received, status: ' + HTTP.status);
      document.getElementById('statusMessage').innerHTML=
      "<p>Unexpected response.</p>";
    }
  }
};

openOptions.onclick = function(element) {
  chrome.runtime.openOptionsPage();
};

