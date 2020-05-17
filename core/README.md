# Keyrier JSON core

## Install

```sh
npm i @keyrier/core
```

```sh
yarn add @keyrier/core
```

```javascript
import { sqlQuery } from '../../core/dist/index.module'

const json = `
[
  {
    "foo": "bar"
  },
  {
    "foo": 42
  }
]
`
const query = 'select * from json where foo = "bar"'

const result = sqlQuery(json, query)

console.log(result)

// prints
// prints [ { foo: 'bar' } ]
```
