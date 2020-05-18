# Keyrier JSON CLI

A tool to perform SQL-like query on JSON objects.

## Install

```sh
npm i -g @keyrier/cli
```

## Run

```sh
keyrier <SQL-like query> <json file>
```

## Examples

```sh
keyrier "select email from json" users.json
```

```sh
keyrier "select firstname, lastname, phoneNumber as phone from json" users.json
```

```sh
keyrier "select name from json where age < 30" users.json --output youngins.json
```

```sh
wget -qO- https://jsonplaceholder.typicode.com/users | keyrier "select name as Nom, address.city as Ville from json"
```

## Options

    --help              display help
    --output, o         output file path (default: stdout)
    --verbose, -v       verbose
    --version           print version
