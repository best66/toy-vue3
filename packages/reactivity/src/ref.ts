import { hasChanged, isObject } from '@toy-vue/shared';
import { track, trigger } from './effect';
import { reactive } from './reactive';

export function ref(value) {
  return createRef(value, false);
}
export function shallowRef(value) {
  return createRef(value, true);
}

function createRef(value, shallow: boolean = false) {
  return new RefImpl(value, shallow);
}

const convert = (v) => (isObject(v) ? reactive(v) : v);
class RefImpl {
  public __v_isRef = true;
  private _value;
  private rawValue;
  constructor(value, public shallow) {
    this.rawValue = value;
    this._value = shallow ? value : convert(value);
  }
  get value() {
    track(this, 'get', 'value');
    return this._value;
  }
  set value(newValue) {
    if (hasChanged(newValue, this.rawValue)) {
      this.rawValue = newValue;
      this._value = this.shallow ? newValue : convert(newValue);

      trigger(this, 'set', 'value', newValue);
    }
  }
}
