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

import Chart from './Chart'
import { DEV } from './utils/env'

const instances = {}
let idBase = 1

const errorMessage = 'Chart version is __BUILD_VERSION__. Root dom is null, can not initialize the chart!!!'

/**
 * 获取版本号
 * @returns {string}
 */
function version () {
  return '__BUILD_VERSION__'
}

/**
 * 初始化
 * @param ds
 * @param style
 * @returns {Chart}
 */
function init (ds, style = {}) {
  let container = ds
  if (!container) {
    throw new Error(errorMessage)
  }
  if (typeof container === 'string') {
    container = document.getElementById(ds) || document.getElementsByClassName(ds)
  }
  if (!container) {
    throw new Error(errorMessage)
  }
  const instance = instances[container.chart_id || '']
  if (instance) {
    if (DEV) {
      console.warn('The chart has been initialized on the dom！！！')
    }
    return instance
  }
  const id = `k_line_chart_${idBase++}`
  const chart = new Chart(container, style)
  chart.id = id
  container.chart_id = id
  instances[id] = chart
  return chart
}

/**
 * 销毁
 * @param dcs
 */
function dispose (dcs) {
  if (dcs) {
    let id
    if (typeof dcs === 'string') {
      dcs = document.getElementById(dcs) || document.getElementsByClassName(dcs)
      id = dcs.chart_id
    }
    if (!id) {
      id = dcs.chart_id
    }
    if (!id && dcs instanceof Chart) {
      id = dcs.id
    }
    if (id) {
      instances[id].destroy()
      delete instances[id]
    }
  }
}

export { version, init, dispose }
