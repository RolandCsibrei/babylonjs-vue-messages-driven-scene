import Vue from "vue";
import { IMessageBus } from "./BusFactory";

export class VueBus extends Vue implements IMessageBus {
  constructor() {
    super();
  }
}
