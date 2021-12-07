import { effect, trigger, track } from './effect';

export class ComputedRefImpl {
  private inited = false;
  private needUpdate = false;
  _value = null;

  constructor(private getNewValue) {}
  get value() {
    track(this, 'get', 'value');

    if (!this.inited) {
      effect(() => {
        if (!this.inited) {
          this._value = this.getNewValue();
        } else {
          this.needUpdate = true;
          trigger(this, 'set', 'value', 'v');
        }
      });
      this.inited = true;
    } else {
      if (this.needUpdate) {
        this._value = this.getNewValue();
        this.needUpdate = false;
      }
    }

    return this._value;
  }
}

export function computed(getter) {
  return new ComputedRefImpl(getter);
}
