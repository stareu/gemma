import EventEmitter from "eventemitter3"

const WindowResize = new EventEmitter()

export class Events {}

Events.WindowResize = WindowResize