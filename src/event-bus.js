// src/event-bus.js

class EventBus {
  constructor() {
      if (EventBus.instance) {
          return EventBus.instance;
      }
      this.events = {};
      EventBus.instance = this;
  }

  // Subscribe to an event
  on(event, listener) {
      if (!this.events[event]) {
          this.events[event] = [];
      }
      this.events[event].push(listener);
  }

  // Unsubscribe from an event
  off(event, listenerToRemove) {
      if (!this.events[event]) return;

      this.events[event] = this.events[event].filter(listener => listener !== listenerToRemove);
  }

  // Emit an event
  emit(event, data) {
      if (!this.events[event]) return;

      this.events[event].forEach(listener => listener(data));
  }

  // Static method to register events
  static registerEvent(eventName) {
      if (!EventBus.instance) {
          EventBus.instance = new EventBus();
      }
      if (!EventBus.instance.events[eventName]) {
          EventBus.instance.events[eventName] = [];
      }
  }

  // Static method to subscribe to an event
  static on(event, listener) {
      if (!EventBus.instance) {
          EventBus.instance = new EventBus();
      }
      EventBus.instance.on(event, listener);
  }

  // Static method to unsubscribe from an event
  static off(event, listenerToRemove) {
      if (!EventBus.instance) {
          EventBus.instance = new EventBus();
      }
      EventBus.instance.off(event, listenerToRemove);
  }

  // Static method to emit an event
  static emit(event, data) {
      if (!EventBus.instance) {
          EventBus.instance = new EventBus();
      }
      EventBus.instance.emit(event, data);
  }
}

const eventBus = new EventBus();
export default eventBus;
export { EventBus };
