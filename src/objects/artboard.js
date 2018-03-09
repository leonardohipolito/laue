import {randomHSL} from '../utils/math'
import {isFn} from '../utils/core'

export default {
  name: 'LaArtboard',

  props: {
    data: {
      type: Array,
      default: () => []
    },

    height: Number,

    width: Number,

    padding: {
      default: 8,
      type: Number
    },

    colors: {}
  },

  computed: {
    vw() {
      return this.width || 300
    },

    vh() {
      return this.height || 75
    },

    canvas() {
      const {vw, vh, padding} = this
      // Todo 加上 axis 等信息
      const x0 = padding
      const y0 = padding
      const width = vw - padding * 2
      const height = vh - padding * 2

      return {x0, y0, width, height}
    }
  },

  data: () => ({
    max: -Infinity,
    min: Infinity
  }),

  provide() {
    return {
      Artboard: this
    }
  },

  methods: {
    getPoints(values) {
      const {x0, y0, width, height} = this.canvas
      const min = Math.floor(Math.min(...values, this.min))
      const max = Math.ceil(Math.max(...values, this.max))
      const yRatio = (max - min) / height
      const xRatio = width / (values.length - 1)

      this.min = Math.min(min, this.min)
      this.max = Math.max(max, this.max)

      return values.map((value, i) => {
        const y = y0 + height - ((value - min) / yRatio || 0)
        const x = x0 + xRatio * i
        return [x, y]
      })
    },

    genColor(index) {
      const {colors = {}} = this

      if (isFn(colors)) {
        return colors(index)
      }

      if (Array.isArray(colors)) {
        return colors[index % colors.length]
      }

      const hsl = randomHSL(index + 1, colors.s, colors.v)
      return `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`
    }
  },

  render(h) {
    const {width, height, vw, vh} = this
    const slots = this.$slots.default

    return h(
      'svg',
      {
        attrs: {
          width,
          height,
          viewBox: `0 0 ${vw} ${vh}`
        }
      },
      slots &&
        slots.map((vnode, i) => {
          vnode.index = i
          return vnode
        })
    )
  }
}
