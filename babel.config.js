module.exports = {
  presets: [
    '@vue/app',
    ["@babel/preset-env", {
      "useBuiltIns": "entry",
      "modules": false
    }]
  ],
  "plugins": [
    [

      "@babel/plugin-transform-runtime", {

        "corejs": false,

        "helpers": false,

        "regenerator": false,

        "useESModules": false

      }

    ]

  ],

  "comments": false
}
