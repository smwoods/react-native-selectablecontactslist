'use strict';

import React, { Component, PropTypes } from 'react';
import Contacts from 'react-native-contacts';
import AlphabetListView from 'react-native-alphabetlistview';

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';

class Cell extends Component {

  constructor(props) {
    super(props);
    this.state = { isSelected: false };
  }

  onPress() {
    this.props.onSelectContact(this.props.item);
    this.setState({ isSelected: !this.state.isSelected });
  }

  getIndicatorStyle() {
    var style = {
      width: 16,
      height: 16,
      borderRadius: 8,
      borderWidth: 2
    };
    if (this.state.isSelected) {
      if (this.props.indicatorColor) {
        style.backgroundColor = this.props.indicatorColor;
        style.borderColor = this.props.indicatorColor;
      } else {
        style.backgroundColor = 'red';
        style.borderColor = 'red';
      }
    } else {
      if (this.props.indicatorColor) {
        style.borderColor = this.props.indicatorColor;
      } else {
        style.borderColor = 'red';
      }
    }
    return style;
  }

  getTextStyle() {
    if (this.props.textStyle) {
      return this.props.textStyle;
    }
    return styles.cellText;
  }

  getCellStyle() {
    var style = {
      justifyContent: 'center',
      paddingLeft: 10,
      flexDirection: 'row',
      height: 50
    };
    if (this.props.backgroundColor) {
      style.backgroundColor = this.props.backgroundColor;
    }
    return style;
  }

  render() {
    return (
      <TouchableOpacity onPress={() => this.onPress()}>
        <View style={this.getCellStyle()}>

          <View style={styles.indicatorContainer}>
            <View style={this.getIndicatorStyle()}></View>
          </View>

          <View style={styles.cellTextContainer}>
            <Text style={this.getTextStyle()}>{this.props.item.name}</Text>
          </View>

        </View>
      </TouchableOpacity>
    );
  }
}

Cell.propTypes = {
  item: PropTypes.object.isRequired,
  onSelectContact: PropTypes.func.isRequired,
  backgroundColor: PropTypes.string,
  textStyle: PropTypes.object,
  indicatorColor: PropTypes.string
};

class SelectableContactsList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selected: [],
      contacts: [],
    };
  }

  componentWillMount() {
    this.getContacts();
  }

  getContacts() {
    Contacts.getAll((err, contacts) => {
      if (err && err.type === 'permissionDenied') {
        // Notify user that there was a permissions error
      } else {
        console.log(contacts);
        // separate contacts by starting letter
        var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#'.split('');
        var groups = {};
        for (var i = 0; i < letters.length; i++) {
          groups[letters[i]] = [];
        }

        contacts = contacts.map(function(c) {
          var name = '';
          if (c.givenName) {
            name += (c.givenName + ' ');
          }
          if (c.familyName) {
            name += c.familyName;
          }
          c.name = name.trim();
          return c;
        });

        contacts = contacts.sort(function(a, b) {
          if (a.name.toUpperCase() < b.name.toUpperCase()) {
            return -1;
          }
          if (a.name.toUpperCase() > b.name.toUpperCase()) {
            return 1;
          }
          return 0;
        });

        for (var j = 0; j < contacts.length; j++) {
          var contact = contacts[j];
          var firstLetter = contact.name[0].toUpperCase();
          if (firstLetter === firstLetter.toLowerCase()) {
            groups['#'].push(contact);
          } else {
            groups[firstLetter].push(contact);
          }
        }
        this.setState({ contacts: groups });
      }
    });
  }

  onSelectContact(contact) {
    var currentlySelected = this.state.selected;
    var contactRemoved = currentlySelected.filter(
      s => s.recordID !== contact.recordID
    );
    if (contactRemoved.length === currentlySelected.length) {
      var selected = currentlySelected;
      selected.push(contact);
    } else {
      var selected = contactRemoved;
    }
    this.setState({ selected: selected });
    this.props.onSelectContact(selected);
  }


  getCellProps() {
    var cellProps = { onSelectContact: c => this.onSelectContact(c) };
    if (this.props.backgroundColor) {
      cellProps.backgroundColor = this.props.backgroundColor;
    }
    if (this.props.textStyle) {
      cellProps.textStyle = this.props.textStyle;
    }
    if (this.props.indicatorColor) {
      cellProps.indicatorColor = this.props.indicatorColor;
    }
    return cellProps;
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <AlphabetListView
          data={this.state.contacts}
          cell={Cell}
          cellProps={this.getCellProps()}
          enableEmptySections={true}
          pageSize={50}
          cellHeight={this.props.cellHeight || 50}
          sectionHeaderHeight={this.props.sectionHeaderHeight || 22.5}/>
      </View>
    );
  }

}

SelectableContactsList.propTypes = {
  onSelectContact: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  indicatorContainer: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cellTextContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  cellText: {
    fontSize: 18,
    color: 'black'
  },
  button: {
    backgroundColor: 'red',
    height: 70,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold'
  }
});

export default SelectableContactsList;
