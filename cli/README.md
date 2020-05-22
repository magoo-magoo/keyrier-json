# Keyrier JSON CLI

A tool to execute SQL queries on JSON or CSV.

## Install

```sh
npm i -g @keyrier/cli
```

## Run

```sh
keyrier <SQL-like query>
```

## Examples

```sh
# basic query
keyrier "select * from users.json"
```

```sh
# For a CSV file
keyrier "select firstname, lastname, phoneNumber as phone from users.csv"
```

```sh
# input is JSON output CSV
keyrier "select name from users.json where age < 30"  --output youngins.csv -t csv
```

```sh
# read from STDIN
wget -qO- https://jsonplaceholder.typicode.com/users | keyrier "select name as Nom, address.city as Ville from stdin"
```

## Options

    --help              display help
    --output, -o        output file path (default: stdout)
    --output-type, -t   output content type: json or csv (default: json)
    --verbose, -v       verbose
    --version           print version
