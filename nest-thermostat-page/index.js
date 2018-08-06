'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const Thermostat = require('../../dist/react-nest-thermostat.js');

class App extends React.Component {
  constructor(props) {
    super(props);

    // Bind to the event handlers.
    this.handleModeChange = this.handleModeChange.bind(this);
    this.handleHvacModeChange = this.handleHvacModeChange.bind(this);
    this.handleLeafChange = this.handleLeafChange.bind(this);

    // away : to all 3 thermostats
    // ambientTemp -> individual
    // targetTemp -> individual
    // hvacMode : to all 3 thermostats
    // leaf : OFF

    // Set the initial state.
    this.state = {
      away: false, // false or true
      ambientTemperature: 74,
      targetTemperature: 68,

      KitchenAmbientTemperature: 74,
      KitchenTargetTemperature: 68,
      LivingAmbientTemperature: 74,
      LivingTargetTemperature: 68,
      BedAmbientTemperature: 74,
      BedTargetTemperature: 68,
      hvacMode: 'off',  //  value : 'off', 'heating', 'cooling'
      leaf: false, // false or true
      error: null
    };
  }

  handleModeChange(event) {
    this.setState({ away: JSON.parse(event.target.value) });
  }

  handleHvacModeChange(event) {
    this.setState({ hvacMode: event.target.value });
  }

  handleLeafChange(event) {
    this.setState({ leaf: JSON.parse(event.target.value) });
  }

  handleSocketMessage( data ) {
    console.log( data );
    // room : living, bed, kitchen
    // away : true or false
    // hvacMode : off, heating, cooling

    // target temperature
    if ( data.room !== undefined && data.targetTemp !== undefined ) {
      switch ( data.room ) {
      case 'living room' :  this.setState({ LivingTargetTemperature: parseFloat(data.targetTemp) }); 
                       break;
      case 'kitchen' : this.setState({ KitchenTargetTemperature: parseFloat(data.targetTemp) }); 
                       break; 
      case 'bedroom' : this.setState({ BedTargetTemperature: parseFloat(data.targetTemp) }); 
                       break;
      }
    }

    if (data.away !== undefined) {
      if( data.away ) this.setState({ away: data.away, hvacMode : 'off' });
      else this.setState({ hvacMode: data.hvacMode, away : false });
    }
  
    if ( data.hvacMode !== undefined )  this.setState({ hvacMode: data.hvacMode });

    // current temperature
    if ( data.temperature !== undefined ) {
      if ( this.state.hvacMode === 'cooling') {
        this.setState({ KitchenAmbientTemperature: parseFloat(data.temperature[0]) });  
        this.setState({ LivingAmbientTemperature: parseFloat(data.temperature[1]) });  
        this.setState({ BedAmbientTemperature: parseFloat(data.temperature[2]) });                  
      }
      if ( this.state.hvacMode === 'heating') {
        this.setState({ KitchenAmbientTemperature: parseFloat(data.temperature[0]) });  
        this.setState({ LivingAmbientTemperature: parseFloat(data.temperature[1]) });  
        this.setState({ BedAmbientTemperature: parseFloat(data.temperature[2]) });  
      }
    }
  }

  componentDidMount() {
    this.ws = new WebSocket('ws://'+ window.location.hostname  +':1880/control/publish')
    this.ws.onmessage = e => this.handleSocketMessage(JSON.parse(e.data) );
    this.ws.onerror = e => this.setState({ error: 'WebSocket error' })
    this.ws.onclose = e => !e.wasClean && this.setState({ error: `WebSocket error: ${e.code} ${e.reason}` })
  }

  componentWillUnmount() {
    this.ws.close()
  }

  render() {
    return (
      <div>
       
        <h1 className="cover-heading space-after">Home Thermostat Dashboard</h1>
        <div className="container-fluid">
          <div className="row">

            <div className="col-md-4">
            <h4 className="cover-heading space-after">Master Bedroom</h4>
            <Thermostat height="200px" width="200px" away={this.state.away}
              ambientTemperature={this.state.BedAmbientTemperature}
              targetTemperature={this.state.BedTargetTemperature}
              hvacMode={this.state.hvacMode} leaf={this.state.leaf}
            />
            </div>
            <div className="col-md-4">
            <h4 className="cover-heading space-after">Living Room</h4>
            <Thermostat height="200px" width="200px" away={this.state.away}
              ambientTemperature={this.state.LivingAmbientTemperature}
              targetTemperature={this.state.LivingTargetTemperature}
              hvacMode={this.state.hvacMode} leaf={this.state.leaf}
            />
            </div>
            <div className="col-md-4">
            <h4 className="cover-heading space-after">Kitchen</h4>
            <Thermostat height="200px" width="200px" away={this.state.away}
              ambientTemperature={this.state.KitchenAmbientTemperature}
              targetTemperature={this.state.KitchenTargetTemperature}
              hvacMode={this.state.hvacMode} leaf={this.state.leaf}
            />
            </div>
          </div>
        </div>
        
      </div>
    );
  }
}

App.propTypes = {
  /* Lowest temperature able to be displayed on the thermostat */
  minTemperature: React.PropTypes.number,
  /* Highest temperature able to be displayed on the thermostat */
  maxTemperature: React.PropTypes.number,
};

App.defaultProps = {
  minTemperature: 50,
  maxTemperature: 90,
};

// Render the application in the reserved placeholder element.
ReactDOM.render(
  <App />,
  document.getElementById('app')
);
