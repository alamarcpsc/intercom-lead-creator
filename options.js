var submitAuthentication = document.getElementById('submitAuthentication');
var submitQualificationSettings = document.getElementById('submitQualificationSettings');
var addNewCustomAttribute = document.getElementById('addNewCustomAttribute');
var standardQualificationData = {};
var customQualificationData = {};

//checks if there's a saved access token
chrome.storage.local.get(['token'], function(storage) {
  if (chrome.runtime.lastError) {
    console.log('Error: unable to retrieve access token');
    console.log(chrome.runtime.lastError);
    document.getElementById('content').innerHTML=
    "<p>Unable to retrieve data from Chrome storage.</p>";
  }
  else if (storage.token == null) {
    console.log('No token stored');
    document.getElementById('oauthMessage').innerHTML=
    "<p>It doesn't look like you've authenticated this extension yet with Intercom.</p>"+
    "<p>Click the OAuth button to authenticate:</p>";
  }
  else {
    console.log('successfully retrieved access token');
    document.getElementById('oauthMessage').innerHTML=
    "<p>Successfully authenticated with Intercom.</p>"+
    "<p>Click the OAuth button if you'd like to generate a new Access Token:</p>";
  }
});

//checks if there's saved standard qualification settings
chrome.storage.local.get(['standardQualificationData'], function(storage) {
  if (chrome.runtime.lastError) {
    console.log('Error: unable to retrieve standard qualification data');
    console.log(chrome.runtime.lastError);
    document.getElementById('content').innerHTML=
    "<p>Unable to retrieve data from Chrome storage.</p>";
  }
  else if (storage.standardQualificationData == null) {
    console.log('No standard qualification data stored');
    standardQualificationData = {email:true, name:true};
    chrome.storage.local.set({standardQualificationData: standardQualificationData}, function() {
      if (chrome.runtime.lastError) {
        console.log('Error: unable to store access token');
        console.log(chrome.runtime.lastError);
        return;
      }
      console.log('successfully set default standard qualification settings');
      displayStandardAttributes();
    });
  }
  else {
    console.log('successfully retrieved standard qualification settings');
    standardQualificationData = storage.standardQualificationData;
    displayStandardAttributes();
  }
});

//checks if there's saved custom qualification settings
chrome.storage.local.get(['customQualificationData'], function(storage) {
  if (chrome.runtime.lastError) {
    console.log('Error: unable to retrieve custom qualification data');
    console.log(chrome.runtime.lastError);
    document.getElementById('content').innerHTML=
    "<p>Unable to retrieve data from Chrome storage.</p>";
  }
  else if (storage.customQualificationData == null) {
    console.log('No custom qualification data stored');
  }
  else {
    console.log('successfully retrieved custom qualification settings');
    customQualificationData = storage.customQualificationData;
    displayCustomAttributes();
  }
});

//displays standard attributes stored in standardQualificationData
function displayStandardAttributes() {
  let standardAttributeArray = Object.keys(standardQualificationData);
  let standardAttributeHtml = "";
  for (let i = 0; i < standardAttributeArray.length; i++) {
    if (standardQualificationData[standardAttributeArray[i]]) {
      standardAttributeHtml = standardAttributeHtml +
      "<input type='checkbox' id='standard"+standardAttributeArray[i]+"' checked>"+
      standardAttributeArray[i]+
      "<br>";
    }
    else {
      standardAttributeHtml = standardAttributeHtml +
      "<input type='checkbox' id='standard"+standardAttributeArray[i]+"'>"+
      standardAttributeArray[i]+
      "<br>";
    }
  }
  document.getElementById('standardAttributes').innerHTML = standardAttributeHtml;
};

//displays custom attributes stored in customQualificationData
function displayCustomAttributes() {
  if (customQualificationData.length == 0) {
    return;
  }
  let customAttributeArray = Object.keys(customQualificationData);
  let customAttributeHtml = "";
  for (let i = 0; i < customAttributeArray.length; i++) {
    customAttributeHtml = customAttributeHtml +
    "<input type='text' value='"+customAttributeArray[i]+"' readonly> "+
    "<button id='removeAttrbute"+customAttributeArray[i]+"'>-</button>"+
    "<br>";
  }
  document.getElementById('customAttributes').innerHTML = customAttributeHtml;
  for (let i = 0; i < customAttributeArray.length; i++) {
    document.getElementById("removeAttrbute"+customAttributeArray[i]).addEventListener("click", function(){ removeCustomAttribute(customAttributeArray[i]); });
  }
};

//adds new custom atribute to customQualificationData
addNewCustomAttribute.onclick = function(element) {
  let newCustomAttribute = document.getElementById('newCustomAttribute').value;
  if (newCustomAttribute == "") {
    return;
  }
  customQualificationData[newCustomAttribute] = newCustomAttribute;
  displayCustomAttributes();
};

//removes a custom attribute from customQualificationData
function removeCustomAttribute(customAttribute) {
  if (!(customAttribute in customQualificationData)) {
    return;
  }
  delete customQualificationData[customAttribute];
  displayCustomAttributes();
};

//saves standard and custom attribute data
submitQualificationSettings.onclick = function(element) {
  let standardAttributeArray = Object.keys(standardQualificationData);
  for (let i = 0; i < standardAttributeArray.length; i++) {
    if (document.getElementById('standard'+standardAttributeArray[i]).checked) {
      standardQualificationData[standardAttributeArray[i]] = true;
    }
    else {
      standardQualificationData[standardAttributeArray[i]] = false;
    }
  }
  chrome.storage.local.set({standardQualificationData: standardQualificationData}, function() {
    if (chrome.runtime.lastError) {
      console.log('Error: unable to store standard qualification data');
      console.log(chrome.runtime.lastError);
      return;
    }
    console.log('successfully saved standard qualification settings');
    chrome.storage.local.set({customQualificationData: customQualificationData}, function() {
      if (chrome.runtime.lastError) {
        console.log('Error: unable to store custom qualification data');
        console.log(chrome.runtime.lastError);
        return;
      }
      console.log('successfully saved custom qualification settings');
      document.getElementById('attributesMessage').innerHTML=
      "<p>Successfully saved qualification settings!</p>";
    });
  });
};

//UUID generator used for state parameter
function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
};

//OAuth process to get an access token
submitAuthentication.onclick = function(element) {
  const CLIENT_ID = '**********';
  const CLIENT_SECRET = '**********';
  const UUID = uuidv4();
  const REDIRECT_URL = 'https://'+chrome.runtime.id+'.chromiumapp.org';
  const OAUTH_URL = 'https://app.intercom.io/a/oauth/connect?client_id='+CLIENT_ID+'&state='+UUID+'&redirect_uri='+REDIRECT_URL;
  console.log('opening OAuth window');
  chrome.identity.launchWebAuthFlow({
    url: OAUTH_URL,
    interactive: true
  }, function(responseURL) {
    if (responseURL) {
      //parsing response for authorization code and state
      let responseParams = responseURL.substring(responseURL.indexOf('?')+1);
      responseParams = responseParams.split('&');
      let params = {};
      for ( i = 0, l = responseParams.length; i < l; i++ ) {
        let temp = responseParams[i].split('=');
        params[temp[0]] = temp[1];
      }
      if (params.code && UUID == params.state) {
        console.log('received authorization code');
        console.log('trading authorization code for an access token');
        //Post request to eagle endpoint
        const HTTP = new XMLHttpRequest();
        const EAGLE_URL='https://api.intercom.io/auth/eagle/token?code='+params.code+'&client_id='+CLIENT_ID+'&client_secret='+CLIENT_SECRET;
        HTTP.open('POST', EAGLE_URL, true);
        HTTP.send();
        HTTP.onreadystatechange=(e)=>{
          if (HTTP.readyState == 4 && HTTP.status == 200) {
            console.log('received access token');
            //formatting response string into a token
            let responseText = HTTP.responseText
            responseText = responseText.substring(10, responseText.length - 1);
            responseText = responseText.substring(0, responseText.indexOf('"'));
            let token = responseText;
            //storing the access token
            chrome.storage.local.set({token: token}, function() {
              if (chrome.runtime.lastError) {
                console.log('Error: unable to store access token');
                console.log(chrome.runtime.lastError);
                return;
              }
              console.log('successfully stored access token');
              document.getElementById('oauthMessage').innerHTML=
              "<p>Successfully authenticated with Intercom.</p>"+
              "<p>Click the OAuth button if you'd like to generate a new Access Token:</p>";
            });
          }
          else if (HTTP.status != 200) {
            console.log('Unexpected non 200 reponse received, status: ' + HTTP.status);
            document.getElementById('oauthMessage').innerHTML=
            "<p>Unexpected response.</p>";
          }
        }
      }
      else {
        console.log('Error: no authorization code received');
        document.getElementById('oauthMessage').innerHTML=
        "<p>Unexpected response.</p>";
      }
    }
  });
};
