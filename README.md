# react-native-selectablecontactslist
A React Native component to get and select multiple contacts
(work in progress)

<b>Basic usage:</b>
<pre>
import React, { Component } from 'react';
import { View } from 'react-native';
import SelectableContactsList from 'react-native-selectablecontactslist';

class SelectContacts extends Component {

  onSelectContact(contacts) {
    console.log(contacts);
  }

  render() {
    return (
      &lt;View style={{ flex: 1 }}>
        &lt;SelectableContactsList
          onSelectContact={selected => this.onSelectContact(selected)}/>
      &lt;/View>
    );
  }

}

export default SelectContacts;
</pre>

Every time you select a contact, the <code>onSelectContact</code> method will be fired with the current selection of contacts. More info to come about other props.
