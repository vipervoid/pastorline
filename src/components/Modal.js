import React from 'react';

let searchIntervalInstance = null;

class Modal extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      data: [],
      // searchIntervalInstance: null,
      filter: {
        keyword: '',
      },
      view: 'list', // list or detail
      selectedData: {}
    }

    this.showList = this.showList.bind(this);
    this.showUS = this.showUS.bind(this);
  }

  static defaultProps = {
    size: 'md',
    data: []
  }

  componentDidUpdate(nextProps) {
    const { data } = this.props;

    if (nextProps.data != data) {
      this.setState({ data: this.props.data });
    }
    
  }

  showDetail(contact) {
    this.setState({ 
      view: 'detail',
      selectedData: contact
    });
  }

  showList() {
    this.setState({ 
      view: 'list',  selectedData: {}
    });
    this.props.showAll();
  }

  showUS() {
    this.setState({ 
      view: 'list',  selectedData: {}
    });
    this.props.showUS();
  }

  applyFilter(e, filter) {
    let targetValue = e.target.value;
    let contacts = JSON.parse(JSON.stringify(this.props.data));

    if (filter.type === 'keyword') {
      
      if (searchIntervalInstance) {
        clearTimeout(searchIntervalInstance);
      }

      let interval = 1500; // 1.5 seconds
      if (e.key == 'Enter') {
        interval = 0;
      }

      searchIntervalInstance = setTimeout(() => {
        contacts = contacts.filter(contact => {
          if (contact.first_name.includes(targetValue) || contact.last_name.includes(targetValue) || contact.phone_number.includes(targetValue)) {
            return true;
          }
          return false;
        });
        this.setState({ data: contacts });
      }, interval);
    }

    if (filter.type === 'country') {
      contacts = contacts.filter(contact => {
        return contact.country_id === filter.country_id;
      });
    }

    if (filter.type === 'only-even') {
      console.log('filter.type', e.target.checked);
      if (e.target.checked) {
        contacts = contacts.filter(contact => {
          return contact.id % 2 == 0;
        });
      }
    } 

    this.setState({ data: contacts });
  }

  render() {
    return (
      <>
      <div key={this.props.id} className={`modal fade`} id={this.props.id} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className={`modal-dialog modal-${this.props.size}`}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">{this.props.title}</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="shadow mb-1">
                <input type="text" className="form-control form-control-sm" 
                  placeholder="Search..."
                  onKeyPress={(e) => this.applyFilter(e, {type: 'keyword'})} />
              </div>
              {((state) => {
                if (state.view == 'list') {
                  return (
                    <ul className="list-group">
                      {state.data.map((contact, idx) => {
                        return (
                          <li className="text-left list-group-item" key={`contact-item-${contact.id}`} >
                            <a href="javascript:void(0)" onClick={() => this.showDetail(contact)}>
                              <strong>({contact.id})</strong> {contact.first_name} {contact.last_name}
                              <div><small className="text-muted"><strong>Phone: {contact.phone_number}</strong></small></div>
                            </a>
                          </li>
                        )
                      })}
                    </ul>
                  )
                } else {
                  return (
                    <>
                      You selected {this.state.selectedData.first_name} {this.state.selectedData.last_name}
                    </>
                  )
                }
              })(this.state)}
              
            </div>
            <div className="modal-footer justify-content-between">
              <div className="custom-control custom-checkbox">
                <input type="checkbox" className="custom-control-input" id={`onlyEvenCheckbox${this.props.id}`} onChange={e => this.applyFilter(e, {type: 'only-even'})} />
                <label className="custom-control-label" htmlFor={`onlyEvenCheckbox${this.props.id}`}>Only even</label>
              </div>
              <div>
                <button type="button" className="btn btn-primary mr-1 bg-color-a" onClick={this.showList}>All Contacts</button>
                <button type="button" className="btn btn-primary mr-1 bg-color-b" onClick={this.showUS}>US Contacts</button>
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
              </div> 
            </div>
          </div>
        </div>
      </div>
      </>
    )
  }
}

export default Modal;