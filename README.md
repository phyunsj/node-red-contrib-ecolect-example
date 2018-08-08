# Node-RED ecolect example

[`node-red-contrib-ecolect`](https://github.com/DeanCording/node-red-contrib-ecolect) example with React Nest Thermostat + React-Native Chat (websocket). This is the extended version of [Example Ecolect flow for natural language processing.](https://flows.nodered.org/flow/5f9072db63e9cf7a68351adf769f1515) It is **NOT** complete yet but it showed the basic flow.

## In Action

<p align="center">
<img src="https://github.com/phyunsj/node-red-contrib-ecolect-example/blob/master/node-red-ecolect-in-action.gif" width="600px"/>
</p>

## Flow 

<p align="center">
<img src="https://github.com/phyunsj/node-red-contrib-ecolect-example/blob/master/ecolect-thermostat-control.png" width="800px"/>
</p>


## React-Native WebSocket Chat 

Start with [react-native-chat-tutorial](https://github.com/jevakallio/react-native-chat-tutorial). `nest-thermostat-chat\App.js` is the updated version of `https://github.com/jevakallio/react-native-chat-tutorial\App.js`.

## Nest Thermostat Web Page

Start with [React Nest Thermostat](https://github.com/kevinmellott91/react-nest-thermostat). `nest-thermostat-page/index.js` is the updated version of `https://github.com/kevinmellott91/react-nest-thermostat/example/js/index.js`. 

<p align="center">
<img src="https://github.com/phyunsj/node-red-contrib-ecolect-example/blob/master/ecolect-thermostat-nest-page.png" width="800px"/>
</p>

## Consideration 

- Use [state machine node](https://github.com/cflurin/node-red-contrib-dsm) to manage HVAC mode & state. 
- Use MQTT (over WebSocket) instead.
