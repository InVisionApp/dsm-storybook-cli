<template>
    <button class="button is-primary" @click="onClick">
        {{prefix}}<slot></slot>
    </button>
</template>

<script>
export default {
  name: 'my-button',

  methods: {
    onClick() {
      this.$emit('click');
    }
  },

  props: {
    /**
     * Basic type check (`null` and `undefined` values will pass any type validation)
     * */
    propA: Number,

    /**
     * Multiple possible types
     * */
    propB: [String, Number],
    // Required string
    propC: {
      type: String,
      required: true
    },
    /**
     * Number with a default value
     * */
    propD: {
      type: Number,
      default: 100
    },
    // Object with a default value
    propE: {
      type: Object,
      // Object or array defaults must be returned from
      // a factory function
      default: function() {
        return { message: 'hello' };
      }
    },
    // Custom validator function
    propF: {
      validator: function(value) {
        // The value must match one of these strings
        return ['success', 'warning', 'danger'].indexOf(value) !== -1;
      }
    }
  }
};
</script>

<style>
button {
  border: 1px solid #eee;
  border-radius: 3px;
  background-color: #ffffff;
  cursor: pointer;
  font-size: 15pt;
  padding: 3px 10px;
  margin: 10px;
}
</style>
