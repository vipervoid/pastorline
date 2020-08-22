import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import * as serviceWorker from './serviceWorker';
import axios from 'axios';
import Modal from './components/Modal';

// Styles
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import './index.css';

const authToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxNzEiLCJleHAiOjE2MDM3ODM0Mzd9.3ievseHtX0t3roGh7nBuNsiaQeSjfiHWyyx_5GlOLXk';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      contacts: [],
      contacts_ids: [],
      total: 0,
      filter: {
        keyword: '',
        showOnlyEven: false,
        countryId: null
      },
      baseContacts: [] // a copy of the contacts list
    }

    this.showAll = this.showAll.bind(this);
    this.showUS = this.showUS.bind(this);
  }

  componentDidMount() {
    // Load the basic jquery library so that it would be easier to maintain and because of the documentation
    import("jquery").then($ => {
      // jQuery must be installed to the `window`:
      window.$ = window.jQuery = $;
      return import("bootstrap");
    });

    // this.showContactsFromUSCountry();
    this.getContacts();
  }

  showModal(id) {
    $(`#${id}`).modal('show');
    $(`#${id}`).on('shown.bs.modal', () => {
      window.history.pushState({}, `Opened Modal ${id}`, `/${id}`);
    })

    $(`#${id}`).on('hidden.bs.modal', () => {
      window.history.pushState({}, `Closed Modal ${id}`, `/`);
    });
  }

  hideModal(id) {
    $(`#${id}`).modal('hide');
  }

  showAll() {
    const modalId = 'modal-a';
    this.showModal(modalId);
    this.hideModal('modal-b');
  }

  showUS() {
    const modalId = 'modal-b';
    this.showModal(modalId);
    this.hideModal('modal-a');
  }

  getContacts() {
    // 'https://api.dev.pastorsline.com/api/contacts.json'
    axios.get('/contacts.json', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      }
    })
    .then(({ data }) => {
      let contacts = Object.values(data.contacts);
      this.setState({ 
        contacts: contacts, // Convert this to array to make it easier to filter 
        contacts_ids: data.contacts_ids,
        total: data.total,
        baseContacts: contacts // This will be used to reset data when doing a filter
      });
    });
  }

  render() {
    return (
      <>
        <Modal
          title="Modal A" 
          id="modal-a" 
          size="lg" 
          showAll={this.showAll}
          showUS={this.showUS}
          data={this.state.contacts} 
          />

        <Modal
          key="12" 
          title="Modal B" 
          id="modal-b" 
          showAll={this.showAll}
          showUS={this.showUS}
          data={this.state.contacts.filter(contact => contact.country_id === 226)} />

        <Modal
          key="123" 
          title="Modal C" 
          id="modal-c" 
          showAll={this.showAll}
          showUS={this.showUS} />

        <div className="App d-flex justify-content-center align-items-center">
          <div>
            <button className="btn btn-light text-light btn-lg bg-color-a mr-2" onClick={() => this.showModal('modal-a')}>A</button>
            <button className="btn btn-light text-light btn-lg  bg-color-b" onClick={() => this.showModal('modal-b')}>B</button>
          </div>
        </div>
      </>
    );
  }
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
