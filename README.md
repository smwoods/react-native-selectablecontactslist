# react-native-selectablecontactslist
A React Native component to get and select multiple contacts
(work in progress)

<b>Basic usage</b>:
<pre>
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
</pre>

Every time you select a contact, the <code>onSelectContact</code> method will be fired with the current selection of contacts.
