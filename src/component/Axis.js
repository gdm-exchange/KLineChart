/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 * http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export default class Axis {
  constructor (chartData) {
    this._chartData = chartData
    this._width = 0
    this._height = 0
    this._minValue = 0
    this._maxValue = 0
    this._range = 0
    this._ticks = []
  }

  /**
   * 设置尺寸
   * @param width
   * @param height
   */
  setSize (width, height) {
    this._width = width
    this._height = height
  }

  /**
   * 获取ticks
   * @returns {[]|*[]}
   */
  ticks () {
    return this._ticks
  }

  /**
   * 计算轴
   */
  computeAxis () {
    const { min, max, range } = this._computeMinMaxValue()
    this._minValue = min
    this._maxValue = max
    this._range = range
    this._ticks = this._computeOptimalTicks(this._computeTicks())
  }

  /**
   * 计算最大最小值
   */
  _computeMinMaxValue () {}

  /**
   * 计算最佳的tick
   * @param ticks
   */
  _computeOptimalTicks (ticks) {}

  /**
   * 计算轴上的tick值
   */
  _computeTicks () {
    const ticks = []
    if (this._range >= 0) {
      const interval = +this._nice(this._range / 6.0)
      const precision = this._getIntervalPrecision(interval)
      const first = +this._round(Math.ceil(this._minValue / interval) * interval, precision)
      const last = +this._round(Math.floor(this._maxValue / interval) * interval, precision)
      let n = 0
      let f = first

      if (interval !== 0) {
        while (f <= (+last)) {
          ++n
          f += interval
        }
      }
      f = first
      for (let i = 0; i < n; i++) {
        ticks[i] = { v: f.toFixed(precision) }
        f += interval
      }
    }
    return ticks
  }

  _nice (value) {
    const exponent = Math.floor(Math.log(value) / Math.log(10.0))
    const exp10 = Math.pow(10.0, exponent)
    const f = value / exp10 // 1 <= f < 10
    let nf = 0
    if (f < 1.5) {
      nf = 1
    } else if (f < 2.5) {
      nf = 2
    } else if (f < 4) {
      nf = 3
    } else if (f < 7) {
      nf = 5
    } else {
      nf = 8
    }
    value = nf * exp10
    return exponent >= -20 ? +value.toFixed(exponent < 0 ? -exponent : 0) : value
  }

  _getIntervalPrecision (value) {
    const str = value.toString()

    // Consider scientific notation: '3.4e-12' '3.4e+12'
    const eIndex = str.indexOf('e')
    if (eIndex > 0) {
      const precision = +str.slice(eIndex + 1)
      return precision < 0 ? -precision : 0
    } else {
      const dotIndex = str.indexOf('.')
      return dotIndex < 0 ? 0 : str.length - 1 - dotIndex
    }
  }

  _round (x, precision) {
    if (precision == null) {
      precision = 10
    }
    // Avoid range error
    precision = Math.min(Math.max(0, precision), 20)
    x = (+x).toFixed(precision)
    return x
  }
}
